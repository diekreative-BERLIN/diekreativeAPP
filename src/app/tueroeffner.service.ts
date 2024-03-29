import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HTTP } from '@ionic-native/http/ngx';
import { UserstateService } from './userstate.service';

@Injectable({
  providedIn: 'root'
})
export class TueroeffnerService {
  constructor(private http: HTTP, private userstate:UserstateService) {
  }

  private PRAY_API_SERVER_token = environment.prayerapitoken;

  public openFrontDoor(){
    console.log("open Frontdoor");
    this.http.setDataSerializer('json');
    this.http.setServerTrustMode("nocheck");
    return this.http.post(environment.tueroeffnerurl,{"usertoken":this.userstate.logintoken, "userid":""+this.userstate.personid,"doorid":"1"},{token:this.PRAY_API_SERVER_token}).then((res)=>{
      console.log("response frontdoor" + JSON.stringify(res));
    }).catch((err)=>{
      console.log(""+JSON.stringify({"usertoken":this.userstate.logintoken, "userid":""+this.userstate.personid,"doorid":"1"}));
      console.log("error frontdoor " + JSON.stringify(err));
    });
  }

  public openSecondDoor(){
    console.log("open Second Door");
    this.http.setDataSerializer('json');
    this.http.setServerTrustMode("nocheck");
    return this.http.post(environment.tueroeffnerurl,{"usertoken":this.userstate.logintoken, "userid":""+this.userstate.personid,"doorid":"2"},{token:this.PRAY_API_SERVER_token}).then((res)=>{
      console.log("response second door " + JSON.stringify(res));
    }).catch((err)=>{
      console.log("error second door " + JSON.stringify(err));
    });
  }
  
}
