/**
 * quick-checkin.js — Fast habit check-off circles
 *
 * Renders habits as circular tap targets in a compact row.
 * One tap = toggle + save + recalc XP. Zero friction.
 *
 * Design: Apple Fitness rings inspired — each habit is a circle
 * that fills with color when completed.
 */

import { toggleHabit } from '../firebase.js';
import { getHabits } from '../user-config.js';

// Colors for habit circles (cycle through these)
const CIRCLE_COLORS = [
  '#FF6B6B', // coral
  '#FF9F43', // orange
  '#FECA57', // yellow
  '#48DBFB', // cyan
  '#0ABDE3', // blue
  '#5F27CD', // purple
  '#FF6348', // red-orange
  '#2ED573', // green
  '#1DD1A1', // teal
];

/**
 * Create the quick check-in component.
 * @param {boolean[]} habitStates - Current habit completion states
 * @param {function} onToggle - Called with (index, newState) after toggle
 * @returns {HTMLElement}
 */
export function createQuickCheckin(habitStates, onToggle) {
  const habits = getHabits();

  const container = document.createElement('div');
  container.className = 'quick-checkin';

  // Circles row
  const circlesRow = document.createElement('div');
  circlesRow.className = 'quick-checkin__circles';

  habits.forEach((name, i) => {
    const done = habitStates[i] || false;
    const color = CIRCLE_COLORS[i % CIRCLE_COLORS.length];

    const circle = document.createElement('button');
    circle.type = 'button';
    circle.className = 'quick-circle';
    if (done) circle.classList.add('quick-circle--done');
    circle.setAttribute('aria-label', name);
    circle.setAttribute('aria-pressed', done ? 'true' : 'false');
    circle.title = name;

    // SVG ring
    const size = 48;
    const radius = 20;
    const circumference = 2 * Math.PI * radius;

    circle.style.setProperty('--circle-color', color);
    circle.style.setProperty('--circumference', circumference);

    // Abbreviation label (first letter or emoji)
    const label = document.createElement('span');
    label.className = 'quick-circle__label';
    label.textContent = getAbbrev(name);
    circle.appendChild(label);

    circle.addEventListener('click', async () => {
      const newState = !circle.classList.contains('quick-circle--done');
      circle.classList.toggle('quick-circle--done', newState);
      circle.setAttribute('aria-pressed', newState ? 'true' : 'false');

      // Haptic feedback on mobile
      if (navigator.vibrate) navigator.vibrate(10);

      // Save immediately
      await toggleHabit(i, newState);
      if (onToggle) onToggle(i, newState);

      // Check if all done
      const allDone = container.querySelectorAll('.quick-circle--done').length === habits.length;
      if (allDone) {
        container.classList.add('quick-checkin--complete');
      } else {
        container.classList.remove('quick-checkin--complete');
      }
    });

    circlesRow.appendChild(circle);
  });

  container.appendChild(circlesRow);

  // Completion count
  const doneCount = habitStates.filter(Boolean).length;
  const counter = document.createElement('div');
  counter.className = 'quick-checkin__counter';
  counter.textContent = `${doneCount}/${habits.length}`;
  container.appendChild(counter);

  return container;
}

function getAbbrev(name) {
  // Special cases
  if (name.toLowerCase().includes('fajr')) return '🌙';
  if (name.toLowerCase().includes('prayer')) return '🤲';
  if (name.toLowerCase().includes('workout') || name.toLowerCase().includes('gym')) return '💪';
  if (name.toLowerCase().includes('deep work')) return '🧠';
  if (name.toLowerCase().includes('ship')) return '🚀';
  if (name.toLowerCase().includes('quran')) return '📖';
  if (name.toLowerCase().includes('read')) return '📚';

  // Default: first 2 chars
  return name.slice(0, 2).toUpperCase();
}
