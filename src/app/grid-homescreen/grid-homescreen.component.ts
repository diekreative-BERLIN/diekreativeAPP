import { Component, OnInit } from '@angular/core';
import { UserstateService } from '../userstate.service';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-grid-homescreen',
  templateUrl: './grid-homescreen.component.html',
  styleUrls: ['./grid-homescreen.component.scss'],
})
export class GridHomescreenComponent implements OnInit {

  firebasePlugin;

  constructor(
    private userState:UserstateService,
    private router: Router,
    private iab: InAppBrowser,
    private platform: Platform
  ) {
    platform.ready().then(() => {
      this.firebasePlugin = (<any>window).FirebasePlugin;
      this.firebasePlugin.onMessageReceived(this.onMessageReceived.bind(this));
    });
  }

  /*
  getToken() {
    this.firebasePlugin.getToken(token => {
      alert('token='+token);
    })
  }
  */

  //handle push messages in foreground
  onMessageReceived(message){
    //alert('Message received '+ JSON.stringify(message));
    console.log(message.aps.alert.title);
    console.log("body:");
    console.log(message.aps.alert.body);
    alert(message.aps.alert.title+'\n\n'+message.aps.alert.body);
    //remove all message badges
    this.firebasePlugin.setBadgeNumber(0);
  }

  ngOnInit() {}

  tagundnachtGoto(){
    this.userState.AppPageTUNInit = true;
    this.router.navigate(["/tabs/tagundnacht"]);
  }

  MedienGoto(){
    this.userState.AppPageMedienInit = true;
    this.router.navigate(["/tabs/predigten-audio"]);
  }

  GoDiGoto(){
    //this.userState.AppPageGodiInit = true;
    this.router.navigate(["/tabs/gottesdienste"]);
  }

  TermineGoto() {
    this.router.navigate(["/tabs/termine"]);
  }

  openWebsite(url){
    this.platform.ready().then(() => {
      this.iab.create(url,'_system');
    });
  }

}
