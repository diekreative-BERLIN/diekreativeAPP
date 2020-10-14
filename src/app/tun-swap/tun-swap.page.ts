import { Component, OnInit } from '@angular/core';
//popover
import {PopoverController} from '@ionic/angular';


@Component({
  selector: 'app-tun-swap',
  templateUrl: './tun-swap.page.html',
  styleUrls: ['./tun-swap.page.scss'],
})
export class TunSwapPage implements OnInit {

  constructor(private popover:PopoverController) { }
  person;
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
     console.log("neue Person eintragen: "+this.person+"  mit Typ:"+this.typ+" auf SessID "+this.sessID);
     if(this.person==undefined) {
        alert("bitte trag den Namen der Person ein, die für Dich die Gebetsschicht übernimmt");
     }
     else if(this.typ==undefined) {
        alert("bitte noch die Gebetsform angeben. Z.B. A+F für Anbetung und Fürbitte");
     } else {
        //let ret=this.churchtools.takeSession(this.sessID,this.userState.shortusername,this.typ);
        //console.log("uebernommen. Ret="+JSON.stringify(ret));
        this.popover.dismiss("success");
     }
  }

}
