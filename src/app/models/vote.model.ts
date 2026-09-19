interface RoundResult {
  ticket?: string;
  votes: { participantId: string; name: string; value: VoteValue }[];
  average: number | null;
  consensus: boolean;       // all votes matched
  spread: number;           // max - min, for the "chaos meter"
  revealedAt: number;
}
type VoteValue = number | '☕' | '❓';
