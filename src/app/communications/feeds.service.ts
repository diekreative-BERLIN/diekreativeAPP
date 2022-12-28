import { Injectable } from '@angular/core';
import { NewsRss } from './news-rss';
import * as xml2js from "xml2js";
import { HttpClient,  HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeedsService {
  RssData: NewsRss;

  public PREDIGTEN_URL = environment.predigtenurl;
  
  constructor(private http: HttpClient) { 
    this.GetRssFeedData(this.PREDIGTEN_URL,'');
  }

  public async GetRssFeedData(URL,param){
    const requestOptions: Object = {
      observe: "body",
      params: new HttpParams().set('mode', param),
      responseType: "text"
    };
    const data = await this.http.get(URL, requestOptions).toPromise();
    let istate = false;
    let parseString = xml2js.parseString;
    await parseString(data, (err, result: NewsRss) => {
      this.RssData = result;
      istate = true;
    });
    return istate;
  }

  /*
  public GetRssFeedData(URL,param) {
    const requestOptions: Object = {
      observe: "body",
      params: new HttpParams().set('mode', param),
      responseType: "text"
    };
    console.log("in getrssfeeddata");
    return this.http
      .get<any>(URL, requestOptions)
      .subscribe(data => {
        let parseString = xml2js.parseString;
        parseString(data, (err, result: NewsRss) => {
          console.log("In parse String");
          this.RssData = result;
        });
      });
  }
  */

}
