import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserstateService } from './userstate.service';
import { CapacitorHttp } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class TueroeffnerService {
  constructor(private userstate:UserstateService) {
  }

  private PRAY_API_SERVER_token = environment.prayerapitoken;
  private HN_API_SERVER_token = environment.tokenHN;

  public openFrontDoor(){
    console.log("open Frontdoor");
    const options = {
      url: environment.tueroeffnerurl,
      headers: {
        'Content-Type': 'application/json',
        'token': this.PRAY_API_SERVER_token
      },
      data: {
        "usertoken":this.userstate.logintoken, "userid":""+this.userstate.personid,"doorid":"1"
      }
    };
    return CapacitorHttp.post(options).then((res)=>{
      console.log("response frontdoor" + JSON.stringify(res));
    }).catch((err)=>{
      console.log("error frontdoor " + JSON.stringify(err));
    });
  }

  public openSecondDoor(){
    console.log("open Second Door");
    return CapacitorHttp.post({
      url:environment.tueroeffnerurl,
      data: {"usertoken":this.userstate.logintoken, "userid":""+this.userstate.personid,"doorid":"2"},
      headers: {
        'Content-Type': 'application/json',
        token:this.PRAY_API_SERVER_token}
      }).then((res)=>{
        console.log("response second door " + JSON.stringify(res));
      }).catch((err)=>{
        console.log("error second door " + JSON.stringify(err));
      });
  }

  public openHNDoor(doorid){
    //console.log("open Door HohenN");
    /*
     "usertoken":this.userstate.logintoken, "userid":""+this.userstate.personid,"doorid":"2"
    */
    const options = {
      url: environment.tueroeffnerurlHN,
      headers: {
        'Content-Type': 'application/json',
        'token': this.HN_API_SERVER_token
      },
      data: {
        "userid":""+this.userstate.personid,"doorid":doorid
      }
    };
    return CapacitorHttp.post(options).then((res)=>{
      console.log("response frontdoor" + JSON.stringify(res));
    }).catch((err)=>{
      console.log("error frontdoor " + JSON.stringify(err));
    });
  }
  
}
