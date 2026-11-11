import { Injectable } from '@angular/core';
import { Device } from '@capacitor/device';
import { Preferences } from '@capacitor/preferences';
import { TranslateLoader, TranslateService } from '@ngx-translate/core';
import moment from 'moment-timezone';
import 'moment/locale/de';
import { BehaviorSubject, Observable, of } from 'rxjs';

import de from './i18n/de.json';
import en from './i18n/en.json';

export type Sprache = 'de' | 'en';
/** 'auto' = Sprache des Geräts verwenden */
export type SprachWahl = 'auto' | Sprache;

const UEBERSETZUNGEN: Record<Sprache, any> = { de, en };
const PREF_KEY = 'app_sprache';

/** Lädt die Übersetzungen direkt aus dem Bundle (funktioniert offline und ohne Verzögerung). */
export class StatischerTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return of(UEBERSETZUNGEN[lang as Sprache] ?? UEBERSETZUNGEN.en);
  }
}

/**
 * Bestimmt die Sprache der App:
 * - Gerätesprache Deutsch -> Deutsch, jede andere Gerätesprache -> Englisch
 * - In den Einstellungen kann die Sprache fest eingestellt werden.
 */
@Injectable({
  providedIn: 'root'
})
export class SpracheService {

  readonly wahl = new BehaviorSubject<SprachWahl>('auto');

  constructor(private translate: TranslateService) {
    this.translate.addLangs(['de', 'en']);
    this.translate.setDefaultLang('de');
  }

  get aktuell(): Sprache {
    return (this.translate.currentLang as Sprache) || 'de';
  }

  /** Wird beim App-Start (APP_INITIALIZER) aufgerufen. */
  async init(): Promise<void> {
    let gespeichert: string | null = null;
    try {
      gespeichert = (await Preferences.get({ key: PREF_KEY })).value;
    } catch (err) {
      console.log('Sprache: Einstellung konnte nicht gelesen werden', err);
    }
    const wahl: SprachWahl = (gespeichert === 'de' || gespeichert === 'en') ? gespeichert : 'auto';
    this.wahl.next(wahl);
    await this.anwenden(wahl);
  }

  async setze(wahl: SprachWahl): Promise<void> {
    this.wahl.next(wahl);
    await Preferences.set({ key: PREF_KEY, value: wahl });
    await this.anwenden(wahl);
  }

  private async anwenden(wahl: SprachWahl): Promise<void> {
    const sprache = wahl === 'auto' ? await this.geraeteSprache() : wahl;
    moment.locale(sprache);
    document.documentElement.lang = sprache;
    await this.translate.use(sprache).toPromise();
  }

  private async geraeteSprache(): Promise<Sprache> {
    let code = '';
    try {
      code = (await Device.getLanguageCode()).value || '';
    } catch (err) {
      code = navigator.language || '';
    }
    return code.toLowerCase().startsWith('de') ? 'de' : 'en';
  }
}
