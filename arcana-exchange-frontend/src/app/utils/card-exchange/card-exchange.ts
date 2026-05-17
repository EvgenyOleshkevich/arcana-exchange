import { Component, computed, EventEmitter, inject, input, Input, Output, signal } from '@angular/core';
import { CardExchangePlayers } from '../../model/CardExchangePlayers';
import { CardsStore } from '../../store/cards-store';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../i18n/i18n.service';
import { Card } from '../../model/card';

@Component({
  selector: 'app-card-exchange',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './card-exchange.html',
  styleUrl: './card-exchange.scss',
})
export class CardExchange {
  private readonly i18n = inject(I18nService);
  readonly t = this.i18n.t;
  private readonly cardsStore = inject(CardsStore);
  readonly exchange = input.required<CardExchangePlayers>();
  readonly cardId = input.required<number>();

  @Output() readonly close = new EventEmitter<void>();

  readonly offersSelected = signal<boolean>(true);


  readonly card = computed(() => this.cardsStore.getCardById(this.cardId()));

  onOfferedBy() {
    this.offersSelected.set(true);
  }

  onWantedBy() {
    this.offersSelected.set(false);
  }

  onClose() {
    this.close.emit();
  }

  cardName(card: Card) {
    return this.i18n.cardName(card);
  }
}
