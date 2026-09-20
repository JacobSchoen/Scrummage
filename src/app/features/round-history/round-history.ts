import { Component, computed, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-round-history',
  styleUrl: './round-history.css',
  templateUrl: './round-history.html',
})
export class RoundHistory {
  rounds = input.required<RoundResult[]>();
  
  /**
   * Most recent round first, with a display index (1-based, oldest = 1)
   * attached — computed rather than storing an index on RoundResult itself,
   * since "which round number was this" is a view concern, not data the
   * model needs to carry.
   */
  protected orderedRounds = computed(() =>
    this.rounds()
      .map((round, i) => ({ ...round, index: i + 1 }))
      .reverse()
  );
}
