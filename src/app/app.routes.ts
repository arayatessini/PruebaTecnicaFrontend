import { Routes } from '@angular/router';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'episodes',
        pathMatch: 'full'
    },
    {
        path: 'episodes',
        loadComponent: () => import('./features/episodes/components/episode.component').then(m => m.EpisodeComponent)
    },
    { 
        path: '**', component: NotFoundComponent 
    }
];
