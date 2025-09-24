import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { 
  map, 
  catchError, 
  switchMap, 
  withLatestFrom, 
  tap,
  debounceTime,
  distinctUntilChanged,
  filter
} from 'rxjs/operators';

import { PokemonService } from '../../services/pokemon.service';
import { Pokemon } from '../../models/pokemon.model';
import * as PokemonActions from './pokemon.actions';
import * as PokemonSelectors from './pokemon.selectors';
import { PokemonState } from './pokemon.reducer';

@Injectable()
export class PokemonEffects {

  constructor(
    private actions$: Actions,
    private pokemonService: PokemonService,
    private store: Store<{ pokemon: PokemonState }>
  ) {}

  // Effect per caricamento lista Pokemon
  loadPokemonList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PokemonActions.loadPokemonList),
      withLatestFrom(this.store.select(PokemonSelectors.selectPagination)),
      switchMap(([action, pagination]) => {
        const page = action.page || pagination.currentPage;
        const limit = action.limit || pagination.itemsPerPage;
        
        return this.pokemonService.loadPokemonListWithBasicDetails(page, limit).pipe(
          map(({ pagination: paginationResponse, pokemonWithDetails }) =>
            PokemonActions.loadPokemonListSuccess({
              pagination: paginationResponse,
              pokemon: pokemonWithDetails
            })
          ),
          catchError(error =>
            of(PokemonActions.loadPokemonListFailure({
              error: error.message || 'Errore nel caricamento dei Pokemon'
            }))
          )
        );
      })
    )
  );

  // Effect per caricamento dettagli singolo Pokemon
  loadPokemonDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PokemonActions.loadPokemonDetail),
      switchMap(action =>
        this.pokemonService.loadPokemonDetail(action.id).pipe(
          map(pokemon =>
            PokemonActions.loadPokemonDetailSuccess({ pokemon })
          ),
          catchError(error =>
            of(PokemonActions.loadPokemonDetailFailure({
              error: error.message || 'Errore nel caricamento del dettaglio Pokemon'
            }))
          )
        )
      )
    )
  );

  // Effect per navigazione pagine
  navigateToPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PokemonActions.navigateToPage),
      map(action =>
        PokemonActions.loadPokemonList({ page: action.page })
      )
    )
  );

  navigateNext$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PokemonActions.navigateNext),
      withLatestFrom(this.store.select(PokemonSelectors.selectPagination)),
      filter(([, pagination]) => pagination.hasNext),
      map(([, pagination]) =>
        PokemonActions.navigateToPage({ page: pagination.currentPage + 1 })
      )
    )
  );

  navigatePrevious$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PokemonActions.navigatePrevious),
      withLatestFrom(this.store.select(PokemonSelectors.selectPagination)),
      filter(([, pagination]) => pagination.hasPrevious),
      map(([, pagination]) =>
        PokemonActions.navigateToPage({ page: pagination.currentPage - 1 })
      )
    )
  );

  // Effect per cambio items per pagina
  setItemsPerPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PokemonActions.setItemsPerPage),
      map(() =>
        PokemonActions.loadPokemonList({ page: 1 })
      )
    )
  );

  // Effect per ricerca Pokemon (con debounce)
  searchPokemon$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PokemonActions.searchPokemon),
      debounceTime(300), // Debounce per evitare troppe chiamate
      distinctUntilChanged((prev, curr) => prev.searchTerm === curr.searchTerm),
      filter(action => action.searchTerm.length >= 2 || action.searchTerm.length === 0),
      switchMap(action => {
        if (action.searchTerm.length === 0) {
          // Se il termine è vuoto, ricarica la lista normale
          return of(PokemonActions.loadPokemonList({ page: 1 }));
        }
        
        return this.pokemonService.searchPokemon(action.searchTerm).pipe(
          switchMap(searchResults => {
            // Carica i dettagli dei primi risultati trovati
            const limitedResults = searchResults.slice(0, 20);
            return this.pokemonService.loadPokemonListWithBasicDetails(1, 20).pipe(
              map(({ pagination, pokemonWithDetails }) => {
                const filteredPokemon = pokemonWithDetails.filter(pokemon =>
                  searchResults.some(result => result.name === pokemon.name)
                );
                return PokemonActions.loadPokemonListSuccess({
                  pagination: {
                    ...pagination,
                    count: filteredPokemon.length,
                    results: filteredPokemon.map(p => ({ name: p.name, url: `https://pokeapi.co/api/v2/pokemon/${p.id}/` }))
                  },
                  pokemon: filteredPokemon
                });
              })
            );
          }),
          catchError(error =>
            of(PokemonActions.loadPokemonListFailure({
              error: error.message || 'Errore nella ricerca Pokemon'
            }))
          )
        );
      })
    )
  );

  // Effect per caricamento tipi Pokemon
  loadPokemonTypes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PokemonActions.loadPokemonTypes),
      switchMap(() =>
        this.pokemonService.loadPokemonTypes().pipe(
          map(types =>
            PokemonActions.loadPokemonTypesSuccess({ types })
          ),
          catchError(error =>
            of(PokemonActions.loadPokemonTypesFailure({
              error: error.message || 'Errore nel caricamento dei tipi Pokemon'
            }))
          )
        )
      )
    )
  );

  // Effect per filtro per tipo
  filterByType$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PokemonActions.filterByType),
      switchMap(action => {
        if (!action.typeName) {
          return of(PokemonActions.loadPokemonList({ page: 1 }));
        }
        
        return of(PokemonActions.loadPokemonByType({ typeName: action.typeName }));
      })
    )
  );

  // Effect per caricamento Pokemon per tipo
  loadPokemonByType$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PokemonActions.loadPokemonByType),
      switchMap(action =>
        this.pokemonService.loadPokemonByType(action.typeName).pipe(
          switchMap(pokemonList => {
            // Carica i dettagli dei primi 20 Pokemon del tipo
            const limitedList = pokemonList.slice(0, 20);
            const detailRequests = limitedList.map(pokemon => {
              const id = this.extractIdFromUrl(pokemon.url);
              return this.pokemonService.loadPokemonDetail(id.toString());
            });
            
            // Esegui le chiamate in parallelo
            return this.pokemonService.loadPokemonListWithBasicDetails(1, 20).pipe(
              map(({ pokemonWithDetails }) => {
                const filteredPokemon = pokemonWithDetails.filter((p: Pokemon) =>
                  limitedList.some(listItem => listItem.name === p.name)
                );
                return PokemonActions.loadPokemonByTypeSuccess({
                  pokemon: filteredPokemon,
                  typeName: action.typeName
                });
              })
            );
          }),
          catchError(error =>
            of(PokemonActions.loadPokemonByTypeFailure({
              error: error.message || `Errore nel caricamento Pokemon di tipo ${action.typeName}`
            }))
          )
        )
      )
    )
  );

  // Effect per Pokemon random
  loadRandomPokemon$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PokemonActions.loadRandomPokemon),
      switchMap(() =>
        this.pokemonService.loadRandomPokemon().pipe(
          map(pokemon =>
            PokemonActions.loadPokemonDetailSuccess({ pokemon })
          ),
          catchError(error =>
            of(PokemonActions.loadPokemonDetailFailure({
              error: error.message || 'Errore nel caricamento del Pokemon random'
            }))
          )
        )
      )
    )
  );

  // Effect per gestione errori con notifiche (per demo)
  handleError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        PokemonActions.loadPokemonListFailure,
        PokemonActions.loadPokemonDetailFailure,
        PokemonActions.loadPokemonTypesFailure,
        PokemonActions.loadPokemonByTypeFailure
      ),
      tap(action => {
        console.error('Pokemon Effect Error:', action.error);
        // Qui potresti integrare un sistema di notifiche toast
      })
    ),
    { dispatch: false }
  );

  // Effect per gestione localStorage dei favoriti
  manageFavorites$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        PokemonActions.addToFavorites,
        PokemonActions.removeFromFavorites
      ),
      tap(action => {
        console.log('Favorite action:', action);
        // Il localStorage è già gestito nel reducer, questo è per side effects aggiuntivi
      })
    ),
    { dispatch: false }
  );

  // Utility method
  private extractIdFromUrl(url: string): number {
    const matches = url.match(/\/pokemon\/(\d+)\//);
    return matches ? parseInt(matches[1], 10) : 0;
  }
}
