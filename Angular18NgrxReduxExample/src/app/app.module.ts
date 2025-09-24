import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';

import { pokemonReducer } from './store/pokemon/pokemon.reducer';
import { PokemonEffects } from './store/pokemon/pokemon.effects';

// Routes principali dell'applicazione
const routes: Routes = [
  {
    path: '',
    redirectTo: '/pokemon',
    pathMatch: 'full'
  },
  {
    path: 'pokemon',
    loadChildren: () => 
      import('./features/pokemon/pokemon.module').then(m => m.PokemonFeatureModule)
  },
  {
    path: '**',
    redirectTo: '/pokemon'
  }
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    
    // Store root configuration
    StoreModule.forRoot({
      pokemon: pokemonReducer
    }, {}),
    
    // Effects root
    EffectsModule.forRoot([PokemonEffects]),
    
    // DevTools per development
    StoreDevtoolsModule.instrument({ 
      maxAge: 25, 
      logOnly: !isDevMode()
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
