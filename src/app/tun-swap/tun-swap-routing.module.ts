import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TunSwapPage } from './tun-swap.page';

const routes: Routes = [
  {
    path: '',
    component: TunSwapPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TunSwapPageRoutingModule {}
