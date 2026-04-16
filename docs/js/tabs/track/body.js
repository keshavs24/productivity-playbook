/**
 * track/body.js — Body composition tracker sub-tab
 * AM/PM weight, body fat, 7-day trends.
 */

import { getTodayBodyComp, updateBodyComp, getRecentLogs } from '../../firebase.js';
import { createProgressBar } from '../../components/progress-bar.js';
import { CUT } from '../../../config.js';

export async function renderBodySubTab(container) {
  const [bodyComp, recentLogs] = await Promise.all([
    getTodayBodyComp(),
    getRecentLogs(7)
  ]);

  container.textContent = '';

  // Today's entries
  const todayLabel = document.createElement('h3');
  todayLabel.className = 'section-label';
  todayLabel.textContent = 'Today';
  container.appendChild(todayLabel);

  const todayCard = document.createElement('div');
  todayCard.className = 'card stack stack--4';

  // AM weight
  const amRow = document.createElement('div');
  amRow.className = 'row row--between';
  const amLabel = document.createElement('span');
  amLabel.className = 'text-muted';
  amLabel.style.fontSize = '0.875rem';
  amLabel.textContent = 'AM Weight (fasted)';
  amRow.appendChild(amLabel);
  const amInput = document.createElement('input');
  amInput.type = 'number';
  amInput.className = 'input';
  amInput.style.cssText = 'width: 100px; text-align: right;';
  amInput.step = '0.1';
  amInput.placeholder = 'lbs';
  amInput.value = bodyComp ? (bodyComp.amWeight || '') : '';
  amInput.addEventListener('change', async () => {
    await updateBodyComp({ amWeight: Number(amInput.value) || 0 });
  });
  amRow.appendChild(amInput);
  todayCard.appendChild(amRow);

  // PM weight
  const pmRow = document.createElement('div');
  pmRow.className = 'row row--between';
  const pmLabel = document.createElement('span');
  pmLabel.className = 'text-muted';
  pmLabel.style.fontSize = '0.875rem';
  pmLabel.textContent = 'PM Weight';
  pmRow.appendChild(pmLabel);
  const pmInput = document.createElement('input');
  pmInput.type = 'number';
  pmInput.className = 'input';
  pmInput.style.cssText = 'width: 100px; text-align: right;';
  pmInput.step = '0.1';
  pmInput.placeholder = 'lbs';
  pmInput.value = bodyComp ? (bodyComp.pmWeight || '') : '';
  pmInput.addEventListener('change', async () => {
    await updateBodyComp({ pmWeight: Number(pmInput.value) || 0 });
  });
  pmRow.appendChild(pmInput);
  todayCard.appendChild(pmRow);

  // Body fat
  const bfRow = document.createElement('div');
  bfRow.className = 'row row--between';
  const bfLabel = document.createElement('span');
  bfLabel.className = 'text-muted';
  bfLabel.style.fontSize = '0.875rem';
  bfLabel.textContent = 'Body Fat %';
  bfRow.appendChild(bfLabel);
  const bfInput = document.createElement('input');
  bfInput.type = 'number';
  bfInput.className = 'input';
  bfInput.style.cssText = 'width: 100px; text-align: right;';
  bfInput.step = '0.1';
  bfInput.placeholder = '%';
  bfInput.value = bodyComp ? (bodyComp.bodyFat || '') : '';
  bfInput.addEventListener('change', async () => {
    await updateBodyComp({ bodyFat: Number(bfInput.value) || 0 });
  });
  bfRow.appendChild(bfInput);
  todayCard.appendChild(bfRow);

  container.appendChild(todayCard);

  // Cut progress
  const progressLabel = document.createElement('h3');
  progressLabel.className = 'section-label';
  progressLabel.textContent = 'Cut Progress';
  container.appendChild(progressLabel);

  const progressCard = document.createElement('div');
  progressCard.className = 'card stack stack--3';

  const latestWeight = bodyComp && bodyComp.amWeight ? bodyComp.amWeight :
    (recentLogs.length > 0 ? recentLogs[recentLogs.length - 1].weight : CUT.START_WEIGHT);
  const latestBF = bodyComp && bodyComp.bodyFat ? bodyComp.bodyFat :
    (recentLogs.length > 0 ? recentLogs[recentLogs.length - 1].bodyFat : CUT.START_BF);

  const weightLost = CUT.START_WEIGHT - (latestWeight || CUT.START_WEIGHT);
  const bfDrop = CUT.START_BF - (latestBF || CUT.START_BF);
  const targetWeightLoss = CUT.START_WEIGHT - CUT.TARGET_WEIGHT;
  const targetBFDrop = CUT.START_BF - CUT.TARGET_BF;

  // Weight progress
  const wpRow = document.createElement('div');
  wpRow.className = 'row row--between';
  wpRow.style.marginBottom = 'var(--sp-2)';
  const wpLabel = document.createElement('span');
  wpLabel.className = 'text-muted';
  wpLabel.style.fontSize = '0.875rem';
  wpLabel.textContent = `Weight: ${(latestWeight || CUT.START_WEIGHT).toFixed(1)} lbs`;
  wpRow.appendChild(wpLabel);
  const wpTarget = document.createElement('span');
  wpTarget.style.cssText = 'font-size: 0.75rem; color: var(--text-tertiary);';
  wpTarget.textContent = `Target: ${CUT.TARGET_WEIGHT} lbs`;
  wpRow.appendChild(wpTarget);
  progressCard.appendChild(wpRow);
  progressCard.insertAdjacentHTML('beforeend',
    createProgressBar(Math.max(0, Math.min(100, (weightLost / targetWeightLoss) * 100)), { thick: true }));

  // BF progress
  const bfpRow = document.createElement('div');
  bfpRow.className = 'row row--between';
  bfpRow.style.cssText = 'margin-top: var(--sp-4); margin-bottom: var(--sp-2);';
  const bfpLabel = document.createElement('span');
  bfpLabel.className = 'text-muted';
  bfpLabel.style.fontSize = '0.875rem';
  bfpLabel.textContent = `Body Fat: ${(latestBF || CUT.START_BF).toFixed(1)}%`;
  bfpRow.appendChild(bfpLabel);
  const bfpTarget = document.createElement('span');
  bfpTarget.style.cssText = 'font-size: 0.75rem; color: var(--text-tertiary);';
  bfpTarget.textContent = `Target: ${CUT.TARGET_BF}%`;
  bfpRow.appendChild(bfpTarget);
  progressCard.appendChild(bfpRow);
  progressCard.insertAdjacentHTML('beforeend',
    createProgressBar(Math.max(0, Math.min(100, (bfDrop / targetBFDrop) * 100)), { thick: true }));

  container.appendChild(progressCard);

  // 7-day weight trend
  const trendWeights = recentLogs.filter(l => l.weight > 0);
  if (trendWeights.length > 1) {
    const trendLabel = document.createElement('h3');
    trendLabel.className = 'section-label';
    trendLabel.textContent = '7-Day Weight';
    container.appendChild(trendLabel);

    const trendCard = document.createElement('div');
    trendCard.className = 'card stack stack--2';

    trendWeights.forEach(l => {
      const row = document.createElement('div');
      row.className = 'row row--between';
      row.style.padding = 'var(--sp-1) 0';
      const dateEl = document.createElement('span');
      dateEl.className = 'text-muted';
      dateEl.style.fontSize = '0.8125rem';
      const d = new Date(l.date);
      dateEl.textContent = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      row.appendChild(dateEl);
      const weightEl = document.createElement('span');
      weightEl.className = 'data-value';
      weightEl.style.fontSize = '0.875rem';
      weightEl.textContent = `${l.weight} lbs`;
      row.appendChild(weightEl);
      trendCard.appendChild(row);
    });

    container.appendChild(trendCard);
  }

  // Spacer
  const spacer = document.createElement('div');
  spacer.style.height = 'var(--sp-8)';
  container.appendChild(spacer);
}
