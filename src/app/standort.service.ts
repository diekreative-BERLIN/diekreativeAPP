import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { CapacitorHttp } from '@capacitor/core';
import { environment } from 'src/environments/environment';

export type StandortId = 'schivelbeiner' | 'hohenneuendorf';

interface Standort {
  name: string;
  lat: number;
  lon: number;
  /** Erlaubter Umkreis in Metern */
  radius: number;
}

/** Feste Standorte der Türöffner (keine Geheimnisse, daher im Repo). */
export const STANDORTE: Record<StandortId, Standort> = {
  schivelbeiner: {
    name: 'Schivelbeiner Str. 7',
    lat: 52.5509686,
    lon: 13.4117623,
    radius: 150
  },
  hohenneuendorf: {
    name: 'Hohen Neuendorf',
    // 52°40'29.3"N 13°16'38.6"E
    lat: 52.6748056,
    lon: 13.2773889,
    radius: 200
  }
};

/** Ungenaue Positionen (z. B. nur Funkzelle) werden höchstens bis zu diesem Wert toleriert. */
const MAX_ACCURACY_TOLERANCE = 100;

interface GemerktePosition {
  lat: number;
  lon: number;
  accuracy: number;
  zeit: number;
}

export interface StandortErgebnis {
  erlaubt: boolean;
  /** Kurzer Hinweis für den Nutzer, falls nicht erlaubt */
  grund?: string;
}

/**
 * Nach einer erfolgreichen Prüfung gilt der Standort so lange als bestätigt.
 * So kann z. B. nach der Außentür direkt die Innentür geöffnet werden.
 */
const BESTAETIGUNG_GUELTIG_MS = 2 * 60 * 1000;

@Injectable({
  providedIn: 'root'
})
export class StandortService {

  constructor(private translate: TranslateService) {}

  /** Zeitpunkt der letzten erfolgreichen Prüfung je Standort */
  private letzteBestaetigung: Partial<Record<StandortId, number>> = {};

  /** Letzte GPS-Ortung (standortübergreifend), gilt ebenfalls 2 Minuten */
  private letztePosition?: GemerktePosition;

  /**
   * Prüft den Standort und merkt sich einen Erfolg für 2 Minuten.
   * Fehlschläge werden nicht gemerkt, damit ein neuer Versuch sofort neu prüft.
   */
  async istAmStandort(id: StandortId): Promise<StandortErgebnis> {
    if (this.istKuerzlichBestaetigt(id)) {
      return { erlaubt: true };
    }
    const ergebnis = await this.pruefeStandort(id);
    if (ergebnis.erlaubt) {
      this.letzteBestaetigung[id] = Date.now();
    } else {
      delete this.letzteBestaetigung[id];
    }
    return ergebnis;
  }

  /** true, wenn der Standort in den letzten 2 Minuten bestätigt wurde (ohne neue Ortung). */
  istKuerzlichBestaetigt(id: StandortId): boolean {
    const zuletzt = this.letzteBestaetigung[id];
    return !!zuletzt && Date.now() - zuletzt < BESTAETIGUNG_GUELTIG_MS;
  }

  /**
   * Prüft, ob sich das Gerät am angegebenen Standort befindet.
   * 1. Liegt eine Ortung aus den letzten 2 Minuten vor (egal für welchen Button)
   *    und passt sie zu diesem Standort? Dann sofort erlaubt.
   * 2. Für die Schivelbeiner Str.: Ist das Gerät im WLAN vor Ort (erkannt an der
   *    öffentlichen IP-Adresse des Anschlusses)? Funktioniert ohne GPS.
   * 3. Sonst: neue GPS-Ortung mit Umkreisprüfung.
   * Eine gemerkte Position, die NICHT passt, führt nie zur Ablehnung, sondern
   * immer zu einer neuen Ortung – man könnte ja inzwischen angekommen sein.
   */
  private async pruefeStandort(id: StandortId): Promise<StandortErgebnis> {
    const standort = STANDORTE[id];

    const gemerkt = this.letztePosition;
    if (gemerkt && Date.now() - gemerkt.zeit < BESTAETIGUNG_GUELTIG_MS
        && this.istImUmkreis(standort, gemerkt)) {
      return { erlaubt: true };
    }

    if (id === 'schivelbeiner' && await this.istImStandortNetz()) {
      return { erlaubt: true };
    }

    let position: GemerktePosition;
    try {
      const perm = await Geolocation.checkPermissions();
      if (perm.location !== 'granted' && perm.coarseLocation !== 'granted') {
        const req = await Geolocation.requestPermissions();
        if (req.location !== 'granted' && req.coarseLocation !== 'granted') {
          return { erlaubt: false, grund: this.hinweisOhneOrtung(id) };
        }
      }
      const fix = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000
      });
      position = {
        lat: fix.coords.latitude,
        lon: fix.coords.longitude,
        accuracy: fix.coords.accuracy || 0,
        zeit: Date.now()
      };
      this.letztePosition = position;
    } catch (err) {
      console.log('Standort konnte nicht ermittelt werden ' + JSON.stringify(err));
      return { erlaubt: false, grund: this.hinweisOhneOrtung(id) };
    }

    if (this.istImUmkreis(standort, position)) {
      return { erlaubt: true };
    }
    const distanz = this.distanzInMetern(position.lat, position.lon, standort.lat, standort.lon);
    return {
      erlaubt: false,
      grund: this.translate.instant('DOOR.TOO_FAR', { distanz: this.formatDistanz(distanz), ort: standort.name })
    };
  }

  private istImUmkreis(standort: Standort, pos: GemerktePosition): boolean {
    const distanz = this.distanzInMetern(pos.lat, pos.lon, standort.lat, standort.lon);
    const toleranz = Math.min(pos.accuracy, MAX_ACCURACY_TOLERANCE);
    return distanz <= standort.radius + toleranz;
  }

  /**
   * WLAN-Erkennung über die öffentliche IP: Wer mit "diekreative Guest" verbunden ist,
   * geht über den Internetanschluss in der Schivelbeiner Str. ins Netz.
   * Da der Anschluss eine dynamische IP hat, wird die aktuelle IP über einen
   * DynDNS-Namen ermittelt (environment.standortHostSchivelbeiner, z. B. MyFRITZ-Adresse).
   * Optional zusätzlich feste IPs in environment.standortIPsSchivelbeiner.
   */
  private async istImStandortNetz(): Promise<boolean> {
    const env = environment as any;
    const host: string = env.standortHostSchivelbeiner || '';
    const festeIPs: string[] = env.standortIPsSchivelbeiner || [];
    if (!host && festeIPs.length === 0) {
      return false;
    }
    try {
      const [eigeneIP, hostIPs] = await Promise.all([
        this.eigeneOeffentlicheIP(),
        host ? this.resolveHost(host) : Promise.resolve([] as string[])
      ]);
      return !!eigeneIP && [...festeIPs, ...hostIPs].includes(eigeneIP);
    } catch (err) {
      console.log('WLAN-Standortprüfung fehlgeschlagen ' + JSON.stringify(err));
      return false;
    }
  }

  private async eigeneOeffentlicheIP(): Promise<string | undefined> {
    const res = await CapacitorHttp.get({
      url: 'https://api.ipify.org?format=json',
      connectTimeout: 5000,
      readTimeout: 5000
    });
    const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
    return data?.ip;
  }

  /** Löst den DynDNS-Namen per DNS-over-HTTPS auf (A-Records, ohne Cache-Probleme des Geräts). */
  private async resolveHost(host: string): Promise<string[]> {
    const res = await CapacitorHttp.get({
      url: 'https://dns.google/resolve',
      params: { name: host, type: 'A' },
      connectTimeout: 5000,
      readTimeout: 5000
    });
    const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
    return (data?.Answer || [])
      .filter((a: any) => a.type === 1)
      .map((a: any) => a.data);
  }

  private hinweisOhneOrtung(id: StandortId): string {
    const basis = this.translate.instant('DOOR.NO_LOCATION');
    return id === 'schivelbeiner'
      ? basis + ' ' + this.translate.instant('DOOR.NO_LOCATION_WIFI')
      : basis;
  }

  /** Haversine-Distanz in Metern */
  private distanzInMetern(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000;
    const rad = (d: number) => d * Math.PI / 180;
    const dLat = rad(lat2 - lat1);
    const dLon = rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  private formatDistanz(m: number): string {
    return m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(1).replace('.', this.translate.currentLang === 'de' ? ',' : '.')} km`;
  }
}
