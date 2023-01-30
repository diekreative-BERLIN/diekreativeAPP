import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'login-modal',
    loadChildren: () => import('./login-modal/login-modal.module').then( m => m.LoginModalPageModule)
  },
  {
    path: 'persondetail-modal',
    loadChildren: () => import('./persondetail-modal/persondetail-modal.module').then( m => m.PersondetailModalPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'predigten-video',
    loadChildren: () => import('./predigten-video/predigten-video.module').then( m => m.PredigtenVideoPageModule)
  },
  {
    path: 'predigten-audio',
    loadChildren: () => import('./predigten-audio/predigten-audio.module').then( m => m.PredigtenAudioPageModule)
  },
  {
    path: 'predigten-audio-details',
    loadChildren: () => import('./predigten-audio-details/predigten-audio-details.module').then( m => m.PredigtenAudioDetailsPageModule)
  },
  {
    path: 'lifegroups',
    loadChildren: () => import('./lifegroups/lifegroups.module').then( m => m.LifegroupsPageModule)
  },
  {
    path: 'gottesdienste',
    loadChildren: () => import('./gottesdienste/gottesdienste.module').then( m => m.GottesdienstePageModule)
  },
  {
    path: 'credits',
    loadChildren: () => import('./credits/credits.module').then( m => m.CreditsPageModule)
  },
  {
    path: 'ctapp',
    loadChildren: () => import('./ctapp/ctapp.module').then( m => m.CtappPageModule)
  },
  {
    path: 'aboutus',
    loadChildren: () => import('./aboutus/aboutus.module').then( m => m.AboutusPageModule)
  },
  {
    path: 'itemslide',
    loadChildren: () => import('./itemslide/itemslide.module').then( m => m.ItemslidePageModule)
  },
  {
    path: 'tun-gebetscal',
    loadChildren: () => import('./tun-gebetscal/tun-gebetscal.module').then( m => m.TunGebetscalPageModule)
  },
  {
    path: 'tun-takewatches',
    loadChildren: () => import('./tun-takewatches/tun-takewatches.module').then( m => m.TunTakewatchesPageModule)
  },
  {
    path: 'tun-swap',
    loadChildren: () => import('./tun-swap/tun-swap.module').then( m => m.TunSwapPageModule)
  },
  {
    path: 'tun-release',
    loadChildren: () => import('./tun-release/tun-release.module').then( m => m.TunReleasePageModule)
  },
  {
    path: 'tun-takeover',
    loadChildren: () => import('./tun-takeover/tun-takeover.module').then( m => m.TunTakeoverPageModule)
  },
  {
    path: 'erlebt',
    loadChildren: () => import('./erlebt/erlebt.module').then( m => m.ErlebtPageModule)
  },
  {
    path: 'general',
    loadChildren: () => import('./modals/general/general.module').then( m => m.GeneralPageModule)
  },
  {
    path: 'termine',
    loadChildren: () => import('./termine/termine.module').then( m => m.TerminePageModule)
  },
  {
    path: 'audienz',
    loadChildren: () => import('./audienz/audienz.module').then( m => m.AudienzPageModule)
  },
  {
    path: 'akademie',
    loadChildren: () => import('./akademie/akademie.module').then( m => m.AkademiePageModule)
  },  {
    path: 'sermonplayer',
    loadChildren: () => import('./sermonplayer/sermonplayer.module').then( m => m.SermonplayerPageModule)
  }



];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
