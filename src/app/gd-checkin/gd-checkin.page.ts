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

  //test
  private data = [
        { name: 'Salami', qrcode: '8', is3gok: 'true'  },
        { name: 'Classic', qrcode: '5', is3gok: 'false'  },
        { name: 'Tuna', qrcode: '9', is3gok: 'false'  },
        { name: 'Hawai', qrcode: '7', is3gok: 'true'  }
  ];
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

  ngOnInit() {
    this.myAngularxQrCode = this.QRcode;
    //this.items = this.data;
    this.items = this.QRFamilyData;
    //validity
    console.log('in ng oninit bei QR display. code:');
    //console.log(this.items);
    console.log('id | name | qrcode | vlidity | is3gok ');
    for(let zeile of this.QRFamilyData){  
      console.log(zeile.personid + "|" + zeile.name + "|" + zeile.qrcode + "|" + zeile.validity + "|" + zeile.is3gok);
    }
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
