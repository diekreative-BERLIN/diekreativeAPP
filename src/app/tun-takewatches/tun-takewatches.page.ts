import { Component, OnInit } from '@angular/core';
import { NavController } from "@ionic/angular";
import { ChurchapiService } from '../connectors/churchapi.service';

import {IonItemSliding} from '@ionic/angular'

//modal popover
import { PopoverController } from '@ionic/angular';
import { TunTakeoverPage } from '../tun-takeover/tun-takeover.page';

@Component({
  selector: 'app-tun-takewatches',
  templateUrl: './tun-takewatches.page.html',
  styleUrls: ['./tun-takewatches.page.scss'],
})
export class TunTakewatchesPage implements OnInit {
  items:any;
  constructor(
  public navCtrl: NavController,
  private churchtools:ChurchapiService,
  private popover:PopoverController) {
    this.churchtools.getFreieSchichten().then((result)=>{
      console.log(JSON.stringify(result.data));
      this.items = JSON.parse(result.data);
    });
    
  }

  removeItem(item){
    for(let i = 0; i < this.items.length; i++) {
      if(this.items[i] == item){       
        this.items.splice(i, 1);
      }
    }
  }

  takeItem(item,sessID){
    console.log('uebernimm Schicht mit ID='+sessID);
    this.popover.create({component:TunTakeoverPage,
          componentProps: {
            sessID: sessID
          },
          cssClass: 'modal_tun_confirm',
          backdropDismiss:false,
          showBackdrop:false}).then((popoverElement)=>{
            popoverElement.onDidDismiss().then((ret)=>{
              console.log(JSON.parse(JSON.stringify(ret)).data );
              if(JSON.parse( JSON.stringify(ret) ).data == "success" ) {
                console.log("Session getauscht -> entfernte Listeneintrag");
                this.removeItem(item);
              }
            });
            popoverElement.present();
          })
  }

  //slide with click
  toggle(item: IonItemSliding) {
    if (item['el'].classList.contains('item-sliding-active-slide') || item['el'].classList.contains('item-sliding-active-options-end'))
      item.close();
    else
      item.open('end');
  }

  ngOnInit() {
  }

}
