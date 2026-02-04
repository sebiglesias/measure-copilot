# Copilot Usage Monitor - Visual Demo

This document shows what the application looks like when running.

## Menu Bar Icon

When the app is running, you'll see a small icon in your macOS menu bar (top-right of screen).

**Icon**: A simple "CP" badge that represents Copilot

## Menu Bar Dropdown

When you click the icon, you'll see:

```
┌─────────────────────────────────────┐
│ Copilot Usage: 32.5%                │
├─────────────────────────────────────┤
│ Remaining: 1,350 / 2,000            │
│ Today: 45 requests                  │
│ Daily Limit: 71                     │
│ ✓ Within daily limit                │
├─────────────────────────────────────┤
│ Refresh                             │
├─────────────────────────────────────┤
│ Configure GitHub Token              │
│ Open Dashboard                      │
├─────────────────────────────────────┤
│ Quit                                │
└─────────────────────────────────────┘
```

## Dashboard Window

The dashboard provides detailed visualizations:

### Monthly Usage Section
```
┌──────────────────────────────────────────┐
│  MONTHLY USAGE                           │
│  1,350                                   │
│  650 of 2,000 used (32.5%)              │
│  ████████░░░░░░░░░░░░░░ 32.5%           │
└──────────────────────────────────────────┘
```

### Daily Usage Section
```
┌──────────────────────────────────────────┐
│  TODAY'S USAGE                           │
│  45                                      │
│  Daily limit: 71 requests                │
│  ████████████████░░░░░░ 63.4%           │
│  ✓ Within daily limit                   │
└──────────────────────────────────────────┘
```

## Color Coding

The app uses visual indicators to show your usage status:

- **Green** (< 70%): You're doing great!
- **Yellow** (70-90%): Warning - approaching limit
- **Red** (> 90%): Alert - at or over limit

## States

### 1. Initial Setup State
When you first launch the app without a GitHub token:
```
┌──────────────────────────────────────────┐
│  🚀 Welcome to Copilot Usage Monitor     │
│                                          │
│  To get started, you need to enter      │
│  your GitHub Personal Access Token.     │
│                                          │
│  The token needs the copilot scope to   │
│  access usage data.                     │
│                                          │
│  [Create a token at GitHub Settings]    │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │ ghp_xxxxxxxxxxxxxxxxxxxx           │ │
│  └────────────────────────────────────┘ │
│                                          │
│  [  Save Token  ]                       │
└──────────────────────────────────────────┘
```

### 2. Normal Operation State
After configuring your token, the dashboard shows:
```
┌──────────────────────────────────────────┐
│  GitHub Copilot Usage                    │
│                                          │
│  MONTHLY USAGE                           │
│  1,350                                   │
│  650 of 2,000 used (32.5%)              │
│  ████████░░░░░░░░░░░░░░ 32.5%           │
│                                          │
│  TODAY'S USAGE                           │
│  45                                      │
│  Daily limit: 71 requests                │
│  ████████████████░░░░░░ 63.4%           │
│  ✓ Within daily limit                   │
│                                          │
│  [  🔄 Refresh  ]  [ Clear Token ]      │
│                                          │
│  Last updated: 3:45:23 PM               │
└──────────────────────────────────────────┘
```

### 3. Warning State (Over Daily Limit)
When you exceed your daily limit:
```
┌──────────────────────────────────────────┐
│  TODAY'S USAGE                           │
│  95                                      │
│  Daily limit: 71 requests                │
│  ████████████████████████████ 133.8%    │
│  ⚠️ Daily limit exceeded!               │
└──────────────────────────────────────────┘
```

### 4. Critical State (Low Remaining Quota)
When approaching monthly limit:
```
┌──────────────────────────────────────────┐
│  MONTHLY USAGE                           │
│  120                                     │
│  1,880 of 2,000 used (94.0%)            │
│  ████████████████████████ 94.0%         │
└──────────────────────────────────────────┘
```
*Progress bar appears in red*

## Interaction Flow

1. **Launch App** → Icon appears in menu bar
2. **Click Icon** → Quick stats dropdown appears
3. **Click "Configure GitHub Token"** → Setup window opens
4. **Enter Token** → Dashboard becomes available
5. **Click "Open Dashboard"** → Detailed window opens
6. **App Auto-Refreshes** → Updates every 5 minutes
7. **Manual Refresh** → Click refresh button anytime

## Technical Details

- **Window Size**: 400x600 pixels (compact and unobtrusive)
- **Refresh Rate**: Every 5 minutes (automatic)
- **Storage**: All data stored locally in your system
- **Platform**: macOS 10.14+ (can be adapted for other platforms)

## Features Demonstrated

✅ Real-time usage tracking
✅ Menu bar integration
✅ Visual progress indicators
✅ Color-coded warnings
✅ Daily limit calculations
✅ Auto-refresh capability
✅ Secure token storage
✅ Historical tracking (60 days)

---

**Note**: This is a text-based representation. The actual app uses a modern, 
gradient-based UI with smooth animations and professional design.
