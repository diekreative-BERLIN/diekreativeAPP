import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TunTakeoverPage } from './tun-takeover.page';

const routes: Routes = [
  {
    path: '',
    component: TunTakeoverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TunTakeoverPageRoutingModule {}
