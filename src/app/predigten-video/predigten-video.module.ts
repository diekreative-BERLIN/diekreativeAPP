import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PredigtenVideoPageRoutingModule } from './predigten-video-routing.module';

import { PredigtenVideoPage } from './predigten-video.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PredigtenVideoPageRoutingModule
  ],
  declarations: [PredigtenVideoPage]
})
export class PredigtenVideoPageModule {}
