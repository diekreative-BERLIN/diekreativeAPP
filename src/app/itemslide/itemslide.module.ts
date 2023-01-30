import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ItemslidePageRoutingModule } from './itemslide-routing.module';

import { ItemslidePage } from './itemslide.page';

import {DemoMaterialModule} from '../material-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ItemslidePageRoutingModule,
    DemoMaterialModule
  ],
  declarations: [ItemslidePage]
})
export class ItemslidePageModule {}
