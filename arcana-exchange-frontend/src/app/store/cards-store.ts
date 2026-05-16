import { computed, inject, Injectable, signal } from '@angular/core';
import { CardService } from '../services/card-service';
import { Card } from '../model/card';
import { finalize } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CardsStore {
  private readonly cardService = inject(CardService);

  readonly cards = signal<Card[]>([]);
  readonly loading = signal(false);
  readonly loaded = signal(false);
  readonly error = signal<string | null>(null);
  readonly cardsMap = computed(() =>
    new Map(
      this.cards().map(card => [card.cardId, card])
    )
  );

  loadCards() {
    if (this.loaded()) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.cardService.getCards()
      .pipe(
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: cards => {
          this.cards.set(cards);
          this.loaded.set(true);
        },

        error: err => {
          console.error(err);
          this.error.set(err.error?.message ?? 'Failed to load cards');
        },
      });
  }

  getCardById(cardId: number): Card | null {
    return this.cardsMap().get(cardId) ?? null;
  }
}
