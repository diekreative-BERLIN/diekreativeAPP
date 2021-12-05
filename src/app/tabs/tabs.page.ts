import { Component } from '@angular/core';
import { MenuController, Platform } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { UserstateService } from '../userstate.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(private menu: MenuController,
    private iab: InAppBrowser,
    private platform: Platform,
    private userState:UserstateService,
    private router: Router) {}
  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  tagundnachtGoto(){
    this.userState.AppPageTUNInit = true;
    //this.router.navigate(["/tabs/tagundnacht"]);
  }

  openWebsite(url){
    this.platform.ready().then(() => {
      this.iab.create(url,'_system');
    });
  }

}
