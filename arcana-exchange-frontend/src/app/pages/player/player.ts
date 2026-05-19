import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { PlayerService } from '../../services/player-service';
import { Player } from '../../model/player';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { PlayerMatch } from '../../model/PlayerMatch';
import { CardService } from '../../services/card-service';
import { CardExchangePlayers } from '../../model/CardExchangePlayers';
import { CommonModule, DatePipe } from '@angular/common';
import { CardListComponent } from '../../utils/card-list/card-list';
import { CardExchange } from '../../utils/card-exchange/card-exchange';
import { FormsModule } from '@angular/forms';
import { getServerLabel } from '../../model/Enums';
import { PlayerMatchModal } from '../../modal/player-match-modal/player-match-modal';
import { parseId } from '../../utils/functions';
import { FavoritePlayersService } from '../../services/favorite-players-service';
import { FavoritePlayersComponent } from '../../utils/favorite-players/favorite-players';
import { I18nService, TranslationKey  } from '../../i18n/i18n.service';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DatePipe, CardListComponent, CardExchange, PlayerMatchModal, FavoritePlayersComponent],
  templateUrl: './player.html',
  styleUrl: './player.scss',
})
export class PlayerComponent implements OnInit {
  private readonly i18n = inject(I18nService);
  readonly t = this.i18n.t;
  private readonly playerService = inject(PlayerService);
  private readonly cardService = inject(CardService);
  private readonly favoritePlayersService = inject(FavoritePlayersService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly player = signal<Player | null>(null);
  playerId = '';
  readonly showPlayerSearch = signal(false);
  readonly selectedCardId = signal<number | null>(null);
  readonly cardExchange = signal<CardExchangePlayers | null>(null);
  readonly matches = signal<PlayerMatch[]>([]);
  readonly selectedPlayerMatch = signal<PlayerMatch | null>(null);

  readonly errorLoadPlayer = signal<string | null>(null);
  readonly errorLoadPlayerFront = signal<TranslationKey  | null>(null);
  readonly errorLoadMatches = signal<string | null>(null);
  readonly errorLoadCardExchange = signal<string | null>(null);

  readonly playerCards = computed<ReadonlyMap<number, number>>(() => {
    const player = this.player();

    if (!player) {
      return new Map();
    }

    return new Map(
      player.cards.map(card => [card.cardId, card.quantity])
    );
  });

  readonly playerServer = computed(() => {
    const player = this.player();
    return player ? getServerLabel(player.server) : '';
  });

  readonly isFavorite = computed(() => {
    const player = this.player();
    if (!player) {
      return false;
    }

    return this.favoritePlayersService.isFavorite(player.playerId);
  });

  ngOnInit() {
    this.route.paramMap
      .pipe(
        map(params => parseId(params.get('playerId')))
      )
      .subscribe(playerId => {
        this.player.set(null);
        this.matches.set([]);
        this.selectedCardId.set(null);
        this.cardExchange.set(null);
        this.showPlayerSearch.set(false);
        this.errorLoadPlayer.set(null);
        this.errorLoadPlayerFront.set(null);

        if (playerId) {
          this.loadPlayer(playerId);
        }
      });
  }

  loadPlayer(playerId: number) {
    this.errorLoadPlayer.set(null);

    this.playerService.getPlayer(playerId).subscribe({
      next: player => {
        this.player.set(player);
        this.loadMatches(playerId);
      },
      error: err => {
        console.error(err);

        if (err.status === 404) {
          this.cratePlayer(playerId);
          return;
        }
      },
    });
  }

  cratePlayer(playerId: number) {
    this.errorLoadPlayer.set(null);
    this.errorLoadPlayerFront.set(null);

    this.playerService.createPlayer(playerId).subscribe({
      next: player => {
        this.player.set(player);
        this.loadMatches(playerId);
      },
      error: err => {
        console.error(err);
        this.errorLoadPlayer.set(err.error?.message ?? 'unknown error');
      },
    });
  }

  loadMatches(playerId: number) {
    this.errorLoadMatches.set(null);

    this.playerService.getPerfectMatches(playerId).subscribe({
      next: matches => this.matches.set(matches),
      error: err => {
        console.error(err);
        this.errorLoadMatches.set(err.error?.message ?? 'unknown error');
      },
    });
  }

  onLoadPlayer() {
    const playerId = parseId(this.playerId);
    if (!playerId) {
      this.errorLoadPlayerFront.set('playerWrongID');
      this.errorLoadPlayer.set(null);
      return;
    }
    this.errorLoadPlayerFront.set(null);

    this.router.navigate(['/player', playerId]);
  }

  onLoadPlayersExchangingCard(cardId: number) {
    const player = this.player();
    if (!player) {
      return;
    }
    this.errorLoadCardExchange.set(null);

    this.cardService.getPlayersExchangingCard(cardId, player.server).subscribe({
      next: (exchange) => {
        this.cardExchange.set(exchange);
        this.selectedCardId.set(cardId);
      },
      error: (err) => {
        console.error(err);
        this.errorLoadCardExchange.set(err.error?.message ?? 'unknown error');
      },
    });
  }

  onUpdatePlayerInfo() {
    const player = this.player();
    if (!player) {
      return;
    }
    this.errorLoadPlayer.set(null);

    this.playerService.updateInfo(player.playerId).subscribe({
      next: (player) => {
        this.player.set(player);
      },
      error: (err) => {
        console.error(err);
        this.errorLoadPlayer.set(err.error?.message ?? 'unknown error');
      },
    });
  }

  onGoToPlayerProfile() {
    const player = this.player();
    if (!player) {
      return;
    }
    this.router.navigate([`/player/${player.playerId}/update`]);
  }

  onCloseExchange() {
    this.selectedCardId.set(null);
    this.cardExchange.set(null);
  }

  onTogglePlayerSearch() {
    this.showPlayerSearch.update(value => !value);
  }

  onToggleFavorite() {
    const player = this.player();
    if (!player) {
      return;
    }
    this.favoritePlayersService.toggleFavorite(player);
  }

  onOpenFavoritePlayer(playerId: number) {
    this.router.navigate(['/player', playerId]);
  }

  onSelectPlayerMatch(match: PlayerMatch) {
    this.selectedPlayerMatch.set(match);
  }

  onCloseMatchModal() {
    this.selectedPlayerMatch.set(null);
  }
}
