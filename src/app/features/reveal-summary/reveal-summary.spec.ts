import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RevealSummary } from './reveal-summary';

describe('RevealSummary', () => {
  let component: RevealSummary;
  let fixture: ComponentFixture<RevealSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RevealSummary],
    }).compileComponents();

    fixture = TestBed.createComponent(RevealSummary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
