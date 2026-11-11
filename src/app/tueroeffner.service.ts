import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserstateService } from './userstate.service';
import { CapacitorHttp } from '@capacitor/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { StandortService, StandortId } from './standort.service';

@Injectable({
  providedIn: 'root'
})
export class TueroeffnerService {
  constructor(
    private userstate:UserstateService,
    private standort:StandortService,
    private alertCtrl:AlertController,
    private loadingCtrl:LoadingController,
    private translate:TranslateService
  ) {
  }

  private pruefungLaeuft = false;

  /** Öffnet die Tür nur, wenn das Gerät am passenden Standort ist. */
  private async nurVorOrt(id: StandortId, oeffnen: () => Promise<any>) {
    // Standort in den letzten 2 Minuten bestätigt (z. B. Außentür) -> sofort öffnen
    if (this.standort.istKuerzlichBestaetigt(id)) {
      return oeffnen();
    }
    if (this.pruefungLaeuft) { return; }
    this.pruefungLaeuft = true;
    const loading = await this.loadingCtrl.create({ message: this.translate.instant('DOOR.CHECKING') });
    await loading.present();
    try {
      const ergebnis = await this.standort.istAmStandort(id);
      await loading.dismiss();
      if (!ergebnis.erlaubt) {
        const alert = await this.alertCtrl.create({
          header: this.translate.instant('DOOR.NOT_ON_SITE'),
          message: ergebnis.grund,
          buttons: ['OK']
        });
        await alert.present();
        return;
      }
      return await oeffnen();
    } finally {
      await loading.dismiss().catch(() => {});
      this.pruefungLaeuft = false;
    }
  }

  private PRAY_API_SERVER_token = environment.prayerapitoken;
  private HN_API_SERVER_token = environment.tokenHN;

  public openFrontDoor(){
    return this.nurVorOrt('schivelbeiner', () => this.sendFrontDoor());
  }

  private sendFrontDoor(){
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
    return this.nurVorOrt('schivelbeiner', () => this.sendSecondDoor());
  }

  private sendSecondDoor(){
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
    return this.nurVorOrt('hohenneuendorf', () => this.sendHNDoor(doorid));
  }

  private sendHNDoor(doorid){
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
