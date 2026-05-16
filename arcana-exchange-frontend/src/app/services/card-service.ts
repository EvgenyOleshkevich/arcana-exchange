import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Card } from '../model/card';
import { CardExchangePlayers } from '../model/CardExchangePlayers';
import { Server } from '../model/Enums';

@Injectable({ providedIn: 'root' })
export class CardService {
  private readonly http = inject(HttpClient);

  getCards() {
    return this.http.get<Card[]>('/api/cards');
  }

  getPlayersExchangingCard(cardId: number, server: Server) {
    return this.http.get<CardExchangePlayers>(`/api/cards/${cardId}/exchange-players`,
    {
      params: {
        server,
      },
    });
  }
}
