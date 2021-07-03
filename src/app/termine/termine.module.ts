import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TerminePagePageRoutingModule } from './termine-routing.module';

import { TerminePage } from './termine.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TerminePagePageRoutingModule
  ],
  declarations: [TerminePage]
})
export class TerminePageModule {}
