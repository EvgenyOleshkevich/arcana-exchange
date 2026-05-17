import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FavoritePlayer } from '../../model/FavoritePlayer';
import { FavoritePlayersService } from '../../services/favorite-players-service';

@Component({
  selector: 'app-favorite-players',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorite-players.html',
  styleUrl: './favorite-players.scss',
})
export class FavoritePlayersComponent {
  private readonly favoritePlayersService = inject(FavoritePlayersService);
  @Output()
  readonly playerSelected = new EventEmitter<number>();

  readonly favoritePlayers = this.favoritePlayersService.favoritePlayers;

  onSelect(playerId: number) {
    this.playerSelected.emit(playerId);
  }
}