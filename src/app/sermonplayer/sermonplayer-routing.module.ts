import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SermonplayerPage } from './sermonplayer.page';

const routes: Routes = [
  {
    path: '',
    component: SermonplayerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SermonplayerPageRoutingModule {}
