/**
 * track/goals.js — Goals & Notes sub-tab
 * Create goals with sub-goals (milestones), track progress, add notes.
 * Stored in Firebase: users/{uid}/goals/{goalId}
 */

import { getProfile, updateProfile } from '../../firebase.js';
import { createProgressBar } from '../../components/progress-bar.js';
import { getGoals, refreshConfig } from '../../user-config.js';

// Colors for goal cards
const GOAL_COLORS = ['#FF6B6B', '#FF9F43', '#2ED573', '#48DBFB', '#A78BFA', '#FF6348'];

export async function renderGoalsSubTab(container) {
  container.textContent = '';

  const goals = getGoals();

  // Header + Add button
  const header = document.createElement('div');
  header.className = 'row row--between';
  header.style.padding = 'var(--sp-2) 0 var(--sp-4)';
  const title = document.createElement('h2');
  title.textContent = 'Goals';
  title.style.fontSize = '1.25rem';
  header.appendChild(title);
  const addBtn = document.createElement('button');
  addBtn.type = 'button';
  addBtn.className = 'btn btn--primary';
  addBtn.style.fontSize = '0.8125rem';
  addBtn.textContent = '+ New Goal';
  addBtn.addEventListener('click', () => showGoalForm(container, goals));
  header.appendChild(addBtn);
  container.appendChild(header);

  if (goals.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    const emptyTitle = document.createElement('div');
    emptyTitle.className = 'empty-state__title';
    emptyTitle.textContent = 'No goals yet';
    empty.appendChild(emptyTitle);
    const emptyDesc = document.createElement('div');
    emptyDesc.className = 'empty-state__desc';
    emptyDesc.textContent = 'Create your first goal to start tracking progress.';
    empty.appendChild(emptyDesc);
    container.appendChild(empty);
    return;
  }

  // Render each goal
  goals.forEach((goal, i) => {
    const color = GOAL_COLORS[i % GOAL_COLORS.length];
    const card = document.createElement('div');
    card.className = 'card';
    card.style.cssText = `margin-bottom: var(--sp-3); border-left: 4px solid ${color};`;

    // Goal header
    const goalHeader = document.createElement('div');
    goalHeader.className = 'row row--between';
    goalHeader.style.marginBottom = 'var(--sp-2)';

    const goalTitle = document.createElement('div');
    goalTitle.style.cssText = 'font-weight: 600; font-size: 1rem;';
    goalTitle.textContent = goal.label || 'Untitled Goal';
    goalHeader.appendChild(goalTitle);

    if (goal.deadline) {
      const deadlineEl = document.createElement('div');
      deadlineEl.style.cssText = 'font-size: 0.75rem; color: var(--text-tertiary);';
      const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / 86400000);
      deadlineEl.textContent = daysLeft > 0 ? `${daysLeft}d left` : 'Past due';
      if (daysLeft <= 7) deadlineEl.style.color = 'var(--error)';
      goalHeader.appendChild(deadlineEl);
    }
    card.appendChild(goalHeader);

    // Description
    if (goal.description) {
      const desc = document.createElement('p');
      desc.style.cssText = 'font-size: 0.8125rem; color: var(--text-secondary); margin-bottom: var(--sp-3); line-height: 1.5;';
      desc.textContent = goal.description;
      card.appendChild(desc);
    }

    // Progress
    const current = goal.current || 0;
    const target = goal.target || 100;
    const pct = Math.min(100, (current / target) * 100);

    const progressRow = document.createElement('div');
    progressRow.className = 'row row--between';
    progressRow.style.cssText = 'font-size: 0.75rem; color: var(--text-tertiary); margin-bottom: var(--sp-2);';
    const progressLabel = document.createElement('span');
    progressLabel.textContent = `${current} / ${target}`;
    progressRow.appendChild(progressLabel);
    const progressPct = document.createElement('span');
    progressPct.style.color = color;
    progressPct.style.fontWeight = '600';
    progressPct.textContent = `${Math.round(pct)}%`;
    progressRow.appendChild(progressPct);
    card.appendChild(progressRow);

    const bar = document.createElement('div');
    bar.insertAdjacentHTML('beforeend', createProgressBar(pct, { thick: true }));
    bar.querySelector('.progress-bar__fill').style.background = color;
    card.appendChild(bar);

    // Update progress input
    const updateRow = document.createElement('div');
    updateRow.className = 'row';
    updateRow.style.cssText = 'gap: 8px; margin-top: var(--sp-3);';

    const updateInput = document.createElement('input');
    updateInput.type = 'number';
    updateInput.className = 'input';
    updateInput.style.cssText = 'flex: 1; text-align: right;';
    updateInput.placeholder = 'Current value';
    updateInput.value = current || '';
    updateRow.appendChild(updateInput);

    const updateBtn = document.createElement('button');
    updateBtn.type = 'button';
    updateBtn.className = 'btn btn--secondary';
    updateBtn.style.fontSize = '0.8125rem';
    updateBtn.textContent = 'Update';
    updateBtn.addEventListener('click', async () => {
      const newVal = Number(updateInput.value) || 0;
      goals[i].current = newVal;
      await updateProfile({ goals });
      await refreshConfig();
      await renderGoalsSubTab(container);
    });
    updateRow.appendChild(updateBtn);
    card.appendChild(updateRow);

    // Milestones
    if (goal.milestones && goal.milestones.length > 0) {
      const msLabel = document.createElement('div');
      msLabel.style.cssText = 'font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-tertiary); margin-top: var(--sp-4); margin-bottom: var(--sp-2);';
      msLabel.textContent = 'Milestones';
      card.appendChild(msLabel);

      goal.milestones.forEach((ms, mi) => {
        const msRow = document.createElement('div');
        msRow.className = 'row';
        msRow.style.cssText = 'gap: 8px; padding: var(--sp-1) 0;';

        const checkbox = document.createElement('button');
        checkbox.type = 'button';
        checkbox.style.cssText = `width: 20px; height: 20px; border-radius: 50%; border: 2px solid ${ms.done ? color : 'var(--bg-elevated)'}; background: ${ms.done ? color : 'transparent'}; flex-shrink: 0; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 0.625rem; color: #0F0F0F;`;
        checkbox.textContent = ms.done ? '✓' : '';
        checkbox.addEventListener('click', async () => {
          goals[i].milestones[mi].done = !ms.done;
          await updateProfile({ goals });
          await refreshConfig();
          await renderGoalsSubTab(container);
        });
        msRow.appendChild(checkbox);

        const msText = document.createElement('span');
        msText.style.cssText = `font-size: 0.875rem; ${ms.done ? 'text-decoration: line-through; color: var(--text-tertiary);' : ''}`;
        msText.textContent = ms.text;
        msRow.appendChild(msText);

        card.appendChild(msRow);
      });
    }

    // Notes
    if (goal.notes) {
      const noteEl = document.createElement('p');
      noteEl.style.cssText = 'font-size: 0.8125rem; color: var(--text-tertiary); font-style: italic; margin-top: var(--sp-3); border-top: 1px solid var(--bg-subtle); padding-top: var(--sp-3);';
      noteEl.textContent = goal.notes;
      card.appendChild(noteEl);
    }

    container.appendChild(card);
  });

  // Spacer
  const spacer = document.createElement('div');
  spacer.style.height = 'var(--sp-8)';
  container.appendChild(spacer);
}

function showGoalForm(container, existingGoals) {
  container.textContent = '';

  const form = document.createElement('div');
  form.className = 'stack stack--4';

  const title = document.createElement('h2');
  title.textContent = 'New Goal';
  title.style.marginBottom = 'var(--sp-2)';
  form.appendChild(title);

  const labelInput = document.createElement('input');
  labelInput.type = 'text';
  labelInput.className = 'input';
  labelInput.placeholder = 'Goal name (e.g., $30K MRR)';
  form.appendChild(labelInput);

  const descInput = document.createElement('textarea');
  descInput.className = 'textarea';
  descInput.rows = 2;
  descInput.placeholder = 'Description (optional)';
  form.appendChild(descInput);

  const numRow = document.createElement('div');
  numRow.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr; gap: 8px;';
  const targetInput = document.createElement('input');
  targetInput.type = 'number';
  targetInput.className = 'input';
  targetInput.placeholder = 'Target value';
  numRow.appendChild(targetInput);
  const deadlineInput = document.createElement('input');
  deadlineInput.type = 'date';
  deadlineInput.className = 'input';
  numRow.appendChild(deadlineInput);
  form.appendChild(numRow);

  // Milestones
  const msLabel = document.createElement('div');
  msLabel.style.cssText = 'font-size: 0.8125rem; color: var(--text-secondary); margin-top: var(--sp-2);';
  msLabel.textContent = 'Milestones (optional)';
  form.appendChild(msLabel);

  const milestones = [];
  const msContainer = document.createElement('div');
  msContainer.className = 'stack stack--2';
  form.appendChild(msContainer);

  const addMsBtn = document.createElement('button');
  addMsBtn.type = 'button';
  addMsBtn.className = 'btn btn--ghost';
  addMsBtn.style.fontSize = '0.8125rem';
  addMsBtn.textContent = '+ Add milestone';
  addMsBtn.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'input';
    input.placeholder = `Milestone ${milestones.length + 1}`;
    milestones.push(input);
    msContainer.appendChild(input);
  });
  form.appendChild(addMsBtn);

  // Actions
  const actions = document.createElement('div');
  actions.className = 'row';
  actions.style.cssText = 'gap: 8px; margin-top: var(--sp-4);';

  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.className = 'btn btn--secondary';
  cancelBtn.style.flex = '1';
  cancelBtn.textContent = 'Cancel';
  cancelBtn.addEventListener('click', () => renderGoalsSubTab(container));
  actions.appendChild(cancelBtn);

  const saveBtn = document.createElement('button');
  saveBtn.type = 'button';
  saveBtn.className = 'btn btn--primary';
  saveBtn.style.flex = '1';
  saveBtn.textContent = 'Create Goal';
  saveBtn.addEventListener('click', async () => {
    const label = labelInput.value.trim();
    if (!label) { labelInput.style.borderColor = 'var(--error)'; return; }

    const newGoal = {
      id: 'goal-' + Date.now(),
      label,
      description: descInput.value.trim(),
      target: Number(targetInput.value) || 100,
      current: 0,
      deadline: deadlineInput.value || null,
      milestones: milestones.map(inp => ({ text: inp.value.trim(), done: false })).filter(m => m.text),
      notes: '',
      createdAt: new Date().toISOString()
    };

    const updatedGoals = [...existingGoals, newGoal];
    saveBtn.textContent = 'Creating...';
    saveBtn.disabled = true;
    await updateProfile({ goals: updatedGoals });
    await refreshConfig();
    await renderGoalsSubTab(container);
  });
  actions.appendChild(saveBtn);
  form.appendChild(actions);

  container.appendChild(form);
}
