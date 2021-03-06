import { Injectable, ComponentFactoryResolver } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse, HttpResponseBase, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HTTP } from '@ionic-native/http/ngx'

@Injectable({
  providedIn: 'root'
})
export class ChurchapiService {


  private REST_API_SERVER = environment.churchtoolsurl+"/api";
  private AJAX_API_SERVER = environment.churchtoolsurl+"/index.php?";

  private CALENDARROOT = "q=churchcal/ajax&func=";


  constructor(private httpClient: HttpClient, private http:HTTP) { 

  }

  public login(username, password){
    if(true){
      this.http.clearCookies();
      this.http.setServerTrustMode("nocheck");
      return this.http.post(this.REST_API_SERVER+"/login?username="+username+"&password="+password,{},{})
    }else{
      var params = new HttpParams()
      .set('username',username)
      .set('password',password)
      //return this.sendRestPostRequest('login',params).toPromise();
    }
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

  
  public getPersonData(personid){
    var request = "persons"+'/'+personid
    var params = new HttpParams()
    return this.http.get(this.REST_API_SERVER+'/'+request,{},{})
    //return this.httpClient.get<PersonResponse>(this.REST_API_SERVER+'/'+request,{params:params, withCredentials:true});
  }


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
