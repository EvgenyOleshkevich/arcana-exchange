import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CardsStore } from '../../store/cards-store';
import { Card } from '../../model/card';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../i18n/i18n.service';

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-list.html',
  styleUrl: './card-list.scss',
})
export class CardListComponent {
  private readonly i18n = inject(I18nService);
  readonly t = this.i18n.t;
  private readonly cardsStore = inject(CardsStore);
  readonly cards = this.cardsStore.cards;
  @Input() playerCards: ReadonlyMap<number, number> | null = null;

  @Output() cardSelected = new EventEmitter<number>();

  onSelectCard(card: Card) {
    this.cardSelected.emit(card.cardId);
  }

  cardName(card: Card) {
    return this.i18n.cardName(card);
  }
}
