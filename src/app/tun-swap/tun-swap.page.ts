import { Component, OnInit } from '@angular/core';
import { ChurchapiService } from '../connectors/churchapi.service';
//popover
import {PopoverController} from '@ionic/angular';


@Component({
  selector: 'app-tun-swap',
  templateUrl: './tun-swap.page.html',
  styleUrls: ['./tun-swap.page.scss'],
})
export class TunSwapPage implements OnInit {

  constructor(
     private popover:PopoverController,
     private churchtools:ChurchapiService) { }
  person;
  typ;
  sessID;
  startdate;
  enddate;
  oldformat;
  oldperson;

  ngOnInit() {
  }

  ClosePopover()
  {
    this.popover.dismiss("abort");
  }
  
  EnterNewPerson()
  {
     console.log("neue Person eintragen: "+this.person+"  mit Typ:"+this.typ+" auf SessID "+this.sessID+" am:"+this.startdate);
     if(this.person==undefined) {
        alert("bitte trag den Namen der Person ein, die für Dich die Gebetsschicht übernimmt");
     }
     else if(this.typ==undefined) {
        alert("bitte noch die Gebetsform angeben. Z.B. A+F für Anbetung und Fürbitte");
     } else {
        //let ret=this.churchtools.swapSession(this.sessID,this.excDay,this.person,this.typ);
        console.log("Session getauscht. Ret="+JSON.stringify(ret));
        this.popover.dismiss("success");
     }
  }

}
