/// <reference types="jest" />
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { EpisodeService } from './episode.service';
import { PagedResponse, EpisodeDto } from '../models/episode';

describe('EpisodeService', () => {
  let service: EpisodeService;
  let httpMock: HttpTestingController;
  const baseUrl = 'https://rickandmortyapi.com/api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EpisodeService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(EpisodeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Asegura que no haya peticiones colgadas
    httpMock.verify();
  });

  it('debe iniciar con estados por defecto', () => {
    expect(service.episodes()).toEqual([]);
    expect(service.episodesLoading()).toBeFalsy();
    expect(service.error()).toBeNull();
  });

  it('debe cargar episodios y actualizar signals (getEpisodes)', () => {
    const mockResponse: PagedResponse<EpisodeDto> = {
      info: { count: 1, pages: 1, next: null, prev: null },
      results: [{ id: 1, name: 'Pilot', air_date: '', episode: '', characters: [], url: '', created: '' }]
    };

    service.getEpisodes(1);
    
    // Verificamos que el loading se active
    expect(service.episodesLoading()).toBeTruthy();

    const req = httpMock.expectOne(`${baseUrl}/episode?page=1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    // Verificamos que los signals se actualicen
    expect(service.episodes()).toEqual(mockResponse.results);
    expect(service.episodesLoading()).toBeFalsy();
    expect(service.error()).toBeNull();
  });

  it('debe manejar errores en la carga de episodios', () => {
    service.getEpisodes(1);

    const req = httpMock.expectOne(`${baseUrl}/episode?page=1`);
    req.error(new ErrorEvent('Network error'));

    expect(service.error()).toBe('Error al cargar episodios');
    expect(service.episodesLoading()).toBeFalsy();
  });

  it('debe obtener personajes a partir de un array de URLs (getCharacters)', () => {
    const mockUrls = ['https://.../1', 'https://.../2'];
    const mockCharacters = [{ id: 1, name: 'Rick' }, { id: 2, name: 'Morty' }];

    service.getCharacters(mockUrls);

    // Verifica que extraiga bien los IDs de las URLs (1,2)
    const req = httpMock.expectOne(`${baseUrl}/character/1,2`);
    req.flush(mockCharacters);

    expect(service.characters()).toEqual(mockCharacters);
    expect(service.charactersLoading()).toBeFalsy();
  });

  it('debe limpiar el signal de personajes (clearCharacters)', () => {
    service.CharactersRes.set([{ id: 1 } as any]);
    service.clearCharacters();
    expect(service.characters()).toEqual([]);
  });
});
