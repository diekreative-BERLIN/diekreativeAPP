import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LifegroupsPageRoutingModule } from './lifegroups-routing.module';

import { LifegroupsPage } from './lifegroups.page';

//import directive
import { IframeTrackerDirective} from './lifegroups.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LifegroupsPageRoutingModule
  ],
  declarations: [LifegroupsPage, IframeTrackerDirective]
})
export class LifegroupsPageModule {}
