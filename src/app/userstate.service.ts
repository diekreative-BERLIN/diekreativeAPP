import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ChurchapiService } from './connectors/churchapi.service';
import { CampusService } from './campus.service';

import { Preferences } from '@capacitor/preferences';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
//timezone
// import * as moment from 'moment-timezone';
import { BehaviorSubject } from 'rxjs';
import { Network } from '@capacitor/network';

const MEDIA_FOLDER_NAME = 'temp_files';

@Injectable({
  providedIn: 'root'
})
export class UserstateService {
  //use of moment.js library
  // momentjs: any = moment;

  loggedin = false;
  personid = 0;
  isGebetLeiter = false;
  hasTuerOeffner = false;
  hasTuerOeffnerHN = false;
  isMinistryTeam = false;
  logintoken = "";
  fullusername = "";
  shortusername = "";
  explicitusername = "";
//  loginstring = "";
  AppPageMedienInit = false;  
  isOnline = false;
  //SermonLocalFiles = [];
  SermonLocalFiles: Array<{title: string, pubDate: Date, basedate: string, description: string, url: string, skript: string, youtube: string, savedlocal: Date}> = [];
  public cleanupDays = 14;
  lastCronCheck = new Date("01/01/2000");
  //new Date(new Date().getTime() - (60*60*24*1000));
  //Date.now();

  private homescreen_default = [
    { id: 'Mediathek',     val: 'Mediathek',     isChecked: true, permissionID: 0 },
    { id: 'Termine',       val: 'Termine',       isChecked: true, permissionID: 0 },
    { id: 'Tagundnacht',   val: 'Tagundnacht',   isChecked: true, permissionID: 0 },
    { id: 'Gottesdienste', val: 'Gottesdienste', isChecked: true, permissionID: 0 },
    { id: 'LifeGroups',    val: 'LifeGroups',    isChecked: true, permissionID: 0 },
    { id: 'Ueberuns',      val: 'Über uns',      isChecked: true, permissionID: 0 },
    { id: 'Geben',         val: 'Geben',         isChecked: true, permissionID: 0 },
    { id: 'Erlebt',        val: 'Erlebt',        isChecked: true, permissionID: 0 },
    { id: 'Kursplattform', val: 'Kursplattform', isChecked: true, permissionID: 0 },
    { id: 'Ministryteam',  val: 'Ministryteam',  isChecked: true, permissionID: 1 }
  ];
  //{ id: 'Akademie',      val: 'Akademie',      isChecked: true },
  //{ id: 'Audienz',       val: 'Audienz',       isChecked: true }

  public homescreen = new BehaviorSubject([]);

  constructor(
    private churchtools:ChurchapiService,
    private platform :Platform,
    private campusService: CampusService,
  ) {
    this.SermonLocalFiles = [];
    //this.homescreen.next(JSON.parse(JSON.stringify(this.homescreen_default)));
    this.homescreen.next(this.homescreen_default);

    platform.ready().then(async () => {
      //User auslesen
      await Preferences.get({key: 'usertoken'}).then((result)=>{
        console.log("in platformReady -> get usetoken user aus preferences db:");
        console.log(result);
        // Fehlt der Eintrag, darf das Lesen nicht abbrechen (sonst wird currentUser nie geladen).
        let usetoken = null;
        try { usetoken = JSON.parse(result.value); } catch (e) { usetoken = null; }
        this.logintoken = usetoken?.logintoken || "";
      })
      await Preferences.get({key: 'currentUser'}).then((result)=>{
        console.log("in platformReady -> get current user aus preferences db:");
        console.log(result);

        const user = JSON.parse(result.value);
        if(user){
          console.log('now in detail user data after being parsed:');
          console.log(user);
        this.personid = user.personid;
        //this.logintoken = user.logintoken;
        this.fullusername = user.fullusername;
        this.shortusername = user.shortusername;
        this.explicitusername = user.explicitusername;
        this.loggedin = true;
        this.isGebetLeiter = user.isGebetLeiter;
        this.hasTuerOeffner = user.hasTuerOeffner;
        this.hasTuerOeffnerHN = user.hasTuerOeffnerHN;
        this.isMinistryTeam = user.isMinistryTeam;
        if (this.isOnline) {
          this.churchtools.loginWithToken(this.personid, this.logintoken).then(async (res)=>{
            console.log("Login With token: of person "+this.personid+" and logintoken "+this.logintoken+"res:");
            console.log(res);
            //console.log("login status="+ (JSON.parse(res.data)).status)
            if(res.status == 200){
              await this.userLoginSuccessful(this.personid);
            } else {
              await Preferences.remove({key: 'currentUser'});
              this.loggedin = false;
              this.personid = 0;
              this.isGebetLeiter = false;
              this.hasTuerOeffner = false;
              this.hasTuerOeffnerHN = false;
              this.isMinistryTeam = false;
              this.logintoken = "";
              this.fullusername = "";
              this.shortusername = "";
              this.explicitusername = "";
              console.log("---> User loged out A")
              alert('Hinweis: Du wurdest ausgeloggt. Logge Dich erneut für den Türöffner & Co. (Fehler-Nr 1)');
            }
          }).catch(async (err)=>{
            console.log("Error Login with token"+JSON.stringify(err));
            await Preferences.remove({key: 'currentUser'});
            this.loggedin = false;
            this.personid = 0;
            this.isGebetLeiter = false;
            this.hasTuerOeffner = false;
            this.hasTuerOeffnerHN = false;
            this.isMinistryTeam = false;
            this.logintoken = "";
            this.fullusername = "";
            this.shortusername = "";
            this.explicitusername = "";
            console.log("---> User loged out B")
              alert('Hinweis: Du wurdest ausgeloggt. Logge Dich erneut für den Türöffner & Co. (Fehler-Nr 2)');
          })
          }
        }

        /*this.churchtools.getPersonViaToken(this.personid, this.logintoken).then((res)=>{
          console.log("Persondata with Token:"+JSON.stringify(res));
        }).catch((err)=>{
          console.log("Error on getPerson with Token "+  JSON.stringify(err));
          this.nativeStorage.remove('currentUser');
          this.loggedin = false;
          this.personid = 0;
          this.hasTuerOeffner = false;
          this.isMinistryTeam = false;
          this.logintoken = "";
          this.fullusername = "";
          this.shortusername = "";
        })*/
      })

      //Settings auslesen
      await Preferences.get({key:'settings'})
        .then(
          result => {
            if(result.value == null) {
              console.log('settings nicht in item Storage vorhanden!');
              return;
            }
            const res = JSON.parse(result.value);
            console.log('habe aus native storage settings gelesen:');
            console.log(JSON.stringify(res.settings));
            this.homescreen.next(this.mergeWithDefaultHomescreen(res.settings));
          }
        )
      });

  }

  /** Liest den Token aus einer Antwort der Form {"data": "<token>"} (Objekt oder JSON-Text). */
  private extractLoginToken(res: any): string {
    if (!res || res.status < 200 || res.status >= 300) {
      return "";
    }
    let body = res.data;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { return ""; }
    }
    const token = body?.data;
    return (typeof token === 'string' && token.length > 0) ? token : "";
  }

  public async userLoginSuccessful(personid,username?,password?){
    if (personid === undefined) {
      console.log('in userLoginSuccessful ist personid undefined. Exit')
      this.loggedin = false;
      this.personid = 0;
      this.isGebetLeiter = false;
      this.hasTuerOeffner = false;
      this.hasTuerOeffnerHN = false;
      this.isMinistryTeam = false;
      this.logintoken = "";
      return;
    }
    this.personid = personid;
    this.loggedin = true;
    console.log(">person id: "+personid)
    this.churchtools.getGroupsForLoggedInPerson(personid).then( (res)=>{

      console.log('!machte ein getGroupsForLoggedInPerson auf eigene API! mit personid '+personid );
      console.log(res);

      this.churchtools.getPersonData(personid).then(async (res2)=>{

        console.log('machte ein getPersonData auf eigene API! mit personid '+personid );
        console.log(res2);

        //console.log("persondata:" + JSON.stringify(res.data) );
        this.fullusername = res2.data.data.firstName + " " + res2.data.data.lastName;
        //23.01.2021 - get new db field praycal_name
        var tmp = res2.data.data.praycal_name;
        if (tmp) {
          console.log("pracal_name="+tmp);
          this.explicitusername = tmp;
        }
        var lastname=res2.data.data.lastName;
        this.shortusername = res2.data.data.firstName + " " +lastname.substr(0,1)+"."  
        console.log("shortname="+this.shortusername);

        // Standort (Campus): Bei einem echten Login (mit Benutzername/Passwort) den Standort
        // der Person vorauswählen. Beim automatischen Login mit Token beim App-Start bleibt
        // die Auswahl aus den Einstellungen erhalten, nur die Standortliste wird aufgefrischt.
        if (username !== undefined && password !== undefined) {
          let campusId = res2.data.data.campusId;
          if (!('campusId' in res2.data.data)) {
            campusId = await this.campusService.ladeCampusIdDerPerson(personid, this.logintoken);
          }
          console.log('Standort (campusId) der Person: ' + campusId);
          this.campusService.uebernehmeCampusDerPerson(campusId, this.logintoken);
        } else {
          this.campusService.ladeCampusse(this.logintoken);
        }
        //logintoken MUSS in currentUser gespeichert werden. Wenn er noch nicht bekannt ist, dann später ergänzen!!
        //console.log("logintoken schon bekannt? "+this.logintoken);

        await Preferences.set({key: 'currentUser', value: JSON.stringify({personid: this.personid, fullusername: this.fullusername, 
          isGebetLeiter:this.isGebetLeiter,
          hasTuerOeffner:this.hasTuerOeffner,
          hasTuerOeffnerHN:this.hasTuerOeffnerHN,
          isMinistryTeam:this.isMinistryTeam, shortusername:this.shortusername, explicitusername:this.explicitusername})})
        .then(
          () => console.log('Stored item currentUser(a)!'),
          error => console.error('Error storing item', error)
        );
        
    })

   //console.log("Get Group for Loggedin ")
   //console.log(res.data.data);
    
    var hasZugang = false;
    var isMinistryTeam = false;

    //console.log("foreach:");
    res.data.data.forEach(async (element)=>{
      //9=Zugang Gebetshaus
      //1135=Zugang Bauwagen Gebet Hohen Neuendorf
      //42=tagundnacht Gebetsleiter
      //52=Ministry Team
      //console.log(element.group);

      if( "9" == element?.group.domainIdentifier ) { //9=Merkmal: Zugang Gebetsraum
        this.hasTuerOeffner = true;
      }
      if( "1135" == element?.group.domainIdentifier ) { //1135=Zugang Bauwagen Gebet Hohen Neuendorf
        this.hasTuerOeffnerHN = true;
      }
      if( "42" == element?.group.domainIdentifier ) { //42=tagundnacht Gebetsleiter
        this.isGebetLeiter = true;
      }
      if( "52" == element?.group.domainIdentifier ) { //52=Ministry Team
        this.isMinistryTeam = true;
      }
      /*
      if( "9" == element?.group.domainIdentifier ) { //9=Merkmal: Zugang Gebetsraum
        console.log("has Zugang");
        hasZugang = true;
        await Preferences.set({key: 'currentUser', value: JSON.stringify({personid: this.personid, logintoken: this.logintoken, fullusername: this.fullusername, hasTuerOeffner:this.hasTuerOeffner, isMinistryTeam:this.isMinistryTeam, shortusername:this.shortusername, explicitusername:this.explicitusername})})
        .then(
          () => console.log('Stored item currentUser(b)!'),
          error => console.error('Error storing item', error)
        );
      }
      if( "52" == element?.group.domainIdentifier ) { //52=Merkmal: Ministry Team
        console.log('is in Ministry Team');
        isMinistryTeam = true;
        await Preferences.set({key: 'currentUser', value: JSON.stringify({personid: this.personid, logintoken: this.logintoken, fullusername: this.fullusername, hasTuerOeffner:this.hasTuerOeffner, isMinistryTeam:this.isMinistryTeam, shortusername:this.shortusername, explicitusername:this.explicitusername})})
        .then(
          () => console.log('Stored item currentUser(b)!'),
          error => console.error('Error storing item', error)
        );
      }
      */
    })
    
    /*
    if(hasZugang){
      this.hasTuerOeffner = true;
    } else {
      this.hasTuerOeffner = false;
    }
    if(isMinistryTeam){
      this.isMinistryTeam = true;
    } else {
      this.isMinistryTeam = false;
    }
    */
    
    if ((personid !== undefined) && (username !== undefined) && (password !== undefined)) {
      this.churchtools.getLoginToken(personid,username,password).then(async (res)=>{
        //console.log("churchtools.getLoginToken mit personid:"+personid+" username:"+username+" pswd:"+password+" ergibt logintoken: "+res.data.data);
        let token = this.extractLoginToken(res);
        if (!token) {
          // Die eigene API meldet sich nur mit Benutzername/Passwort bei ChurchTools an
          // und liefert z. B. bei aktiver 2-Faktor-Anmeldung keinen Token (trotz Status 200).
          // Dann den Token direkt über die ChurchTools-Sitzung der App holen.
          console.log("logintoken: eigene API ohne Token (Status " + res?.status + "), versuche ChurchTools-Sitzung");
          try {
            token = this.extractLoginToken(await this.churchtools.getLoginTokenViaSession(personid));
          } catch (e) {
            console.log("logintoken: Abruf über ChurchTools-Sitzung fehlgeschlagen", e);
          }
        }
        console.log("logintoken vorhanden: " + !!token);
        this.logintoken = token || "";
        this.campusService.ladeCampusse(this.logintoken);
        //console.log("has Logintoken");
        await Preferences.set({key: 'usertoken', value: JSON.stringify({logintoken: this.logintoken})})
        .then(
          () => console.log('Stored item usertoken(c)!'),
          error => console.error('Error storing item', error)
        );
      }).catch((err)=>{
        console.log("error on retrieving logintoken");
        this.loggedin = false;
        this.personid = 0;
        this.isGebetLeiter = false;
        this.hasTuerOeffner = false;
        this.hasTuerOeffnerHN = false;
        this.isMinistryTeam = false;
        this.logintoken = "";
              alert('Hinweis: Du wurdest ausgeloggt. Logge Dich erneut für den Türöffner & Co. (logintoken Fehler-Nr 3)');
      });
    }

    //Update Preferences set hier
    Preferences.set({key: 'currentUser', value: JSON.stringify({personid: this.personid, fullusername: this.fullusername, 
      isGebetLeiter:this.isGebetLeiter,
      hasTuerOeffner:this.hasTuerOeffner,
      hasTuerOeffnerHN:this.hasTuerOeffnerHN,
      isMinistryTeam:this.isMinistryTeam, shortusername:this.shortusername, explicitusername:this.explicitusername})})
    .then(
      () => console.log(
        'Stored item currentUser(d)! (GebLeit:'+this.isGebetLeiter+
        ' TuerSB7 '+this.hasTuerOeffner+
        ' TuerHN '+this.hasTuerOeffnerHN+
        ' Ministry '+this.isMinistryTeam
      ),
      error => console.error('Error storing item', error)
      );

    
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
    this.isGebetLeiter = false;
    this.hasTuerOeffner = false;
    this.hasTuerOeffnerHN = false;
    this.logintoken = "";
    console.log("dropped here with error " + JSON.stringify(err));
    alert('Hinweis: Du wurdest ausgeloggt. Logge Dich erneut für den Türöffner & Co. (Fehler-Nr 4)');
  });
  await Preferences.set({key: 'currentUser', value: JSON.stringify({personid: this.personid, fullusername: this.fullusername,
    isGebetLeiter:this.isGebetLeiter,
    hasTuerOeffner:this.hasTuerOeffner,
    hasTuerOeffnerHN:this.hasTuerOeffnerHN,
    isMinistryTeam:this.isMinistryTeam, shortusername:this.shortusername, explicitusername:this.explicitusername})})
  .then(
    () => console.log('Stored item currentUser(d)!'),
    error => console.error('Error storing item', error)
  );
  }

  public async saveHomeSettings(settings) {
    this.homescreen.next(settings);
    console.log('neue Settings: ',settings);
    await Preferences.set({key: 'settings', value: JSON.stringify({settings})})
      .then(
        () => console.log('Stored item homescreen!'),
        error => console.error('Error storing item', error)
    );
    
  }
  // Gespeicherte Startseiten-Einstellungen um neu hinzugekommene Kacheln ergänzen,
  // damit bestehende Nutzer neue Kacheln (z. B. Kursplattform) auch sehen.
  private mergeWithDefaultHomescreen(saved) {
    if (!Array.isArray(saved)) {
      return this.homescreen_default;
    }
    const known = new Set(saved.map((entry) => entry?.id));
    const missing = this.homescreen_default.filter((entry) => !known.has(entry.id));
    return saved.concat(missing.map((entry) => ({ ...entry })));
  }

  public async resetHomeSettings() {
    console.log('in userstate reset homescreen to: ');
    //this.homescreen.next(JSON.parse(JSON.stringify(this.homescreen_default)));
    this.homescreen.next(this.homescreen_default);
    await Preferences.remove({key:'settings'});
  }

  //checks if user has permissionID to display Element X on homescreen
  public hasPermission(permissionID) {
    switch (permissionID) {

      case 0 :
        return true;
      case 1 :
        // Part of Ministry Team?
        return this.isMinistryTeam;
    }
  }


 //add a new sermon to the local db
 public addLocalSermon(predigt) {
  console.log('in userstate - addLocalSermon:',predigt);

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
  
  if(this.SermonLocalFiles == null) {
    this.SermonLocalFiles = data;
  } else {
    this.SermonLocalFiles.push(...data);
  }

  //and now sort
  this.SermonLocalFiles.sort( (b, a)=> parseInt(a.basedate,6) - parseInt(b.basedate,6) );
}

//check if the sermon mp3 file is available in the SermonLocalFiles Array
public isFileInArray(mp3file:string) {
  console.log(this.SermonLocalFiles);
  const filename = mp3file.split('/audio/').pop();
  for(var index in this.SermonLocalFiles) {
    if (this.SermonLocalFiles[index].url.indexOf(filename) > -1) {
      console.log('found on pos '+index);
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
    console.log('removedlocalSermon '+fname+'! Now new list=');
    console.log(this.SermonLocalFiles);
  }
}

 //save localSermons in nativeStorage when leaving Mediathek 
 public async saveLocalSermons() {
    //console.log('in userstate - saveLocalSermons: (with stringify:)');

    console.log('but now only safe simple value');
    //this.nativeStorage.setItem('localSermons', {property: "Wert"} )
    await Preferences.set({key: 'localSermons', value: JSON.stringify(this.SermonLocalFiles) })
      .then(
        () => console.log('Stored item localSermons!'),
        error => console.error('Error storing localSermons', error)
    );

    const localSermons = await Preferences.get({key: 'localSermons'});
    
  }

  //do cronjobs -> auto remove old sermons?
  public doCronjobs() {
    this.platform.ready().then(
      async () => {
     
      console.log('cronjobs to do?');
      let files2remove = [];
      
  
      // let diffInDays = Date.now()
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - 1);
      
      // let diffInDays = <number>this.momentjs( Date.now() ).format('YYMMDD') - <number>this.momentjs( this.lastCronCheck ).format('YYMMDD');

      if (currentDate > this.lastCronCheck) {

        //set SermonLocalArray if still empty
        if (this.SermonLocalFiles?.length < 1) {
          await Preferences.get({key: 'localSermons'}).then((localSermons)=>{
            let data = JSON.parse(localSermons.value);
            this.SermonLocalFiles = data;
          });
        }
        //console.log('crontobs now.. sermonlocalfiles len ='+this.SermonLocalFiles.length);
        await Preferences.get({key: 'settings_cache'}).then((settings_cache)=>{
            let data = JSON.parse(settings_cache.value);
            this.cleanupDays = data?.autocleanup;
          },
          error => console.error(error)
        );

        this.lastCronCheck = new Date( Date.now() );
        console.log('delete files after '+this.cleanupDays+' days');
        
        for(var index in this.SermonLocalFiles) {
          //console.log(this.SermonLocalFiles[index].savedlocal);
          let delOn = new Date ( new Date( this.SermonLocalFiles[index].savedlocal ).getTime() + (this.cleanupDays * 60*60*24*1000) );
  //let delOn = new Date (); //temp - delete today!!
          console.log('file '+this.SermonLocalFiles[index].url+' saved on '+ this.SermonLocalFiles[index].savedlocal+ 'and del on '+delOn );
          if ( new Date() > delOn ) {
            console.log('have to del '+this.SermonLocalFiles[index].url);
            files2remove.push( {mp3name: this.SermonLocalFiles[index].url, skript: this.SermonLocalFiles[index].skript} );
          }
        }
      }

      //now are there files to del?
      for(var index in files2remove) {
        //console.log('in for schleife. delete: '+files2remove[index].mp3name);
        if (files2remove[index].skript != "") {
          //this.file.removeFile(this.file.documentsDirectory + MEDIA_FOLDER_NAME, files2remove[index].skript.split('/').pop()).then((ret) => 
          Filesystem.deleteFile({path: MEDIA_FOLDER_NAME+'/'+files2remove[index].skript.split('/').pop(), directory: Directory.Data}).then((ret) => {
            //console.log('skript deleted');
            //console.log(ret);
          }, (error) => {
            console.log('error deleting: '+error);
          });
        }

        let fname = files2remove[index].mp3name.split('/').pop();
        //this.file.removeFile(this.file.documentsDirectory + MEDIA_FOLDER_NAME, fname).then((ret) => 
        Filesystem.deleteFile({path: MEDIA_FOLDER_NAME+'/'+fname, directory: Directory.Data}).then((ret) => {
          //console.log('file '+this.file.documentsDirectory + MEDIA_FOLDER_NAME, fname+' deleted');
          //console.log(ret);

        }, (error) => {
          console.log('error deleting: '+error);
        });
      }

      let updateLocalSermons = false;
      for(var index in files2remove) {
        //console.log('in for schleife. to remove from storage: '+files2remove[index].mp3name);
        updateLocalSermons = true;
        this.removeLocalSermon(files2remove[index].mp3name);
      }
      if (updateLocalSermons) {
        //console.log('we have updated local sermons -> save new!');
        this.saveLocalSermons();
        this.AppPageMedienInit = true;
      }

    }); //platf ready

    //}
  }


  public async userLoggedOut(){
    this.loggedin = false;
    this.personid = 0;
    this.isGebetLeiter = false;
    this.hasTuerOeffner = false;
    this.hasTuerOeffnerHN = false;
    this.isMinistryTeam = false;
    this.logintoken = "";
    this.fullusername = "";
    this.shortusername = "";
    this.explicitusername = "";
    await Preferences.remove({key: 'currentUser'});
    await Preferences.remove({key: 'usertoken'});
    await Preferences.remove({key: 'CheckinDataStorage'});
    await this.campusService.zuruecksetzen();
    console.log("user has been logged out");
    alert('Hinweis: Du hast Dich ausgeloggt. Logge Dich erneut für den Türöffner & Co.');
  }

}
