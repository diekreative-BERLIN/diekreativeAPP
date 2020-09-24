import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PredigtenAudioDetailsPage } from './predigten-audio-details.page';

const routes: Routes = [
  {
    path: '',
    component: PredigtenAudioDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PredigtenAudioDetailsPageRoutingModule {}
