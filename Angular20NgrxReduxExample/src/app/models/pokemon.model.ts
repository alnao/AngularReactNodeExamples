export interface Pokemon {
  id: number;
  name: string;
  url: string;
  sprites?: {
    front_default: string | null;
    front_shiny: string | null;
  };
  types?: Array<{
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }>;
  height?: number;
  weight?: number;
  abilities?: Array<{
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }>;
}

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PaginatedPokemonResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface PokemonDetail extends Pokemon {
  // Campi aggiuntivi dal detail API
  base_experience: number;
  forms: Array<{
    name: string;
    url: string;
  }>;
  game_indices: Array<{
    game_index: number;
    version: {
      name: string;
      url: string;
    };
  }>;
  species: {
    name: string;
    url: string;
  };
  stats: Array<{
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }>;
}
