import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TunTakewatchesPageRoutingModule } from './tun-takewatches-routing.module';

import { TunTakewatchesPage } from './tun-takewatches.page';

import {DemoMaterialModule} from '../material-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TunTakewatchesPageRoutingModule,
    DemoMaterialModule
  ],
  declarations: [TunTakewatchesPage]
})
export class TunTakewatchesPageModule {}
