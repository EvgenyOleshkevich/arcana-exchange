import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CardsStore } from './store/cards-store';
import { NavbarComponent } from './utils/navbar/navbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly cardsStore = inject(CardsStore);
  protected readonly title = signal('arcana-exchange-frontend');

  ngOnInit() {
    this.cardsStore.loadCards();
  }
}
