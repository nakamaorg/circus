export interface Game {
  id: number;
  url: string;
  name: string;
  rating: number;
  first_release_date: number;
  cover_url?: string;
}

export interface ThirdWheelAPIResponse {
  status: number;
  success: boolean;
  data: Game[];
}

export interface GameInfoResponse {
  data: ThirdWheelAPIResponse;
}

export interface GamesResponse {
  gameIds: string[];
}
