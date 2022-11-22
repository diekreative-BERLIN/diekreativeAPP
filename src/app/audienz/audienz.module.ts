import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AudienzPageRoutingModule } from './audienz-routing.module';

import { AudienzPage } from './audienz.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AudienzPageRoutingModule
  ],
  declarations: [AudienzPage]
})
export class AudienzPageModule {}
