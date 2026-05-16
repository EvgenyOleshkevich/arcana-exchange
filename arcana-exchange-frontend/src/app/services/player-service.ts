import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Card } from '../model/card';
import { Player } from '../model/player';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  private readonly http = inject(HttpClient);

  getCards() {
    return this.http.get<Player[]>('/api/cards');
  }
}
