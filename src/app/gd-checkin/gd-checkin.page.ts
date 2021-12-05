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
  
  //QRcode;
  QRFamilyData;
  QRGroupID;

  ngOnInit() {
    //this.myAngularxQrCode = this.QRcode;
    this.items = this.QRFamilyData;
  }

/*   - no reaction, not working..
  ConfirmPopover() {
    console.log("confirm popover");
    //fuehre Freigabebefehl aus
    this.popover.dismiss("success");
  }

  ClosePopover() {
      console.log("abbruch");
      this.popover.dismiss("abort");
   }
 */

  refresh_family() {
    this.popover.dismiss("reload_family");
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
