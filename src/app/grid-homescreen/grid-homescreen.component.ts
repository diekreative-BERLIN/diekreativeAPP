import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserstateService } from '../userstate.service';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { DefaultSystemBrowserOptions, InAppBrowser } from '@capacitor/inappbrowser';
import { KursplattformService } from '../connectors/kursplattform.service';

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
    private platform: Platform,
    private kursplattform: KursplattformService
  ) {  }


  ngOnInit() {
    console.log('grid-homescreen.component.ts - ngoninit - set form');
    this.userState.homescreen.subscribe((form)=>{this.form=form});
  }

  openWebsite(url:string){
    this.platform.ready().then(async () => {
      await InAppBrowser.openInSystemBrowser({url:url,options:DefaultSystemBrowserOptions});
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
      case 'Tagundnacht':   //TODO: hier wieder bis Z48 aktivieren wenn requests gehen!
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
      case 'Ministryteam':
        this.router.navigate(["/tabs/ministryteam"]);
        break;
      case 'Kursplattform':
        this.platform.ready().then(() => this.kursplattform.open());
        break;
    }
  }


  //checks if user has permissionID to display Element X on homescreen
  hasPermission(permissionID) {
    return this.userState.hasPermission(permissionID);
  }

 
  
}
