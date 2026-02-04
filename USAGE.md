# Copilot Usage Monitor - Detailed Usage Guide

## Getting Started

### First Time Setup

1. **Install the application**
   - Follow the installation instructions in README.md
   - Run `npm install` to install dependencies
   - Run `npm start` to launch the app

2. **Configure GitHub Authentication**
   - When you first launch the app, you'll see a setup screen
   - You need to create a GitHub Personal Access Token:
     * Visit https://github.com/settings/tokens
     * Click "Generate new token (classic)"
     * Name it "Copilot Usage Monitor"
     * Select the `copilot` scope (required for accessing usage data)
     * Click "Generate token"
     * **Important**: Copy the token immediately - you won't be able to see it again!
   - Paste the token into the app and click "Save Token"

3. **Wait for Initial Sync**
   - The app will fetch your usage data from GitHub
   - This may take a few seconds on first launch
   - You'll see your usage metrics appear in the menu bar

## Understanding Your Usage

### Menu Bar Display

The menu bar shows a quick summary:
- **Copilot Usage**: Overall percentage of monthly quota used
- **Remaining**: Number of requests remaining out of total monthly limit
- **Today**: Number of requests made today
- **Daily Limit**: Recommended daily limit for even distribution
- **Status**: Whether you're within your daily limit

### Dashboard Window

Click "Open Dashboard" from the menu for detailed visualizations:

#### Monthly Usage Card
- Shows total remaining requests
- Displays how many you've used out of your total
- Progress bar with color coding:
  * Green: < 70% used
  * Yellow: 70-90% used
  * Red: > 90% used

#### Daily Usage Card
- Shows today's request count
- Compares against recommended daily limit
- Indicates if you're over your daily limit
- Progress bar showing daily usage percentage

### How Daily Limits Work

The app calculates a "recommended daily limit" to help you use your Copilot quota evenly throughout the month:

**Formula**: Daily Limit = Monthly Total / Days in Month

**Example**: If you have 2,000 requests per month in February (28 days):
- Daily Limit = 2,000 / 28 ≈ 71 requests per day
- If you use 150 requests today, you're over the daily limit (but not out of quota!)

**Why this matters**:
- Helps prevent running out of quota early in the month
- Allows you to pace your usage
- Shows if you need to adjust your Copilot usage patterns

**Important Notes**:
- Going over the daily limit doesn't block you from using Copilot
- It's just a guideline to help distribute usage evenly
- Some days you may use more, some days less - that's normal!

## Features in Detail

### Auto-Refresh
- The app automatically refreshes your usage data every 5 minutes
- You can manually refresh anytime by clicking "Refresh" in the menu or dashboard

### Usage History
- The app stores your daily usage for the last 60 days
- This helps track trends over time
- Data is stored locally on your computer

### Visual Indicators

**Status Colors**:
- 🟢 Green: Everything looks good, you're on track
- 🟡 Yellow: Warning - approaching your limit
- 🔴 Red: Alert - you've exceeded the recommended limit

**Status Messages**:
- "✓ Within daily limit": Your usage today is below the recommended daily amount
- "⚡ Close to daily limit": You're at 80%+ of your daily limit
- "⚠️ Daily limit exceeded!": You've used more than the recommended daily amount

## Tips for Managing Usage

1. **Check regularly**: Glance at the menu bar icon to monitor your usage
2. **Pace yourself**: Try to stay within the daily limit most days
3. **Track trends**: Open the dashboard to see your overall monthly progress
4. **Plan ahead**: If you have a big coding session coming up, check your remaining quota

## Troubleshooting

### Token Issues

**Problem**: "Not connected to GitHub" message
**Solutions**:
- Verify your token has the `copilot` scope
- Try regenerating the token on GitHub
- Clear the token and re-enter it

**Problem**: Usage data not updating
**Solutions**:
- Click "Refresh" to manually update
- Check your internet connection
- Verify your token is still valid on GitHub

### Data Issues

**Problem**: Usage shows 0 or incorrect numbers
**Solutions**:
- The GitHub Copilot API may not be available for all accounts
- The app uses a fallback estimation if the API is unavailable
- Wait a few minutes and try refreshing

**Problem**: Daily usage resets at wrong time
**Solution**:
- Daily usage is based on UTC timezone
- Your "day" starts at midnight UTC, which may differ from your local time

## Privacy & Security

### What data is stored locally?
- Your GitHub Personal Access Token (encrypted in system keychain)
- Daily usage history (last 60 days)
- App preferences and settings

### What data is sent over the network?
- Only API requests to GitHub to fetch your usage data
- No data is sent to any third-party services
- Your token is only transmitted securely to GitHub's API

### How is my token protected?
- Stored using electron-store with system-level encryption
- Never logged or displayed in plain text
- Only used for GitHub API authentication

## Advanced Usage

### Running in Development Mode
```bash
npm run dev
```

### Building for Distribution
```bash
npm run build
```
This creates a `.dmg` installer in the `dist/` folder.

### Viewing Debug Information
- Open the app
- Open Developer Tools: View > Toggle Developer Tools
- Check the Console tab for detailed logs

## FAQ

**Q: Does this work on Windows or Linux?**
A: Currently, this is designed for macOS. It could be adapted for other platforms with some modifications.

**Q: How accurate is the usage data?**
A: The app uses GitHub's official API when available. If the API is unavailable, it uses estimation methods.

**Q: Can I track multiple GitHub accounts?**
A: Currently, the app supports one token at a time. You can switch accounts by clearing the token and entering a new one.

**Q: Does this affect my Copilot performance?**
A: No, this is just a monitoring tool. It doesn't interfere with Copilot's functionality.

**Q: What if I hit my monthly limit?**
A: The app will show when you're approaching or at your limit, but it doesn't prevent you from using Copilot. GitHub's own limits will apply.

## Getting Help

If you encounter issues:
1. Check this usage guide
2. Review the README.md troubleshooting section
3. Open an issue on GitHub with:
   - Description of the problem
   - Steps to reproduce
   - Screenshots if relevant
   - Console error messages (from Developer Tools)

## Updating the App

To update to a new version:
```bash
git pull
npm install
npm start
```

Your settings and token will be preserved across updates.
