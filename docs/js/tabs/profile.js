/**
 * profile.js — Profile tab (Firebase backend)
 * Character stats, level/XP, achievement gallery.
 */

import { getRecentLogs, getAchievements, updateProfile } from '../firebase.js';
import { getLevelFromXP, getLevelTitle } from '../engine.js';
import { createProgressBar } from '../components/progress-bar.js';
import {
  getHabits, getAttributes, getMealTypes, getPrayers, getNutritionTargets,
  getBodyTargets, getGoals, refreshConfig, getRawProfile
} from '../user-config.js';

export async function renderProfile(isFirstLoad) {
  const panel = document.getElementById('tab-profile');
  if (!panel) return;

  const [recentLogs, achievements] = await Promise.all([
    getRecentLogs(7),
    getAchievements()
  ]);

  renderProfileContent(panel, recentLogs, achievements);
}

function renderProfileContent(panel, recentLogs, achievements) {
  const latestLog = recentLogs[recentLogs.length - 1] || {};
  const totalXP = latestLog.totalXp || 0;
  const level = getLevelFromXP(totalXP);
  const title = getLevelTitle(level);

  panel.textContent = '';

  // Character card
  const charCard = document.createElement('div');
  charCard.className = 'card';
  charCard.style.textAlign = 'center';

  const levelNum = document.createElement('div');
  levelNum.style.cssText = 'font-family: "Space Grotesk"; font-size: 3rem; font-weight: 700;';
  levelNum.textContent = level;
  charCard.appendChild(levelNum);

  const titleEl = document.createElement('div');
  titleEl.style.cssText = 'color: var(--accent); font-weight: 500; margin-bottom: var(--sp-2);';
  titleEl.textContent = title;
  charCard.appendChild(titleEl);

  const xpEl = document.createElement('div');
  xpEl.className = 'data-value text-muted';
  xpEl.style.fontSize = '0.875rem';
  xpEl.textContent = `${totalXP.toLocaleString()} XP`;
  charCard.appendChild(xpEl);

  panel.appendChild(charCard);

  // Character attributes (7-day averages)
  const attrLabel = document.createElement('h3');
  attrLabel.className = 'section-label';
  attrLabel.textContent = 'Character Stats (7-day avg)';
  panel.appendChild(attrLabel);

  const attrCard = document.createElement('div');
  attrCard.className = 'card stack stack--3';

  const attributes = getAttributes();
  attributes.forEach((attr, i) => {
    const values = recentLogs
      .map(log => (log.attributes || [])[i] || 0)
      .filter(v => v > 0);
    const avg = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;

    const row = document.createElement('div');
    row.className = 'row row--between';

    const label = document.createElement('span');
    label.style.cssText = 'font-size: 0.8125rem; color: var(--text-secondary); width: 120px;';
    label.textContent = attr;
    row.appendChild(label);

    const barWrapper = document.createElement('div');
    barWrapper.style.flex = '1';
    barWrapper.insertAdjacentHTML('beforeend', createProgressBar(avg * 20, { thick: true }));
    row.appendChild(barWrapper);

    const val = document.createElement('span');
    val.className = 'data-value';
    val.style.cssText = 'font-size: 0.75rem; width: 32px; text-align: right;';
    val.textContent = avg > 0 ? avg.toFixed(1) : '—';
    row.appendChild(val);

    attrCard.appendChild(row);
  });

  panel.appendChild(attrCard);

  // Achievements
  const achLabel = document.createElement('h3');
  achLabel.className = 'section-label';
  achLabel.textContent = 'Achievements';
  panel.appendChild(achLabel);

  const achEntries = Object.entries(achievements).filter(([_, v]) => v.unlocked);

  if (achEntries.length > 0) {
    const achCard = document.createElement('div');
    achCard.className = 'card stack stack--2';

    // Sort by unlock date, most recent first
    achEntries
      .sort((a, b) => (b[1].unlockedAt?.seconds || 0) - (a[1].unlockedAt?.seconds || 0))
      .slice(0, 10)
      .forEach(([id, ach]) => {
        const badge = document.createElement('div');
        badge.className = 'badge';

        const icon = document.createElement('div');
        icon.className = `badge__icon badge__icon--${ach.category || 'mastery'}`;
        icon.textContent = '★';
        badge.appendChild(icon);

        const info = document.createElement('div');
        info.className = 'badge__info';
        const name = document.createElement('div');
        name.className = 'badge__name';
        name.textContent = ach.title || id;
        info.appendChild(name);
        const desc = document.createElement('div');
        desc.className = 'badge__desc';
        desc.textContent = ach.description || '';
        info.appendChild(desc);
        badge.appendChild(info);

        achCard.appendChild(badge);
      });

    panel.appendChild(achCard);
  } else {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    const emptyTitle = document.createElement('div');
    emptyTitle.className = 'empty-state__title';
    emptyTitle.textContent = 'No achievements yet';
    empty.appendChild(emptyTitle);
    const emptyDesc = document.createElement('div');
    emptyDesc.className = 'empty-state__desc';
    emptyDesc.textContent = 'Keep showing up. Your first badge is around the corner.';
    empty.appendChild(emptyDesc);
    panel.appendChild(empty);
  }

  // ============================================================
  // SETTINGS SECTION
  // ============================================================
  const settingsLabel = document.createElement('h3');
  settingsLabel.className = 'section-label';
  settingsLabel.textContent = 'Settings';
  panel.appendChild(settingsLabel);

  // Editable list helper
  function createEditableList(title, items, onSave) {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.marginBottom = 'var(--sp-3)';

    const header = document.createElement('div');
    header.className = 'row row--between';
    header.style.marginBottom = 'var(--sp-3)';
    const titleEl = document.createElement('div');
    titleEl.style.cssText = 'font-weight: 600; font-size: 0.9375rem;';
    titleEl.textContent = title;
    header.appendChild(titleEl);

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'btn btn--ghost';
    editBtn.style.fontSize = '0.8125rem';
    editBtn.textContent = 'Edit';
    header.appendChild(editBtn);
    card.appendChild(header);

    // Display current values
    const display = document.createElement('div');
    display.className = 'text-muted';
    display.style.fontSize = '0.8125rem';
    display.textContent = items.join(', ');
    card.appendChild(display);

    // Edit form (hidden)
    const form = document.createElement('div');
    form.style.display = 'none';

    const listContainer = document.createElement('div');
    listContainer.className = 'stack stack--2';

    function renderInputs(vals) {
      listContainer.textContent = '';
      vals.forEach((val, i) => {
        const row = document.createElement('div');
        row.className = 'row';
        row.style.gap = '8px';
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'input';
        input.value = val;
        input.style.flex = '1';
        input.dataset.index = i;
        row.appendChild(input);
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'btn btn--ghost';
        removeBtn.style.cssText = 'color: var(--error); padding: 0 var(--sp-2);';
        removeBtn.textContent = '×';
        removeBtn.addEventListener('click', () => {
          vals.splice(i, 1);
          renderInputs(vals);
        });
        row.appendChild(removeBtn);
        listContainer.appendChild(row);
      });
    }

    let editValues = [...items];
    renderInputs(editValues);
    form.appendChild(listContainer);

    const actionsRow = document.createElement('div');
    actionsRow.className = 'row';
    actionsRow.style.cssText = 'gap: 8px; margin-top: var(--sp-3);';

    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'btn btn--secondary';
    addBtn.style.fontSize = '0.8125rem';
    addBtn.textContent = '+ Add';
    addBtn.addEventListener('click', () => {
      editValues.push('');
      renderInputs(editValues);
    });
    actionsRow.appendChild(addBtn);

    const saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.className = 'btn btn--primary';
    saveBtn.style.fontSize = '0.8125rem';
    saveBtn.textContent = 'Save';
    saveBtn.addEventListener('click', async () => {
      const inputs = listContainer.querySelectorAll('input');
      const newValues = Array.from(inputs).map(inp => inp.value.trim()).filter(Boolean);
      saveBtn.textContent = 'Saving...';
      saveBtn.disabled = true;
      await onSave(newValues);
      await refreshConfig();
      display.textContent = newValues.join(', ');
      form.style.display = 'none';
      display.style.display = '';
      editBtn.textContent = 'Edit';
      saveBtn.textContent = 'Save';
      saveBtn.disabled = false;
    });
    actionsRow.appendChild(saveBtn);

    form.appendChild(actionsRow);
    card.appendChild(form);

    editBtn.addEventListener('click', () => {
      const isEditing = form.style.display !== 'none';
      if (isEditing) {
        form.style.display = 'none';
        display.style.display = '';
        editBtn.textContent = 'Edit';
      } else {
        editValues = [...items];
        renderInputs(editValues);
        form.style.display = '';
        display.style.display = 'none';
        editBtn.textContent = 'Cancel';
      }
    });

    return card;
  }

  // Editable number fields helper
  function createNumberSettings(title, fields, onSave) {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.marginBottom = 'var(--sp-3)';

    const header = document.createElement('div');
    header.style.cssText = 'font-weight: 600; font-size: 0.9375rem; margin-bottom: var(--sp-3);';
    header.textContent = title;
    card.appendChild(header);

    const inputs = {};
    fields.forEach(f => {
      const row = document.createElement('div');
      row.className = 'row row--between';
      row.style.padding = 'var(--sp-2) 0';
      const label = document.createElement('span');
      label.className = 'text-muted';
      label.style.fontSize = '0.8125rem';
      label.textContent = f.label;
      row.appendChild(label);
      const input = document.createElement('input');
      input.type = 'number';
      input.className = 'input';
      input.style.cssText = 'width: 100px; text-align: right;';
      input.step = f.step || '1';
      input.value = f.value;
      inputs[f.key] = input;
      row.appendChild(input);
      card.appendChild(row);
    });

    const saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.className = 'btn btn--primary btn--full';
    saveBtn.style.marginTop = 'var(--sp-3)';
    saveBtn.textContent = 'Save';
    saveBtn.addEventListener('click', async () => {
      saveBtn.textContent = 'Saving...';
      saveBtn.disabled = true;
      const values = {};
      Object.entries(inputs).forEach(([key, inp]) => {
        values[key] = Number(inp.value) || 0;
      });
      await onSave(values);
      await refreshConfig();
      saveBtn.textContent = 'Saved!';
      setTimeout(() => { saveBtn.textContent = 'Save'; saveBtn.disabled = false; }, 1500);
    });
    card.appendChild(saveBtn);

    return card;
  }

  // Habits
  panel.appendChild(createEditableList('Habits', getHabits(), async (values) => {
    await updateProfile({ habits: values });
  }));

  // Attributes
  panel.appendChild(createEditableList('Character Attributes', getAttributes(), async (values) => {
    await updateProfile({ attributes: values });
  }));

  // Meal Types
  panel.appendChild(createEditableList('Meal Types', getMealTypes(), async (values) => {
    await updateProfile({ mealTypes: values });
  }));

  // Nutrition Targets
  const nt = getNutritionTargets();
  panel.appendChild(createNumberSettings('Nutrition Targets', [
    { key: 'dailyCalories', label: 'Daily Calories', value: nt.dailyCalories },
    { key: 'proteinG', label: 'Protein (g)', value: nt.proteinG },
    { key: 'carbsG', label: 'Carbs (g)', value: nt.carbsG },
    { key: 'fatG', label: 'Fat (g)', value: nt.fatG },
  ], async (values) => {
    await updateProfile({ nutritionTargets: values });
  }));

  // OpenRouter API Key
  const aiCard = document.createElement('div');
  aiCard.className = 'card';
  aiCard.style.marginBottom = 'var(--sp-3)';
  const aiHeader = document.createElement('div');
  aiHeader.style.cssText = 'font-weight: 600; font-size: 0.9375rem; margin-bottom: var(--sp-3);';
  aiHeader.textContent = 'AI Coach (OpenRouter)';
  aiCard.appendChild(aiHeader);
  const aiDesc = document.createElement('div');
  aiDesc.style.cssText = 'font-size: 0.75rem; color: var(--text-tertiary); margin-bottom: var(--sp-3);';
  aiDesc.textContent = 'Free AI coaching. Get your key at openrouter.ai/keys';
  aiCard.appendChild(aiDesc);
  const rawProfile = getRawProfile();
  const aiInput = document.createElement('input');
  aiInput.type = 'password';
  aiInput.className = 'input';
  aiInput.placeholder = 'sk-or-...';
  aiInput.value = rawProfile.openrouterApiKey || '';
  aiCard.appendChild(aiInput);
  const aiSaveBtn = document.createElement('button');
  aiSaveBtn.type = 'button';
  aiSaveBtn.className = 'btn btn--primary btn--full';
  aiSaveBtn.style.marginTop = 'var(--sp-3)';
  aiSaveBtn.textContent = 'Save API Key';
  aiSaveBtn.addEventListener('click', async () => {
    await updateProfile({ openrouterApiKey: aiInput.value.trim() });
    aiSaveBtn.textContent = 'Saved!';
    setTimeout(() => { aiSaveBtn.textContent = 'Save API Key'; }, 1500);
  });
  aiCard.appendChild(aiSaveBtn);
  panel.appendChild(aiCard);

  // Body Targets
  const bt = getBodyTargets();
  panel.appendChild(createNumberSettings('Body Targets', [
    { key: 'startWeight', label: 'Start Weight (lbs)', value: bt.startWeight, step: '0.1' },
    { key: 'targetWeight', label: 'Target Weight (lbs)', value: bt.targetWeight, step: '0.1' },
    { key: 'startBF', label: 'Start Body Fat %', value: bt.startBF, step: '0.1' },
    { key: 'targetBF', label: 'Target Body Fat %', value: bt.targetBF, step: '0.1' },
  ], async (values) => {
    await updateProfile({ bodyTargets: values });
  }));

  // Bottom spacer
  const spacer = document.createElement('div');
  spacer.style.height = 'var(--sp-8)';
  panel.appendChild(spacer);
}
