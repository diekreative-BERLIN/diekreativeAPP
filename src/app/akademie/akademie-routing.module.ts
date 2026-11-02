import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AkademiePage } from './akademie.page';

const routes: Routes = [
  {
    path: '',
    component: AkademiePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AkademiePageRoutingModule {}
