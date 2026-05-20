import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Player } from '../model/player';
import { PlayerMatch } from '../model/PlayerMatch';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getPlayer(playerId: number) {
    return this.http.get<Player>(`${this.apiUrl}/player/${playerId}`);
  }

  createPlayer(playerId: number) {
    return this.http.post<Player>(`${this.apiUrl}/player/${playerId}/create`, null);
  }

  updateCardsHtml(playerId: number, data: string) {
    return this.http.put<void>(
      `${this.apiUrl}/player/${playerId}/cards/html`,
      data,
      {
        headers: {
          'Content-Type': 'text/plain',
        },
      }
    );
  }

  updateCardsJson(playerId: number, data: string) {
    return this.http.put<void>(
      `${this.apiUrl}/player/${playerId}/cards/json`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  updateCardsManual(playerId: number, cardQuantity: Map<number, number>) {
    const data = Array.from(cardQuantity, ([key, value]) => ({ 
      cardId: key, 
      quantity: value
    }));
    return this.http.put<void>(
      `${this.apiUrl}/player/${playerId}/cards/manual`,
      data
    );
  }

  updateInfo(playerId: number) {
    return this.http.put<Player>(`${this.apiUrl}/player/${playerId}/info`, null);
  }

  getVerificationCode(playerId: number) {
  return this.http.post(
    `${this.apiUrl}/player/${playerId}/verification-code`,
    null,
    {
      responseType: 'text',
    }
  );
}

  verifyCode(playerId: number) {
    return this.http.get<boolean>(`${this.apiUrl}/player/${playerId}/verify`);
  }

  getPerfectMatches(playerId: number) {
    return this.http.get<PlayerMatch[]>(`${this.apiUrl}/player/${playerId}/match`);
  }
}
