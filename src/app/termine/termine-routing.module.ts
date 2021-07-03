import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TerminePage } from './termine.page';

const routes: Routes = [
  {
    path: '',
    component: TerminePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TerminePagePageRoutingModule {}
