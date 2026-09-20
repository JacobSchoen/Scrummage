import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Participant } from '../../models/models';

@Component({
  imports: [CommonModule],
  selector: 'app-participant-card',
  styleUrl: './participant-card.css',
  templateUrl: './participant-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParticipantCard {
  participant = input.required<Participant>();
  revealed = input<boolean>(false);
}
