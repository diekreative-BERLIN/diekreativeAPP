import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ErlebtPage } from './erlebt.page';

const routes: Routes = [
  {
    path: '',
    component: ErlebtPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ErlebtPageRoutingModule {}
