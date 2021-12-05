import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TunSwapPageRoutingModule } from './tun-swap-routing.module';

import { TunSwapPage } from './tun-swap.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TunSwapPageRoutingModule
  ],
  declarations: [TunSwapPage]
})
export class TunSwapPageModule {}
