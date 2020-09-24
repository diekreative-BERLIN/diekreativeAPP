import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UeberUnsPage } from './ueber-uns.page';

const routes: Routes = [
  {
    path: '',
    component: UeberUnsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UeberUnsPageRoutingModule {}
