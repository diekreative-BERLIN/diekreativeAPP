import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TunGebetscalPageRoutingModule } from './tun-gebetscal-routing.module';

import { TunGebetscalPage } from './tun-gebetscal.page';

import {DemoMaterialModule} from '../material-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TunGebetscalPageRoutingModule,
    DemoMaterialModule
  ],
  declarations: [TunGebetscalPage]
})
export class TunGebetscalPageModule {}
