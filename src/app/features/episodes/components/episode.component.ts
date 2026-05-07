import { Component, computed, inject, signal } from '@angular/core';
import { EpisodeService } from '../services/episode.service';
import { EpisodeDto } from '../models/episode';

@Component({
  selector: 'app-episode',
  standalone: true,
  templateUrl: './episode.component.html',
  styleUrl: './episode.component.css',
})
export class EpisodeComponent {
  [x: string]: any;
  public episodeService = inject(EpisodeService);

  currentPage: number = 1;
  selectedEpisode = signal<EpisodeDto | null>(null);
  showModal = signal(false);

  selectedSeason = signal('');
  isFiltering = computed(() => !!this.selectedSeason());

  // Paginación
  page = signal(1);
  hasNext = computed(() => !!this.episodeService.info()?.next);
  hasPrev = computed(() => !!this.episodeService.info()?.prev);

  episodesSource = computed(() => {
    if (this.isFiltering()) {
      return this.episodeService.allEpisodes() ?? [];
    }

    return this.episodeService.episodes();
  });

  filteredEpisodes = computed(() => {
    const list = this.episodesSource();
    const season = this.selectedSeason();

    if (!season) return list;

    return list.filter((ep) => ep.episode.split('E')[0] === season);
  });

  ngOnInit(): void {
    this.episodeService.getEpisodes(this.currentPage);
  }

  cargarDetalle(episode: EpisodeDto): void {
    this.selectedEpisode.set(episode);
    this.showModal.set(true);

    this.episodeService.clearCharacters();
    this.episodeService.getCharacters(episode.characters);
  }

  nextPage() {
    const next = this.page() + 1;
    this.page.set(next);
    this.episodeService.getEpisodes(next);
  }

  prevPage() {
    const prev = this.page() - 1;
    if (prev < 1) return;

    this.page.set(prev);
    this.episodeService.getEpisodes(prev);
  }

  onSeasonChange(season: string) {
    this.selectedSeason.set(season);

    if (season) {
      this.episodeService.getAllEpisodes();
    }
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '';
    
    return new Date(dateStr).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
