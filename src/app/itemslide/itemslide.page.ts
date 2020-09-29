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
    this.churchtools.getGebetsschichten().then((result)=>{
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

  ngOnInit() {
  }

}
