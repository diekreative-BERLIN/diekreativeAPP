import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LifegroupsPageRoutingModule } from './lifegroups-routing.module';

import { LifegroupsPage } from './lifegroups.page';
import { LgMapComponent } from '../lg-map/lg-map.component';
import { LgListComponent } from '../lg-list/lg-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LifegroupsPageRoutingModule
  ],
  declarations: [LifegroupsPage, LgMapComponent, LgListComponent]
})
export class LifegroupsPageModule {}
