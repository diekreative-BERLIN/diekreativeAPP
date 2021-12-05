import { Component, OnInit } from '@angular/core';
import { NavController } from "@ionic/angular";
import { ChurchapiService } from '../connectors/churchapi.service';
import { UserstateService } from '../userstate.service';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';

import {IonItemSliding} from '@ionic/angular'

//modal popover
import { PopoverController } from '@ionic/angular';
import { TunSwapPage } from '../tun-swap/tun-swap.page';
import { TunReleasePage } from '../tun-release/tun-release.page';

@Component({
  selector: 'app-itemslide',
  templateUrl: './itemslide.page.html',
  styleUrls: ['./itemslide.page.scss'],
})
export class ItemslidePage implements OnInit {
  items:any;
  initializing: any = false;

  constructor(
    public navCtrl: NavController,
    private popover:PopoverController,
    private userstate:UserstateService,
    private churchtools:ChurchapiService,
    private platform: Platform,
    private router: Router
  ) {
    let userfilter = encodeURI(this.userstate.shortusername);
    let explicitusername = encodeURI(this.userstate.explicitusername);
    this.churchtools.getGebetsschichten(7300,userfilter,explicitusername).then((result)=>{
      console.log(JSON.stringify(result.data));
      this.items = JSON.parse(result.data);
      this.initializing = false;
    });

    //this.platform.backButton.subscribeWithPriority(10, () => {
    //  this.router.navigate(["/tabs/tagundnacht"]);
    //});
  }

  ngOnInit() {
    this.initializing = true;
  }


  removeItem(item){
    for(let i = 0; i < this.items.length; i++) {
            if(this.items[i] == item){       
        this.items.splice(i, 1);
      }
    }
  }

  //slide with click
  toggle(item: IonItemSliding) {
      if (item['el'].classList.contains('item-sliding-active-slide') || item['el'].classList.contains('item-sliding-active-options-end'))
        item.close();
      else
        item.open('end');
  }
  
  swapItem(item,sessID,repeatID,startdate,enddate,format,person){
    console.log("repeatid="+repeatID);
    if(repeatID=="") {
      alert("Die Schicht '"+format+"' kann nicht mehr getauscht werden. Sie wurde bereits einmal freigegeben und übernommen bzw. getauscht")
    } else {
      console.log('tausche Schicht mit ID='+sessID);
      this.popover.create({component:TunSwapPage,
            componentProps: {
              sessID: sessID,
              repeatID: repeatID,
              startdate: startdate,
              enddate: enddate,
              oldformat: format,
              oldperson: person
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
  }


  releaseItem(item,sessID,repeatID,startdate,enddate,format,person){
    console.log("repeatid="+repeatID);
    if(repeatID=="") {
      alert("Die Schicht '"+format+"' kann nicht mehr freigegeben werden. Sie wurde bereits einmal freigegeben und übernommen bzw. getauscht")
    } else {
      console.log('gib Schicht mit ID='+sessID+' frei!');
      this.popover.create({component:TunReleasePage,
            componentProps: {
              sessID: sessID,
              repeatID: repeatID,
              startdate: startdate,
              enddate: enddate,
              oldformat: format,
              oldperson: person
            },
            cssClass: 'modal_tun_confirm',
            backdropDismiss:false,
            showBackdrop:false}).then((popoverElement)=>{
              popoverElement.onDidDismiss().then((ret)=>{
                console.log(JSON.parse(JSON.stringify(ret)).data );
                if(JSON.parse( JSON.stringify(ret) ).data == "success" ) {
                  console.log("Session geloescht -> entfernte Listeneintrag");
                  this.removeItem(item);
                }
              });
              popoverElement.present();
            })
    }
  }
  
  BackActivated() {
    this.router.navigate(["/tabs/tagundnacht"]);
  }
}
