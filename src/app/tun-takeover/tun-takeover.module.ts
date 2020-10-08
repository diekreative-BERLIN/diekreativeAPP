import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TunTakeoverPageRoutingModule } from './tun-takeover-routing.module';

import { TunTakeoverPage } from './tun-takeover.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TunTakeoverPageRoutingModule
  ],
  declarations: [TunTakeoverPage]
})
export class TunTakeoverPageModule {}
