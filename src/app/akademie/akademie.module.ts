import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AkademiePageRoutingModule } from './akademie-routing.module';

import { AkademiePage } from './akademie.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AkademiePageRoutingModule,
    TranslateModule
  ],
  declarations: [AkademiePage]
})
export class AkademiePageModule {}
