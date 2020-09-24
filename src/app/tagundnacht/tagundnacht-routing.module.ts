import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TagundnachtPage } from './tagundnacht.page';

const routes: Routes = [
  {
    path: '',
    component: TagundnachtPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TagundnachtPageRoutingModule {}
