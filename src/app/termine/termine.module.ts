import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TerminePagePageRoutingModule } from './termine-routing.module';

import { TerminePage } from './termine.page';
import { SafePipe } from '../SafePipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TerminePagePageRoutingModule,
    TranslateModule
  ],
  declarations: [TerminePage, SafePipe]
})
export class TerminePageModule {}
