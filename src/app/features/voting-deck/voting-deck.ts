import { Component, input, output, signal } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-voting-deck',
  styleUrl: './voting-deck.css',
  templateUrl: './voting-deck.html',
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
