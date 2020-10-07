import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TunReleasePageRoutingModule } from './tun-release-routing.module';

import { TunReleasePage } from './tun-release.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TunReleasePageRoutingModule
  ],
  declarations: [TunReleasePage]
})
export class TunReleasePageModule {}
