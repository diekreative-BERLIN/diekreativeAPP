import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-general',
  templateUrl: './general.page.html',
  styleUrls: ['./general.page.scss'],
})
export class GeneralPage implements OnInit {

  modalTitle: string;
  modalText: string;
  showZoomHowto = false;

  constructor(
    private modalController: ModalController,
    private navParams: NavParams
  ) { }

  ngOnInit() {
    //console.table(this.navParams);
    this.modalText = this.navParams.data.paramText;
    this.modalTitle = this.navParams.data.paramTitle;
    this.showZoomHowto = this.navParams.data.paramShowHowto;
  }

  async closeModal() {
    const onClosedData: string = "Wrapped Up!";
    await this.modalController.dismiss(onClosedData);
  }

}