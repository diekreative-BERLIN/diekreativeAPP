import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';

//modal popover
import { PopoverController } from '@ionic/angular';
import { GdCheckinPage } from '../gd-checkin/gd-checkin.page';

//timezone
import * as moment from 'moment-timezone';
//userstate
import { UserstateService } from '../userstate.service';

@Component({
  selector: 'app-gottesdienste',
  templateUrl: './gottesdienste.page.html',
  styleUrls: ['./gottesdienste.page.scss'],
})
export class GottesdienstePage implements OnInit {
  //use of moment.js library
  momentjs: any = moment;
  timestampLocal;
  isGodiToday;
  Weekday;

  constructor (
    private popover:PopoverController,
    public userState:UserstateService
  ) {  }

  checkin(){
    this.popover.create({component:GdCheckinPage,
          componentProps: {
            QRcode: this.userState.AppPageGoDiQRcheckinCode
          },
          cssClass: 'modal_qr_popover',
          backdropDismiss:true,
          showBackdrop:false}).then((popoverElement)=>{
            //popoverElement.onDidDismiss().then((ret)=>{
            //  console.log(JSON.parse(JSON.stringify(ret)).data );
            //});
            popoverElement.present();
          })
  }

  ngOnInit() {
    console.log("///NgInit");
    
    //set local timestamp
    this.setTimeStamp();

    this.Weekday = this.momentjs(this.timestampLocal).format('d');
    let Hour = this.momentjs(this.timestampLocal).format('H');

    //1. check: is church service today?
    /** 
    ** TODO: for future enhancements -> be more detailed
    console.log(' Tag='+Weekday+' Zeit='+Hour );
    if ( Weekday == 0 && ( Hour >= 8 && Hour <= 14) ) {
      console.log('es ist So zw. 8 und 14 Uhr');
      this.isGodiToday = 1;
    } else if ( Weekday == 5 && ( Hour >= 17 && Hour <= 22) ) {
      console.log('es ist Sa (AbendGoDi)');
      this.isGodiToday = 2;
    } else {
      this.isGodiToday = 0;
    }
    */
  // this.Weekday = 6;
  // this.userState.AppPageGodiTimestamp = 12345;
    
    //last timestamp same day?
    if (this.momentjs( this.userState.AppPageGodiTimestamp ).format('YYMMDD') !=
        this.momentjs( this.timestampLocal ).format('YYMMDD') ) {
        //different!
        console.log('last timestamp is not same date as now '+this.momentjs( this.timestampLocal ).format('YYMMDD') );
        //set new timestamp in db
        this.userState.AppPageGodiTimestamp = this.timestampLocal;
        //read GoDi Info
        this.userState.getNextGoDiEvents();
        //console.log('weekday of next GoDi event: '+this.userState.AppPageGodiWeekdayNextEvent);
        //if (this.userState.AppPageGodiWeekdayNextEvent!=this.Weekday) {this.isGodiToday = 0}
        //get QR Code checkin if GoDi Today

        //if(this.isGodiToday > 0) {
          this.userState.getGoDiEventDetails();
          //IF QR Code Checkin is allowed then get QR Code..
          if(this.userState.AppPageGodiQRcheckin) {
            //this.userState.checkPersonInGroup(); -> not necessary. getQRCode is enough
            this.userState.getQRCode();
          }
        //}

        //save GoDi Info in local db
        this.userState.saveGoDiInfo();

    } else {
      console.log('last timestamp was same day as now - no change');
      //todo: muss wieder weg... ist nur jetzt da...
        //this.userState.AppPageGodiTimestamp = this.timestampLocal;
        //this.userState.getNextGoDiEvents();
      //todo - weg (oben)
    }
    
    
  }

  @ViewChild(MatAccordion) accordion: MatAccordion;


/*
///NgInit
2021-01-25 11:49:23.255985+0100 diekreative APP[77174:2711153] 25-01-2021 @ 11:49 am +0100 tag=1 stamp=1611571763255
2021-01-25 11:49:23.256291+0100 diekreative APP[77174:2711153] hour 11 is < 12
*/

  setTimeStamp() {
    this.momentjs.tz.setDefault('Europe/Berlin');
    this.timestampLocal = this.momentjs();
  }

}
