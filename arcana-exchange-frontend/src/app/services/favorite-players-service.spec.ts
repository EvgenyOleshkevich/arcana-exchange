import { TestBed } from '@angular/core/testing';

import { FavoritePlayersService } from './favorite-players-service';

describe('FavoritePlayersService', () => {
  let service: FavoritePlayersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoritePlayersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
