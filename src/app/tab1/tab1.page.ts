import { Component } from '@angular/core';
import { LoginModalPage } from '../login-modal/login-modal.page';
import { ModalController } from '@ionic/angular';
import { HttpClient } from "@angular/common/http";
import { UserstateService } from '../userstate.service';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(
    public modalController: ModalController,
    private http: HttpClient,
    private userState: UserstateService
  ) { }
  
  public async presentModal() {
    const modal = await this.modalController.create({
      component: LoginModalPage,
      //cssClass: 'login-modal-class'
    });
    console.log("try presentiung modal");
    return await modal.present();
  }

  ionViewWillEnter() {
    this.userState.doCronjobs();
  }


}