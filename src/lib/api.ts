// API utility functions for the Match Tracker application

const API_BASE = "/api";

// Types for API responses
export interface ApiTeam {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  players?: ApiPlayer[];
}

export interface ApiPlayer {
  id: string;
  name: string;
  goals: number;
  assists: number;
  userId: string;
  teamId?: string;
  team?: ApiTeam;
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
  teamId?: string;
  team?: ApiTeam;
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
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
}

// Player API functions
export const playerApi = {
  async getAll(): Promise<ApiPlayer[]> {
    const response = await fetch(`${API_BASE}/players`, {
      credentials: "include",
    });
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Authentication required");
      }
      throw new Error("Failed to fetch players");
    }
    return response.json();
  },

  async create(name: string, teamId?: string): Promise<ApiPlayer> {
    const response = await fetch(`${API_BASE}/players`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, teamId }),
    });
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Authentication required");
      }
      throw new Error("Failed to create player");
    }
    return response.json();
  },

  async update(
    id: string,
    data: Partial<{
      name: string;
      goals: number;
      assists: number;
      teamId: string | null;
    }>
  ): Promise<ApiPlayer> {
    const response = await fetch(`${API_BASE}/players/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update player");
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/players/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to delete player");
  },
};

// Match API functions
export const matchApi = {
  async getAll(): Promise<ApiMatch[]> {
    const response = await fetch(`${API_BASE}/matches`, {
      credentials: "include",
    });
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
    playerStats?: Array<{ playerId: string; goals?: number; assists?: number }>;
  }): Promise<ApiMatch> {
    const response = await fetch(`${API_BASE}/matches`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to create match");
    return response.json();
  },

  async update(id: string, data: Partial<ApiMatch>): Promise<ApiMatch> {
    const response = await fetch(`${API_BASE}/matches/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to update match");
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/matches/${id}`, {
      method: "DELETE",
      credentials: "include",
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

    const response = await fetch(`${API_BASE}/player-match-stats?${params}`, {
      credentials: "include",
    });
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
      credentials: "include",
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
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to update player match stat");
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/player-match-stats/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to delete player match stat");
  },
};

// User API functions
export const userApi = {
  async getAll(): Promise<ApiUser[]> {
    const response = await fetch(`${API_BASE}/users`, {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch users");
    return response.json();
  },

  async create(data: { email: string; name?: string }): Promise<ApiUser> {
    const response = await fetch(`${API_BASE}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to create user");
    return response.json();
  },

  async getById(id: string): Promise<ApiUser> {
    const response = await fetch(`${API_BASE}/users/${id}`, {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch user");
    return response.json();
  },
};

// Team API functions
export const teamApi = {
  async getAll(): Promise<ApiTeam[]> {
    const response = await fetch(`${API_BASE}/teams`, {
      credentials: "include",
    });
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Authentication required");
      }
      throw new Error("Failed to fetch teams");
    }
    return response.json();
  },

  async create(name: string): Promise<ApiTeam> {
    const response = await fetch(`${API_BASE}/teams`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name }),
    });
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Authentication required");
      }
      if (response.status === 403) {
        throw new Error("Premium subscription required for multiple teams");
      }
      throw new Error("Failed to create team");
    }
    return response.json();
  },

  async update(id: string, data: Partial<ApiTeam>): Promise<ApiTeam> {
    const response = await fetch(`${API_BASE}/teams/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update team");
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/teams/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to delete team");
  },

  async getById(id: string): Promise<ApiTeam> {
    const response = await fetch(`${API_BASE}/teams/${id}`, {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch team");
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
    const response = await fetch(`${API_BASE}/stats?userId=${userId}`, {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch stats");
    return response.json();
  },
};
