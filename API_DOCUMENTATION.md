# Match Tracker API Documentation

This document outlines all the API endpoints available for the Match Tracker application.

## Base URL

All API endpoints are prefixed with `/api`

## Authentication

Currently, all endpoints are open. In production, you should implement proper authentication and pass `userId` in requests.

---

## Players API

### GET /api/players

Get all players

**Response:**

```json
[
  {
    "id": "string",
    "name": "string",
    "goals": 0,
    "assists": 0,
    "userId": "string",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### POST /api/players

Create a new player

**Request Body:**

```json
{
  "name": "John Doe",
  "userId": "user-id"
}
```

### GET /api/players/[id]

Get a specific player with match statistics

**Response:**

```json
{
  "id": "string",
  "name": "string",
  "goals": 0,
  "assists": 0,
  "userId": "string",
  "matchStats": [
    {
      "id": "string",
      "goals": 2,
      "assists": 1,
      "match": {
        "id": "string",
        "opponent": "Rival FC",
        "date": "2024-01-01T00:00:00.000Z"
      }
    }
  ]
}
```

### PUT /api/players/[id]

Update a player

**Request Body:**

```json
{
  "name": "Updated Name",
  "goals": 5,
  "assists": 3
}
```

### DELETE /api/players/[id]

Delete a player

---

## Matches API

### GET /api/matches

Get all matches with player statistics

**Response:**

```json
[
  {
    "id": "string",
    "opponent": "Rival FC",
    "date": "2024-01-01T00:00:00.000Z",
    "goalsFor": 3,
    "goalsAgainst": 1,
    "isFinished": true,
    "userId": "string",
    "playerStats": [
      {
        "id": "string",
        "goals": 2,
        "assists": 1,
        "player": {
          "id": "string",
          "name": "John Doe"
        }
      }
    ]
  }
]
```

### POST /api/matches

Create a new match

**Request Body:**

```json
{
  "opponent": "Rival FC",
  "date": "2024-01-01T00:00:00.000Z",
  "goalsFor": 3,
  "goalsAgainst": 1,
  "userId": "user-id",
  "playerStats": [
    {
      "playerId": "player-id",
      "goals": 2,
      "assists": 1
    }
  ]
}
```

### GET /api/matches/[id]

Get a specific match

### PUT /api/matches/[id]

Update a match

**Request Body:**

```json
{
  "opponent": "Updated Opponent",
  "goalsFor": 4,
  "goalsAgainst": 2,
  "isFinished": true,
  "playerStats": [
    {
      "playerId": "player-id",
      "goals": 3,
      "assists": 1
    }
  ]
}
```

### DELETE /api/matches/[id]

Delete a match

---

## Player Match Stats API

### GET /api/player-match-stats

Get player match statistics

**Query Parameters:**

- `matchId` - Filter by match
- `playerId` - Filter by player

**Response:**

```json
[
  {
    "id": "string",
    "goals": 2,
    "assists": 1,
    "playerId": "string",
    "matchId": "string",
    "player": {
      "id": "string",
      "name": "John Doe"
    },
    "match": {
      "id": "string",
      "opponent": "Rival FC",
      "date": "2024-01-01T00:00:00.000Z"
    }
  }
]
```

### POST /api/player-match-stats

Create player match statistics

**Request Body:**

```json
{
  "playerId": "player-id",
  "matchId": "match-id",
  "goals": 2,
  "assists": 1
}
```

### GET /api/player-match-stats/[id]

Get specific player match statistics

### PUT /api/player-match-stats/[id]

Update player match statistics

**Request Body:**

```json
{
  "goals": 3,
  "assists": 2
}
```

### DELETE /api/player-match-stats/[id]

Delete player match statistics

---

## Statistics API

### GET /api/stats

Get comprehensive statistics for a user

**Query Parameters:**

- `userId` - Required user ID

**Response:**

```json
{
  "overview": {
    "totalMatches": 10,
    "wins": 7,
    "draws": 2,
    "losses": 1,
    "winRate": "70.0"
  },
  "players": {
    "total": 15,
    "stats": [
      {
        "playerId": "string",
        "playerName": "John Doe",
        "totalGoals": 12,
        "totalAssists": 8,
        "matchesPlayed": 10,
        "goalsPerMatch": "1.20",
        "assistsPerMatch": "0.80"
      }
    ]
  },
  "topPerformers": {
    "scorers": [...],
    "assists": [...]
  }
}
```

---

## Users API

### GET /api/users

Get all users (admin use)

### POST /api/users

Create a new user

**Request Body:**

```json
{
  "email": "user@example.com",
  "name": "User Name"
}
```

### GET /api/users/[id]

Get a specific user with all their data

### PUT /api/users/[id]

Update a user

### DELETE /api/users/[id]

Delete a user

---

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `409` - Conflict (duplicate)
- `500` - Internal Server Error

Error responses include:

```json
{
  "error": "Error message description"
}
```

## Usage Examples

### JavaScript/TypeScript

```javascript
// Get all players
const players = await fetch("/api/players").then((r) => r.json());

// Create a new player
const newPlayer = await fetch("/api/players", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "John Doe", userId: "user-123" }),
}).then((r) => r.json());

// Get match statistics
const stats = await fetch("/api/stats?userId=user-123").then((r) => r.json());
```

### React Hook Example

```javascript
import { useState, useEffect } from "react";

function usePlayers(userId) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/players")
      .then((res) => res.json())
      .then((data) => {
        setPlayers(data);
        setLoading(false);
      });
  }, []);

  const addPlayer = async (name) => {
    const response = await fetch("/api/players", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, userId }),
    });
    const newPlayer = await response.json();
    setPlayers([...players, newPlayer]);
  };

  return { players, loading, addPlayer };
}
```
