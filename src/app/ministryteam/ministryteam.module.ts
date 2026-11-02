import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MinistryteamPageRoutingModule } from './ministryteam-routing.module';

import { MinistryteamPage } from './ministryteam.page';

import {DemoMaterialModule} from '../material-module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MinistryteamPageRoutingModule,
    DemoMaterialModule
    //MatCommonModule
  ],
  declarations: [MinistryteamPage]
})
export class MinistryteamPageModule {}
