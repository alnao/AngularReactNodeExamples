import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
  path: 'pokemon',
  component: TabsPage,
  children: [
    {
    path: 'home',
    loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
    },
    {
    path: 'favoriti',
    loadChildren: () => import('../favoriti/favoriti.module').then(m => m.FavoritiPageModule)
    },
    {
    path: 'contatti',
    loadChildren: () => import('../contatti/contatti.module').then(m => m.ContattiPageModule)
    },
    {
    path: '',
    redirectTo: '/pokemon/home',
    pathMatch: 'full'
    }
  ]
  },
  {
  path: '',
  redirectTo: '/pokemon/home',
  pathMatch: 'full'
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
