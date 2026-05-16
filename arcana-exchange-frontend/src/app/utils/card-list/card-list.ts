import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CardsStore } from '../../store/cards-store';
import { Card } from '../../model/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-list.html',
  styleUrl: './card-list.scss',
})
export class CardListComponent {
  private readonly cardsStore = inject(CardsStore);
  readonly cards = this.cardsStore.cards;
  @Input() playerCards: ReadonlyMap<number, number> | null = null;

  @Output() cardSelected = new EventEmitter<number>();

  onSelectCard(card: Card) {
    this.cardSelected.emit(card.cardId);
  }
}
