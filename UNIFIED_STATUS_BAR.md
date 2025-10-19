# Unified Status Bar - Mobile-Friendly PWA Notifications

## Overview

Replaced separate PWA installation prompts, offline status indicators, and sync notifications with a single, mobile-optimized unified status bar.

## Key Improvements

### 📱 **Mobile-First Design**

- **Bottom positioning**: Fixed to bottom of screen to avoid header/logo conflicts
- **Responsive width**: Full width on mobile, fixed width on desktop
- **Touch-friendly**: Larger tap targets and proper spacing

### 🎛️ **Unified Interface**

- **Single status bar**: Combines all notifications (online/offline, sync, PWA install, updates)
- **Smart prioritization**: Shows most important status first
- **Expandable details**: Tap to show detailed information
- **Context-aware actions**: Relevant action buttons based on current state

### 🔄 **Status Priority System**

1. **App Updates** (highest priority)
2. **PWA Installation prompts**
3. **App Installed confirmation**
4. **Data Syncing status**
5. **Pending changes** (with sync button)
6. **Offline/Online status**
7. **Sync success/error states**

### 🎨 **Visual Design**

- **Color-coded status**: Different colors for different states
- **Semi-transparent backdrop**: Doesn't obstruct content
- **Smooth animations**: Expand/collapse with transitions
- **Consistent iconography**: Clear status indicators

## Component Features

### Main Status Display

- Shows current most important status
- Color-coded background (green=good, yellow=pending, red=error, blue=info)
- Quick action button when applicable
- Expand/collapse toggle

### Expanded Details

- Connection status
- Pending changes count
- Last sync timestamp
- App installation status
- Relevant action buttons

### Smart Actions

- **Update App**: When PWA update available
- **Install App**: When installation possible
- **Sync Now**: When changes pending and online
- **Auto-dismiss**: Install prompts after 24 hours

## Mobile Positioning

```
┌─────────────────────┐
│ Header/Logo         │ ← No longer overlapped
│ Navigation Menu     │
│                     │
│                     │
│ Main Content        │
│                     │
│                     │
└─────────────────────┘
┌───[Status Bar]─────┐ ← New position
└─────────────────────┘
```

## Usage

The component automatically replaces the old PWAInstall and OfflineSync components and provides all their functionality in a single, mobile-optimized interface.

No additional configuration needed - it intelligently manages all PWA and sync states.
