import { Component, OnInit } from '@angular/core';
import { ChurchapiService } from '../connectors/churchapi.service';
//popover
import {PopoverController} from '@ionic/angular';

@Component({
  selector: 'app-tun-release',
  templateUrl: './tun-release.page.html',
  styleUrls: ['./tun-release.page.scss'],
})
export class TunReleasePage implements OnInit {

  constructor(
    private popover:PopoverController,
    private churchtools:ChurchapiService) { }
  sessID;
  startdate;
  enddate;
  oldformat;
  oldperson;

  ngOnInit() {
  }

  ConfirmPopover() {
    console.log("ok, ausführen, gib SessionID "+this.sessID+" frei!");
    //fuehre Freigabebefehl aus
    let oldentry = "("+this.oldformat+") "+this.oldperson;
    let ret=this.churchtools.releaseSession(this.sessID,this.startdate,this.enddate,oldentry);
    console.log("Session freigegeben. Ret="+JSON.stringify(ret));
    this.popover.dismiss("success");
  }

  ClosePopover()
   {
      console.log("abbruch");
      this.popover.dismiss("abort");
   }

}
