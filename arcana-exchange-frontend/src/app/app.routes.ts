import { Routes } from '@angular/router';
import { PlayerComponent } from './pages/player/player';
import { PlayerUpdateComponent } from './pages/playerUpdate/playerUpdate';
import { About } from './pages/about/about';
import { CardsComponent } from './pages/cards/cards';

export const routes: Routes = [
    {path: 'player', component: PlayerComponent},
    {path: 'player/:playerId', component: PlayerComponent},
    {path: 'player/:playerId/update', component: PlayerUpdateComponent},
    {path: 'cards', component: CardsComponent},
    {path: 'about', component: About},
    {path: '**', component: About},
];
