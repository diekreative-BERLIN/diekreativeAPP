import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PersondetailModalPage } from './persondetail-modal.page';

const routes: Routes = [
  {
    path: '',
    component: PersondetailModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PersondetailModalPageRoutingModule {}
