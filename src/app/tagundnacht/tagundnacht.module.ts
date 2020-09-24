import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TagundnachtPageRoutingModule } from './tagundnacht-routing.module';

import { TagundnachtPage } from './tagundnacht.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TagundnachtPageRoutingModule
  ],
  declarations: [TagundnachtPage]
})
export class TagundnachtPageModule {}
