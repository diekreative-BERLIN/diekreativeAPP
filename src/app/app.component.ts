import { Component, OnInit } from '@angular/core';

import { Platform, MenuController } from '@ionic/angular';

import { ModalController } from '@ionic/angular';
import { LoginModalPage } from './login-modal/login-modal.page';
import { PersondetailModalPage } from './persondetail-modal/persondetail-modal.page';
import { UserstateService } from './userstate.service';
import { KursplattformService } from './connectors/kursplattform.service';
import { Router } from '@angular/router';
//import { ConnectivityService } from './connectivity.service';
import { AlertController } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Network } from '@capacitor/network';
import { EmailComposer, OpenOptions } from 'capacitor-email-composer'
//import { DefaultWebViewOptions, InAppBrowser } from '@capacitor/inappbrowser';
import { DefaultSystemBrowserOptions, InAppBrowser } from '@capacitor/inappbrowser';
//Back Button
import { App as CapacitorApp } from '@capacitor/app';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  login = false;

  constructor(
    private platform: Platform,
    private menu: MenuController,
    public modalController: ModalController,
    public userState: UserstateService,
    private router: Router,
    public alertController: AlertController,
    private kursplattform: KursplattformService
  ) {
    console.log('app.component -> es geht los!');
    this.initializeApp();
  }

  ngOnInit() {
    //handle Android Back Button
    CapacitorApp.addListener('backButton', ({canGoBack}) => {
      if(!canGoBack){
        CapacitorApp.exitApp();
      } else {
        window.history.back();
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(
      () => {
        SplashScreen.hide().then(() => {
          //status bar
          if(this.platform.is('android')) {
            //white background and black text
            StatusBar.setBackgroundColor({color: '#ffffff'});
          } 
          StatusBar.setStyle({style: Style.Default});
        });
        }
      );

      Network.getStatus().then((status) => {
        this.userState.isOnline = status.connected;
      });
      //Network connection change
      Network.addListener('networkStatusChange', (status) => {
        console.log('Network status changed', status);
        this.userState.isOnline = status.connected;
      });

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
  
  settingsActivated(){
    this.router.navigate(["/tabs/settings"]);
    this.close();
  }

  ctAppActivated(){
    this.router.navigate(["/tabs/ctapp"]);
    this.close();
  }

  mediathekActivated(){
    //this.userState.AppPageMedienInit = true;
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

  async mailDieKreative(){
    //this.router.navigateByUrl("mailto:office@diekreative.org");
    let email:OpenOptions= {
      to: ['office@diekreative.org'],
      subject: 'Kontakt zu diekreative',
      isHtml: false
    };

    // Send a text message using default options
    await EmailComposer.open(email); 
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

  kursplattformActivated(){
    this.close();
    this.platform.ready().then(() => this.kursplattform.open());
  }
  openWebsite(url){
    this.platform.ready().then(async () => {
      //2025-03-11 await InAppBrowser.openInWebView({url,options: DefaultWebViewOptions});
      await InAppBrowser.openInSystemBrowser({url:url, options: DefaultSystemBrowserOptions});
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