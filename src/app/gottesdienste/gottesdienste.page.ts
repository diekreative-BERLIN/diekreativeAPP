import { Component, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

//modal popover
import { PopoverController } from '@ionic/angular';
import { GdCheckinPage } from '../gd-checkin/gd-checkin.page';
import { GeneralPage } from '../modals/general/general.page';


//timezone
import * as moment from 'moment-timezone';
//Churchtools connector
import { ChurchapiService } from '../connectors/churchapi.service';
import { EventsService } from '../connectors/events.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Platform } from '@ionic/angular';

//alert
import { AlertController } from '@ionic/angular';
//File transfer
import { File, FileEntry } from '@ionic-native/File/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
//File Opener
import { FileOpener } from '@ionic-native/file-opener/ngx';
//In App Browser
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { UserstateService } from '../userstate.service';

const MEDIA_FOLDER_NAME = 'temp_files';

@Component({
  selector: 'app-gottesdienste',
  templateUrl: './gottesdienste.page.html',
  styleUrls: ['./gottesdienste.page.scss'],
})
export class GottesdienstePage {
  //use of moment.js library
  momentjs: any = moment;
  timeout;
  modalDataReturned: any
  fixForCurrentTimeZone = new Date().getTimezoneOffset() / -60;
  //here creating object to access file transfer object.
  private fileTransfer: FileTransferObject; 
  timestampLocal;
  isGodiToday;
  eventProgressState;
  Weekday;
  personid;
  isUserLoggedIn = false;
  didReadNextEvent = false;
  checkinActivateSpan = 2.0;  //sets how many hours before event start QR checkin should be visible
  SkriptAvailable = 0;
  SkriptPathLocal;
  ZoomAvailable=0;
  YTAvailable=0;
  ZoomLink;
  YTLink;
  SkriptLink;
  familyQRdata = [];
  groupid;

  fakeNow;
  isFakeNow = false;
  
  AppPageGodiTimestamp = 1601000000000;
  //AppPageGodiWeekdayNextEvent = -1;

  AppPageGodiEvntStart = "";
  AppPageGodiEvntEnd = "";

  AppPageGodiInfoDate = "";
  AppPageGodiInfo = "";
  AppPageGodiInfotext = "";
  AppPageGodiQRcheckin = true;
  AppPageGoDiQRcheckinCode = "false";

  constructor (
    private churchtools:ChurchapiService,
    private events:EventsService,
    private platform: Platform,
    private nativeStorage: NativeStorage,
    private popover:PopoverController,
    private router: Router,
    private file: File,
    private transfer: FileTransfer,
    private fileOpener: FileOpener,
    private iab: InAppBrowser,
    private modalController: ModalController,
    private alertController: AlertController,
    public userState: UserstateService
  ) {
    platform.ready().then(() => {

      console.log('platform is ready -> we are at START..');
      let path = this.file.dataDirectory;
      this.file.checkDir(path, MEDIA_FOLDER_NAME).then(
        err => {
          this.file.createDir(path, MEDIA_FOLDER_NAME, false);
        }
      );

      //getPersonID
      this.nativeStorage.getItem('currentUser').then((user)=>{
        this.personid = user.personid;
        console.log('personID='+this.personid);
        this.isUserLoggedIn = true;
      });

      this.groupid = 183; //currently we preset groups to GoDi im MW

      this.nativeStorage.getItem("AppPageStorage").then((AppPg) => {
        if (AppPg) {
          console.log('CHECK: app storage read OKAY');
          this.AppPageGodiTimestamp = AppPg.godi_timestamp;

          this.AppPageGodiEvntStart = AppPg.godi_start;
          this.AppPageGodiEvntEnd = AppPg.godi_end;

          this.AppPageGodiInfoDate = AppPg.godi_infodate;
          this.AppPageGodiInfo = AppPg.godi_info;
          this.AppPageGodiInfotext = AppPg.godi_infotext;

          //2021-03-31 check if QR checkin is activated for Motorwerk GoDi
          if (AppPg.godi_qrcheckin  == "false") {
            console.log('@Init QR Checkin false.. should it not be true? goto check!!');
            this.getGoDiEventDetails();
          }
          //this.AppPageGodiQRcheckin = AppPg.godi_qrcheckin;
          //this.AppPageGodiQRcheckin = true; //2021-03-29 force true - else we never have checkin.. (need to fix)

          this.AppPageGoDiQRcheckinCode = AppPg.godi_qrcheckincode;
          if (this.AppPageGoDiQRcheckinCode == '' || this.isUserLoggedIn == false) {this.AppPageGoDiQRcheckinCode = "false"}
          console.log('infos from AppStorage: timestamp:'+this.AppPageGodiTimestamp+' Startzeit:'+this.AppPageGodiEvntStart+' Ende:'+this.AppPageGodiEvntEnd+' InfoDate:'+this.AppPageGodiInfoDate+' AppPageGodiInfo:'+this.AppPageGodiInfo+' AppPageGodiInfotext='+this.AppPageGodiInfotext+' AppPageGodiQRcheckin:'+this.AppPageGodiQRcheckin+ ' AppPageGoDiQRcheckinCode:'+this.AppPageGoDiQRcheckinCode);
          console.log('now setup things');
          this.setUpThings();
        } else {
          console.log('CHECK: app storage read NOT POSSIBLE');
          this.setTimeStamp();
          this.AppPageGodiTimestamp = this.timestampLocal;
          this.getNextGoDiEvents(0);
          this.getGoDiEventDetails();
          if(this.AppPageGodiQRcheckin) {
            //this.getQRCodesForFamily();
            this.getQRCode(this.personid, this.groupid);
          }
        }
      }, (error) => {
        console.log('CHECK: app storage read ERROR');
        this.setTimeStamp();
        this.AppPageGodiTimestamp = this.timestampLocal;
        this.getNextGoDiEvents(0);
        this.getGoDiEventDetails();
        if(this.AppPageGodiQRcheckin) {
          //this.getQRCodesForFamily();
          this.getQRCode(this.personid, this.groupid);
        }
      });
    });

    //this.platform.backButton.subscribeWithPriority(10, () => {
    //  this.router.navigate(["/tabs/tab1"]);
    //});
  }

  checkin(){
    this.popover.create({component:GdCheckinPage,
      componentProps: {
        QRcode: this.AppPageGoDiQRcheckinCode,
        QRFamilyData: this.familyQRdata,
        QRGroupID: this.groupid
      },
      cssClass: 'modal_qr_popover',
      backdropDismiss:true,
      showBackdrop:false
      }).then((popoverElement)=>{
        //popoverElement.onDidDismiss().then((ret)=>{
        //  console.log(JSON.parse(JSON.stringify(ret)).data );
        //});
        popoverElement.present();
      })
  }

  //save GoDi Info
  public saveGoDiInfo() {
    console.log('>>>>>> SAVE!!! saveGoDiInfo: godi_timestamp: '+this.AppPageGodiTimestamp+', godi_start:'+this.AppPageGodiEvntStart+', godi_end:'+ this.AppPageGodiEvntEnd + ', godi_infodate: '+this.AppPageGodiInfoDate+', godi_info: '+this.AppPageGodiInfo+', godi_infotext: '+this.AppPageGodiInfotext+', godi_qrcheckin: '+this.AppPageGodiQRcheckin+', godi_qrcheckincode: '+this.AppPageGoDiQRcheckinCode);
    this.nativeStorage.setItem('AppPageStorage', {godi_timestamp: this.AppPageGodiTimestamp, godi_start: this.AppPageGodiEvntStart, godi_end: this.AppPageGodiEvntEnd, godi_infodate: this.AppPageGodiInfoDate, godi_info: this.AppPageGodiInfo, godi_infotext: this.AppPageGodiInfotext, godi_qrcheckin: this.AppPageGodiQRcheckin, godi_qrcheckincode: this.AppPageGoDiQRcheckinCode}).then(
      () => console.log('Stored AppPageStorage item!'),
      error => console.error('Error storing AppPageStorage item', error)
    );
  }

  //read GoDi Events within next 7 days
  public getNextGoDiEvents(readNextDay) {
    this.churchtools.getNextGoDiEvents().then((result)=>{
      console.log('nextGoDi Services (readNextDay? '+readNextDay+'): ' + JSON.stringify(result.data));
      //let retval = JSON.parse(JSON.stringify(result)).data ;
      //this.momentjs.tz.setDefault('Europe/Berlin');
      let i=0;
      let starttime = this.momentjs( (JSON.parse(result.data)[i].start) * 1000).subtract(this.fixForCurrentTimeZone, 'h');
      //get next Event > consider if result still holds current event - if so, then read next id.
      if (readNextDay>0) {
        if (this.momentjs( starttime ).format('YYMMDD') == this.momentjs( this.timestampLocal ).format('YYMMDD') ) {
          i=1;
          starttime = this.momentjs( (JSON.parse(result.data)[i].start) * 1000).subtract(this.fixForCurrentTimeZone, 'h');
        }
      }
      let endtime = this.momentjs( (JSON.parse(result.data)[i].ende) * 1000).subtract(this.fixForCurrentTimeZone, 'h');
      this.AppPageGodiEvntStart = starttime;
      this.AppPageGodiEvntEnd = endtime;
      let infotext =  JSON.parse(result.data)[i].notes ;
      let infodate = this.momentjs( starttime ).format('DD.MM.YYYY');
      let info = this.momentjs( starttime ).format('HH:mm') + ' Uhr, ' + JSON.parse(result.data)[i].bezeichng ;
      //this.AppPageGodiWeekdayNextEvent = this.momentjs( starttime ).format('d') ;
  console.log('weekday next event = '+this.momentjs( starttime ).format('d')+' Date: '+info+ '  (start:'+starttime+' , end:'+endtime+')');
      //toto
      this.AppPageGodiInfoDate = infodate;
      this.AppPageGodiInfo = info;
      this.AppPageGodiInfotext = infotext;
  console.log('infos nun da??? '+this.AppPageGodiInfotext);
      //todo: muss aber bei QR Code nochmal gespeichert werden..
      this.saveGoDiInfo();
    });
  }

  //read details for Event
  public getGoDiEventDetails() {
    this.churchtools.getGoDiEventDetails('183').then((result)=>{
      //console.log("GoDi Event Info:" +JSON.stringify(JSON.parse(result.data)));
      this.AppPageGodiQRcheckin = (JSON.parse(result.data)).data.settings.qrCodeCheckin;
      console.log('qr checkin? '+this.AppPageGodiQRcheckin);
    });
  }

  //check if person is in Group
  //not needed - if Person is not in Group, we get an error with getQRCode. That's enough information that we need
  public checkPersonInGroup() {
    console.log('check person '+this.personid+' in group?');
    this.churchtools.checkPersonInGroup(this.personid).then((result)=>{
      //console.log("check person:" +JSON.stringify(JSON.parse(result.data)));
      let daten = (JSON.parse(result.data))[0].group.domainIdentifier;
      console.log( 'daten: '+daten );
      //let daten = (JSON.parse(result.data));

      //console.log('len=' + (JSON.parse(result.data)).length );
      //console.log('for in daten..');
      //for (var data of (JSON.stringify(result.data))) {
        //console.log('loop: '+data);
        //group.domainIdentifier
        //console.log(data);
      //}

    });
  }

  //getQRCode for Person
  public getQRCode(personID, groupID) {
    console.log('in get qr code.. for person '+personID);
    this.churchtools.getQRCode(personID, groupID).then((result)=>{
      //console.log('res='+result);
      console.log('qrcode: '+JSON.parse(JSON.stringify(JSON.parse(result.data))).data.token );
        this.AppPageGoDiQRcheckinCode = (JSON.parse(result.data)).data.token + '/' + personID + '/' + groupID;
        //qr code mit dazu sichern
        this.saveGoDiInfo();
    }).catch((err)=>{
      console.log("Error getting qrcode"+JSON.stringify(err));
        this.AppPageGoDiQRcheckinCode = "false";
    })
  }

  //getQRCodes for Person and his/her relatives
  public getQRCodesForFamily() {
    console.log('get qr code for whole family..');
    this.familyQRdata = [];
    //console.log(this.familyQRdata);
    let zeile = [{"personid":"","name":"","qrcode":"","validity":"", "is3gok":false}];
    //let ablauf = this.momentjs('2021-11-13T09:50:00Z').subtract(this.fixForCurrentTimeZone, 'h');
    //console.log('ablaufdatum = ' + ablauf.format('DD.MM.YYYY HH:mm'));
    //console.log('ohne format='+ablauf);

    //1. add current person to array
    zeile[0].personid=this.personid;
    zeile[0].name=this.userState.fullusername;
    //zeile[0].qrcode=this.AppPageGoDiQRcheckinCode;
    this.churchtools.getQRCode(this.personid, this.groupid).then((result)=>{
      let tempdata = JSON.parse(JSON.stringify(JSON.parse(result.data))).data.token;
      //console.log('2) qrcode wert: ' + tempdata );
      zeile[0].qrcode=tempdata;
      this.familyQRdata.push(zeile[0]);
    })

    //2. add relatives to array
    ​this.churchtools.getRelationships(this.personid).then((result)=>{
      //console.log('relationships: '+JSON.stringify(result));
      //console.log('einzeln A: '+JSON.stringify(JSON.parse(result.data)) );

      let daten = (JSON.parse(result.data));
      for (var i=0; i < daten.data.length; i++) {

          let zeile = [{"personid":"","name":"","qrcode":"","3g_until":"", "is3gok":false}];
          zeile[0].personid=daten.data[i].relative.domainIdentifier;
          zeile[0].name=daten.data[i].relative.title;
          //get QRCode for person
          //console.log('now go to get qrcode for '+daten.data[i].relative.domainIdentifier);
          this.churchtools.getQRCode(daten.data[i].relative.domainIdentifier, this.groupid).then((result)=>{
            let tempdata = JSON.parse(JSON.stringify(JSON.parse(result.data))).data.token;
            console.log('2) qrcode wert: ' + tempdata );
            zeile[0].qrcode=tempdata;
//            this.churchtools
            //zeile[0]['validity'] = ablauf;
            this.familyQRdata.push(zeile[0]);
          })
     }
     
    })

  }

  /**
   * we get here every time, the GodiPage is entered and AppPage Infos are read from storage
   * what happens here?
   * 1. if current day = day where the upcoming event happens
   *    NO:  set isGodiToday=0 and leave page with infos as it is
   *    YES: set isGodiToday=1
   *         and check if current time within Event timeframe (1/2hr before start until end)
   *         if YES: set eventProgressState=0 (x min before start) or 1, if NO: before? set eventProgressState=-1, after? set eventProgressState=2
  **/
  public setUpThings(){
    console.log('>>>> in SetupThings<<<< (eventStart:'+this.AppPageGodiEvntStart+')');
    if (this.AppPageGodiEvntStart==undefined) {this.AppPageGodiTimestamp = 12345;}
    //set local timestamp
    this.setTimeStamp();

    this.Weekday = this.momentjs(this.timestampLocal).format('d');
    let Hour = ( (this.momentjs(this.timestampLocal).format('H')*1.0)+(this.momentjs( this.timestampLocal ).format('m')/60) );

    //last timestamp same day?
    if (this.momentjs( this.AppPageGodiTimestamp ).format('YYMMDD') != this.momentjs( this.timestampLocal ).format('YYMMDD') ) {
      //alert('different timestamp -> read from CT');
      //different read timestamp!
      console.log('last timestamp '+this.momentjs( this.AppPageGodiTimestamp ).format('YYMMDD') +' is not same date as now '+this.momentjs( this.timestampLocal ).format('YYMMDD') );
      //set new timestamp in db
      this.AppPageGodiTimestamp = this.timestampLocal;
      //read GoDi Info
      this.getNextGoDiEvents(0);
      this.didReadNextEvent = false;
    }

    
    let evnt_day  = this.momentjs( this.AppPageGodiEvntStart ).format('d');
    let evnt_hour = ( (this.momentjs( this.AppPageGodiEvntStart ).format('H')*1.0)+(this.momentjs( this.AppPageGodiEvntStart ).format('m')/60) );
    let evnt_end  = ( (this.momentjs( this.AppPageGodiEvntEnd ).format('H')*1.0)+(this.momentjs( this.AppPageGodiEvntEnd ).format('m')/60) );

    //1. check: is church service today?
    console.log('Event:  Tag='+evnt_day+' Zeit='+evnt_hour);
    console.log('Aktuell Tag='+this.Weekday+' Zeit='+Hour );

    //1. if current day = day where the upcoming event happens?
    if (this.Weekday == evnt_day) {
      clearTimeout(this.timeout);
      this.isGodiToday = 1;

      if (Hour < (evnt_hour - this.checkinActivateSpan)) {
        this.eventProgressState = -1;
        this.setTimeout2Actualize((evnt_hour - this.checkinActivateSpan) - Hour);
      } else if ((Hour >= (evnt_hour - this.checkinActivateSpan)) && (Hour < evnt_end)) {
        this.eventProgressState = 0;
        if (Hour >= evnt_hour) {
          this.eventProgressState = 1;
          this.setTimeout2Actualize(evnt_end - Hour);
        } else {
          this.setTimeout2Actualize(evnt_hour - Hour);
        }
        
      } else {
        this.eventProgressState = 2;
      }
    } else {
      this.isGodiToday = 0;
      this.eventProgressState = '';
    }

    //temp
    if (this.AppPageGodiQRcheckin) {
      this.getQRCodesForFamily();
      //console.log('now familyQRData:');
      //console.log(this.familyQRdata);
    }
    

    console.log('isGodiToday='+this.isGodiToday+' eventProgressState='+this.eventProgressState);
    if (this.isGodiToday == 1) {
      if (this.eventProgressState == 0 || this.eventProgressState == 1) {
        if (this.AppPageGoDiQRcheckinCode == "false" && this.AppPageGodiQRcheckin) {
          //this.getQRCodesForFamily();
          this.getQRCode(this.personid, this.groupid);
        }
        if (this.eventProgressState == 1) {

          if (this.ZoomAvailable==0 || this.YTAvailable==0 || this.SkriptAvailable==0) {
            console.log('hole links für schichten:')
            this.events.getEventLinks().then((result)=>{
              console.log(JSON.stringify(result.data));
              //this.items = JSON.parse(result.data);
              this.SkriptLink = (JSON.parse(result.data)).skript; //here we get also the script link

              let EventLinkDate = (JSON.parse(result.data)).date;
              console.log('Datum für next Link:'+EventLinkDate+' (mit Format='+moment( EventLinkDate, 'DD.MM.YYYY' ).format('YYMMDD')+') GoDi Event='+this.momentjs( this.AppPageGodiEvntStart ).format('YYMMDD'));
              //only show zoom and YT link for the current Event
              if (moment( EventLinkDate, 'DD.MM.YYYY' ).format('YYMMDD') == this.momentjs( this.AppPageGodiEvntStart ).format('YYMMDD')) {
                this.ZoomLink = (JSON.parse(result.data)).zoom;
                this.YTLink = (JSON.parse(result.data)).youtube;
                
                console.log('ZoomLink='+this.ZoomLink);
                console.log('YTLink='+this.YTLink);
                if (this.ZoomLink == 'n/a') {
                  this.ZoomAvailable = -1
                } else {
                  this.ZoomAvailable = 1
                }
                if (this.YTLink == 'n/a') {
                  this.YTAvailable = -1
                } else {
                  this.YTAvailable = 1
                }
              } else {
                this.ZoomAvailable = -1
                this.YTAvailable = -1
              }

              console.log('try to download skript from '+this.SkriptLink);
              //'https://dkskript.000webhostapp.com/predigtskript/predigt.pdf'
              let url = encodeURI(this.SkriptLink);
              //here initializing object. 
              this.fileTransfer = this.transfer.create();  
              // here iam mentioned this line this.file.externalRootDirectory is a native pre-defined file path storage. You can change a file path whatever pre-defined method.  
              this.fileTransfer.download(url, this.file.dataDirectory + MEDIA_FOLDER_NAME + '/' + 'skript.pdf', true).then((entry) => {  
                  //here logging our success downloaded file path in mobile.  
                  console.log('download completed: ' + entry.toURL());
                  this.SkriptPathLocal = entry.toURL();
                  this.SkriptAvailable=1;
              }, (error) => {  
                  //here logging our error its easier to find out what type of error occured.  
                  console.log('download failed: ' + error);
                  this.SkriptAvailable=-1;
              });

            });
          }

        }
      } else if (this.eventProgressState > 1) {
        if (!this.didReadNextEvent) {
          this.getNextGoDiEvents(1);
          this.didReadNextEvent = true;
        }
      }
    }

  }

  @ViewChild(MatAccordion) accordion: MatAccordion;

  setTimeStamp() {
    if (!this.isFakeNow) {
    this.momentjs.tz.setDefault('Europe/Berlin');
    this.timestampLocal = this.momentjs();
    }
  }

  //set timer - if we do not leave page - auto actualize when event starts or ends
  setTimeout2Actualize(timeoutHour) {
    console.log('>timeout: '+timeoutHour);
    let timeoutMs = (timeoutHour * 3600000) + 1500;
    this.timeout = setTimeout(() => {
      this.setUpThings();
    }, timeoutMs);
  }
  

  showGoDiDetails(infoQR) {
    //replace('\n\r', '<br/>').replace('\n', '<br/>').replace('\r', '<br/>')
    let message = this.AppPageGodiInfotext;
    if (infoQR) {
      message = message+'\n\nQR Checkin steht ab '+this.momentjs( this.AppPageGodiEvntStart ).subtract(this.checkinActivateSpan, 'hours').format('DD.MM. HH:mm')+' Uhr zur Verfügung';
    }
    alert(message);
    /*
    this.alertController.create({
      header: 'Info',
      cssClass:'alert-class',
      message: message.replace('\n', '<br/>'),
      buttons: [
        {
          text: 'Ok'
        }
      ],
    }).then(res => {
      res.present();
    });
    */
  }



  /*
  * detect needed updates when we enter GoDi Page without App restart
  */
  ionViewDidEnter() {
    console.log('----> ionViewDidEnter: isUserLoggedIn='+this.isUserLoggedIn+' (qrcode: '+this.AppPageGoDiQRcheckinCode+')'+' GodiToday?'+this.isGodiToday);
    this.setTimeStamp();
    console.log('timestamp saved: '+this.momentjs( this.AppPageGodiTimestamp ).format('YYMMDD') +' und jetzt:'+this.momentjs( this.timestampLocal ).format('YYMMDD'));
    this.AppPageGoDiQRcheckinCode
    //2021-03-29 always go through setup things - else some things are not actualized..
    this.setUpThings();
    /*
    if (this.momentjs( this.AppPageGodiTimestamp ).format('YYMMDD') != this.momentjs( this.timestampLocal ).format('YYMMDD')) {
      //we have a new day - read new data
      console.log('ivde: timestamp differs -> gotoSetup');
      this.setUpThings();
    } else if (this.isGodiToday) {
      //if we are at event day pass through setUpThings each time we enter the page (as we have to react on time changes)
      console.log('ivde: godi today -> gotoSetup anyway');
      this.setUpThings();
    } else if (this.AppPageGodiQRcheckin && !this.isUserLoggedIn) {
      //this occurs if user has just logged in - need to read QR code
      this.nativeStorage.getItem('currentUser').then((user)=>{
        this.personid = user.personid;
        console.log('Yes - logged in!! personID='+this.personid);
        this.isUserLoggedIn = true;
        this.getQRCode(this.personid, this.groupid);
      });
      
    }
    */
  }

  ionViewWillLeave() {
    console.log('clear timeout');
    clearTimeout(this.timeout);
  }

  //display Skript with fileopener
  public showSkript() {
    this.fileOpener
        .open(this.SkriptPathLocal, "application/pdf")
        .then(() => console.log("File is opened"))
        .catch(e => console.log("Error opening file", e));
  }

  launchZoomMeeting1(){
    console.log("launch Zoom Meeting with:");
    console.log(this.ZoomLink);
    this.openWebsite(this.ZoomLink);
  }
  async launchZoomMeeting2(){
    //depreceated
    //let url = 'zoomus://zoom.us/join?confno=81114830864&pwd=N2JBaWgyMjhod0YwcUg3K0lqNlRGUT09&zc';
  
    const modal = await this.modalController.create({
      component: GeneralPage,
      componentProps: {
        "paramTitle": 'english translation',
        "paramText": 'english translation is provided within the Zoom App. Please watch the the short screencast below to learn how to switch to the english translation within zoom and then confirm with the Okay button below the screencast.',
        "paramShowHowto": true
      }
   });
   await modal.present();
   await modal.onDidDismiss();

    console.log("launch Zoom Meeting with:");
    console.log(this.ZoomLink);
    this.openWebsite(this.ZoomLink);
  }
  launchYTlive(){
    console.log("launch Youtube with:");
    console.log(this.YTLink);
    this.openWebsite(this.YTLink);
  }

  openWebsite(url){
    this.platform.ready().then(() => {
      this.iab.create(url,'_system');
    });
  }
  async openModal(modalTitle, modalText, modalShowZoomHowto) {
    const modal = await this.modalController.create({
      component: GeneralPage,
      componentProps: {
        "paramTitle": modalTitle,
        "paramText": modalText,
        "paramShowHowto": modalShowZoomHowto
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.modalDataReturned = dataReturned.data;
        //alert('Modal Sent Data :'+ dataReturned);
      }
    });

    return await modal.present();
  }
  helpZoom() {
    this.openModal('Gottesdienst per Zoom','zum Mithören vor Ort via Zoom.\n\nZoom hat nur eine geringe zeitliche Verzögerung und eignet sich somit gut zum Mithören des Gottesdienstes vor Ort vom eigenen Smartphone aus.\nFür den Empfang von Bild und Ton muss die kostenlose Zoom App auf dem Smarthpone installiert sein. Zudem empfiehlt sich eine WLAN Verbindung zu nutzen um das Datenvolumen zu schonen.\n\nFür weitere Infos sprich bitte die Info an.\n\n~~~~~ english ~~~~~\nFor english speaking guests we provide a live translation over zoom.\nPlease make sure that you have installed the zoom client on your smartphone (free of charge) and have enough mobile data (or use WiFi) before clicking the "english" button.\nAs soon as zoom starts up, you will be able to choose the english translation channel.\nFeel free to contact our info desk for more information.', false);
  }
  helpYT() {
    this.openModal('YouTube Livestream', 'Öffnet den aktuellen Livestream in YouTube\n\nDas ist der bevorzugte Weg, um von zuhause aus an der aktuellen Veranstaltung teilzunehmen.', false);
  }

  doRefresh(event) {
    console.log('Refresh...');
    if (event) {
      this.ionViewDidEnter();
      event.target.complete();
    }
     
  }

  //temp
  public reset() {
    this.AppPageGodiTimestamp = 12345; //reset
    this.nativeStorage.remove('AppPageStorage');
    console.log('made a reset');
  }
    //temp
    public check() {
      this.nativeStorage.getItem('AppPageStorage').then((AppPg)=>{
        console.log('Check Infos from AppStorage: timestamp:'+AppPg.godi_timestamp+' InfoDate:'+AppPg.godi_infodate+
        ' AppPageGodiInfo:'+AppPg.godi_info+' AppPageGodiInfotext='+AppPg.godi_infotext+' AppPageGodiQRcheckin:'+AppPg.godi_qrcheckin+ ' AppPageGoDiQRcheckinCode:'+AppPg.godi_qrcheckincode);
      });
    }
    //temp
    public fakeTimestamp() {
      this.AppPageGodiTimestamp = 1234;
      this.saveGoDiInfo();
    }
    public setFakeNow() {
      this.timestampLocal = this.fakeNow;
      console.log('just set fake Timestamp: '+this.fakeNow);
      this.isFakeNow = true;
    }

}
