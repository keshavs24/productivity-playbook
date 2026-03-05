/**
 * Utils.js — Shared helpers for the Productivity Playbook
 */

/**
 * Get day of year (1-366)
 */
function getDayOfYear(date) {
  var start = new Date(date.getFullYear(), 0, 0);
  var diff = date - start;
  var oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/**
 * Get Monday of the week containing the given date
 */
function getMonday(date) {
  var d = new Date(date);
  var day = d.getDay();
  var diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Calendar days between two dates (absolute value)
 */
function daysBetween(d1, d2) {
  var oneDay = 1000 * 60 * 60 * 24;
  var date1 = new Date(d1);
  var date2 = new Date(d2);
  date1.setHours(0, 0, 0, 0);
  date2.setHours(0, 0, 0, 0);
  return Math.abs(Math.round((date2 - date1) / oneDay));
}

/**
 * Days remaining until a target date (negative if past)
 */
function daysUntil(targetDateStr) {
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  var target = new Date(targetDateStr);
  target.setHours(0, 0, 0, 0);
  var oneDay = 1000 * 60 * 60 * 24;
  return Math.round((target - today) / oneDay);
}

/**
 * Strip time from a Date, returning midnight
 */
function stripTime(date) {
  var d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Check if two dates are the same calendar day
 */
function isSameDay(d1, d2) {
  return stripTime(d1).getTime() === stripTime(d2).getTime();
}

/**
 * Format number as currency: $XX,XXX
 */
function formatCurrency(num) {
  if (num === null || num === undefined || num === '') return '$0';
  return '$' + Number(num).toLocaleString('en-US', { maximumFractionDigits: 0 });
}

/**
 * Get the last non-empty value from a column range
 */
function getLastNonEmpty(sheet, col, startRow) {
  var lastRow = sheet.getLastRow();
  if (lastRow < startRow) return null;
  var range = sheet.getRange(startRow, col, lastRow - startRow + 1, 1);
  var values = range.getValues();
  for (var i = values.length - 1; i >= 0; i--) {
    if (values[i][0] !== '' && values[i][0] !== null) {
      return values[i][0];
    }
  }
  return null;
}

/**
 * Find the row number for a specific date in Daily Log
 * Returns -1 if not found
 */
function findDateRow(sheet, targetDate, startRow) {
  startRow = startRow || 2;
  var lastRow = sheet.getLastRow();
  if (lastRow < startRow) return -1;

  var target = stripTime(targetDate);
  var dates = sheet.getRange(startRow, DL.DATE, lastRow - startRow + 1, 1).getValues();

  for (var i = 0; i < dates.length; i++) {
    if (dates[i][0] instanceof Date && isSameDay(dates[i][0], target)) {
      return i + startRow;
    }
  }
  return -1;
}

/**
 * Get sheet by name, or null if it doesn't exist
 */
function getSheet(name) {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
}

/**
 * Safely get a value from a cell, returning default if empty
 */
function getCellValue(sheet, row, col, defaultVal) {
  var val = sheet.getRange(row, col).getValue();
  if (val === '' || val === null || val === undefined) return defaultVal;
  return val;
}

/**
 * Column letter from 1-indexed number (1=A, 2=B, ... 26=Z, 27=AA)
 */
function colLetter(colNum) {
  var letter = '';
  while (colNum > 0) {
    var mod = (colNum - 1) % 26;
    letter = String.fromCharCode(65 + mod) + letter;
    colNum = Math.floor((colNum - mod) / 26);
  }
  return letter;
}

/**
 * Build an A1-notation range string
 */
function rangeA1(col, row, col2, row2) {
  if (col2 && row2) {
    return colLetter(col) + row + ':' + colLetter(col2) + row2;
  }
  return colLetter(col) + row;
}

/**
 * Get today as a Date with time stripped
 */
function today() {
  return stripTime(new Date());
}

/**
 * Get yesterday as a Date with time stripped
 */
function yesterday() {
  var d = new Date();
  d.setDate(d.getDate() - 1);
  return stripTime(d);
}
