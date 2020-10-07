import { Component, OnInit } from '@angular/core';
import { NavController } from "@ionic/angular";
import { ChurchapiService } from '../connectors/churchapi.service';

@Component({
  selector: 'app-itemslide',
  templateUrl: './itemslide.page.html',
  styleUrls: ['./itemslide.page.scss'],
})
export class ItemslidePage implements OnInit {
  items:any;
  constructor(public navCtrl: NavController, private churchtools:ChurchapiService) {
    this.churchtools.getGebetsschichten(999).then((result)=>{
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

  swapItem(item,sessID){
    console.log('tausche Schicht mit ID='+sessID);
    
    //Todo: zeige modal Window wo man den Gebetsschwerpunkt eintragen kann (Praytype). Name muss der Name der eingeloggten Person sein!
    //this.churchtools.takeSession(availableID,this.userstate.fullusername,Praytype)
    this.removeItem(item);
  }
  releaseItem(item,sessID){
    console.log('gib Schicht mit ID='+sessID+' frei!');
    
    //Todo: zeige modal Window wo man den Gebetsschwerpunkt eintragen kann (Praytype). Name muss der Name der eingeloggten Person sein!
    //this.churchtools.takeSession(availableID,this.userstate.fullusername,Praytype)
    this.removeItem(item);
  }

  ngOnInit() {
  }

}
