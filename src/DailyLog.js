/**
 * DailyLog.js — Daily row creation, XP calculation, streak tracking
 * This is the code path that runs every single day via onOpen and onEdit
 */

/**
 * Create today's row in the Daily Log if it doesn't already exist
 */
function createTodayRow() {
  var sheet = getSheet(SHEET_NAMES.DAILY_LOG);
  if (!sheet) return;

  var todayDate = today();
  var existingRow = findDateRow(sheet, todayDate);
  if (existingRow > 0) {
    // Already exists, just jump to it
    jumpToRow(sheet, existingRow);
    return;
  }

  var lastRow = Math.max(sheet.getLastRow(), 1);
  var newRow = lastRow + 1;

  // Set date
  sheet.getRange(newRow, DL.DATE).setValue(todayDate).setNumberFormat('MMM d');

  // Insert checkbox for Done?
  sheet.getRange(newRow, DL.COMPLETED).insertCheckboxes();

  // Insert checkboxes for habits
  for (var h = DL.HABIT_START; h <= DL.HABIT_END; h++) {
    sheet.getRange(newRow, h).insertCheckboxes();
  }

  // Data validation for attributes (1-5 dropdown)
  var attrValidation = SpreadsheetApp.newDataValidation()
    .requireNumberBetween(1, 5)
    .setAllowInvalid(false)
    .setHelpText('Rate yourself 1-5')
    .build();
  for (var a = DL.ATTR_START; a <= DL.ATTR_END; a++) {
    sheet.getRange(newRow, a).setDataValidation(attrValidation);
  }

  // Diet score validation (1-5 dropdown)
  var dietValidation = SpreadsheetApp.newDataValidation()
    .requireNumberBetween(1, 5)
    .setAllowInvalid(false)
    .setHelpText('Diet compliance 1-5 (1=off plan, 5=perfect OMAD)')
    .build();
  sheet.getRange(newRow, DL.DIET_SCORE).setDataValidation(dietValidation);

  // Habits Score formula
  var habitCols = colLetter(DL.HABIT_START) + newRow + ':' + colLetter(DL.HABIT_END) + newRow;
  sheet.getRange(newRow, DL.HABITS_SCORE)
    .setFormula('=COUNTIF(' + habitCols + ', TRUE)');

  // Attribute Average formula
  var attrCols = colLetter(DL.ATTR_START) + newRow + ':' + colLetter(DL.ATTR_END) + newRow;
  sheet.getRange(newRow, DL.ATTR_AVG)
    .setFormula('=IFERROR(AVERAGE(' + attrCols + '), "")');

  // Pre-fill MRR with yesterday's value
  if (lastRow >= 2) {
    var yesterdayMRR = sheet.getRange(lastRow, DL.MRR).getValue();
    if (yesterdayMRR && yesterdayMRR > 0) {
      sheet.getRange(newRow, DL.MRR).setValue(yesterdayMRR);
    }
  }

  // XP Earned (will be calculated by handleDailyLogEdit)
  sheet.getRange(newRow, DL.XP_EARNED).setValue(0);

  // Total XP formula (previous total + this row's XP)
  if (newRow > 2) {
    sheet.getRange(newRow, DL.TOTAL_XP)
      .setFormula('=' + colLetter(DL.TOTAL_XP) + (newRow - 1) + '+' + colLetter(DL.XP_EARNED) + newRow);
  } else {
    sheet.getRange(newRow, DL.TOTAL_XP)
      .setFormula('=' + colLetter(DL.XP_EARNED) + newRow);
  }

  // Streak (will be calculated)
  sheet.getRange(newRow, DL.STREAK).setValue(0);

  // Format the row
  sheet.getRange(newRow, DL.MRR).setNumberFormat('$#,##0');
  sheet.getRange(newRow, DL.XP_EARNED).setNumberFormat('#,##0');
  sheet.getRange(newRow, DL.TOTAL_XP).setNumberFormat('#,##0');

  // Also create Body Comp row for today
  try { createBodyCompRow(); } catch(e) { /* Body Comp sheet may not exist yet */ }

  // Also create Prayer row for today
  try { createPrayerRow(); } catch(e) { /* Prayers sheet may not exist yet */ }

  jumpToRow(sheet, newRow);
}

/**
 * Jump to a specific row in a sheet
 */
function jumpToRow(sheet, row) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.setActiveSheet(sheet);
  sheet.setActiveRange(sheet.getRange(row, DL.HABIT_START));
}

/**
 * Handle edits in the Daily Log — recalculate XP, streak, check achievements
 */
function handleDailyLogEdit(e) {
  var sheet = e.source.getActiveSheet();
  var row = e.range.getRow();
  var col = e.range.getColumn();

  // Ignore header row
  if (row < 2) return;

  // Only recalculate on relevant column changes
  var isHabit = col >= DL.HABIT_START && col <= DL.HABIT_END;
  var isAttr = col >= DL.ATTR_START && col <= DL.ATTR_END;
  var isCompleted = col === DL.COMPLETED;
  var isMRR = col === DL.MRR;
  var isWeight = col === DL.WEIGHT;
  var isWin = col === DL.WIN_OF_DAY;
  var isDiet = col === DL.DIET_SCORE;

  if (isHabit || isAttr || isCompleted || isMRR || isWeight || isWin || isDiet) {
    calculateDailyXP(sheet, row);
  }

  if (isCompleted) {
    updateStreak(sheet, row);
  }

  // Check achievements (don't run on every keystroke — only on checkboxes and completed)
  if (isHabit || isCompleted) {
    checkAchievements();
  }
}

/**
 * Calculate XP for a specific row in Daily Log
 */
function calculateDailyXP(sheet, row) {
  var xp = 0;

  // Habit XP
  var habitsScore = sheet.getRange(row, DL.HABITS_SCORE).getValue();
  if (typeof habitsScore !== 'number') {
    // Formula might not have evaluated yet, calculate manually
    habitsScore = 0;
    for (var h = DL.HABIT_START; h <= DL.HABIT_END; h++) {
      if (sheet.getRange(row, h).getValue() === true) habitsScore++;
    }
  }
  xp += habitsScore * XP_PER_HABIT;

  // Perfect Day bonus
  if (habitsScore === HABITS.length) {
    xp += PERFECT_DAY_BONUS;
  }

  // Attribute XP
  var attrsRated = 0;
  for (var a = DL.ATTR_START; a <= DL.ATTR_END; a++) {
    var val = sheet.getRange(row, a).getValue();
    if (val && val >= 1 && val <= 5) attrsRated++;
  }
  xp += attrsRated * XP_PER_ATTRIBUTE;

  // All attributes bonus
  if (attrsRated === ATTRIBUTES.length) {
    xp += ALL_ATTRIBUTES_BONUS;
  }

  // MRR logging XP
  var mrr = sheet.getRange(row, DL.MRR).getValue();
  if (mrr && mrr > 0) {
    xp += MRR_LOG_XP;
  }

  // Weight logging XP
  var weight = sheet.getRange(row, DL.WEIGHT).getValue();
  if (weight && weight > 0) {
    xp += WEIGHT_LOG_XP;
  }

  // Win of the Day XP
  var win = sheet.getRange(row, DL.WIN_OF_DAY).getValue();
  if (win && String(win).trim().length > 0) {
    xp += WIN_OF_DAY_XP;
  }

  // Diet XP
  var dietScore = sheet.getRange(row, DL.DIET_SCORE).getValue();
  if (dietScore && dietScore >= 1) {
    xp += DIET_LOG_XP;
    if (dietScore === 5) {
      xp += DIET_PERFECT_XP;
    }
  }

  // Prayer XP (from Prayers sheet)
  var rowDate = sheet.getRange(row, DL.DATE).getValue();
  if (rowDate instanceof Date) {
    try {
      var prayerXP = calculatePrayerXP(rowDate);
      xp += prayerXP;
    } catch(e) { /* Prayers sheet may not exist */ }

    // Lift XP
    try {
      if (hasLiftLog(rowDate)) {
        xp += LIFT_LOG_XP;
      }
    } catch(e) { /* Lifts sheet may not exist */ }

    // Nutrition XP
    try {
      if (hasNutritionLog(rowDate)) {
        xp += NUTRITION_LOG_XP;
      }
    } catch(e) { /* Nutrition sheet may not exist */ }
  }

  // Apply streak multiplier
  var streak = sheet.getRange(row, DL.STREAK).getValue() || 0;
  var multiplier = getStreakMultiplier(streak);

  // Check Phoenix status
  var dataSheet = getSheet(SHEET_NAMES.DATA);
  if (dataSheet) {
    var phoenixActive = dataSheet.getRange('F2').getValue();
    var phoenixDays = dataSheet.getRange('F3').getValue();
    if (phoenixActive && phoenixDays > 0) {
      multiplier = Math.max(multiplier, PHOENIX_MULTIPLIER);
      // Decrement Phoenix days
      dataSheet.getRange('F3').setValue(phoenixDays - 1);
      if (phoenixDays - 1 <= 0) {
        dataSheet.getRange('F2').setValue(false);
      }
    }
  }

  xp = Math.round(xp * multiplier);

  // Set the XP value
  sheet.getRange(row, DL.XP_EARNED).setValue(xp);

  // Check MRR milestones
  if (mrr && mrr > 0) {
    checkMRRMilestones(mrr);
  }
}

/**
 * Update streak count based on consecutive completed days
 */
function updateStreak(sheet, currentRow) {
  var isCompleted = sheet.getRange(currentRow, DL.COMPLETED).getValue();

  if (!isCompleted) {
    sheet.getRange(currentRow, DL.STREAK).setValue(0);
    return;
  }

  // Count consecutive completed days backwards
  var streak = 1;
  var checkRow = currentRow - 1;

  while (checkRow >= 2) {
    var prevDate = sheet.getRange(checkRow, DL.DATE).getValue();
    var currDate = sheet.getRange(checkRow + 1, DL.DATE).getValue();

    // Check dates are consecutive
    if (!(prevDate instanceof Date) || !(currDate instanceof Date)) break;

    var daysDiff = daysBetween(prevDate, currDate);
    if (daysDiff !== 1) break;

    var prevCompleted = sheet.getRange(checkRow, DL.COMPLETED).getValue();
    if (!prevCompleted) break;

    streak++;
    checkRow--;
  }

  sheet.getRange(currentRow, DL.STREAK).setValue(streak);
}

/**
 * Check if any MRR milestones have been newly reached
 */
function checkMRRMilestones(currentMRR) {
  var dataSheet = getSheet(SHEET_NAMES.DATA);
  if (!dataSheet) return;

  for (var m = 0; m < MRR_MILESTONES.length; m++) {
    var milestone = MRR_MILESTONES[m];
    var dateReached = dataSheet.getRange(m + 3, 9).getValue();

    if (!dateReached && currentMRR >= milestone) {
      dataSheet.getRange(m + 3, 9).setValue(new Date());

      // Award milestone XP
      var bonusXP = MRR_MILESTONE_XP;
      if (milestone === 30000) bonusXP = MRR_30K_XP;
      if (milestone === 100000) bonusXP = MRR_100K_XP;

      // Show celebration
      try {
        var label = formatCurrency(milestone);
        SpreadsheetApp.getUi().alert(
          'MILESTONE REACHED: ' + label + ' MRR!\n\n' +
          '+' + bonusXP + ' XP\n\n' +
          '"And that there is not for man except that for which he strives." — Surah An-Najm 53:39'
        );
      } catch (err) {
        // UI not available (trigger context)
      }
    }
  }
}

/**
 * Midnight streak check — called by time-driven trigger
 * Checks if yesterday had a check-in, handles streak freeze or reset
 */
function midnightStreakCheck() {
  var sheet = getSheet(SHEET_NAMES.DAILY_LOG);
  if (!sheet) return;

  var yesterdayDate = yesterday();
  var row = findDateRow(sheet, yesterdayDate);

  // If no row for yesterday, they might not have opened the sheet
  // Check if they had a streak going
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return;

  // Find the most recent completed day
  var lastCompleted = false;
  var lastStreak = 0;
  for (var r = lastRow; r >= 2; r--) {
    var date = sheet.getRange(r, DL.DATE).getValue();
    if (!(date instanceof Date)) continue;

    if (isSameDay(date, yesterdayDate)) {
      lastCompleted = sheet.getRange(r, DL.COMPLETED).getValue();
      lastStreak = sheet.getRange(r, DL.STREAK).getValue() || 0;
      break;
    }

    // If we're looking at a date before yesterday and it's completed,
    // that means yesterday was missed
    if (stripTime(date) < stripTime(yesterdayDate)) {
      lastCompleted = false;
      lastStreak = sheet.getRange(r, DL.STREAK).getValue() || 0;
      break;
    }
  }

  if (lastCompleted) return; // All good, streak continues

  // Yesterday was missed — check for streak freeze
  if (lastStreak > 0) {
    var dataSheet = getSheet(SHEET_NAMES.DATA);
    if (dataSheet) {
      var freezeLog = dataSheet.getRange('A3:C' + dataSheet.getLastRow()).getValues();
      var currentFreezes = INITIAL_STREAK_FREEZES;
      for (var f = 0; f < freezeLog.length; f++) {
        if (freezeLog[f][1] === 'Used') currentFreezes--;
        if (freezeLog[f][1] === 'Earned') currentFreezes++;
        if (freezeLog[f][1] === 'Initial') currentFreezes = freezeLog[f][2];
      }
      currentFreezes = Math.min(currentFreezes, MAX_STREAK_FREEZES);

      if (currentFreezes > 0) {
        // Use a freeze
        var freezeRow = dataSheet.getLastRow() + 1;
        dataSheet.getRange(freezeRow, 1).setValue(new Date());
        dataSheet.getRange(freezeRow, 2).setValue('Used');
        dataSheet.getRange(freezeRow, 3).setValue(currentFreezes - 1);
        return; // Streak preserved
      }

      // No freezes available — check if Phoenix should activate
      // Count consecutive missed days
      var missedDays = 0;
      var checkDate = yesterdayDate;
      for (var d = 0; d < 10; d++) {
        var checkRow = findDateRow(sheet, checkDate);
        if (checkRow < 0 || !sheet.getRange(checkRow, DL.COMPLETED).getValue()) {
          missedDays++;
          checkDate = new Date(checkDate);
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }

      if (missedDays >= PHOENIX_TRIGGER_MISSED_DAYS) {
        // Activate Phoenix
        dataSheet.getRange('F2').setValue(true);
        dataSheet.getRange('F3').setValue(PHOENIX_DURATION_DAYS);
        dataSheet.getRange('F4').setValue(new Date());
      }
    }
  }
}

/**
 * Get the current streak freeze count
 */
function getStreakFreezeCount() {
  var dataSheet = getSheet(SHEET_NAMES.DATA);
  if (!dataSheet) return INITIAL_STREAK_FREEZES;

  var lastRow = dataSheet.getLastRow();
  if (lastRow < 3) return INITIAL_STREAK_FREEZES;

  // Get the most recent freeze count
  for (var r = lastRow; r >= 3; r--) {
    var val = dataSheet.getRange(r, 3).getValue();
    if (val !== '' && val !== null) return val;
  }
  return INITIAL_STREAK_FREEZES;
}

/**
 * Manually use a streak freeze
 */
function useStreakFreeze() {
  var freezes = getStreakFreezeCount();
  if (freezes <= 0) {
    SpreadsheetApp.getUi().alert('No streak freezes available!');
    return;
  }

  var ui = SpreadsheetApp.getUi();
  var result = ui.alert(
    'Use Streak Freeze?',
    'This will cost ' + STREAK_FREEZE_XP_COST + ' XP and preserve your streak.\nYou have ' + freezes + ' freeze(s) remaining.',
    ui.ButtonSet.YES_NO
  );

  if (result !== ui.Button.YES) return;

  var dataSheet = getSheet(SHEET_NAMES.DATA);
  var freezeRow = dataSheet.getLastRow() + 1;
  dataSheet.getRange(freezeRow, 1).setValue(new Date());
  dataSheet.getRange(freezeRow, 2).setValue('Used');
  dataSheet.getRange(freezeRow, 3).setValue(freezes - 1);

  ui.alert('Streak freeze used! ' + (freezes - 1) + ' remaining.\n-' + STREAK_FREEZE_XP_COST + ' XP');
}
