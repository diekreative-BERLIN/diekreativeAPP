import { Injectable } from '@angular/core';
import { CapacitorHttp } from '@capacitor/core';
import { AndroidViewStyle, DefaultSystemBrowserOptions, InAppBrowser } from '@capacitor/inappbrowser';
import { AlertController, LoadingController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { UserstateService } from '../userstate.service';

/**
 * Öffnet die Kursplattform (WordPress/LearnDash) im System-Browser der App (Safari-Ansicht bzw. Custom Tabs).
 *
 * Ist der Nutzer in der App eingeloggt, holt die App mit ihrem ChurchTools-Logintoken
 * beim Plugin "dkCT App-Bridge" ein Einmal-Ticket und öffnet damit die Kursplattform.
 * Der Nutzer ist dort dann automatisch angemeldet. Der Token selbst steht nie in einer URL.
 *
 * Ohne App-Login wird die Kursplattform ohne automatische Anmeldung geöffnet.
 */
@Injectable({
  providedIn: 'root'
})
export class KursplattformService {

  private readonly baseUrl = environment.kursplattformurl.replace(/\/+$/, '');

  constructor(
    private userState: UserstateService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
  ) {}

  public async open(): Promise<void> {
    if (!this.userState.loggedin || !this.userState.logintoken) {
      await this.openBrowser(this.baseUrl + '/');
      return;
    }

    const loading = await this.loadingCtrl.create({ message: 'Anmeldung bei der Kursplattform …' });
    await loading.present();

    let loginUrl: string | null = null;
    let errorMessage: string | null = null;

    try {
      const res = await CapacitorHttp.post({
        url: this.baseUrl + '/wp-json/dkct-app/v1/ticket',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        // Nach der automatischen Anmeldung direkt auf "Mein Profil" landen.
        data: { token: this.userState.logintoken, redirect: '/mein-profil/' },
      });
      const data = typeof res.data === 'string' ? this.parseJson(res.data) : res.data;

      if (res.status === 200 && data?.login_url && this.isOwnUrl(data.login_url)) {
        loginUrl = data.login_url;
      } else {
        errorMessage = data?.message || 'Die automatische Anmeldung hat nicht geklappt.';
      }
    } catch (err) {
      console.log('Kursplattform: Ticket-Anfrage fehlgeschlagen', err);
      errorMessage = 'Die Kursplattform ist gerade nicht erreichbar.';
    } finally {
      await loading.dismiss();
    }

    if (loginUrl) {
      await this.openBrowser(loginUrl);
      return;
    }

    const alert = await this.alertCtrl.create({
      header: 'Kursplattform',
      message: errorMessage + ' Du kannst dich auf der Kursplattform aber auch selbst anmelden.',
      buttons: [
        { text: 'Abbrechen', role: 'cancel' },
        { text: 'Trotzdem öffnen', handler: () => { this.openBrowser(this.baseUrl + '/'); } },
      ],
    });
    await alert.present();
  }

  /**
   * Öffnet die Seite im System-Browser der App: SFSafariViewController auf iOS,
   * Custom Tabs auf Android. Dort laufen eingebettete Videos (Vimeo) wie im normalen
   * Browser, die Seite lässt sich in Safari bzw. Chrome weiteröffnen, und die Cookies
   * der Kursplattform bleiben zwischen zwei Aufrufen erhalten.
   */
  private async openBrowser(url: string): Promise<void> {
    await InAppBrowser.openInSystemBrowser({
      url,
      options: {
        ...DefaultSystemBrowserOptions,
        android: {
          ...DefaultSystemBrowserOptions.android,
          viewStyle: AndroidViewStyle.FULL_SCREEN,
          showTitle: true,
        },
      },
    });
  }

  /** Nur Login-URLs der eigenen Kursplattform öffnen. */
  private isOwnUrl(url: string): boolean {
    try {
      return new URL(url).host === new URL(this.baseUrl).host;
    } catch {
      return false;
    }
  }

  private parseJson(text: string): any {
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  }
}
