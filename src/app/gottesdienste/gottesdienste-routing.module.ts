import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GottesdienstePage } from './gottesdienste.page';

const routes: Routes = [
  {
    path: '',
    component: GottesdienstePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GottesdienstePageRoutingModule {}
