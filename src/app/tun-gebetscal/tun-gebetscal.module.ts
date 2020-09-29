import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TunGebetscalPageRoutingModule } from './tun-gebetscal-routing.module';

import { TunGebetscalPage } from './tun-gebetscal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TunGebetscalPageRoutingModule
  ],
  declarations: [TunGebetscalPage]
})
export class TunGebetscalPageModule {}
