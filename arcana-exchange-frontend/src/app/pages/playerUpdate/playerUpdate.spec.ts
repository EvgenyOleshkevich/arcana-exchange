import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerUpdateComponent } from './playerUpdate';

describe('Profile', () => {
  let component: PlayerUpdateComponent;
  let fixture: ComponentFixture<PlayerUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerUpdateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerUpdateComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
