import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ErlebtPageRoutingModule } from './erlebt-routing.module';

import { ErlebtPage } from './erlebt.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ErlebtPageRoutingModule
  ],
  declarations: [ErlebtPage]
})
export class ErlebtPageModule {}
