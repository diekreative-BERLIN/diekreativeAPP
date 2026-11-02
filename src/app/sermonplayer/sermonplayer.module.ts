import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SermonplayerPageRoutingModule } from './sermonplayer-routing.module';

import { SermonplayerPage } from './sermonplayer.page';
import { toHHMMSSPipe } from '../toHHMMSSPipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SermonplayerPageRoutingModule
  ],
  declarations: [SermonplayerPage, toHHMMSSPipe],
  exports: [toHHMMSSPipe]
})
export class SermonplayerPageModule {}
