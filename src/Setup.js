/**
 * Setup.js — One-time setup that builds the entire Productivity Playbook spreadsheet
 * Run via Playbook menu > Setup Sheet
 */

function runSetup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // Create all sheets
  setupDailyLogSheet(ss);
  setupDashboardSheet(ss);
  setupWeeklyReviewSheet(ss);
  setupChartsSheet(ss);
  setupAchievementsSheet(ss);
  setupWisdomSheet(ss);
  setupConfigSheet(ss);
  setupDataSheet(ss);
  setupBodyCompSheet(ss);
  setupMealsSheet(ss);
  setupPrayersSheet(ss);
  setupNutritionSheet(ss);
  setupLiftsSheet(ss);

  // Remove default "Sheet1" if it exists
  var sheet1 = ss.getSheetByName('Sheet1');
  if (sheet1) {
    ss.deleteSheet(sheet1);
  }

  // Set Daily Log as the active sheet
  var dailyLog = ss.getSheetByName(SHEET_NAMES.DAILY_LOG);
  if (dailyLog) ss.setActiveSheet(dailyLog);

  // Set up triggers
  setupTriggers();

  // Create first day's row
  createTodayRow();

  // Refresh dashboard
  refreshDashboard();

  try {
    SpreadsheetApp.getUi().alert('Setup complete! Your Productivity Playbook is ready.\n\nStart by checking off your habits in the Daily Log tab.');
  } catch(e) {
    Logger.log('Setup complete!');
  }
}

// ============================================================
// DAILY LOG SHEET
// ============================================================
function setupDailyLogSheet(ss) {
  var sheet = ss.getSheetByName(SHEET_NAMES.DAILY_LOG) || ss.insertSheet(SHEET_NAMES.DAILY_LOG);
  sheet.clear();

  // Headers
  var headers = ['Date', 'Done?'];
  headers = headers.concat(HABITS);
  headers = headers.concat(ATTRIBUTES);
  headers = headers.concat([
    'Habits', 'Attr Avg', 'MRR ($)', 'Weight', 'Body Fat %', 'Win of the Day',
    'XP', 'Total XP', 'Streak', 'Notes',
    'Whoop Recovery %', 'Whoop HRV (ms)', 'Whoop RHR (bpm)', 'Whoop Sleep %', 'Whoop Strain',
    'Diet \u2705', 'Calories'
  ]);

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // Header formatting
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground(COLORS.HEADER_BG)
    .setFontColor(COLORS.HEADER_TEXT)
    .setFontWeight('bold')
    .setFontSize(10)
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle')
    .setWrap(true);
  sheet.setRowHeight(1, 40);

  // Freeze header row
  sheet.setFrozenRows(1);

  // Column widths
  sheet.setColumnWidth(DL.DATE, 100);        // Date
  sheet.setColumnWidth(DL.COMPLETED, 50);    // Done?
  for (var h = DL.HABIT_START; h <= DL.HABIT_END; h++) {
    sheet.setColumnWidth(h, 65);             // Habits - narrow for checkboxes
  }
  for (var a = DL.ATTR_START; a <= DL.ATTR_END; a++) {
    sheet.setColumnWidth(a, 70);             // Attributes
  }
  sheet.setColumnWidth(DL.HABITS_SCORE, 55);
  sheet.setColumnWidth(DL.ATTR_AVG, 60);
  sheet.setColumnWidth(DL.MRR, 90);
  sheet.setColumnWidth(DL.WEIGHT, 65);
  sheet.setColumnWidth(DL.BODY_FAT, 70);
  sheet.setColumnWidth(DL.WIN_OF_DAY, 200);
  sheet.setColumnWidth(DL.XP_EARNED, 55);
  sheet.setColumnWidth(DL.TOTAL_XP, 70);
  sheet.setColumnWidth(DL.STREAK, 55);
  sheet.setColumnWidth(DL.NOTES, 150);
  // Whoop columns
  sheet.setColumnWidth(DL.WHOOP_RECOVERY, 90);
  sheet.setColumnWidth(DL.WHOOP_HRV, 80);
  sheet.setColumnWidth(DL.WHOOP_RESTING_HR, 90);
  sheet.setColumnWidth(DL.WHOOP_SLEEP, 85);
  sheet.setColumnWidth(DL.WHOOP_STRAIN, 75);
  // Diet columns
  sheet.setColumnWidth(DL.DIET_SCORE, 60);
  sheet.setColumnWidth(DL.CALORIES_EST, 75);

  // Date format
  sheet.getRange(2, DL.DATE, 500, 1).setNumberFormat('MMM d');

  // MRR format
  sheet.getRange(2, DL.MRR, 500, 1).setNumberFormat('$#,##0');

  // Conditional formatting for habits (green when checked)
  for (var hc = DL.HABIT_START; hc <= DL.HABIT_END; hc++) {
    var habitRange = sheet.getRange(2, hc, 500, 1);
    var ruleTrue = SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=' + colLetter(hc) + '2=TRUE')
      .setBackground(COLORS.HABIT_DONE)
      .setRanges([habitRange])
      .build();
    var ruleFalse = SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=AND(' + colLetter(hc) + '2=FALSE,' + colLetter(DL.DATE) + '2<>"")')
      .setBackground(COLORS.HABIT_MISSED)
      .setRanges([habitRange])
      .build();
    var rules = sheet.getConditionalFormatRules();
    rules.push(ruleTrue);
    rules.push(ruleFalse);
    sheet.setConditionalFormatRules(rules);
  }

  // Conditional formatting for attributes (color scale 1-5)
  for (var ac = DL.ATTR_START; ac <= DL.ATTR_END; ac++) {
    var attrRange = sheet.getRange(2, ac, 500, 1);
    var ruleLow = SpreadsheetApp.newConditionalFormatRule()
      .whenNumberLessThanOrEqualTo(2)
      .setBackground(COLORS.ATTR_LOW)
      .setRanges([attrRange])
      .build();
    var ruleMed = SpreadsheetApp.newConditionalFormatRule()
      .whenNumberBetween(3, 3)
      .setBackground(COLORS.ATTR_MED)
      .setRanges([attrRange])
      .build();
    var ruleHigh = SpreadsheetApp.newConditionalFormatRule()
      .whenNumberGreaterThanOrEqualTo(4)
      .setBackground(COLORS.ATTR_HIGH)
      .setRanges([attrRange])
      .build();
    var rules2 = sheet.getConditionalFormatRules();
    rules2.push(ruleLow);
    rules2.push(ruleMed);
    rules2.push(ruleHigh);
    sheet.setConditionalFormatRules(rules2);
  }

  // Streak conditional formatting (gold for high streaks)
  var streakRange = sheet.getRange(2, DL.STREAK, 500, 1);
  var streakRule = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberGreaterThanOrEqualTo(7)
    .setBackground(COLORS.ACCENT_GOLD)
    .setFontColor('#ffffff')
    .setRanges([streakRange])
    .build();
  var rules3 = sheet.getConditionalFormatRules();
  rules3.push(streakRule);
  sheet.setConditionalFormatRules(rules3);

  // Whoop Recovery conditional formatting (red < 34, yellow 34-66, green 67+)
  var recoveryRange = sheet.getRange(2, DL.WHOOP_RECOVERY, 500, 1);
  var recRed = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberLessThan(34)
    .setBackground(COLORS.ATTR_LOW)
    .setRanges([recoveryRange]).build();
  var recYellow = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberBetween(34, 66)
    .setBackground(COLORS.ATTR_MED)
    .setRanges([recoveryRange]).build();
  var recGreen = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberGreaterThan(66)
    .setBackground(COLORS.ATTR_HIGH)
    .setRanges([recoveryRange]).build();
  var whoopRules = sheet.getConditionalFormatRules();
  whoopRules.push(recRed, recYellow, recGreen);
  sheet.setConditionalFormatRules(whoopRules);

  // Whoop Sleep conditional formatting (same thresholds)
  var sleepRange = sheet.getRange(2, DL.WHOOP_SLEEP, 500, 1);
  var sleepRed = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberLessThan(70).setBackground(COLORS.ATTR_LOW).setRanges([sleepRange]).build();
  var sleepGreen = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberGreaterThanOrEqualTo(85).setBackground(COLORS.ATTR_HIGH).setRanges([sleepRange]).build();
  var whoopRules2 = sheet.getConditionalFormatRules();
  whoopRules2.push(sleepRed, sleepGreen);
  sheet.setConditionalFormatRules(whoopRules2);

  // Diet score conditional formatting (1-2 red, 3 yellow, 4-5 green)
  var dietRange = sheet.getRange(2, DL.DIET_SCORE, 500, 1);
  var dietLow = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberLessThanOrEqualTo(2).setBackground(COLORS.ATTR_LOW).setRanges([dietRange]).build();
  var dietMed = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberBetween(3, 3).setBackground(COLORS.ATTR_MED).setRanges([dietRange]).build();
  var dietHigh = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberGreaterThanOrEqualTo(4).setBackground(COLORS.ATTR_HIGH).setRanges([dietRange]).build();
  var dietRules = sheet.getConditionalFormatRules();
  dietRules.push(dietLow, dietMed, dietHigh);
  sheet.setConditionalFormatRules(dietRules);

  // Hide Notes column
  sheet.hideColumns(DL.NOTES);

  // Protect calculated columns
  var protectedCols = [DL.HABITS_SCORE, DL.ATTR_AVG, DL.XP_EARNED, DL.TOTAL_XP, DL.STREAK];
  // Note: we don't hard-protect since formulas handle this

  sheet.setTabColor('#4caf50');
}

// ============================================================
// DASHBOARD SHEET  (green + white game-style layout)
//
// Row map:
//  1: Title bar          6: Player card       11: Day headers
//  2: Date               7: XP sparkline      12-18: Habit rows
//  3-4: Wisdom           8: Streak            19: Score row
//  5: spacer             9: spacer            20: spacer
//                        10: Week header      21: Boss Battles header
//  22: 6-Pack bar        26: Char Stats hdr   30: Achievements hdr
//  23: $30K bar          27: Attr labels      31-33: Badge rows
//  24: $100K bar         28: Attr values      34: spacer
//  25: spacer            29: spacer           35: Weekly XP hdr
//                                             36: XP total
// ============================================================
function setupDashboardSheet(ss) {
  var sheet = ss.getSheetByName(SHEET_NAMES.DASHBOARD) || ss.insertSheet(SHEET_NAMES.DASHBOARD);
  sheet.clear();

  // ---- COLUMN WIDTHS ----
  sheet.setColumnWidth(1, 18);    // A: spacer
  sheet.setColumnWidth(2, 155);   // B: habit names / labels
  sheet.setColumnWidth(3, 60);    // C: Mon
  sheet.setColumnWidth(4, 60);    // D: Tue
  sheet.setColumnWidth(5, 60);    // E: Wed
  sheet.setColumnWidth(6, 60);    // F: Thu
  sheet.setColumnWidth(7, 60);    // G: Fri
  sheet.setColumnWidth(8, 60);    // H: Sat
  sheet.setColumnWidth(9, 60);    // I: Sun
  sheet.setColumnWidth(10, 65);   // J: week score / totals
  sheet.setColumnWidth(11, 18);   // K: spacer

  // Base white background
  sheet.getRange('A1:K45').setBackground('#ffffff');

  // ---- ROW 1: TITLE BAR ----
  sheet.getRange('B1:J1').merge()
    .setValue('\u26a1  PRODUCTIVITY PLAYBOOK')
    .setBackground(COLORS.HEADER_BG)
    .setFontColor('#ffffff')
    .setFontSize(18).setFontWeight('bold')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  sheet.setRowHeight(1, 52);

  // ---- ROW 2: DATE (dynamic) ----
  sheet.getRange('B2:J2').merge()
    .setBackground(COLORS.LIGHT_GREEN)
    .setFontSize(11).setFontWeight('bold').setFontColor(COLORS.DARK_GREEN)
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  sheet.setRowHeight(2, 28);

  // ---- ROWS 3-4: WISDOM (dynamic) ----
  sheet.getRange('B3:J4').merge()
    .setBackground('#fff8e1')
    .setFontSize(9).setFontStyle('italic').setFontColor('#5d4037')
    .setHorizontalAlignment('center').setVerticalAlignment('middle').setWrap(true);
  sheet.setRowHeight(3, 22);
  sheet.setRowHeight(4, 22);

  // ---- ROW 5: SPACER ----
  sheet.getRange('A5:K5').setBackground(COLORS.LIGHT_GREEN);
  sheet.setRowHeight(5, 8);

  // ---- ROW 6: PLAYER CARD (dynamic) ----
  sheet.getRange('B6:J6').merge()
    .setBackground(COLORS.DARK_GREEN).setFontColor(COLORS.ACCENT_GOLD)
    .setFontSize(13).setFontWeight('bold')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  sheet.setRowHeight(6, 38);

  // ---- ROW 7: XP PROGRESS BAR (dynamic sparkline) ----
  sheet.getRange('B7:J7').merge().setBackground(COLORS.HEADER_BG);
  sheet.setRowHeight(7, 16);

  // ---- ROW 8: STREAK (dynamic) ----
  sheet.getRange('B8:J8').merge()
    .setBackground(COLORS.LIGHT_GREEN).setFontSize(11).setFontWeight('bold')
    .setFontColor(COLORS.DARK_GREEN)
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  sheet.setRowHeight(8, 28);

  // ---- ROW 9: SPACER ----
  sheet.getRange('A9:K9').setBackground('#ffffff');
  sheet.setRowHeight(9, 8);

  // ---- ROW 10: SECTION — THIS WEEK'S HABITS ----
  sheet.getRange('B10:J10').merge()
    .setValue('\ud83d\udcc5  THIS WEEK\'S HABITS')
    .setBackground(COLORS.HEADER_BG).setFontColor('#ffffff')
    .setFontSize(11).setFontWeight('bold')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  sheet.setRowHeight(10, 30);

  // ---- ROW 11: DAY COLUMN HEADERS ----
  sheet.getRange('B11').setValue('HABIT')
    .setBackground(COLORS.MED_GREEN).setFontColor('#ffffff')
    .setFontWeight('bold').setFontSize(9)
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  for (var d = 3; d <= 9; d++) {
    sheet.getRange(11, d)
      .setBackground('#c8e6c9').setFontColor(COLORS.DARK_GREEN)
      .setFontWeight('bold').setFontSize(9)
      .setHorizontalAlignment('center').setVerticalAlignment('middle').setWrap(true);
  }
  sheet.getRange('J11').setValue('WEEK')
    .setBackground(COLORS.MED_GREEN).setFontColor('#ffffff')
    .setFontWeight('bold').setFontSize(9)
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  sheet.setRowHeight(11, 36);

  // ---- ROWS 12-18: HABIT ROWS (one per habit) ----
  for (var h = 0; h < HABITS.length; h++) {
    var row = 12 + h;
    var rowBg = (h % 2 === 0) ? COLORS.ROW_EVEN : COLORS.ROW_ODD;
    sheet.getRange(row, 2).setValue(HABITS[h])
      .setBackground(rowBg).setFontSize(10).setFontColor(COLORS.DARK_GREEN)
      .setHorizontalAlignment('left').setVerticalAlignment('middle');
    for (var d2 = 3; d2 <= 9; d2++) {
      sheet.getRange(row, d2).setBackground(rowBg).setHorizontalAlignment('center');
    }
    sheet.getRange(row, 10).setBackground(rowBg).setHorizontalAlignment('center');
    sheet.setRowHeight(row, 28);
  }

  // ---- ROW 19: SCORE ROW ----
  sheet.getRange('B19').setValue('SCORE')
    .setBackground(COLORS.MED_GREEN).setFontColor('#ffffff')
    .setFontWeight('bold').setFontSize(10)
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  for (var d3 = 3; d3 <= 10; d3++) {
    sheet.getRange(19, d3).setBackground(COLORS.LIGHT_GREEN);
  }
  sheet.setRowHeight(19, 26);

  // ---- ROW 20: SPACER ----
  sheet.getRange('A20:K20').setBackground('#ffffff');
  sheet.setRowHeight(20, 8);

  // ---- ROW 21: BOSS BATTLES HEADER ----
  sheet.getRange('B21:J21').merge()
    .setValue('\u2694\ufe0f  BOSS BATTLES')
    .setBackground(COLORS.HEADER_BG).setFontColor('#ffffff')
    .setFontSize(11).setFontWeight('bold')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  sheet.setRowHeight(21, 30);

  // Rows 22-24: Goal progress bars (dynamic — Courier New for bar chars)
  for (var g = 22; g <= 24; g++) {
    sheet.getRange('B' + g + ':J' + g).merge()
      .setBackground('#fafafa').setFontSize(10).setFontFamily('Courier New')
      .setHorizontalAlignment('left').setVerticalAlignment('middle');
    sheet.setRowHeight(g, 26);
  }

  // ---- ROW 25: SPACER ----
  sheet.getRange('A25:K25').setBackground('#ffffff');
  sheet.setRowHeight(25, 8);

  // ---- ROW 26: CHARACTER STATS HEADER ----
  sheet.getRange('B26:J26').merge()
    .setValue('\ud83e\udde0  CHARACTER STATS  (7-day avg)')
    .setBackground(COLORS.HEADER_BG).setFontColor('#ffffff')
    .setFontSize(11).setFontWeight('bold')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  sheet.setRowHeight(26, 30);

  // Row 27: Attribute labels (static, 6 attributes in cols B-G)
  for (var ai = 0; ai < ATTRIBUTES.length; ai++) {
    sheet.getRange(27, 2 + ai)
      .setValue(ATTRIBUTES[ai])
      .setBackground(COLORS.LIGHT_GREEN).setFontSize(9).setFontWeight('bold')
      .setFontColor(COLORS.DARK_GREEN)
      .setHorizontalAlignment('center').setVerticalAlignment('middle').setWrap(true);
  }
  sheet.setRowHeight(27, 30);

  // Row 28: Attribute values (dynamic)
  for (var ai2 = 0; ai2 < ATTRIBUTES.length; ai2++) {
    sheet.getRange(28, 2 + ai2)
      .setBackground('#f5f5f5').setFontSize(10).setFontWeight('bold')
      .setHorizontalAlignment('center').setVerticalAlignment('middle').setWrap(true);
  }
  sheet.setRowHeight(28, 40);

  // ---- ROW 29: SPACER ----
  sheet.getRange('A29:K29').setBackground('#ffffff');
  sheet.setRowHeight(29, 8);

  // ---- ROW 30: ACHIEVEMENTS HEADER ----
  sheet.getRange('B30:J30').merge()
    .setValue('\ud83c\udfc6  RECENT ACHIEVEMENTS')
    .setBackground(COLORS.HEADER_BG).setFontColor('#ffffff')
    .setFontSize(11).setFontWeight('bold')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  sheet.setRowHeight(30, 30);

  // Rows 31-33: Badge rows (dynamic)
  for (var br = 31; br <= 33; br++) {
    sheet.getRange('B' + br + ':J' + br).merge()
      .setBackground('#f5f5f5').setFontSize(10).setHorizontalAlignment('center');
    sheet.setRowHeight(br, 26);
  }

  // ---- ROW 34: SPACER ----
  sheet.getRange('A34:K34').setBackground('#ffffff');
  sheet.setRowHeight(34, 8);

  // ---- ROW 35: WEEKLY XP HEADER ----
  sheet.getRange('B35:J35').merge()
    .setValue('\ud83d\udcc8  THIS WEEK\'S XP')
    .setBackground(COLORS.HEADER_BG).setFontColor('#ffffff')
    .setFontSize(11).setFontWeight('bold')
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  sheet.setRowHeight(35, 30);

  // Row 36: XP total (dynamic)
  sheet.getRange('B36:J36').merge()
    .setBackground(COLORS.LIGHT_GREEN).setFontSize(11).setFontWeight('bold')
    .setFontColor(COLORS.DARK_GREEN)
    .setHorizontalAlignment('center').setVerticalAlignment('middle');
  sheet.setRowHeight(36, 28);

  sheet.setTabColor(COLORS.HEADER_BG);

  // Move Dashboard to first position
  ss.setActiveSheet(sheet);
  ss.moveActiveSheet(1);
}

// ============================================================
// WEEKLY REVIEW SHEET
// ============================================================
function setupWeeklyReviewSheet(ss) {
  var sheet = ss.getSheetByName(SHEET_NAMES.WEEKLY_REVIEW) || ss.insertSheet(SHEET_NAMES.WEEKLY_REVIEW);
  sheet.clear();

  var headers = [
    'Week Starting',
    'Habits Done',
    'Possible',
    'Completion %',
    'MRR Start',
    'MRR End',
    'MRR Growth',
    'Growth %',
    'Avg Discipline',
    'Avg Focus',
    'Avg Confidence',
    'Avg Deen',
    'Avg Toughness',
    'Avg Reliability',
    'Weight Change',
    'Streak',
    'XP Earned',
    'What Worked',
    'What Didn\'t',
    'Next Week Focus',
    'Muhasaba (Self-Reflection)',
    'Bonus XP'
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground(COLORS.HEADER_BG)
    .setFontColor(COLORS.HEADER_TEXT)
    .setFontWeight('bold')
    .setFontSize(9)
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle')
    .setWrap(true);
  sheet.setRowHeight(1, 45);
  sheet.setFrozenRows(1);

  // Column widths
  sheet.setColumnWidth(1, 100);   // Week Starting
  sheet.setColumnWidth(2, 70);    // Habits Done
  sheet.setColumnWidth(3, 65);    // Possible
  sheet.setColumnWidth(4, 80);    // Completion %
  sheet.setColumnWidth(5, 80);    // MRR Start
  sheet.setColumnWidth(6, 80);    // MRR End
  sheet.setColumnWidth(7, 80);    // MRR Growth
  sheet.setColumnWidth(8, 70);    // Growth %
  for (var c = 9; c <= 14; c++) {
    sheet.setColumnWidth(c, 75);  // Attribute averages
  }
  sheet.setColumnWidth(15, 80);   // Weight Change
  sheet.setColumnWidth(16, 55);   // Streak
  sheet.setColumnWidth(17, 70);   // XP Earned
  sheet.setColumnWidth(18, 200);  // What Worked
  sheet.setColumnWidth(19, 200);  // What Didn't
  sheet.setColumnWidth(20, 200);  // Next Week Focus
  sheet.setColumnWidth(21, 250);  // Muhasaba
  sheet.setColumnWidth(22, 60);   // Bonus XP

  // Formats
  sheet.getRange(2, 1, 200, 1).setNumberFormat('MMM d');
  sheet.getRange(2, 4, 200, 1).setNumberFormat('0%');
  sheet.getRange(2, 5, 200, 2).setNumberFormat('$#,##0');
  sheet.getRange(2, 7, 200, 1).setNumberFormat('$#,##0');
  sheet.getRange(2, 8, 200, 1).setNumberFormat('0.0%');

  // Completion % conditional formatting
  var compRange = sheet.getRange(2, 4, 200, 1);
  var compRuleLow = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberLessThan(0.5)
    .setBackground(COLORS.ATTR_LOW)
    .setRanges([compRange])
    .build();
  var compRuleMed = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberBetween(0.5, 0.79)
    .setBackground(COLORS.ATTR_MED)
    .setRanges([compRange])
    .build();
  var compRuleHigh = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberGreaterThanOrEqualTo(0.8)
    .setBackground(COLORS.ATTR_HIGH)
    .setRanges([compRange])
    .build();
  sheet.setConditionalFormatRules([compRuleLow, compRuleMed, compRuleHigh]);

  sheet.setTabColor(COLORS.ACCENT_BLUE);
}

// ============================================================
// CHARTS SHEET
// ============================================================
function setupChartsSheet(ss) {
  var sheet = ss.getSheetByName(SHEET_NAMES.CHARTS) || ss.insertSheet(SHEET_NAMES.CHARTS);
  sheet.clear();

  // Charts are created by Charts.js after data exists
  sheet.getRange('A1').setValue('Charts will appear here after you log your first few days of data.')
    .setFontSize(12)
    .setFontColor('#888888');

  sheet.getRange('A3').setValue('Go to Playbook menu > Refresh Charts to generate them.')
    .setFontSize(10)
    .setFontColor('#888888');

  sheet.setTabColor('#9c27b0');
}

// ============================================================
// ACHIEVEMENTS SHEET
// ============================================================
function setupAchievementsSheet(ss) {
  var sheet = ss.getSheetByName(SHEET_NAMES.ACHIEVEMENTS) || ss.insertSheet(SHEET_NAMES.ACHIEVEMENTS);
  sheet.clear();

  var headers = ['Icon', 'Badge Name', 'Description', 'Category', 'XP Reward', 'Date Earned', 'Earned?'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground(COLORS.HEADER_BG)
    .setFontColor(COLORS.HEADER_TEXT)
    .setFontWeight('bold')
    .setHorizontalAlignment('center');
  sheet.setFrozenRows(1);

  sheet.setColumnWidth(1, 40);   // Icon
  sheet.setColumnWidth(2, 180);  // Badge Name
  sheet.setColumnWidth(3, 300);  // Description
  sheet.setColumnWidth(4, 100);  // Category
  sheet.setColumnWidth(5, 70);   // XP Reward
  sheet.setColumnWidth(6, 100);  // Date Earned
  sheet.setColumnWidth(7, 60);   // Earned?

  // Pre-populate all achievements
  var badges = getAchievementDefinitions();
  var data = badges.map(function(b) {
    return [b.icon, b.name, b.description, b.category, b.xp, '', false];
  });

  if (data.length > 0) {
    sheet.getRange(2, 1, data.length, 7).setValues(data);
  }

  // Checkbox for Earned column
  sheet.getRange(2, 7, data.length, 1).insertCheckboxes();

  // Conditional formatting: earned badges get gold background
  var earnedRange = sheet.getRange(2, 1, data.length, 7);
  var earnedRule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=$G2=TRUE')
    .setBackground('#fff8e1')
    .setRanges([earnedRange])
    .build();
  sheet.setConditionalFormatRules([earnedRule]);

  // Date format
  sheet.getRange(2, 6, data.length, 1).setNumberFormat('MMM d, yyyy');

  sheet.setTabColor(COLORS.ACCENT_GOLD);
}

// ============================================================
// WISDOM SHEET
// ============================================================
function setupWisdomSheet(ss) {
  var sheet = ss.getSheetByName(SHEET_NAMES.WISDOM) || ss.insertSheet(SHEET_NAMES.WISDOM);
  sheet.clear();

  var headers = ['Text', 'Source', 'Category', 'Trigger'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground(COLORS.HEADER_BG)
    .setFontColor(COLORS.HEADER_TEXT)
    .setFontWeight('bold')
    .setHorizontalAlignment('center');
  sheet.setFrozenRows(1);

  sheet.setColumnWidth(1, 500);  // Text
  sheet.setColumnWidth(2, 200);  // Source
  sheet.setColumnWidth(3, 120);  // Category
  sheet.setColumnWidth(4, 100);  // Trigger

  // Populate with wisdom pool
  var data = getWisdomSheetData();
  if (data.length > 0) {
    sheet.getRange(2, 1, data.length, 4).setValues(data);
  }

  // Wrap text column
  sheet.getRange(2, 1, data.length, 1).setWrap(true);

  sheet.setTabColor('#00695c');
}

// ============================================================
// CONFIG SHEET
// ============================================================
function setupConfigSheet(ss) {
  var sheet = ss.getSheetByName(SHEET_NAMES.CONFIG) || ss.insertSheet(SHEET_NAMES.CONFIG);
  sheet.clear();

  // Section: Habits
  sheet.getRange('A1').setValue('HABITS').setFontWeight('bold').setFontSize(12);
  for (var i = 0; i < HABITS.length; i++) {
    sheet.getRange(i + 2, 1).setValue('Habit ' + (i + 1));
    sheet.getRange(i + 2, 2).setValue(HABITS[i]);
  }

  // Section: Attributes
  var attrStart = HABITS.length + 3;
  sheet.getRange(attrStart, 1).setValue('ATTRIBUTES').setFontWeight('bold').setFontSize(12);
  for (var j = 0; j < ATTRIBUTES.length; j++) {
    sheet.getRange(attrStart + j + 1, 1).setValue('Attribute ' + (j + 1));
    sheet.getRange(attrStart + j + 1, 2).setValue(ATTRIBUTES[j]);
  }

  // Section: XP Values
  var xpStart = attrStart + ATTRIBUTES.length + 2;
  sheet.getRange(xpStart, 1).setValue('XP VALUES').setFontWeight('bold').setFontSize(12);
  var xpConfig = [
    ['XP per Habit', XP_PER_HABIT],
    ['Perfect Day Bonus', PERFECT_DAY_BONUS],
    ['XP per Attribute', XP_PER_ATTRIBUTE],
    ['All Attributes Bonus', ALL_ATTRIBUTES_BONUS],
    ['Log MRR XP', MRR_LOG_XP],
    ['Log Weight XP', WEIGHT_LOG_XP],
    ['Win of Day XP', WIN_OF_DAY_XP],
    ['Weekly Review XP', WEEKLY_REVIEW_XP]
  ];
  for (var x = 0; x < xpConfig.length; x++) {
    sheet.getRange(xpStart + x + 1, 1).setValue(xpConfig[x][0]);
    sheet.getRange(xpStart + x + 1, 2).setValue(xpConfig[x][1]);
  }

  // Section: Goals
  var goalStart = xpStart + xpConfig.length + 2;
  sheet.getRange(goalStart, 1).setValue('GOALS').setFontWeight('bold').setFontSize(12);
  sheet.getRange(goalStart + 1, 1).setValue('$30k MRR Deadline');
  sheet.getRange(goalStart + 1, 2).setValue(GOALS.mrr30k.deadline);
  sheet.getRange(goalStart + 2, 1).setValue('$100k MRR Deadline');
  sheet.getRange(goalStart + 2, 2).setValue(GOALS.mrr100k.deadline);
  sheet.getRange(goalStart + 3, 1).setValue('Body Fat Target %');
  sheet.getRange(goalStart + 3, 2).setValue(GOALS.sixPack.targetBodyFat);

  // Section: Streak
  var streakStart = goalStart + 5;
  sheet.getRange(streakStart, 1).setValue('STREAK CONFIG').setFontWeight('bold').setFontSize(12);
  sheet.getRange(streakStart + 1, 1).setValue('Initial Freezes');
  sheet.getRange(streakStart + 1, 2).setValue(INITIAL_STREAK_FREEZES);
  sheet.getRange(streakStart + 2, 1).setValue('Max Freezes');
  sheet.getRange(streakStart + 2, 2).setValue(MAX_STREAK_FREEZES);
  sheet.getRange(streakStart + 3, 1).setValue('Freeze XP Cost');
  sheet.getRange(streakStart + 3, 2).setValue(STREAK_FREEZE_XP_COST);

  // Section: Level Thresholds (first 15 levels as reference)
  var lvlStart = streakStart + 5;
  sheet.getRange(lvlStart, 1).setValue('LEVEL THRESHOLDS').setFontWeight('bold').setFontSize(12);
  sheet.getRange(lvlStart, 3).setValue('Title');
  for (var lvl = 1; lvl <= 20; lvl++) {
    sheet.getRange(lvlStart + lvl, 1).setValue('Level ' + lvl);
    sheet.getRange(lvlStart + lvl, 2).setValue(getLevelXP(lvl));
    sheet.getRange(lvlStart + lvl, 3).setValue(getLevelTitle(lvl));
  }

  // Formatting
  sheet.setColumnWidth(1, 180);
  sheet.setColumnWidth(2, 150);
  sheet.setColumnWidth(3, 120);

  sheet.setTabColor('#78909c');
}

// ============================================================
// DATA SHEET (hidden backend)
// ============================================================
function setupDataSheet(ss) {
  var sheet = ss.getSheetByName(SHEET_NAMES.DATA) || ss.insertSheet(SHEET_NAMES.DATA);
  sheet.clear();

  // Streak freeze tracking
  sheet.getRange('A1').setValue('STREAK FREEZE LOG').setFontWeight('bold');
  sheet.getRange('A2').setValue('Date');
  sheet.getRange('B2').setValue('Action');
  sheet.getRange('C2').setValue('Freezes Remaining');

  // Initialize with starting freezes
  sheet.getRange('A3').setValue(new Date());
  sheet.getRange('B3').setValue('Initial');
  sheet.getRange('C3').setValue(INITIAL_STREAK_FREEZES);

  // Phoenix tracking
  sheet.getRange('E1').setValue('PHOENIX STATUS').setFontWeight('bold');
  sheet.getRange('E2').setValue('Active?');
  sheet.getRange('F2').setValue(false);
  sheet.getRange('E3').setValue('Days Remaining');
  sheet.getRange('F3').setValue(0);
  sheet.getRange('E4').setValue('Activated Date');
  sheet.getRange('F4').setValue('');

  // MRR milestones reached
  sheet.getRange('H1').setValue('MRR MILESTONES').setFontWeight('bold');
  sheet.getRange('H2').setValue('Milestone');
  sheet.getRange('I2').setValue('Date Reached');
  for (var m = 0; m < MRR_MILESTONES.length; m++) {
    sheet.getRange(m + 3, 8).setValue(MRR_MILESTONES[m]);
    sheet.getRange(m + 3, 9).setValue('');
  }

  // Hide the sheet
  sheet.hideSheet();

  sheet.setTabColor('#455a64');
}

// ============================================================
// BODY COMP SHEET
// ============================================================
function setupBodyCompSheet(ss) {
  var sheet = ss.getSheetByName(SHEET_NAMES.BODY_COMP) || ss.insertSheet(SHEET_NAMES.BODY_COMP);
  sheet.clear();

  var headers = ['Date', 'AM Weight', 'PM Weight', 'Daily Avg', '7-Day Avg', '\u0394 Delta', 'Body Fat %', 'Lean Mass', 'Notes'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // Header formatting
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground(COLORS.HEADER_BG)
    .setFontColor(COLORS.HEADER_TEXT)
    .setFontWeight('bold')
    .setFontSize(10)
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle')
    .setWrap(true);
  sheet.setRowHeight(1, 40);
  sheet.setFrozenRows(1);

  // Column widths
  sheet.setColumnWidth(BC.DATE, 90);
  sheet.setColumnWidth(BC.AM_WEIGHT, 90);
  sheet.setColumnWidth(BC.PM_WEIGHT, 90);
  sheet.setColumnWidth(BC.DAILY_AVG, 85);
  sheet.setColumnWidth(BC.SEVEN_DAY_AVG, 85);
  sheet.setColumnWidth(BC.DELTA, 75);
  sheet.setColumnWidth(BC.BODY_FAT, 80);
  sheet.setColumnWidth(BC.LEAN_MASS, 80);
  sheet.setColumnWidth(BC.NOTES, 200);

  // Number formats
  sheet.getRange(2, BC.DATE, 500, 1).setNumberFormat('MMM d');
  sheet.getRange(2, BC.AM_WEIGHT, 500, 1).setNumberFormat('0.0');
  sheet.getRange(2, BC.PM_WEIGHT, 500, 1).setNumberFormat('0.0');
  sheet.getRange(2, BC.DAILY_AVG, 500, 1).setNumberFormat('0.0');
  sheet.getRange(2, BC.SEVEN_DAY_AVG, 500, 1).setNumberFormat('0.0');
  sheet.getRange(2, BC.DELTA, 500, 1).setNumberFormat('+0.0;-0.0;0.0');
  sheet.getRange(2, BC.BODY_FAT, 500, 1).setNumberFormat('0.0');
  sheet.getRange(2, BC.LEAN_MASS, 500, 1).setNumberFormat('0.0');

  // Delta conditional formatting: green negative (losing), red positive (gaining)
  var deltaRange = sheet.getRange(2, BC.DELTA, 500, 1);
  var deltaDown = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberLessThan(0).setBackground(COLORS.ACCENT_GREEN).setFontColor('#ffffff')
    .setRanges([deltaRange]).build();
  var deltaUp = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberGreaterThan(0.5).setBackground(COLORS.ACCENT_RED).setFontColor('#ffffff')
    .setRanges([deltaRange]).build();
  sheet.setConditionalFormatRules([deltaDown, deltaUp]);

  // Body fat conditional formatting
  var bfRange = sheet.getRange(2, BC.BODY_FAT, 500, 1);
  var bfHigh = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberGreaterThan(18).setBackground(COLORS.ATTR_LOW).setRanges([bfRange]).build();
  var bfMed = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberBetween(14, 18).setBackground(COLORS.ATTR_MED).setRanges([bfRange]).build();
  var bfLow = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberLessThanOrEqualTo(14).setBackground(COLORS.ATTR_HIGH).setRanges([bfRange]).build();
  var bfRules = sheet.getConditionalFormatRules();
  bfRules.push(bfHigh, bfMed, bfLow);
  sheet.setConditionalFormatRules(bfRules);

  // Add target reference row at top
  sheet.getRange(2, BC.DATE).setValue('TARGET').setFontWeight('bold').setFontColor(COLORS.ACCENT_GOLD);
  sheet.getRange(2, BC.DAILY_AVG).setValue(CUT.TARGET_WEIGHT).setFontWeight('bold').setFontColor(COLORS.ACCENT_GOLD);
  sheet.getRange(2, BC.BODY_FAT).setValue(CUT.TARGET_BF).setFontWeight('bold').setFontColor(COLORS.ACCENT_GOLD);
  sheet.getRange(2, BC.NOTES).setValue('Goal: ' + CUT.TARGET_WEIGHT + ' lb at ' + CUT.TARGET_BF + '% BF = visible 6-pack')
    .setFontWeight('bold').setFontColor(COLORS.ACCENT_GOLD);

  // Starting measurement row
  sheet.getRange(3, BC.DATE).setValue(new Date()).setNumberFormat('MMM d');
  sheet.getRange(3, BC.AM_WEIGHT).setValue(CUT.START_WEIGHT);
  sheet.getRange(3, BC.BODY_FAT).setValue(CUT.START_BF);
  sheet.getRange(3, BC.DAILY_AVG).setFormula('=' + colLetter(BC.AM_WEIGHT) + '3');
  sheet.getRange(3, BC.SEVEN_DAY_AVG).setFormula('=' + colLetter(BC.DAILY_AVG) + '3');
  sheet.getRange(3, BC.LEAN_MASS)
    .setFormula('=' + colLetter(BC.DAILY_AVG) + '3*(1-' + colLetter(BC.BODY_FAT) + '3/100)');
  sheet.getRange(3, BC.NOTES).setValue('Starting point');

  sheet.setTabColor('#e65100');
}

// ============================================================
// MEALS SHEET
// Structure:
//   Section 1 — Daily Eating Schedule (strict framework, top)
//   Section 2 — 7-Day Rotating Meal Plans (the variety)
//   Section 3 — Shopping List
//   Section 4 — Chicken Recipes (all air fryer)
// ============================================================
function setupMealsSheet(ss) {
  var sheet = ss.getSheetByName(SHEET_NAMES.MEALS) || ss.insertSheet(SHEET_NAMES.MEALS);
  sheet.clear();

  // Column widths (set first so content lays out correctly)
  sheet.setColumnWidth(1, 260);   // Food / timing description
  sheet.setColumnWidth(2, 90);    // Portion
  sheet.setColumnWidth(3, 55);    // Cal
  sheet.setColumnWidth(4, 60);    // Protein
  sheet.setColumnWidth(5, 55);    // Carbs
  sheet.setColumnWidth(6, 50);    // Fat
  sheet.setColumnWidth(7, 85);    // Running total
  sheet.setColumnWidth(8, 280);   // Notes

  // ── SECTION 1: DAILY EATING SCHEDULE ────────────────────────────────
  var nextRow = writeDailyScheduleSection(sheet);

  // ── SECTION 2: 7-DAY COMPLETE EATING CARDS ──────────────────────────
  nextRow++;
  nextRow = writeDayVarietySection(sheet, nextRow);

  // ── SECTION 3: FAST TRACK ACCELERATOR ───────────────────────────────
  nextRow++;
  nextRow = writeFastTrackSection(sheet, nextRow);

  // Section divider before detailed plans
  nextRow++;
  sheet.getRange(nextRow, 1, 1, 8).merge()
    .setValue('\ud83d\udd04  7-DAY ROTATING MAIN MEAL PLANS \u2014 Full component breakdown by day')
    .setBackground('#2e7d32').setFontColor('#ffffff')
    .setFontSize(12).setFontWeight('bold').setHorizontalAlignment('center');
  sheet.setRowHeight(nextRow, 32);
  nextRow++;

  // Column headers for meal plan table
  var mealHeaders = ['Food', 'Amount', 'Cal', 'Protein (g)', 'Carbs (g)', 'Fat (g)', 'Air Fryer', 'Notes'];
  sheet.getRange(nextRow, 1, 1, 8).setValues([mealHeaders])
    .setFontWeight('bold').setBackground('#f5f5f5')
    .setHorizontalAlignment('center').setFontSize(9);
  sheet.setRowHeight(nextRow, 20);
  nextRow++;

  // ── SECTION 2: 7-DAY MEAL PLANS ─────────────────────────────────────
  var meals = getMealPlanData();
  for (var m = 0; m < meals.length; m++) {
    var meal = meals[m];

    // Day header
    sheet.getRange(nextRow, 1, 1, 8).merge()
      .setValue(meal.day + ': ' + meal.name)
      .setBackground(COLORS.DARK_GREEN).setFontColor(COLORS.ACCENT_GOLD)
      .setFontWeight('bold').setFontSize(11).setHorizontalAlignment('center');
    sheet.setRowHeight(nextRow, 28);
    nextRow++;

    // Components
    var totalCal = 0, totalP = 0, totalC = 0, totalF = 0;
    for (var ci = 0; ci < meal.components.length; ci++) {
      var comp = meal.components[ci];
      var rowBg = ci % 2 === 0 ? '#f9fbe7' : '#ffffff';
      sheet.getRange(nextRow, 1).setValue(comp.food).setBackground(rowBg).setFontSize(9).setWrap(true);
      sheet.getRange(nextRow, 2).setValue(comp.amount).setBackground(rowBg).setFontSize(9).setHorizontalAlignment('center');
      sheet.getRange(nextRow, 3).setValue(comp.cal).setBackground(rowBg).setFontSize(9).setHorizontalAlignment('center');
      sheet.getRange(nextRow, 4).setValue(comp.p).setBackground(rowBg).setFontSize(9).setHorizontalAlignment('center');
      sheet.getRange(nextRow, 5).setValue(comp.c).setBackground(rowBg).setFontSize(9).setHorizontalAlignment('center');
      sheet.getRange(nextRow, 6).setValue(comp.f).setBackground(rowBg).setFontSize(9).setHorizontalAlignment('center');
      sheet.getRange(nextRow, 7).setValue(comp.airFryer).setBackground(rowBg).setFontSize(8).setFontColor('#666666').setWrap(true);
      sheet.setRowHeight(nextRow, 18);
      totalCal += comp.cal;  totalP += comp.p;
      totalC += comp.c;      totalF += comp.f;
      nextRow++;
    }

    // Day total
    sheet.getRange(nextRow, 1).setValue('DAY TOTAL').setFontWeight('bold').setBackground('#fff3e0');
    sheet.getRange(nextRow, 3).setValue(Math.round(totalCal)).setFontWeight('bold').setBackground('#fff3e0');
    sheet.getRange(nextRow, 4).setValue(Math.round(totalP)).setFontWeight('bold').setBackground('#fff3e0');
    sheet.getRange(nextRow, 5).setValue(Math.round(totalC)).setFontWeight('bold').setBackground('#fff3e0');
    sheet.getRange(nextRow, 6).setValue(Math.round(totalF)).setFontWeight('bold').setBackground('#fff3e0');
    sheet.getRange(nextRow, 7, 1, 2).merge()
      .setValue('+ Suhoor 426 cal = ~' + Math.round(totalCal + 426) + ' total')
      .setFontSize(8).setFontStyle('italic').setFontColor('#1b5e20').setBackground('#fff3e0');
    sheet.setRowHeight(nextRow, 20);
    nextRow += 2; // gap between days
  }

  // ── SECTION 3: SHOPPING LIST ─────────────────────────────────────────
  nextRow++;
  sheet.getRange(nextRow, 1, 1, 8).merge()
    .setValue('\ud83d\uded2  WEEKLY SHOPPING LIST')
    .setBackground(COLORS.HEADER_BG).setFontColor('#ffffff')
    .setFontWeight('bold').setFontSize(12).setHorizontalAlignment('center');
  sheet.setRowHeight(nextRow, 28);
  nextRow++;

  var shopHeaders2 = ['Item', 'Quantity', 'Category', 'Notes', '', '', '', ''];
  sheet.getRange(nextRow, 1, 1, 8).setValues([shopHeaders2])
    .setFontWeight('bold').setBackground('#f5f5f5').setFontSize(9);
  sheet.setRowHeight(nextRow, 18);
  nextRow++;

  var shopList = getShoppingList();
  var catColors = {
    'Protein': '#e3f2fd', 'Dairy': '#f3e5f5',
    'Vegetables': '#e8f5e9', 'Fruits': '#fff3e0',
    'Nuts': '#fbe9e7', 'Pantry': '#f5f5f5', 'Supplements': '#e0f2f1'
  };
  for (var s = 0; s < shopList.length; s++) {
    var item = shopList[s];
    var bg = catColors[item.category] || '#ffffff';
    sheet.getRange(nextRow, 1).setValue(item.item).setBackground(bg).setFontSize(9);
    sheet.getRange(nextRow, 2).setValue(item.qty).setBackground(bg).setFontSize(9);
    sheet.getRange(nextRow, 3).setValue(item.category).setBackground(bg).setFontSize(9);
    sheet.getRange(nextRow, 4, 1, 5).merge().setValue(item.notes).setBackground(bg).setFontSize(8).setFontColor('#555555');
    sheet.setRowHeight(nextRow, 18);
    nextRow++;
  }

  // ── SECTION 4: CHICKEN RECIPES ───────────────────────────────────────
  nextRow += 2;
  writeChickenRecipesSection(sheet, nextRow);

  sheet.setTabColor('#2e7d32');
}
