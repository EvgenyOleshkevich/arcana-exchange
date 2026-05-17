import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FavoritePlayer } from '../../model/FavoritePlayer';
import { FavoritePlayersService } from '../../services/favorite-players-service';
import { I18nService } from '../../i18n/i18n.service';

@Component({
  selector: 'app-favorite-players',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorite-players.html',
  styleUrl: './favorite-players.scss',
})
export class FavoritePlayersComponent {
  private readonly i18n = inject(I18nService);
  readonly t = this.i18n.t;
  private readonly favoritePlayersService = inject(FavoritePlayersService);
  @Output()
  readonly playerSelected = new EventEmitter<number>();

  readonly favoritePlayers = this.favoritePlayersService.favoritePlayers;

  onSelect(playerId: number) {
    this.playerSelected.emit(playerId);
  }
}