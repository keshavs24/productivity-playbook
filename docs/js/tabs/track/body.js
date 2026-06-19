/**
 * track/body.js — Body composition tracker sub-tab
 * AM/PM weight, body fat, 14-day trends with deltas.
 */

import { getTodayBodyComp, updateBodyComp, getRecentBodyComp } from '../../firebase.js';
import { createProgressBar } from '../../components/progress-bar.js';
import { getBodyTargets } from '../../user-config.js';

export async function renderBodySubTab(container) {
  container.textContent = '';

  const [bodyComp, recentData] = await Promise.all([
    getTodayBodyComp(),
    getRecentBodyComp(14)
  ]);

  const bt = getBodyTargets();

  // ----- Card 1: Log Today -----
  const todayLabel = document.createElement('h3');
  todayLabel.className = 'section-label';
  todayLabel.textContent = 'Today';
  container.appendChild(todayLabel);

  const todayCard = document.createElement('div');
  todayCard.className = 'card stack stack--4';

  todayCard.appendChild(createInputRow('AM Weight (fasted)', 'lbs', bodyComp?.amWeight, async (val) => {
    await updateBodyComp({ amWeight: Number(val) || 0 });
  }));
  todayCard.appendChild(createInputRow('PM Weight', 'lbs', bodyComp?.pmWeight, async (val) => {
    await updateBodyComp({ pmWeight: Number(val) || 0 });
  }));
  todayCard.appendChild(createInputRow('Body Fat %', '%', bodyComp?.bodyFat, async (val) => {
    await updateBodyComp({ bodyFat: Number(val) || 0 });
  }));

  container.appendChild(todayCard);

  // ----- Card 2: Cut Progress -----
  const progressLabel = document.createElement('h3');
  progressLabel.className = 'section-label';
  progressLabel.textContent = 'Cut Progress';
  container.appendChild(progressLabel);

  const progressCard = document.createElement('div');
  progressCard.className = 'card stack stack--3';

  const currentWeight = bodyComp?.amWeight || bt.startWeight;
  const currentBF = bodyComp?.bodyFat || bt.startBF;

  const weightLost = bt.startWeight - currentWeight;
  const targetWeightLoss = bt.startWeight - bt.targetWeight;
  const weightPct = Math.max(0, Math.min(100, (weightLost / targetWeightLoss) * 100));

  const bfDrop = bt.startBF - currentBF;
  const targetBFDrop = bt.startBF - bt.targetBF;
  const bfPct = Math.max(0, Math.min(100, (bfDrop / targetBFDrop) * 100));

  // Weight progress
  const wpRow = document.createElement('div');
  wpRow.className = 'row row--between';
  wpRow.style.marginBottom = 'var(--sp-2)';
  const wpLabel = document.createElement('span');
  wpLabel.className = 'text-muted';
  wpLabel.style.fontSize = '0.875rem';
  wpLabel.textContent = `Weight: ${currentWeight.toFixed(1)} lbs`;
  wpRow.appendChild(wpLabel);
  const wpTarget = document.createElement('span');
  wpTarget.style.cssText = 'font-size: 0.75rem; color: var(--text-tertiary);';
  wpTarget.textContent = `Target: ${bt.targetWeight} lbs`;
  wpRow.appendChild(wpTarget);
  progressCard.appendChild(wpRow);
  progressCard.insertAdjacentHTML('beforeend', createProgressBar(weightPct, { thick: true }));

  // Body fat progress
  const bfpRow = document.createElement('div');
  bfpRow.className = 'row row--between';
  bfpRow.style.cssText = 'margin-top: var(--sp-4); margin-bottom: var(--sp-2);';
  const bfpLabel = document.createElement('span');
  bfpLabel.className = 'text-muted';
  bfpLabel.style.fontSize = '0.875rem';
  bfpLabel.textContent = `Body Fat: ${currentBF.toFixed(1)}%`;
  bfpRow.appendChild(bfpLabel);
  const bfpTarget = document.createElement('span');
  bfpTarget.style.cssText = 'font-size: 0.75rem; color: var(--text-tertiary);';
  bfpTarget.textContent = `Target: ${bt.targetBF}%`;
  bfpRow.appendChild(bfpTarget);
  progressCard.appendChild(bfpRow);
  progressCard.insertAdjacentHTML('beforeend', createProgressBar(bfPct, { thick: true }));

  container.appendChild(progressCard);

  // ----- Card 3: Weight Trend (14 days) -----
  const withWeight = recentData.filter(d => (d.amWeight || 0) > 0 || (d.pmWeight || 0) > 0);

  if (withWeight.length > 0) {
    const trendLabel = document.createElement('h3');
    trendLabel.className = 'section-label';
    trendLabel.textContent = 'Weight Trend';
    container.appendChild(trendLabel);

    const trendCard = document.createElement('div');
    trendCard.className = 'card stack stack--2';

    // Summary row (rolling avg + total change) when >= 2 entries
    if (withWeight.length >= 2) {
      const summaryRow = document.createElement('div');
      summaryRow.className = 'row row--between';
      summaryRow.style.cssText = 'padding-bottom: var(--sp-3); margin-bottom: var(--sp-2); border-bottom: 1px solid var(--bg-subtle);';

      // 7-day rolling average
      const last7 = withWeight.slice(-7);
      const avgWeight = last7.reduce((sum, d) => sum + dailyAvg(d), 0) / last7.length;
      const avgEl = document.createElement('div');
      const avgLabel = document.createElement('div');
      avgLabel.className = 'text-muted';
      avgLabel.style.fontSize = '0.6875rem';
      avgLabel.textContent = `${last7.length}-day avg`;
      avgEl.appendChild(avgLabel);
      const avgVal = document.createElement('div');
      avgVal.className = 'data-value';
      avgVal.style.fontSize = '0.875rem';
      avgVal.textContent = `${avgWeight.toFixed(1)} lbs`;
      avgEl.appendChild(avgVal);
      summaryRow.appendChild(avgEl);

      // Total change
      const firstW = dailyAvg(withWeight[0]);
      const lastW = dailyAvg(withWeight[withWeight.length - 1]);
      const totalDelta = lastW - firstW;
      const changeEl = document.createElement('div');
      changeEl.style.textAlign = 'right';
      const changeLabel = document.createElement('div');
      changeLabel.className = 'text-muted';
      changeLabel.style.fontSize = '0.6875rem';
      changeLabel.textContent = 'Total change';
      changeEl.appendChild(changeLabel);
      const changeVal = document.createElement('div');
      changeVal.className = 'data-value';
      changeVal.style.cssText = `font-size: 0.875rem; color: ${totalDelta <= 0 ? 'var(--success)' : 'var(--error)'};`;
      changeVal.textContent = `${totalDelta > 0 ? '+' : ''}${totalDelta.toFixed(1)} lbs`;
      changeEl.appendChild(changeVal);
      summaryRow.appendChild(changeEl);

      trendCard.appendChild(summaryRow);
    }

    // Daily entries
    withWeight.forEach((entry, i) => {
      const row = document.createElement('div');
      row.className = 'row row--between';
      row.style.padding = 'var(--sp-1) 0';

      const dateEl = document.createElement('span');
      dateEl.className = 'text-muted';
      dateEl.style.fontSize = '0.8125rem';
      dateEl.textContent = formatDateShort(entry.date);
      row.appendChild(dateEl);

      const weight = dailyAvg(entry);
      const weightEl = document.createElement('span');
      weightEl.className = 'data-value';
      weightEl.style.fontSize = '0.875rem';
      weightEl.textContent = `${weight.toFixed(1)} lbs`;
      row.appendChild(weightEl);

      const deltaEl = document.createElement('span');
      deltaEl.style.cssText = 'width: 50px; text-align: right; font-size: 0.75rem; font-weight: 600;';
      if (i > 0) {
        const prevWeight = dailyAvg(withWeight[i - 1]);
        const delta = weight - prevWeight;
        deltaEl.style.color = delta <= 0 ? 'var(--success)' : 'var(--error)';
        deltaEl.textContent = `${delta > 0 ? '+' : ''}${delta.toFixed(1)}`;
      }
      row.appendChild(deltaEl);

      trendCard.appendChild(row);
    });

    container.appendChild(trendCard);
  }

  // Spacer
  const spacer = document.createElement('div');
  spacer.style.height = 'var(--sp-8)';
  container.appendChild(spacer);
}

function createInputRow(label, placeholder, value, onChange) {
  const row = document.createElement('div');
  row.className = 'row row--between';
  const lbl = document.createElement('span');
  lbl.className = 'text-muted';
  lbl.style.fontSize = '0.875rem';
  lbl.textContent = label;
  row.appendChild(lbl);
  const input = document.createElement('input');
  input.type = 'number';
  input.className = 'input';
  input.style.cssText = 'width: 100px; text-align: right;';
  input.step = '0.1';
  input.placeholder = placeholder;
  input.value = value || '';
  input.addEventListener('change', () => onChange(input.value));
  row.appendChild(input);
  return row;
}

function dailyAvg(entry) {
  const am = entry.amWeight || 0;
  const pm = entry.pmWeight || 0;
  if (am > 0 && pm > 0) return (am + pm) / 2;
  return am || pm;
}

function formatDateShort(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
