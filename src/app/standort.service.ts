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

  /** Zeitpunkt der letzten erfolgreichen Prüfung je Standort */
  private letzteBestaetigung: Partial<Record<StandortId, number>> = {};

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
   * Prüft (ohne Zwischenspeicher), ob sich das Gerät am angegebenen Standort befindet.
   * 1. Für die Schivelbeiner Str.: Ist das Gerät im WLAN vor Ort (erkannt an der
   *    öffentlichen IP-Adresse des Anschlusses)? Funktioniert ohne GPS.
   * 2. Sonst: GPS/Ortung mit Umkreisprüfung.
   */
  private async pruefeStandort(id: StandortId): Promise<StandortErgebnis> {
    const standort = STANDORTE[id];

    if (id === 'schivelbeiner' && await this.istImStandortNetz()) {
      return { erlaubt: true };
    }

    let position;
    try {
      const perm = await Geolocation.checkPermissions();
      if (perm.location !== 'granted' && perm.coarseLocation !== 'granted') {
        const req = await Geolocation.requestPermissions();
        if (req.location !== 'granted' && req.coarseLocation !== 'granted') {
          return { erlaubt: false, grund: this.hinweisOhneOrtung(id) };
        }
      }
      position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000
      });
    } catch (err) {
      console.log('Standort konnte nicht ermittelt werden ' + JSON.stringify(err));
      return { erlaubt: false, grund: this.hinweisOhneOrtung(id) };
    }

    const distanz = this.distanzInMetern(
      position.coords.latitude, position.coords.longitude,
      standort.lat, standort.lon
    );
    const toleranz = Math.min(position.coords.accuracy || 0, MAX_ACCURACY_TOLERANCE);

    if (distanz <= standort.radius + toleranz) {
      return { erlaubt: true };
    }
    return {
      erlaubt: false,
      grund: `Du bist ca. ${this.formatDistanz(distanz)} von ${standort.name} entfernt. ` +
             `Die Tür kann nur direkt vor Ort geöffnet werden.`
    };
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
    const basis = 'Dein Standort konnte nicht ermittelt werden. Bitte erlaube der App den Zugriff auf deinen Standort und schalte die Ortung ein.';
    return id === 'schivelbeiner'
      ? basis + ' Alternativ: Verbinde dich mit dem WLAN "diekreative Guest".'
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
    return m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(1).replace('.', ',')} km`;
  }
}
