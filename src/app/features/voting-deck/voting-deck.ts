import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-voting-deck',
  styleUrl: './voting-deck.css',
  templateUrl: './voting-deck.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VotingDeck {
  scale = input.required<VoteValue[]>();
  disabled = input<boolean>(false);

  /**
   * Locally-selected value, purely for highlighting the chosen card.
   * The parent/service is still the actual source of truth for whether the
   * vote was submitted — this signal just drives the UI.
   */
  selectedValue = signal<VoteValue | null>(null);

  voteSelected = output<VoteValue | null>();

  /**
   * Distributes rotation evenly across an arc so the fan looks right
   * whichever voting scale is passed in — a fixed set of hardcoded
   * nth-child angles (fine for the static mockup's 8 cards) would break
   * the moment someone used a shorter or longer scale.
   */
  protected fanAngle(index: number, total: number): number {
    if (total <= 1) return 0;
    const maxStepDeg = 8;
    const step = Math.min(maxStepDeg, 36 / (total - 1));
    return (index - (total - 1) / 2) * step;
  }

  onSelect(value: VoteValue): void {
    if (this.disabled()) return;
    if (this.selectedValue() !== value) {
      this.selectedValue.set(value);
      this.voteSelected.emit(value);
    } else {
      this.selectedValue.set(null);
      this.voteSelected.emit(null);
    }

  }
}
