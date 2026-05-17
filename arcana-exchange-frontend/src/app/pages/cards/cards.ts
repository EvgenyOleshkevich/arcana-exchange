import { Component, inject, signal } from '@angular/core';
import { CardService } from '../../services/card-service';
import { CardExchangePlayers } from '../../model/CardExchangePlayers';
import { Server, servers } from '../../model/Enums';
import { CardListComponent } from '../../utils/card-list/card-list';
import { CardExchange } from '../../utils/card-exchange/card-exchange';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { I18nService } from '../../i18n/i18n.service';

@Component({
  selector: 'app-cards',
  imports: [CommonModule, FormsModule, CardListComponent, CardExchange],
  templateUrl: './cards.html',
  styleUrl: './cards.scss',
})
export class CardsComponent {
  private readonly cardService = inject(CardService);
  private readonly i18n = inject(I18nService);
  readonly t = this.i18n.t;
  readonly selectedCardId = signal<number | null>(null);
  readonly cardExchange = signal<CardExchangePlayers | null>(null);
  readonly errorLoadCardExchange = signal<string | null>(null);
  readonly selectedServer = signal<Server>(Server.Europe);

  readonly servers = servers;

  onLoadPlayersExchangingCard(cardId: number) {
    this.errorLoadCardExchange.set(null);

    this.cardService.getPlayersExchangingCard(cardId, this.selectedServer()).subscribe({
      next: (exchange) => {
        this.cardExchange.set(exchange);
        this.selectedCardId.set(cardId);
      },
      error: (err) => {
        console.error(err);
        this.errorLoadCardExchange.set(err.error?.message ?? 'unknown error');
      },
    });
  }

  onServerChange(server: Server) {
    this.selectedServer.set(server);
    const selectedCardId = this.selectedCardId();
    if (selectedCardId) {
      this.onLoadPlayersExchangingCard(selectedCardId);
    }
  }

  onCloseExchange() {
    this.selectedCardId.set(null);
    this.cardExchange.set(null);
  }
}
