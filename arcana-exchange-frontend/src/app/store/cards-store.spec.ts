import { TestBed } from '@angular/core/testing';

import { CardsStore } from './cards-store';

describe('CardsStore', () => {
  let service: CardsStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardsStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
