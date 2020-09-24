import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LifegroupsPage } from './lifegroups.page';

const routes: Routes = [
  {
    path: '',
    component: LifegroupsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LifegroupsPageRoutingModule {}
