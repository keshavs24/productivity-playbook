/**
 * PrayerTracker.js — Individual prayer tracking (5 fard + sunnah + witr)
 * One row per day, 11 prayer checkboxes, auto-syncs "All 5 Prayers" habit
 */

/**
 * Create today's row in the Prayers sheet
 */
function createPrayerRow() {
  var sheet = getSheet(SHEET_NAMES.PRAYERS);
  if (!sheet) return;

  var todayDate = today();
  var existingRow = findPrayerDateRow(sheet, todayDate);
  if (existingRow > 0) return;

  var lastRow = Math.max(sheet.getLastRow(), 1);
  var newRow = lastRow + 1;

  // Date
  sheet.getRange(newRow, PRA.DATE).setValue(todayDate).setNumberFormat('MMM d');

  // Checkboxes for all 11 prayers
  for (var i = 0; i < PRAYERS.length; i++) {
    sheet.getRange(newRow, PRAYERS[i].col).insertCheckboxes();
  }

  // Total formula: count checked prayers
  var firstCol = colLetter(PRA.FAJR_SUNNAH);
  var lastCol = colLetter(PRA.WITR);
  sheet.getRange(newRow, PRA.TOTAL)
    .setFormula('=COUNTIF(' + firstCol + newRow + ':' + lastCol + newRow + ', TRUE)');

  // Completion % formula
  sheet.getRange(newRow, PRA.COMPLETION)
    .setFormula('=' + colLetter(PRA.TOTAL) + newRow + '/' + PRAYERS.length)
    .setNumberFormat('0%');
}

/**
 * Find a date row in the Prayers sheet
 */
function findPrayerDateRow(sheet, targetDate) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return -1;

  var target = stripTime(targetDate);
  var dates = sheet.getRange(2, PRA.DATE, lastRow - 1, 1).getValues();

  for (var i = 0; i < dates.length; i++) {
    if (dates[i][0] instanceof Date && isSameDay(dates[i][0], target)) {
      return i + 2;
    }
  }
  return -1;
}

/**
 * Handle edits in the Prayers sheet
 * When all 5 fard prayers are checked, auto-check "All 5 Prayers" habit in Daily Log
 */
function handlePrayerEdit(e) {
  var sheet = e.source.getActiveSheet();
  var row = e.range.getRow();
  var col = e.range.getColumn();

  if (row < 2) return;

  // Only react to prayer checkbox columns
  if (col < PRA.FAJR_SUNNAH || col > PRA.WITR) return;

  // Check if all 5 fard prayers are done
  var allFard = true;
  for (var i = 0; i < FARD_PRAYER_COLS.length; i++) {
    if (sheet.getRange(row, FARD_PRAYER_COLS[i]).getValue() !== true) {
      allFard = false;
      break;
    }
  }

  // Sync to Daily Log "All 5 Prayers" habit (habit index 1, column DL.HABIT_START + 1)
  var date = sheet.getRange(row, PRA.DATE).getValue();
  if (!(date instanceof Date)) return;

  var dailyLog = getSheet(SHEET_NAMES.DAILY_LOG);
  if (!dailyLog) return;

  var dlRow = findDateRow(dailyLog, date);
  if (dlRow < 0) return;

  // "All 5 Prayers" is the 2nd habit (index 1)
  var prayerHabitCol = DL.HABIT_START + 1;
  dailyLog.getRange(dlRow, prayerHabitCol).setValue(allFard);
}

/**
 * Get prayer summary for a specific date
 */
function getPrayerSummary(date) {
  var sheet = getSheet(SHEET_NAMES.PRAYERS);
  if (!sheet) return null;

  var row = findPrayerDateRow(sheet, date);
  if (row < 0) return null;

  var fardCount = 0;
  var sunnahCount = 0;
  var total = 0;

  for (var i = 0; i < PRAYERS.length; i++) {
    var checked = sheet.getRange(row, PRAYERS[i].col).getValue() === true;
    if (checked) {
      total++;
      if (PRAYERS[i].type === 'fard') fardCount++;
      else sunnahCount++;
    }
  }

  return {
    fard: fardCount,
    sunnah: sunnahCount,
    total: total,
    allFard: fardCount === 5,
    allPrayers: total === PRAYERS.length,
    completion: total / PRAYERS.length
  };
}

/**
 * Calculate prayer XP for a given date
 */
function calculatePrayerXP(date) {
  var summary = getPrayerSummary(date);
  if (!summary) return 0;

  var xp = 0;
  xp += summary.fard * PRAYER_XP_PER_FARD;
  xp += summary.sunnah * PRAYER_XP_PER_SUNNAH;

  if (summary.allFard) xp += PRAYER_ALL_FARD_BONUS;
  if (summary.allPrayers) xp += PRAYER_ALL_PRAYERS_BONUS;

  return xp;
}

/**
 * Setup function for Prayers sheet (called from Setup.js)
 */
function setupPrayersSheet(ss) {
  var sheet = ss.getSheetByName(SHEET_NAMES.PRAYERS) || ss.insertSheet(SHEET_NAMES.PRAYERS);
  sheet.clear();

  // Headers
  var headers = ['Date'];
  for (var i = 0; i < PRAYERS.length; i++) {
    headers.push(PRAYERS[i].name);
  }
  headers.push('Total', 'Completion');

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // Header formatting
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
  sheet.setColumnWidth(PRA.DATE, 90);
  for (var p = PRA.FAJR_SUNNAH; p <= PRA.WITR; p++) {
    sheet.setColumnWidth(p, 65);
  }
  sheet.setColumnWidth(PRA.TOTAL, 55);
  sheet.setColumnWidth(PRA.COMPLETION, 75);

  // Fard prayer headers get gold background to distinguish from sunnah
  for (var f = 0; f < FARD_PRAYER_COLS.length; f++) {
    sheet.getRange(1, FARD_PRAYER_COLS[f])
      .setBackground(COLORS.DARK_GREEN)
      .setFontColor(COLORS.ACCENT_GOLD);
  }

  // Conditional formatting: checked prayers get green, unchecked get light red
  for (var pc = PRA.FAJR_SUNNAH; pc <= PRA.WITR; pc++) {
    var prayerRange = sheet.getRange(2, pc, 500, 1);
    var ruleTrue = SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=' + colLetter(pc) + '2=TRUE')
      .setBackground(COLORS.HABIT_DONE)
      .setRanges([prayerRange])
      .build();
    var ruleFalse = SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=AND(' + colLetter(pc) + '2=FALSE,' + colLetter(PRA.DATE) + '2<>"")')
      .setBackground(COLORS.HABIT_MISSED)
      .setRanges([prayerRange])
      .build();
    var rules = sheet.getConditionalFormatRules();
    rules.push(ruleTrue, ruleFalse);
    sheet.setConditionalFormatRules(rules);
  }

  // Completion % conditional formatting
  var compRange = sheet.getRange(2, PRA.COMPLETION, 500, 1);
  var compLow = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberLessThan(0.5).setBackground(COLORS.ATTR_LOW).setRanges([compRange]).build();
  var compMed = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberBetween(0.5, 0.79).setBackground(COLORS.ATTR_MED).setRanges([compRange]).build();
  var compHigh = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberGreaterThanOrEqualTo(0.8).setBackground(COLORS.ATTR_HIGH).setRanges([compRange]).build();
  var compRules = sheet.getConditionalFormatRules();
  compRules.push(compLow, compMed, compHigh);
  sheet.setConditionalFormatRules(compRules);

  sheet.setTabColor('#00695c');
}
