/**
 * LiftTracker.js — Lift/strength tracking with progressive overload & PR detection
 * One row per SET. Multiple sets per exercise, multiple exercises per session.
 */

/**
 * Log a single set to the Lifts sheet
 */
function logSet(date, sessionType, exercise, setNum, targetWeight, actualWeight, targetReps, actualReps, rpe, notes) {
  var sheet = getSheet(SHEET_NAMES.LIFTS);
  if (!sheet) return;

  var newRow = sheet.getLastRow() + 1;

  sheet.getRange(newRow, LFT.DATE).setValue(date).setNumberFormat('MMM d');
  sheet.getRange(newRow, LFT.SESSION_TYPE).setValue(sessionType);
  sheet.getRange(newRow, LFT.EXERCISE).setValue(exercise);
  sheet.getRange(newRow, LFT.SET_NUM).setValue(setNum);
  sheet.getRange(newRow, LFT.TARGET_WEIGHT).setValue(targetWeight);
  sheet.getRange(newRow, LFT.ACTUAL_WEIGHT).setValue(actualWeight);
  sheet.getRange(newRow, LFT.TARGET_REPS).setValue(targetReps);
  sheet.getRange(newRow, LFT.ACTUAL_REPS).setValue(actualReps);
  if (rpe) sheet.getRange(newRow, LFT.RPE).setValue(rpe);
  if (notes) sheet.getRange(newRow, LFT.NOTES).setValue(notes);
}

/**
 * Check if any lifts were logged for a given date
 */
function hasLiftLog(date) {
  var sheet = getSheet(SHEET_NAMES.LIFTS);
  if (!sheet) return false;

  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return false;

  var dates = sheet.getRange(2, LFT.DATE, lastRow - 1, 1).getValues();
  var target = stripTime(date);

  for (var i = 0; i < dates.length; i++) {
    if (dates[i][0] instanceof Date && isSameDay(dates[i][0], target)) {
      return true;
    }
  }
  return false;
}

/**
 * Get the personal record (best weight x reps) for an exercise
 * Returns { weight, reps, volume, date } or null
 */
function getExercisePR(exercise) {
  var sheet = getSheet(SHEET_NAMES.LIFTS);
  if (!sheet) return null;

  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return null;

  var allData = sheet.getRange(2, 1, lastRow - 1, LFT.NOTES).getValues();
  var bestVolume = 0;
  var pr = null;

  for (var i = 0; i < allData.length; i++) {
    var row = allData[i];
    if (row[LFT.EXERCISE - 1] === exercise) {
      var weight = row[LFT.ACTUAL_WEIGHT - 1] || 0;
      var reps = row[LFT.ACTUAL_REPS - 1] || 0;
      var volume = weight * reps;
      if (volume > bestVolume) {
        bestVolume = volume;
        pr = {
          weight: weight,
          reps: reps,
          volume: volume,
          date: row[LFT.DATE - 1]
        };
      }
    }
  }
  return pr;
}

/**
 * Get the last session data for an exercise (most recent date)
 */
function getLastSession(exercise) {
  var sheet = getSheet(SHEET_NAMES.LIFTS);
  if (!sheet) return null;

  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return null;

  var allData = sheet.getRange(2, 1, lastRow - 1, LFT.NOTES).getValues();
  var lastDate = null;
  var sets = [];

  // Find the most recent date for this exercise
  for (var i = allData.length - 1; i >= 0; i--) {
    if (allData[i][LFT.EXERCISE - 1] === exercise) {
      if (!lastDate) {
        lastDate = allData[i][LFT.DATE - 1];
      }
      if (lastDate instanceof Date && allData[i][LFT.DATE - 1] instanceof Date &&
          isSameDay(allData[i][LFT.DATE - 1], lastDate)) {
        sets.unshift({
          setNum: allData[i][LFT.SET_NUM - 1],
          weight: allData[i][LFT.ACTUAL_WEIGHT - 1],
          reps: allData[i][LFT.ACTUAL_REPS - 1],
          rpe: allData[i][LFT.RPE - 1]
        });
      } else if (lastDate) {
        break;
      }
    }
  }

  if (sets.length === 0) return null;
  return { date: lastDate, sets: sets };
}

/**
 * Check if a new set is a PR for the exercise
 */
function checkForPR(exercise, weight, reps) {
  var currentPR = getExercisePR(exercise);
  if (!currentPR) return true; // First ever set is always a PR
  return (weight * reps) > currentPR.volume;
}

/**
 * Count total lift sessions (unique date + session type combos)
 */
function countLiftSessions() {
  var sheet = getSheet(SHEET_NAMES.LIFTS);
  if (!sheet) return 0;

  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return 0;

  var data = sheet.getRange(2, LFT.DATE, lastRow - 1, 2).getValues();
  var sessions = {};

  for (var i = 0; i < data.length; i++) {
    var date = data[i][0];
    var type = data[i][1];
    if (date instanceof Date && type) {
      var key = stripTime(date).getTime() + '_' + type;
      sessions[key] = true;
    }
  }

  return Object.keys(sessions).length;
}

/**
 * Count total PRs achieved
 */
function countPRs() {
  var sheet = getSheet(SHEET_NAMES.LIFTS);
  if (!sheet) return 0;

  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return 0;

  var allData = sheet.getRange(2, 1, lastRow - 1, LFT.NOTES).getValues();

  // Track best volume per exercise over time
  var bestByExercise = {};
  var prCount = 0;

  for (var i = 0; i < allData.length; i++) {
    var exercise = allData[i][LFT.EXERCISE - 1];
    var weight = allData[i][LFT.ACTUAL_WEIGHT - 1] || 0;
    var reps = allData[i][LFT.ACTUAL_REPS - 1] || 0;
    var volume = weight * reps;

    if (!exercise || volume === 0) continue;

    if (!bestByExercise[exercise] || volume > bestByExercise[exercise]) {
      if (bestByExercise[exercise]) prCount++; // Don't count first ever entry
      bestByExercise[exercise] = volume;
    }
  }

  return prCount;
}

/**
 * Count total sets logged
 */
function countTotalSets() {
  var sheet = getSheet(SHEET_NAMES.LIFTS);
  if (!sheet) return 0;
  return Math.max(sheet.getLastRow() - 1, 0);
}

/**
 * Setup function for Lifts sheet (called from Setup.js)
 */
function setupLiftsSheet(ss) {
  var sheet = ss.getSheetByName(SHEET_NAMES.LIFTS) || ss.insertSheet(SHEET_NAMES.LIFTS);
  sheet.clear();

  var headers = ['Date', 'Session', 'Exercise', 'Set #', 'Target (lb)', 'Actual (lb)', 'Target Reps', 'Actual Reps', 'RPE', 'Notes'];
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
  sheet.setColumnWidth(LFT.DATE, 90);
  sheet.setColumnWidth(LFT.SESSION_TYPE, 150);
  sheet.setColumnWidth(LFT.EXERCISE, 170);
  sheet.setColumnWidth(LFT.SET_NUM, 50);
  sheet.setColumnWidth(LFT.TARGET_WEIGHT, 85);
  sheet.setColumnWidth(LFT.ACTUAL_WEIGHT, 85);
  sheet.setColumnWidth(LFT.TARGET_REPS, 80);
  sheet.setColumnWidth(LFT.ACTUAL_REPS, 80);
  sheet.setColumnWidth(LFT.RPE, 50);
  sheet.setColumnWidth(LFT.NOTES, 200);

  // Session type validation
  var sessionNames = WORKOUT_SPLIT.map(function(s) { return s.name; });
  var sessionValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(sessionNames, true)
    .setAllowInvalid(true)
    .build();
  sheet.getRange(2, LFT.SESSION_TYPE, 500, 1).setDataValidation(sessionValidation);

  // RPE validation (1-10)
  var rpeValidation = SpreadsheetApp.newDataValidation()
    .requireNumberBetween(1, 10)
    .setAllowInvalid(true)
    .setHelpText('Rate of Perceived Exertion (1-10)')
    .build();
  sheet.getRange(2, LFT.RPE, 500, 1).setDataValidation(rpeValidation);

  // Number formats
  sheet.getRange(2, LFT.DATE, 500, 1).setNumberFormat('MMM d');
  sheet.getRange(2, LFT.TARGET_WEIGHT, 500, 1).setNumberFormat('0');
  sheet.getRange(2, LFT.ACTUAL_WEIGHT, 500, 1).setNumberFormat('0');

  // Conditional formatting: green when actual >= target weight
  var actualRange = sheet.getRange(2, LFT.ACTUAL_WEIGHT, 500, 1);
  var hitTarget = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=AND(' + colLetter(LFT.ACTUAL_WEIGHT) + '2>0,' +
      colLetter(LFT.ACTUAL_WEIGHT) + '2>=' + colLetter(LFT.TARGET_WEIGHT) + '2)')
    .setBackground(COLORS.ATTR_HIGH)
    .setRanges([actualRange])
    .build();
  var missTarget = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=AND(' + colLetter(LFT.ACTUAL_WEIGHT) + '2>0,' +
      colLetter(LFT.TARGET_WEIGHT) + '2>0,' +
      colLetter(LFT.ACTUAL_WEIGHT) + '2<' + colLetter(LFT.TARGET_WEIGHT) + '2)')
    .setBackground(COLORS.ATTR_LOW)
    .setRanges([actualRange])
    .build();
  sheet.setConditionalFormatRules([hitTarget, missTarget]);

  // RPE conditional formatting (high RPE = harder, darker)
  var rpeRange = sheet.getRange(2, LFT.RPE, 500, 1);
  var rpeHigh = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberGreaterThanOrEqualTo(8).setBackground(COLORS.ACCENT_GOLD)
    .setRanges([rpeRange]).build();
  var rpeMed = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberBetween(6, 7).setBackground(COLORS.ATTR_MED)
    .setRanges([rpeRange]).build();
  var rulesList = sheet.getConditionalFormatRules();
  rulesList.push(rpeHigh, rpeMed);
  sheet.setConditionalFormatRules(rulesList);

  sheet.setTabColor('#d32f2f');
}
