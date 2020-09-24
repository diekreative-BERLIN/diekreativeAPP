import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GottesdienstePageRoutingModule } from './gottesdienste-routing.module';

import { GottesdienstePage } from './gottesdienste.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GottesdienstePageRoutingModule
  ],
  declarations: [GottesdienstePage]
})
export class GottesdienstePageModule {}
