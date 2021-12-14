import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Router } from '@angular/router';

import { DomSanitizer } from "@angular/platform-browser";


@Component({
  selector: 'app-termine',
  templateUrl: './termine.page.html',
  styleUrls: ['./termine.page.scss'],
})
export class TerminePage implements OnInit {
  loading;
  iframeLink;
  browser: any = {
    secUrl: '' // Security link
  };


  constructor(
    private platform: Platform,
    private iab: InAppBrowser,
    public loadingController: LoadingController,
    private router: Router,
    private sanitizer: DomSanitizer
    ) {
    //this.platform.backButton.subscribeWithPriority(10, () => {
    //  this.router.navigate(["/tabs/tagundnacht"]);
    //});
  }

  ngOnInit() {
    this.showLoader();
    if(this.platform.is('android')) {
      this.iframeLink="https://diekreative.org/events_4_app"
    } else {
      this.iframeLink="https://diekreative.org/events_4_ios"
    }
    this.browser.secUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.iframeLink+"?reload=0");
  }



  // This will show the loader
  showLoader() {
    this.loading = this.loadingController.create({
      message: 'Terminseite wird geladen...',
      duration: 3000
    }).then((res) => {
      res.present();
    });
  }


// Hide the loader if already created otherwise return error
hideLoader() {
  this.loadingController.dismiss().then((res) => {
    console.log('Loading dismissed!', res);
  }).catch((error) => {
    console.log('error', error);
  });

  }

  BackActivated() {
    this.router.navigate(["/tabs/tab2"]);
  }

  openWebsite(url){
    //console.log('open website url:'+url);
    this.platform.ready().then(() => {
      this.iab.create(url,'_system');
    });
  }

  doRefresh(event) {
    if (event) {
      //this.refresher = (new Date()).getTime() + Math.floor(Math.random() * 1000000);
      this.browser.secUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.iframeLink+"?reload=" + (new Date()).getTime() + Math.floor(Math.random() * 1000000) );

      event.target.complete();
    }
     
  }

}
