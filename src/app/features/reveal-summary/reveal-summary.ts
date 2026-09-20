import { Component, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-reveal-summary',
  styleUrl: './reveal-summary.css',
  templateUrl: './reveal-summary.html',
})
export class RevealSummary {
  round = input.required<RoundResult>();
}
