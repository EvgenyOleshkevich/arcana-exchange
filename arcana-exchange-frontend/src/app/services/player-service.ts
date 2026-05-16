import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Card } from '../model/card';
import { Player } from '../model/player';
import { Observable } from 'rxjs';
import { PlayerMatch } from '../model/PlayerMatch';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  private readonly http = inject(HttpClient);

  getPlayer(playerId: number) {
    return this.http.get<Player>(`/api/player/${playerId}`);
  }

  createPlayer(playerId: number) {
    return this.http.post<Player>(`/api/player/${playerId}/create`, null);
  }

  updateCards(playerId: number, html: string) {
    return this.http.put<void>(
      `/api/player/${playerId}/cards`,
      html,
      {
        headers: {
          'Content-Type': 'text/plain',
        },
      }
    );
  }

  updateInfo(playerId: number) {
    return this.http.put<Player>(`/api/player/${playerId}/info`, null);
  }

  getVerificationCode(playerId: number) {
    return this.http.post<string>(`/api/player/${playerId}/verification-code`, null);
  }

  verifyCode(playerId: number) {
    return this.http.get<boolean>(`/api/player/${playerId}/verify`);
  }

  getPerfectMatches(playerId: number) {
    return this.http.get<PlayerMatch[]>(`/api/player/${playerId}/match`);
  }
}
