import { Injectable } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';
import { CapacitorHttp } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

/** Ein Standort (Campus) der Gemeinde, wie ihn ChurchTools liefert. */
export interface Campus {
  id: number;
  name: string;
}

const PREF_CAMPUS_LISTE = 'campusListe';
const PREF_CAMPUS_AUSWAHL = 'campusAuswahl';

/**
 * Verwaltet die Standorte (ChurchTools-"Campusse") und den in der App aktiven Standort.
 *
 * - Ohne Auswahl (null) ist die App standortunabhängig ("Alle Standorte").
 * - Die Auswahl wird lokal gespeichert und kann in den Einstellungen geändert werden.
 * - Beim Login wird der Standort der Person vorausgewählt.
 *
 * Hinweis: /api/campuses ist bei ChurchTools nur mit Anmeldung lesbar. Die Liste wird
 * deshalb nach dem Login geladen und lokal zwischengespeichert, damit sie auch
 * offline bzw. nach dem Ausloggen in den Einstellungen verfügbar bleibt.
 */
@Injectable({
  providedIn: 'root'
})
export class CampusService {

  private readonly REST_API_SERVER = environment.churchtoolsurl + '/api';

  /** Alle bekannten Standorte, sortiert nach Name. */
  public readonly campusse = new BehaviorSubject<Campus[]>([]);

  /** ID des aktiven Standorts, null = alle Standorte. */
  public readonly aktiverCampusId = new BehaviorSubject<number | null>(null);

  private readonly bereit: Promise<void>;

  constructor(
    private platform: Platform,
    private toastCtrl: ToastController
  ) {
    this.bereit = this.platform.ready().then(() => this.ladeGespeichertes());
  }

  /** Der aktive Standort als Objekt (oder null, wenn alle Standorte gelten bzw. unbekannt). */
  public get aktiverCampus(): Campus | null {
    return this.findeCampus(this.aktiverCampusId.value);
  }

  public findeCampus(id: number | null): Campus | null {
    if (id == null) {
      return null;
    }
    return this.campusse.value.find((c) => c.id === id) ?? null;
  }

  /** Anzeigename eines Standorts, auch wenn er (noch) nicht in der Liste ist. */
  public campusName(id: number | null): string {
    if (id == null) {
      return 'Alle Standorte';
    }
    return this.findeCampus(id)?.name ?? `Standort ${id}`;
  }

  /** Setzt den aktiven Standort (null = alle) und speichert ihn. */
  public async setzeCampus(id: number | null): Promise<void> {
    await this.bereit;
    this.aktiverCampusId.next(id);
    await Preferences.set({ key: PREF_CAMPUS_AUSWAHL, value: JSON.stringify({ campusId: id }) });
  }

  /**
   * Lädt alle Standorte von ChurchTools. Mit Logintoken wird dieser mitgeschickt,
   * ansonsten wird die Session (Cookie) des Logins verwendet.
   * Gibt true zurück, wenn die Liste erfolgreich aktualisiert wurde.
   */
  public async ladeCampusse(logintoken?: string): Promise<boolean> {
    await this.bereit;
    try {
      const headers: Record<string, string> = {};
      if (logintoken) {
        headers['Authorization'] = 'Login ' + logintoken;
      }
      const res = await CapacitorHttp.get({ url: this.REST_API_SERVER + '/campuses', headers });
      const daten = this.parseJson(res.data)?.data;
      if (res.status !== 200 || !Array.isArray(daten)) {
        console.log('Campusse konnten nicht geladen werden, Status ' + res.status);
        return false;
      }
      const liste: Campus[] = daten
        .filter((c) => c && c.id != null)
        .map((c) => ({ id: Number(c.id), name: String(c.name ?? c.nameTranslated ?? `Standort ${c.id}`) }))
        .sort((a, b) => a.name.localeCompare(b.name, 'de'));
      this.campusse.next(liste);
      await Preferences.set({ key: PREF_CAMPUS_LISTE, value: JSON.stringify(liste) });
      return true;
    } catch (err) {
      console.log('Fehler beim Laden der Campusse ' + JSON.stringify(err));
      return false;
    }
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
  public async uebernehmeCampusDerPerson(campusId: unknown, logintoken?: string): Promise<void> {
    const id = Number(campusId);
    if (campusId == null || campusId === '' || !Number.isFinite(id)) {
      console.log('Person hat keinen Standort hinterlegt, Auswahl bleibt unverändert');
      return;
    }
    // Liste auffrischen, damit der Name im Hinweis stimmt (bei Fehler: zwischengespeicherte Liste).
    await this.ladeCampusse(logintoken);
    await this.setzeCampus(id);

    const toast = await this.toastCtrl.create({
      message: `Standort „${this.campusName(id)}“ wurde ausgewählt. Du kannst ihn jederzeit in den Einstellungen ändern.`,
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

  private async ladeGespeichertes(): Promise<void> {
    try {
      const liste = await Preferences.get({ key: PREF_CAMPUS_LISTE });
      const campusse = this.parseJson(liste.value);
      if (Array.isArray(campusse)) {
        this.campusse.next(campusse);
      }
      const auswahl = await Preferences.get({ key: PREF_CAMPUS_AUSWAHL });
      const id = this.parseJson(auswahl.value)?.campusId;
      this.aktiverCampusId.next(typeof id === 'number' ? id : null);
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
