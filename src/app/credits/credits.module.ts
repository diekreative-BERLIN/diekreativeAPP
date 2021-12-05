import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreditsPageRoutingModule } from './credits-routing.module';

import { CreditsPage } from './credits.page';

import {DemoMaterialModule} from '../material-module';
//import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
//import {BrowserModule} from '@angular/platform-browser';
//import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatNativeDateModule} from '@angular/material/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreditsPageRoutingModule,
    DemoMaterialModule,
    MatNativeDateModule
  ],
  declarations: [CreditsPage]
})
export class CreditsPageModule {}
