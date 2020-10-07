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

  ngOnInit() {
  }

  ConfirmPopover() {
    console.log("ok, ausführen");
    this.popover.dismiss();
  }
  ClosePopover()
   {
      console.log("abbruch");
      this.popover.dismiss();
   }

}
