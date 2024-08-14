import { Routes } from '@angular/router';

//array of route objects for Angular router
export const routes: Routes = [
    //when given URL path, imports module object, then extract component
    {path: '', loadComponent: () => import('./pages/login/login.component').then(a => a.LoginComponent)},
    {path: 'movies', loadComponent: () => import('./pages/movies/movies.component').then(a => a.MoviesComponent)},
    {path: 'content-details/:id', loadComponent: () => import('./shared/components/content-details/content-details.component').then(a => a.ContentDetailsComponent)},
    {path: 'tvshows', loadComponent: () => import('./pages/tvshows/tvshows.component').then(a => a.TvshowsComponent)}
];
