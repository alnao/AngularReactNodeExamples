import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { 
  map, 
  catchError, 
  tap, 
  take, 
  switchMap, 
  filter,
  timeout
} from 'rxjs/operators';

import * as PokemonSelectors from '../store/pokemon/pokemon.selectors';
import * as PokemonActions from '../store/pokemon/pokemon.actions';
import { PokemonState } from '../store/pokemon/pokemon.reducer';

@Injectable({
  providedIn: 'root'
})
export class PokemonDataGuard implements CanActivate {

  constructor(
    private store: Store<{ pokemon: PokemonState }>,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.store.select(PokemonSelectors.selectAllPokemonFromFeature).pipe(
      take(1),
      switchMap(pokemon => {
        // Se abbiamo già dei Pokemon in store, permettiamo l'accesso
        if (pokemon.length > 0) {
          return of(true);
        }

        // Altrimenti, carichiamo i dati e aspettiamo
        this.store.dispatch(PokemonActions.loadPokemonList({ page: 1 }));
        
        return this.store.select(PokemonSelectors.selectIsLoading).pipe(
          filter(loading => !loading), // Aspetta che finisca il caricamento
          switchMap(() => 
            this.store.select(PokemonSelectors.selectAllPokemonFromFeature).pipe(
              take(1),
              map(loadedPokemon => {
                if (loadedPokemon.length > 0) {
                  return true;
                } else {
                  // Se non riusciamo a caricare i dati, redirect alla home
                  this.router.navigate(['/']);
                  return false;
                }
              })
            )
          ),
          timeout(10000), // Timeout di 10 secondi
          catchError(() => {
            console.error('Timeout or error loading Pokemon data');
            this.router.navigate(['/error']);
            return of(false);
          })
        );
      })
    );
  }
}

@Injectable({
  providedIn: 'root'
})
export class PokemonDetailGuard implements CanActivate {

  constructor(
    private store: Store<{ pokemon: PokemonState }>,
    private router: Router
  ) {}

  canActivate(route: any): Observable<boolean> {
    const pokemonId = route.params?.id;
    
    if (!pokemonId || isNaN(Number(pokemonId))) {
      this.router.navigate(['/pokemon']);
      return of(false);
    }

    const numericId = Number(pokemonId);
    
    return this.store.select(
      PokemonSelectors.createSelectPokemonById(numericId)
    ).pipe(
      take(1),
      switchMap(pokemon => {
        // Se abbiamo già il Pokemon in store, permettiamo l'accesso
        if (pokemon) {
          return of(true);
        }

        // Altrimenti, carichiamo il dettaglio e aspettiamo
        this.store.dispatch(PokemonActions.loadPokemonDetail({ id: pokemonId }));
        
        return this.store.select(PokemonSelectors.selectLoading).pipe(
          filter(loading => !loading.loadingDetail), // Aspetta che finisca il caricamento del dettaglio
          switchMap(() => 
            this.store.select(
              PokemonSelectors.createSelectPokemonById(numericId)
            ).pipe(
              take(1),
              map(loadedPokemon => {
                if (loadedPokemon) {
                  return true;
                } else {
                  // Se il Pokemon non esiste, redirect alla lista
                  console.warn(`Pokemon with ID ${pokemonId} not found`);
                  this.router.navigate(['/pokemon']);
                  return false;
                }
              })
            )
          ),
          timeout(5000), // Timeout di 5 secondi per il dettaglio
          catchError(() => {
            console.error(`Timeout or error loading Pokemon ${pokemonId}`);
            this.router.navigate(['/pokemon']);
            return of(false);
          })
        );
      })
    );
  }
}

@Injectable({
  providedIn: 'root'
})
export class FavoritesGuard implements CanActivate {

  constructor(
    private store: Store<{ pokemon: PokemonState }>,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.store.select(PokemonSelectors.selectFavorites).pipe(
      take(1),
      map(favorites => {
        if (favorites.length === 0) {
          // Se non ci sono favoriti, mostra un messaggio o redirect
          console.info('No favorite Pokemon found. Redirecting to Pokemon list.');
          this.router.navigate(['/pokemon'], { 
            queryParams: { message: 'no-favorites' }
          });
          return false;
        }
        return true;
      }),
      catchError(() => {
        this.router.navigate(['/pokemon']);
        return of(false);
      })
    );
  }
}

@Injectable({
  providedIn: 'root'
})
export class PokemonTypesLoadedGuard implements CanActivate {

  constructor(
    private store: Store<{ pokemon: PokemonState }>
  ) {}

  canActivate(): Observable<boolean> {
    return this.store.select(PokemonSelectors.selectTypes).pipe(
      take(1),
      switchMap(types => {
        // Se abbiamo già i tipi caricati, permettiamo l'accesso
        if (types.length > 0) {
          return of(true);
        }

        // Altrimenti, carichiamo i tipi e aspettiamo
        this.store.dispatch(PokemonActions.loadPokemonTypes());
        
        return this.store.select(PokemonSelectors.selectTypes).pipe(
          filter(loadedTypes => loadedTypes.length > 0),
          take(1),
          map(() => true),
          timeout(5000),
          catchError(() => {
            console.warn('Could not load Pokemon types, but allowing access');
            return of(true); // Permettiamo l'accesso anche se i tipi non si caricano
          })
        );
      })
    );
  }
}

// Guard combinato per pagine che richiedono sia i dati che i tipi
@Injectable({
  providedIn: 'root'
})
export class PokemonFullDataGuard implements CanActivate {

  constructor(
    private pokemonDataGuard: PokemonDataGuard,
    private pokemonTypesGuard: PokemonTypesLoadedGuard
  ) {}

  canActivate(route: any): Observable<boolean> {
    return this.pokemonDataGuard.canActivate().pipe(
      switchMap(dataLoaded => {
        if (!dataLoaded) {
          return of(false);
        }
        return this.pokemonTypesGuard.canActivate();
      })
    );
  }
}
