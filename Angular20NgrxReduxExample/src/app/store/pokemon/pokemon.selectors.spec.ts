import * as PokemonSelectors from './pokemon.selectors';
import { PokemonState } from './pokemon.reducer';
import { Pokemon, PokemonDetail } from '../../models/pokemon.model';

describe('Pokemon Selectors', () => {
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
    },
    {
      id: 3,
      name: 'blastoise',
      url: 'https://pokeapi.co/api/v2/pokemon/3/', 
      sprites: { front_default: 'sprite3.png', front_shiny: 'shiny3.png' },
      types: [{ slot: 1, type: { name: 'water', url: 'type-url' } }]
    }
  ];

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
      { base_stat: 55, effort: 0, stat: { name: 'attack', url: 'stat-url' } },
      { base_stat: 40, effort: 0, stat: { name: 'defense', url: 'stat-url' } }
    ]
  };

  const mockStateWithData: PokemonState = {
    pokemon: {
      ids: [1, 2, 3],
      entities: {
        1: mockPokemon[0],
        2: mockPokemon[1], 
        3: mockPokemon[2]
      },
      selectedPokemonId: 1,
      selectedPokemon: mockPokemonDetail
    },
    pagination: {
      currentPage: 2,
      itemsPerPage: 20,
      totalItems: 1010,
      totalPages: 51,
      hasNext: true,
      hasPrevious: true,
      nextUrl: 'https://pokeapi.co/api/v2/pokemon?offset=40&limit=20',
      previousUrl: 'https://pokeapi.co/api/v2/pokemon?offset=0&limit=20'
    },
    loading: {
      loading: false,
      loadingDetail: false,
      error: null
    },
    filters: {
      searchTerm: 'pika',
      selectedType: 'electric',
      showFavoritesOnly: true
    },
    favorites: [1, 25, 150],
    types: [
      { name: 'electric', url: 'type-url-1' },
      { name: 'fire', url: 'type-url-2' },
      { name: 'water', url: 'type-url-3' }
    ],
    cache: {}
  };

  describe('Basic Feature Selectors', () => {
    it('should select pokemon entity state', () => {
      const result = PokemonSelectors.selectPokemonEntityState.projector(mockStateWithData);
      expect(result).toEqual(mockStateWithData.pokemon);
    });

    it('should select all pokemon from feature', () => {
      const result = PokemonSelectors.selectAllPokemonFromFeature.projector(mockStateWithData.pokemon);
      expect(result).toEqual(mockPokemon);
      expect(result.length).toBe(3);
    });

    it('should select pokemon entities from feature', () => {
      const result = PokemonSelectors.selectPokemonEntitiesFromFeature.projector(mockStateWithData.pokemon);
      expect(result).toEqual(mockStateWithData.pokemon.entities);
    });

    it('should select pagination state', () => {
      const result = PokemonSelectors.selectPagination.projector(mockStateWithData);
      expect(result).toEqual(mockStateWithData.pagination);
    });

    it('should select loading state', () => {
      const result = PokemonSelectors.selectLoading.projector(mockStateWithData);
      expect(result).toEqual(mockStateWithData.loading);
    });

    it('should select filters state', () => {
      const result = PokemonSelectors.selectFilters.projector(mockStateWithData);
      expect(result).toEqual(mockStateWithData.filters);
    });

    it('should select favorites', () => {
      const result = PokemonSelectors.selectFavorites.projector(mockStateWithData);
      expect(result).toEqual([1, 25, 150]);
    });

    it('should select types', () => {
      const result = PokemonSelectors.selectTypes.projector(mockStateWithData);
      expect(result).toEqual(mockStateWithData.types);
    });
  });

  describe('Selected Pokemon Selectors', () => {
    it('should select selected pokemon ID', () => {
      const result = PokemonSelectors.selectSelectedPokemonId.projector(mockStateWithData.pokemon);
      expect(result).toBe(1);
    });

    it('should select selected pokemon detail', () => {
      const result = PokemonSelectors.selectSelectedPokemon.projector(mockStateWithData.pokemon);
      expect(result).toEqual(mockPokemonDetail);
    });

    it('should return null when no pokemon is selected', () => {
      const stateWithoutSelection = {
        ...mockStateWithData.pokemon,
        selectedPokemonId: null,
        selectedPokemon: null
      };

      const result = PokemonSelectors.selectSelectedPokemon.projector(stateWithoutSelection);
      expect(result).toBeNull();
    });
  });

  describe('Complex Derived Selectors', () => {
    it('should select filtered pokemon based on search term', () => {
      const filters = { searchTerm: 'char', selectedType: null, showFavoritesOnly: false };
      const result = PokemonSelectors.selectFilteredPokemon.projector(
        mockPokemon,
        filters,
        []
      );

      expect(result.length).toBe(1);
      expect(result[0].name).toBe('charizard');
    });

    it('should select filtered pokemon based on type', () => {
      const filters = { searchTerm: '', selectedType: 'fire', showFavoritesOnly: false };
      const result = PokemonSelectors.selectFilteredPokemon.projector(
        mockPokemon,
        filters,
        []
      );

      expect(result.length).toBe(1);
      expect(result[0].name).toBe('charizard');
    });

    it('should select filtered pokemon based on favorites only', () => {
      const filters = { searchTerm: '', selectedType: null, showFavoritesOnly: true };
      const result = PokemonSelectors.selectFilteredPokemon.projector(
        mockPokemon,
        filters,
        [1, 25, 150]
      );

      expect(result.length).toBe(1);
      expect(result[0].name).toBe('pikachu');
    });

    it('should return all pokemon when no filters applied', () => {
      const filters = { searchTerm: '', selectedType: null, showFavoritesOnly: false };
      const result = PokemonSelectors.selectFilteredPokemon.projector(
        mockPokemon,
        filters,
        []
      );

      expect(result.length).toBe(3);
    });
  });

  describe('Pokemon Stats Selector', () => {
    it('should calculate pokemon statistics', () => {
      const result = PokemonSelectors.selectPokemonStats.projector(
        mockPokemon,
        [1, 25, 150]
      );

      expect(result.total).toBe(3);
      expect(result.favorites).toBe(3);
      expect(result.types).toBe(3); // electric, fire, water
    });
  });

  describe('Favorite Pokemon Selector', () => {
    it('should select favorite pokemon entities', () => {
      const result = PokemonSelectors.selectFavoritePokemon.projector(
        mockStateWithData.pokemon.entities,
        [1, 25, 150]
      );
      
      expect(result.length).toBe(1); // Solo pikachu è presente nelle entities
      expect(result[0]).toEqual(mockPokemon[0]);
    });

    it('should return empty array when no favorites exist', () => {
      const result = PokemonSelectors.selectFavoritePokemon.projector(
        mockStateWithData.pokemon.entities,
        []
      );
      
      expect(result).toEqual([]);
    });
  });

  describe('Loading and Error Selectors', () => {
    it('should select isLoading state', () => {
      const result = PokemonSelectors.selectIsLoading.projector(mockStateWithData.loading);
      expect(result).toBe(false);
    });

    it('should select loading error', () => {
      const result = PokemonSelectors.selectLoadingError.projector(mockStateWithData.loading);
      expect(result).toBeNull();
    });

    it('should detect loading when loading is true', () => {
      const loadingState = { ...mockStateWithData.loading, loading: true };
      const result = PokemonSelectors.selectIsLoading.projector(loadingState);
      expect(result).toBe(true);
    });

    it('should detect loading when detail loading is true', () => {
      const loadingState = { ...mockStateWithData.loading, loadingDetail: true };
      const result = PokemonSelectors.selectIsLoading.projector(loadingState);
      expect(result).toBe(true);
    });
  });

  describe('Pagination Info Selector', () => {
    xit('should calculate pagination info correctly', () => {
      const result = PokemonSelectors.selectPaginationInfo.projector(
        mockStateWithData.pagination,
        mockPokemon
      );

      expect(result.filteredTotal).toBe(3);
      expect(result.currentPageItems).toBe(3);
      expect(result.startItem).toBe(1); // (1-1) * 20 + 1 
      expect(result.endItem).toBe(3); // min(1 * 20, 3)
    });
  });

  describe('Dynamic Selectors', () => {
    it('should check if pokemon is favorite', () => {
      const isFavoriteSelector = PokemonSelectors.createSelectIsFavorite(1);
      const result = isFavoriteSelector.projector([1, 25, 150]);
      expect(result).toBe(true);

      const isNotFavoriteSelector = PokemonSelectors.createSelectIsFavorite(999);
      const result2 = isNotFavoriteSelector.projector([1, 25, 150]);
      expect(result2).toBe(false);
    });

    it('should select pokemon by ID', () => {
      const pokemonSelector = PokemonSelectors.createSelectPokemonById(1);
      const result = pokemonSelector.projector(mockStateWithData.pokemon.entities);
      expect(result).toEqual(mockPokemon[0]);

      const nonExistentSelector = PokemonSelectors.createSelectPokemonById(999);
      const result2 = nonExistentSelector.projector(mockStateWithData.pokemon.entities);
      expect(result2).toBeNull();
    });

    it('should find pokemon by name', () => {
      const pokemonSelector = PokemonSelectors.createSelectPokemonByName('pikachu');
      const result = pokemonSelector.projector(mockPokemon);
      expect(result).toEqual(mockPokemon[0]);

      const nonExistentSelector = PokemonSelectors.createSelectPokemonByName('nonexistent');
      const result2 = nonExistentSelector.projector(mockPokemon);
      expect(result2).toBeNull();
    });

    it('should find similar pokemon by type', () => {
      const similarSelector = PokemonSelectors.createSelectSimilarPokemon(1);
      const result = similarSelector.projector(mockPokemon, mockStateWithData.pokemon.entities);
      
      // Nessun altro pokemon di tipo electric nel mock
      expect(result).toEqual([]);
    });
  });

  describe('UI Helper Selectors', () => {
    it('should count active filters', () => {
      const result = PokemonSelectors.selectActiveFiltersCount.projector(mockStateWithData.filters);
      expect(result).toBe(3); // searchTerm, selectedType, showFavoritesOnly

      const noFilters = { searchTerm: '', selectedType: null, showFavoritesOnly: false };
      const result2 = PokemonSelectors.selectActiveFiltersCount.projector(noFilters);
      expect(result2).toBe(0);
    });

    it('should detect empty state', () => {
      const result = PokemonSelectors.selectIsEmpty.projector([], false);
      expect(result).toBe(true);

      const result2 = PokemonSelectors.selectIsEmpty.projector(mockPokemon, false);
      expect(result2).toBe(false);

      const result3 = PokemonSelectors.selectIsEmpty.projector([], true);
      expect(result3).toBe(false); // Loading, quindi non vuoto
    });

    it('should sort types alphabetically', () => {
      const unsortedTypes = [
        { name: 'fire', url: 'url1' },
        { name: 'electric', url: 'url2' },
        { name: 'water', url: 'url3' }
      ];

      const result = PokemonSelectors.selectSortedTypes.projector(unsortedTypes);
      expect(result[0].name).toBe('electric');
      expect(result[1].name).toBe('fire');
      expect(result[2].name).toBe('water');
    });
  });

  describe('Memoization Tests', () => {
    it('should return same reference when inputs don\'t change', () => {
      const filters = mockStateWithData.filters;
      const favorites = mockStateWithData.favorites;
      
      const result1 = PokemonSelectors.selectFilteredPokemon.projector(
        mockPokemon,
        filters,
        favorites
      );

      const result2 = PokemonSelectors.selectFilteredPokemon.projector(
        mockPokemon,
        filters,
        favorites
      );

      expect(result1).toBe(result2);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty pokemon list', () => {
      const emptyEntityState = {
        ids: [],
        entities: {},
        selectedPokemonId: null,
        selectedPokemon: null
      };

      const result = PokemonSelectors.selectAllPokemonFromFeature.projector(emptyEntityState);
      expect(result).toEqual([]);
    });

    it('should handle missing entities in favorites', () => {
      const result = PokemonSelectors.selectFavoritePokemon.projector(
        mockStateWithData.pokemon.entities,
        [1, 999, 25] // 999 e 25 non esistono nelle entities
      );

      expect(result.length).toBe(1);
      expect(result[0]?.id).toBe(1);
    });
  });
});
