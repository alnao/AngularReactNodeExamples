import { pokemonReducer, initialPokemonState, PokemonState } from './pokemon.reducer';
import * as PokemonActions from './pokemon.actions';
import { Pokemon, PokemonDetail, PaginatedPokemonResponse } from '../../models/pokemon.model';

describe('Pokemon Reducer', () => {
  const mockPokemon: Pokemon[] = [
    {
      id: 1,
      name: 'pikachu',
      url: 'https://pokeapi.co/api/v2/pokemon/1/',
      sprites: { front_default: 'sprite1.png', front_shiny: 'shiny1.png' },
      types: [{ slot: 1, type: { name: 'electric', url: 'type-url' } }]
    },
    {
      id: 2, 
      name: 'charizard',
      url: 'https://pokeapi.co/api/v2/pokemon/2/',
      sprites: { front_default: 'sprite2.png', front_shiny: 'shiny2.png' },
      types: [{ slot: 1, type: { name: 'fire', url: 'type-url' } }]
    }
  ];

  const mockPaginatedResponse: PaginatedPokemonResponse = {
    count: 1010,
    next: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20',
    previous: null,
    results: [
      { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      { name: 'charizard', url: 'https://pokeapi.co/api/v2/pokemon/2/' }
    ]
  };

  const mockPokemonDetail: PokemonDetail = {
    id: 1,
    name: 'pikachu',
    url: 'https://pokeapi.co/api/v2/pokemon/1/',
    sprites: { front_default: 'sprite.png', front_shiny: 'shiny.png' },
    types: [{ slot: 1, type: { name: 'electric', url: 'type-url' } }],
    base_experience: 112,
    forms: [{ name: 'pikachu', url: 'form-url' }],
    game_indices: [],
    species: { name: 'pikachu', url: 'species-url' },
    stats: [
      { base_stat: 35, effort: 0, stat: { name: 'hp', url: 'stat-url' } },
      { base_stat: 55, effort: 0, stat: { name: 'attack', url: 'stat-url' } }
    ]
  };

  describe('Initial State', () => {
    it('should return the initial state', () => {
      const action = { type: 'Unknown' } as any;
      const result = pokemonReducer(undefined, action);

      expect(result).toBe(initialPokemonState);
    });

    it('should have correct initial structure', () => {
      expect(initialPokemonState.loading.loading).toBe(false);
      expect(initialPokemonState.loading.loadingDetail).toBe(false);
      expect(initialPokemonState.loading.error).toBe(null);
      expect(initialPokemonState.pagination.currentPage).toBe(1);
      expect(initialPokemonState.pagination.itemsPerPage).toBe(20);
      expect(initialPokemonState.filters.searchTerm).toBe('');
    });
  });

  describe('Load Pokemon List Actions', () => {
    it('should handle loadPokemonList action', () => {
      const action = PokemonActions.loadPokemonList({ page: 1 });
      const result = pokemonReducer(initialPokemonState, action);

      expect(result.loading.loading).toBe(true);
      expect(result.loading.error).toBe(null);
      // State immutability check
      expect(result).not.toBe(initialPokemonState);
      expect(result.pokemon).toBe(initialPokemonState.pokemon);
    });

    it('should handle loadPokemonListSuccess action', () => {
      const loadingState: PokemonState = {
        ...initialPokemonState,
        loading: { ...initialPokemonState.loading, loading: true }
      };

      const action = PokemonActions.loadPokemonListSuccess({
        pagination: mockPaginatedResponse,
        pokemon: mockPokemon
      });
      const result = pokemonReducer(loadingState, action);

      expect(result.loading.loading).toBe(false);
      expect(result.loading.error).toBe(null);
      expect(result.pagination.totalItems).toBe(1010);
      expect(result.pagination.hasNext).toBe(true);
      expect(result.pagination.hasPrevious).toBe(false);
      
      // Check EntityAdapter integration
      expect(Object.keys(result.pokemon.entities)).toContain('1');
      expect(Object.keys(result.pokemon.entities)).toContain('2');
      expect(result.pokemon.entities[1]?.name).toBe('pikachu');
    });

    it('should handle loadPokemonListFailure action', () => {
      const loadingState: PokemonState = {
        ...initialPokemonState,
        loading: { ...initialPokemonState.loading, loading: true }
      };

      const action = PokemonActions.loadPokemonListFailure({ 
        error: 'Network Error' 
      });
      const result = pokemonReducer(loadingState, action);

      expect(result.loading.loading).toBe(false);
      expect(result.loading.error).toBe('Network Error');
    });
  });

  describe('Pokemon Detail Actions', () => {
    it('should handle loadPokemonDetail action', () => {
      const action = PokemonActions.loadPokemonDetail({ id: '1' });
      const result = pokemonReducer(initialPokemonState, action);

      expect(result.loading.loadingDetail).toBe(true);
      expect(result.loading.error).toBe(null);
      expect(result.pokemon.selectedPokemonId).toBe(1);
    });

    it('should handle loadPokemonDetailSuccess action', () => {
      const loadingState: PokemonState = {
        ...initialPokemonState,
        loading: { ...initialPokemonState.loading, loadingDetail: true }
      };

      const action = PokemonActions.loadPokemonDetailSuccess({
        pokemon: mockPokemonDetail
      });
      const result = pokemonReducer(loadingState, action);

      expect(result.loading.loadingDetail).toBe(false);
      expect(result.loading.error).toBe(null);
      expect(result.pokemon.selectedPokemon).toEqual(mockPokemonDetail);
      expect(result.pokemon.entities[1]).toBeDefined();
    });
  });

  describe('Pagination Actions', () => {
    it('should handle navigateToPage action', () => {
      const action = PokemonActions.navigateToPage({ page: 3 });
      const result = pokemonReducer(initialPokemonState, action);

      expect(result.pagination.currentPage).toBe(3);
    });

    it('should handle setItemsPerPage action', () => {
      const stateWithData: PokemonState = {
        ...initialPokemonState,
        pagination: { ...initialPokemonState.pagination, totalItems: 100 }
      };

      const action = PokemonActions.setItemsPerPage({ itemsPerPage: 50 });
      const result = pokemonReducer(stateWithData, action);

      expect(result.pagination.itemsPerPage).toBe(50);
      expect(result.pagination.totalPages).toBe(2); // 100/50 = 2
    });
  });

  describe('Filter Actions', () => {
    it('should handle searchPokemon action', () => {
      const action = PokemonActions.searchPokemon({ searchTerm: 'pika' });
      const result = pokemonReducer(initialPokemonState, action);

      expect(result.filters.searchTerm).toBe('pika');
    });

    it('should handle filterByType action', () => {
      const action = PokemonActions.filterByType({ typeName: 'fire' });
      const result = pokemonReducer(initialPokemonState, action);

      expect(result.filters.selectedType).toBe('fire');
    });

    it('should handle clearFilters action', () => {
      const stateWithFilters: PokemonState = {
        ...initialPokemonState,
        filters: {
          searchTerm: 'test',
          selectedType: 'fire',
          showFavoritesOnly: true
        }
      };

      const action = PokemonActions.clearFilters();
      const result = pokemonReducer(stateWithFilters, action);

      expect(result.filters.searchTerm).toBe('');
      expect(result.filters.selectedType).toBe(null);
      expect(result.filters.showFavoritesOnly).toBe(false);
    });
  });

  describe('Favorites Actions', () => {
    beforeEach(() => {
      // Mock localStorage
      let store: { [key: string]: string } = {};
      const mockLocalStorage = {
        getItem: (key: string): string | null => key in store ? store[key] : null,
        setItem: (key: string, value: string) => store[key] = `${value}`,
        clear: () => store = {}
      };

      Object.defineProperty(window, 'localStorage', {
        value: mockLocalStorage
      });
    });

    it('should handle addToFavorites action', () => {
      const action = PokemonActions.addToFavorites({ pokemonId: 25 });
      const result = pokemonReducer(initialPokemonState, action);

      expect(result.favorites).toContain(25);
      expect(localStorage.setItem).toBeDefined();
    });

    it('should handle removeFromFavorites action', () => {
      const stateWithFavorites: PokemonState = {
        ...initialPokemonState,
        favorites: [25, 1, 150]
      };

      const action = PokemonActions.removeFromFavorites({ pokemonId: 25 });
      const result = pokemonReducer(stateWithFavorites, action);

      expect(result.favorites).not.toContain(25);
      expect(result.favorites).toContain(1);
      expect(result.favorites).toContain(150);
    });
  });

  describe('State Immutability', () => {
    it('should not mutate the previous state', () => {
      const action = PokemonActions.searchPokemon({ searchTerm: 'test' });
      const result = pokemonReducer(initialPokemonState, action);

      expect(result).not.toBe(initialPokemonState);
      expect(result.filters).not.toBe(initialPokemonState.filters);
      expect(initialPokemonState.filters.searchTerm).toBe('');
    });

    it('should maintain reference equality for unchanged parts', () => {
      const action = PokemonActions.searchPokemon({ searchTerm: 'test' });
      const result = pokemonReducer(initialPokemonState, action);

      // Unchanged parts should maintain reference equality
      expect(result.pokemon).toBe(initialPokemonState.pokemon);
      expect(result.pagination).toBe(initialPokemonState.pagination);
      expect(result.loading).toBe(initialPokemonState.loading);
    });
  });
});
