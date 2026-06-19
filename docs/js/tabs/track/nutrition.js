/**
 * track/nutrition.js — Nutrition tracker sub-tab
 * Tracks daily calories and macros with add-food form.
 */

import { addFoodEntry, getTodayNutrition } from '../../firebase.js';
import { createProgressBar } from '../../components/progress-bar.js';
import { getMealTypes, getNutritionTargets } from '../../user-config.js';

export async function renderNutritionSubTab(container) {
  container.textContent = '';

  const entries = await getTodayNutrition();

  let totalCal = 0, totalP = 0, totalC = 0, totalF = 0;
  entries.forEach(e => {
    totalCal += e.calories || 0;
    totalP += e.protein || 0;
    totalC += e.carbs || 0;
    totalF += e.fat || 0;
  });

  const targets = getNutritionTargets();
  const remaining = targets.dailyCalories - totalCal;

  // ----- Card 1: Daily Summary -----
  const summaryLabel = document.createElement('h3');
  summaryLabel.className = 'section-label';
  summaryLabel.textContent = 'Daily Summary';
  container.appendChild(summaryLabel);

  const summaryCard = document.createElement('div');
  summaryCard.className = 'card';

  // Calories: 2-column (eaten + bar | remaining)
  const calGrid = document.createElement('div');
  calGrid.style.cssText = 'display: grid; grid-template-columns: 1fr auto; gap: var(--sp-4); align-items: start;';

  const calLeftCol = document.createElement('div');
  const calEaten = document.createElement('div');
  calEaten.className = 'data-value';
  calEaten.style.fontSize = '1.5rem';
  calEaten.textContent = totalCal.toLocaleString();
  calLeftCol.appendChild(calEaten);

  const calLabel = document.createElement('div');
  calLabel.className = 'text-muted';
  calLabel.style.cssText = 'font-size: 0.75rem; margin-bottom: var(--sp-2);';
  calLabel.textContent = `calories eaten / ${targets.dailyCalories.toLocaleString()}`;
  calLeftCol.appendChild(calLabel);

  const calPct = Math.min(100, (totalCal / targets.dailyCalories) * 100);
  calLeftCol.insertAdjacentHTML('beforeend', createProgressBar(calPct, { thick: true }));
  calLeftCol.querySelector('.progress-bar__fill').style.background =
    remaining >= 0 ? 'var(--accent)' : 'var(--error)';
  calGrid.appendChild(calLeftCol);

  const calRightCol = document.createElement('div');
  calRightCol.style.textAlign = 'right';
  const remVal = document.createElement('div');
  remVal.className = 'data-value';
  remVal.style.cssText = `font-size: 1.5rem; color: ${remaining >= 0 ? 'var(--success)' : 'var(--error)'};`;
  remVal.textContent = remaining.toLocaleString();
  calRightCol.appendChild(remVal);
  const remLabel = document.createElement('div');
  remLabel.className = 'text-muted';
  remLabel.style.fontSize = '0.75rem';
  remLabel.textContent = 'remaining';
  calRightCol.appendChild(remLabel);
  calGrid.appendChild(calRightCol);

  summaryCard.appendChild(calGrid);

  // Macros: 3-column vertical grid
  const macros = [
    { name: 'Protein', current: totalP, target: targets.proteinG },
    { name: 'Carbs', current: totalC, target: targets.carbsG },
    { name: 'Fat', current: totalF, target: targets.fatG },
  ];

  const macroGrid = document.createElement('div');
  macroGrid.style.cssText = 'display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--sp-4); margin-top: var(--sp-5);';

  macros.forEach(m => {
    const col = document.createElement('div');

    const name = document.createElement('div');
    name.className = 'text-muted';
    name.style.cssText = 'font-size: 0.75rem; margin-bottom: 2px;';
    name.textContent = m.name;
    col.appendChild(name);

    const val = document.createElement('div');
    val.className = 'data-value';
    val.style.cssText = 'font-size: 0.875rem; margin-bottom: var(--sp-2);';
    val.textContent = `${m.current}/${m.target}g`;
    col.appendChild(val);

    col.insertAdjacentHTML('beforeend',
      createProgressBar(Math.min(100, (m.current / m.target) * 100), { thick: true }));

    macroGrid.appendChild(col);
  });

  summaryCard.appendChild(macroGrid);
  container.appendChild(summaryCard);

  // ----- Card 2: Add Food -----
  const formLabel = document.createElement('h3');
  formLabel.className = 'section-label';
  formLabel.textContent = 'Add Food';
  container.appendChild(formLabel);

  const formCard = document.createElement('div');
  formCard.className = 'card stack stack--3';

  // Meal type selector
  const mealRow = document.createElement('div');
  mealRow.style.cssText = 'display: flex; flex-wrap: wrap; gap: 6px;';
  const mealTypes = getMealTypes();
  let selectedMeal = mealTypes[0];
  mealTypes.forEach(meal => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pill-tab';
    if (meal === selectedMeal) btn.classList.add('pill-tab--active');
    btn.textContent = meal;
    btn.addEventListener('click', () => {
      mealRow.querySelectorAll('.pill-tab').forEach(b => b.classList.remove('pill-tab--active'));
      btn.classList.add('pill-tab--active');
      selectedMeal = meal;
    });
    mealRow.appendChild(btn);
  });
  formCard.appendChild(mealRow);

  // Food name
  const foodInput = document.createElement('input');
  foodInput.type = 'text';
  foodInput.className = 'input';
  foodInput.placeholder = 'Food name';
  formCard.appendChild(foodInput);

  // Macro inputs
  const macroInputs = document.createElement('div');
  macroInputs.style.cssText = 'display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;';
  const calInput = createNumInput('Cal');
  const pInput = createNumInput('Protein');
  const cInput = createNumInput('Carbs');
  const fInput = createNumInput('Fat');
  macroInputs.appendChild(calInput.wrapper);
  macroInputs.appendChild(pInput.wrapper);
  macroInputs.appendChild(cInput.wrapper);
  macroInputs.appendChild(fInput.wrapper);
  formCard.appendChild(macroInputs);

  // Submit
  const submitBtn = document.createElement('button');
  submitBtn.type = 'button';
  submitBtn.className = 'btn btn--primary btn--full';
  submitBtn.textContent = 'Add Food';
  submitBtn.addEventListener('click', async () => {
    const cal = Number(calInput.input.value) || 0;
    if (cal <= 0) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Adding...';

    await addFoodEntry({
      mealType: selectedMeal,
      foodName: foodInput.value.trim(),
      calories: cal,
      protein: Number(pInput.input.value) || 0,
      carbs: Number(cInput.input.value) || 0,
      fat: Number(fInput.input.value) || 0
    });

    await renderNutritionSubTab(container);
  });
  formCard.appendChild(submitBtn);
  container.appendChild(formCard);

  // ----- Card 3: Today's Entries -----
  if (entries.length > 0) {
    const entriesLabel = document.createElement('h3');
    entriesLabel.className = 'section-label';
    entriesLabel.textContent = `Today (${entries.length} ${entries.length === 1 ? 'entry' : 'entries'})`;
    container.appendChild(entriesLabel);

    const entriesCard = document.createElement('div');
    entriesCard.className = 'card stack stack--2';

    entries.forEach(e => {
      const row = document.createElement('div');
      row.className = 'row row--between';
      row.style.cssText = 'padding: var(--sp-2) 0; border-bottom: 1px solid var(--bg-subtle);';

      const info = document.createElement('div');
      const name = document.createElement('div');
      name.style.cssText = 'font-weight: 500; font-size: 0.875rem;';
      name.textContent = e.foodName || e.mealType;
      info.appendChild(name);
      const meta = document.createElement('div');
      meta.style.cssText = 'font-size: 0.75rem; color: var(--text-tertiary);';
      meta.textContent = `${e.mealType} · ${e.protein || 0}P / ${e.carbs || 0}C / ${e.fat || 0}F`;
      info.appendChild(meta);
      row.appendChild(info);

      const calEl = document.createElement('div');
      calEl.className = 'data-value';
      calEl.style.fontSize = '0.875rem';
      calEl.textContent = `${e.calories || 0}`;
      row.appendChild(calEl);

      entriesCard.appendChild(row);
    });

    container.appendChild(entriesCard);
  }

  // Spacer
  const spacer = document.createElement('div');
  spacer.style.height = 'var(--sp-8)';
  container.appendChild(spacer);
}

function createNumInput(placeholder) {
  const wrapper = document.createElement('div');
  const label = document.createElement('div');
  label.style.cssText = 'font-size: 0.625rem; color: var(--text-tertiary); margin-bottom: 2px; text-transform: uppercase; letter-spacing: 0.05em;';
  label.textContent = placeholder;
  wrapper.appendChild(label);
  const input = document.createElement('input');
  input.type = 'number';
  input.className = 'input';
  input.style.cssText = 'text-align: center; padding: var(--sp-2);';
  input.placeholder = '0';
  wrapper.appendChild(input);
  return { wrapper, input };
}
