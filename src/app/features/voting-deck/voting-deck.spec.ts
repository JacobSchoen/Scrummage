import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VotingDeck } from './voting-deck';

describe('VotingDeck', () => {
  let component: VotingDeck;
  let fixture: ComponentFixture<VotingDeck>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VotingDeck],
    }).compileComponents();

    fixture = TestBed.createComponent(VotingDeck);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
