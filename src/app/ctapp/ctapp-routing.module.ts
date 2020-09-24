import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CtappPage } from './ctapp.page';

const routes: Routes = [
  {
    path: '',
    component: CtappPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CtappPageRoutingModule {}
