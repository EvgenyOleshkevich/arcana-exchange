import { Component, inject, signal } from '@angular/core';
import { CardService } from '../../services/card-service';
import { CardExchangePlayers } from '../../model/CardExchangePlayers';
import { Server, servers } from '../../model/Enums';
import { CardListComponent } from '../../utils/card-list/card-list';
import { CardExchange } from '../../utils/card-exchange/card-exchange';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cards',
  imports: [CommonModule, FormsModule, CardListComponent, CardExchange],
  templateUrl: './cards.html',
  styleUrl: './cards.scss',
})
export class CardsComponent {
  private readonly cardService = inject(CardService);
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
  }

  onCloseExchange() {
    this.selectedCardId.set(null);
    this.cardExchange.set(null);
  }
}
