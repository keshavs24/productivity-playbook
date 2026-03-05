/**
 * Code.js — Main entry point for the Productivity Playbook
 * Wires together onOpen, onEdit, and custom menu
 */

/**
 * Runs when the spreadsheet is opened
 */
function onOpen(e) {
  // Build custom menu
  SpreadsheetApp.getUi()
    .createMenu('Playbook')
    .addItem('Setup Sheet (first time)', 'runSetup')
    .addSeparator()
    .addItem('Create Today\'s Row', 'createTodayRow')
    .addItem('Refresh Dashboard', 'refreshDashboard')
    .addItem('Refresh Charts', 'refreshCharts')
    .addSeparator()
    .addSubMenu(SpreadsheetApp.getUi().createMenu('Body Comp')
      .addItem('Log AM Weight (morning)', 'logAMWeight')
      .addItem('Log PM Weight (evening)', 'logPMWeight')
      .addItem('Log Body Fat %', 'logBodyFat'))
    .addSeparator()
    .addItem('Use Streak Freeze', 'useStreakFreeze')
    .addItem('Check Achievements', 'checkAchievements')
    .addItem('Create Weekly Review', 'createWeeklyReview')
    .addSeparator()
    .addSubMenu(SpreadsheetApp.getUi().createMenu('Whoop')
      .addItem('Enter Credentials', 'whoopEnterCredentials')
      .addItem('Authorize Whoop (Step 1)', 'whoopAuthorize')
      .addItem('Enter Auth Code (Step 2)', 'whoopEnterAuthCode')
      .addSeparator()
      .addItem('Fetch Today\'s Data', 'whoopFetchManual')
      .addItem('Connection Status', 'whoopStatus')
      .addItem('Disconnect', 'whoopDisconnect'))
    .addSeparator()
    .addSubMenu(SpreadsheetApp.getUi().createMenu('Trackers')
      .addItem('Quick Add Food', 'quickAddFood')
      .addSeparator()
      .addItem('Log Lift Session', 'logLiftSessionMenu'))
    .addSeparator()
    .addSubMenu(SpreadsheetApp.getUi().createMenu('Admin')
      .addItem('Re-setup Triggers', 'setupTriggers')
      .addItem('Remove All Triggers', 'removeAllTriggers')
      .addItem('List Triggers', 'listTriggers'))
    .addToUi();

  // Auto-create today's row if Daily Log exists
  var dailyLog = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.DAILY_LOG);
  if (dailyLog) {
    createTodayRow();
  }

  // Auto-create today's prayer row
  try { createPrayerRow(); } catch(e) { /* Prayers sheet may not exist yet */ }
}

/**
 * Runs on every edit in the spreadsheet
 */
function onEdit(e) {
  if (!e || !e.source || !e.range) return;

  var sheet = e.source.getActiveSheet();
  var sheetName = sheet.getName();

  // Daily Log edits — recalculate XP, streak, achievements
  if (sheetName === SHEET_NAMES.DAILY_LOG) {
    handleDailyLogEdit(e);
  }

  // Body Comp edits — sync weight to Daily Log
  if (sheetName === SHEET_NAMES.BODY_COMP) {
    handleBodyCompEdit(e);
  }

  // Weekly Review edits — check if review is complete for bonus XP
  if (sheetName === SHEET_NAMES.WEEKLY_REVIEW) {
    var col = e.range.getColumn();
    // Columns 18-21 are the manual reflection fields
    if (col >= 18 && col <= 21) {
      checkWeeklyReviewCompletion();
    }
  }

  // Prayer edits — sync fard completion to Daily Log
  if (sheetName === SHEET_NAMES.PRAYERS) {
    handlePrayerEdit(e);
  }
}

/**
 * Menu handler for logging a lift session
 */
function logLiftSessionMenu() {
  var ui = SpreadsheetApp.getUi();
  var sessionNames = WORKOUT_SPLIT.map(function(s) { return s.name; });
  var result = ui.prompt('Lift Session',
    'Which session?\n' + sessionNames.map(function(n, i) { return (i + 1) + '. ' + n; }).join('\n') +
    '\n\nEnter the number:',
    ui.ButtonSet.OK_CANCEL);

  if (result.getSelectedButton() !== ui.Button.OK) return;
  var idx = parseInt(result.getResponseText()) - 1;
  if (isNaN(idx) || idx < 0 || idx >= WORKOUT_SPLIT.length) {
    ui.alert('Invalid selection.');
    return;
  }

  var session = WORKOUT_SPLIT[idx];
  var allExercises = session.exercises.concat(ABS_EXERCISES);

  // Navigate to Lifts sheet
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var liftSheet = ss.getSheetByName(SHEET_NAMES.LIFTS);
  if (liftSheet) {
    ss.setActiveSheet(liftSheet);
  }

  ui.alert('Session: ' + session.name + '\n\n' +
    'Exercises:\n' + allExercises.map(function(ex) {
      return '- ' + ex.name + (ex.targetWeight ? ' (' + ex.targetWeight + 'lb x ' + ex.targetReps + ')' : '');
    }).join('\n') +
    '\n\nLog your sets directly in the Lifts sheet, or use the PWA for a better experience.');
}
