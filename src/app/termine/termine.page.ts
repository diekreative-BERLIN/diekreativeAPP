import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Router } from '@angular/router';

import { DomSanitizer } from "@angular/platform-browser";

import { SafariViewController } from '@awesome-cordova-plugins/safari-view-controller/ngx';


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
  isIOS = false;

  constructor(
    private platform: Platform,
    private iab: InAppBrowser,
    public loadingController: LoadingController,
    private router: Router,
    private sanitizer: DomSanitizer,
    private safariViewController: SafariViewController
    ) {
    //this.platform.backButton.subscribeWithPriority(10, () => {
    //  this.router.navigate(["/tabs/tagundnacht"]);
    //});
    if (window.addEventListener) {
      window.addEventListener("message", this.receiveMessage.bind(this), false);
    } else {
       (<any>window).attachEvent("onmessage", this.receiveMessage.bind(this));
    }
  }

  //receives a message from the window (ifram within)
  receiveMessage: any = (event: any) =>  {
    //console.log('receive message');
    //console.log(event);
    //console.log(event.data);
    if (event.origin === "https://diekreative.org") {
      this.openSafari(event.data);
    }
  }

  ngOnInit() {
    this.showLoader();
    if(this.platform.is('android')) {
      this.iframeLink="https://diekreative.org/events_4_app"
    } else {
      //this.iframeLink="https://diekreative.org/events_4_ios";
      this.iframeLink="https://diekreative.org/events_4_iosv2";
      this.isIOS = true;
    }

    //this.browser.secUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.iframeLink+"?reload=0");
    this.browser.secUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.iframeLink+"?reload=" + (new Date()).getTime() + Math.floor(Math.random() * 1000000) );

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
    this.safariViewController.isAvailable()
    .then((available: boolean) => {
        if (available) {
          this.safariViewController.show({
            url: link,
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

  TerminHomeActivated() {
    this.browser.secUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.iframeLink+"?reload=" + (new Date()).getTime() + Math.floor(Math.random() * 1000000) );
  }

}
