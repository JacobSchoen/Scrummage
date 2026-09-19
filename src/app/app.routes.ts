import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'lobby',
        pathMatch: 'full'
    },
    {
        path: 'lobby',
        loadComponent: () =>
            import('./features/lobby/lobby').then((m) => m.Lobby),
    },
    {
        path: 'room/:id',
        loadComponent: () =>
            import('./features/room/room').then((m) => m.Room),
    },
];
