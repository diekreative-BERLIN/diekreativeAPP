import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GdCheckinPageRoutingModule } from './gd-checkin-routing.module';

import { GdCheckinPage } from './gd-checkin.page';

import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GdCheckinPageRoutingModule,
    QRCodeModule
  ],
  declarations: [GdCheckinPage]
})
export class GdCheckinPageModule {}
