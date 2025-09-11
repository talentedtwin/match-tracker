// API utility functions for the Match Tracker application

const API_BASE = "/api";

// Types for API responses
export interface ApiPlayer {
  id: string;
  name: string;
  goals: number;
  assists: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiMatch {
  id: string;
  opponent: string;
  date: string;
  goalsFor: number;
  goalsAgainst: number;
  isFinished: boolean;
  matchType: string;
  notes?: string;
  selectedPlayerIds: string[];
  userId: string;
  playerStats: ApiPlayerMatchStat[];
}

export interface ApiPlayerMatchStat {
  id: string;
  goals: number;
  assists: number;
  playerId: string;
  matchId: string;
  player: ApiPlayer;
  match: ApiMatch;
}

export interface ApiUser {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  updatedAt: string;
}

// Player API functions
export const playerApi = {
  async getAll(userId: string): Promise<ApiPlayer[]> {
    const response = await fetch(
      `${API_BASE}/players?userId=${encodeURIComponent(userId)}`
    );
    if (!response.ok) throw new Error("Failed to fetch players");
    return response.json();
  },

  async create(name: string, userId: string): Promise<ApiPlayer> {
    const response = await fetch(`${API_BASE}/players`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, userId }),
    });
    if (!response.ok) throw new Error("Failed to create player");
    return response.json();
  },

  async update(id: string, data: Partial<ApiPlayer>): Promise<ApiPlayer> {
    const response = await fetch(`${API_BASE}/players/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update player");
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/players/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete player");
  },
};

// Match API functions
export const matchApi = {
  async getAll(): Promise<ApiMatch[]> {
    const response = await fetch(`${API_BASE}/matches`);
    if (!response.ok) throw new Error("Failed to fetch matches");
    return response.json();
  },

  async create(data: {
    opponent: string;
    date?: string;
    goalsFor?: number;
    goalsAgainst?: number;
    matchType?: string;
    notes?: string;
    selectedPlayerIds?: string[];
    isFinished?: boolean;
    userId: string;
    playerStats?: Array<{ playerId: string; goals?: number; assists?: number }>;
  }): Promise<ApiMatch> {
    const response = await fetch(`${API_BASE}/matches`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create match");
    return response.json();
  },

  async update(id: string, data: Partial<ApiMatch>): Promise<ApiMatch> {
    const response = await fetch(`${API_BASE}/matches/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update match");
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/matches/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete match");
  },
};

// Player Match Stats API functions
export const playerMatchStatsApi = {
  async getAll(
    matchId?: string,
    playerId?: string
  ): Promise<ApiPlayerMatchStat[]> {
    const params = new URLSearchParams();
    if (matchId) params.append("matchId", matchId);
    if (playerId) params.append("playerId", playerId);

    const response = await fetch(`${API_BASE}/player-match-stats?${params}`);
    if (!response.ok) throw new Error("Failed to fetch player match stats");
    return response.json();
  },

  async create(data: {
    playerId: string;
    matchId: string;
    goals?: number;
    assists?: number;
  }): Promise<ApiPlayerMatchStat> {
    const response = await fetch(`${API_BASE}/player-match-stats`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create player match stat");
    return response.json();
  },

  async update(
    id: string,
    data: { goals?: number; assists?: number }
  ): Promise<ApiPlayerMatchStat> {
    const response = await fetch(`${API_BASE}/player-match-stats/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update player match stat");
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/player-match-stats/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete player match stat");
  },
};

// User API functions
export const userApi = {
  async getAll(): Promise<ApiUser[]> {
    const response = await fetch(`${API_BASE}/users`);
    if (!response.ok) throw new Error("Failed to fetch users");
    return response.json();
  },

  async create(data: { email: string; name?: string }): Promise<ApiUser> {
    const response = await fetch(`${API_BASE}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create user");
    return response.json();
  },

  async getById(id: string): Promise<ApiUser> {
    const response = await fetch(`${API_BASE}/users/${id}`);
    if (!response.ok) throw new Error("Failed to fetch user");
    return response.json();
  },
};

// Stats API functions
export const statsApi = {
  async getUserStats(userId: string): Promise<{
    overview: {
      totalMatches: number;
      wins: number;
      draws: number;
      losses: number;
      winRate: string;
    };
    players: {
      total: number;
      stats: Array<{
        playerId: string;
        playerName: string;
        totalGoals: number;
        totalAssists: number;
        matchesPlayed: number;
        goalsPerMatch: string;
        assistsPerMatch: string;
      }>;
    };
    topPerformers: {
      scorers: Array<{
        playerId: string;
        playerName: string;
        totalGoals: number;
        totalAssists: number;
        matchesPlayed: number;
        goalsPerMatch: string;
        assistsPerMatch: string;
      }>;
      assists: Array<{
        playerId: string;
        playerName: string;
        totalGoals: number;
        totalAssists: number;
        matchesPlayed: number;
        goalsPerMatch: string;
        assistsPerMatch: string;
      }>;
    };
  }> {
    const response = await fetch(`${API_BASE}/stats?userId=${userId}`);
    if (!response.ok) throw new Error("Failed to fetch stats");
    return response.json();
  },
};
