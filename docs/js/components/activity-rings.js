/**
 * activity-rings.js — Apple Health-style concentric activity rings
 *
 * Three rings showing daily progress:
 *   Outer (red/coral): Habits completion %
 *   Middle (green): XP earned today vs target
 *   Inner (blue): Prayer completion %
 *
 * Each ring is an SVG arc that animates from 0 to current %.
 */

/**
 * Create activity rings component.
 * @param {object} data
 *   - habits: { done: number, total: number }
 *   - xp: { earned: number, target: number }
 *   - prayers: { done: number, total: number }
 * @param {number} size - Overall size in px (default 180)
 * @returns {string} HTML string
 */
export function createActivityRings(data, size = 180) {
  const center = size / 2;
  const strokeWidth = 12;
  const gap = 16;

  const rings = [
    {
      label: 'Habits',
      pct: data.habits.total > 0 ? (data.habits.done / data.habits.total) : 0,
      color: '#FF6B6B',
      glow: 'rgba(255, 107, 107, 0.3)',
      radius: (size / 2) - strokeWidth / 2 - 4,
    },
    {
      label: 'XP',
      pct: data.xp.target > 0 ? Math.min(1, data.xp.earned / data.xp.target) : 0,
      color: '#2ED573',
      glow: 'rgba(46, 213, 115, 0.3)',
      radius: (size / 2) - strokeWidth / 2 - 4 - gap,
    },
    {
      label: 'Prayers',
      pct: data.prayers.total > 0 ? (data.prayers.done / data.prayers.total) : 0,
      color: '#48DBFB',
      glow: 'rgba(72, 219, 251, 0.3)',
      radius: (size / 2) - strokeWidth / 2 - 4 - gap * 2,
    },
  ];

  let ringSvg = '';

  rings.forEach(ring => {
    const circumference = 2 * Math.PI * ring.radius;
    const offset = circumference * (1 - ring.pct);

    // Track (dark background ring)
    ringSvg += `<circle
      cx="${center}" cy="${center}" r="${ring.radius}"
      fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="${strokeWidth}"
      stroke-linecap="round"
    />`;

    // Fill (colored arc)
    if (ring.pct > 0) {
      ringSvg += `<circle
        cx="${center}" cy="${center}" r="${ring.radius}"
        fill="none" stroke="${ring.color}" stroke-width="${strokeWidth}"
        stroke-linecap="round"
        stroke-dasharray="${circumference}"
        stroke-dashoffset="${offset}"
        transform="rotate(-90 ${center} ${center})"
        style="transition: stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1); filter: drop-shadow(0 0 6px ${ring.glow});"
      />`;
    }

    // End cap glow (small circle at the end of the arc)
    if (ring.pct > 0.05) {
      const angle = (ring.pct * 360 - 90) * (Math.PI / 180);
      const endX = center + ring.radius * Math.cos(angle);
      const endY = center + ring.radius * Math.sin(angle);
      ringSvg += `<circle cx="${endX}" cy="${endY}" r="${strokeWidth / 2 + 1}" fill="${ring.color}" opacity="0.6" />`;
    }
  });

  return `<div class="activity-rings" style="width: ${size}px; height: ${size}px; margin: 0 auto;">
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    ${ringSvg}
  </svg>
  <div class="activity-rings__labels">
    ${rings.map(r => `<div class="activity-rings__label" style="color: ${r.color};">
      <span class="activity-rings__value">${Math.round(r.pct * 100)}%</span>
      <span class="activity-rings__name">${r.label}</span>
    </div>`).join('')}
  </div>
</div>`;
}
