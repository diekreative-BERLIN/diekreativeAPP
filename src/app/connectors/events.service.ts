import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { CapacitorHttp } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  private EVENTS_API_SERVER_token = environment.prayerapitoken;
  private EVENTS_API_SERVER = environment.eventsurl;

  constructor() { }

   public getEventLinks(){
    return CapacitorHttp.get({url:this.EVENTS_API_SERVER, headers:{token:this.EVENTS_API_SERVER_token}});
  }

}
