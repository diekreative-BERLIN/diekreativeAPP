import { Component, OnInit } from '@angular/core';
import { UserstateService } from '../userstate.service';
import { ChurchapiService } from '../connectors/churchapi.service';
//popover
import {PopoverController} from '@ionic/angular';


@Component({
  selector: 'app-tun-takeover',
  templateUrl: './tun-takeover.page.html',
  styleUrls: ['./tun-takeover.page.scss'],
})
export class TunTakeoverPage implements OnInit {

  constructor(
    private popover:PopoverController,
    public userState:UserstateService,
    private churchtools:ChurchapiService) { }
  typ;
  sessID;

  ngOnInit() {
  }

  ClosePopover()
    {
      this.popover.dismiss("abort");
    }
  
  EnterNewPerson()
   {
      
     console.log("neue Person eintragen: ("+this.userState.personid+": "+this.userState.shortusername+")  mit Typ:"+this.typ+" auf Session ID "+this.sessID);
     if(this.typ==undefined) {
        alert("bitte Deine Gebetsform angeben. Z.B. A+F für Anbetung und Fürbitte");
     } else {
        let ret=this.churchtools.takeSession(this.sessID,this.userState.shortusername,this.typ);
        console.log("uebernommen. Ret="+JSON.stringify(ret));
        this.popover.dismiss("success");
     }
   }

}
