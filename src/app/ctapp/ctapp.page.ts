import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-ctapp',
  templateUrl: './ctapp.page.html',
  styleUrls: ['./ctapp.page.scss'],
})
export class CtappPage implements OnInit {

  constructor(private iab: InAppBrowser, private platform: Platform) { }

  ngOnInit() {
  }

  openWebsite(url){
    this.platform.ready().then(() => {
      this.iab.create(url,'_system');

    });
  }

}
