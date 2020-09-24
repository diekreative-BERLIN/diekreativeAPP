import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UeberUnsPageRoutingModule } from './ueber-uns-routing.module';

import { UeberUnsPage } from './ueber-uns.page';
import { TextAccordionComponent } from '../text-accordion/text-accordion.component';
import { VisionAccordionComponent } from '../vision-accordion/vision-accordion.component';
import { GemeindeleitungAccordionComponent } from '../gemeindeleitung-accordion/gemeindeleitung-accordion.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UeberUnsPageRoutingModule
  ],
  declarations: [UeberUnsPage, TextAccordionComponent, VisionAccordionComponent, GemeindeleitungAccordionComponent]
})
export class UeberUnsPageModule {}
