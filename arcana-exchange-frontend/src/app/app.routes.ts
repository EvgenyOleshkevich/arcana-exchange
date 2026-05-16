import { Routes } from '@angular/router';
import { PlayerComponent } from './pages/player/player';
import { PlayerUpdateComponent } from './pages/playerUpdate/playerUpdate';

export const routes: Routes = [
    {path: 'player', component: PlayerComponent},
    {path: 'player/:playerId', component: PlayerComponent},
    {path: 'player/:playerId/update', component: PlayerUpdateComponent},
    //{path: 'cards', component: CardsComponent},
    //{path: 'about', component: AboutComponent},
    //{path: '**', component: AboutComponent},
];
