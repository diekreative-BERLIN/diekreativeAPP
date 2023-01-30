import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';

import { AlertController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SafariViewController } from '@awesome-cordova-plugins/safari-view-controller/ngx';
import { UserstateService } from '../userstate.service';

//
//import { NavController } from 'ionic-angular';
import { DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-lifegroups',
  templateUrl: './lifegroups.page.html',
  styleUrls: ['./lifegroups.page.scss'],
})
export class LifegroupsPage implements OnInit {
  AppPlatform = "";
  url;
  clickCount = 0;

  constructor(
    private platform: Platform,
    private router: Router,
    public alertController: AlertController,
    private iab: InAppBrowser,
    private safariViewController: SafariViewController,
    private sanitizer: DomSanitizer,
    public userState:UserstateService
  ) {
    //this.platform.backButton.subscribeWithPriority(10, () => {
    //  this.router.navigate(["/tabs/tab1"]);
    //});
  }

  ngOnInit() {
    if(this.platform.is('android')) {
      this.AppPlatform="android";
    } else {
      this.AppPlatform="iOS";
    }
    this.url = this.iframeUrl();
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
              this.iab.create('https://diekreative.church.tools/grouphomepage/t0C8YfViN2HpLvDQDhafN8gYogHeVsLi?embedded=true','_system');
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

  openSafari() {
    this.safariViewController.isAvailable()
    .then((available: boolean) => {
        if (available) {
          this.safariViewController.show({
            url: 'https://diekreative.church.tools/grouphomepage/t0C8YfViN2HpLvDQDhafN8gYogHeVsLi?embedded=true',
            hidden: false,
            animated: true,
            transition: 'curl',
            enterReaderModeIfAvailable: true,
            tintColor: '#ff0000'
          })
          .subscribe((result: any) => {
              if(result.event === 'opened') console.log('Opened');
              else if(result.event === 'loaded') console.log('Loaded');
              else if(result.event === 'closed') {
                console.log('Closed');
                this.safariViewController.hide();
                this.clickCount = -1;
                console.log('click count when close: '+this.clickCount);
              }
            },
            (error: any) => console.error(error)
          );

        } else {
          // use fallback browser, example InAppBrowser
        }
      }
    );

  }

  iframeUrl(){
    let url = "https://diekreative.church.tools/grouphomepage/t0C8YfViN2HpLvDQDhafN8gYogHeVsLi?embedded=true";
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  
}


