import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MinistryteamPage } from './ministryteam.page';

const routes: Routes = [
  {
    path: '',
    component: MinistryteamPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MinistryteamPageRoutingModule {}
