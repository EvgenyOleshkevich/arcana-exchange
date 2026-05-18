import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Card } from '../model/card';
import { CardExchangePlayers } from '../model/CardExchangePlayers';
import { Server } from '../model/Enums';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CardService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getCards() {
    return this.http.get<Card[]>('/api/cards');
  }

  getPlayersExchangingCard(cardId: number, server: Server) {
    return this.http.get<CardExchangePlayers>(`${this.apiUrl}/cards/${cardId}/exchange-players`,
    {
      params: {
        server,
      },
    });
  }
}
