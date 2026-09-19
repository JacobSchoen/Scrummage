interface Participant {
  id: string;               // random guest id, stored in localStorage
  name: string;
  vote: VoteValue | null;   // null = hasn't voted yet
  hasVoted: boolean;        // derived, but handy to send explicitly (hide value pre-reveal)
  isHost: boolean;
  badges: BadgeType[];      // 'optimist' | 'doomsayer' | 'fence-sitter' etc.
}

type VoteValue = number | '☕' | '❓';

export type BadgeType = 'optimist' | 'doomsayer' | 'fence-sitter';
