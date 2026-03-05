# Productivity Playbook

A gamified productivity tracker built on Google Sheets with Google Apps Script. Track daily habits, character attributes, MRR goals, and body metrics — with XP, levels, streaks, achievements, and contextual wisdom from Quran and authentic hadiths.

## Quick Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Login to Google

```bash
npx clasp login
```

This opens a browser window. Sign in with your Google account and authorize clasp.

### 3. Create the Google Sheet

```bash
npx clasp create --type sheets --title "Productivity Playbook" --rootDir src
```

This creates a new Google Sheet and binds the Apps Script to it. Note the Sheet URL in the output.

### 4. Deploy the code

```bash
npx clasp push
```

When prompted "Manifest file has been updated. Do you want to push and overwrite?", type **y**.

### 5. Setup the sheet

1. Open the Google Sheet (run `npx clasp open` or use the URL from step 3)
2. Click **Playbook** in the menu bar (you may need to refresh the page first)
3. Click **Setup Sheet (first time)**
4. Authorize the script when prompted (click "Advanced" > "Go to Productivity Playbook" > "Allow")
5. Wait for setup to complete — it creates all 8 tabs with formatting, charts, and 50 achievements

### 6. Start using it

Your first day's row is already created in the **Daily Log** tab. Check off your habits and go.

## Daily Workflow (~90 seconds)

1. Open the sheet (today's row is auto-created)
2. Check 7 habit boxes: Wake Before Fajr, All 5 Prayers, Workout, Deep Work 4h+, Ship Something, Quran Reading, Read 30 Min
3. Rate 6 attributes (1-5): Discipline, Focus, Confidence, Deen, Mental Toughness, Reliability
4. Update MRR if it changed
5. Check the "Done?" box — XP calculates instantly

## Weekly Workflow (~5 min, Mondays)

A review row auto-generates every Monday. Fill in:
- What Worked
- What Didn't
- Next Week Focus
- Muhasaba (self-reflection prompt provided)

Earns 50+ bonus XP.

## Gamification

- **XP**: Earn up to 150 XP/day (before streak multiplier)
- **Streaks**: Consecutive days multiply XP (up to 2.5x at 90+ days)
- **Streak Freezes**: Start with 2. Miss a day without breaking your streak. Earn more every 14-day streak.
- **Phoenix Bonus**: Miss 3+ days? Get 2x XP for your first 3 days back.
- **Levels**: 50 levels from Tawbah (1) to Khalifah (50)
- **Achievements**: 50 badges across Streak, Deen, Habits, Business, Fitness, Character, and Meta categories

## Sheets

| Tab | Purpose |
|-----|---------|
| Dashboard | At-a-glance stats, wisdom, goals, attributes |
| Daily Log | Daily habit checkboxes + attribute ratings |
| Weekly Review | Weekly stats + reflection |
| Charts | MRR trend, habit heatmap, XP progression, attribute trends |
| Achievements | 50 badges with unlock tracking |
| Wisdom | Quran ayat & hadith pool |
| Config | Customizable settings (habits, XP values, goals) |
| Data | Hidden backend calculations |

## Customization

Edit the **Config** tab to change:
- Habit names (swap any of the 7)
- Attribute names (swap any of the 6)
- XP values
- Goal deadlines and targets
- Streak freeze rules

Edit the **Wisdom** tab to add your own Quran ayat and hadiths.

## Development

```bash
npx clasp push    # Push local changes to Google
npx clasp pull    # Pull remote changes to local
npx clasp open    # Open the Sheet in browser
```

## File Structure

```
src/
  Code.js           # Entry point: onOpen, onEdit, menu
  Setup.js          # One-time sheet creation
  DailyLog.js       # Daily row creation, XP, streaks
  Dashboard.js      # Dashboard refresh
  Achievements.js   # Badge conditions & unlocking
  WeeklyReview.js   # Weekly stats & muhasaba
  Charts.js         # Chart generation
  Config.js         # Constants & tunable values
  Wisdom.js         # Quran & hadith pool
  Utils.js          # Shared helpers
  Triggers.js       # Time-driven automation
```
