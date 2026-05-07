export interface EpisodeDto {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
  created: string;
  results: EpisodeDto[];
}

export interface PagedResponse<T> {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: T[];
}