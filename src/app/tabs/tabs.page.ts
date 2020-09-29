import { Component } from '@angular/core';
import { MenuController, Platform } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(private menu: MenuController, private iab: InAppBrowser, private platform: Platform) {}
  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  openWebsite(url){
    this.platform.ready().then(() => {
      this.iab.create(url,'_system');

    });
  }

}
