import { Injectable, signal } from '@angular/core';
import { RealtimeChannel } from '@supabase/supabase-js';
import { RoomSyncService } from './room-sync.interface';
import {
  DEFAULT_VOTING_SCALE,
  Participant,
  Room,
  RoundResult,
  VoteValue,
} from '../models/models';
import { supabase } from './SupabaseClient';

function randomId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

function randomRoomCode(): string {
  return Math.random().toString(36).slice(2, 7).toUpperCase();
}

function participantStorageKey(roomId: string): string {
  return `scrum-poker:participant:${roomId}`;
}

@Injectable({ providedIn: 'root' })
export class SupabaseRoomSyncService extends RoomSyncService {
  private readonly _room = signal<Room | null>(null);
  private readonly _myParticipantId = signal<string | null>(null);
  private channel: RealtimeChannel | null = null;

  readonly room = this._room.asReadonly();
  readonly myParticipantId = this._myParticipantId.asReadonly();

  async createRoom(name: string, scale: VoteValue[] = DEFAULT_VOTING_SCALE): Promise<string> {
    const hostId = randomId('p');
    const roomId = randomRoomCode();

    const host: Participant = {
      id: hostId,
      name,
      vote: null,
      hasVoted: false,
      isHost: true,
      badges: [],
    };

    const newRoom: Room = {
      id: roomId,
      name: `${name}'s room`,
      hostId,
      votingScale: scale,
      status: 'voting',
      participants: [host],
      history: [],
      createdAt: Date.now(),
    };

    const { error } = await supabase.from('rooms').insert({ id: roomId, data: newRoom });
    if (error) throw error;

    localStorage.setItem(participantStorageKey(roomId), hostId);
    this._myParticipantId.set(hostId);
    this._room.set(newRoom);
    this.subscribeToRoom(roomId);

    return roomId;
  }

  async joinRoom(roomId: string, name: string): Promise<void> {
    const { data: row, error: fetchError } = await supabase
      .from('rooms')
      .select('data')
      .eq('id', roomId)
      .single();

    if (fetchError || !row) {
      throw new Error(`No room found with id ${roomId}`);
    }

    const currentRoom = row.data as Room;

    const participant: Participant = {
      id: randomId('p'),
      name,
      vote: null,
      hasVoted: false,
      isHost: false,
      badges: [],
    };

    const updatedRoom: Room = {
      ...currentRoom,
      participants: [...currentRoom.participants, participant],
    };

    const { error: updateError } = await supabase
      .from('rooms')
      .update({ data: updatedRoom, updated_at: new Date().toISOString() })
      .eq('id', roomId);

    if (updateError) throw updateError;

    localStorage.setItem(participantStorageKey(roomId), participant.id);
    this._myParticipantId.set(participant.id);
    this._room.set(updatedRoom);
    this.subscribeToRoom(roomId);
  }

  submitVote(value: VoteValue | null): void {
    void this.updateRoom((room, myId) => {
      if (room.status !== 'voting') return room;
      return {
        ...room,
        participants: room.participants.map((p) =>
          p.id === myId ? { ...p, vote: value, hasVoted: value !== null } : p
        ),
      };
    });
  }

  revealVotes(): void {
    void this.updateRoom((room) => {
      if (room.status !== 'voting') return room;

      const votes = room.participants
        .filter((p) => p.hasVoted && p.vote !== null)
        .map((p) => ({ participantId: p.id, name: p.name, value: p.vote as VoteValue }));

      const numericVotes = votes.map((v) => v.value).filter((v): v is number => typeof v === 'number');

      const average = numericVotes.length
        ? Math.round((numericVotes.reduce((a, b) => a + b, 0) / numericVotes.length) * 10) / 10
        : null;

      const consensus = votes.length > 0 && votes.every((v) => v.value === votes[0].value);
      const spread = numericVotes.length ? Math.max(...numericVotes) - Math.min(...numericVotes) : 0;

      const result: RoundResult = {
        ticket: room.currentTicket,
        votes,
        average,
        consensus,
        spread,
        revealedAt: Date.now(),
      };

      return { ...room, status: 'revealed', history: [...room.history, result] };
    });
  }

  startNewRound(ticket?: string): void {
    void this.updateRoom((room) => ({
      ...room,
      status: 'voting',
      currentTicket: ticket,
      participants: room.participants.map((p) => ({ ...p, vote: null, hasVoted: false })),
    }));
  }

  leaveRoom(): void {
    this.channel?.unsubscribe();
    this.channel = null;
    this._room.set(null);
    this._myParticipantId.set(null);
  }

  /**
   * Read-modify-write helper: reads the freshest room from Supabase, applies
   * a pure updater, and writes the result back. This has a real race
   * condition — two people revealing/voting at the exact same instant could
   * clobber each other's writes, since there's no optimistic-concurrency
   * check (e.g. a version column + conditional update) here. Fine for a
   * portfolio demo's traffic level; worth naming as a known limitation and
   * a natural "what would you improve" answer in an interview.
   */
  private async updateRoom(updater: (room: Room, myId: string | null) => Room): Promise<void> {
    const roomId = this._room()?.id;
    if (!roomId) return;

    const { data: row, error: fetchError } = await supabase
      .from('rooms')
      .select('data')
      .eq('id', roomId)
      .single();

    if (fetchError || !row) return;

    const currentRoom = row.data as Room;
    const nextRoom = updater(currentRoom, this._myParticipantId());

    const { error: updateError } = await supabase
      .from('rooms')
      .update({ data: nextRoom, updated_at: new Date().toISOString() })
      .eq('id', roomId);

    if (updateError) console.error('Failed to update room', updateError);
    // Note: we don't set this._room(nextRoom) here — we let the realtime
    // subscription below be the single path that updates local state, so
    // every tab (including this one) stays in sync through the same
    // mechanism rather than having two different update paths to keep
    // consistent.
  }

  private subscribeToRoom(roomId: string): void {
    this.channel?.unsubscribe();

    this.channel = supabase
      .channel(`room-${roomId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'rooms', filter: `id=eq.${roomId}` },
        (payload) => {
          this._room.set(payload.new['data'] as Room);
        }
      )
      .subscribe();
  }
}