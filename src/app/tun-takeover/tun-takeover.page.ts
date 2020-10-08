import { Component, OnInit } from '@angular/core';
//popover
import {PopoverController} from '@ionic/angular';

@Component({
  selector: 'app-tun-takeover',
  templateUrl: './tun-takeover.page.html',
  styleUrls: ['./tun-takeover.page.scss'],
})
export class TunTakeoverPage implements OnInit {

  constructor(private popover:PopoverController) { }
  typ;

  ngOnInit() {
  }

  ClosePopover()
    {
      this.popover.dismiss();
    }
  
  EnterNewPerson()
   {
     console.log("neue Person eintragen: (ich)  mit Typ:"+this.typ);
     this.popover.dismiss();
   }

}
