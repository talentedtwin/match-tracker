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
  venue: "home" | "away";
  notes?: string;
  selectedPlayerIds: string[];
  playerStats: PlayerStat[];
  team?: Team;
}

export interface ScheduledMatch {
  id: string;
  opponent: string;
  date: string;
  matchType: "league" | "cup";
  venue: "home" | "away";
  notes?: string;
  selectedPlayerIds: string[];
  isFinished: boolean;
  team?: Team;
}

export interface TeamScore {
  for: number;
  against: number;
}
