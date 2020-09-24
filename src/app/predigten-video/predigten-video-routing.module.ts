import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PredigtenVideoPage } from './predigten-video.page';

const routes: Routes = [
  {
    path: '',
    component: PredigtenVideoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PredigtenVideoPageRoutingModule {}
