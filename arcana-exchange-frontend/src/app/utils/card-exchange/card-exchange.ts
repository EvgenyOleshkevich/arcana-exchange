import { Component, computed, EventEmitter, inject, input, Input, Output, signal } from '@angular/core';
import { CardExchangePlayers } from '../../model/CardExchangePlayers';
import { CardsStore } from '../../store/cards-store';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-card-exchange',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './card-exchange.html',
  styleUrl: './card-exchange.scss',
})
export class CardExchange {
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
}
