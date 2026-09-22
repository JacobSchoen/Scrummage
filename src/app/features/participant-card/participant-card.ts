import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
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
  
  /**
   * Built as one computed string rather than several [class.x] bindings —
   * Angular's binding-name parser doesn't play nicely with slashes/brackets
   * in a property-binding key (e.g. [class.border-white/20]), and this way
   * each full class name still appears literally in this file for
   * Tailwind's build-time scanner to pick up.
   */
  protected tokenClasses = computed(() => {
    if (this.revealed()) {
      return 'border-gold shadow-[0_0_18px_rgb(255_204_51_/_0.4)] scale-110';
    }
    if (this.participant().hasVoted) {
      return 'border-mint shadow-[0_0_14px_rgb(123_255_138_/_0.35)]';
    }
    return 'border-dashed border-white/20';
  });

}
