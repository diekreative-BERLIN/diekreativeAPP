import { Component, OnDestroy } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { DefaultSystemBrowserOptions, InAppBrowser } from '@capacitor/inappbrowser';
import { Subscription } from 'rxjs';
import { CampusAnfahrt, CampusService } from '../campus.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnDestroy {

  /**
   * Gottesdienst-Angaben des gewählten Standorts.
   * null = feste Angaben für "diekreative Berlin" (Motorwerk), auch bei "Alle Standorte".
   */
  gottesdienst: CampusAnfahrt | null = null;

  private abo: Subscription;

  constructor(
    private platform: Platform,
    private router: Router,
    private campusService: CampusService
  ) {
    this.abo = this.campusService.aktiverCampusId.subscribe((id) => {
      this.gottesdienst = this.campusService.findeCampus(id)?.anfahrt ?? null;
    });
  }

  ngOnDestroy() {
    this.abo?.unsubscribe();
  }

  openWebsite(url){
    this.platform.ready().then(() => {
      InAppBrowser.openInSystemBrowser({url, options:DefaultSystemBrowserOptions});
    });
  }

  TermineActivated() {
    this.router.navigate(["/tabs/termine"]);
    //this.close();
  }

}
