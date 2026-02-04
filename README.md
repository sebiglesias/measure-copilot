# Copilot Usage Monitor

A macOS menu bar application that monitors your GitHub Copilot usage in real-time.

## Features

- 📊 **Real-time Usage Tracking**: Monitor your GitHub Copilot usage from the menu bar
- 📈 **Daily Usage Metrics**: Track your daily usage and see if you're within your daily limit
- ⚖️ **Even Distribution**: Automatically calculates if you're distributing usage evenly throughout the month
- 🔔 **Usage Alerts**: Get notified when you exceed your daily limit
- 💾 **Usage History**: Keeps track of your usage history for up to 60 days
- 🔄 **Auto-refresh**: Automatically updates usage data every 5 minutes

## Screenshots

The app displays:
- Total remaining Copilot requests for the month
- Percentage of monthly quota used
- Today's usage count
- Recommended daily limit for even distribution
- Visual indicators (green/yellow/red) for usage status

## Requirements

- macOS 10.14 or later
- Node.js 16 or later
- GitHub Personal Access Token with `copilot` scope

## Installation

1. Clone the repository:
```bash
git clone https://github.com/sebiglesias/measure-copilot.git
cd measure-copilot
```

2. Install dependencies:
```bash
npm install
```

3. Run the app:
```bash
npm start
```

## Building for Distribution

To build a standalone macOS application:

```bash
npm run build
```

This will create a `.dmg` file in the `dist` folder that you can distribute.

## Setup

1. **Create a GitHub Personal Access Token**:
   - Go to [GitHub Settings > Personal Access Tokens](https://github.com/settings/tokens)
   - Click "Generate new token (classic)"
   - Give it a name like "Copilot Usage Monitor"
   - Select the `copilot` scope
   - Click "Generate token"
   - Copy the token (you won't be able to see it again!)

2. **Configure the app**:
   - Click the app icon in the menu bar
   - Select "Configure GitHub Token"
   - Paste your token
   - Click "Save Token"

3. **View your usage**:
   - Click the menu bar icon to see a quick summary
   - Click "Open Dashboard" for detailed metrics

## Usage

### Menu Bar Quick View
- Click the menu bar icon to see:
  - Overall usage percentage
  - Remaining requests
  - Today's usage
  - Daily limit status

### Dashboard Window
- Open the dashboard for detailed visualizations:
  - Monthly usage progress bar
  - Daily usage progress bar
  - Status indicators
  - Last update time

### Understanding the Metrics

**Monthly Usage**: Shows how many Copilot requests you have remaining out of your total monthly quota.

**Daily Usage**: Shows how many requests you've made today.

**Daily Limit**: The app calculates a recommended daily limit by dividing your monthly quota by the number of days in the month. This helps you distribute usage evenly.

**Status Indicators**:
- ✓ Green: You're within your daily limit
- ⚡ Yellow: You're close to your daily limit (>80%)
- ⚠️ Red: You've exceeded your daily limit

## How It Works

The app uses the GitHub API to fetch your Copilot usage data. It:

1. Connects to GitHub using your personal access token
2. Fetches your Copilot usage statistics
3. Calculates daily limits based on even distribution throughout the month
4. Stores usage history locally to track trends
5. Updates the menu bar and dashboard with current metrics

## Privacy & Security

- Your GitHub token is stored securely in your system's keychain using `electron-store`
- All API calls are made directly from your computer to GitHub
- No data is sent to any third-party servers
- Usage history is stored locally on your machine

## Development

### Project Structure
```
measure-copilot/
├── src/
│   ├── main.js          # Main Electron process
│   ├── github-api.js    # GitHub API integration
│   ├── index.html       # Dashboard UI
│   └── assets/
│       └── iconTemplate.png     # Menu bar icon
├── package.json
└── README.md
```

### Technologies Used
- **Electron**: Cross-platform desktop app framework
- **Axios**: HTTP client for API calls
- **electron-store**: Persistent storage for tokens and history

## Troubleshooting

### "Not connected to GitHub" message
- Make sure you've entered a valid GitHub Personal Access Token
- Ensure the token has the `copilot` scope
- Try clearing the token and re-entering it

### No usage data showing
- GitHub's Copilot API may not be available for all accounts
- The app will use a fallback estimation method if the API is unavailable
- Check your internet connection

### App won't start
- Make sure you have Node.js 16 or later installed
- Try deleting `node_modules` and running `npm install` again
- Check the console for error messages

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - See LICENSE file for details