import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
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
  encapsulation: ViewEncapsulation.None
})
export class ItemslidePage implements OnInit {
  items:any;
  initializing: any = false;
  userfilter;
  explicitusername;

  constructor(
    public navCtrl: NavController,
    private popover:PopoverController,
    private userstate:UserstateService,
    private churchtools:ChurchapiService,
    private platform: Platform,
    private router: Router,
    private translate: TranslateService
  ) {
    this.userfilter = encodeURI(this.userstate.shortusername);
    this.explicitusername = encodeURI(this.userstate.explicitusername);
    this.churchtools.getGebetsschichten(7300,this.userfilter,this.explicitusername).then((result)=>{
      console.log('in Constructor Übersicht eigene Gebetsschichten');
      console.log(result.data);
      this.items = result.data;
      this.initializing = false;
    });

  }

  ngOnInit() {
    this.initializing = true;
    //console.log('itemslide - onInit');
  }

  async doRefresh(event) {
    if (event) {
      console.log('re-read Gebetsschichten');
      
      this.churchtools.getGebetsschichten(7300,this.userfilter,this.explicitusername).then((result)=>{
        console.log('Reload Übersicht eigene Gebetsschichten');
        console.log(result.data);
        this.items = result.data;
        this.initializing = false;
      });
      event.target.complete();
    }
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
      alert(this.translate.instant('TUN.CANT_SWAP', { format }))
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
      alert(this.translate.instant('TUN.CANT_RELEASE', { format }))
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
