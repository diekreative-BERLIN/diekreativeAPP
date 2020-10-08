import { Component, OnInit } from '@angular/core';
import { NavController } from "@ionic/angular";
import { ChurchapiService } from '../connectors/churchapi.service';
import { UserstateService } from '../userstate.service';

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
  private userstate:UserstateService,
  private popover:PopoverController) {
    this.churchtools.getFreieSchichten().then((result)=>{
      console.log(JSON.stringify(result.data));
      this.items = JSON.parse(result.data);
    });
    
  }

  showPrayTypeModal(item,availableID){

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
          cssClass: 'modal_tun_confirm',
          backdropDismiss:false,
          showBackdrop:false}).then((popoverElement)=>{
            popoverElement.present();
          })
    //Todo: zeige modal Window wo man den Gebetsschwerpunkt eintragen kann (Praytype). Name muss der Name der eingeloggten Person sein!
    //this.churchtools.takeSession(availableID,this.userstate.fullusername,Praytype)
    this.removeItem(item);
  }


  ngOnInit() {
  }

}
