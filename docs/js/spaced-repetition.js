/**
 * spaced-repetition.js — SM-2 Algorithm Implementation
 *
 * The SM-2 algorithm (SuperMemo 2) calculates optimal review intervals
 * based on how well the user recalls each card.
 *
 * Card state stored in Firebase:
 *   users/{uid}/flashcardState/{cardId}
 *     - easeFactor: float (starts at 2.5, min 1.3)
 *     - interval: int (days until next review)
 *     - repetitions: int (consecutive correct recalls)
 *     - nextReview: ISO date string
 *     - lastReview: ISO date string
 *
 * Rating scale:
 *   0 = Again (complete blackout)
 *   1 = Hard (significant difficulty)
 *   2 = Good (correct with some effort)
 *   3 = Easy (effortless recall)
 */

/**
 * Calculate the next review state for a card based on user rating.
 * @param {object} cardState - Current state { easeFactor, interval, repetitions }
 * @param {number} rating - User rating: 0 (Again), 1 (Hard), 2 (Good), 3 (Easy)
 * @returns {object} New state { easeFactor, interval, repetitions, nextReview }
 */
export function sm2(cardState, rating) {
  let { easeFactor = 2.5, interval = 0, repetitions = 0 } = cardState || {};

  // Map our 0-3 scale to SM-2's 0-5 scale
  // 0 (Again) → 0, 1 (Hard) → 3, 2 (Good) → 4, 3 (Easy) → 5
  const q = [0, 3, 4, 5][rating] || 0;

  if (q < 3) {
    // Failed — reset repetitions, short interval
    repetitions = 0;
    interval = 1;
  } else {
    // Passed — calculate next interval
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions++;
  }

  // Update ease factor
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  easeFactor = Math.max(1.3, easeFactor);

  // Hard penalty — reduce interval by 20%
  if (rating === 1 && interval > 1) {
    interval = Math.max(1, Math.round(interval * 0.8));
  }

  // Easy bonus — increase interval by 30%
  if (rating === 3) {
    interval = Math.round(interval * 1.3);
  }

  // Calculate next review date
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  return {
    easeFactor: Math.round(easeFactor * 100) / 100,
    interval,
    repetitions,
    nextReview: nextReview.toISOString().split('T')[0],
    lastReview: new Date().toISOString().split('T')[0]
  };
}

/**
 * Get cards due for review today from a set of card states.
 * @param {object} cardStates - Map of cardId → state
 * @param {array} allCards - Array of all card definitions
 * @returns {array} Cards due today, sorted by overdue-ness
 */
export function getDueCards(cardStates, allCards) {
  const today = new Date().toISOString().split('T')[0];

  return allCards
    .filter(card => {
      const state = cardStates[card.id];
      if (!state) return false; // Not yet studied — don't include
      return state.nextReview <= today;
    })
    .sort((a, b) => {
      // Most overdue first
      const stateA = cardStates[a.id];
      const stateB = cardStates[b.id];
      return (stateA.nextReview || '').localeCompare(stateB.nextReview || '');
    });
}

/**
 * Get new cards for a skill that haven't been studied yet.
 * @param {string} skillId - The skill to get new cards for
 * @param {object} cardStates - Map of cardId → state
 * @param {array} allCards - Array of all card definitions
 * @param {number} limit - Max new cards to return
 * @returns {array} New cards for the skill
 */
export function getNewCards(skillId, cardStates, allCards, limit = 5) {
  return allCards
    .filter(card => card.skillId === skillId && !cardStates[card.id])
    .slice(0, limit);
}

/**
 * Initialize card states for a skill (when user first studies it).
 * Schedules first review for today (immediate first review).
 * @param {string} skillId
 * @param {array} allCards
 * @returns {object} Map of cardId → initial state
 */
export function initializeSkillCards(skillId, allCards) {
  const today = new Date().toISOString().split('T')[0];
  const states = {};

  allCards
    .filter(c => c.skillId === skillId)
    .forEach(card => {
      states[card.id] = {
        easeFactor: 2.5,
        interval: 0,
        repetitions: 0,
        nextReview: today,
        lastReview: null
      };
    });

  return states;
}

/**
 * Calculate review statistics.
 * @param {object} cardStates - Map of cardId → state
 * @returns {object} Stats { total, due, learned, mature }
 */
export function getReviewStats(cardStates) {
  const today = new Date().toISOString().split('T')[0];
  const states = Object.values(cardStates);

  return {
    total: states.length,
    due: states.filter(s => s.nextReview <= today).length,
    learned: states.filter(s => s.repetitions >= 1).length,
    mature: states.filter(s => s.interval >= 21).length // 21+ days = mature
  };
}
