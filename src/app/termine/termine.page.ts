import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, SecurityContext } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { DefaultSystemBrowserOptions, DefaultWebViewOptions, InAppBrowser } from '@capacitor/inappbrowser'
import { Router } from '@angular/router';

import { DomSanitizer } from "@angular/platform-browser";
import { UserstateService } from '../userstate.service';


@Component({
  selector: 'app-termine',
  templateUrl: './termine.page.html',
  styleUrls: ['./termine.page.scss'],
})
export class TerminePage implements OnInit {
  loading;
  iframeLink;
  browser: any = {
    secUrl: ''
  };
  isIOS = false;

  constructor(
    private platform: Platform,
    public loadingController: LoadingController,
    private router: Router,
    private sanitizer: DomSanitizer,
    public userState:UserstateService,
    private translate:TranslateService
    ) {
      if (window.addEventListener) {
        window.addEventListener("message", this.receiveMessage.bind(this), false);
      } else {
        (<any>window).attachEvent("onmessage", this.receiveMessage.bind(this));
      }
  }

  //receives a message from the window (ifram within)
  receiveMessage: any = (event: any) =>  {
    // console.log('receive message');
    //console.log(event);
    //console.log(event.data);
    if (event.origin === "https://diekreative.org") {
      this.openSafari(event.data);
    }
  }

  ngOnInit() {
    if(this.userState.isOnline) {
      this.showLoader();
    }
    if(this.platform.is('android')) {
      this.iframeLink="https://diekreative.org/events_4_app"
    } else {
      //this.iframeLink="https://diekreative.org/events_4_ios";
      this.iframeLink="https://diekreative.org/events_4_iosv2";
      this.isIOS = true;
    }

    if(this.userState.isOnline) {
      //this.browser.secUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.iframeLink+"?reload=0");
      this.browser.secUrl = this.sanitizer.sanitize(SecurityContext.URL,this.iframeLink+"?reload=" + (new Date()).getTime() + Math.floor(Math.random() * 1000000) );
      console.log('secUrl: '+this.browser.secUrl);
    }
  }

  /*
  parentBindingListener() {
    console.log('we have the window',window);
    function(e) {
      console.log(e);
      //var origin = e.originalEvent.origin || e.origin;
      //if(origin !== 'https://sciptverse.academy')
      //  return;
      console.log('received message:  ' + e.data, e);
    }, false);
  }
  */

  ngOnDestroy() {
    window.removeEventListener('message',this.receiveMessage);
  }

  openSafari(link) {
    this.platform.ready().then(async () => {
      //await InAppBrowser.openInWebView(
      await InAppBrowser.openInSystemBrowser(
        {
          url: link,
          options:DefaultSystemBrowserOptions
        }
      )});
  }

  // This will show the loader
  showLoader() {
    this.loading = this.loadingController.create({
      message: this.translate.instant('TERMINE.LOADING'),
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
    this.platform.ready().then(async () => {
      InAppBrowser.openInSystemBrowser({url, options:DefaultSystemBrowserOptions});
    });
  }

  doRefresh(event) {
    if (event) {
      if(this.userState.isOnline) {
        //this.refresher = (new Date()).getTime() + Math.floor(Math.random() * 1000000);
        this.browser.secUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.iframeLink+"?reload=" + (new Date()).getTime() + Math.floor(Math.random() * 1000000) );
      }
      event.target.complete();
    }
     
  }

}
