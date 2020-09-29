import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ItemslidePageRoutingModule } from './itemslide-routing.module';

import { ItemslidePage } from './itemslide.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ItemslidePageRoutingModule
  ],
  declarations: [ItemslidePage]
})
export class ItemslidePageModule {}
