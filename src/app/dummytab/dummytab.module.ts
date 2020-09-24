import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DummytabPageRoutingModule } from './dummytab-routing.module';

import { DummytabPage } from './dummytab.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DummytabPageRoutingModule
  ],
  declarations: [DummytabPage]
})
export class DummytabPageModule {}
