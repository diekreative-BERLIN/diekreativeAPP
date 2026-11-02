import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TagundnachtPageRoutingModule } from './tagundnacht-routing.module';

import { TagundnachtPage } from './tagundnacht.page';

import {DemoMaterialModule} from '../material-module';
//import {MatCommonModule} from '@angular/material/core';
//import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {MatNativeDateModule} from '@angular/material/core';
import { UnescapePipe } from '../unescape.pipe';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatNativeDateModule,
    TagundnachtPageRoutingModule,
    DemoMaterialModule
    //MatCommonModule
  ],
  declarations: [TagundnachtPage, UnescapePipe]
})
export class TagundnachtPageModule {}
