import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TunReleasePage } from './tun-release.page';

const routes: Routes = [
  {
    path: '',
    component: TunReleasePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TunReleasePageRoutingModule {}
