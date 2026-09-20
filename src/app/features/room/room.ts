import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RoomSyncService } from '../../services/room-sync.interface';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ParticipantCard } from '../participant-card/participant-card';
import { Participant } from '../../models/models';
import { VotingDeck } from '../voting-deck/voting-deck';
import { RevealSummary } from '../reveal-summary/reveal-summary';
import { RoundHistory } from '../round-history/round-history';

@Component({
  imports: [CommonModule, ParticipantCard, VotingDeck, RevealSummary, RoundHistory],
  selector: 'app-room',
  styleUrl: './room.css',
  templateUrl: './room.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Room {
  protected sync = inject(RoomSyncService);
  protected roomId = inject(ActivatedRoute).snapshot.paramMap.get('id');

  isHost = computed(() => {
    const room = this.sync.room();
    const myId = this.sync.myParticipantId();

    return !!room && !!myId && room.hostId === myId;
  })

  /**
   * The most recently revealed round. We read this off room.history rather
   * than recomputing average/consensus/spread here, since the service
   * already produces that on reveal (see FakeRoomSyncService.revealVotes).
   * One source of truth for the stats — a real backend would compute and
   * send this the same way, so the component shouldn't duplicate the math.
   */
  protected latestRound = computed(() => {
    const room = this.sync.room();
    if (!room || room.history.length === 0) return null;
    return room.history[room.history.length - 1];
  });

  /**
   * Masks vote values for everyone except me, pre-reveal. This matters even
   * though the fake service already only shows a checkmark in the UI — the
   * underlying Room object still carries every real vote value in memory,
   * which is fine on a fake local service but would be a genuine data leak
   * on a real backend (anyone could read it out of the network payload or
   * devtools). Doing the masking here, at the component boundary, is a
   * stand-in for what a real server should be doing: never sending the
   * value in the first place pre-reveal.
   */
  protected maskedParticipants = computed<Participant[]>(() => {
    const room = this.sync.room();
    if (!room) return [];
    const myId = this.sync.myParticipantId();
    const revealed = room.status === 'revealed';
 
    return room.participants.map((p) =>
      revealed || p.id === myId ? p : { ...p, vote: null }
    );
  });
 
  onVoteSelected(value: VoteValue | null): void {
    this.sync.submitVote(value);
  }

  onReveal(): void {
    this.sync.revealVotes();
  }

  onNewRound(): void {
    this.sync.startNewRound();
  }

}
