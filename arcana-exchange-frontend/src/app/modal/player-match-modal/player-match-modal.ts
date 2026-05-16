import { Component, computed, EventEmitter, inject, Input, Output } from '@angular/core';
import { PlayerMatch } from '../../model/PlayerMatch';
import { CardsStore } from '../../store/cards-store';

@Component({
  selector: 'app-player-match-modal',
  standalone: true,
  imports: [],
  templateUrl: './player-match-modal.html',
  styleUrl: './player-match-modal.scss',
})
export class PlayerMatchModal {
  private readonly cardsStore = inject(CardsStore);
  @Input({ required: true }) match!: PlayerMatch;
  @Output() close = new EventEmitter<void>();

  readonly cardsYouCanGive = computed(() => this.match.cardsYouCanGive.map(cardId => this.cardsStore.getCardById(cardId)).filter(card => card !== null));
  readonly cardsYouCanReceive = computed(() => this.match.cardsYouCanReceive.map(cardId => this.cardsStore.getCardById(cardId)).filter(card => card !== null));

  onCloseModal() {
    this.close.emit();
  }
}
