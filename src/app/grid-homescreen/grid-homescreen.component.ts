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
  form:any = [];

  constructor(
    private userState:UserstateService,
    private router: Router,
    private iab: InAppBrowser,
    private platform: Platform
  ) {  }


  ngOnInit() {
    console.log('grid-homescreen.component.ts - ngoninit - set form');
    this.userState.homescreen.subscribe((form)=>{this.form=form});
  }

  openWebsite(url){
    this.platform.ready().then(() => {
      this.iab.create(url,'_system');
    });
  }

  handleClick(button) {
    switch (button) {
      case 'Mediathek':
        //this.userState.AppPageMedienInit = true;
        this.router.navigate(["/tabs/predigten-audio"]);
        break;
      case 'Termine':
        this.router.navigate(["/tabs/termine"]);
        break;
      case 'Tagundnacht':
        this.userState.AppPageTUNInit = true;
        this.router.navigate(["/tabs/tagundnacht"]);
        break;
      case 'Gottesdienste':
        //this.userState.AppPageGodiInit = true;
        this.router.navigate(["/tabs/gottesdienste"]);
        break;
      case 'LifeGroups':
        this.router.navigate(["/tabs/lifegroups"]);
        break;
      case 'Ueberuns':
        this.router.navigate(["/tabs/aboutus"]);
        break;
      case 'Geben':
        this.openWebsite('https://diekreative.org/geben#formular');
        break;
      case 'Erlebt':
        this.router.navigate(["/tabs/erlebt"]);
        break;
      case 'Akademie':
        this.router.navigate(["/tabs/akademie"]);
        break;
      case 'Audienz':
        this.router.navigate(["/tabs/audienz"]);
        break;
    }
  }

 
  
}
