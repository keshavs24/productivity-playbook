/**
 * progress-bar.js — Thin horizontal progress bar
 * Replaces the SVG progress ring with a cleaner, minimal indicator.
 *
 * Usage:
 *   createProgressBar(percentage, { variant, thick })
 *   Returns an HTML string.
 */

export function createProgressBar(percentage, opts = {}) {
  const pct = Math.max(0, Math.min(100, percentage));
  const variant = opts.variant || ''; // 'thinking' | 'drive' | 'influence' | 'leadership' | ''
  const thick = opts.thick ? ' progress-bar--thick' : '';
  const variantClass = variant ? ` progress-bar--${variant}` : '';

  return `<div class="progress-bar${thick}${variantClass}" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100">
  <div class="progress-bar__fill" style="width: ${pct}%"></div>
</div>`;
}

/**
 * Update an existing progress bar element's fill width.
 */
export function updateProgressBar(el, percentage) {
  const fill = el.querySelector('.progress-bar__fill');
  if (fill) {
    fill.style.width = `${Math.max(0, Math.min(100, percentage))}%`;
    el.setAttribute('aria-valuenow', Math.round(percentage));
  }
}
