import { Component, ViewEncapsulation } from '@angular/core';
import { MenuController, Platform } from '@ionic/angular';
import { UserstateService } from '../userstate.service';
import { Router } from '@angular/router';
import { DefaultSystemBrowserOptions, InAppBrowser } from '@capacitor/inappbrowser';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TabsPage {

  constructor(private menu: MenuController,
    private platform: Platform,
    private userState:UserstateService,
    private router: Router) {}
  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  openWebsite(url){
    this.platform.ready().then(() => {
      InAppBrowser.openInSystemBrowser({url, options:DefaultSystemBrowserOptions});
    });
  }

}
