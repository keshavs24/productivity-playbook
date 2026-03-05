/**
 * Triggers.js — Time-driven trigger setup and management
 */

/**
 * Set up all time-driven triggers
 * Called once during initial setup
 */
function setupTriggers() {
  // Remove any existing triggers first to avoid duplicates
  var existing = ScriptApp.getProjectTriggers();
  for (var i = 0; i < existing.length; i++) {
    var handler = existing[i].getHandlerFunction();
    if (handler === 'midnightStreakCheck' ||
        handler === 'createWeeklyReview' ||
        handler === 'whoopFetchDaily' ||
        handler === 'dailyReminder') {
      ScriptApp.deleteTrigger(existing[i]);
    }
  }

  // Midnight streak check — runs at midnight daily
  ScriptApp.newTrigger('midnightStreakCheck')
    .timeBased()
    .atHour(0)
    .everyDays(1)
    .create();

  // Monday morning weekly review — runs at 6 AM every Monday
  ScriptApp.newTrigger('createWeeklyReview')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.MONDAY)
    .atHour(6)
    .create();

  // Whoop daily fetch — runs at 7 AM daily (after Whoop finishes scoring overnight)
  // Only fires if Whoop is connected (whoopFetchDaily checks internally)
  ScriptApp.newTrigger('whoopFetchDaily')
    .timeBased()
    .atHour(7)
    .everyDays(1)
    .create();

  Logger.log('Triggers set up successfully:');
  Logger.log('- Midnight streak check (daily at 12 AM)');
  Logger.log('- Whoop daily fetch (daily at 7 AM)');
  Logger.log('- Weekly review creation (Monday at 6 AM)');
}

/**
 * Remove all project triggers (for cleanup)
 */
function removeAllTriggers() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
  Logger.log('All triggers removed.');
}

/**
 * List current triggers (for debugging)
 */
function listTriggers() {
  var triggers = ScriptApp.getProjectTriggers();
  var output = [];
  for (var i = 0; i < triggers.length; i++) {
    output.push(triggers[i].getHandlerFunction() + ' — ' + triggers[i].getEventType());
  }
  Logger.log('Current triggers: ' + output.join(', '));
  return output;
}
