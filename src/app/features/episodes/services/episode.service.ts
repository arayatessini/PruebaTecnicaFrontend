import { computed, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EpisodeDto, PagedResponse } from '../models/episode';
import { CharacterDto } from '../models/character';

@Injectable({
  providedIn: 'root',
})
export class EpisodeService {
  private baseUrl = 'https://rickandmortyapi.com/api';
  // private baseUrl = 'https://httpstat.us/500'; --> para probar interceptor de errores

  allEpisodes = signal<EpisodeDto[] | null>(null);
  EpisodesRes = signal<PagedResponse<EpisodeDto> | null>(null);
  CharactersRes = signal<CharacterDto[] | null>(null);

  readonly episodes = computed(() => this.EpisodesRes()?.results ?? []);
  readonly info = computed(() => this.EpisodesRes()?.info);
  readonly characters = computed(() => this.CharactersRes() ?? []);

  // Manejo de estados
  // Alternativa: NgRx Component Store
  // Se evaluó implementar store, pero se optó por signals por la simplicidad y menor sobrecarga para este caso.

  episodesLoading = signal(false);
  charactersLoading = signal(false);
  error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  getAllEpisodes(): void {
    if (this.allEpisodes() !== null) return;

    let page = 1;
    let all: EpisodeDto[] = [];

    const fetchPage = () => {
      this.http
        .get<PagedResponse<EpisodeDto>>(`${this.baseUrl}/episode?page=${page}`)
        // .get<PagedResponse<EpisodeDto>>(`${this.baseUrl}/episode?page=999`) --> para probar interceptor de errores
        .subscribe((res) => {
          all = [...all, ...res.results];

          if (res.info.next) {
            page++;
            fetchPage();
          } else {
            this.allEpisodes.set(all);
          }
        });
    };

    fetchPage();
  }

  getEpisodes(page: number): void {
    this.episodesLoading.set(true);
    this.error.set(null);

    this.http
      .get<PagedResponse<EpisodeDto>>(`${this.baseUrl}/episode?page=${page}`)
      .subscribe({
        next: (res) => {
          this.EpisodesRes.set(res);
          this.episodesLoading.set(false);
        },
        error: () => {
          this.error.set('Error al cargar episodios');
          this.episodesLoading.set(false);
        },
      });
  }

  getCharacters(urls: string[]): void {
    this.charactersLoading.set(true);
    this.error.set(null);

    const ids: string[] = urls
      .map((url) => url.split('/').pop())
      .filter((id): id is string => id !== undefined);

    this.http
      .get<CharacterDto[]>(`${this.baseUrl}/character/${ids.join(',')}`)
      .subscribe({
        next: (res) => {
          this.CharactersRes.set(res);
          this.charactersLoading.set(false);
        },
        error: () => {
          this.error.set('Error al cargar personajes');
          this.charactersLoading.set(false);
        },
      });
  }

  clearCharacters() {
    this.CharactersRes.set([]);
  }
}
