import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FavoritePlayer } from '../../model/FavoritePlayer';

@Component({
  selector: 'app-favorite-players',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorite-players.html',
  styleUrl: './favorite-players.scss',
})
export class FavoritePlayersComponent {
  @Output()
  readonly playerSelected = new EventEmitter<number>();

  private loadFavorites(): FavoritePlayer[] {
    const raw = localStorage.getItem('favoritePlayers');

    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw);

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed.slice(0, 5);

    } catch {
      return [];
    }
  }

  onSelect(playerId: number) {
    this.playerSelected.emit(playerId);
  }
}