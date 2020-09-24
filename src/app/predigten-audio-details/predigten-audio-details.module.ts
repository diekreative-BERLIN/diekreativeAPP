import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PredigtenAudioDetailsPageRoutingModule } from './predigten-audio-details-routing.module';

import { PredigtenAudioDetailsPage } from './predigten-audio-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PredigtenAudioDetailsPageRoutingModule
  ],
  declarations: [PredigtenAudioDetailsPage]
})
export class PredigtenAudioDetailsPageModule {}
