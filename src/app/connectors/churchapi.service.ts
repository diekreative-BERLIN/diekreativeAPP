
import { Injectable} from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpResponse } from '@angular/common/http';

import { CapacitorHttp, CapacitorCookies }  from '@capacitor/core'; // - CapacitorCookies
import { environment } from 'src/environments/environment';
import {Md5} from 'ts-md5/dist/md5';
import { firstValueFrom } from 'rxjs';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ChurchapiService {


  private REST_API_SERVER = environment.churchtoolsurl+"/api";
  public DK_API_SERVER = environment.churchtoolsurl;
  private AJAX_API_SERVER = environment.churchtoolsurl+"/index.php?";
  //private REST_API_SERVER = "init";
  //public DK_API_SERVER = "init";
  //private AJAX_API_SERVER = "init";

  private REST_API_SERVER_own = environment.dkeventsapiurl;
  private PRAY_API_SERVER = environment.prayerapiurl;
  private PRAY_API_SERVER_token = environment.prayerapitoken;

  private CALENDARROOT = "q=churchcal/ajax&func=";
  private LOGINROOT = "q=login/ajax&func="

  constructor(private httpClient: HttpClient,
              private alertCtrl: AlertController) {}

/*
  public async login(username, password){
    console.log('#inCTAPI-login');
      let usernameEncoded = encodeURIComponent(username);
      let passwordEncoded = encodeURIComponent(password);
      return await CapacitorHttp.post({url:this.REST_API_SERVER+"/login?username="+usernameEncoded+"&password="+passwordEncoded});
  }
*/
  // ─── Normaler Login ──────────────────────────────────────────────────────────

  public async login(username: string, password: string): Promise<any> {
    console.log('#inCTAPI-login');

    // Alte Session-Cookies löschen (wichtig für Android nach Logout)
    await this.clearSessionCookies();

    const usernameEncoded = encodeURIComponent(username);
    const passwordEncoded = encodeURIComponent(password);

    const response = await CapacitorHttp.post({
      url: `${this.REST_API_SERVER}/login?username=${usernameEncoded}&password=${passwordEncoded}`
    });

    const data = response.data?.data;

    // 2FA erforderlich?
    if (data?.status === 'totp') {
      console.log('#inCTAPI-login: 2FA required, personId =', data.personId);
      return await this.handleTotpChallenge(data.personId);
    }

    // Normaler Erfolg
    return response;
  }

  private async clearSessionCookies(): Promise<void> {
    try {
      await CapacitorCookies.clearAllCookies();
      console.log('#inCTAPI: Session-Cookies gelöscht');
    } catch (e) {
      console.warn('#inCTAPI: Cookies konnten nicht gelöscht werden', e);
    }
  }
  
  // ─── TOTP Dialog + Bestätigung ───────────────────────────────────────────────

  private async handleTotpChallenge(personId: number): Promise<any> {
    const totpCode = await this.showTotpDialog();

    if (!totpCode) {
      // User hat abgebrochen
      throw new Error('2FA abgebrochen');
    }

    return await this.loginWithTotp(personId, totpCode);
  }

  private showTotpDialog(): Promise<string | null> {
    return new Promise(async (resolve) => {
      const alert = await this.alertCtrl.create({
        header: '2-Faktor-Authentifizierung',
        subHeader: 'Bitte gib den Code aus deiner Authenticator-App ein.',
        inputs: [
          {
            name: 'totpCode',
            type: 'number',
            placeholder: '6-stelliger Code',
            attributes: {
              maxlength: 6,
              inputmode: 'numeric',
              autocomplete: 'one-time-code'
            }
          }
        ],
        buttons: [
          {
            text: 'Abbrechen',
            role: 'cancel',
            handler: () => resolve(null)
          },
          {
            text: 'Bestätigen',
            handler: (data) => {
              const code = data?.totpCode?.trim();
              if (code && code.length === 6) {
                resolve(code);
              } else {
                // Verhindert das Schließen bei ungültiger Eingabe
                return false;
              }
            }
          }
        ]
      });

      await alert.present();
    });
  }

  private async loginWithTotp(personId: number, code: string): Promise<any> {
    console.log('#inCTAPI-loginWithTotp');

    const response = await CapacitorHttp.post({
      url: `${this.REST_API_SERVER}/login/totp`,
      headers: { 'Content-Type': 'application/json' },
      data: { personId, code }
    });

    if (response.status !== 200) {
      throw new Error('Ungültiger 2FA-Code. Bitte versuche es erneut.');
    }

    return {
      ...response,
      data: {
        ...response.data,
        data: {
          ...response.data?.data,
          personId: personId
        }
      }
    };
  }

  public async loginWithToken(userid, token){
    console.log('#inCTAPI-loginWithToken');
    var request = "csrftoken?login_token="+token;
   return await CapacitorHttp.get({url:this.REST_API_SERVER+'/'+request});
}

  public async getPersonViaToken(userid, token){
    return await CapacitorHttp.get({url:this.REST_API_SERVER+"/persons/"+userid,headers:{login_token:token}});
  }

  public getCalendarEventsByCategory(category){
    return this.callCalendarMethods(category)
  }

  public async getGroupsForLoggedInPerson_bak(personid){
    //if (this.REST_API_SERVER == 'init') {
    //  await this.setAPIurl();
    //}
    var request = "persons"+'/'+personid+'/groups'
    //var params = new HttpParams()
    return await CapacitorHttp.get({url:this.REST_API_SERVER+'/'+request});
    //return this.httpClient.get<ChurchToolGroup>(this.REST_API_SERVER+'/'+request,{params:params, withCredentials:true});
  }
  public async getGroupsForLoggedInPerson(personid){
    var request = "getGroupsForLoggedInPerson"+"?personid="+personid;
    return await CapacitorHttp.get({url:this.REST_API_SERVER_own+'/'+request});
  }

  private callCalendarMethods(category){
    var params = new HttpParams()
          .set('category_ids[]',category);
    return this.sendAjaxPostRequest(this.CALENDARROOT, "getCalPerCategory",params)
  }

  private sendAjaxPostRequest(requestroot, func, params:HttpParams){
    return this.httpClient.post(this.AJAX_API_SERVER+requestroot+func,{},{params});
  }

  private sendRestPostRequest(request:string,params:HttpParams){  
    console.log(this.REST_API_SERVER+'/'+request+" "+params)
    return this.httpClient.post<LoginResponse>(this.REST_API_SERVER+'/'+request,{},{params:params, withCredentials:true, observe: 'response' as 'response'});
  }

  private sendRestGetRequest(request:string,params:HttpParams){
    return this.httpClient.get(this.REST_API_SERVER+'/'+request,{params:params, withCredentials:true});
  }

  public async getLoginToken_bak(personid,username,password){
    //if (this.REST_API_SERVER == 'init') {
    //  await this.setAPIurl();
    //}
    var request = "persons"+'/'+personid+'/logintoken'
    //var params = new HttpParams()
    return CapacitorHttp.get({url:this.REST_API_SERVER+'/'+request});
    //return this.httpClient.get(this.REST_API_SERVER+'/'+request,{params:params, withCredentials:true});
  }
  /**
   * Holt den Logintoken direkt bei ChurchTools mit der Sitzung (Cookie) aus dem Login der App.
   * Funktioniert auch mit 2-Faktor-Anmeldung, weil die App die 2FA selbst durchlaufen hat.
   */
  public async getLoginTokenViaSession(personid){
    const id = encodeURIComponent(String(personid).replace(/"/g, ''));
    return CapacitorHttp.get({url: this.REST_API_SERVER + '/persons/' + id + '/logintoken'});
  }

  public async getLoginToken(personid,username,password){
    let usernameEncoded = encodeURIComponent(username);
    let passwordEncoded = encodeURIComponent(password);
    var request = "getLoginToken"+"?userid="+personid+"&username="+usernameEncoded+"&password="+passwordEncoded;
    return CapacitorHttp.get({url:this.REST_API_SERVER_own+'/'+request});
  }

  public async getLoginString_bak(personid){
    //if (this.REST_API_SERVER == 'init') {
    //  await this.setAPIurl();
    //}
    var request = "persons"+'/'+personid+'/loginstring'
    //var params = new HttpParams()
    return CapacitorHttp.get({url:this.REST_API_SERVER+'/'+request});
  }
  public async getLoginString(personid){
    var request = "getLoginString"+"?personid="+personid;
    return await CapacitorHttp.get({url:this.REST_API_SERVER_own+'/'+request});
  }
  
  public async getPersonData_bak(personid){
    //if (this.REST_API_SERVER == 'init') {
    //  await this.setAPIurl();
    //}
    var request = "persons"+'/'+personid
    var params = new HttpParams()
    return CapacitorHttp.get({url:this.REST_API_SERVER+'/'+request});
    //return this.httpClient.get<PersonResponse>(this.REST_API_SERVER+'/'+request,{params:params, withCredentials:true});
  }
  public async getPersonData(personid){
    var request = "getPersonData"+"?personid="+personid;
    return await CapacitorHttp.get({url:this.REST_API_SERVER_own+'/'+request});
  }

  //get next sunday services
  public getNextGoDiEvents(){
    return CapacitorHttp.get({url:this.PRAY_API_SERVER+"/calendar/read",headers:{token:this.PRAY_API_SERVER_token}});
  }

  /////////////////// get next prayer watches /////
  public getGebetsschichten(nbEntries,shortusername,explicitusername){
    if (shortusername!=null) 
    {
      if (explicitusername != "") {
        console.log("getGebetsschichten mit nbEntries:"+nbEntries+" UND ctFulluserShort="+shortusername+" UND explicitusername="+explicitusername);
        var request = "maxEntries"+'='+nbEntries+'&ctFulluserShort='+shortusername+'&ctExplicitUser='+explicitusername;
      } else {
        console.log("getGebetsschichten mit nbEntries:"+nbEntries+" UND ctFulluserShort="+shortusername);
        var request = "maxEntries"+'='+nbEntries+'&ctFulluserShort='+shortusername;
      }
    } 
    else
    {
      console.log("getGebetsschichten mit nbEntries:"+nbEntries);
      var request = "maxEntries"+'='+nbEntries;
    }
    return CapacitorHttp.get({url:this.PRAY_API_SERVER+"/watches/scheduled"+'/?'+request,headers:{token:this.PRAY_API_SERVER_token}});
  }

  /////////////////// Get available watches /////
  public getFreieSchichten(){
    return CapacitorHttp.get({url:this.PRAY_API_SERVER+"/watches/available",headers:{token:this.PRAY_API_SERVER_token}});
  }

  /////////////////////// take session //////
  public takeSession(availableID,Personname,Praytype){
    console.log("post auf ../watches/available ID:"+availableID+" Name:"+Personname+" Type:"+Praytype);

    const data = {
      ID: availableID,
      Name:Personname,
      Type:Praytype
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      token: this.PRAY_API_SERVER_token,
    });

    this.httpClient.post(this.PRAY_API_SERVER+"/watches/available", data, { headers }).subscribe((response) => {
      console.log("response from take session" + JSON.stringify(response));
    });
  }

  /////////////////// swap session with someone else /////
  public swapSession(sessID,startdate,enddate,oldentry,Personname,Praytype){
    console.log("post auf ../watches/scheduled ID:"+sessID+" start:"+startdate+" end:"+enddate+" bisher:"+oldentry+" neu: Name:"+Personname+" Type:"+Praytype+" task:swap");
    
    const data = {
      ID: sessID,
      task: 'swap',
      startdate: startdate,
      enddate: enddate,
      oldentry: oldentry,
      replace_person: Personname,
      replace_type: Praytype
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      token: this.PRAY_API_SERVER_token,
    });

    this.httpClient.post(this.PRAY_API_SERVER+"/watches/scheduled", data, { headers }).subscribe((response) => {
      console.log("response from swap session" + JSON.stringify(response));
    });

    /*
    return CapacitorHttp.post({url:this.PRAY_API_SERVER+"/watches/available",data:{"ID":availableID, "Name":Personname, "Type":Praytype},headers:{token:this.PRAY_API_SERVER_token}}).then((res)=>{
      //console.log( '>>'+ JSON.parse(JSON.stringify(res)).data +'<<');
      if(JSON.parse( JSON.stringify(res) ).data == "\"already_taken\"" ) {
        console.log('Schicht - bereits uebernommen!');
        alert('Oops, da war jemand schneller als Du. Die Schicht wurde gerade bereits von jemand anderem übernommen. Danke dennoch für Deine Bereitschaft!');
      }
      
    }).catch((err)=>{
      console.log("error take session " + JSON.stringify(err));
    });
    */
  }
  /////////////////// release session /////
  public releaseSession(sessID,startdate,enddate,oldentry){
    console.log("post auf ../watches/scheduled ID:"+sessID+" start:"+startdate+" end:"+enddate+" bisher:"+oldentry+" task:release");

    const data = {
      ID: sessID,
      task: 'release',
      startdate: startdate,
      enddate: enddate,
      oldentry: oldentry,
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      token: this.PRAY_API_SERVER_token,
    });

    this.httpClient.post(this.PRAY_API_SERVER+"/watches/scheduled", data, { headers }).subscribe((response) => {
      console.log("response from release session" + JSON.stringify(response));
    });
  }

  /////////////////// Week Topic /////
  public getTopicWeek(){
    // return CapacitorHttp.get({url:"/praytopics/week",headers:{token:this.PRAY_API_SERVER_token}});
    return firstValueFrom(this.httpClient.get(this.PRAY_API_SERVER+"/praytopics/week",{headers:{token:this.PRAY_API_SERVER_token}}));
  }

  /////////////////// Prayer for Persecuted Topic /////
  public getTopicPersecuted(){
    return CapacitorHttp.get({url:this.PRAY_API_SERVER+"/praytopics/persecuted",headers:{token:this.PRAY_API_SERVER_token}});
  }

  //getGoDiEventInfo
  public async getGoDiEventDetails(groupid){
    var request = "groups"+'/'+groupid;
    return CapacitorHttp.get({url:this.REST_API_SERVER+'/'+request});
  }
  //check if Person belongs to group
  public checkPersonInGroup(personid){
    var request = "persons/"+personid+"/groups?show_overdue_groups=false&show_inactive_groups=false";
    return CapacitorHttp.get({url:this.REST_API_SERVER+'/'+request});
  }

  //get QR Code for Person
  public getQRCode(personid,groupid){
    var request = "groups/"+groupid+"/qrcodecheckin/"+personid;
    return CapacitorHttp.get({url:this.REST_API_SERVER+'/'+request});
  }

  //get Relationships for Person
  public getRelationships(personid){
    var request = "persons/"+personid+"/relationships";
    return CapacitorHttp.get({url:this.REST_API_SERVER+'/'+request});
  }

  /////////////////// Get validity of certificate /////
  public getCheckValidity(personid){
    var request = "personHash"+'='+Md5.hashStr( String(personid) ); //pass personID as string
    return CapacitorHttp.get({url:this.PRAY_API_SERVER+"/checkin/validity"+'/?'+request,headers:{token:this.PRAY_API_SERVER_token}});
  }

  //getFamilyQRCodes - use new command through our own prayApi
  public getFamilyQRcodes(personid,groupid){
    var request = "groupID="+groupid+"&personID="+personid;
    return CapacitorHttp.get({url:this.PRAY_API_SERVER+"/checkin/familyqr"+'/?'+request,headers:{token:this.PRAY_API_SERVER_token}});
  }

}

export interface Gebetstermin{
    time: Date,
    format: String,
    person: String,
    note: String
}

export interface LoginResponse{ 

  data:{
  status:string,
  message:string,
  personId:number,
  location:string}
}

export interface ChurchToolGroup  {
  data:[{
  group:any,
  groupTypeRoleId:number,
  memberStartDate:string}]
}

export interface LoginTokenResponse {
  data:"string"
}

export interface PersonResponse{
  data:{
    firstName:string,
    lastName:string
  }
}
