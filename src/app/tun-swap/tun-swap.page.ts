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

  ngOnInit() {
  }

  EnterNewPerson()
   {
     console.log("neue Person eintragen: "+this.person+"  mit Typ:"+this.typ);
     this.popover.dismiss();
   }

}
