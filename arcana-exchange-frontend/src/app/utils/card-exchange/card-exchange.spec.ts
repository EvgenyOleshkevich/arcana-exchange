import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardExchange } from './card-exchange';

describe('CardExchange', () => {
  let component: CardExchange;
  let fixture: ComponentFixture<CardExchange>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardExchange],
    }).compileComponents();

    fixture = TestBed.createComponent(CardExchange);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
