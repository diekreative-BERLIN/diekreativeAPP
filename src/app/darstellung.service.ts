import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { StatusBar, Style } from '@capacitor/status-bar';
import { BehaviorSubject } from 'rxjs';

/** 'auto' = Einstellung des Geräts (hell/dunkel) verwenden */
export type DarstellungWahl = 'auto' | 'hell' | 'dunkel';

const PREF_KEY = 'app_darstellung';

/**
 * Steuert den Dunkelmodus der App:
 * - Standardmäßig richtet sich die App nach dem System (prefers-color-scheme).
 * - In den Einstellungen kann Hell oder Dunkel fest eingestellt werden.
 * Aktiv wird der Dunkelmodus über die Klasse "dark" auf <body>
 * (siehe theme/variables.scss und global.scss).
 */
@Injectable({
  providedIn: 'root'
})
export class DarstellungService {

  readonly wahl = new BehaviorSubject<DarstellungWahl>('auto');
  readonly istDunkel = new BehaviorSubject<boolean>(false);

  private readonly systemDunkel = window.matchMedia('(prefers-color-scheme: dark)');

  constructor() {
    // Systemwechsel (z. B. automatischer Dunkelmodus am Abend) live übernehmen
    this.systemDunkel.addEventListener('change', () => {
      if (this.wahl.value === 'auto') {
        this.anwenden();
      }
    });
  }

  /** Wird beim App-Start (APP_INITIALIZER) aufgerufen. */
  async init(): Promise<void> {
    let gespeichert: string | null = null;
    try {
      gespeichert = (await Preferences.get({ key: PREF_KEY })).value;
    } catch (err) {
      console.log('Darstellung: Einstellung konnte nicht gelesen werden', err);
    }
    const wahl: DarstellungWahl = (gespeichert === 'hell' || gespeichert === 'dunkel') ? gespeichert : 'auto';
    this.wahl.next(wahl);
    this.anwenden();
  }

  async setze(wahl: DarstellungWahl): Promise<void> {
    this.wahl.next(wahl);
    this.anwenden();
    await Preferences.set({ key: PREF_KEY, value: wahl });
  }

  /** Statusleiste passend zur Darstellung einfärben (nur nativ). */
  async statusBarAnpassen(): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      return;
    }
    const dunkel = this.istDunkel.value;
    try {
      if (Capacitor.getPlatform() === 'android') {
        await StatusBar.setBackgroundColor({ color: dunkel ? '#121212' : '#ffffff' });
      }
      await StatusBar.setStyle({ style: dunkel ? Style.Dark : Style.Light });
    } catch (err) {
      console.log('Darstellung: Statusleiste konnte nicht angepasst werden', err);
    }
  }

  private anwenden(): void {
    const wahl = this.wahl.value;
    const dunkel = wahl === 'dunkel' || (wahl === 'auto' && this.systemDunkel.matches);
    document.body.classList.toggle('dark', dunkel);
    this.istDunkel.next(dunkel);
    this.statusBarAnpassen();
  }
}
