/**
 * radar-chart.js — Canvas 2D hexagonal radar chart for character stats
 */

import { ATTRIBUTES } from '../../config.js';

/**
 * Create a radar chart canvas element
 * @param {number[]} values - array of 6 attribute values (0-5 scale)
 * @param {number} size - canvas size in px (default 240)
 * @returns {HTMLCanvasElement}
 */
export function createRadarChart(values, size = 240) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  canvas.className = 'radar-chart';

  const ctx = canvas.getContext('2d');
  const cx = size / 2;
  const cy = size / 2;
  const maxRadius = size * 0.38;
  const labels = ATTRIBUTES;
  const n = labels.length;
  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2; // Start from top

  // Background
  ctx.fillStyle = 'transparent';
  ctx.fillRect(0, 0, size, size);

  // Grid lines (5 levels)
  for (let level = 1; level <= 5; level++) {
    const r = (level / 5) * maxRadius;
    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
      const angle = startAngle + i * angleStep;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = 'rgba(168, 162, 158, 0.15)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Axis lines
  for (let i = 0; i < n; i++) {
    const angle = startAngle + i * angleStep;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + maxRadius * Math.cos(angle), cy + maxRadius * Math.sin(angle));
    ctx.strokeStyle = 'rgba(168, 162, 158, 0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Data polygon
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const val = Math.min(Math.max(values[i] || 0, 0), 5);
    const r = (val / 5) * maxRadius;
    const angle = startAngle + i * angleStep;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();

  // Fill
  ctx.fillStyle = 'rgba(212, 165, 116, 0.2)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(212, 165, 116, 0.8)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Data points
  for (let i = 0; i < n; i++) {
    const val = Math.min(Math.max(values[i] || 0, 0), 5);
    const r = (val / 5) * maxRadius;
    const angle = startAngle + i * angleStep;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);

    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2 * Math.PI);
    ctx.fillStyle = '#D4A574';
    ctx.fill();
  }

  // Labels
  ctx.font = '500 11px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#A8A29E';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (let i = 0; i < n; i++) {
    const angle = startAngle + i * angleStep;
    const labelR = maxRadius + 24;
    const x = cx + labelR * Math.cos(angle);
    const y = cy + labelR * Math.sin(angle);

    // Adjust alignment based on position
    if (Math.cos(angle) < -0.1) ctx.textAlign = 'right';
    else if (Math.cos(angle) > 0.1) ctx.textAlign = 'left';
    else ctx.textAlign = 'center';

    ctx.fillText(labels[i], x, y);

    // Value next to label
    const val = values[i] || 0;
    if (val > 0) {
      ctx.font = '700 11px "Space Mono", monospace';
      ctx.fillStyle = '#D4A574';
      const valX = x + (ctx.textAlign === 'right' ? -2 : ctx.textAlign === 'left' ? 2 : 0);
      ctx.fillText(val.toFixed(1), valX, y + 14);
      ctx.font = '500 11px "Space Grotesk", sans-serif';
      ctx.fillStyle = '#A8A29E';
    }
  }

  return canvas;
}
