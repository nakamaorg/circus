export interface Game {
  id: string;
  name: string;
  description?: string;
  image?: string;
  [key: string]: unknown;
}

export interface GameInfo {
  games: Game[];
}

export interface GamesResponse {
  gameIds: string[];
}
