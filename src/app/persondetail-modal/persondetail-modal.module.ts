import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PersondetailModalPageRoutingModule } from './persondetail-modal-routing.module';

import { PersondetailModalPage } from './persondetail-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PersondetailModalPageRoutingModule
  ],
  declarations: [PersondetailModalPage]
})
export class PersondetailModalPageModule {}
