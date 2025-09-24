import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PokemonState, selectAllPokemon, selectPokemonEntities } from './pokemon.reducer';
import { Pokemon } from '../../models/pokemon.model';

// Feature selector
export const selectPokemonFeature = createFeatureSelector<PokemonState>('pokemon');

// Selectors base per le diverse parti dello state
export const selectPokemonEntityState = createSelector(
  selectPokemonFeature,
  (state) => state.pokemon
);

export const selectPagination = createSelector(
  selectPokemonFeature,
  (state) => state.pagination
);

export const selectLoading = createSelector(
  selectPokemonFeature,
  (state) => state.loading
);

export const selectFilters = createSelector(
  selectPokemonFeature,
  (state) => state.filters
);

export const selectFavorites = createSelector(
  selectPokemonFeature,
  (state) => state.favorites
);

export const selectTypes = createSelector(
  selectPokemonFeature,
  (state) => state.types
);

export const selectCache = createSelector(
  selectPokemonFeature,
  (state) => state.cache
);

// Selectors per Pokemon entities (usando quelli del reducer)
export const selectAllPokemonFromFeature = createSelector(
  selectPokemonEntityState,
  selectAllPokemon
);

export const selectPokemonEntitiesFromFeature = createSelector(
  selectPokemonEntityState,
  selectPokemonEntities
);

export const selectSelectedPokemonId = createSelector(
  selectPokemonEntityState,
  (state) => state.selectedPokemonId
);

export const selectSelectedPokemon = createSelector(
  selectPokemonEntityState,
  (state) => state.selectedPokemon
);

// Selectors complessi derivati

// Pokemon con filtri applicati
export const selectFilteredPokemon = createSelector(
  selectAllPokemonFromFeature,
  selectFilters,
  selectFavorites,
  (pokemon, filters, favorites) => {
    let filtered = [...pokemon];

    // Filtro per termine di ricerca
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchLower)
      );
    }

    // Filtro per tipo
    if (filters.selectedType) {
      filtered = filtered.filter(p => 
        p.types?.some(type => type.type.name === filters.selectedType)
      );
    }

    // Filtro per favoriti
    if (filters.showFavoritesOnly) {
      filtered = filtered.filter(p => favorites.includes(p.id));
    }

    return filtered;
  }
);

// Pokemon paginati con filtri
export const selectPaginatedPokemon = createSelector(
  selectFilteredPokemon,
  selectPagination,
  (pokemon, pagination) => {
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    return pokemon.slice(startIndex, endIndex);
  }
);

// Statistiche Pokemon
export const selectPokemonStats = createSelector(
  selectAllPokemonFromFeature,
  selectFavorites,
  (pokemon, favorites) => ({
    total: pokemon.length,
    favorites: favorites.length,
    types: [...new Set(
      pokemon.flatMap(p => 
        p.types?.map(type => type.type.name) || []
      )
    )].length,
    heaviest: pokemon.reduce((prev, current) => 
      (current.weight || 0) > (prev.weight || 0) ? current : prev, 
      pokemon[0] || {} as Pokemon
    ),
    lightest: pokemon.reduce((prev, current) => 
      (current.weight || Infinity) < (prev.weight || Infinity) ? current : prev, 
      pokemon[0] || {} as Pokemon
    ),
    tallest: pokemon.reduce((prev, current) => 
      (current.height || 0) > (prev.height || 0) ? current : prev, 
      pokemon[0] || {} as Pokemon
    ),
    shortest: pokemon.reduce((prev, current) => 
      (current.height || Infinity) < (prev.height || Infinity) ? current : prev, 
      pokemon[0] || {} as Pokemon
    )
  })
);

// Pokemon per tipo raggruppati
export const selectPokemonByTypes = createSelector(
  selectAllPokemonFromFeature,
  (pokemon) => {
    const groupedByType: { [key: string]: Pokemon[] } = {};
    
    pokemon.forEach(p => {
      if (p.types) {
        p.types.forEach(typeInfo => {
          const typeName = typeInfo.type.name;
          if (!groupedByType[typeName]) {
            groupedByType[typeName] = [];
          }
          groupedByType[typeName].push(p);
        });
      }
    });
    
    return groupedByType;
  }
);

// Pokemon favoriti dettagliati
export const selectFavoritePokemon = createSelector(
  selectPokemonEntitiesFromFeature,
  selectFavorites,
  (entities, favoriteIds) => 
    favoriteIds
      .map(id => entities[id])
      .filter(pokemon => pokemon !== undefined)
);

// Status di caricamento combinato
export const selectIsLoading = createSelector(
  selectLoading,
  (loading) => loading.loading || loading.loadingDetail
);

// Errori di caricamento
export const selectLoadingError = createSelector(
  selectLoading,
  (loading) => loading.error
);

// Informazioni paginazione estese
export const selectPaginationInfo = createSelector(
  selectPagination,
  selectFilteredPokemon,
  (pagination, filteredPokemon) => ({
    ...pagination,
    filteredTotal: filteredPokemon.length,
    currentPageItems: Math.min(pagination.itemsPerPage, 
      filteredPokemon.length - ((pagination.currentPage - 1) * pagination.itemsPerPage)),
    startItem: ((pagination.currentPage - 1) * pagination.itemsPerPage) + 1,
    endItem: Math.min(
      pagination.currentPage * pagination.itemsPerPage,
      filteredPokemon.length
    )
  })
);

// Check se un Pokemon è nei favoriti
export const createSelectIsFavorite = (pokemonId: number) =>
  createSelector(
    selectFavorites,
    (favorites) => favorites.includes(pokemonId)
  );

// Selettore per Pokemon singolo con controllo di esistenza
export const createSelectPokemonById = (id: number) =>
  createSelector(
    selectPokemonEntitiesFromFeature,
    (entities) => entities[id] || null
  );

// Ricerca Pokemon per nome (fuzzy search)
export const createSelectPokemonByName = (name: string) =>
  createSelector(
    selectAllPokemonFromFeature,
    (pokemon) => pokemon.find(p => 
      p.name.toLowerCase() === name.toLowerCase()
    ) || null
  );

// Pokemon simili (stessi tipi)
export const createSelectSimilarPokemon = (pokemonId: number) =>
  createSelector(
    selectAllPokemonFromFeature,
    selectPokemonEntitiesFromFeature,
    (allPokemon, entities) => {
      const targetPokemon = entities[pokemonId];
      if (!targetPokemon?.types) return [];
      
      const targetTypes = targetPokemon.types.map(t => t.type.name);
      
      return allPokemon
        .filter(p => 
          p.id !== pokemonId && 
          p.types?.some(type => targetTypes.includes(type.type.name))
        )
        .slice(0, 5); // Limitiamo a 5 Pokemon simili
    }
  );

// Filtri attivi (per UI)
export const selectActiveFiltersCount = createSelector(
  selectFilters,
  (filters) => {
    let count = 0;
    if (filters.searchTerm) count++;
    if (filters.selectedType) count++;
    if (filters.showFavoritesOnly) count++;
    return count;
  }
);

// Stato di vuoto (nessun Pokemon caricato)
export const selectIsEmpty = createSelector(
  selectAllPokemonFromFeature,
  selectIsLoading,
  (pokemon, isLoading) => pokemon.length === 0 && !isLoading
);

// Tipi Pokemon ordinati per nome
export const selectSortedTypes = createSelector(
  selectTypes,
  (types) => [...types].sort((a, b) => a.name.localeCompare(b.name))
);
