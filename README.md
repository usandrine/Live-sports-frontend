# Sportz Live Score Frontend

A Next.js-based frontend for the Sportz live score application.

## Features

- **Live Matches Dashboard** - View all currently live matches with real-time score updates
- **Upcoming Matches** - See scheduled matches and their start times
- **Finished Matches** - Review completed match results
- **Match Details** - Detailed view of individual matches
- **Live Commentary** - Real-time commentary feed with the ability to add comments
- **WebSocket Integration** - Real-time updates without page refresh
- **Responsive Design** - Works on desktop and mobile devices
- **Dark Mode Support** - Automatic dark mode based on system preferences

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Backend server running on port 8000 (see main project README)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
The `.env.local` file is already configured with defaults:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
```

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

Build for production:
```bash
npm run build
```

Start the production server:
```bash
npm run start
```

## Pages

### `/live` - Live Matches
Shows all currently live matches with real-time score updates. Matches are displayed in a card format showing:
- Sport type with icon
- Team names
- Current scores
- Live status badge

### `/upcoming` - Upcoming Matches
Displays scheduled matches with:
- Start time
- Team information
- Sport type

### `/finished` - Finished Matches
Shows completed matches with final scores.

### `/match/[id]` - Match Detail
Detailed view of a specific match including:
- Full scoreboard
- Match status
- Live commentary feed
- Comment input form
- Real-time commentary updates via WebSocket

## Architecture

### Components
- `Header.tsx` - Navigation header with links to different match views
- `MatchCard.tsx` - Reusable match card component
- `CommentaryItem.tsx` - Commentary entry display with event icons

### Libraries
- `lib/api.ts` - API client for backend communication
- `lib/websocket.ts` - WebSocket client for real-time updates
- `lib/utils.ts` - Utility functions for formatting and helpers

### Tech Stack
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **WebSocket** - Real-time communication

## API Integration

The frontend connects to your existing backend API:
- `GET /matches` - Fetch all matches
- `GET /matches/:id/commentary` - Fetch commentary for a match
- `POST /matches/:id/commentary` - Add new commentary
- `WS /ws` - WebSocket connection for real-time updates

## Real-time Features

The WebSocket client automatically:
- Connects to the backend WebSocket server
- Subscribes to match updates when viewing match details
- Receives real-time commentary updates
- Handles reconnection attempts if connection is lost

## Styling

The app uses Tailwind CSS with:
- Clean, modern design
- Responsive grid layouts
- Hover effects and transitions
- Status badges (Live/Upcoming/Finished)
- Sport-specific icons
- Event-type icons for commentary
