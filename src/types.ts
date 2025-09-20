export interface Team {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Player {
  id: string;
  name: string;
  goals: number;
  assists: number;
  teamId?: string;
  team?: Team;
}

export interface PlayerStat {
  playerId: string;
  playerName: string;
  goals: number;
  assists: number;
}

export interface Match {
  id: string;
  opponent: string;
  date: string;
  goalsFor: number;
  goalsAgainst: number;
  isFinished: boolean;
  matchType: "league" | "cup";
  notes?: string;
  selectedPlayerIds: string[];
  playerStats: PlayerStat[];
}

export interface ScheduledMatch {
  id: string;
  opponent: string;
  date: string;
  matchType: "league" | "cup";
  notes?: string;
  selectedPlayerIds: string[];
  isFinished: boolean;
}

export interface TeamScore {
  for: number;
  against: number;
}
