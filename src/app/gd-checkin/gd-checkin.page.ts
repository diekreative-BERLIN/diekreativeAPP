import { Component, OnInit } from '@angular/core';
import { ChurchapiService } from '../connectors/churchapi.service';
//popover
import {PopoverController} from '@ionic/angular';
import { Platform } from '@ionic/angular';
//Slider
import { ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';

//timezone
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-gd-checkin',
  templateUrl: './gd-checkin.page.html',
  styleUrls: ['./gd-checkin.page.scss'],
})
export class GdCheckinPage implements OnInit {
  public myAngularxQrCode: string = null;
  //use of moment.js library
  momentjs: any = moment;

  slideOpts = { 
    initialSlide: 0, 
    effect: 'flip', 
  };

  items = [];

  constructor(
    private popover:PopoverController,
    private platform: Platform,
    private churchtools:ChurchapiService
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

    //console.log('in ng oninit bei QR display. code:');
    var daten = this.uniqueData(this.QRFamilyData, 'personid');
    //console.log("Daten:");
    //console.log(daten);

    this.momentjs.tz.setDefault('Europe/Berlin');
    let timestampLocal = this.momentjs().format("X");
    let ablauf;
    let is3gok;

    /*  - nur zum Testen
    let item = [{"name":"Marc","qrcode":"abcjaja", "is3gok":false}];
    this.items.push(item[0]);
    item = [{"name":"Steffi","qrcode":"jep", "is3gok":true}];
    this.items.push(item[0]);
    return;
    */

    //console.log('id | name | qrcode | validity | is3gok ');
    for(let zeile of daten){  
      //console.log(zeile.personid + "|" + zeile.name + "|" + zeile.qrcode + "|" + zeile.validity + "|" + zeile.is3gok);

      //get validity from db and compare wit timestamp
      this.churchtools.getCheckValidity(zeile.personid).then((result)=>{
        //console.log('aus db: 3g für '+zeile.personid+' bis:');
        //console.log(JSON.stringify(JSON.parse(result.data)));
        ablauf = this.momentjs(JSON.stringify(JSON.parse(result.data)), "YYYYMMDD H:mm:ss").format("X");
        /*
        console.log('now / ablauf:');
        console.log(timestampLocal);
        console.log(ablauf);
        */
        if (timestampLocal < ablauf) {
          //console.log('now<ablauf ;-)');
          is3gok = true;
        } else {
          //console.log('abgelaufen');
          is3gok = false;
        }

        //save to items
        let item = [{"name":"","qrcode":"", "is3gok":false}];
        item[0].name=zeile.name;
        item[0].qrcode=zeile.qrcode+"/"+zeile.personid+"/"+this.QRGroupID;
        item[0].is3gok=is3gok;
        this.items.push(item[0]);

      });
      
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
