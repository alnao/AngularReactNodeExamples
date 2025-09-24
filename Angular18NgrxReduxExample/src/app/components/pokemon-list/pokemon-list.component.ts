import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import * as PokemonActions from '../../store/pokemon/pokemon.actions';
import * as PokemonSelectors from '../../store/pokemon/pokemon.selectors';
import { PokemonState } from '../../store/pokemon/pokemon.reducer';
import { Pokemon } from '../../models/pokemon.model';
import { PaginationState, FilterState, LoadingState } from '../../models/app-state.model';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css']
})
export class PokemonListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Observables dallo store
  paginatedPokemon$: Observable<Pokemon[]>;
  pagination$: Observable<PaginationState>;
  paginationInfo$: Observable<any>;
  filters$: Observable<FilterState>;
  loading$: Observable<LoadingState>;
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;
  stats$: Observable<any>;
  sortedTypes$: Observable<Array<{ name: string; url: string }>>;
  activeFiltersCount$: Observable<number>;

  constructor(
    private store: Store<{ pokemon: PokemonState }>,
    private router: Router
  ) {
    // Inizializziamo gli observables
    this.paginatedPokemon$ = this.store.select(PokemonSelectors.selectPaginatedPokemon);
    this.pagination$ = this.store.select(PokemonSelectors.selectPagination);
    this.paginationInfo$ = this.store.select(PokemonSelectors.selectPaginationInfo);
    this.filters$ = this.store.select(PokemonSelectors.selectFilters);
    this.loading$ = this.store.select(PokemonSelectors.selectLoading);
    this.isLoading$ = this.store.select(PokemonSelectors.selectIsLoading);
    this.error$ = this.store.select(PokemonSelectors.selectLoadingError);
    this.stats$ = this.store.select(PokemonSelectors.selectPokemonStats);
    this.sortedTypes$ = this.store.select(PokemonSelectors.selectSortedTypes);
    this.activeFiltersCount$ = this.store.select(PokemonSelectors.selectActiveFiltersCount);
  }

  ngOnInit() {
    // Carica i dati iniziali
    this.store.dispatch(PokemonActions.loadPokemonList({ page: 1 }));
    this.store.dispatch(PokemonActions.loadPokemonTypes());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Event Handlers
  onSearch(event: any) {
    const searchTerm = event.target.value;
    this.store.dispatch(PokemonActions.searchPokemon({ searchTerm }));
  }

  onTypeFilter(event: any) {
    const typeName = event.target.value || null;
    this.store.dispatch(PokemonActions.filterByType({ typeName }));
  }

  onToggleFavorites() {
    this.store.dispatch(PokemonActions.toggleFavoritesFilter());
  }

  onItemsPerPageChange(event: any) {
    const itemsPerPage = parseInt(event.target.value, 10);
    this.store.dispatch(PokemonActions.setItemsPerPage({ itemsPerPage }));
  }

  onClearFilters() {
    this.store.dispatch(PokemonActions.clearFilters());
  }

  onSelectPokemon(id: number) {
    // Naviga alla pagina di dettaglio del Pokemon
    this.router.navigate(['/pokemon/detail', id]);
  }

  onToggleFavorite(pokemonId: number, event: Event) {
    event.stopPropagation(); // Previene il click sulla card
    
    // Approccio più semplice: leggi lo stato attuale e dispatcha l'azione opposta
    const currentFavorites = JSON.parse(localStorage.getItem('pokemonFavorites') || '[]');
    const isFavorite = currentFavorites.includes(pokemonId);
    
    if (isFavorite) {
      this.store.dispatch(PokemonActions.removeFromFavorites({ pokemonId }));
    } else {
      this.store.dispatch(PokemonActions.addToFavorites({ pokemonId }));
    }
  }

  isFavorite(pokemonId: number): Observable<boolean> {
    return this.store.select(PokemonSelectors.createSelectIsFavorite(pokemonId));
  }

  // Pagination handlers
  onNavigateToPage(page: number) {
    this.store.dispatch(PokemonActions.navigateToPage({ page }));
  }

  onNextPage() {
    this.store.dispatch(PokemonActions.navigateNext());
  }

  onPreviousPage() {
    this.store.dispatch(PokemonActions.navigatePrevious());
  }

  // Quick actions
  onLoadRandomPokemon() {
    this.store.dispatch(PokemonActions.loadRandomPokemon());
  }

  onLoadAllTypes() {
    this.store.dispatch(PokemonActions.loadPokemonTypes());
  }

  onRetry() {
    this.store.dispatch(PokemonActions.clearError());
    this.store.dispatch(PokemonActions.loadPokemonList({ page: 1 }));
  }

  // Track by function per ottimizzare le performance
  trackByPokemonId(index: number, pokemon: Pokemon): number {
    return pokemon.id;
  }

  // Utility functions
  getPageNumbers(totalPages: number, currentPage: number): number[] {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta);
         i <= Math.min(totalPages - 1, currentPage + delta);
         i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, -1);
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push(-1, totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots.filter(page => page > 0);
  }
}
