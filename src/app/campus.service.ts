import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';
import { CapacitorHttp } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

/** Angaben für die Anfahrt-Seite (Block "Gottesdienst"). */
export interface CampusAnfahrt {
  /** Name des Ortes, z. B. "Jugendhaus Trinity" */
  ort: string;
  adresszeilen: string[];
  /** Übersetzungsschlüssel für die Gottesdienstzeit */
  zeitKey: string;
  /** Kartenausschnitt mit markiertem Standort (assets) */
  bild: string;
  mapsUrl: string;
}

/** Ein Standort (Campus) der Gemeinde. Die ID entspricht der Campus-ID in ChurchTools. */
export interface Campus {
  id: number;
  name: string;
  /** Ansicht im Kalender-Plugin dkEvents (URL-Parameter campus= auf der Termin-Seite) */
  termineAnsicht: string;
  /** ChurchTools-Kalender mit den Gottesdiensten dieses Standorts (Seite "Gottesdienste") */
  godiKalenderId: number;
  /** null = feste Angaben auf der Anfahrt-Seite (Motorwerk) verwenden */
  anfahrt: CampusAnfahrt | null;
}

/** ChurchTools-Campus-ID des Hauptstandorts "diekreative Berlin". */
export const HAUPT_CAMPUS_ID = 1;

/**
 * ChurchTools-Campus-ID "unbekannt/andere": wird nicht zur Auswahl angeboten,
 * Personen mit diesem Standort bekommen beim Login "diekreative Berlin".
 */
const UNBEKANNT_CAMPUS_ID = 0;

/**
 * Feste Standortliste. Statisch, damit die Auswahl auch ohne Login funktioniert
 * (/api/campuses und die Standortprofile sind bei ChurchTools nur angemeldet lesbar).
 * Adressen und Zeiten stammen von diekreative.org/campus-marzahn bzw. /campus-west (Stand 11/2026).
 */
export const CAMPUSSE: Campus[] = [
  {
    id: HAUPT_CAMPUS_ID,
    name: 'diekreative Berlin',
    termineAnsicht: 'motorwerk',
    godiKalenderId: 2,
    anfahrt: null
  },
  {
    id: 2,
    name: 'Campus Marzahn',
    termineAnsicht: 'marzahn',
    godiKalenderId: 54,
    anfahrt: {
      ort: 'Jugendhaus Trinity',
      adresszeilen: ['Blenheimstraße 33', '12685 Berlin'],
      zeitKey: 'DIRECTIONS.SERVICE_TIME_MARZAHN',
      bild: '../assets/kacheln/CampusMarzahn.png',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Jugendhaus Trinity, Blenheimstraße 33, 12685 Berlin')
    }
  },
  {
    id: 5,
    name: 'Campus West',
    termineAnsicht: 'citywest',
    godiKalenderId: 65,
    anfahrt: {
      ort: 'H10 Hotel',
      adresszeilen: ['Joachimsthaler Straße 31-32', '10719 Berlin'],
      zeitKey: 'DIRECTIONS.SERVICE_TIME_WEST',
      bild: '../assets/kacheln/CampusWest.png',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('H10 Hotel, Joachimsthaler Straße 31-32, 10719 Berlin')
    }
  }
];

/** Ansicht im Kalender-Plugin dkEvents, wenn kein Standort gewählt ist ("Alle Standorte") */
export const TERMINE_ANSICHT_ALLE = 'haupt';

/** Gottesdienst-Kalender, wenn kein Standort gewählt ist: der des Hauptcampus (Motorwerk) */
export const GODI_KALENDER_ALLE = 2;

const PREF_CAMPUS_AUSWAHL = 'campusAuswahl';
/** Nicht mehr benötigte Zwischenspeicher früherer Versionen */
const ALTE_PREFS = ['campusListe', 'campusProfile'];

/**
 * Verwaltet den in der App aktiven Standort (ChurchTools-"Campus").
 *
 * - Ohne Auswahl (null) ist die App standortunabhängig ("Alle Standorte").
 * - Die Auswahl wird lokal gespeichert und kann in den Einstellungen geändert werden.
 * - Beim Login wird der Standort der Person vorausgewählt.
 */
@Injectable({
  providedIn: 'root'
})
export class CampusService {

  private readonly REST_API_SERVER = environment.churchtoolsurl + '/api';

  /** Alle auswählbaren Standorte. */
  public readonly campusse = new BehaviorSubject<Campus[]>(CAMPUSSE);

  /** ID des aktiven Standorts, null = alle Standorte. */
  public readonly aktiverCampusId = new BehaviorSubject<number | null>(null);

  private readonly bereit: Promise<void>;

  constructor(
    private platform: Platform,
    private toastCtrl: ToastController,
    private translate: TranslateService
  ) {
    this.bereit = this.platform.ready().then(() => this.ladeGespeichertes());
  }

  /** Der aktive Standort als Objekt (oder null, wenn alle Standorte gelten). */
  public get aktiverCampus(): Campus | null {
    return this.findeCampus(this.aktiverCampusId.value);
  }

  public findeCampus(id: number | null): Campus | null {
    if (id == null) {
      return null;
    }
    return CAMPUSSE.find((c) => c.id === id) ?? null;
  }

  /** Anzeigename eines Standorts. */
  public campusName(id: number | null): string {
    if (id == null) {
      return this.translate.instant('CAMPUS.ALL');
    }
    return this.findeCampus(id)?.name ?? this.translate.instant('CAMPUS.FALLBACK', { id });
  }

  /** Setzt den aktiven Standort (null = alle) und speichert ihn. */
  public async setzeCampus(id: number | null): Promise<void> {
    await this.bereit;
    this.aktiverCampusId.next(this.gueltigeId(id));
    await this.speichereAuswahl();
  }

  /**
   * Liest die campusId einer Person direkt bei ChurchTools (GET /api/persons/{id}).
   * Wird verwendet, falls die Personendaten aus dem eigenen Proxy kein campusId-Feld enthalten.
   */
  public async ladeCampusIdDerPerson(personid: number | string, logintoken?: string): Promise<number | null> {
    try {
      const headers: Record<string, string> = {};
      if (logintoken) {
        headers['Authorization'] = 'Login ' + logintoken;
      }
      const res = await CapacitorHttp.get({ url: this.REST_API_SERVER + '/persons/' + personid, headers });
      const id = this.parseJson(res.data)?.data?.campusId;
      return res.status === 200 && id != null ? Number(id) : null;
    } catch (err) {
      console.log('Fehler beim Laden des Standorts der Person ' + JSON.stringify(err));
      return null;
    }
  }

  /**
   * Nach einem Login: Standort der Person übernehmen und den Nutzer darauf hinweisen.
   * Ohne Standort bei der Person bleibt die bisherige Auswahl unverändert.
   */
  public async uebernehmeCampusDerPerson(campusId: unknown): Promise<void> {
    const id = Number(campusId);
    if (campusId == null || campusId === '' || !Number.isFinite(id)) {
      console.log('Person hat keinen Standort hinterlegt, Auswahl bleibt unverändert');
      return;
    }
    await this.setzeCampus(id);
    const gewaehlt = this.aktiverCampusId.value;
    if (gewaehlt == null) {
      return;
    }

    const toast = await this.toastCtrl.create({
      message: this.translate.instant('CAMPUS.SELECTED', { name: this.campusName(gewaehlt) }),
      duration: 5000,
      position: 'bottom',
      buttons: [{ text: 'OK', role: 'cancel' }]
    });
    await toast.present();
  }

  /** Nach dem Logout ist die App wieder standortunabhängig. */
  public async zuruecksetzen(): Promise<void> {
    await this.setzeCampus(null);
  }

  /** ChurchTools-Kalender mit den Gottesdiensten des aktiven Standorts. */
  public get godiKalenderId(): number {
    return this.aktiverCampus?.godiKalenderId ?? GODI_KALENDER_ALLE;
  }

  /** true, wenn für den Standort die festen Angaben (Motorwerk) gelten. */
  public istHauptCampus(id: number | null): boolean {
    return id === HAUPT_CAMPUS_ID;
  }

  /** "unbekannt/andere" wird zu "diekreative Berlin", unbekannte IDs zu "Alle Standorte". */
  private gueltigeId(id: number | null): number | null {
    if (id == null) {
      return null;
    }
    if (id === UNBEKANNT_CAMPUS_ID) {
      return HAUPT_CAMPUS_ID;
    }
    if (!this.findeCampus(id)) {
      console.log('Unbekannter Standort ' + id + ' – es gelten alle Standorte');
      return null;
    }
    return id;
  }

  private async speichereAuswahl(): Promise<void> {
    await Preferences.set({ key: PREF_CAMPUS_AUSWAHL, value: JSON.stringify({ campusId: this.aktiverCampusId.value }) });
  }

  private async ladeGespeichertes(): Promise<void> {
    try {
      const auswahl = await Preferences.get({ key: PREF_CAMPUS_AUSWAHL });
      const gespeichert = this.parseJson(auswahl.value)?.campusId;
      const id = this.gueltigeId(typeof gespeichert === 'number' ? gespeichert : null);
      this.aktiverCampusId.next(id);
      if (gespeichert !== undefined && id !== gespeichert) {
        await this.speichereAuswahl();
      }
      for (const key of ALTE_PREFS) {
        await Preferences.remove({ key });
      }
    } catch (err) {
      console.log('Fehler beim Lesen der Standort-Einstellungen ' + JSON.stringify(err));
    }
  }

  private parseJson(wert: any): any {
    if (typeof wert !== 'string') {
      return wert;
    }
    try {
      return JSON.parse(wert);
    } catch {
      return null;
    }
  }
}
