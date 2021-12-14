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
  constructor(
    private userState:UserstateService,
    private router: Router,
    private iab: InAppBrowser,
    private platform: Platform
  ) {  }


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
