/**
 * Charts.js — Programmatic chart creation for the Productivity Playbook
 */

/**
 * Create or update all charts
 */
function refreshCharts() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var chartsSheet = ss.getSheetByName(SHEET_NAMES.CHARTS);
  var log = ss.getSheetByName(SHEET_NAMES.DAILY_LOG);
  var review = ss.getSheetByName(SHEET_NAMES.WEEKLY_REVIEW);

  if (!chartsSheet || !log) return;

  var logLastRow = log.getLastRow();
  if (logLastRow < 3) {
    // Need at least 2 data rows for charts
    chartsSheet.getRange('A1').setValue('Log at least 2 days of data, then go to Playbook > Refresh Charts');
    return;
  }

  // Clear existing charts
  var existingCharts = chartsSheet.getCharts();
  for (var i = 0; i < existingCharts.length; i++) {
    chartsSheet.removeChart(existingCharts[i]);
  }
  chartsSheet.clear();

  // Title
  chartsSheet.getRange('A1').setValue('CHARTS & ANALYTICS')
    .setFontSize(16)
    .setFontWeight('bold')
    .setFontColor(COLORS.HEADER_BG);

  // Create charts
  createMRRChart(chartsSheet, log, logLastRow);
  createHabitHeatmap(chartsSheet, log, logLastRow);
  createXPChart(chartsSheet, log, logLastRow);
  createStreakChart(chartsSheet, log, logLastRow);
  createAttributeTrendChart(chartsSheet, log, logLastRow);

  if (hasBodyMetrics(log, logLastRow)) {
    createBodyMetricsChart(chartsSheet, log, logLastRow);
  }
}

/**
 * MRR Over Time — Line chart with goal reference lines
 */
function createMRRChart(chartsSheet, log, lastRow) {
  var dateRange = log.getRange(1, DL.DATE, lastRow, 1);
  var mrrRange = log.getRange(1, DL.MRR, lastRow, 1);

  var chart = chartsSheet.newChart()
    .setChartType(Charts.ChartType.LINE)
    .addRange(dateRange)
    .addRange(mrrRange)
    .setPosition(3, 1, 0, 0)
    .setOption('title', 'MRR Over Time')
    .setOption('hAxis.title', '')
    .setOption('vAxis.title', 'MRR ($)')
    .setOption('vAxis.format', '$#,###')
    .setOption('legend', { position: 'none' })
    .setOption('width', 700)
    .setOption('height', 350)
    .setOption('colors', [COLORS.ACCENT_BLUE])
    .setOption('curveType', 'function')
    .setOption('lineWidth', 3)
    .setOption('series', {
      0: { color: COLORS.ACCENT_BLUE, lineWidth: 3 }
    })
    .build();

  chartsSheet.insertChart(chart);

  // Add goal reference note
  chartsSheet.getRange('A22').setValue('Goals: $30K by April 2026  |  $100K by June 2026')
    .setFontSize(9)
    .setFontColor('#888888')
    .setFontStyle('italic');
}

/**
 * Habit Completion Heatmap — GitHub-style contribution graph using conditional formatting
 */
function createHabitHeatmap(chartsSheet, log, lastRow) {
  var startRow = 25;
  chartsSheet.getRange(startRow, 1).setValue('DAILY HABITS HEATMAP')
    .setFontSize(12)
    .setFontWeight('bold')
    .setFontColor(COLORS.HEADER_BG);

  // Get all daily data
  var allData = log.getRange(2, DL.DATE, lastRow - 1, DL.HABITS_SCORE).getValues();

  // Build heatmap rows — one row per week, columns = Mon-Sun
  var dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  chartsSheet.getRange(startRow + 1, 2, 1, 7).setValues([dayLabels])
    .setFontWeight('bold')
    .setFontSize(9)
    .setHorizontalAlignment('center');

  var currentRow = startRow + 2;
  var weekData = {};

  for (var i = 0; i < allData.length; i++) {
    var date = allData[i][0];
    if (!(date instanceof Date)) continue;

    var monday = getMonday(date);
    var key = monday.toISOString().split('T')[0];
    if (!weekData[key]) {
      weekData[key] = { monday: monday, days: [null, null, null, null, null, null, null] };
    }

    var dayIndex = date.getDay();
    dayIndex = dayIndex === 0 ? 6 : dayIndex - 1; // Convert to Mon=0, Sun=6
    weekData[key].days[dayIndex] = allData[i][DL.HABITS_SCORE - 1] || 0;
  }

  var weeks = Object.keys(weekData).sort();
  for (var w = 0; w < weeks.length; w++) {
    var week = weekData[weeks[w]];
    var weekLabel = Utilities.formatDate(week.monday,
      SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone(), 'MMM d');
    chartsSheet.getRange(currentRow, 1).setValue(weekLabel).setFontSize(8);

    for (var d = 0; d < 7; d++) {
      var cell = chartsSheet.getRange(currentRow, 2 + d);
      var score = week.days[d];

      if (score === null) {
        cell.setValue('').setBackground('#f0f0f0');
      } else {
        cell.setValue(score).setHorizontalAlignment('center').setFontSize(9);

        // Color based on score
        if (score === 0) cell.setBackground('#ffcdd2');
        else if (score <= 2) cell.setBackground('#ffe0b2');
        else if (score <= 4) cell.setBackground('#fff9c4');
        else if (score <= 5) cell.setBackground('#c8e6c9');
        else if (score <= 6) cell.setBackground('#81c784');
        else cell.setBackground('#4caf50').setFontColor('#ffffff');
      }
    }
    currentRow++;
  }

  // Legend
  chartsSheet.getRange(currentRow + 1, 1).setValue('Legend:').setFontSize(8);
  chartsSheet.getRange(currentRow + 1, 2).setValue('0').setBackground('#ffcdd2').setHorizontalAlignment('center');
  chartsSheet.getRange(currentRow + 1, 3).setValue('1-2').setBackground('#ffe0b2').setHorizontalAlignment('center');
  chartsSheet.getRange(currentRow + 1, 4).setValue('3-4').setBackground('#fff9c4').setHorizontalAlignment('center');
  chartsSheet.getRange(currentRow + 1, 5).setValue('5').setBackground('#c8e6c9').setHorizontalAlignment('center');
  chartsSheet.getRange(currentRow + 1, 6).setValue('6').setBackground('#81c784').setHorizontalAlignment('center');
  chartsSheet.getRange(currentRow + 1, 7).setValue('7').setBackground('#4caf50').setFontColor('#ffffff').setHorizontalAlignment('center');
}

/**
 * XP & Level Progression — Area chart
 */
function createXPChart(chartsSheet, log, lastRow) {
  var dateRange = log.getRange(1, DL.DATE, lastRow, 1);
  var xpRange = log.getRange(1, DL.TOTAL_XP, lastRow, 1);

  var chart = chartsSheet.newChart()
    .setChartType(Charts.ChartType.AREA)
    .addRange(dateRange)
    .addRange(xpRange)
    .setPosition(3, 9, 0, 0)
    .setOption('title', 'XP & Level Progression')
    .setOption('hAxis.title', '')
    .setOption('vAxis.title', 'Total XP')
    .setOption('vAxis.format', '#,###')
    .setOption('legend', { position: 'none' })
    .setOption('width', 500)
    .setOption('height', 350)
    .setOption('colors', [COLORS.ACCENT_GOLD])
    .setOption('areaOpacity', 0.3)
    .setOption('lineWidth', 2)
    .build();

  chartsSheet.insertChart(chart);
}

/**
 * Streak History — Column chart
 */
function createStreakChart(chartsSheet, log, lastRow) {
  var dateRange = log.getRange(1, DL.DATE, lastRow, 1);
  var streakRange = log.getRange(1, DL.STREAK, lastRow, 1);

  var chart = chartsSheet.newChart()
    .setChartType(Charts.ChartType.COLUMN)
    .addRange(dateRange)
    .addRange(streakRange)
    .setPosition(22, 9, 0, 0)
    .setOption('title', 'Streak History')
    .setOption('hAxis.title', '')
    .setOption('vAxis.title', 'Days')
    .setOption('legend', { position: 'none' })
    .setOption('width', 500)
    .setOption('height', 300)
    .setOption('colors', [COLORS.ACCENT_GREEN])
    .build();

  chartsSheet.insertChart(chart);
}

/**
 * Attribute Trend — Line chart showing all 6 attributes over time
 */
function createAttributeTrendChart(chartsSheet, log, lastRow) {
  // Build a range with dates + all 6 attribute columns
  var dataRange = log.getRange(1, DL.DATE, lastRow, 1);

  var chartBuilder = chartsSheet.newChart()
    .setChartType(Charts.ChartType.LINE)
    .addRange(dataRange);

  // Add each attribute as a series
  for (var a = DL.ATTR_START; a <= DL.ATTR_END; a++) {
    chartBuilder.addRange(log.getRange(1, a, lastRow, 1));
  }

  var chart = chartBuilder
    .setPosition(42, 1, 0, 0)
    .setOption('title', 'Character Attributes Over Time')
    .setOption('hAxis.title', '')
    .setOption('vAxis.title', 'Rating (1-5)')
    .setOption('vAxis.minValue', 1)
    .setOption('vAxis.maxValue', 5)
    .setOption('legend', { position: 'bottom' })
    .setOption('width', 900)
    .setOption('height', 400)
    .setOption('curveType', 'function')
    .setOption('lineWidth', 2)
    .setOption('colors', ['#e53935', '#42a5f5', '#fdd835', '#00695c', '#6a1b9a', '#ff6f00'])
    .build();

  chartsSheet.insertChart(chart);
}

/**
 * Body Metrics Trend — Weight + Body Fat combo chart
 */
function createBodyMetricsChart(chartsSheet, log, lastRow) {
  var dateRange = log.getRange(1, DL.DATE, lastRow, 1);
  var weightRange = log.getRange(1, DL.WEIGHT, lastRow, 1);
  var bfRange = log.getRange(1, DL.BODY_FAT, lastRow, 1);

  var chart = chartsSheet.newChart()
    .setChartType(Charts.ChartType.COMBO)
    .addRange(dateRange)
    .addRange(weightRange)
    .addRange(bfRange)
    .setPosition(42, 9, 0, 0)
    .setOption('title', 'Body Metrics')
    .setOption('hAxis.title', '')
    .setOption('legend', { position: 'bottom' })
    .setOption('width', 500)
    .setOption('height', 350)
    .setOption('series', {
      0: { type: 'line', color: COLORS.ACCENT_BLUE, targetAxisIndex: 0 },
      1: { type: 'line', color: COLORS.ACCENT_RED, targetAxisIndex: 1 }
    })
    .setOption('vAxes', {
      0: { title: 'Weight (lbs)' },
      1: { title: 'Body Fat %' }
    })
    .build();

  chartsSheet.insertChart(chart);
}

/**
 * Check if there's any body metrics data to chart
 */
function hasBodyMetrics(log, lastRow) {
  if (lastRow < 2) return false;
  var weights = log.getRange(2, DL.WEIGHT, lastRow - 1, 1).getValues();
  for (var i = 0; i < weights.length; i++) {
    if (weights[i][0] && weights[i][0] > 0) return true;
  }
  return false;
}
