/**
 * NutritionTracker.js — Granular calorie and macro tracking
 * One row per food entry, multiple entries per day
 */

/**
 * Log a food entry to the Nutrition sheet
 */
function logFoodEntry(date, mealLabel, foodName, calories, protein, carbs, fat) {
  var sheet = getSheet(SHEET_NAMES.NUTRITION);
  if (!sheet) return;

  var newRow = sheet.getLastRow() + 1;

  sheet.getRange(newRow, NUT.DATE).setValue(date).setNumberFormat('MMM d');
  sheet.getRange(newRow, NUT.MEAL_LABEL).setValue(mealLabel);
  sheet.getRange(newRow, NUT.FOOD_NAME).setValue(foodName);
  sheet.getRange(newRow, NUT.CALORIES).setValue(calories);
  sheet.getRange(newRow, NUT.PROTEIN).setValue(protein);
  sheet.getRange(newRow, NUT.CARBS).setValue(carbs);
  sheet.getRange(newRow, NUT.FAT).setValue(fat);
  sheet.getRange(newRow, NUT.TIMESTAMP).setValue(new Date());
}

/**
 * Get daily nutrition summary for a specific date
 */
function getDailyNutritionSummary(date) {
  var sheet = getSheet(SHEET_NAMES.NUTRITION);
  if (!sheet) return null;

  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return null;

  var allData = sheet.getRange(2, 1, lastRow - 1, NUT.TIMESTAMP).getValues();
  var target = stripTime(date);

  var totals = { calories: 0, protein: 0, carbs: 0, fat: 0, entries: 0 };

  for (var i = 0; i < allData.length; i++) {
    var rowDate = allData[i][NUT.DATE - 1];
    if (rowDate instanceof Date && isSameDay(rowDate, target)) {
      totals.calories += (allData[i][NUT.CALORIES - 1] || 0);
      totals.protein += (allData[i][NUT.PROTEIN - 1] || 0);
      totals.carbs += (allData[i][NUT.CARBS - 1] || 0);
      totals.fat += (allData[i][NUT.FAT - 1] || 0);
      totals.entries++;
    }
  }

  if (totals.entries === 0) return null;

  totals.netCalories = totals.calories - CUT.TDEE;
  totals.proteinTarget = CUT.PROTEIN_G;
  totals.calorieTarget = CUT.DAILY_CALORIES;

  return totals;
}

/**
 * Check if nutrition was logged for a given date
 */
function hasNutritionLog(date) {
  var summary = getDailyNutritionSummary(date);
  return summary !== null && summary.entries > 0;
}

/**
 * Quick-add food via menu prompt
 */
function quickAddFood() {
  var ui = SpreadsheetApp.getUi();

  var mealResult = ui.prompt('Meal Type', 'Enter meal type (Suhoor, Main Meal, Snack, Shake):', ui.ButtonSet.OK_CANCEL);
  if (mealResult.getSelectedButton() !== ui.Button.OK) return;
  var meal = mealResult.getResponseText().trim();

  var foodResult = ui.prompt('Food Name', 'What did you eat?', ui.ButtonSet.OK_CANCEL);
  if (foodResult.getSelectedButton() !== ui.Button.OK) return;
  var food = foodResult.getResponseText().trim();

  var calResult = ui.prompt('Calories', 'Estimated calories:', ui.ButtonSet.OK_CANCEL);
  if (calResult.getSelectedButton() !== ui.Button.OK) return;
  var cal = parseInt(calResult.getResponseText());
  if (isNaN(cal)) { ui.alert('Invalid calorie value.'); return; }

  var macroResult = ui.prompt('Macros (optional)', 'Enter protein,carbs,fat in grams (e.g. 40,20,15) or leave blank:', ui.ButtonSet.OK_CANCEL);
  if (macroResult.getSelectedButton() !== ui.Button.OK) return;

  var protein = 0, carbs = 0, fat = 0;
  var macroText = macroResult.getResponseText().trim();
  if (macroText) {
    var parts = macroText.split(',');
    protein = parseInt(parts[0]) || 0;
    carbs = parseInt(parts[1]) || 0;
    fat = parseInt(parts[2]) || 0;
  }

  logFoodEntry(today(), meal, food, cal, protein, carbs, fat);

  var summary = getDailyNutritionSummary(today());
  var remaining = CUT.DAILY_CALORIES - (summary ? summary.calories : 0);
  ui.alert('Logged: ' + food + ' (' + cal + ' cal)\n\n' +
    'Today\'s total: ' + (summary ? summary.calories : cal) + ' cal\n' +
    'Remaining: ' + remaining + ' cal\n' +
    'Target: ' + CUT.DAILY_CALORIES + ' cal');
}

/**
 * Sync daily calorie total to Daily Log
 */
function syncNutritionToDaily(date) {
  var summary = getDailyNutritionSummary(date);
  if (!summary) return;

  var dailyLog = getSheet(SHEET_NAMES.DAILY_LOG);
  if (!dailyLog) return;

  var dlRow = findDateRow(dailyLog, date);
  if (dlRow < 0) return;

  dailyLog.getRange(dlRow, DL.CALORIES_EST).setValue(summary.calories);
}

/**
 * Setup function for Nutrition sheet (called from Setup.js)
 */
function setupNutritionSheet(ss) {
  var sheet = ss.getSheetByName(SHEET_NAMES.NUTRITION) || ss.insertSheet(SHEET_NAMES.NUTRITION);
  sheet.clear();

  var headers = ['Date', 'Meal', 'Food', 'Calories', 'Protein (g)', 'Carbs (g)', 'Fat (g)', 'Timestamp'];
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
  sheet.setColumnWidth(NUT.DATE, 90);
  sheet.setColumnWidth(NUT.MEAL_LABEL, 100);
  sheet.setColumnWidth(NUT.FOOD_NAME, 200);
  sheet.setColumnWidth(NUT.CALORIES, 75);
  sheet.setColumnWidth(NUT.PROTEIN, 80);
  sheet.setColumnWidth(NUT.CARBS, 75);
  sheet.setColumnWidth(NUT.FAT, 65);
  sheet.setColumnWidth(NUT.TIMESTAMP, 130);

  // Data validation for Meal column
  var mealValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Suhoor', 'Main Meal', 'Snack', 'Shake'], true)
    .setAllowInvalid(true)
    .build();
  sheet.getRange(2, NUT.MEAL_LABEL, 500, 1).setDataValidation(mealValidation);

  // Number formats
  sheet.getRange(2, NUT.DATE, 500, 1).setNumberFormat('MMM d');
  sheet.getRange(2, NUT.CALORIES, 500, 1).setNumberFormat('#,##0');
  sheet.getRange(2, NUT.PROTEIN, 500, 1).setNumberFormat('0');
  sheet.getRange(2, NUT.CARBS, 500, 1).setNumberFormat('0');
  sheet.getRange(2, NUT.FAT, 500, 1).setNumberFormat('0');

  // Calorie conditional formatting (green under target, red over)
  var calRange = sheet.getRange(2, NUT.CALORIES, 500, 1);
  var calHigh = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberGreaterThan(800).setBackground(COLORS.ATTR_LOW).setRanges([calRange]).build();
  var calMed = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberBetween(400, 800).setBackground(COLORS.ATTR_MED).setRanges([calRange]).build();
  var calLow = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberLessThanOrEqualTo(400).setBackground(COLORS.ATTR_HIGH).setRanges([calRange]).build();
  sheet.setConditionalFormatRules([calHigh, calMed, calLow]);

  // Add target reference in row 2
  sheet.getRange(2, NUT.DATE).setValue('TARGETS').setFontWeight('bold').setFontColor(COLORS.ACCENT_GOLD);
  sheet.getRange(2, NUT.CALORIES).setValue(CUT.DAILY_CALORIES).setFontWeight('bold').setFontColor(COLORS.ACCENT_GOLD);
  sheet.getRange(2, NUT.PROTEIN).setValue(CUT.PROTEIN_G).setFontWeight('bold').setFontColor(COLORS.ACCENT_GOLD);
  sheet.getRange(2, NUT.CARBS).setValue(CUT.CARBS_G).setFontWeight('bold').setFontColor(COLORS.ACCENT_GOLD);
  sheet.getRange(2, NUT.FAT).setValue(CUT.FAT_G).setFontWeight('bold').setFontColor(COLORS.ACCENT_GOLD);

  sheet.setTabColor('#e65100');
}
