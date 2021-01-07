import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadChildren: () => import('../tab1/tab1.module').then(m => m.Tab1PageModule)
      },
      {
        path: 'tab2',
        loadChildren: () => import('../tab2/tab2.module').then(m => m.Tab2PageModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('../settings/settings.module').then( m => m.SettingsPageModule)
      },
      {
        path: 'predigten-audio',
        loadChildren: () => import('../predigten-audio/predigten-audio.module').then( m => m.PredigtenAudioPageModule)
      },
      {
        path: 'predigten-audio-details',
        loadChildren: () => import('../predigten-audio-details/predigten-audio-details.module').then( m => m.PredigtenAudioDetailsPageModule)
      },
      {
        path: 'gottesdienste',
        loadChildren: () => import('../gottesdienste/gottesdienste.module').then( m => m.GottesdienstePageModule)
      },
      {
        path: 'tagundnacht',
        loadChildren: () => import('../tagundnacht/tagundnacht.module').then( m => m.TagundnachtPageModule)
      },
      
      {
        path: 'itemslide',
        loadChildren: () => import('../itemslide/itemslide.module').then( m => m.ItemslidePageModule)
      },
      {
        path: 'tun-gebetscal',
        loadChildren: () => import('../tun-gebetscal/tun-gebetscal.module').then( m => m.TunGebetscalPageModule)
      },
      {
        path: 'tun-takewatches',
        loadChildren: () => import('../tun-takewatches/tun-takewatches.module').then( m => m.TunTakewatchesPageModule)
      },
      {
        path: 'tun-swap',
        loadChildren: () => import('../tun-swap/tun-swap.module').then( m => m.TunSwapPageModule)
      },
      {
        path: 'tun-release',
        loadChildren: () => import('../tun-release/tun-release.module').then( m => m.TunReleasePageModule)
      },
      {
        path: 'tun-takeover',
        loadChildren: () => import('../tun-takeover/tun-takeover.module').then( m => m.TunTakeoverPageModule)
      },

      {
        path: 'lifegroups',
        loadChildren: () => import('../lifegroups/lifegroups.module').then( m => m.LifegroupsPageModule)
      },
      {
        path: 'credits',
        loadChildren: () => import('../credits/credits.module').then( m => m.CreditsPageModule)
      },
      {
        path: 'ctapp',
        loadChildren: () => import('../ctapp/ctapp.module').then( m => m.CtappPageModule)
      },
      {
        path: 'aboutus',
        loadChildren: () => import('../aboutus/aboutus.module').then( m => m.AboutusPageModule)
      },
      {
        path: 'erlebt',
        loadChildren: () => import('../erlebt/erlebt.module').then( m => m.ErlebtPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
