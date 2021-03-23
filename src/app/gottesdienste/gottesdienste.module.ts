import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GottesdienstePageRoutingModule } from './gottesdienste-routing.module';

import { GottesdienstePage } from './gottesdienste.page';

import {DemoMaterialModule} from '../material-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GottesdienstePageRoutingModule,
    DemoMaterialModule
  ],
  declarations: [GottesdienstePage]
})
export class GottesdienstePageModule {}
