import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AudienzPage } from './audienz.page';

const routes: Routes = [
  {
    path: '',
    component: AudienzPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AudienzPageRoutingModule {}
