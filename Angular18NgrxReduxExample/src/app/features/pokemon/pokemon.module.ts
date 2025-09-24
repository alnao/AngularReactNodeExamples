import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { 
  PokemonDataGuard, 
  PokemonDetailGuard, 
  FavoritesGuard,
  PokemonFullDataGuard 
} from '../../guards/pokemon.guards';

// Routes per il feature module Pokemon
const routes: Routes = [
  {
    path: '',
    loadComponent: () => 
      import('../../components/pokemon-list/pokemon-list.component').then(
        c => c.PokemonListComponent
      ),
    canActivate: [PokemonFullDataGuard],
    data: { title: 'Lista Pokémon' }
  },
  {
    path: 'list',
    loadComponent: () => 
      import('../../components/pokemon-list/pokemon-list.component').then(
        c => c.PokemonListComponent
      ),
    canActivate: [PokemonFullDataGuard],
    data: { title: 'Lista Pokémon' }
  },
  {
    path: 'favorites',
    loadComponent: () => 
      import('../../components/pokemon-list/pokemon-list.component').then(
        c => c.PokemonListComponent
      ),
    canActivate: [FavoritesGuard, PokemonFullDataGuard],
    data: { 
      title: 'Pokémon Preferiti',
      showFavoritesOnly: true 
    }
  },
  {
    path: 'detail/:id',
    loadComponent: () => 
      import('../../components/pokemon-detail/pokemon-detail.component').then(
        c => c.PokemonDetailComponent
      ),
    canActivate: [PokemonDetailGuard],
    data: { title: 'Dettaglio Pokémon' }
  },
  {
    path: 'type/:typeName',
    loadComponent: () => 
      import('../../components/pokemon-list/pokemon-list.component').then(
        c => c.PokemonListComponent
      ),
    canActivate: [PokemonDataGuard],
    data: { title: 'Pokémon per Tipo' }
  },
  {
    path: 'search/:term',
    loadComponent: () => 
      import('../../components/pokemon-list/pokemon-list.component').then(
        c => c.PokemonListComponent
      ),
    canActivate: [PokemonDataGuard],
    data: { title: 'Ricerca Pokémon' }
  }
];

@NgModule({
  declarations: [
    // Rimuoviamo PokemonListComponent perché è ora standalone
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
    
    // Store e Effects sono già configurati nell'AppModule
    // Rimuoviamo la doppia registrazione per evitare conflitti
  ],
  providers: [
    // Guards specifici per questo feature
    PokemonDataGuard,
    PokemonDetailGuard,
    FavoritesGuard,
    PokemonFullDataGuard
  ]
})
export class PokemonFeatureModule { 
  
  constructor() {
    console.log('🚀 Pokemon Feature Module caricato (lazy loaded)');
  }
}
