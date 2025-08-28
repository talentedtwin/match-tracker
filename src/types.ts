export interface Player {
  id: string;
  name: string;
  goals: number;
  assists: number;
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
  playerStats: PlayerStat[];
}

export interface TeamScore {
  for: number;
  against: number;
}
