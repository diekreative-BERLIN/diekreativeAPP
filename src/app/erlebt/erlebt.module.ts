import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ErlebtPageRoutingModule } from './erlebt-routing.module';

import { ErlebtPage } from './erlebt.page';

import {DemoMaterialModule} from '../material-module';

import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ErlebtPageRoutingModule,
    DemoMaterialModule
  ],
  declarations: [ErlebtPage],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  ]
})
export class ErlebtPageModule {}
