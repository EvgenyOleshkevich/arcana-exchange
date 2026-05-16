import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Card } from '../model/card';

@Injectable({ providedIn: 'root' })
export class CardService {
  private readonly http = inject(HttpClient);

  getCards() {
    return this.http.get<Card[]>('/api/cards');
  }
}
