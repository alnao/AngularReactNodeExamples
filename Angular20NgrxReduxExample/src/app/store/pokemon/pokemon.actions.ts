import { createAction, props } from '@ngrx/store';
import { 
  Pokemon, 
  PokemonDetail, 
  PaginatedPokemonResponse 
} from '../../models/pokemon.model';

// Actions per caricamento lista Pokemon
export const loadPokemonList = createAction(
  '[Pokemon] Load Pokemon List',
  props<{ page?: number; limit?: number }>()
);

export const loadPokemonListSuccess = createAction(
  '[Pokemon] Load Pokemon List Success',
  props<{ 
    pagination: PaginatedPokemonResponse;
    pokemon: Pokemon[];
  }>()
);

export const loadPokemonListFailure = createAction(
  '[Pokemon] Load Pokemon List Failure',
  props<{ error: string }>()
);

// Actions per caricamento dettagli singolo Pokemon
export const loadPokemonDetail = createAction(
  '[Pokemon] Load Pokemon Detail',
  props<{ id: string }>()
);

export const loadPokemonDetailSuccess = createAction(
  '[Pokemon] Load Pokemon Detail Success',
  props<{ pokemon: PokemonDetail }>()
);

export const loadPokemonDetailFailure = createAction(
  '[Pokemon] Load Pokemon Detail Failure',
  props<{ error: string }>()
);

// Actions per paginazione
export const navigateToPage = createAction(
  '[Pokemon] Navigate to Page',
  props<{ page: number }>()
);

export const navigateNext = createAction('[Pokemon] Navigate Next');

export const navigatePrevious = createAction('[Pokemon] Navigate Previous');

export const setItemsPerPage = createAction(
  '[Pokemon] Set Items Per Page',
  props<{ itemsPerPage: number }>()
);

// Actions per ricerca e filtri
export const searchPokemon = createAction(
  '[Pokemon] Search Pokemon',
  props<{ searchTerm: string }>()
);

export const filterByType = createAction(
  '[Pokemon] Filter by Type',
  props<{ typeName: string | null }>()
);

export const toggleFavoritesFilter = createAction(
  '[Pokemon] Toggle Favorites Filter'
);

export const clearFilters = createAction('[Pokemon] Clear Filters');

// Actions per favoriti
export const addToFavorites = createAction(
  '[Pokemon] Add to Favorites',
  props<{ pokemonId: number }>()
);

export const removeFromFavorites = createAction(
  '[Pokemon] Remove from Favorites',
  props<{ pokemonId: number }>()
);

export const loadFavorites = createAction('[Pokemon] Load Favorites');

// Actions per tipi Pokemon
export const loadPokemonTypes = createAction('[Pokemon] Load Pokemon Types');

export const loadPokemonTypesSuccess = createAction(
  '[Pokemon] Load Pokemon Types Success',
  props<{ types: Array<{ name: string; url: string }> }>()
);

export const loadPokemonTypesFailure = createAction(
  '[Pokemon] Load Pokemon Types Failure',
  props<{ error: string }>()
);

// Actions per caricamento Pokemon per tipo
export const loadPokemonByType = createAction(
  '[Pokemon] Load Pokemon by Type',
  props<{ typeName: string }>()
);

export const loadPokemonByTypeSuccess = createAction(
  '[Pokemon] Load Pokemon by Type Success',
  props<{ pokemon: Pokemon[]; typeName: string }>()
);

export const loadPokemonByTypeFailure = createAction(
  '[Pokemon] Load Pokemon by Type Failure',
  props<{ error: string }>()
);

// Actions per gestione errori e UI
export const clearError = createAction('[Pokemon] Clear Error');

export const setLoading = createAction(
  '[Pokemon] Set Loading',
  props<{ loading: boolean }>()
);

// Actions per pokemon random (per demo)
export const loadRandomPokemon = createAction('[Pokemon] Load Random Pokemon');

// Actions per reset state
export const resetPokemonState = createAction('[Pokemon] Reset State');
