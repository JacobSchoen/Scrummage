import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-reveal-summary',
  styleUrl: './reveal-summary.css',
  templateUrl: './reveal-summary.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RevealSummary {
  round = input.required<RoundResult>();

   /**
   * Percentage against an assumed max spread of 13 (top of the default
   * Fibonacci scale). This is a simplification for now — once the deck's
   * actual voting scale is threaded through here, this should be based on
   * that scale's real max value instead of a hardcoded constant.
   */
  protected chaosPercent = computed(() => {
    const pct = (this.round().spread / 13) * 100;
    return Math.round(Math.min(100, Math.max(0, pct)));
  });
}
