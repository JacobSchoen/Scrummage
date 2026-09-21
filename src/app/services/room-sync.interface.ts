import { Signal } from '@angular/core';
import { Room, VoteValue } from '../models/models';


export abstract class RoomSyncService {
  abstract readonly room: Signal<Room | null>;

  abstract readonly myParticipantId: Signal<string | null>;

  abstract createRoom(name: string, currentTicket: string, scale?: VoteValue[],): Promise<string>;
  abstract joinRoom(roomId: string, name: string): Promise<void>;
  abstract submitVote(value: VoteValue | null): void;
  abstract revealVotes(): void;
  abstract startNewRound(ticket?: string): void;
  abstract leaveRoom(): void;
}