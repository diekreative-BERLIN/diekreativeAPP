import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-audienz',
  templateUrl: './audienz.page.html',
  styleUrls: ['./audienz.page.scss'],
})
export class AudienzPage implements OnInit {

  loading;
  constructor(
    private platform: Platform,
    public loadingController: LoadingController,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.showLoader();
  }

  // This will show the loader
  showLoader() {
    this.loading = this.loadingController.create({
      message: 'Audienz Website wird geladen...',
      duration: 1500
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
