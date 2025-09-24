import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PokemonService } from './pokemon.service';
import { Pokemon, PokemonDetail, PokemonListItem, PaginatedPokemonResponse } from '../models/pokemon.model';

describe('PokemonService', () => {
  let service: PokemonService;
  let httpTestingController: HttpTestingController;

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
      { base_stat: 35, effort: 0, stat: { name: 'hp', url: 'stat-url' } }
    ]
  };

  const mockPokemonDetail2: PokemonDetail = {
    id: 2,
    name: 'charizard',
    url: 'https://pokeapi.co/api/v2/pokemon/2/',
    sprites: { front_default: 'sprite2.png', front_shiny: 'shiny2.png' },
    types: [{ slot: 1, type: { name: 'fire', url: 'type-url' } }],
    base_experience: 267,
    forms: [{ name: 'charizard', url: 'form-url' }],
    game_indices: [],
    species: { name: 'charizard', url: 'species-url' },
    stats: [
      { base_stat: 78, effort: 0, stat: { name: 'hp', url: 'stat-url' } }
    ]
  };

  const mockTypes = {
    results: [
      { name: 'electric', url: 'https://pokeapi.co/api/v2/type/13/' },
      { name: 'fire', url: 'https://pokeapi.co/api/v2/type/10/' },
      { name: 'water', url: 'https://pokeapi.co/api/v2/type/11/' }
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PokemonService]
    });
    service = TestBed.inject(PokemonService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('Service Creation', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('loadPokemonList', () => {
    it('should load pokemon list with default parameters', () => {
      service.loadPokemonList().subscribe(response => {
        expect(response).toEqual(mockPaginatedResponse);
      });

      const req = httpTestingController.expectOne(
        'https://pokeapi.co/api/v2/pokemon?offset=0&limit=20'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockPaginatedResponse);
    });

    it('should load pokemon list with custom page and limit', () => {
      const page = 3;
      const limit = 50;

      service.loadPokemonList(page, limit).subscribe(response => {
        expect(response).toEqual(mockPaginatedResponse);
      });

      const expectedOffset = (page - 1) * limit; // (3-1) * 50 = 100
      const req = httpTestingController.expectOne(
        `https://pokeapi.co/api/v2/pokemon?offset=${expectedOffset}&limit=${limit}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockPaginatedResponse);
    });

    it('should handle HTTP error for pokemon list', () => {
      service.loadPokemonList().subscribe({
        next: () => fail('Expected an error'),
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpTestingController.expectOne(
        'https://pokeapi.co/api/v2/pokemon?offset=0&limit=20'
      );
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('loadPokemonListWithBasicDetails', () => {
    it('should load pokemon list with basic details', () => {
      const expectedPokemon = [mockPokemonDetail, mockPokemonDetail2];

      service.loadPokemonListWithBasicDetails(1, 2).subscribe(response => {
        expect(response.pagination).toEqual(mockPaginatedResponse);
        expect(response.pokemonWithDetails).toEqual(expectedPokemon);
      });

      // First request for pokemon list
      const listReq = httpTestingController.expectOne(
        'https://pokeapi.co/api/v2/pokemon?offset=0&limit=2'
      );
      expect(listReq.request.method).toBe('GET');
      listReq.flush(mockPaginatedResponse);

      // Subsequent requests for individual pokemon details
      const detailReq1 = httpTestingController.expectOne(
        'https://pokeapi.co/api/v2/pokemon/1'
      );
      expect(detailReq1.request.method).toBe('GET');
      detailReq1.flush(mockPokemonDetail);

      const detailReq2 = httpTestingController.expectOne(
        'https://pokeapi.co/api/v2/pokemon/2'
      );
      expect(detailReq2.request.method).toBe('GET');
      detailReq2.flush(mockPokemonDetail2);
    });

    it('should handle error in pokemon list loading', () => {
      service.loadPokemonListWithBasicDetails().subscribe({
        next: () => fail('Expected an error'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpTestingController.expectOne(
        'https://pokeapi.co/api/v2/pokemon?offset=0&limit=20'
      );
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('loadPokemonDetail', () => {
    it('should load pokemon detail by ID', () => {
      service.loadPokemonDetail('1').subscribe(pokemon => {
        expect(pokemon).toEqual(mockPokemonDetail);
      });

      const req = httpTestingController.expectOne(
        'https://pokeapi.co/api/v2/pokemon/1'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockPokemonDetail);
    });

    it('should load pokemon detail by name', () => {
      service.loadPokemonDetail('pikachu').subscribe(pokemon => {
        expect(pokemon).toEqual(mockPokemonDetail);
      });

      const req = httpTestingController.expectOne(
        'https://pokeapi.co/api/v2/pokemon/pikachu'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockPokemonDetail);
    });

    it('should handle 404 error for non-existent pokemon', () => {
      service.loadPokemonDetail('999999').subscribe({
        next: () => fail('Expected an error'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpTestingController.expectOne(
        'https://pokeapi.co/api/v2/pokemon/999999'
      );
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('searchPokemon', () => {
    const mockSearchResponse: PaginatedPokemonResponse = {
      count: 1010,
      next: null,
      previous: null,
      results: [
        { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
        { name: 'pikchu-libre', url: 'https://pokeapi.co/api/v2/pokemon/10025/' },
        { name: 'raichu', url: 'https://pokeapi.co/api/v2/pokemon/26/' }
      ]
    };

    it('should search pokemon by name', () => {
      const searchTerm = 'pika';

      service.searchPokemon(searchTerm).subscribe(results => {
        expect(results.length).toBe(1);
        expect(results[0]?.name).toBe('pikachu');
      });

      const req = httpTestingController.expectOne(
        'https://pokeapi.co/api/v2/pokemon?limit=1000'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockSearchResponse);
    });

    it('should return empty array for no matches', () => {
      const searchTerm = 'nonexistent';

      service.searchPokemon(searchTerm).subscribe(results => {
        expect(results).toEqual([]);
      });

      const req = httpTestingController.expectOne(
        'https://pokeapi.co/api/v2/pokemon?limit=1000'
      );
      req.flush(mockSearchResponse);
    });

    it('should be case insensitive', () => {
      const searchTerm = 'PIKA';

      service.searchPokemon(searchTerm).subscribe(results => {
        expect(results.length).toBe(1);
        expect(results[0]?.name).toBe('pikachu');
      });

      const req = httpTestingController.expectOne(
        'https://pokeapi.co/api/v2/pokemon?limit=1000'
      );
      req.flush(mockSearchResponse);
    });
  });

  describe('loadPokemonTypes', () => {
    it('should load pokemon types', () => {
      service.loadPokemonTypes().subscribe(types => {
        expect(types).toEqual(mockTypes.results);
        expect(types.length).toBe(3);
      });

      const req = httpTestingController.expectOne(
        'https://pokeapi.co/api/v2/type'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockTypes);
    });

    it('should handle error when loading types', () => {
      service.loadPokemonTypes().subscribe({
        next: () => fail('Expected an error'),
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpTestingController.expectOne(
        'https://pokeapi.co/api/v2/type'
      );
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('loadPokemonByType', () => {
    const mockTypeResponse = {
      pokemon: [
        { pokemon: { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' }, slot: 1 },
        { pokemon: { name: 'raichu', url: 'https://pokeapi.co/api/v2/pokemon/26/' }, slot: 1 }
      ]
    };

    it('should load pokemon by type', () => {
      const typeName = 'electric';

      service.loadPokemonByType(typeName).subscribe(pokemon => {
        expect(pokemon.length).toBe(2);
        expect(pokemon[0].name).toBe('pikachu');
        expect(pokemon[1].name).toBe('raichu');
      });

      const req = httpTestingController.expectOne(
        `https://pokeapi.co/api/v2/type/${typeName}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockTypeResponse);
    });

    it('should handle invalid type name', () => {
      const typeName = 'invalidtype';

      service.loadPokemonByType(typeName).subscribe({
        next: () => fail('Expected an error'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpTestingController.expectOne(
        `https://pokeapi.co/api/v2/type/${typeName}`
      );
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('loadRandomPokemon', () => {
    it('should load a random pokemon', () => {
      // Mock Math.random to return predictable value
      const mathRandomSpy = spyOn(Math, 'random').and.returnValue(0.5);
      const expectedId = Math.floor(0.5 * 1010) + 1; // Should be 506

      service.loadRandomPokemon().subscribe(pokemon => {
        expect(pokemon).toEqual(mockPokemonDetail);
      });

      const req = httpTestingController.expectOne(
        `https://pokeapi.co/api/v2/pokemon/${expectedId}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockPokemonDetail);

      expect(mathRandomSpy).toHaveBeenCalled();
    });

    it('should handle error for random pokemon', () => {
      spyOn(Math, 'random').and.returnValue(0.999);
      const expectedId = Math.floor(0.999 * 1010) + 1; // Should be 1010

      service.loadRandomPokemon().subscribe({
        next: () => fail('Expected an error'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpTestingController.expectOne(
        `https://pokeapi.co/api/v2/pokemon/${expectedId}`
      );
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('loadFromUrl', () => {
    it('should load data from custom URL', () => {
      const customUrl = 'https://pokeapi.co/api/v2/pokemon?offset=40&limit=20';

      service.loadFromUrl(customUrl).subscribe(response => {
        expect(response).toEqual(mockPaginatedResponse);
      });

      const req = httpTestingController.expectOne(customUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockPaginatedResponse);
    });

    it('should handle invalid URL', () => {
      const invalidUrl = 'https://invalid-url.com/pokemon';

      service.loadFromUrl(invalidUrl).subscribe({
        next: () => fail('Expected an error'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpTestingController.expectOne(invalidUrl);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('Helper Methods', () => {
    it('should extract ID from URL correctly', () => {
      // This tests the private method indirectly through loadPokemonListWithBasicDetails
      const testResponse: PaginatedPokemonResponse = {
        ...mockPaginatedResponse,
        results: [
          { name: 'test1', url: 'https://pokeapi.co/api/v2/pokemon/123/' },
          { name: 'test2', url: 'https://pokeapi.co/api/v2/pokemon/456/' }
        ]
      };

      service.loadPokemonListWithBasicDetails(1, 2).subscribe();

      const listReq = httpTestingController.expectOne(
        'https://pokeapi.co/api/v2/pokemon?offset=0&limit=2'
      );
      listReq.flush(testResponse);

      // Verify that correct IDs were extracted and used
      const detailReq1 = httpTestingController.expectOne(
        'https://pokeapi.co/api/v2/pokemon/123'
      );
      expect(detailReq1.request.url).toContain('123');
      detailReq1.flush(mockPokemonDetail);

      const detailReq2 = httpTestingController.expectOne(
        'https://pokeapi.co/api/v2/pokemon/456'
      );
      expect(detailReq2.request.url).toContain('456');
      detailReq2.flush(mockPokemonDetail2);
    });

    it('should handle malformed URLs in ID extraction', () => {
      const testResponse: PaginatedPokemonResponse = {
        ...mockPaginatedResponse,
        results: [
          { name: 'test', url: 'invalid-url-format' }
        ]
      };

      service.loadPokemonListWithBasicDetails(1, 1).subscribe();

      const listReq = httpTestingController.expectOne(
        'https://pokeapi.co/api/v2/pokemon?offset=0&limit=1'
      );
      listReq.flush(testResponse);

      // Should fallback to ID 0 for malformed URLs
      const detailReq = httpTestingController.expectOne(
        'https://pokeapi.co/api/v2/pokemon/0'
      );
      expect(detailReq.request.url).toContain('0');
      detailReq.flush(mockPokemonDetail);
    });
  });

  describe('Network Error Handling', () => {
    it('should handle network timeout', () => {
      service.loadPokemonList().subscribe({
        next: () => fail('Expected a timeout error'),
        error: (error) => {
          expect(error.constructor.name).toBe('HttpErrorResponse');
        }
      });

      const req = httpTestingController.expectOne(
        'https://pokeapi.co/api/v2/pokemon?offset=0&limit=20'
      );
      req.error(new ErrorEvent('timeout', { message: 'Timeout' }));
    });

    it('should handle network connectivity issues', () => {
      service.loadPokemonDetail('1').subscribe({
        next: () => fail('Expected a network error'),
        error: (error) => {
          expect(error.error.message).toBe('Network error');
        }
      });

      const req = httpTestingController.expectOne(
        'https://pokeapi.co/api/v2/pokemon/1'
      );
      req.error(new ErrorEvent('network', { message: 'Network error' }));
    });
  });

  describe('Data Transformation', () => {
    it('should properly transform pokemon data in loadPokemonListWithBasicDetails', () => {
      const expectedTransformedResponse = {
        pagination: mockPaginatedResponse,
        pokemonWithDetails: [mockPokemonDetail, mockPokemonDetail2]
      };

      service.loadPokemonListWithBasicDetails(1, 2).subscribe(response => {
        expect(response).toEqual(expectedTransformedResponse);
        expect(response.pokemonWithDetails).toEqual(jasmine.any(Array));
        expect(response.pokemonWithDetails.length).toBe(2);
        expect(response.pokemonWithDetails[0]).toEqual(jasmine.objectContaining({
          id: jasmine.any(Number),
          name: jasmine.any(String),
          sprites: jasmine.any(Object)
        }));
      });

      const listReq = httpTestingController.expectOne(
        'https://pokeapi.co/api/v2/pokemon?offset=0&limit=2'
      );
      listReq.flush(mockPaginatedResponse);

      const detailReq1 = httpTestingController.expectOne(
        'https://pokeapi.co/api/v2/pokemon/1'
      );
      detailReq1.flush(mockPokemonDetail);

      const detailReq2 = httpTestingController.expectOne(
        'https://pokeapi.co/api/v2/pokemon/2'
      );
      detailReq2.flush(mockPokemonDetail2);
    });

    it('should properly filter search results', () => {
      const searchResponse: PaginatedPokemonResponse = {
        count: 5,
        next: null,
        previous: null,
        results: [
          { name: 'pikachu', url: 'url1' },
          { name: 'charizard', url: 'url2' },
          { name: 'pikchu-libre', url: 'url3' },
          { name: 'raichu', url: 'url4' },
          { name: 'sandslash', url: 'url5' }
        ]
      };

      service.searchPokemon('chu').subscribe(results => {
        expect(results.length).toBe(3); // pikachu, pikchu-libre, raichu
        expect(results.every(p => p.name.includes('chu'))).toBe(true);
      });

      const req = httpTestingController.expectOne(
        'https://pokeapi.co/api/v2/pokemon?limit=1000'
      );
      req.flush(searchResponse);
    });
  });
});
