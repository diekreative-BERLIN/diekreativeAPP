import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TunGebetscalPageRoutingModule } from './tun-gebetscalHN-routing.module';

import { TunGebetscalPage } from './tun-gebetscalHN.page';

import {DemoMaterialModule} from '../material-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TunGebetscalPageRoutingModule,
    DemoMaterialModule,
    TranslateModule
  ],
  declarations: [TunGebetscalPage]
})
export class TunGebetscalPageModule {}
