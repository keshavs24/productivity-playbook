/**
 * toast.js — Achievement notification toast
 */

/**
 * Show an achievement toast notification
 * @param {string} icon - emoji or badge icon
 * @param {string} name - achievement name
 * @param {number} xp - XP reward
 */
export function showAchievementToast(icon, name, xp) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast achievement-toast';
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <div class="toast-content">
      <strong>${name}</strong>
      <span class="toast-xp">+${xp} XP</span>
    </div>
  `;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('toast--visible');
  });

  setTimeout(() => {
    toast.classList.remove('toast--visible');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/**
 * Show a PR toast
 */
export function showPRToast(exercise, weight, reps) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast pr-toast';
  toast.innerHTML = `
    <span class="toast-icon">&#11088;</span>
    <div class="toast-content">
      <strong>NEW PR: ${exercise}</strong>
      <span>${weight}lb x ${reps}</span>
    </div>
  `;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('toast--visible');
  });

  setTimeout(() => {
    toast.classList.remove('toast--visible');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
