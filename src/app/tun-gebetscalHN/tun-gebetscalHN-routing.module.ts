import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TunGebetscalPage } from './tun-gebetscalHN.page';

const routes: Routes = [
  {
    path: '',
    component: TunGebetscalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TunGebetscalPageRoutingModule {}
