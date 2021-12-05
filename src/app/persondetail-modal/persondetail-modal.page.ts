import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserstateService } from '../userstate.service';

@Component({
  selector: 'app-persondetail-modal',
  templateUrl: './persondetail-modal.page.html',
  styleUrls: ['./persondetail-modal.page.scss'],
})
export class PersondetailModalPage implements OnInit {

  constructor(public modalController:ModalController, public userService: UserstateService) { }

  ngOnInit() {
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  logout(){
    this.userService.userLoggedOut();
    this.dismiss();
  }
}


