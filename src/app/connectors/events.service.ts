import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx'
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  private EVENTS_API_SERVER_token = environment.prayerapitoken;
  private EVENTS_API_SERVER = environment.eventsurl;

  constructor(private http:HTTP) { }

   public getEventLinks(){
    return this.http.get(this.EVENTS_API_SERVER,{},{token:this.EVENTS_API_SERVER_token});
  }

}
