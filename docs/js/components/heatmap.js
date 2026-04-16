/**
 * heatmap.js — Calendar heatmap (GitHub-style)
 * Replaces the streak counter with a visual calendar showing activity intensity.
 *
 * Usage:
 *   createHeatmap(data, weeks)
 *   data: Map<'YYYY-MM-DD', { score: 0-4 }>
 *   weeks: number of weeks to show (default 4)
 *   Returns an HTML string.
 */

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export function createHeatmap(data, weeks = 4) {
  const today = new Date();
  const todayStr = formatDate(today);

  // Find the Monday of (weeks) weeks ago
  const startDate = new Date(today);
  const dayOfWeek = startDate.getDay() || 7; // Sunday = 7
  startDate.setDate(startDate.getDate() - dayOfWeek + 1 - (weeks - 1) * 7);

  // Day labels row
  let html = '<div class="heatmap" style="grid-template-columns: repeat(7, 1fr);">';

  // Day labels
  DAY_LABELS.forEach(d => {
    html += `<div class="heatmap__day-label">${d}</div>`;
  });

  // Cells
  const totalDays = weeks * 7;
  for (let i = 0; i < totalDays; i++) {
    const cellDate = new Date(startDate);
    cellDate.setDate(startDate.getDate() + i);
    const dateStr = formatDate(cellDate);

    let levelClass = '';
    if (dateStr > todayStr) {
      levelClass = ' heatmap__cell--future';
    } else if (data.has(dateStr)) {
      const score = data.get(dateStr).score;
      if (score > 0) levelClass = ` heatmap__cell--l${Math.min(score, 4)}`;
    }

    const isToday = dateStr === todayStr;
    const todayStyle = isToday ? ' style="outline: 1px solid var(--accent); outline-offset: 1px;"' : '';

    html += `<div class="heatmap__cell${levelClass}"${todayStyle} title="${dateStr}"></div>`;
  }

  html += '</div>';
  return html;
}

/**
 * Convert a daily log array to heatmap data.
 * Expects rows with [date, completed, ...habits].
 * Score = number of habits completed (0-7, mapped to 0-4 levels).
 */
export function logToHeatmapData(logRows, habitCount = 7) {
  const data = new Map();

  logRows.forEach(row => {
    if (!row[0]) return;
    const date = row[0] instanceof Date ? formatDate(row[0]) : String(row[0]);
    const completed = row[1];

    // Count habits done (columns 2 through 2+habitCount)
    let habitsDone = 0;
    for (let i = 2; i < 2 + habitCount; i++) {
      if (row[i]) habitsDone++;
    }

    // Map 0-7 habits to 0-4 intensity levels
    let score = 0;
    if (habitsDone >= 1) score = 1;
    if (habitsDone >= 3) score = 2;
    if (habitsDone >= 5) score = 3;
    if (habitsDone >= 7) score = 4;

    data.set(date, { score, completed: !!completed, habitsDone });
  });

  return data;
}

function formatDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
