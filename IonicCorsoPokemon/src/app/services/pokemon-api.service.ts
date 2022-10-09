import { IonicStorageModule } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';
import { Storage } from '@ionic/storage';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PokemonApiService {
  constructor(public http :HttpClient, public storage :Storage) { }
  getPokemon(filter : string) : Observable<IResult>{
    const url=environment.pokemonApi+ '?limit='+environment.limit;
    return this.http.get<IResult>(url).pipe(
        map ((res:IResult) => {
          res.results=res.results.sort ((a,b) => a.name==b.name ? 0 : a.name > b.name ? -1 : 1 );
          if (filter.length>0)
            res.results=res.results.filter(r => r.name.startsWith(filter));
          return res;//.results.map(resp => new IPokemon(resp));
        })
      );
  }
  getDetail(p:IPokemon ) : Observable<DettaglioPok.Dettaglio>{
    return this.http.get<DettaglioPok.Dettaglio>(p.url);
  }
  addPokemonFavorite(pok:IPokemon){
    this.storage.get('POKEMON_FAVORITE').then( (res) => {

      let data:IPokemon[]=res ?? [];
      //console.log('data'+data[0].name);
      if (data.some(e => e.name === pok.name)) {
          return;//gia nello store
      }
      data.push(pok);
      this.storage.set('POKEMON_FAVORITE',data);
    });
  }
  async removePokemonFavorite(pok:IPokemon):Promise<IPokemon[]>{
    await this.storage.get('POKEMON_FAVORITE').then( (res) => {
      let data:IPokemon[]=res ?? [];
      data=data.filter(r => r.name!==pok.name);
      this.storage.set('POKEMON_FAVORITE',data);
    });
    return this.getFavoritesPokemon();
  }
  async getFavoritesPokemon():Promise<IPokemon[]>{
    return this.storage.get('POKEMON_FAVORITE');
  }
  async isPokemonInFavorites(pok:IPokemon):Promise<Boolean>{
    let data:IPokemon[] = await this.storage.get('POKEMON_FAVORITE');
    if (data.length == 0)
      return false;
    if (data.some(e => e.name === pok.name))
      return true;
    return false;
  }
}
export class IPokemon {
  name: string;
  url: string;
}

export class IResult {
  count: number;
  next: string;
  previous?: any;
  results: IPokemon[];
}


export declare module DettaglioPok {

  export interface Ability2 {
      name: string;
      url: string;
  }

  export interface Ability {
      ability: Ability2;
      is_hidden: boolean;
      slot: number;
  }

  export interface Form {
      name: string;
      url: string;
  }

  export interface Version {
      name: string;
      url: string;
  }

  export interface GameIndice {
      game_index: number;
      version: Version;
  }

  export interface Move2 {
      name: string;
      url: string;
  }

  export interface MoveLearnMethod {
      name: string;
      url: string;
  }

  export interface VersionGroup {
      name: string;
      url: string;
  }

  export interface VersionGroupDetail {
      level_learned_at: number;
      move_learn_method: MoveLearnMethod;
      version_group: VersionGroup;
  }

  export interface Move {
      move: Move2;
      version_group_details: VersionGroupDetail[];
  }

  export interface Species {
      name: string;
      url: string;
  }

  export interface DreamWorld {
      front_default: string;
      front_female?: any;
  }

  export interface OfficialArtwork {
      front_default: string;
  }

  export interface Other {
      dream_world: DreamWorld;
      official_artwork: OfficialArtwork;
  }

  export interface RedBlue {
      back_default: string;
      back_gray: string;
      front_default: string;
      front_gray: string;
  }

  export interface Yellow {
      back_default: string;
      back_gray: string;
      front_default: string;
      front_gray: string;
  }

  export interface GenerationI {
      red_blue: RedBlue;
      yellow: Yellow;
  }

  export interface Crystal {
      back_default: string;
      back_shiny: string;
      front_default: string;
      front_shiny: string;
  }

  export interface Gold {
      back_default: string;
      back_shiny: string;
      front_default: string;
      front_shiny: string;
  }

  export interface Silver {
      back_default: string;
      back_shiny: string;
      front_default: string;
      front_shiny: string;
  }

  export interface GenerationIi {
      crystal: Crystal;
      gold: Gold;
      silver: Silver;
  }

  export interface Emerald {
      front_default: string;
      front_shiny: string;
  }

  export interface FireredLeafgreen {
      back_default: string;
      back_shiny: string;
      front_default: string;
      front_shiny: string;
  }

  export interface RubySapphire {
      back_default: string;
      back_shiny: string;
      front_default: string;
      front_shiny: string;
  }

  export interface GenerationIii {
      emerald: Emerald;
      firered_leafgreen: FireredLeafgreen;
      ruby_sapphire: RubySapphire;
  }

  export interface DiamondPearl {
      back_default: string;
      back_female?: any;
      back_shiny: string;
      back_shiny_female?: any;
      front_default: string;
      front_female?: any;
      front_shiny: string;
      front_shiny_female?: any;
  }

  export interface HeartgoldSoulsilver {
      back_default: string;
      back_female?: any;
      back_shiny: string;
      back_shiny_female?: any;
      front_default: string;
      front_female?: any;
      front_shiny: string;
      front_shiny_female?: any;
  }

  export interface Platinum {
      back_default: string;
      back_female?: any;
      back_shiny: string;
      back_shiny_female?: any;
      front_default: string;
      front_female?: any;
      front_shiny: string;
      front_shiny_female?: any;
  }

  export interface GenerationIv {
      diamond_pearl: DiamondPearl;
      heartgold_soulsilver: HeartgoldSoulsilver;
      platinum: Platinum;
  }

  export interface Animated {
      back_default: string;
      back_female?: any;
      back_shiny: string;
      back_shiny_female?: any;
      front_default: string;
      front_female?: any;
      front_shiny: string;
      front_shiny_female?: any;
  }

  export interface BlackWhite {
      animated: Animated;
      back_default: string;
      back_female?: any;
      back_shiny: string;
      back_shiny_female?: any;
      front_default: string;
      front_female?: any;
      front_shiny: string;
      front_shiny_female?: any;
  }

  export interface GenerationV {
      black_white: BlackWhite;
  }

  export interface OmegarubyAlphasapphire {
      front_default: string;
      front_female?: any;
      front_shiny: string;
      front_shiny_female?: any;
  }

  export interface XY {
      front_default: string;
      front_female?: any;
      front_shiny: string;
      front_shiny_female?: any;
  }

  export interface GenerationVi {
      omegaruby_alphasapphire: OmegarubyAlphasapphire;
      x_y: XY;
  }

  export interface Icons {
      front_default: string;
      front_female?: any;
  }

  export interface UltraSunUltraMoon {
      front_default: string;
      front_female?: any;
      front_shiny: string;
      front_shiny_female?: any;
  }

  export interface GenerationVii {
      icons: Icons;
      ultra_sun_ultra_moon: UltraSunUltraMoon;
  }

  export interface Icons2 {
      front_default: string;
      front_female?: any;
  }

  export interface GenerationViii {
      icons: Icons2;
  }

  export interface Versions {
      generation_i: GenerationI;
      generation_ii: GenerationIi;
      generation_iii: GenerationIii;
      generation_iv: GenerationIv;
      generation_v: GenerationV;
      generation_vi: GenerationVi;
      generation_vii: GenerationVii;
      generation_viii: GenerationViii;
  }

  export interface Sprites {
      back_default: string;
      back_female?: any;
      back_shiny: string;
      back_shiny_female?: any;
      front_default: string;
      front_female?: any;
      front_shiny: string;
      front_shiny_female?: any;
      other: Other;
      versions: Versions;
  }

  export interface Stat2 {
      name: string;
      url: string;
  }

  export interface Stat {
      base_stat: number;
      effort: number;
      stat: Stat2;
  }

  export interface Type2 {
      name: string;
      url: string;
  }

  export interface Type {
      slot: number;
      type: Type2;
  }

  export interface Dettaglio {
      abilities: Ability[];
      base_experience: number;
      forms: Form[];
      game_indices: GameIndice[];
      height: number;
      held_items: any[];
      id: number;
      is_default: boolean;
      location_area_encounters: string;
      moves: Move[];
      name: string;
      order: number;
      past_types: any[];
      species: Species;
      sprites: Sprites;
      stats: Stat[];
      types: Type[];
      weight: number;
  }

}

