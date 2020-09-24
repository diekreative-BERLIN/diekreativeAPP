import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { MbscModule } from '@mobiscroll/angular';

import { IonicModule } from '@ionic/angular';

import { AboutusPageRoutingModule } from './aboutus-routing.module';

import { AboutusPage } from './aboutus.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MbscModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    AboutusPageRoutingModule
  ],
  declarations: [AboutusPage]
})
export class AboutusPageModule {}
