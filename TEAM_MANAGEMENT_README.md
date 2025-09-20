# Team Management Feature Implementation

This document outlines the implementation of the team management feature that replaces the simple players page.

## What's Been Implemented

### 1. Database Schema Changes

- Added `Team` model with encrypted team names
- Added `isPremium` field to `User` model
- Added `teamId` reference to `Player` model
- Added `teamId` reference to `Match` model (for future use)

### 2. API Endpoints

- **Teams API** (`/api/teams`):
  - GET: List user's teams
  - POST: Create new team (with premium limit enforcement)
- **Individual Team API** (`/api/teams/[id]`):
  - GET: Get specific team
  - PUT: Update team name
  - DELETE: Delete team
- **Enhanced Players API**:
  - Now supports `teamId` in POST and PUT requests

### 3. Frontend Components

- **TeamManagement Component**: Main component for managing teams and players
  - Create/edit/delete teams
  - Assign/unassign players to teams
  - Premium subscription prompts
- **Updated Navigation**: "Players" renamed to "Teams"
- **Team Management Page**: Replaces the old players page

### 4. Premium Feature Implementation

- Free users: Limited to 1 team
- Premium users: Unlimited teams
- Paywall UI with upgrade prompts

### 5. Hooks and Services

- **useTeams hook**: Team management functionality
- **Enhanced usePlayer hook**: Now supports team assignment
- **Updated PlayerService**: Supports teamId in creation and updates
- **Database utilities**: Team CRUD operations

## Database Migration Required

Before this feature can be used, you need to run:

```bash
npx prisma migrate dev --name add-teams-and-premium
```

This will create the necessary database tables and columns.

## Features

### Team Management

1. **Create Teams**: Users can create teams with custom names
2. **Edit Teams**: Team names can be updated
3. **Delete Teams**: Teams can be removed (players become unassigned)
4. **Premium Limits**: Free users limited to 1 team

### Player Management

1. **Team Assignment**: Players can be assigned to specific teams
2. **Unassigned Players**: Players without teams are shown separately
3. **Team Transfer**: Players can be moved between teams
4. **Bulk Operations**: Easy assignment via dropdowns

### Premium Features

1. **Multiple Teams**: Premium users can create unlimited teams
2. **Upgrade Prompts**: Clear calls-to-action for free users
3. **Feature Gating**: Prevents free users from exceeding limits

## Technical Implementation

### Security

- Team names are encrypted using the existing encryption service
- Row-level security ensures users only see their own teams
- Premium status verification on server-side

### Performance

- Efficient database queries with proper indexes
- Client-side state management with optimistic updates
- Error handling and loading states

### User Experience

- Intuitive team and player management interface
- Clear visual hierarchy between teams and unassigned players
- Responsive design for mobile and desktop

## Next Steps

1. **Database Migration**: Run the Prisma migration
2. **Premium Integration**: Connect to actual payment system
3. **Match Integration**: Associate matches with specific teams
4. **Enhanced Statistics**: Team-based analytics and reporting
5. **Team Sharing**: Potential multi-user team management

## Configuration

The feature uses the following environment variables:

- Existing database configuration
- Existing encryption keys
- Premium status (currently mocked as `false`)

## Testing

To test the feature:

1. Run the database migration
2. Start the development server
3. Navigate to the "Teams" page (formerly "Players")
4. Create a team and add players
5. Try to create a second team to see premium limit

## File Changes

### New Files

- `src/components/TeamManagement.tsx`
- `src/app/api/teams/route.ts`
- `src/app/api/teams/[id]/route.ts`

### Modified Files

- `prisma/schema.prisma`
- `src/types.ts`
- `src/lib/api.ts`
- `src/lib/db-utils.ts`
- `src/lib/playerService.ts`
- `src/hooks/useApi.ts`
- `src/app/players/page.tsx`
- `src/components/Navigation.tsx`
- `src/app/api/players/route.ts`
- `src/app/api/players/[id]/route.ts`
