import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DummytabPage } from './dummytab.page';

const routes: Routes = [
  {
    path: '',
    component: DummytabPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DummytabPageRoutingModule {}
