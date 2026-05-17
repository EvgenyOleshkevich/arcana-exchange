import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { PlayerService } from '../../services/player-service';
import { Player } from '../../model/player';
import { ActivatedRoute, Router } from '@angular/router';
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

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, CardListComponent, CardExchange, PlayerMatchModal],
  templateUrl: './player.html',
  styleUrl: './player.scss',
})
export class PlayerComponent implements OnInit {
  private playerService = inject(PlayerService);
  private cardService = inject(CardService);
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

  playerServer = computed(() => {
    const player = this.player();
    return player ? getServerLabel(player.server) : '';
  });

  ngOnInit() {
    const playerId = parseId(this.route.snapshot.paramMap.get('playerId'));

    if (playerId) {
      this.loadPlayer(playerId);
      this.loadMatches(playerId);
    }
  }

  loadPlayer(playerId: number) {
    this.errorLoadPlayer.set(null);

    this.playerService.getPlayer(playerId).subscribe({
      next: player => {
        this.player.set(player);

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
      this.errorLoadPlayer.set('wrong UID format');
      return;
    }

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

  onTogglePlayonGoToPlayerProfileerSearch() {
    const player = this.player();
    if (!player) {
      return;
    }
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
