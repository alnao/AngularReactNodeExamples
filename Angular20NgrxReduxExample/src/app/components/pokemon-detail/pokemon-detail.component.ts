import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { PokemonDetail } from '../../models/pokemon.model';
import * as PokemonSelectors from '../../store/pokemon/pokemon.selectors';
import * as PokemonActions from '../../store/pokemon/pokemon.actions';
import { PokemonState } from '../../store/pokemon/pokemon.reducer';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.css']
})
export class PokemonDetailComponent implements OnInit {
  selectedPokemon$: Observable<any>;
  isLoadingDetail$: Observable<boolean>;
  error$: Observable<string | null>;
  isFavorite$: Observable<boolean>;
  
  private pokemonId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<{ pokemon: PokemonState }>
  ) {
    this.selectedPokemon$ = this.store.select(PokemonSelectors.selectSelectedPokemon);
    this.isLoadingDetail$ = this.store.select(PokemonSelectors.selectIsLoading);
    this.error$ = this.store.select(PokemonSelectors.selectLoadingError);
    this.isFavorite$ = this.store.select(PokemonSelectors.createSelectIsFavorite(0)); // Sarà aggiornato
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.pokemonId = parseInt(params['id'], 10);
      
      // Aggiorna l'observable per i favoriti con l'ID corretto
      this.isFavorite$ = this.store.select(
        PokemonSelectors.createSelectIsFavorite(this.pokemonId)
      );
      
      // Carica il dettaglio del Pokemon
      this.store.dispatch(PokemonActions.loadPokemonDetail({ 
        id: this.pokemonId.toString() 
      }));
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }

  toggleFavorite(pokemonId: number) {
    // Approccio più semplice: leggi lo stato attuale e dispatcha l'azione opposta
    const currentFavorites = JSON.parse(localStorage.getItem('pokemonFavorites') || '[]');
    const isFavorite = currentFavorites.includes(pokemonId);
    
    if (isFavorite) {
      this.store.dispatch(PokemonActions.removeFromFavorites({ pokemonId }));
    } else {
      this.store.dispatch(PokemonActions.addToFavorites({ pokemonId }));
    }
  }

  retry() {
    this.store.dispatch(PokemonActions.clearError());
    this.store.dispatch(PokemonActions.loadPokemonDetail({ 
      id: this.pokemonId.toString() 
    }));
  }

  formatStatName(statName: string): string {
    const statNames: { [key: string]: string } = {
      'hp': 'HP',
      'attack': 'Attacco',
      'defense': 'Difesa',
      'special-attack': 'Att. Speciale',
      'special-defense': 'Dif. Speciale',
      'speed': 'Velocità'
    };
    return statNames[statName] || statName;
  }
}
