import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule, Platform } from '@ionic/angular';

import { CtappPageRoutingModule } from './ctapp-routing.module';

import { CtappPage } from './ctapp.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CtappPageRoutingModule
  ],
  declarations: [CtappPage]
})
export class CtappPageModule implements OnInit {
  runningOn: String = 'android';
  constructor(
    public platform: Platform
  ) { }
  ngOnInit() {
    // If we're on iOS, show iOS images
    if (this.platform.is('ios')) {
      this.runningOn = 'ios';
    }
  }

}
