import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerMatchModal } from './player-match-modal';

describe('PlayerMatchModal', () => {
  let component: PlayerMatchModal;
  let fixture: ComponentFixture<PlayerMatchModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerMatchModal],
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerMatchModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
