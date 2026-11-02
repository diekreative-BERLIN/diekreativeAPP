import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';

import { DomSanitizer } from "@angular/platform-browser";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tun-gebetscal',
  templateUrl: './tun-gebetscalHN.page.html',
  styleUrls: ['./tun-gebetscalHN.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TunGebetscalPage implements OnInit {

  loading;
  iframeLink;
  browser: any = {
    secUrl: '' // Security link
  };

  constructor(
    private platform: Platform,
    public loadingController: LoadingController,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {  }

  ngOnInit() {
      this.showLoader();
      this.iframeLink = environment.gebetskalenderHNurl;
      this.browser.secUrl=this.sanitizer.bypassSecurityTrustResourceUrl(this.iframeLink);
  }

  // This will show the loader
  showLoader() {
    this.loading = this.loadingController.create({
      message: 'Gebetskalender wird geladen...',
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
    this.router.navigate(["/tabs/tagundnacht"]);
  }

  doRefresh(event) {
    if (event) {
      //this.refresher = (new Date()).getTime() + Math.floor(Math.random() * 1000000);
      this.browser.secUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.iframeLink+"?reload=" + (new Date()).getTime() + Math.floor(Math.random() * 1000000) );
      event.target.complete();
    }
     
  }

}
