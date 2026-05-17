import { Component, computed, inject, signal } from '@angular/core';
import { Player } from '../../model/player';
import { PlayerService } from '../../services/player-service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { getServerLabel, toHoyolabServer } from '../../model/Enums';
import { parseId } from '../../utils/functions';

@Component({
  selector: 'app-player-update',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './playerUpdate.html',
  styleUrl: './playerUpdate.scss',
})
export class PlayerUpdateComponent {
  private playerService = inject(PlayerService);
  private readonly route = inject(ActivatedRoute);
  private router = inject(Router);

  readonly player = signal<Player | null>(null);
  readonly verificationCode = signal<string | null>(null);
  readonly verifyResult = signal<boolean>(false);

  readonly JsonModeSelected = signal<boolean>(true);
  inputJson = '';
  inputHTML = '';

  readonly errorLoadPlayer = signal<string | null>(null);
  readonly errorUpdateCards = signal<string | null>(null);
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
      next: player => this.player.set(player),
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

    this.playerService.updateCardsHtml(player.playerId, this.inputHTML).subscribe({
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

    this.playerService.updateCardsJson(player.playerId, this.inputJson).subscribe({
      next: () => {
        this.router.navigate(['/player', player.playerId]);
      },
      error: err => {
        console.error(err);
        this.errorUpdateCards.set(err.error?.message ?? 'unknown error');
      },
    });
  }

  onSelectUpdateHtml() {
    this.JsonModeSelected.set(false);
    this.errorUpdateCards.set(null);
  }

  onSelectUpdateJson() {
    this.JsonModeSelected.set(true);
    this.errorUpdateCards.set(null);
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

  onRequestVerificationCode() {
    const player = this.player();
    if (!player) {
      return;
    }
    this.errorVerify.set(null);

    this.playerService.getVerificationCode(player.playerId).subscribe({
      next: (code) => this.verificationCode.set(code),
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

    this.playerService.verifyCode(player.playerId).subscribe({
      next: (res) => this.verifyResult.set(res),
      error: (err) => {
        console.error(err);
        this.errorVerify.set(err.error?.message ?? 'unknown error');
      },
    });
  }
}
