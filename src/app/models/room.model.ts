import { Participant } from "./models";

interface Room {
  id: string;              // shareable room code, e.g. "ABC123"
  name: string;
  hostId: string;           // participantId of whoever created it
  votingScale: VoteValue[]; // e.g. [1,2,3,5,8,13,'☕','❓']
  status: 'voting' | 'revealed';
  participants: Participant[];
  currentTicket?: string;   // optional: "PROJ-123" label for what's being voted on
  history: RoundResult[];
  createdAt: number;
}

type VoteValue = number | '☕' | '❓';
