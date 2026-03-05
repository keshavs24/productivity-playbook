/**
 * nutrition.js — Calorie tracker: food entry, macros, daily summary
 */

import { CUT, NUT, SHEET_NAMES } from '../../config.js';
import { readRange, appendRow } from '../api.js';
import { cacheData, getCachedData, isOnline } from '../store.js';

/**
 * Render the Nutrition tab
 */
export async function renderNutrition(firstLoad = false) {
  const panel = document.getElementById('tab-nutrition');
  if (!panel) return;

  // Fetch today's nutrition data
  let entries = [];
  let totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };

  try {
    const cached = await getCachedData('nutrition-today');
    if (cached) {
      entries = cached.entries;
      totals = cached.totals;
    }

    if (isOnline()) {
      const raw = await readRange(SHEET_NAMES.NUTRITION, 'A2:H1000');
      const today = new Date();
      entries = [];
      totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };

      for (const row of raw) {
        const d = parseDate(row[0]);
        if (d && isSameDay(d, today)) {
          const entry = {
            meal: row[NUT.MEAL_LABEL - 1] || '',
            food: row[NUT.FOOD_NAME - 1] || '',
            calories: Number(row[NUT.CALORIES - 1]) || 0,
            protein: Number(row[NUT.PROTEIN - 1]) || 0,
            carbs: Number(row[NUT.CARBS - 1]) || 0,
            fat: Number(row[NUT.FAT - 1]) || 0
          };
          entries.push(entry);
          totals.calories += entry.calories;
          totals.protein += entry.protein;
          totals.carbs += entry.carbs;
          totals.fat += entry.fat;
        }
      }

      await cacheData('nutrition-today', { entries, totals });
    }
  } catch (e) {
    console.error('Nutrition fetch error:', e);
  }

  const remaining = CUT.DAILY_CALORIES - totals.calories;
  const calPct = Math.min(totals.calories / CUT.DAILY_CALORIES, 1);
  const protPct = Math.min(totals.protein / CUT.PROTEIN_G, 1);

  panel.innerHTML = `
    <div class="card" style="text-align:center;">
      <h2 style="margin-bottom:0.5rem;">Nutrition</h2>
      <p class="text-secondary">${formatDate(new Date())}</p>
    </div>

    <div class="card">
      <h3>Daily Summary</h3>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:1rem;">
        <div style="text-align:center;">
          <div class="macro-value" style="font-size:1.8rem;font-weight:700;font-family:'Space Mono',monospace;color:${remaining >= 0 ? 'var(--success)' : 'var(--error)'}">
            ${totals.calories}
          </div>
          <div class="text-secondary" style="font-size:0.75rem;">of ${CUT.DAILY_CALORIES} cal</div>
          <div class="progress-bar" style="margin-top:0.5rem;">
            <div class="progress-bar__fill" style="width:${calPct * 100}%;background:${remaining >= 0 ? 'var(--accent-gold)' : 'var(--error)'}"></div>
          </div>
        </div>
        <div style="text-align:center;">
          <div class="macro-value" style="font-size:1.8rem;font-weight:700;font-family:'Space Mono',monospace;color:var(--accent-gold)">
            ${remaining}
          </div>
          <div class="text-secondary" style="font-size:0.75rem;">cal remaining</div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:0.75rem;margin-top:1.25rem;">
        <div style="text-align:center;">
          <div style="font-weight:700;font-family:'Space Mono',monospace;">${totals.protein}g</div>
          <div class="text-secondary" style="font-size:0.7rem;">Protein</div>
          <div class="progress-bar" style="margin-top:0.25rem;">
            <div class="progress-bar__fill" style="width:${protPct * 100}%;background:var(--success)"></div>
          </div>
          <div class="text-secondary" style="font-size:0.65rem;">/ ${CUT.PROTEIN_G}g</div>
        </div>
        <div style="text-align:center;">
          <div style="font-weight:700;font-family:'Space Mono',monospace;">${totals.carbs}g</div>
          <div class="text-secondary" style="font-size:0.7rem;">Carbs</div>
          <div class="progress-bar" style="margin-top:0.25rem;">
            <div class="progress-bar__fill" style="width:${Math.min(totals.carbs / CUT.CARBS_G, 1) * 100}%;background:var(--accent-gold)"></div>
          </div>
          <div class="text-secondary" style="font-size:0.65rem;">/ ${CUT.CARBS_G}g</div>
        </div>
        <div style="text-align:center;">
          <div style="font-weight:700;font-family:'Space Mono',monospace;">${totals.fat}g</div>
          <div class="text-secondary" style="font-size:0.7rem;">Fat</div>
          <div class="progress-bar" style="margin-top:0.25rem;">
            <div class="progress-bar__fill" style="width:${Math.min(totals.fat / CUT.FAT_G, 1) * 100}%;background:#F59E0B"></div>
          </div>
          <div class="text-secondary" style="font-size:0.65rem;">/ ${CUT.FAT_G}g</div>
        </div>
      </div>
    </div>

    <div class="card">
      <h3>Add Food</h3>
      <form id="food-form" style="display:flex;flex-direction:column;gap:0.75rem;margin-top:0.75rem;">
        <select id="food-meal" class="input">
          <option value="Suhoor">Suhoor</option>
          <option value="Main Meal" selected>Main Meal</option>
          <option value="Snack">Snack</option>
          <option value="Shake">Shake</option>
        </select>
        <input type="text" id="food-name" class="input" placeholder="Food name" required>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;">
          <input type="number" id="food-cal" class="input" placeholder="Calories" required>
          <input type="number" id="food-protein" class="input" placeholder="Protein (g)">
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;">
          <input type="number" id="food-carbs" class="input" placeholder="Carbs (g)">
          <input type="number" id="food-fat" class="input" placeholder="Fat (g)">
        </div>
        <button type="submit" class="btn btn--primary btn--block">Add Entry</button>
      </form>
    </div>

    <div class="card">
      <h3>Today's Entries</h3>
      <div id="food-entries" style="margin-top:0.75rem;">
        ${entries.length === 0
          ? '<p class="text-secondary" style="text-align:center;">No entries yet</p>'
          : entries.map(e => `
            <div style="display:flex;justify-content:space-between;align-items:center;padding:0.5rem 0;border-bottom:1px solid var(--bg-elevated);">
              <div>
                <div style="font-weight:500;">${e.food}</div>
                <div class="text-secondary" style="font-size:0.75rem;">${e.meal}</div>
              </div>
              <div style="text-align:right;">
                <div style="font-family:'Space Mono',monospace;font-weight:700;">${e.calories}</div>
                <div class="text-secondary" style="font-size:0.65rem;">${e.protein}P / ${e.carbs}C / ${e.fat}F</div>
              </div>
            </div>
          `).join('')
        }
      </div>
    </div>
  `;

  // Form handler
  const form = document.getElementById('food-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const meal = document.getElementById('food-meal').value;
      const name = document.getElementById('food-name').value;
      const cal = Number(document.getElementById('food-cal').value) || 0;
      const protein = Number(document.getElementById('food-protein').value) || 0;
      const carbs = Number(document.getElementById('food-carbs').value) || 0;
      const fat = Number(document.getElementById('food-fat').value) || 0;

      if (!name || !cal) return;

      const todayStr = formatDateISO(new Date());
      const timestamp = new Date().toISOString();

      try {
        await appendRow(SHEET_NAMES.NUTRITION, [todayStr, meal, name, cal, protein, carbs, fat, timestamp]);
      } catch (err) {
        console.error('Failed to log food:', err);
      }

      // Re-render
      await renderNutrition(false);
    });
  }
}

function parseDate(val) {
  if (val instanceof Date) return val;
  if (typeof val === 'string' && val && val !== 'TARGETS') {
    const d = new Date(val);
    if (!isNaN(d.getTime())) return d;
  }
  return null;
}

function isSameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}

function formatDate(d) {
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
}

function formatDateISO(d) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
