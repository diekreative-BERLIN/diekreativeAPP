import { Component, OnInit } from '@angular/core';
//import { ChurchapiService } from '../connectors/churchapi.service';
//popover
import {PopoverController} from '@ionic/angular';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-gd-checkin',
  templateUrl: './gd-checkin.page.html',
  styleUrls: ['./gd-checkin.page.scss'],
})
export class GdCheckinPage implements OnInit {

  public myAngularxQrCode: string = null;

  constructor(
    private popover:PopoverController,
    private platform: Platform
    //private churchtools:ChurchapiService
    ) {
      //this.platform.backButton.subscribeWithPriority(10, () => {
      //  this.popover.dismiss("abort");
      //});
    }
  
  QRcode;

  ngOnInit() {
    this.myAngularxQrCode = this.QRcode;
  }

  ConfirmPopover() {
    console.log("confirm popover");
    //fuehre Freigabebefehl aus
    this.popover.dismiss("success");
  }

  ClosePopover()
   {
      console.log("abbruch");
      this.popover.dismiss("abort");
   }

}
