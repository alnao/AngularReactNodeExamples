import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Pokemon, PokemonDetail } from '../../models/pokemon.model';
import {
  PaginationState,
  LoadingState,
  FilterState,
  createInitialPaginationState,
  createInitialLoadingState,
  createInitialFilterState
} from '../../models/app-state.model';
import * as PokemonActions from './pokemon.actions';

// Definizione dell'Entity State per Pokemon
export interface PokemonEntityState extends EntityState<Pokemon> {
  selectedPokemonId: number | null;
  selectedPokemon: PokemonDetail | null;
}

// Definizione dello State completo del feature Pokemon
export interface PokemonState {
  pokemon: PokemonEntityState;
  pagination: PaginationState;
  loading: LoadingState;
  filters: FilterState;
  favorites: number[];
  types: Array<{ name: string; url: string }>;
  cache: {
    [key: string]: Pokemon[];
  };
}

// Entity Adapter per Pokemon
export const pokemonAdapter: EntityAdapter<Pokemon> = createEntityAdapter<Pokemon>({
  selectId: (pokemon: Pokemon) => pokemon.id,
  sortComparer: (a: Pokemon, b: Pokemon) => a.id - b.id,
});

// Initial State per Pokemon Entity
export const initialPokemonEntityState: PokemonEntityState = pokemonAdapter.getInitialState({
  selectedPokemonId: null,
  selectedPokemon: null,
});

// Initial State completo
export const initialPokemonState: PokemonState = {
  pokemon: initialPokemonEntityState,
  pagination: createInitialPaginationState(),
  loading: createInitialLoadingState(),
  filters: createInitialFilterState(),
  favorites: JSON.parse(localStorage.getItem('pokemonFavorites') || '[]'),
  types: [],
  cache: {},
};

// Reducer
export const pokemonReducer = createReducer(
  initialPokemonState,

  // Load Pokemon List
  on(PokemonActions.loadPokemonList, (state) => ({
    ...state,
    loading: {
      ...state.loading,
      loading: true,
      error: null
    }
  })),

  on(PokemonActions.loadPokemonListSuccess, (state, { pagination, pokemon }) => {
    const updatedPokemonState = pokemonAdapter.setAll(pokemon, state.pokemon);
    
    return {
      ...state,
      pokemon: updatedPokemonState,
      pagination: {
        ...state.pagination,
        currentPage: Math.floor((pagination.results.length > 0 ? 
          state.pokemon.entities[pokemon[0]?.id]?.id || 1 : 1 - 1) / state.pagination.itemsPerPage) + 1,
        totalItems: pagination.count,
        totalPages: Math.ceil(pagination.count / state.pagination.itemsPerPage),
        hasNext: pagination.next !== null,
        hasPrevious: pagination.previous !== null,
        nextUrl: pagination.next,
        previousUrl: pagination.previous
      },
      loading: {
        ...state.loading,
        loading: false,
        error: null
      }
    };
  }),

  on(PokemonActions.loadPokemonListFailure, (state, { error }) => ({
    ...state,
    loading: {
      ...state.loading,
      loading: false,
      error
    }
  })),

  // Load Pokemon Detail
  on(PokemonActions.loadPokemonDetail, (state, { id }) => ({
    ...state,
    loading: {
      ...state.loading,
      loadingDetail: true,
      error: null
    },
    pokemon: {
      ...state.pokemon,
      selectedPokemonId: parseInt(id, 10)
    }
  })),

  on(PokemonActions.loadPokemonDetailSuccess, (state, { pokemon }) => {
    const updatedPokemonState = pokemonAdapter.upsertOne(pokemon, state.pokemon);
    
    return {
      ...state,
      pokemon: {
        ...updatedPokemonState,
        selectedPokemon: pokemon
      },
      loading: {
        ...state.loading,
        loadingDetail: false,
        error: null
      }
    };
  }),

  on(PokemonActions.loadPokemonDetailFailure, (state, { error }) => ({
    ...state,
    loading: {
      ...state.loading,
      loadingDetail: false,
      error
    }
  })),

  // Pagination Actions
  on(PokemonActions.navigateToPage, (state, { page }) => ({
    ...state,
    pagination: {
      ...state.pagination,
      currentPage: page
    }
  })),

  on(PokemonActions.setItemsPerPage, (state, { itemsPerPage }) => ({
    ...state,
    pagination: {
      ...state.pagination,
      itemsPerPage,
      totalPages: Math.ceil(state.pagination.totalItems / itemsPerPage)
    }
  })),

  // Filter Actions
  on(PokemonActions.searchPokemon, (state, { searchTerm }) => ({
    ...state,
    filters: {
      ...state.filters,
      searchTerm
    }
  })),

  on(PokemonActions.filterByType, (state, { typeName }) => ({
    ...state,
    filters: {
      ...state.filters,
      selectedType: typeName
    }
  })),

  on(PokemonActions.toggleFavoritesFilter, (state) => ({
    ...state,
    filters: {
      ...state.filters,
      showFavoritesOnly: !state.filters.showFavoritesOnly
    }
  })),

  on(PokemonActions.clearFilters, (state) => ({
    ...state,
    filters: createInitialFilterState()
  })),

  // Favorites Actions
  on(PokemonActions.addToFavorites, (state, { pokemonId }) => {
    const updatedFavorites = [...state.favorites, pokemonId];
    localStorage.setItem('pokemonFavorites', JSON.stringify(updatedFavorites));
    
    return {
      ...state,
      favorites: updatedFavorites
    };
  }),

  on(PokemonActions.removeFromFavorites, (state, { pokemonId }) => {
    const updatedFavorites = state.favorites.filter(id => id !== pokemonId);
    localStorage.setItem('pokemonFavorites', JSON.stringify(updatedFavorites));
    
    return {
      ...state,
      favorites: updatedFavorites
    };
  }),

  // Types Actions
  on(PokemonActions.loadPokemonTypesSuccess, (state, { types }) => ({
    ...state,
    types
  })),

  on(PokemonActions.loadPokemonByTypeSuccess, (state, { pokemon, typeName }) => {
    const updatedPokemonState = pokemonAdapter.setMany(pokemon, state.pokemon);
    
    return {
      ...state,
      pokemon: updatedPokemonState,
      cache: {
        ...state.cache,
        [`type_${typeName}`]: pokemon
      }
    };
  }),

  // Utility Actions
  on(PokemonActions.clearError, (state) => ({
    ...state,
    loading: {
      ...state.loading,
      error: null
    }
  })),

  on(PokemonActions.resetPokemonState, () => initialPokemonState),

  // Random Pokemon (same as detail)
  on(PokemonActions.loadRandomPokemon, (state) => ({
    ...state,
    loading: {
      ...state.loading,
      loadingDetail: true,
      error: null
    }
  }))
);

// Export dei selectors di base dell'entity adapter
export const {
  selectIds: selectPokemonIds,
  selectEntities: selectPokemonEntities,
  selectAll: selectAllPokemon,
  selectTotal: selectPokemonTotal,
} = pokemonAdapter.getSelectors();
