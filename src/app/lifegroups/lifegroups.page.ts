import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

import { AlertController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-lifegroups',
  templateUrl: './lifegroups.page.html',
  styleUrls: ['./lifegroups.page.scss'],
})
export class LifegroupsPage implements OnInit {
  AppPlatform = "";

  constructor(
    private platform: Platform,
    public alertController: AlertController,
    private iab: InAppBrowser) { }

  ngOnInit() {
    if(this.platform.is('android')) {
      this.AppPlatform="android";
    } else {
      this.AppPlatform="iOS";
    }
  }

  showConfirm() {
    this.alertController.create({
      header: 'in Safari öffnen?',
      message: 'Die lifeGroup Seite in der App ist nur eine erste Übersicht und kann nicht zur Anmeldung benutzt werden. Möchtest Du die lifeGroup Übersicht in einem neuen Fenster im Safari Browser öffnen um dort eine Teilnahme zu beantragen?',
      buttons: [
        {
          text: 'Ja, gerne!',
          handler: () => {
            this.platform.ready().then(() => {
              this.iab.create('https://diekreative.org/churchtools/grouphomepage/t0C8YfViN2HpLvDQDhafN8gYogHeVsLi?embedded=true','_system');
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
      //console.log('iframe wurde geklickt!');
      this.showConfirm();
    }
  }
  
}


