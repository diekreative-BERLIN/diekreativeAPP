import { Component, OnInit } from '@angular/core';
import { NavController } from "@ionic/angular";

@Component({
  selector: 'app-itemslide',
  templateUrl: './itemslide.page.html',
  styleUrls: ['./itemslide.page.scss'],
})
export class ItemslidePage implements OnInit {
  items:any;
  constructor(public navCtrl: NavController) {
    this.items = [
        {title: 'Mi 12.12.1212, 12–14 Uhr'},
        {title: 'Mi 12.12.1212, 12–14 Uhr'},
        {title: 'Mi 12.12.1212, 12–14 Uhr item3'},
        {title: 'Mi 12.12.1212, 12–14 Uhr'},
        {title: 'Mi 12.12.1212, 12–14 Uhr'},
        {title: 'Mi 12.12.1212, 12–14 Uhr'}
    ];
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
