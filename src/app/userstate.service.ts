import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ChurchapiService } from './connectors/churchapi.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { File } from '@ionic-native/File/ngx';

//timezone
import * as moment from 'moment-timezone';
import { BehaviorSubject } from 'rxjs';
import * as internal from 'stream';

const MEDIA_FOLDER_NAME = 'temp_files';

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
  isOnline = false;
  //SermonLocalFiles = [];
  SermonLocalFiles: Array<{title: string, pubDate: Date, basedate: string, description: string, url: string, skript: string, youtube: string, savedlocal: Date}> = [];
  public cleanupDays = 14;
  lastCronCheck = new Date("01/01/2000");
  //new Date(new Date().getTime() - (60*60*24*1000));
  //Date.now();

  private homescreen_default = [
    { id: 'Mediathek',     val: 'Mediathek',     isChecked: true },
    { id: 'Termine',       val: 'Termine',       isChecked: true },
    { id: 'Tagundnacht',   val: 'Tagundnacht',   isChecked: true },
    { id: 'Gottesdienste', val: 'Gottesdienste', isChecked: true },
    { id: 'LifeGroups',    val: 'LifeGroups',    isChecked: true },
    { id: 'Ueberuns',      val: 'Über uns',      isChecked: true },
    { id: 'Geben',         val: 'Geben',         isChecked: true },
    { id: 'Erlebt',        val: 'Erlebt',        isChecked: true }
  ];
  //{ id: 'Akademie',      val: 'Akademie',      isChecked: true },
  //{ id: 'Audienz',       val: 'Audienz',       isChecked: true }

  public homescreen = new BehaviorSubject([]);

  constructor(
    private churchtools:ChurchapiService,
    private platform :Platform,
    private nativeStorage: NativeStorage,
    private file: File
  ) {
    
    //this.homescreen.next(JSON.parse(JSON.stringify(this.homescreen_default)));
    this.homescreen.next(this.homescreen_default);

    platform.ready().then(() => {
      //User auslesen
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

      //Settings auslesen
      nativeStorage.getItem('settings')
        .then(
          res => {
            console.log('habe aus native storage settings gelesen:');
            console.log(JSON.stringify(res.settings));
            this.homescreen.next(res.settings);
          },
          err => {
            console.log('settings nicht in item Storage vorhanden!');
          }
        )
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
      .then(
        () => console.log('Stored item currentUser(a)!'),
        error => console.error('Error storing item', error)
      );
    })
    var resultObj = JSON.parse(res.data)
    //console.log("Get Group for Loggedin " +JSON.stringify(resultObj));
    
    var hasZugang = false; 
    resultObj.data.forEach((group)=>{
      //console.log("Elements " + group.group.domainIdentifier)
      //console.log("In for Each with :" + JSON.stringify(group));
      if( "9" == group?.group.domainIdentifier ) {
        console.log("has Zugang");
        hasZugang = true;
        this.nativeStorage.setItem('currentUser', {personid: this.personid, logintoken: this.logintoken, fullusername: this.fullusername, hasTuerOeffner:this.hasTuerOeffner, shortusername:this.shortusername, explicitusername:this.explicitusername})
        .then(
          () => console.log('Stored item currentUser(b)!'),
          error => console.error('Error storing item', error)
        );
      }
    })
    if(hasZugang){
      this.hasTuerOeffner = true;
    } else {
      this.hasTuerOeffner = false;
    }
    this.churchtools.getLoginToken(personid).then((res)=>{
      console.log(JSON.stringify(res.data));
      this.logintoken = JSON.parse(res.data).data;
      console.log("has Logintoken");
      this.nativeStorage.setItem('currentUser', {personid: this.personid, logintoken: this.logintoken, fullusername: this.fullusername, hasTuerOeffner:this.hasTuerOeffner, shortusername:this.shortusername, explicitusername:this.explicitusername})
      .then(
        () => console.log('Stored item currentUser(c)!'),
        error => console.error('Error storing item', error)
      );
    }).catch((err)=>{
      console.log("error on retrieving logintoken");
      this.loggedin = false;
      this.personid = 0;
      this.hasTuerOeffner = false;
      this.logintoken = "";
    });
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
  .then(
    () => console.log('Stored item currentUser(d)!'),
    error => console.error('Error storing item', error)
  );
  }

  public saveHomeSettings(settings) {
    this.homescreen.next(settings);
    console.log('neue Settings: ',settings);
    
    this.nativeStorage.setItem('settings', {settings})
      .then(
        () => console.log('Stored item homescreen!'),
        error => console.error('Error storing item', error)
    );
    
  }
  public resetHomeSettings() {
    console.log('in userstate reset homescreen to: ');
    //this.homescreen.next(JSON.parse(JSON.stringify(this.homescreen_default)));
    this.homescreen.next(this.homescreen_default);
    this.nativeStorage.remove('settings');
  }


 //add a new sermon to the local db
 public addLocalSermon(predigt) {
  //console.log('in userstate - addLocalSermon:');
  //console.log(predigt);

  const data: Array<{title: string, pubDate: Date, basedate: string, description: string, url: string, skript: string, youtube: string, savedlocal: Date}> = [{
    title: predigt.title[0],
    pubDate: new Date(predigt.pubDate[0]),
    basedate: predigt.basedate[0],
    description: predigt.description[0],
    url: predigt.enclosure[0].$.url,
    skript: predigt.skript[0],
    youtube: predigt.youtube[0],
    savedlocal: new Date()
  }];

  //console.log('add... data line=');
  //console.log(data);

  this.SermonLocalFiles.push(data[0]);

  //and now sort
  this.SermonLocalFiles.sort( (b, a)=> parseInt(a.basedate,6) - parseInt(b.basedate,6) );
  //console.log('-sorted-');
  //console.log(this.SermonLocalFiles);

}

//check if the sermon mp3 file is available in the SermonLocalFiles Array
public isFileInArray(mp3file) {
  for(var index in this.SermonLocalFiles) {
    if (this.SermonLocalFiles[index].url === mp3file) {
      //console.log('found on pos '+index);
      return index;
    }
  }
  return -1;
}
//remove a sermon from local Sermon Array by its mp3 name
public removeLocalSermon(fname) {
  let pos = <number>this.isFileInArray(fname);
  if (pos > -1) {
    this.SermonLocalFiles.splice(pos,1);
    //console.log('new=');
    //console.log(this.SermonLocalFiles);
  }
}

 //save localSermons in nativeStorage when leaving Mediathek 
 public saveLocalSermons() {
    //console.log('in userstate - saveLocalSermons: (with stringify:)');
    //console.log(JSON.stringify(this.SermonLocalFiles));

    //console.log('but now only safe simple value');
    //this.nativeStorage.setItem('localSermons', {property: "Wert"} )

    this.nativeStorage.setItem('localSermons', JSON.stringify(this.SermonLocalFiles) )
      .then(
        () => console.log('Stored item localSermons!'),
        error => console.error('Error storing localSermons', error)
    );
    
  }

  public doCronjobs() {
    if (this.SermonLocalFiles.length > 0) {
      //console.log('cronjobs to do?');
      let files2remove = [];
      
      let diffInDays = <number>this.momentjs( Date.now() ).format('YYMMDD') - <number>this.momentjs( this.lastCronCheck ).format('YYMMDD');

      if (diffInDays >= 1) {
        this.lastCronCheck = new Date( Date.now() );
        //console.log('delete files after '+this.cleanupDays+' days');
        
        for(var index in this.SermonLocalFiles) {
          //console.log(this.SermonLocalFiles[index].savedlocal);
          let delOn = new Date ( new Date( this.SermonLocalFiles[index].savedlocal ).getTime() + (this.cleanupDays * 60*60*24*1000) );
          //console.log('file '+this.SermonLocalFiles[index].url+' saved on '+ this.SermonLocalFiles[index].savedlocal+ 'and del on '+delOn );
          if ( new Date() > delOn ) {
            //console.log('have to del '+this.SermonLocalFiles[index].url);
            files2remove.push( {mp3name: this.SermonLocalFiles[index].url, skript: this.SermonLocalFiles[index].skript} );
          }
        }
      }

      //now are there files to del?
      for(var index in files2remove) {
        //console.log('del '+files2remove[index].mp3name);
        if (files2remove[index].skript != "") {
          this.file.removeFile(this.file.documentsDirectory + MEDIA_FOLDER_NAME, files2remove[index].skript.split('/').pop()).then((ret) => {
            //console.log('skript deleted?');
            //console.log(ret);
          }, (error) => {
            console.log('error deleting: '+error);
          });
        }

        let fname = files2remove[index].mp3name.split('/').pop();
        this.file.removeFile(this.file.documentsDirectory + MEDIA_FOLDER_NAME, fname).then((ret) => {
          //console.log('file '+this.file.documentsDirectory + MEDIA_FOLDER_NAME, fname+' deleted?');
          //console.log(ret);

          this.removeLocalSermon(files2remove[index].mp3name);
          this.saveLocalSermons();
          this.AppPageMedienInit = true;

        }, (error) => {
          console.log('error deleting: '+error);
        });
      }
    }
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
    this.nativeStorage.remove('CheckinDataStorage');
    console.log("user has been logged out");
  }

}
