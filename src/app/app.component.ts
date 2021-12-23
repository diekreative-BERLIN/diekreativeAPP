import { Component } from '@angular/core';

import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';

import { ModalController } from '@ionic/angular';
import { LoginModalPage } from './login-modal/login-modal.page';
import { PersondetailModalPage } from './persondetail-modal/persondetail-modal.page';
import { FeedsService } from './communications/feeds.service';
import { ChurchapiService } from './connectors/churchapi.service';
import { UserstateService } from './userstate.service';
import { Router } from '@angular/router';
import { HTTP } from '@ionic-native/http/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ConnectivityService } from './connectivity.service';

import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  login = false;
  firebasePlugin;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private menu: MenuController,
    public modalController: ModalController,
    private feeds: FeedsService,
    private churchToolsApi: ChurchapiService,
    public userState: UserstateService,
    private router: Router,
    private http: HTTP,
    private iab: InAppBrowser,
    private connectivity: ConnectivityService,
    private firebaseX: FirebaseX,
    public alertController: AlertController
  ) {
    this.initializeApp();
    //handle Android Back Button
    this.platform.backButton.subscribeWithPriority(10, () => {
      if (this.router.url == "/tabs/itemslide" || this.router.url == "/tabs/tun-gebetscal" || this.router.url == "/tabs/tun-takewatches") {
        this.router.navigate(["/tabs/tagundnacht"]);
      } else if (this.router.url == '/tabs/tab1') {
        //exit app
        navigator['app'].exitApp();
      } else {
        //go to home
        this.router.navigate(["/tabs/tab1"]);
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(
      () => {
        this.statusBar.styleDefault();
        this.splashScreen.hide();
        
        this.firebaseX.hasPermission().then((permission)=>{
          if(!permission){
            this.firebaseX.grantPermission();
          }
        });
        this.firebaseX.getToken().then(token => {
            console.log(`The token is ${token}`);
        }) // save the token server-side and use it to push notifications to this device
        .catch(error => alert(`Error getting token ${error}`));
        
        this.firebasePlugin = (<any>window).FirebasePlugin;
        this.firebasePlugin.onMessageReceived(this.onMessageReceived.bind(this));

        //delete pending badge numbers on iOS
        if(!this.platform.is('android')) {
          this.firebasePlugin.getBadgeNumber(function(n) {
            if (n>0) {this.firebasePlugin.setBadgeNumber(0);}
          });
        }
        
        }
      );

  }

  //handle push messages in foreground
  onMessageReceived(message){

    this.alertController.create({
      cssClass: 'push-message',
      header: message.aps.alert.title,
      message: message.aps.alert.body,
      buttons: ['OK']
    }).then(res => {
      res.present();
    });

    //remove all message badges
    this.firebasePlugin.setBadgeNumber(0);
  }

  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  closeFirst(){
    this.menu.enable(false, 'first');
    this.menu.close('first');
  }

close(){
  this.menu.close('first');
}

ngOnInit() {
  this.connectivity.appIsOnline$.subscribe(online => {
    console.log(online)
    if (online) {
        console.log("App is online");
        this.userState.isOnline = true;
    } else {
        console.log("App is offline")
        this.userState.isOnline = false;
    }
  })

}


  async presentModal() {
    const modal = await this.modalController.create({
      component: LoginModalPage,
      cssClass: 'login-modal-class'
    });
    return await modal.present();
  }
  async loggedpersonActivated() {
    const modal = await this.modalController.create({
      component: PersondetailModalPage,
      cssClass: 'persondetail-modal-class'
    });
    return await modal.present();
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }
  
  ctAppActivated(){
    this.router.navigate(["/tabs/ctapp"]);
    this.close();
  }

  mediathekActivated(){
    this.userState.AppPageMedienInit = true;
    this.router.navigate(["/tabs/predigten-audio"]);
    this.close();
  }

  termineActivated(){
    this.router.navigate(["/tabs/termine"]);
    this.close();
  }

  lifegroupsActivated(){
    this.router.navigate(["/tabs/lifegroups"]);
    this.close();
  }

  mailDieKreative(){
    this.router.navigateByUrl("mailto:office@diekreative.org");
    this.close();
  }

  creditsActivated(){
    this.router.navigate(["/tabs/credits"]);
    this.close();
  }
  aboutUsActivated(){
    this.router.navigate(["/tabs/aboutus"]);
    this.close();
  }
  tagundnachtActivated(){
    this.userState.AppPageTUNInit = true;
    this.router.navigate(["/tabs/tagundnacht"]);
    this.close();
  }
  homeActivated(){
    this.router.navigate(["/tabs/tab1"]);
    this.close();
  }
  godiActivated(){
    this.router.navigate(["/tabs/gottesdienste"]);
    this.close();
  }
  erlebtActivated(){
    this.router.navigate(["/tabs/erlebt"]);
    this.close();
  }
  openWebsite(url){
    this.platform.ready().then(() => {
      this.iab.create(url,'_system');
    });
  }

}

/*
<ion-item (click)="presentModal()"><ion-icon class="menuicon" color="secondary" name="key-sharp"></ion-icon><ion-label>&nbsp;&nbsp;Login</ion-label></ion-item>
<!--ion-item><ion-icon class="menuicon" color="secondary" name="notifications-outline"></ion-icon><ion-label>&nbsp;&nbsp;Mitteilungen</ion-label></ion-item-->
<ion-item routerLink="/tabs/predigten-audio"><ion-icon class="menuicon" color="secondary" name="mic-sharp"></ion-icon><ion-label>&nbsp;&nbsp;Mediathek</ion-label></ion-item>
<ion-item routerLink="/tabs/lifegroups"><ion-icon class="menuicon" color="secondary" name="people-sharp"></ion-icon><ion-label>&nbsp;&nbsp;Lifegroups</ion-label></ion-item>
<!--ion-item><ion-icon class="menuicon" color="secondary" name="share-social-sharp"></ion-icon>&nbsp;&nbsp;ERlebt</ion-item-->
<ion-item  href="mailto:office@diekreative.org"><ion-icon class="menuicon" color="secondary" name="mail-sharp"></ion-icon><ion-label>&nbsp;&nbsp;Kontakt</ion-label></ion-item>
<ion-item href="https://diekreative.org/impressum/"><ion-icon class="menuicon" color="secondary" name="information-sharp"></ion-icon><ion-label>&nbsp;&nbsp;Impressum</ion-label></ion-item>
<ion-item routerLink="/tabs/credits"><ion-icon class="menuicon" color="secondary" name="medal-sharp"></ion-icon><ion-label>&nbsp;&nbsp;Die Erschaffer</ion-label></ion-item>
*/