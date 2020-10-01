import { Injectable } from '@angular/core';
import { NewsRss } from './news-rss';
import * as xml2js from "xml2js";
import { HttpClient,  HttpErrorResponse, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class FeedsService {
  RssData: NewsRss;

  //public PREDIGTEN_URL = 'https://x9upj2z4ji.execute-api.eu-central-1.amazonaws.com/cors/feed/podcast';
  public PREDIGTEN_URL = 'https://diekreative.org/addons/simplehtmldom/sermonrss_app.php';
  constructor(private http: HttpClient) { 
    this.GetRssFeedData(this.PREDIGTEN_URL);
  }

  GetRssFeedData(URL) {
    const requestOptions: Object = {
      observe: "body",
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
}
