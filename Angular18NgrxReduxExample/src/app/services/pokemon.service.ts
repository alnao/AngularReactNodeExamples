import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { 
  Pokemon, 
  PokemonDetail, 
  PokemonListItem, 
  PaginatedPokemonResponse 
} from '../models/pokemon.model';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private readonly baseUrl = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) {}

  /**
   * Carica lista pokemon paginata
   */
  loadPokemonList(page: number = 1, limit: number = 20): Observable<PaginatedPokemonResponse> {
    const offset = (page - 1) * limit;
    const params = new HttpParams()
      .set('offset', offset.toString())
      .set('limit', limit.toString());

    return this.http.get<PaginatedPokemonResponse>(`${this.baseUrl}/pokemon`, { params });
  }

  /**
   * Carica lista pokemon con dettagli basic (per ottimizzazione)
   */
  loadPokemonListWithBasicDetails(page: number = 1, limit: number = 20): Observable<{
    pagination: PaginatedPokemonResponse;
    pokemonWithDetails: Pokemon[];
  }> {
    return this.loadPokemonList(page, limit).pipe(
      switchMap(paginatedResponse => {
        // Estraiamo l'ID dall'URL per ottimizzare
        const pokemonWithIds = paginatedResponse.results.map((item, index) => ({
          ...item,
          id: this.extractIdFromUrl(item.url)
        }));

        // Carichiamo i dettagli in parallelo (max 20 per pagina)
        const detailRequests = pokemonWithIds.map(pokemon => 
          this.loadPokemonDetail(pokemon.id.toString())
        );

        return forkJoin(detailRequests).pipe(
          map(pokemonDetails => ({
            pagination: paginatedResponse,
            pokemonWithDetails: pokemonDetails
          }))
        );
      })
    );
  }

  /**
   * Carica dettagli di un singolo pokemon
   */
  loadPokemonDetail(idOrName: string): Observable<PokemonDetail> {
    return this.http.get<PokemonDetail>(`${this.baseUrl}/pokemon/${idOrName}`);
  }

  /**
   * Cerca pokemon per nome (con supporto parziale)
   */
  searchPokemon(searchTerm: string): Observable<PokemonListItem[]> {
    // PokeAPI non supporta search nativo, quindi carichiamo una lista ampia
    // e filtriamo lato client (per demo, in produzione useresti un backend custom)
    return this.http.get<PaginatedPokemonResponse>(`${this.baseUrl}/pokemon?limit=1000`).pipe(
      map(response => 
        response.results.filter(pokemon => 
          pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );
  }

  /**
   * Carica lista di tutti i tipi Pokemon
   */
  loadPokemonTypes(): Observable<Array<{ name: string; url: string }>> {
    return this.http.get<{ results: Array<{ name: string; url: string }> }>(`${this.baseUrl}/type`).pipe(
      map(response => response.results)
    );
  }

  /**
   * Carica pokemon per tipo specifico
   */
  loadPokemonByType(typeName: string): Observable<PokemonListItem[]> {
    return this.http.get<{
      pokemon: Array<{ pokemon: PokemonListItem; slot: number }>
    }>(`${this.baseUrl}/type/${typeName}`).pipe(
      map(response => response.pokemon.map(item => item.pokemon))
    );
  }

  /**
   * Utility per estrarre ID dall'URL
   */
  private extractIdFromUrl(url: string): number {
    const matches = url.match(/\/pokemon\/(\d+)\//);
    return matches ? parseInt(matches[1], 10) : 0;
  }

  /**
   * Carica pokemon random (per demo)
   */
  loadRandomPokemon(): Observable<PokemonDetail> {
    const randomId = Math.floor(Math.random() * 1010) + 1; // Ci sono circa 1010 pokemon
    return this.loadPokemonDetail(randomId.toString());
  }

  /**
   * Utility per costruire URL per paginazione custom
   */
  loadFromUrl(url: string): Observable<PaginatedPokemonResponse> {
    return this.http.get<PaginatedPokemonResponse>(url);
  }
}
