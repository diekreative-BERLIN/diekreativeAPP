import { Component, OnInit } from '@angular/core';
import { NavController } from "@ionic/angular";
import { ChurchapiService } from '../connectors/churchapi.service';

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
  constructor(
    public navCtrl: NavController,
    private popover:PopoverController,
    private churchtools:ChurchapiService) {
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
    this.popover.create({component:TunSwapPage,
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


  releaseItem(item,sessID){
    console.log('gib Schicht mit ID='+sessID+' frei!');
    this.popover.create({component:TunReleasePage,
          componentProps: {
            sessID: sessID
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

  ngOnInit() {
  }

}
