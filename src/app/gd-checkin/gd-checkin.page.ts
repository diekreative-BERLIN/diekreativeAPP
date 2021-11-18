import { Component, OnInit } from '@angular/core';
//import { ChurchapiService } from '../connectors/churchapi.service';
//popover
import {PopoverController} from '@ionic/angular';
import { Platform } from '@ionic/angular';
//Slider
import { ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-gd-checkin',
  templateUrl: './gd-checkin.page.html',
  styleUrls: ['./gd-checkin.page.scss'],
})
export class GdCheckinPage implements OnInit {
  public myAngularxQrCode: string = null;

  slideOpts = { 
    initialSlide: 0, 
    effect: 'flip', 
  };

  items = [];

  constructor(
    private popover:PopoverController,
    private platform: Platform
    //private churchtools:ChurchapiService
    ) {
      //this.platform.backButton.subscribeWithPriority(10, () => {
      //  this.popover.dismiss("abort");
      //});
  }

  @ViewChild(IonSlides) slides: IonSlides;
  
  QRcode;
  QRFamilyData;
  QRGroupID;

  ngOnInit() {
    this.myAngularxQrCode = this.QRcode;

    console.log('in ng oninit bei QR display. code:');
    var daten = this.uniqueData(this.QRFamilyData, 'personid');
    console.log("Daten:");
    console.log(daten);

    console.log('id | name | qrcode | vlidity | is3gok ');
    for(let zeile of daten){  
      console.log(zeile.personid + "|" + zeile.name + "|" + zeile.qrcode + "|" + zeile.validity + "|" + zeile.is3gok);

      //toto

      let item = [{"name":"","qrcode":"", "is3gok":false}];
      item[0].name=zeile.name;
      item[0].qrcode=zeile.qrcode+"/"+zeile.personid+"/"+this.QRGroupID;
      item[0].is3gok=true;
      this.items.push(item[0]);
    }

  }

  //detect doublicated values - taken from https://stackoverflow.com/questions/59562502/how-to-find-duplicates-from-list-of-array-in-angular-6-using-some
  uniqueData(array, key) {
    // create new objects for use
    var uniqueArray = [];
    var map = new Map();
  
    // loop through the array
    array.forEach((user,index) => {
      //check if the key already exists if exists do not push else push
      if (!map.get(user[key])) {
        map.set(user[key], user[key]);
        uniqueArray.push(user);
      }
    });
    return uniqueArray;
  }

  ConfirmPopover() {
    console.log("confirm popover");
    //fuehre Freigabebefehl aus
    this.popover.dismiss("success");
  }

  ClosePopover() {
      console.log("abbruch");
      this.popover.dismiss("abort");
   }

  nav_fwd() {
    this.slides.slideNext();
  }
  nav_back() {
    this.slides.slidePrev();
  }
  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    console.log('Current index is ', currentIndex);
  }

}
