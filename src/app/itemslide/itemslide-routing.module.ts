import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ItemslidePage } from './itemslide.page';

const routes: Routes = [
  {
    path: '',
    component: ItemslidePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ItemslidePageRoutingModule {}
