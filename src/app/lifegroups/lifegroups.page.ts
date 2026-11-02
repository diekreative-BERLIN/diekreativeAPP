import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';

import { AlertController } from '@ionic/angular';
import { UserstateService } from '../userstate.service';

//
//import { NavController } from 'ionic-angular';
import { DomSanitizer} from '@angular/platform-browser';
import { DefaultSystemBrowserOptions, DefaultWebViewOptions, InAppBrowser } from '@capacitor/inappbrowser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-lifegroups',
  templateUrl: './lifegroups.page.html',
  styleUrls: ['./lifegroups.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LifegroupsPage implements OnInit {
  AppPlatform = "";
  url;
  clickCount = 0;

  constructor(
    private platform: Platform,
    private router: Router,
    public alertController: AlertController,
    private sanitizer: DomSanitizer,
    public userState:UserstateService
  ) { }

  ngOnInit() {
    if(this.platform.is('android')) {
      this.AppPlatform="android";
    } else {
      this.AppPlatform="iOS";
    }
    this.url = this.iframeUrl();
  }

  /*
  showConfirm() {
    this.alertController.create({
      header: 'in Safari öffnen?',
      message: 'Die lifeGroup Seite in der App ist nur eine erste Übersicht und kann nicht zur Anmeldung benutzt werden. Möchtest Du die lifeGroup Übersicht in einem neuen Fenster im Safari Browser öffnen um dort eine Teilnahme zu beantragen?',
      buttons: [
        {
          text: 'Ja, gerne!',
          handler: () => {
            this.platform.ready().then(async () => {
              await InAppBrowser.openInSystemBrowser({url:environment.lifegroupsurl,options:DefaultSystemBrowserOptions});
            });
          }
        },
        {
          text: 'Nein Danke.'
        }
      ],
    }).then(res => {
      res.present();
    });
  }

  onIframeClick() {
    if(this.AppPlatform=="iOS") {
      this.clickCount = this.clickCount+1;
      console.log('click count @ onIfrClick: '+this.clickCount);
      if (this.clickCount==1) {
        console.log('iframe wurde geklickt!');
        //this.showConfirm();
        this.openSafari();
      }
    }
  }
  
  async openSafari() {
    await InAppBrowser.openInWebView({url:environment.lifegroupsurl, options: DefaultWebViewOptions})
  }
  */

  iframeUrl(){
    let url = environment.lifegroupsurl;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  
}


