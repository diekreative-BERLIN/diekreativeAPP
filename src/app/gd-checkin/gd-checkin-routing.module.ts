import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GdCheckinPage } from './gd-checkin.page';

const routes: Routes = [
  {
    path: '',
    component: GdCheckinPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GdCheckinPageRoutingModule {}
