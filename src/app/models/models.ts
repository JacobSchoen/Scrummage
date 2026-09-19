export type VoteValue = number | '☕' | '❓';

export type BadgeType = 'optimist' | 'doomsayer' | 'fence-sitter';

export interface Participant {
  id: string;
  name: string;
  vote: VoteValue | null;   // hydrated locally once revealed; null pre-reveal or if not voted
  hasVoted: boolean;
  isHost: boolean;
  badges: BadgeType[];
}

export interface RoundResult {
  ticket?: string;
  votes: { participantId: string; name: string; value: VoteValue }[];
  average: number | null;
  consensus: boolean;
  spread: number;
  revealedAt: number;
}

export interface Room {
  id: string;
  name: string;
  hostId: string;
  votingScale: VoteValue[];
  status: 'voting' | 'revealed';
  participants: Participant[];
  currentTicket?: string;
  history: RoundResult[];
  createdAt: number;
}

export const DEFAULT_VOTING_SCALE: VoteValue[] = [1, 2, 3, 5, 8, 13, '☕', '❓'];