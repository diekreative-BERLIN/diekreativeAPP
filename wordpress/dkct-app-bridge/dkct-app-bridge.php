<?php
/**
 * Plugin Name:       dkCT App-Bridge
 * Description:       Automatischer Login in die Kursplattform aus der diekreative-App. Die App übergibt ihren ChurchTools-Logintoken, das Plugin prüft ihn bei ChurchTools und meldet den passenden WordPress-Nutzer an. Setzt das Plugin "dkWP-OpenID Connect Client" voraus.
 * Version:           1.0.0
 * Requires PHP:      7.4
 * Author:            diekreative
 * License:           GPLv2 or later
 *
 * Ablauf:
 * 1. App -> POST /wp-json/dkct-app/v1/ticket  { "token": "<ChurchTools-Logintoken>" }
 *    Das Plugin fragt ChurchTools (GET /api/whoami, Header "Authorization: Login <token>"),
 *    sucht den WordPress-Nutzer über die ChurchTools-ID (wie das OAuth-Plugin) bzw. legt ihn an
 *    und gibt ein Einmal-Ticket (60 Sekunden gültig) samt Login-URL zurück.
 * 2. App öffnet die Login-URL (…/?dkct_app_login=<ticket>) in einer WebView.
 *    Das Plugin löst das Ticket ein, setzt das WordPress-Login-Cookie und leitet weiter.
 *
 * Konfiguration (optional, in wp-config.php):
 *   define( 'DKCT_APP_BRIDGE_CT_URL', 'https://diekreative.church.tools' );
 *   define( 'DKCT_APP_BRIDGE_DEFAULT_REDIRECT', '/' );
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class DKCT_App_Bridge {

	const TICKET_TTL        = 60;   // Sekunden
	const RATE_LIMIT        = 20;   // Ticket-Anfragen pro IP …
	const RATE_WINDOW       = 300;  // … in diesem Zeitraum (Sekunden)
	const TICKET_PREFIX     = 'dkct_app_ticket_';
	const RATE_PREFIX       = 'dkct_app_rate_';
	const QUERY_VAR         = 'dkct_app_login';
	const IDENTITY_META_KEY = 'openid-connect-generic-subject-identity';

	public static function init() {
		add_action( 'rest_api_init', array( __CLASS__, 'register_routes' ) );
		// Früh, aber nach dem Laden der Plugins, damit das OAuth-Plugin bereitsteht.
		add_action( 'init', array( __CLASS__, 'maybe_consume_ticket' ), 1 );
	}

	/* ─── Einstellungen ─────────────────────────────────────────────────────── */

	private static function ct_url() {
		$url = defined( 'DKCT_APP_BRIDGE_CT_URL' ) ? DKCT_APP_BRIDGE_CT_URL : 'https://diekreative.church.tools';
		return untrailingslashit( apply_filters( 'dkct-app-bridge-ct-url', $url ) );
	}

	private static function default_redirect() {
		$path = defined( 'DKCT_APP_BRIDGE_DEFAULT_REDIRECT' ) ? DKCT_APP_BRIDGE_DEFAULT_REDIRECT : '/';
		return home_url( apply_filters( 'dkct-app-bridge-default-redirect', $path ) );
	}

	/* ─── Schritt 1: Ticket ausstellen ──────────────────────────────────────── */

	public static function register_routes() {
		register_rest_route(
			'dkct-app/v1',
			'/ticket',
			array(
				'methods'             => 'POST',
				'callback'            => array( __CLASS__, 'issue_ticket' ),
				'permission_callback' => '__return_true',
				'args'                => array(
					'token'    => array(
						'type'     => 'string',
						'required' => true,
					),
					'redirect' => array(
						'type'     => 'string',
						'required' => false,
					),
				),
			)
		);
	}

	public static function issue_ticket( WP_REST_Request $request ) {
		if ( self::rate_limited() ) {
			return self::error( 'rate_limited', 'Zu viele Anfragen. Bitte versuche es gleich noch einmal.', 429 );
		}

		$token = trim( (string) $request->get_param( 'token' ) );
		if ( '' === $token || strlen( $token ) > 512 ) {
			return self::error( 'invalid_token', 'Kein gültiger Logintoken übergeben.', 400 );
		}

		$person = self::fetch_ct_person( $token );
		if ( is_wp_error( $person ) ) {
			return $person;
		}

		$user = self::find_or_create_user( $person );
		if ( is_wp_error( $user ) ) {
			return $user;
		}

		if ( self::is_privileged( $user ) ) {
			return self::error(
				'privileged_user',
				'Dieses Konto hat Admin- bzw. Redakteursrechte. Bitte melde dich direkt auf der Kursplattform an.',
				403
			);
		}

		$ticket = bin2hex( random_bytes( 32 ) );
		set_transient(
			self::TICKET_PREFIX . hash( 'sha256', $ticket ),
			array(
				'user_id'  => (int) $user->ID,
				'redirect' => self::safe_redirect( (string) $request->get_param( 'redirect' ) ),
			),
			self::TICKET_TTL
		);

		$response = new WP_REST_Response(
			array(
				'ticket'     => $ticket,
				'login_url'  => add_query_arg( self::QUERY_VAR, $ticket, home_url( '/' ) ),
				'expires_in' => self::TICKET_TTL,
			),
			200
		);
		$response->header( 'Cache-Control', 'no-store' );
		return $response;
	}

	/**
	 * Prüft den Logintoken bei ChurchTools und liefert die Personendaten.
	 */
	private static function fetch_ct_person( $token ) {
		$result = wp_remote_get(
			self::ct_url() . '/api/whoami',
			array(
				'timeout'     => 10,
				'redirection' => 0,
				'headers'     => array(
					'Authorization' => 'Login ' . $token,
					'Accept'        => 'application/json',
				),
			)
		);

		if ( is_wp_error( $result ) ) {
			return self::error( 'ct_unreachable', 'ChurchTools ist gerade nicht erreichbar.', 502 );
		}

		$code = (int) wp_remote_retrieve_response_code( $result );
		$body = json_decode( wp_remote_retrieve_body( $result ), true );

		if ( 401 === $code || 403 === $code ) {
			return self::error( 'ct_token_rejected', 'Der ChurchTools-Login ist abgelaufen. Bitte melde dich in der App neu an.', 401 );
		}
		if ( 200 !== $code || ! is_array( $body ) || empty( $body['data'] ) || ! is_array( $body['data'] ) ) {
			return self::error( 'ct_bad_response', 'Unerwartete Antwort von ChurchTools.', 502 );
		}

		$person = $body['data'];
		// Anonyme bzw. öffentliche Benutzer haben keine positive ID.
		if ( empty( $person['id'] ) || (int) $person['id'] <= 0 ) {
			return self::error( 'ct_token_rejected', 'Der ChurchTools-Login ist abgelaufen. Bitte melde dich in der App neu an.', 401 );
		}

		return $person;
	}

	/**
	 * Sucht den Nutzer so, wie das OAuth-Plugin ihn speichert (ChurchTools-ID als
	 * Subject Identity). Fehlt er, wird er über das OAuth-Plugin angelegt, damit
	 * Benutzername, Spitzname und Verknüpfungsregeln identisch bleiben.
	 */
	private static function find_or_create_user( array $person ) {
		if ( ! class_exists( 'OpenID_Connect_Generic' ) ) {
			return self::error( 'oidc_missing', 'Das Plugin "dkWP-OpenID Connect Client" ist nicht aktiv.', 500 );
		}
		$oidc    = OpenID_Connect_Generic::instance();
		$wrapper = isset( $oidc->client_wrapper ) ? $oidc->client_wrapper : null;
		if ( ! $wrapper ) {
			return self::error( 'oidc_missing', 'Das Plugin "dkWP-OpenID Connect Client" ist nicht bereit.', 500 );
		}

		$claim = self::person_to_claim( $person );

		// Gleiche Reihenfolge wie get_oauth2_subject_identity() im OAuth-Plugin.
		$identity       = null;
		$settings       = get_option( 'openid_connect_generic_settings', array() );
		$configured     = ( is_array( $settings ) && isset( $settings['identity_key'] ) ) ? trim( (string) $settings['identity_key'] ) : '';
		$candidate_keys = array_unique( array_filter( array( $configured, 'id', 'userId', 'personId', 'sub' ) ) );
		foreach ( $candidate_keys as $key ) {
			if ( array_key_exists( $key, $claim ) && '' !== (string) $claim[ $key ] ) {
				$identity = (string) $claim[ $key ];
				break;
			}
		}
		if ( null === $identity ) {
			return self::error( 'no_identity', 'ChurchTools hat keine Personen-ID geliefert.', 502 );
		}

		$user = $wrapper->get_user_by_identity( $identity );
		if ( ! $user ) {
			$user = $wrapper->create_new_user( $identity, $claim );
			if ( is_wp_error( $user ) ) {
				return self::error(
					'user_not_available',
					'Für dein ChurchTools-Konto gibt es noch kein Konto auf der Kursplattform. Bitte melde dich einmal über "Anmeldung über diekreative Churchtools Konto" an.',
					403
				);
			}
		}

		$user = apply_filters( 'dkct-app-bridge-user', $user, $person );
		if ( ! $user instanceof WP_User ) {
			return self::error( 'user_not_available', 'Kein passendes Konto auf der Kursplattform gefunden.', 403 );
		}
		return $user;
	}

	/**
	 * Bringt die whoami-Antwort in die Form, die das OAuth-Plugin vom Userinfo-Endpunkt kennt.
	 */
	private static function person_to_claim( array $person ) {
		$claim = $person;
		if ( empty( $claim['sub'] ) ) {
			$claim['sub'] = (string) $person['id'];
		}
		if ( ! isset( $claim['given_name'] ) && isset( $person['firstName'] ) ) {
			$claim['given_name'] = $person['firstName'];
		}
		if ( ! isset( $claim['family_name'] ) && isset( $person['lastName'] ) ) {
			$claim['family_name'] = $person['lastName'];
		}
		if ( ! isset( $claim['preferred_username'] ) && ! empty( $person['cmsUserId'] ) ) {
			$claim['preferred_username'] = $person['cmsUserId'];
		}
		if ( ! isset( $claim['name'] ) && isset( $person['firstName'], $person['lastName'] ) ) {
			$claim['name'] = trim( $person['firstName'] . ' ' . $person['lastName'] );
		}
		return $claim;
	}

	/* ─── Schritt 2: Ticket einlösen ────────────────────────────────────────── */

	public static function maybe_consume_ticket() {
		if ( empty( $_GET[ self::QUERY_VAR ] ) ) { // phpcs:ignore WordPress.Security.NonceVerification
			return;
		}

		$ticket = sanitize_text_field( wp_unslash( $_GET[ self::QUERY_VAR ] ) ); // phpcs:ignore WordPress.Security.NonceVerification
		nocache_headers();

		if ( ! preg_match( '/^[a-f0-9]{64}$/', $ticket ) ) {
			self::fail_redirect();
		}

		$key  = self::TICKET_PREFIX . hash( 'sha256', $ticket );
		$data = get_transient( $key );
		// Sofort löschen: Das Ticket gilt genau einmal.
		delete_transient( $key );

		if ( ! is_array( $data ) || empty( $data['user_id'] ) ) {
			self::fail_redirect();
		}

		$user = get_user_by( 'id', (int) $data['user_id'] );
		if ( ! $user || self::is_privileged( $user ) ) {
			self::fail_redirect();
		}

		// Eine evtl. bestehende Sitzung (z. B. ein anderer Nutzer) beenden.
		wp_clear_auth_cookie();
		wp_set_current_user( $user->ID );
		wp_set_auth_cookie( $user->ID, true, is_ssl() );
		do_action( 'wp_login', $user->user_login, $user );
		do_action( 'dkct-app-bridge-user-logged-in', $user );

		wp_safe_redirect( ! empty( $data['redirect'] ) ? $data['redirect'] : self::default_redirect() );
		exit;
	}

	private static function fail_redirect() {
		wp_safe_redirect( add_query_arg( 'dkct_app_login_failed', '1', wp_login_url() ) );
		exit;
	}

	/* ─── Hilfsfunktionen ───────────────────────────────────────────────────── */

	/**
	 * Admin- und Redakteurskonten werden nie über die App angemeldet.
	 */
	private static function is_privileged( WP_User $user ) {
		$privileged = user_can( $user, 'manage_options' ) || user_can( $user, 'edit_others_posts' );
		return (bool) apply_filters( 'dkct-app-bridge-is-privileged-user', $privileged, $user );
	}

	/**
	 * Nur Ziele auf der Kursplattform selbst zulassen.
	 */
	private static function safe_redirect( $redirect ) {
		if ( '' === $redirect ) {
			return '';
		}
		if ( 0 === strpos( $redirect, '/' ) && 0 !== strpos( $redirect, '//' ) ) {
			$redirect = home_url( $redirect );
		}
		$home_host = wp_parse_url( home_url(), PHP_URL_HOST );
		$host      = wp_parse_url( $redirect, PHP_URL_HOST );
		return ( $host && strtolower( $host ) === strtolower( $home_host ) ) ? esc_url_raw( $redirect ) : '';
	}

	private static function rate_limited() {
		$ip  = isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : 'unknown';
		$key = self::RATE_PREFIX . md5( $ip );
		$hit = (int) get_transient( $key );
		if ( $hit >= self::RATE_LIMIT ) {
			return true;
		}
		set_transient( $key, $hit + 1, self::RATE_WINDOW );
		return false;
	}

	private static function error( $code, $message, $status ) {
		return new WP_Error( 'dkct_app_' . $code, $message, array( 'status' => $status ) );
	}
}

DKCT_App_Bridge::init();
