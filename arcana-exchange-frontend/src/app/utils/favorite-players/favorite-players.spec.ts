import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoritePlayers } from './favorite-players';

describe('FavoritePlayers', () => {
  let component: FavoritePlayers;
  let fixture: ComponentFixture<FavoritePlayers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoritePlayers],
    }).compileComponents();

    fixture = TestBed.createComponent(FavoritePlayers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
