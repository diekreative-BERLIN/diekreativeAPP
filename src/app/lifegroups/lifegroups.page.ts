import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-lifegroups',
  templateUrl: './lifegroups.page.html',
  styleUrls: ['./lifegroups.page.scss'],
})
export class LifegroupsPage implements OnInit {
  AppPlatform = "";

  constructor(private platform: Platform) { }

  ngOnInit() {
    if(this.platform.is('android')) {
      this.AppPlatform="android";
    } else {
      this.AppPlatform="iOS";
    }
  }
  
}


