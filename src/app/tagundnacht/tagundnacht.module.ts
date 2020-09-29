import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TagundnachtPageRoutingModule } from './tagundnacht-routing.module';

import { TagundnachtPage } from './tagundnacht.page';

import {DemoMaterialModule} from '../material-module';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {MatNativeDateModule} from '@angular/material/core';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DemoMaterialModule,
    MatNativeDateModule,
    TagundnachtPageRoutingModule
  ],
  declarations: [TagundnachtPage]
})
export class TagundnachtPageModule {}
