import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-tun-gebetscal',
  templateUrl: './tun-gebetscal.page.html',
  styleUrls: ['./tun-gebetscal.page.scss'],
})
export class TunGebetscalPage implements OnInit {

  loading;
  constructor(
    public loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.showLoader();
  }

  // This will show the loader
  showLoader() {
    this.loading = this.loadingController.create({
      message: 'Gebetskalender wird geladen...',
      duration: 3000
    }).then((res) => {
      res.present();
    });
  }


// Hide the loader if already created otherwise return error
hideLoader() {
  this.loadingController.dismiss().then((res) => {
    console.log('Loading dismissed!', res);
  }).catch((error) => {
    console.log('error', error);
  });

  }
}
