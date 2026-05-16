import { Component, inject, signal } from '@angular/core';
import { Player } from '../../model/player';
import { PlayerService } from '../../services/player-service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class PlayerUpdateComponent {
  private playerService = inject(PlayerService);
  private readonly route = inject(ActivatedRoute);
  private router = inject(Router);
  readonly player = signal<Player | null>(null);
  readonly verificationCode = signal<string | null>(null);
  readonly verifyResult = signal<boolean>(false);
  inputHTML = '';
  readonly errorLoadPlayer = signal<string | null>(null);
  readonly errorUpdateCards = signal<string | null>(null);
  readonly errorVerify = signal<string | null>(null);

  ngOnInit() {
    const playerId = Number(this.route.snapshot.paramMap.get('playerId'));

    if (!playerId || Number.isNaN(playerId)) {
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

  onUpdateCards() {
    const player = this.player();
    if (!player) {
      return;
    }
    this.errorUpdateCards.set(null);

    this.playerService.updateCards(player.playerId, this.inputHTML).subscribe({
      next: () => {
        this.router.navigate([`/profile/${player.playerId}`]);
      },
      error: (err) => {
        console.error(err);
        this.errorUpdateCards.set(err.error?.message ?? 'unknown error');
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
