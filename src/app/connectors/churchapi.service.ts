import { Injectable, ComponentFactoryResolver } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse, HttpResponseBase, HttpHeaders } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { HTTP } from '@ionic-native/http/ngx'

@Injectable({
  providedIn: 'root'
})
export class ChurchapiService {


  private REST_API_SERVER = environment.churchtoolsurl+"/api";
  private DK_API_SERVER = environment.churchtoolsurl;
  private AJAX_API_SERVER = environment.churchtoolsurl+"/index.php?";
  private PRAY_API_SERVER = environment.prayerapiurl;
  private PRAY_API_SERVER_token = environment.prayerapitoken;

  private CALENDARROOT = "q=churchcal/ajax&func=";
  private LOGINROOT = "q=login/ajax&func="

  constructor(private httpClient: HttpClient, private http:HTTP) { 

  }

  public login(username, password){

      this.http.clearCookies();
      this.http.setServerTrustMode("nocheck");
      return this.http.post(this.REST_API_SERVER+"/login?username="+username+"&password="+password,{},{})

  }

  public loginWithToken(userid, token){
    return this.http.post(this.AJAX_API_SERVER+this.LOGINROOT+"loginWithToken"+"&q=login/ajax&token="+token+"&id="+userid,{},{});
  }

  public getPersonViaToken(userid, token){
    return this.http.get(this.REST_API_SERVER+"/persons/"+userid,{login_token:token},{})
  }

  public getCalendarEventsByCategory(category){
    return this.callCalendarMethods(category)
  }

  public getGroupsForLoggedInPerson(personid){
    var request = "persons"+'/'+personid+'/groups'
    //var params = new HttpParams()
    return this.http.get(this.REST_API_SERVER+'/'+request,{},{})
    //return this.httpClient.get<ChurchToolGroup>(this.REST_API_SERVER+'/'+request,{params:params, withCredentials:true});
  }

  private callCalendarMethods(category){
    var params = new HttpParams()
                    .set('category_ids[]',category)
    return this.sendAjaxPostRequest(this.CALENDARROOT, "getCalPerCategory",params)
  }

  private sendAjaxPostRequest(requestroot, func, params:HttpParams){
    return this.httpClient.post(this.AJAX_API_SERVER+requestroot+func,{},{params});
  }

  private sendRestPostRequest(request:string,params:HttpParams){
    
  console.log(this.REST_API_SERVER+'/'+request+" "+params)
  return this.httpClient.post<LoginResponse>(this.REST_API_SERVER+'/'+request,{},{params:params, withCredentials:true, observe: 'response' as 'response'});
  //return this.httpClient.post("http://ec2-18-184-42-189.eu-central-1.compute.amazonaws.com/api/login?username=admin&password=admin",{});
  }

  private sendRestGetRequest(request:string,params:HttpParams){
    return this.httpClient.get(this.REST_API_SERVER+'/'+request,{params:params, withCredentials:true});
  }

  public getLoginToken(personid){
    var request = "persons"+'/'+personid+'/logintoken'
    //var params = new HttpParams()
    return this.http.get(this.REST_API_SERVER+'/'+request,{},{});
    //return this.httpClient.get(this.REST_API_SERVER+'/'+request,{params:params, withCredentials:true});
  }

  public getLoginString(personid){
    var request = "persons"+'/'+personid+'/loginstring'
    //var params = new HttpParams()
    return this.http.get(this.REST_API_SERVER+'/'+request,{},{});
  }
  
  public getPersonData(personid){
    var request = "persons"+'/'+personid
    var params = new HttpParams()
    return this.http.get(this.REST_API_SERVER+'/'+request,{},{})
    //return this.httpClient.get<PersonResponse>(this.REST_API_SERVER+'/'+request,{params:params, withCredentials:true});
  }

  public getGebetsschichten(nbEntries){
    var request = "maxEntries"+'='+nbEntries
    return this.http.get(this.PRAY_API_SERVER+"/watches/scheduled"+'/?'+request,{},{token:this.PRAY_API_SERVER_token})
  }

  public getFreieSchichten(){
    return this.http.get(this.PRAY_API_SERVER+"/watches/available",{},{token:this.PRAY_API_SERVER_token})
  }

  /////////////////////// take session //////
  public takeSession(availableID,Personname,Praytype){
    //let PersonNameShort = Personname.match(/ain/g);
    console.log("post auf ../watches/available ID:"+availableID+" Name:"+Personname+" Type:"+Praytype);

    this.http.setDataSerializer('json');
    //this.http.setServerTrustMode("nocheck");
    return this.http.post(this.PRAY_API_SERVER+"/watches/available",{"ID":availableID, "Name":Personname, "Type":Praytype},{token:this.PRAY_API_SERVER_token}).then((res)=>{
      console.log("response from take session" + JSON.stringify(res));
    }).catch((err)=>{
      console.log(""+JSON.stringify({"ID":availableID, "Name":Personname, "Type":Praytype}));
      console.log("error take session " + JSON.stringify(err));
    });
  }

  public getTopicWeek(){
    return this.http.get(this.PRAY_API_SERVER+"/praytopics/week",{},{token:this.PRAY_API_SERVER_token})
  }

  public getTopicPersecuted(){
    return this.http.get(this.PRAY_API_SERVER+"/praytopics/persecuted",{},{token:this.PRAY_API_SERVER_token})
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
