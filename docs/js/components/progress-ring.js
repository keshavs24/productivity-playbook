/**
 * progress-ring.js — SVG circular progress ring component
 */

/**
 * Create an SVG progress ring
 * @param {number} percentage - 0 to 1
 * @param {string} label - text in center (e.g. level number)
 * @param {string} sublabel - smaller text below (e.g. title)
 * @param {number} size - diameter in px (default 120)
 * @returns {string} SVG HTML string
 */
export function createProgressRing(percentage, label = '', sublabel = '', size = 120) {
  const strokeWidth = 8;
  const radius = (size / 2) - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(Math.max(percentage, 0), 1));

  return `
    <svg class="progress-ring" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <circle
        class="progress-ring__bg"
        cx="${size / 2}" cy="${size / 2}" r="${radius}"
        fill="none" stroke="var(--bg-elevated)" stroke-width="${strokeWidth}"
      />
      <circle
        class="progress-ring__progress"
        cx="${size / 2}" cy="${size / 2}" r="${radius}"
        fill="none" stroke="var(--accent-gold)" stroke-width="${strokeWidth}"
        stroke-linecap="round"
        stroke-dasharray="${circumference}"
        stroke-dashoffset="${offset}"
        transform="rotate(-90 ${size / 2} ${size / 2})"
      />
      <text x="${size / 2}" y="${sublabel ? size / 2 - 4 : size / 2}"
        text-anchor="middle" dominant-baseline="central"
        class="progress-ring__label"
        fill="var(--text-primary)" font-size="${size > 100 ? 24 : 18}" font-weight="700"
        font-family="'Space Mono', monospace"
      >${label}</text>
      ${sublabel ? `
      <text x="${size / 2}" y="${size / 2 + 16}"
        text-anchor="middle" dominant-baseline="central"
        fill="var(--accent-gold)" font-size="10" font-weight="500"
        font-family="'Space Grotesk', sans-serif"
      >${sublabel}</text>` : ''}
    </svg>
  `;
}
