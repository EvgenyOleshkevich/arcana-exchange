import { Injectable, signal } from '@angular/core';
import { FavoritePlayer } from '../model/FavoritePlayer';
import { Player } from '../model/player';

const STORAGE_KEY = 'favoritePlayers';

@Injectable({ providedIn: 'root' })
export class FavoritePlayersService {
  private readonly favoritePlayersSignal = signal<FavoritePlayer[]>(this.loadFavorites());

  readonly favoritePlayers = this.favoritePlayersSignal.asReadonly();

  isFavorite(playerId: number): boolean {
    return this.favoritePlayersSignal().some(player => player.playerId === playerId);
  }

  addFavorite(player: Player) {
    if (this.isFavorite(player.playerId)) {
      return;
    }

    this.updateFavorites([
      {
        playerId: player.playerId,
        name: player.name
      },
      ...this.favoritePlayersSignal(),
    ].slice(0, 5));
  }

  removeFavorite(playerId: number) {
    this.updateFavorites(
      this.favoritePlayersSignal().filter(player => player.playerId !== playerId)
    );
  }

  toggleFavorite(player: Player) {
    if (this.isFavorite(player.playerId)) {
      this.removeFavorite(player.playerId);
      return;
    }

    this.addFavorite(player);
  }

  private updateFavorites(players: FavoritePlayer[]) {
    this.favoritePlayersSignal.set(players);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
  }

  private loadFavorites(): FavoritePlayer[] {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw);

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed
        .filter(player => (
          typeof player.playerId === 'number' &&
          typeof player.name === 'string'
        ))
        .slice(0, 5);
    } catch {
      return [];
    }
  }
}