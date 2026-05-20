import { Component, computed, inject, input, signal } from '@angular/core';
import { Player } from '../../model/player';
import { PlayerService } from '../../services/player-service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { getServerLabel, InputType, toHoyolabServer } from '../../model/Enums';
import { checkCountCards, parseId } from '../../utils/functions';
import { I18nService } from '../../i18n/i18n.service';
import { finalize } from 'rxjs';
import { CardsStore } from '../../store/cards-store';
import { Card } from '../../model/card';

@Component({
  selector: 'app-player-update',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './playerUpdate.html',
  styleUrl: './playerUpdate.scss',
})
export class PlayerUpdateComponent {
  private readonly i18n = inject(I18nService);
  readonly t = this.i18n.t;
  private readonly cardsStore = inject(CardsStore);
  readonly cards = this.cardsStore.cards;
  private playerService = inject(PlayerService);
  private readonly route = inject(ActivatedRoute);
  private router = inject(Router);
  InputType = InputType;

  readonly player = signal<Player | null>(null);
  readonly verificationCode = signal<string | null>(null);
  readonly showVerifyResult = signal<boolean>(false);
  readonly verifyResult = signal<boolean>(false);
  readonly isUpdatingPlayer = signal(false);
  readonly isUpdatingCards = signal(false);

  readonly JsonModeSelected = signal<boolean>(true);
  readonly selectedUpdateMode = signal<InputType>(InputType.Json);
  inputJson = '';
  inputHTML = '';
  inputManual = new Map<number, number>(this.cards().map(card => [card.cardId, 0] as const));

  readonly errorLoadPlayer = signal<string | null>(null);
  readonly errorUpdateCards = signal<string | null>(null);
  readonly errorToMuchCards = signal<boolean>(false);
  readonly errorVerify = signal<string | null>(null);

  readonly playerServer = computed(() => {
    const player = this.player();
    return player ? getServerLabel(player.server) : '';
  });

  readonly jsonLink = computed(() => {
    const player = this.player();
    if (!player) {
      return '';
    }
    const serverParam = toHoyolabServer(player.server);
    return `https://sg-public-api.hoyolab.com/event/game_record/genshin/api/role_combat?server=${serverParam}&role_id=${player?.playerId}`
  });

  ngOnInit() {
    const playerId = parseId(this.route.snapshot.paramMap.get('playerId'));

    if (!playerId) {
      this.router.navigate(['/player']);
      return;
    }
    this.loadPlayer(playerId);
  }

  loadPlayer(playerId: number) {
    this.errorLoadPlayer.set(null);

    this.playerService.getPlayer(playerId).subscribe({
      next: player =>  {
        this.player.set(player);
        player.cards.forEach(card => this.inputManual.set(card.cardId, card.quantity));
      },
      error: err => {
        console.error(err);
        this.errorLoadPlayer.set(err.error?.message ?? 'unknown error');
      },
    });
  }

  onUpdateCardsHtml() {
    const player = this.player();
    if (!player) {
      return;
    }
    this.errorUpdateCards.set(null);
    this.isUpdatingCards.set(true);

    this.playerService.updateCardsHtml(player.playerId, this.inputHTML).pipe(
      finalize(() => this.isUpdatingCards.set(false))
    ).subscribe({
      next: () => {
        this.router.navigate(['/player', player.playerId]);
      },
      error: (err) => {
        console.error(err);
        this.errorUpdateCards.set(err.error?.message ?? 'unknown error');
      },
    });
  }

  onUpdateCardsJson() {
    const player = this.player();
    if (!player) {
      return;
    }

    this.errorUpdateCards.set(null);
    this.isUpdatingCards.set(true);

    this.playerService.updateCardsJson(player.playerId, this.inputJson).pipe(
      finalize(() => this.isUpdatingCards.set(false))
    ).subscribe({
      next: () => {
        this.router.navigate(['/player', player.playerId]);
      },
      error: err => {
        console.error(err);
        this.showVerifyResult.set(false);
        this.errorUpdateCards.set(err.error?.message ?? 'unknown error');
      },
    });
  }

  onUpdateCardsManual() {
    const player = this.player();
    if (!player) {
      return;
    }
    if (checkCountCards(this.inputManual)) {
      this.errorToMuchCards.set(true);
      return;
    }
    this.errorUpdateCards.set(null);
    this.errorToMuchCards.set(false);
    this.isUpdatingCards.set(true);

    this.playerService.updateCardsManual(player.playerId, this.inputManual).pipe(
      finalize(() => this.isUpdatingCards.set(false))
    ).subscribe({
      next: () => {
        this.router.navigate(['/player', player.playerId]);
      },
      error: err => {
        console.error(err);
        this.showVerifyResult.set(false);
        this.errorUpdateCards.set(err.error?.message ?? 'unknown error');
      },
    });
  }

  onChangeUpdateType(type: InputType) {
    this.selectedUpdateMode.set(type);
    this.errorUpdateCards.set(null);
    this.errorToMuchCards.set(false);
  }

  onChangeCardQuantity(cardId: number, quantity: number) {
    this.inputManual.set(cardId, Math.min(10, Math.max(0, quantity)));
  }

  getCardQuantity(cardId: number) {
    return this.inputManual.get(cardId) ?? 0;
  }

  onIncreaseCardQuantity(cardId: number) {
    this.onChangeCardQuantity(cardId, this.getCardQuantity(cardId) + 1);
  }

  onDecreaseCardQuantity(cardId: number) {
    this.onChangeCardQuantity(cardId, this.getCardQuantity(cardId) - 1);
  }

  onUpdatePlayerInfo() {
    const player = this.player();
    if (!player) {
      return;
    }
    this.errorLoadPlayer.set(null);
    this.isUpdatingPlayer.set(true);

    this.playerService.updateInfo(player.playerId).pipe(
      finalize(() => this.isUpdatingPlayer.set(false))
    ).subscribe({
      next: (player) => {
        this.showVerifyResult.set(false);
        this.verifyResult.set(false);
        this.player.set(player);
      },
      error: (err) => {
        console.error(err);
        this.errorLoadPlayer.set(err.error?.message ?? 'unknown error');
      },
    });
  }

  onRequestVerificationCode() {
    const player = this.player();
    if (!player) {
      return;
    }
    this.errorVerify.set(null);

    this.playerService.getVerificationCode(player.playerId).subscribe({
      next: (code) => {
        this.verificationCode.set(code);
        this.verifyResult.set(false);
      },
      error: (err) => {
        console.error(err);
        this.errorVerify.set(err.error?.message ?? 'unknown error');
      },
    });
  }

  onVerifyCode() {
    const player = this.player();
    if (!player) {
      return;
    }
    this.errorVerify.set(null);
    this.showVerifyResult.set(false);

    this.playerService.verifyCode(player.playerId).subscribe({
      next: (res) => {
        this.showVerifyResult.set(true);
        this.verifyResult.set(res);
      },
      error: (err) => {
        console.error(err);
        this.errorVerify.set(err.error?.message ?? 'unknown error');
      },
    });
  }

  cardName(card: Card) {
    return this.i18n.cardName(card);
  }
}
