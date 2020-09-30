import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TunTakewatchesPage } from './tun-takewatches.page';

const routes: Routes = [
  {
    path: '',
    component: TunTakewatchesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TunTakewatchesPageRoutingModule {}
