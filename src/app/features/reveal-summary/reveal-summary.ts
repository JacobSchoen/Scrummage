import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-reveal-summary',
  styleUrl: './reveal-summary.css',
  templateUrl: './reveal-summary.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RevealSummary {
  round = input.required<RoundResult>();
}
