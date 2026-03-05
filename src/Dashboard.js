/**
 * Dashboard.js — Green + white game-style dashboard
 *
 * ROW MAP (matches setupDashboardSheet in Setup.js):
 *  1:  Title bar
 *  2:  Date (dynamic)
 *  3-4: Wisdom quote (dynamic)
 *  5:  spacer
 *  6:  Player card — Level / Title / XP (dynamic)
 *  7:  XP progress sparkline (dynamic)
 *  8:  Streak + freezes (dynamic)
 *  9:  spacer
 *  10: Section header — "THIS WEEK'S HABITS"
 *  11: Day column headers (HABIT | MON…SUN | WEEK)
 *  12-18: 7 habit rows (habit name in col B, grid in C-I, week score in J)
 *  19: SCORE row — daily totals (C-I) and weekly % (J)
 *  20: spacer
 *  21: Section header — "BOSS BATTLES"
 *  22: 6-Pack progress bar
 *  23: $30K MRR progress bar
 *  24: $100K MRR progress bar
 *  25: spacer
 *  26: Section header — "CHARACTER STATS"
 *  27: Attribute labels (static — set by setupDashboardSheet)
 *  28: Attribute values — 7-day averages (dynamic)
 *  29: spacer
 *  30: Section header — "RECENT ACHIEVEMENTS"
 *  31-33: Badge rows (dynamic)
 *  34: spacer
 *  35: Section header — "THIS WEEK'S XP"
 *  36: XP total (dynamic)
 */

// ============================================================
// MAIN REFRESH
// ============================================================
function refreshDashboard() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var dash = ss.getSheetByName(SHEET_NAMES.DASHBOARD);
  var log = ss.getSheetByName(SHEET_NAMES.DAILY_LOG);
  if (!dash || !log) return;

  var tz = ss.getSpreadsheetTimeZone();
  var lastRow = log.getLastRow();
  var hasData = lastRow >= 2;

  // Latest row (today if logged, otherwise most recent)
  var todayRow = hasData ? findDateRow(log, today()) : -1;
  var latestRow = (todayRow > 0) ? todayRow : Math.max(2, lastRow);

  // Core stats
  var totalXP     = hasData ? (log.getRange(latestRow, DL.TOTAL_XP).getValue() || 0) : 0;
  var streak      = hasData ? (log.getRange(latestRow, DL.STREAK).getValue() || 0) : 0;
  var currentMRR  = hasData ? (log.getRange(latestRow, DL.MRR).getValue() || 0) : 0;

  // Level info
  var level         = getLevelFromXP(totalXP);
  var title         = getLevelTitle(level);
  var curLvlXP      = getLevelXP(level);
  var nextLvlXP     = getLevelXP(Math.min(level + 1, MAX_LEVEL));
  var xpInLevel     = totalXP - curLvlXP;
  var xpForLevel    = nextLvlXP - curLvlXP;
  var levelProgress = xpForLevel > 0 ? Math.min(1, xpInLevel / xpForLevel) : 1;
  var multiplier    = getStreakMultiplier(streak);

  // ---- ROW 2: DATE ----
  var todayStr = Utilities.formatDate(new Date(), tz, 'EEEE, MMMM d, yyyy');
  dash.getRange('B2:J2').merge()
    .setValue(todayStr)
    .setFontSize(11).setFontWeight('bold').setFontColor(COLORS.DARK_GREEN)
    .setBackground(COLORS.LIGHT_GREEN)
    .setHorizontalAlignment('center').setVerticalAlignment('middle');

  // ---- ROWS 3-4: WISDOM ----
  var wisdomTrigger = getYesterdayWisdomTrigger(log, latestRow);
  var wisdom = getContextualWisdom({ trigger: wisdomTrigger });
  dash.getRange('B3:J4').merge()
    .setValue(formatWisdom(wisdom))
    .setFontSize(9).setFontStyle('italic').setFontColor('#5d4037')
    .setBackground('#fff8e1')
    .setHorizontalAlignment('center').setVerticalAlignment('middle').setWrap(true);

  // ---- ROW 6: PLAYER CARD ----
  var multStr = multiplier > 1 ? '  \u00b7  ' + multiplier + 'x XP' : '';
  dash.getRange('B6:J6').merge()
    .setValue('\u26a1  LVL ' + level + '  \u2014  ' + title + '  \u00b7  ' + totalXP.toLocaleString() + ' XP' + multStr)
    .setBackground(COLORS.DARK_GREEN).setFontColor(COLORS.ACCENT_GOLD)
    .setFontSize(13).setFontWeight('bold')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');

  // ---- ROW 7: XP SPARKLINE ----
  dash.getRange('B7:J7').merge()
    .setFormula('=SPARKLINE(' + levelProgress.toFixed(4) +
      ',{"charttype","bar";"max",1;"color1","' + COLORS.ACCENT_GOLD + '";"color2","#388e3c"})')
    .setBackground(COLORS.HEADER_BG);

  // ---- ROW 8: STREAK ----
  var freezeCount = getStreakFreezeCount();
  var bestStreak  = getBestStreak(log);
  var streakIcon  = streak >= 30 ? '\ud83d\udd25\ud83d\udd25' : (streak >= 7 ? '\ud83d\udd25' : (streak > 0 ? '\u2728' : '\ud83d\udc80'));
  var streakText  = streakIcon + '  ' + streak + '-day streak  \u00b7  Best: ' + bestStreak +
                   '  \u00b7  \u2744\ufe0f ' + freezeCount + ' freeze' + (freezeCount !== 1 ? 's' : '');
  var streakCell  = dash.getRange('B8:J8').merge();
  streakCell.setValue(streakText)
    .setFontSize(11).setFontWeight('bold')
    .setBackground(COLORS.LIGHT_GREEN)
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  streakCell.setFontColor(streak >= 7 ? COLORS.HEADER_BG : (streak === 0 ? '#c62828' : COLORS.DARK_GREEN));

  // ---- WEEKLY HABIT GRID (rows 11-19) ----
  buildHabitGrid(dash, log);

  // ---- BOSS BATTLES (rows 22-24) ----
  updateBossBattles(dash, log, currentMRR);

  // ---- CHARACTER STATS (row 28) ----
  updateCharacterStats(dash, log);

  // ---- RECENT ACHIEVEMENTS (rows 31-33) ----
  updateRecentBadges(dash, ss);

  // ---- THIS WEEK'S XP (row 36) ----
  updateWeeklyXP(dash, log);
}

// ============================================================
// WEEKLY HABIT GRID
// Columns: B=habit names, C-I=Mon-Sun, J=week score
// Rows:    11=day headers, 12-18=habits, 19=score row
// ============================================================
function buildHabitGrid(dash, log) {
  var monday = getMonday(new Date());
  var tz = SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone();
  var today_ = new Date();
  var dayNames = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  // --- Day headers (row 11, cols C-I) with actual dates ---
  for (var d = 0; d < 7; d++) {
    var dayDate = new Date(monday.getTime() + d * 86400000);
    var isToday = isSameDay(dayDate, today_);
    var dayLabel = dayNames[d] + '\n' + Utilities.formatDate(dayDate, tz, 'M/d');
    dash.getRange(11, 3 + d)
      .setValue(dayLabel)
      .setFontWeight('bold').setFontSize(9)
      .setHorizontalAlignment('center').setVerticalAlignment('middle').setWrap(true)
      .setBackground(isToday ? COLORS.HEADER_BG : '#c8e6c9')
      .setFontColor(isToday ? '#ffffff' : COLORS.DARK_GREEN);
  }

  // --- Bulk read Daily Log for the week ---
  var lastLogRow = log.getLastRow();
  var allLogData = [];
  if (lastLogRow >= 2) {
    allLogData = log.getRange(2, 1, lastLogRow - 1, DL.HABIT_END).getValues();
  }

  // habitData[dayIndex][habitIndex] = 'done' | 'missed' | 'future'
  var habitData = [];
  for (var di = 0; di < 7; di++) {
    var dayDate2 = new Date(monday.getTime() + di * 86400000);
    var isFuture = stripTime(dayDate2) > stripTime(today_);
    var dayHabits = [];
    var foundRow = null;
    for (var ri = 0; ri < allLogData.length; ri++) {
      if (allLogData[ri][0] instanceof Date && isSameDay(allLogData[ri][0], dayDate2)) {
        foundRow = allLogData[ri];
        break;
      }
    }
    for (var hi = 0; hi < HABITS.length; hi++) {
      if (!foundRow) {
        dayHabits.push(isFuture ? 'future' : 'missed');
      } else {
        var val = foundRow[DL.HABIT_START - 1 + hi];
        dayHabits.push(val === true ? 'done' : (isFuture ? 'future' : 'missed'));
      }
    }
    habitData.push(dayHabits);
  }

  // --- Build grid arrays for batch write (rows 12-18, cols C-I) ---
  var gridValues = [], gridBgs = [], gridFCs = [];
  var weekScores = [];

  for (var hi2 = 0; hi2 < HABITS.length; hi2++) {
    var rowVals = [], rowBgs = [], rowClrs = [];
    var weekDone = 0;
    for (var di2 = 0; di2 < 7; di2++) {
      var status = habitData[di2][hi2];
      if (status === 'done') {
        rowVals.push('\u2713');   // ✓
        rowBgs.push('#a5d6a7');
        rowClrs.push('#1b5e20');
        weekDone++;
      } else if (status === 'missed') {
        rowVals.push('\u2717');   // ✗
        rowBgs.push('#ffcdd2');
        rowClrs.push('#c62828');
      } else {
        rowVals.push('\u00b7');   // · (future)
        rowBgs.push('#f5f5f5');
        rowClrs.push('#bdbdbd');
      }
    }
    gridValues.push(rowVals);
    gridBgs.push(rowBgs);
    gridFCs.push(rowClrs);
    weekScores.push(weekDone);
  }

  // Batch write the 7x7 grid
  var gridRange = dash.getRange(12, 3, HABITS.length, 7);
  gridRange.setValues(gridValues)
    .setBackgrounds(gridBgs)
    .setFontColors(gridFCs)
    .setHorizontalAlignment('center')
    .setFontSize(14)
    .setFontWeight('bold');

  // Week scores in col J (rows 12-18)
  for (var hi3 = 0; hi3 < HABITS.length; hi3++) {
    var wd = weekScores[hi3];
    var pct = HABITS.length > 0 ? wd / HABITS.length : 0;
    var sc = dash.getRange(12 + hi3, 10);
    sc.setValue(wd + '/' + HABITS.length)
      .setHorizontalAlignment('center').setFontSize(10).setFontWeight('bold');
    if (wd === HABITS.length) {
      sc.setBackground(COLORS.HEADER_BG).setFontColor('#ffffff');
    } else if (pct >= 0.7) {
      sc.setBackground('#c8e6c9').setFontColor(COLORS.DARK_GREEN);
    } else if (pct >= 0.4) {
      sc.setBackground('#fff9c4').setFontColor('#e65100');
    } else {
      sc.setBackground('#ffcdd2').setFontColor('#c62828');
    }
  }

  // --- Daily SCORE row (row 19, cols C-I and J) ---
  var weekTotal = 0;
  for (var di3 = 0; di3 < 7; di3++) {
    var dayTotal = 0;
    var allFuture = true;
    for (var hi4 = 0; hi4 < HABITS.length; hi4++) {
      if (habitData[di3][hi4] === 'done') dayTotal++;
      if (habitData[di3][hi4] !== 'future') allFuture = false;
    }
    weekTotal += dayTotal;
    var totCell = dash.getRange(19, 3 + di3);
    totCell.setHorizontalAlignment('center').setFontSize(10).setFontWeight('bold');

    if (allFuture && dayTotal === 0) {
      totCell.setValue('\u2014').setBackground('#f5f5f5').setFontColor('#9e9e9e');
    } else {
      var dayPct = HABITS.length > 0 ? dayTotal / HABITS.length : 0;
      if (dayPct === 1) {
        totCell.setValue('\u2605').setBackground(COLORS.DARK_GREEN).setFontColor(COLORS.ACCENT_GOLD); // ★
      } else {
        totCell.setValue(dayTotal + '/' + HABITS.length);
        if (dayPct >= 0.7) {
          totCell.setBackground('#a5d6a7').setFontColor(COLORS.DARK_GREEN);
        } else if (dayPct >= 0.4) {
          totCell.setBackground('#fff9c4').setFontColor('#e65100');
        } else {
          totCell.setBackground('#ef9a9a').setFontColor('#b71c1c');
        }
      }
    }
  }

  // Week-total % in J19
  var weekMax = HABITS.length * 7;
  var weekPct = weekMax > 0 ? weekTotal / weekMax : 0;
  dash.getRange(19, 10)
    .setValue(Math.round(weekPct * 100) + '%')
    .setHorizontalAlignment('center').setFontSize(11).setFontWeight('bold')
    .setBackground(weekPct >= 0.8 ? COLORS.HEADER_BG : (weekPct >= 0.5 ? '#a5d6a7' : '#ef9a9a'))
    .setFontColor(weekPct >= 0.8 ? '#ffffff' : COLORS.DARK_GREEN);
}

// ============================================================
// BOSS BATTLES — goal progress bars (rows 22-24)
// ============================================================
function updateBossBattles(dash, log, currentMRR) {
  // 6-Pack (body fat)
  var lastBF = getLastNonEmpty(log, DL.BODY_FAT, 2);
  var bfProgress = 0;
  if (lastBF && lastBF > 0 && CUT.START_BF > CUT.TARGET_BF) {
    bfProgress = Math.min(1, Math.max(0, (CUT.START_BF - lastBF) / (CUT.START_BF - CUT.TARGET_BF)));
  }
  var bfBar = makeBar(bfProgress, 22);
  var bfStatus = lastBF ? (lastBF.toFixed(1) + '% \u2192 ' + CUT.TARGET_BF + '%  ' + Math.round(bfProgress * 100) + '%') : 'Log body fat % to track';
  dash.getRange('B22:J22').merge()
    .setValue('\ud83d\udcaa  6-PACK:  ' + bfBar + '  ' + bfStatus)
    .setBackground(bfProgress >= 1 ? '#a5d6a7' : '#fafafa')
    .setFontColor(bfProgress >= 1 ? COLORS.DARK_GREEN : '#424242')
    .setFontSize(10).setFontFamily('Courier New')
    .setHorizontalAlignment('left').setVerticalAlignment('middle');

  // $30K MRR
  var mrr30p = GOALS.mrr30k.target > 0 ? Math.min(1, currentMRR / GOALS.mrr30k.target) : 0;
  var mrr30d = daysUntil(GOALS.mrr30k.deadline);
  dash.getRange('B23:J23').merge()
    .setValue('\ud83d\udcb0  $30K MRR:  ' + makeBar(mrr30p, 22) + '  ' +
      formatCurrency(currentMRR) + ' / $30K  \u00b7  ' + Math.max(0, mrr30d) + 'd left')
    .setBackground(mrr30p >= 1 ? '#a5d6a7' : '#fafafa')
    .setFontColor(mrr30p >= 1 ? COLORS.DARK_GREEN : (mrr30d < 14 ? '#c62828' : '#424242'))
    .setFontSize(10).setFontFamily('Courier New')
    .setHorizontalAlignment('left').setVerticalAlignment('middle');

  // $100K MRR
  var mrr100p = GOALS.mrr100k.target > 0 ? Math.min(1, currentMRR / GOALS.mrr100k.target) : 0;
  var mrr100d = daysUntil(GOALS.mrr100k.deadline);
  dash.getRange('B24:J24').merge()
    .setValue('\ud83d\ude80  $100K MRR:  ' + makeBar(mrr100p, 22) + '  ' +
      formatCurrency(currentMRR) + ' / $100K  \u00b7  ' + Math.max(0, mrr100d) + 'd left')
    .setBackground(mrr100p >= 1 ? '#a5d6a7' : '#fafafa')
    .setFontColor(mrr100p >= 1 ? COLORS.DARK_GREEN : '#424242')
    .setFontSize(10).setFontFamily('Courier New')
    .setHorizontalAlignment('left').setVerticalAlignment('middle');
}

// ============================================================
// CHARACTER STATS — 7-day attribute averages (row 28)
// ============================================================
function updateCharacterStats(dash, log) {
  var lastRow = log.getLastRow();
  if (lastRow < 2) return;

  var startRow = Math.max(2, lastRow - 6);
  var numRows  = lastRow - startRow + 1;

  for (var ai = 0; ai < ATTRIBUTES.length; ai++) {
    var col = DL.ATTR_START + ai;
    var vals = log.getRange(startRow, col, numRows, 1).getValues();
    var sum = 0, count = 0;
    for (var v = 0; v < vals.length; v++) {
      if (vals[v][0] && vals[v][0] >= 1) { sum += vals[v][0]; count++; }
    }
    var avg    = count > 0 ? sum / count : 0;
    var avgStr = count > 0 ? avg.toFixed(1) : '\u2014';
    var stars  = '';
    if (avg > 0) {
      var filled = Math.round(avg);
      for (var s = 0; s < 5; s++) stars += (s < filled ? '\u2605' : '\u2606');
    }
    var cell = dash.getRange(28, 2 + ai);
    cell.setValue(avgStr + '\n' + stars)
      .setFontSize(10).setFontWeight('bold')
      .setHorizontalAlignment('center').setVerticalAlignment('middle').setWrap(true);
    if (count === 0) {
      cell.setBackground('#f5f5f5').setFontColor('#9e9e9e');
    } else if (avg >= 4) {
      cell.setBackground('#c8e6c9').setFontColor(COLORS.DARK_GREEN);
    } else if (avg >= 3) {
      cell.setBackground('#fff9c4').setFontColor('#e65100');
    } else {
      cell.setBackground('#ffcdd2').setFontColor('#c62828');
    }
  }
}

// ============================================================
// RECENT ACHIEVEMENTS (rows 31-33)
// ============================================================
function updateRecentBadges(dash, ss) {
  var achieveSheet = ss.getSheetByName(SHEET_NAMES.ACHIEVEMENTS);
  if (!achieveSheet) return;
  var lastRow = achieveSheet.getLastRow();
  if (lastRow < 2) return;

  var data   = achieveSheet.getRange(2, 1, lastRow - 1, 7).getValues();
  var earned = [];
  for (var i = 0; i < data.length; i++) {
    if (data[i][6] === true && data[i][5]) {
      earned.push({ icon: data[i][0], name: data[i][1], date: data[i][5] });
    }
  }
  earned.sort(function(a, b) { return new Date(b.date) - new Date(a.date); });

  var tz = SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone();
  for (var r = 0; r < 3; r++) {
    var cell = dash.getRange('B' + (31 + r) + ':J' + (31 + r)).merge();
    if (r < earned.length) {
      var dateStr = earned[r].date instanceof Date
        ? Utilities.formatDate(earned[r].date, tz, 'MMM d') : '';
      cell.setValue(earned[r].icon + '  ' + earned[r].name + '  \u2014  ' + dateStr)
        .setBackground('#fff8e1').setFontColor('#5d4037')
        .setFontSize(10).setHorizontalAlignment('center').setFontWeight('normal');
    } else {
      cell.setValue(r === 0 ? '\ud83c\udfc6  No badges yet \u2014 start checking those habits!' : '')
        .setBackground('#f5f5f5').setFontColor('#9e9e9e')
        .setFontSize(10).setHorizontalAlignment('center');
    }
  }
}

// ============================================================
// THIS WEEK'S XP (row 36)
// ============================================================
function updateWeeklyXP(dash, log) {
  var lastRow = log.getLastRow();
  if (lastRow < 2) {
    dash.getRange('B36:J36').merge().setValue('No XP logged yet — start checking habits!')
      .setBackground(COLORS.LIGHT_GREEN).setFontColor(COLORS.DARK_GREEN)
      .setFontSize(11).setHorizontalAlignment('center');
    return;
  }

  var monday   = getMonday(new Date());
  var weekXP   = 0;
  var daysLogged = 0;
  for (var r = 2; r <= lastRow; r++) {
    var date = log.getRange(r, DL.DATE).getValue();
    if (date instanceof Date && stripTime(date) >= monday) {
      weekXP += log.getRange(r, DL.XP_EARNED).getValue() || 0;
      daysLogged++;
    }
  }

  var xpText = '\ud83d\udcc8  ' + weekXP.toLocaleString() + ' XP this week';
  if (daysLogged > 0) xpText += '  \u00b7  ' + daysLogged + ' day' + (daysLogged > 1 ? 's' : '') + ' logged';

  dash.getRange('B36:J36').merge()
    .setValue(xpText)
    .setBackground(COLORS.LIGHT_GREEN).setFontColor(COLORS.DARK_GREEN)
    .setFontSize(11).setFontWeight('bold')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
}

// ============================================================
// HELPERS
// ============================================================

/**
 * Progress bar using block characters.
 * makeBar(0.6, 20) → "████████████░░░░░░░░"
 */
function makeBar(progress, width) {
  width    = width || 15;
  progress = Math.max(0, Math.min(1, progress || 0));
  var filled = Math.round(progress * width);
  var bar = '';
  for (var i = 0; i < width; i++) bar += (i < filled ? '\u2588' : '\u2591');
  return bar;
}

/**
 * Pick a wisdom trigger based on yesterday's performance.
 */
function getYesterdayWisdomTrigger(log, latestRow) {
  if (latestRow < 2) return 'general';
  var yesterdayRow = findDateRow(log, yesterday());
  if (yesterdayRow < 0) return 'negative';
  var completed = log.getRange(yesterdayRow, DL.COMPLETED).getValue();
  if (!completed) return 'negative';
  var habitsScore = log.getRange(yesterdayRow, DL.HABITS_SCORE).getValue();
  if (habitsScore === HABITS.length) return 'perfect_day';
  if (habitsScore <= 2) return 'negative';
  var prayerDone = log.getRange(yesterdayRow, DL.HABIT_START + 1).getValue();
  if (!prayerDone) return 'prayer';
  return 'positive';
}

/**
 * Get the all-time best streak from the Daily Log.
 */
function getBestStreak(log) {
  var lastRow = log.getLastRow();
  if (lastRow < 2) return 0;
  var streaks = log.getRange(2, DL.STREAK, lastRow - 1, 1).getValues();
  var best = 0;
  for (var i = 0; i < streaks.length; i++) {
    if (streaks[i][0] > best) best = streaks[i][0];
  }
  return best;
}
