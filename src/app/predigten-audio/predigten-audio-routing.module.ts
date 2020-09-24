import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PredigtenAudioPage } from './predigten-audio.page';

const routes: Routes = [
  {
    path: '',
    component: PredigtenAudioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PredigtenAudioPageRoutingModule {}
