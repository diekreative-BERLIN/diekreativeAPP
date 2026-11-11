import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ChurchapiService } from '../connectors/churchapi.service';
//popover
import {PopoverController} from '@ionic/angular';


@Component({
  selector: 'app-tun-swap',
  templateUrl: './tun-swap.page.html',
  styleUrls: ['./tun-swap.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TunSwapPage implements OnInit {

  constructor(
     private popover:PopoverController,
     private churchtools:ChurchapiService,
     private translate:TranslateService) { }
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
        alert(this.translate.instant('TUN.NEED_NAME'));
     }
     else if(this.typ==undefined) {
        alert(this.translate.instant('TUN.NEED_FORM_SWAP'));
     } else {
        let oldentry = "("+this.oldformat+") "+this.oldperson;
        let ret=this.churchtools.swapSession(this.sessID,this.startdate,this.enddate,oldentry,this.person,this.typ);
        console.log("Session getauscht. Ret="+JSON.stringify(ret));
        this.popover.dismiss("success");
     }
  }

}
