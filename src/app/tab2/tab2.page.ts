import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(private iab: InAppBrowser, private platform: Platform) {}

  openWebsite(url){
    this.platform.ready().then(() => {
      this.iab.create(url,'_system');
    });
  }

}
