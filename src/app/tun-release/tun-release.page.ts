import { Component, OnInit } from '@angular/core';
//popover
import {PopoverController} from '@ionic/angular';

@Component({
  selector: 'app-tun-release',
  templateUrl: './tun-release.page.html',
  styleUrls: ['./tun-release.page.scss'],
})
export class TunReleasePage implements OnInit {

  constructor(private popover:PopoverController) { }
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
    //this.churchtools.takeSession(availableID,this.userstate.fullusername,Praytype)
    this.popover.dismiss("success");
  }
  ClosePopover()
   {
      console.log("abbruch");
      this.popover.dismiss("abort");
   }

}
