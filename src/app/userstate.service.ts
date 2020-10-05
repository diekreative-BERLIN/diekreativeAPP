import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ChurchapiService } from './connectors/churchapi.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Injectable({
  providedIn: 'root'
})
export class UserstateService {
  loggedin = false;
  personid = 0;
  hasTuerOeffner = false;
  logintoken = "";
  fullusername = "";
//  loginstring = "";
  AppPageTUNInit = false;
  AppPageTunTimestamp = 1601000000000;
  //Date.now();

  constructor(private churchtools:ChurchapiService, private platform :Platform, private nativeStorage: NativeStorage) {
    platform.ready().then(() => {
      nativeStorage.getItem('currentUser').then((user)=>{
        this.personid = user.personid;
        this.logintoken = user.logintoken;
        this.fullusername = user.fullusername;
        this.loggedin = true;
        this.hasTuerOeffner = user.hasTuerOeffner;
        this.churchtools.getPersonViaToken(this.personid, this.logintoken).then((res)=>{
          console.log("Persondata with Token:"+JSON.stringify(res));
        }).catch((err)=>{
          console.log("Error on getPerson with Token "+  JSON.stringify(err));
          this.nativeStorage.remove('currentUser');
          this.loggedin = false;
          this.personid = 0;
          this.hasTuerOeffner = false;
          this.logintoken = "";
          this.fullusername = "";
        })
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
        this.nativeStorage.setItem('currentUser', {personid: this.personid, logintoken: this.logintoken, fullusername: this.fullusername, hasTuerOeffner:this.hasTuerOeffner})
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
          this.nativeStorage.setItem('currentUser', {personid: this.personid, logintoken: this.logintoken, fullusername: this.fullusername, hasTuerOeffner:this.hasTuerOeffner})
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
          this.nativeStorage.setItem('currentUser', {personid: this.personid, logintoken: this.logintoken, fullusername: this.fullusername, hasTuerOeffner:this.hasTuerOeffner})
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
    this.nativeStorage.setItem('currentUser', {personid: this.personid, logintoken: this.logintoken, fullusername: this.fullusername, hasTuerOeffner:this.hasTuerOeffner})
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
    this.nativeStorage.remove('currentUser');
  }
}

