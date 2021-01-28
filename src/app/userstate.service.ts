import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ChurchapiService } from './connectors/churchapi.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
//timezone
import * as moment from 'moment-timezone';

@Injectable({
  providedIn: 'root'
})
export class UserstateService {
  //use of moment.js library
  momentjs: any = moment;

  loggedin = false;
  personid = 0;
  hasTuerOeffner = false;
  logintoken = "";
  fullusername = "";
  shortusername = "";
  explicitusername = "";
//  loginstring = "";
  AppPageTUNInit = false;
  AppPageTunTimestamp = 1601000000000;
  AppPageMedienInit = false;
  AppPageGodiTimestamp = 1601000000000;
  AppPageGodiWeekdayNextEvent = -1;
  AppPageGodiInfoDate = "";
  AppPageGodiInfo = "";
  AppPageGodiInfotext = "";
  AppPageGodiQRcheckin = false;
  AppPageGoDiQRcheckinCode = "";
  isOnline = false;

  constructor(
    private churchtools:ChurchapiService,
    private platform :Platform,
    private nativeStorage: NativeStorage
  ) {
    platform.ready().then(() => {
      nativeStorage.getItem('currentUser').then((user)=>{
        this.personid = user.personid;
        this.logintoken = user.logintoken;
        this.fullusername = user.fullusername;
        this.shortusername = user.shortusername;
        this.explicitusername = user.explicitusername;
        this.loggedin = true;
        this.hasTuerOeffner = user.hasTuerOeffner;
        if (this.isOnline) {
          this.churchtools.loginWithToken(this.personid, this.logintoken).then((res)=>{
            console.log("Login With token"+JSON.stringify(res));
            console.log("login status="+ (JSON.parse(res.data)).status)
            if((JSON.parse(res.data)).status=="fail"){
              this.nativeStorage.remove('currentUser');
              this.loggedin = false;
              this.personid = 0;
              this.hasTuerOeffner = false;
              this.logintoken = "";
              this.fullusername = "";
              this.shortusername = "";
              this.explicitusername = "";
              console.log("---> User loged out")
            }
          }).catch((err)=>{
            console.log("Error Login with token"+JSON.stringify(err));
            this.nativeStorage.remove('currentUser');
            this.loggedin = false;
            this.personid = 0;
            this.hasTuerOeffner = false;
            this.logintoken = "";
            this.fullusername = "";
            this.shortusername = "";
            this.explicitusername = "";
            console.log("---> User loged out")
          })
        }

        /*this.churchtools.getPersonViaToken(this.personid, this.logintoken).then((res)=>{
          console.log("Persondata with Token:"+JSON.stringify(res));
        }).catch((err)=>{
          console.log("Error on getPerson with Token "+  JSON.stringify(err));
          this.nativeStorage.remove('currentUser');
          this.loggedin = false;
          this.personid = 0;
          this.hasTuerOeffner = false;
          this.logintoken = "";
          this.fullusername = "";
          this.shortusername = "";
        })*/
      })

      nativeStorage.getItem('AppPageStorage').then((AppPg)=>{
        this.AppPageGodiTimestamp = AppPg.godi_timestamp;
        this.AppPageGodiInfoDate = AppPg.godi_infodate;
        this.AppPageGodiInfo = AppPg.godi_info;
        this.AppPageGodiInfotext = AppPg.godi_infotext;
        this.AppPageGodiQRcheckin = AppPg.godi_qrcheckin;
        this.AppPageGoDiQRcheckinCode = AppPg.godi_qrcheckincode;
      })

    });
  }

  public userLogginSuccessful(personid){
    this.personid = personid;
    this.loggedin = true;
    console.log("person id: "+personid)
    this.churchtools.getGroupsForLoggedInPerson(personid).then((res)=>{
      this.churchtools.getPersonData(personid).then((res)=>{
        console.log("persondata:" +JSON.stringify(JSON.parse(res.data)));
        this.fullusername = (JSON.parse(res.data)).data.firstName + " " +(JSON.parse(res.data)).data.lastName
        //23.01.2021 - get new db fiel praycal_name
        var tmp = (JSON.parse(res.data)).data.praycal_name
        if (tmp) {
          console.log("pracal_name="+this.shortusername);
          this.explicitusername = tmp;
        }
        var lastname=(JSON.parse(res.data)).data.lastName
        this.shortusername = (JSON.parse(res.data)).data.firstName + " " +lastname.substr(0,1)+"."  
        console.log("shortname="+this.shortusername)
        this.nativeStorage.setItem('currentUser', {personid: this.personid, logintoken: this.logintoken, fullusername: this.fullusername, hasTuerOeffner:this.hasTuerOeffner, shortusername:this.shortusername, explicitusername:this.explicitusername})
        this.nativeStorage.setItem('AppPageStorage', {godi_timestamp: this.AppPageGodiTimestamp, godi_infodate: this.AppPageGodiInfoDate, godi_info: this.AppPageGodiInfo, godi_infotext: this.AppPageGodiInfotext, godi_qrcheckin: this.AppPageGodiQRcheckin, godi_qrcheckincode: this.AppPageGoDiQRcheckinCode})
  .then(
    () => console.log('Stored item!'),
    error => console.error('Error storing item', error)
  );
      })
      var resultObj = JSON.parse(res.data)
      console.log("Get Group for Loggedin " +JSON.stringify(resultObj));
      
      var hasZugang = false; 
      resultObj.data.forEach((group)=>{
        console.log("Elements " + group.group.domainIdentifier)
        console.log("In for Each with :" + JSON.stringify(group));
        if( "9" == group?.group.domainIdentifier ) {
          console.log("has Zugang");
          hasZugang = true;
          this.nativeStorage.setItem('currentUser', {personid: this.personid, logintoken: this.logintoken, fullusername: this.fullusername, hasTuerOeffner:this.hasTuerOeffner, shortusername:this.shortusername, explicitusername:this.explicitusername})
          this.nativeStorage.setItem('AppPageStorage', {godi_timestamp: this.AppPageGodiTimestamp, godi_infodate: this.AppPageGodiInfoDate, godi_info: this.AppPageGodiInfo, godi_infotext: this.AppPageGodiInfotext, godi_qrcheckin: this.AppPageGodiQRcheckin, godi_qrcheckincode: this.AppPageGoDiQRcheckinCode})
        .then(
    () => console.log('Stored item!'),
    error => console.error('Error storing item', error)
  );
        }
      })
      if(hasZugang){
        this.hasTuerOeffner = true;
        this.churchtools.getLoginToken(personid).then((res)=>{
          console.log(JSON.stringify(res.data));
          this.logintoken = JSON.parse(res.data).data;
          console.log("Has Tueroeffner and Logintoken");
          this.nativeStorage.setItem('currentUser', {personid: this.personid, logintoken: this.logintoken, fullusername: this.fullusername, hasTuerOeffner:this.hasTuerOeffner, shortusername:this.shortusername, explicitusername:this.explicitusername})
          this.nativeStorage.setItem('AppPageStorage', {godi_timestamp: this.AppPageGodiTimestamp, godi_infodate: this.AppPageGodiInfoDate, godi_info: this.AppPageGodiInfo, godi_infotext: this.AppPageGodiInfotext, godi_qrcheckin: this.AppPageGodiQRcheckin, godi_qrcheckincode: this.AppPageGoDiQRcheckinCode})
        .then(
    () => console.log('Stored item!'),
    error => console.error('Error storing item', error)
  );
        }).catch((err)=>{
          console.log("error on retrieving logintoken");
          this.loggedin = false;
          this.personid = 0;
          this.hasTuerOeffner = false;
          this.logintoken = "";
        });
      }else {
        this.hasTuerOeffner = false;
      }
      /*
      this.churchtools.getLoginString(personid).then((res)=>{
        console.log("loginstring=");
        console.log(JSON.stringify(res.data));
        this.loginstring = JSON.parse(res.data);
      }).catch((err)=>{
        this.loginstring = "";
      })
      */
      ;

    }).catch((err)=>{
      this.hasTuerOeffner = false;
      this.logintoken = "";
      console.log("dropped here " + JSON.stringify(err));
    });
    this.nativeStorage.setItem('currentUser', {personid: this.personid, logintoken: this.logintoken, fullusername: this.fullusername, hasTuerOeffner:this.hasTuerOeffner, shortusername:this.shortusername, explicitusername:this.explicitusername})
    this.nativeStorage.setItem('AppPageStorage', {godi_timestamp: this.AppPageGodiTimestamp, godi_infodate: this.AppPageGodiInfoDate, godi_info: this.AppPageGodiInfo, godi_infotext: this.AppPageGodiInfotext, godi_qrcheckin: this.AppPageGodiQRcheckin, godi_qrcheckincode: this.AppPageGoDiQRcheckinCode})
  .then(
    () => console.log('Stored item!'),
    error => console.error('Error storing item', error)
  );
  }

  public userLoggedOut(){
    this.loggedin = false;
    this.personid = 0;
    this.hasTuerOeffner = false;
    this.logintoken = "";
    this.fullusername = "";
    this.shortusername = "";
    this.explicitusername = "";
    this.nativeStorage.remove('currentUser');
    console.log("user has been logged out");
  }

  //save GoDi Info
  public saveGoDiInfo() {
    this.nativeStorage.setItem('AppPageStorage', {godi_timestamp: this.AppPageGodiTimestamp, godi_infodate: this.AppPageGodiInfoDate, godi_info: this.AppPageGodiInfo, godi_infotext: this.AppPageGodiInfotext, godi_qrcheckin: this.AppPageGodiQRcheckin, godi_qrcheckincode: this.AppPageGoDiQRcheckinCode})
  }

  //read GoDi Events within next 7 days
  public getNextGoDiEvents() {

    this.AppPageGodiWeekdayNextEvent = -1;
    this.churchtools.getNextGoDiEvents().then((result)=>{
      //console.log('nextGoDi Services: ' + JSON.stringify(result.data));
      //let retval = JSON.parse(JSON.stringify(result)).data ;
      //this.momentjs.tz.setDefault('Europe/Berlin');
      let i=0;
      let starttime = this.momentjs( (JSON.parse(result.data)[i].start) * 1000).subtract(1, 'h'); 
      let infotext =  JSON.parse(result.data)[i].notes ;
      let infodate = this.momentjs( starttime ).format('DD.MM.YYYY') ;
      let info = this.momentjs( starttime ).format('HH:mm') + ' Uhr, ' + JSON.parse(result.data)[i].bezeichng ;
      this.AppPageGodiWeekdayNextEvent = this.momentjs( starttime ).format('d') ;
console.log('weekday next event = '+this.AppPageGodiWeekdayNextEvent);
      this.AppPageGodiInfoDate = infodate;
      this.AppPageGodiInfo = info;
      this.AppPageGodiInfotext = infotext;
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
  public getQRCode() {
    console.log('in get qr code..');
    this.churchtools.getQRCode(this.personid,'183').then((result)=>{
      //console.log('res='+result);
      console.log('qrcode: '+JSON.parse(JSON.stringify(JSON.parse(result.data))).data.token );
      
      this.AppPageGoDiQRcheckinCode = (JSON.parse(result.data)).data.token + '/' + this.personid + '/183';
    }).catch((err)=>{
      console.log("Error getting qrcode"+JSON.stringify(err));
      this.AppPageGoDiQRcheckinCode = "false";
    })
  }

}
