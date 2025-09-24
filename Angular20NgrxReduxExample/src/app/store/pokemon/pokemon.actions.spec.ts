import * as PokemonActions from './pokemon.actions';
import { Pokemon, PaginatedPokemonResponse } from '../../models/pokemon.model';

describe('Pokemon Actions', () => {
  const mockPokemon: Pokemon = {
    id: 1,
    name: 'pikachu',
    url: 'https://pokeapi.co/api/v2/pokemon/1/',
    sprites: {
      front_default: 'sprite.png',
      front_shiny: 'shiny.png'
    }
  };

  const mockPaginatedResponse: PaginatedPokemonResponse = {
    count: 1010,
    next: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20',
    previous: null,
    results: [{ name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/1/' }]
  };

  describe('Load Pokemon List Actions', () => {
    it('should create loadPokemonList action', () => {
      const action = PokemonActions.loadPokemonList({ page: 1, limit: 20 });
      
      expect(action).toEqual({
        type: '[Pokemon] Load Pokemon List',
        page: 1,
        limit: 20
      });
    });

    it('should create loadPokemonListSuccess action', () => {
      const action = PokemonActions.loadPokemonListSuccess({
        pagination: mockPaginatedResponse,
        pokemon: [mockPokemon]
      });
      
      expect(action.type).toBe('[Pokemon] Load Pokemon List Success');
      expect(action.pagination).toEqual(mockPaginatedResponse);
      expect(action.pokemon).toEqual([mockPokemon]);
    });

    it('should create loadPokemonListFailure action', () => {
      const error = 'Network error';
      const action = PokemonActions.loadPokemonListFailure({ error });
      
      expect(action).toEqual({
        type: '[Pokemon] Load Pokemon List Failure',
        error: 'Network error'
      });
    });
  });

  describe('Pokemon Detail Actions', () => {
    it('should create loadPokemonDetail action', () => {
      const action = PokemonActions.loadPokemonDetail({ id: '1' });
      
      expect(action).toEqual({
        type: '[Pokemon] Load Pokemon Detail',
        id: '1'
      });
    });

    it('should create loadPokemonDetailSuccess action', () => {
      const mockPokemonDetail = {
        ...mockPokemon,
        base_experience: 64,
        forms: [],
        game_indices: [],
        species: { name: 'bulbasaur', url: 'species-url' },
        stats: [
          { base_stat: 45, effort: 0, stat: { name: 'hp', url: 'hp-url' } }
        ]
      };

      const action = PokemonActions.loadPokemonDetailSuccess({ 
        pokemon: mockPokemonDetail as any 
      });
      
      expect(action.type).toBe('[Pokemon] Load Pokemon Detail Success');
      expect(action.pokemon).toEqual(mockPokemonDetail);
    });
  });

  describe('Pagination Actions', () => {
    it('should create navigateToPage action', () => {
      const action = PokemonActions.navigateToPage({ page: 3 });
      
      expect(action).toEqual({
        type: '[Pokemon] Navigate to Page',
        page: 3
      });
    });

    it('should create navigateNext action', () => {
      const action = PokemonActions.navigateNext();
      
      expect(action).toEqual({
        type: '[Pokemon] Navigate Next'
      });
    });

    it('should create navigatePrevious action', () => {
      const action = PokemonActions.navigatePrevious();
      
      expect(action).toEqual({
        type: '[Pokemon] Navigate Previous'
      });
    });
  });

  describe('Filter Actions', () => {
    it('should create searchPokemon action', () => {
      const action = PokemonActions.searchPokemon({ searchTerm: 'pika' });
      
      expect(action).toEqual({
        type: '[Pokemon] Search Pokemon',
        searchTerm: 'pika'
      });
    });

    it('should create filterByType action', () => {
      const action = PokemonActions.filterByType({ typeName: 'electric' });
      
      expect(action).toEqual({
        type: '[Pokemon] Filter by Type',
        typeName: 'electric'
      });
    });

    it('should create clearFilters action', () => {
      const action = PokemonActions.clearFilters();
      
      expect(action).toEqual({
        type: '[Pokemon] Clear Filters'
      });
    });
  });

  describe('Favorites Actions', () => {
    it('should create addToFavorites action', () => {
      const action = PokemonActions.addToFavorites({ pokemonId: 25 });
      
      expect(action).toEqual({
        type: '[Pokemon] Add to Favorites',
        pokemonId: 25
      });
    });

    it('should create removeFromFavorites action', () => {
      const action = PokemonActions.removeFromFavorites({ pokemonId: 25 });
      
      expect(action).toEqual({
        type: '[Pokemon] Remove from Favorites',
        pokemonId: 25
      });
    });
  });
});
