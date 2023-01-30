import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tun-gebetscal',
  templateUrl: './tun-gebetscal.page.html',
  styleUrls: ['./tun-gebetscal.page.scss'],
})
export class TunGebetscalPage implements OnInit {

  loading;
  constructor(
    private platform: Platform,
    public loadingController: LoadingController,
    private router: Router
  ) {
    //this.platform.backButton.subscribeWithPriority(10, () => {
    //  this.router.navigate(["/tabs/tagundnacht"]);
    //});  
  }

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

  BackActivated() {
    this.router.navigate(["/tabs/tagundnacht"]);
  }

}
