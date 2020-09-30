import { Component, OnInit } from '@angular/core';
import { NavController } from "@ionic/angular";
import { ChurchapiService } from '../connectors/churchapi.service';

@Component({
  selector: 'app-tun-takewatches',
  templateUrl: './tun-takewatches.page.html',
  styleUrls: ['./tun-takewatches.page.scss'],
})
export class TunTakewatchesPage implements OnInit {
  items:any;
  constructor(public navCtrl: NavController, private churchtools:ChurchapiService) {
    this.churchtools.getFreieSchichten().then((result)=>{
      console.log(JSON.stringify(result.data));
      this.items = JSON.parse(result.data);
    });
    
  }
  takeItem(item,availableID){
    console.log('uebernimm freie Schicht mit ID='+availableID);
    //Todo: zeige modal Window wo man den Gebetsschwerpunkt eintragen kann (Praytype). Name muss der Name der eingeloggten Person sein!
    //this.churchtools.takeSession(availableID,Personname,Praytype)
    for(let i = 0; i < this.items.length; i++) {
      if(this.items[i] == item){       
        this.items.splice(i, 1);
      }
    }
  }

  ngOnInit() {
  }

}
