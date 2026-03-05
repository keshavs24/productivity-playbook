/**
 * BodyComp.js — Body composition tracking with twice-daily weigh-ins
 * AM (morning, post-bathroom, before food) and PM (before bed) weights
 * Calculates rolling averages and syncs daily average to Daily Log
 */

/**
 * Create today's row in the Body Comp sheet
 */
function createBodyCompRow() {
  var sheet = getSheet(SHEET_NAMES.BODY_COMP);
  if (!sheet) return;

  var todayDate = today();
  var existingRow = findDateRow(sheet, todayDate);
  if (existingRow > 0) return; // Already exists

  var lastRow = Math.max(sheet.getLastRow(), 1);
  var newRow = lastRow + 1;

  // Date
  sheet.getRange(newRow, BC.DATE).setValue(todayDate).setNumberFormat('MMM d');

  // Daily Average formula (average of AM + PM if both exist)
  var amCell = colLetter(BC.AM_WEIGHT) + newRow;
  var pmCell = colLetter(BC.PM_WEIGHT) + newRow;
  sheet.getRange(newRow, BC.DAILY_AVG)
    .setFormula('=IFERROR(IF(AND(' + amCell + '<>"",' + pmCell + '<>""),AVERAGE(' + amCell + ',' + pmCell + '),IF(' + amCell + '<>"",' + amCell + ',' + pmCell + ')),"")');

  // 7-day rolling average (of daily averages)
  var avgCol = colLetter(BC.DAILY_AVG);
  if (newRow >= 9) {
    sheet.getRange(newRow, BC.SEVEN_DAY_AVG)
      .setFormula('=IFERROR(AVERAGE(' + avgCol + (newRow - 6) + ':' + avgCol + newRow + '),"")');
  } else {
    sheet.getRange(newRow, BC.SEVEN_DAY_AVG)
      .setFormula('=IFERROR(AVERAGE(' + avgCol + '2:' + avgCol + newRow + '),"")');
  }

  // Delta vs yesterday
  if (newRow > 2) {
    sheet.getRange(newRow, BC.DELTA)
      .setFormula('=IFERROR(' + avgCol + newRow + '-' + avgCol + (newRow - 1) + ',"")');
  }

  // Lean mass formula (weight * (1 - body fat %))
  var bfCell = colLetter(BC.BODY_FAT) + newRow;
  sheet.getRange(newRow, BC.LEAN_MASS)
    .setFormula('=IFERROR(' + avgCol + newRow + '*(1-' + bfCell + '/100),"")');

  // Number formats
  sheet.getRange(newRow, BC.AM_WEIGHT).setNumberFormat('0.0');
  sheet.getRange(newRow, BC.PM_WEIGHT).setNumberFormat('0.0');
  sheet.getRange(newRow, BC.DAILY_AVG).setNumberFormat('0.0');
  sheet.getRange(newRow, BC.SEVEN_DAY_AVG).setNumberFormat('0.0');
  sheet.getRange(newRow, BC.DELTA).setNumberFormat('+0.0;-0.0;0.0');
  sheet.getRange(newRow, BC.BODY_FAT).setNumberFormat('0.0');
  sheet.getRange(newRow, BC.LEAN_MASS).setNumberFormat('0.0');
}

/**
 * Handle edits in Body Comp sheet — sync daily avg to Daily Log
 */
function handleBodyCompEdit(e) {
  var sheet = e.source.getActiveSheet();
  var row = e.range.getRow();
  var col = e.range.getColumn();

  if (row < 2) return;

  // Only sync when AM or PM weight is entered
  if (col === BC.AM_WEIGHT || col === BC.PM_WEIGHT) {
    syncBodyCompToDaily(sheet, row);
  }
}

/**
 * Sync body comp daily average to the Daily Log weight column
 */
function syncBodyCompToDaily(bcSheet, bcRow) {
  var date = bcSheet.getRange(bcRow, BC.DATE).getValue();
  if (!(date instanceof Date)) return;

  // Wait for formula to calculate
  SpreadsheetApp.flush();

  var dailyAvg = bcSheet.getRange(bcRow, BC.DAILY_AVG).getValue();
  var bodyFat = bcSheet.getRange(bcRow, BC.BODY_FAT).getValue();

  if (!dailyAvg || dailyAvg <= 0) return;

  var dailyLog = getSheet(SHEET_NAMES.DAILY_LOG);
  if (!dailyLog) return;

  var dlRow = findDateRow(dailyLog, date);
  if (dlRow < 0) return;

  // Sync weight
  dailyLog.getRange(dlRow, DL.WEIGHT).setValue(Math.round(dailyAvg * 10) / 10);

  // Sync body fat if entered
  if (bodyFat && bodyFat > 0) {
    dailyLog.getRange(dlRow, DL.BODY_FAT).setValue(bodyFat);
  }
}

/**
 * Log a quick AM weight from the menu
 */
function logAMWeight() {
  var ui = SpreadsheetApp.getUi();
  var result = ui.prompt('Morning Weigh-In', 'Enter your AM weight (lb):', ui.ButtonSet.OK_CANCEL);

  if (result.getSelectedButton() !== ui.Button.OK) return;
  var weight = parseFloat(result.getResponseText());
  if (isNaN(weight) || weight < 50 || weight > 500) {
    ui.alert('Invalid weight. Please enter a number between 50-500.');
    return;
  }

  var sheet = getSheet(SHEET_NAMES.BODY_COMP);
  if (!sheet) return;

  createBodyCompRow();
  var row = findDateRow(sheet, today());
  if (row < 0) return;

  sheet.getRange(row, BC.AM_WEIGHT).setValue(weight);
  SpreadsheetApp.flush();

  // Sync to daily log
  syncBodyCompToDaily(sheet, row);

  ui.alert('AM Weight logged: ' + weight + ' lb\n\nTarget: ' + CUT.TARGET_WEIGHT + ' lb');
}

/**
 * Log a quick PM weight from the menu
 */
function logPMWeight() {
  var ui = SpreadsheetApp.getUi();
  var result = ui.prompt('Evening Weigh-In', 'Enter your PM weight (lb):', ui.ButtonSet.OK_CANCEL);

  if (result.getSelectedButton() !== ui.Button.OK) return;
  var weight = parseFloat(result.getResponseText());
  if (isNaN(weight) || weight < 50 || weight > 500) {
    ui.alert('Invalid weight. Please enter a number between 50-500.');
    return;
  }

  var sheet = getSheet(SHEET_NAMES.BODY_COMP);
  if (!sheet) return;

  createBodyCompRow();
  var row = findDateRow(sheet, today());
  if (row < 0) return;

  sheet.getRange(row, BC.PM_WEIGHT).setValue(weight);
  SpreadsheetApp.flush();

  // Sync to daily log
  syncBodyCompToDaily(sheet, row);

  // Show today's delta
  var amWeight = sheet.getRange(row, BC.AM_WEIGHT).getValue();
  var msg = 'PM Weight logged: ' + weight + ' lb';
  if (amWeight && amWeight > 0) {
    var delta = weight - amWeight;
    msg += '\nAM→PM change: ' + (delta > 0 ? '+' : '') + delta.toFixed(1) + ' lb (normal: +2-5 lb from food/water)';
  }
  ui.alert(msg);
}

/**
 * Log body fat from smart scale
 */
function logBodyFat() {
  var ui = SpreadsheetApp.getUi();
  var result = ui.prompt('Body Fat %', 'Enter body fat % from your smart scale:', ui.ButtonSet.OK_CANCEL);

  if (result.getSelectedButton() !== ui.Button.OK) return;
  var bf = parseFloat(result.getResponseText());
  if (isNaN(bf) || bf < 3 || bf > 50) {
    ui.alert('Invalid body fat %. Please enter a number between 3-50.');
    return;
  }

  var sheet = getSheet(SHEET_NAMES.BODY_COMP);
  if (!sheet) return;

  createBodyCompRow();
  var row = findDateRow(sheet, today());
  if (row < 0) return;

  sheet.getRange(row, BC.BODY_FAT).setValue(bf);
  SpreadsheetApp.flush();
  syncBodyCompToDaily(sheet, row);

  var lostSoFar = CUT.START_BF - bf;
  var remaining = bf - CUT.TARGET_BF;
  ui.alert('Body Fat: ' + bf + '%\n' +
    'Lost so far: ' + lostSoFar.toFixed(1) + '% from ' + CUT.START_BF + '%\n' +
    'Remaining to target: ' + remaining.toFixed(1) + '% to ' + CUT.TARGET_BF + '%');
}

/**
 * Get body comp progress summary for dashboard
 */
function getBodyCompSummary() {
  var sheet = getSheet(SHEET_NAMES.BODY_COMP);
  if (!sheet || sheet.getLastRow() < 2) return null;

  var lastRow = sheet.getLastRow();
  var latestAvg = sheet.getRange(lastRow, BC.DAILY_AVG).getValue();
  var sevenDayAvg = sheet.getRange(lastRow, BC.SEVEN_DAY_AVG).getValue();
  var delta = sheet.getRange(lastRow, BC.DELTA).getValue();
  var latestBF = null;

  // Find most recent body fat entry
  for (var r = lastRow; r >= 2; r--) {
    var bf = sheet.getRange(r, BC.BODY_FAT).getValue();
    if (bf && bf > 0) {
      latestBF = bf;
      break;
    }
  }

  return {
    currentWeight: latestAvg || 0,
    sevenDayAvg: sevenDayAvg || 0,
    dailyDelta: delta || 0,
    bodyFat: latestBF || CUT.START_BF,
    weightToLose: (sevenDayAvg || CUT.START_WEIGHT) - CUT.TARGET_WEIGHT,
    bfToLose: (latestBF || CUT.START_BF) - CUT.TARGET_BF
  };
}
