/**
 * WeeklyReview.js — Weekly review auto-creation, stats aggregation, muhasaba prompts
 */

/**
 * Create a new weekly review row — called by Monday morning trigger
 */
function createWeeklyReview() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var review = ss.getSheetByName(SHEET_NAMES.WEEKLY_REVIEW);
  var log = ss.getSheetByName(SHEET_NAMES.DAILY_LOG);
  if (!review || !log) return;

  // Determine the week we're reviewing (last week)
  var lastMonday = getMonday(new Date());
  lastMonday.setDate(lastMonday.getDate() - 7);
  var lastSunday = new Date(lastMonday);
  lastSunday.setDate(lastSunday.getDate() + 6);

  // Check if this week's review already exists
  var reviewLastRow = review.getLastRow();
  if (reviewLastRow >= 2) {
    var existingDates = review.getRange(2, 1, reviewLastRow - 1, 1).getValues();
    for (var i = 0; i < existingDates.length; i++) {
      if (existingDates[i][0] instanceof Date && isSameDay(existingDates[i][0], lastMonday)) {
        return; // Already exists
      }
    }
  }

  // Gather data from Daily Log for the past week
  var logLastRow = log.getLastRow();
  if (logLastRow < 2) return;

  var weekData = {
    habitsDone: 0,
    possible: HABITS.length * 7,
    mrrStart: null,
    mrrEnd: null,
    attrSums: [0, 0, 0, 0, 0, 0],
    attrCounts: [0, 0, 0, 0, 0, 0],
    weightStart: null,
    weightEnd: null,
    streakEnd: 0,
    xpEarned: 0,
    daysLogged: 0
  };

  var allData = log.getRange(2, 1, logLastRow - 1, DL.NOTES).getValues();

  for (var r = 0; r < allData.length; r++) {
    var date = allData[r][DL.DATE - 1];
    if (!(date instanceof Date)) continue;

    var d = stripTime(date);
    if (d < stripTime(lastMonday) || d > stripTime(lastSunday)) continue;

    weekData.daysLogged++;

    // Habits
    for (var h = DL.HABIT_START - 1; h < DL.HABIT_END; h++) {
      if (allData[r][h] === true) weekData.habitsDone++;
    }

    // MRR
    var mrr = allData[r][DL.MRR - 1];
    if (mrr && mrr > 0) {
      if (weekData.mrrStart === null) weekData.mrrStart = mrr;
      weekData.mrrEnd = mrr;
    }

    // Attributes
    for (var ai = 0; ai < ATTRIBUTES.length; ai++) {
      var attrVal = allData[r][DL.ATTR_START - 1 + ai];
      if (attrVal && attrVal >= 1) {
        weekData.attrSums[ai] += attrVal;
        weekData.attrCounts[ai]++;
      }
    }

    // Weight
    var weight = allData[r][DL.WEIGHT - 1];
    if (weight && weight > 0) {
      if (weekData.weightStart === null) weekData.weightStart = weight;
      weekData.weightEnd = weight;
    }

    // Streak
    var streak = allData[r][DL.STREAK - 1] || 0;
    weekData.streakEnd = streak;

    // XP
    var xp = allData[r][DL.XP_EARNED - 1] || 0;
    weekData.xpEarned += xp;
  }

  // Calculate derived values
  var completionRate = weekData.possible > 0 ? weekData.habitsDone / weekData.possible : 0;
  var mrrGrowth = (weekData.mrrStart && weekData.mrrEnd) ? weekData.mrrEnd - weekData.mrrStart : 0;
  var mrrGrowthPct = (weekData.mrrStart && weekData.mrrStart > 0) ? mrrGrowth / weekData.mrrStart : 0;
  var weightChange = (weekData.weightStart && weekData.weightEnd) ? weekData.weightEnd - weekData.weightStart : 0;

  var attrAvgs = [];
  for (var aa = 0; aa < ATTRIBUTES.length; aa++) {
    attrAvgs.push(weekData.attrCounts[aa] > 0 ?
      Math.round((weekData.attrSums[aa] / weekData.attrCounts[aa]) * 10) / 10 : '');
  }

  // Calculate bonus XP
  var bonusXP = 0;
  // Bonus will be awarded when they fill in the reflection fields

  // Build the row
  var newRow = Math.max(review.getLastRow(), 1) + 1;
  var rowData = [
    lastMonday,
    weekData.habitsDone,
    weekData.possible,
    completionRate,
    weekData.mrrStart || '',
    weekData.mrrEnd || '',
    mrrGrowth || '',
    mrrGrowthPct || '',
    attrAvgs[0], attrAvgs[1], attrAvgs[2], attrAvgs[3], attrAvgs[4], attrAvgs[5],
    weightChange || '',
    weekData.streakEnd,
    weekData.xpEarned,
    '',  // What Worked (user fills in)
    '',  // What Didn't (user fills in)
    '',  // Next Week Focus (user fills in)
    getMuhasabaPrompt(),  // Pre-filled reflection prompt
    0    // Bonus XP (awarded on completion)
  ];

  review.getRange(newRow, 1, 1, rowData.length).setValues([rowData]);

  // Format
  review.getRange(newRow, 1).setNumberFormat('MMM d');
  review.getRange(newRow, 4).setNumberFormat('0%');
  review.getRange(newRow, 5, 1, 2).setNumberFormat('$#,##0');
  review.getRange(newRow, 7).setNumberFormat('$#,##0');
  review.getRange(newRow, 8).setNumberFormat('0.0%');
}

/**
 * Get a muhasaba (self-accountability) prompt for the weekly review
 * Rotates through different prompts based on week number
 */
function getMuhasabaPrompt() {
  var prompts = [
    'Muhasaba: "Account yourselves before you are held to account." — Umar (ra)\nReflect: What did you do this week that brought you closer to Allah? What pulled you away?',
    'Muhasaba: "The wise person is the one who holds himself accountable and works for what comes after death." — Tirmidhi\nReflect: If this was your last week, would you be satisfied with how you spent it?',
    'Muhasaba: "None of you truly believes until he loves for his brother what he loves for himself." — Bukhari & Muslim\nReflect: How did you serve others this week? How can you do more?',
    'Muhasaba: "He who knows himself knows his Lord."\nReflect: What patterns did you notice in yourself this week? What triggers your best and worst days?',
    'Muhasaba: "The best of people are those most beneficial to people." — Daraqutni\nReflect: What impact did your work have this week? Who benefited from your effort?',
    'Muhasaba: "Whoever treads a path seeking knowledge, Allah will make easy for him the path to Paradise." — Muslim\nReflect: What did you learn this week? How did you grow?',
    'Muhasaba: "A strong believer is better and dearer to Allah than a weak believer." — Muslim\nReflect: Where were you strong this week? Where were you weak? What will you do differently?',
    'Muhasaba: "The most beloved of deeds to Allah are those that are most consistent, even if they are small." — Bukhari & Muslim\nReflect: What small consistent actions are you building? Which ones are you neglecting?'
  ];

  var weekNum = Math.floor(getDayOfYear(new Date()) / 7);
  return prompts[weekNum % prompts.length];
}

/**
 * Handle weekly review completion — award bonus XP
 * Called when the user fills in the reflection fields
 */
function checkWeeklyReviewCompletion() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var review = ss.getSheetByName(SHEET_NAMES.WEEKLY_REVIEW);
  if (!review) return;

  var lastRow = review.getLastRow();
  if (lastRow < 2) return;

  // Check last row for completion
  var whatWorked = review.getRange(lastRow, 18).getValue();
  var whatDidnt = review.getRange(lastRow, 19).getValue();
  var nextFocus = review.getRange(lastRow, 20).getValue();
  var currentBonus = review.getRange(lastRow, 22).getValue();

  if (currentBonus > 0) return; // Already awarded

  // Need at least 2 of 3 fields filled
  var filled = 0;
  if (whatWorked && String(whatWorked).trim().length > 0) filled++;
  if (whatDidnt && String(whatDidnt).trim().length > 0) filled++;
  if (nextFocus && String(nextFocus).trim().length > 0) filled++;

  if (filled < 2) return;

  // Award bonus XP
  var bonus = WEEKLY_REVIEW_XP;
  var completionRate = review.getRange(lastRow, 4).getValue();

  if (completionRate >= 1.0) {
    bonus += WEEKLY_100_PERCENT_BONUS;
  } else if (completionRate >= 0.8) {
    bonus += WEEKLY_80_PERCENT_BONUS;
  }

  var mrrGrowth = review.getRange(lastRow, 7).getValue();
  if (mrrGrowth > 0) {
    bonus += WEEKLY_MRR_GROWTH_BONUS;
  }

  review.getRange(lastRow, 22).setValue(bonus);

  // Add bonus to the latest daily log XP
  var log = ss.getSheetByName(SHEET_NAMES.DAILY_LOG);
  if (log) {
    var logLastRow = log.getLastRow();
    if (logLastRow >= 2) {
      var currentXP = log.getRange(logLastRow, DL.XP_EARNED).getValue() || 0;
      log.getRange(logLastRow, DL.XP_EARNED).setValue(currentXP + bonus);
    }
  }

  try {
    SpreadsheetApp.getUi().alert(
      'Weekly Review Complete!\n\n' +
      '+' + bonus + ' XP\n\n' +
      '"And that there is not for man except that for which he strives." — Surah An-Najm 53:39'
    );
  } catch (err) {
    // UI not available
  }
}
