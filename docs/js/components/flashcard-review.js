/**
 * flashcard-review.js — Full-screen flashcard review session
 *
 * Shows question → user thinks → tap to reveal → rate difficulty
 * Supports keyboard shortcuts: Space (reveal), 1-4 (rate)
 */

import { sm2 } from '../spaced-repetition.js';

/**
 * Open a flashcard review session.
 * @param {array} cards - Cards to review (from getDueCards or getNewCards)
 * @param {object} cardStates - Current states map
 * @param {function} onCardReviewed - Called with (cardId, newState) after each rating
 * @param {function} onComplete - Called when all cards reviewed, with stats
 */
export function openFlashcardReview(cards, cardStates, onCardReviewed, onComplete) {
  if (!cards.length) return;

  let currentIdx = 0;
  let revealed = false;
  let stats = { total: cards.length, again: 0, hard: 0, good: 0, easy: 0 };

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'reader-mode';
  overlay.style.display = 'flex';
  overlay.style.flexDirection = 'column';

  // Header
  const header = document.createElement('div');
  header.className = 'reader-header';

  const backBtn = document.createElement('button');
  backBtn.type = 'button';
  backBtn.className = 'reader-header__back';
  backBtn.textContent = '← End Review';
  backBtn.addEventListener('click', () => finish());
  header.appendChild(backBtn);

  const counter = document.createElement('div');
  counter.className = 'reader-header__progress';
  header.appendChild(counter);

  overlay.appendChild(header);

  // Card area
  const cardArea = document.createElement('div');
  cardArea.style.cssText = 'flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; max-width: 640px; margin: 0 auto; width: 100%;';
  overlay.appendChild(cardArea);

  // Rating bar (hidden until revealed)
  const ratingBar = document.createElement('div');
  ratingBar.style.cssText = 'padding: 1rem 1.5rem 2rem; max-width: 640px; margin: 0 auto; width: 100%; display: none;';
  overlay.appendChild(ratingBar);

  function renderCard() {
    const card = cards[currentIdx];
    revealed = false;
    counter.textContent = `${currentIdx + 1} / ${cards.length}`;

    cardArea.textContent = '';
    ratingBar.style.display = 'none';

    // Skill label
    const skillLabel = document.createElement('div');
    skillLabel.style.cssText = 'font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-tertiary); margin-bottom: 1.5rem;';
    skillLabel.textContent = card.skillId.replace(/-/g, ' ');
    cardArea.appendChild(skillLabel);

    // Question
    const questionEl = document.createElement('div');
    questionEl.style.cssText = 'font-size: 1.25rem; line-height: 1.6; color: var(--text-primary); text-align: center; max-width: 500px; margin-bottom: 2rem;';
    questionEl.appendChild(safeRender(card.question));
    cardArea.appendChild(questionEl);

    // Reveal button / Answer
    const revealBtn = document.createElement('button');
    revealBtn.type = 'button';
    revealBtn.className = 'btn btn--secondary btn--full';
    revealBtn.style.maxWidth = '300px';
    revealBtn.textContent = 'Show Answer';
    revealBtn.addEventListener('click', () => revealAnswer());
    cardArea.appendChild(revealBtn);

    // Answer (hidden)
    const answerEl = document.createElement('div');
    answerEl.id = 'flashcard-answer';
    answerEl.style.cssText = 'display: none; font-size: 1rem; line-height: 1.7; color: var(--text-secondary); text-align: left; max-width: 500px; padding: 1.5rem; background: var(--bg-surface); border: 1px solid var(--bg-subtle); border-radius: var(--radius-lg); margin-top: 1rem; width: 100%;';
    answerEl.appendChild(safeRender(card.answer));
    cardArea.appendChild(answerEl);
  }

  function revealAnswer() {
    revealed = true;
    const answerEl = document.getElementById('flashcard-answer');
    if (answerEl) answerEl.style.display = 'block';

    // Hide reveal button
    const btns = cardArea.querySelectorAll('.btn');
    btns.forEach(b => b.style.display = 'none');

    // Show rating bar
    ratingBar.style.display = 'block';
    ratingBar.textContent = '';

    const label = document.createElement('div');
    label.style.cssText = 'text-align: center; font-size: 0.75rem; color: var(--text-tertiary); margin-bottom: 0.75rem;';
    label.textContent = 'How well did you recall this?';
    ratingBar.appendChild(label);

    const btnRow = document.createElement('div');
    btnRow.style.cssText = 'display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem;';

    const ratings = [
      { value: 0, label: 'Again', sublabel: '1m', color: 'var(--error)' },
      { value: 1, label: 'Hard', sublabel: getIntervalLabel(1), color: 'var(--warning)' },
      { value: 2, label: 'Good', sublabel: getIntervalLabel(2), color: 'var(--success)' },
      { value: 3, label: 'Easy', sublabel: getIntervalLabel(3), color: 'var(--domain-thinking)' },
    ];

    ratings.forEach(r => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.style.cssText = `display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 0.75rem 0.5rem; border-radius: var(--radius-md); background: var(--bg-surface); border: 1px solid var(--bg-subtle); cursor: pointer; min-height: 56px; transition: all 200ms;`;

      const labelEl = document.createElement('span');
      labelEl.style.cssText = `font-size: 0.8125rem; font-weight: 600; color: ${r.color};`;
      labelEl.textContent = r.label;
      btn.appendChild(labelEl);

      const subEl = document.createElement('span');
      subEl.style.cssText = 'font-size: 0.625rem; color: var(--text-tertiary);';
      subEl.textContent = r.sublabel;
      btn.appendChild(subEl);

      btn.addEventListener('click', () => rateCard(r.value));
      btnRow.appendChild(btn);
    });

    ratingBar.appendChild(btnRow);

    // Keyboard hint
    const hint = document.createElement('div');
    hint.style.cssText = 'text-align: center; font-size: 0.625rem; color: var(--text-tertiary); margin-top: 0.5rem;';
    hint.textContent = 'Keyboard: 1 Again · 2 Hard · 3 Good · 4 Easy';
    ratingBar.appendChild(hint);
  }

  function getIntervalLabel(rating) {
    const card = cards[currentIdx];
    const state = cardStates[card.id] || { easeFactor: 2.5, interval: 0, repetitions: 0 };
    const next = sm2(state, rating);
    if (next.interval === 1) return '1d';
    if (next.interval < 30) return `${next.interval}d`;
    return `${Math.round(next.interval / 30)}mo`;
  }

  function rateCard(rating) {
    const card = cards[currentIdx];
    const currentState = cardStates[card.id] || { easeFactor: 2.5, interval: 0, repetitions: 0 };
    const newState = sm2(currentState, rating);

    // Track stats
    ['again', 'hard', 'good', 'easy'][rating] && stats[['again', 'hard', 'good', 'easy'][rating]]++;

    // Callback to persist
    onCardReviewed(card.id, newState);

    // Update local state
    cardStates[card.id] = newState;

    // Next card or finish
    currentIdx++;
    if (currentIdx < cards.length) {
      renderCard();
    } else {
      finish();
    }
  }

  function finish() {
    overlay.classList.add('reader-mode--closing');
    setTimeout(() => {
      overlay.remove();
      document.removeEventListener('keydown', keyHandler);
      if (onComplete) onComplete(stats);
    }, 200);
  }

  // Keyboard handler
  function keyHandler(e) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (!revealed) revealAnswer();
    } else if (revealed && e.key >= '1' && e.key <= '4') {
      rateCard(parseInt(e.key) - 1);
    } else if (e.key === 'Escape') {
      finish();
    }
  }
  document.addEventListener('keydown', keyHandler);

  // Render first card and mount
  renderCard();
  document.body.appendChild(overlay);
}

/**
 * Render text with basic inline markdown (bold).
 * Returns a DocumentFragment.
 */
function safeRender(text) {
  const frag = document.createDocumentFragment();
  if (!text) return frag;

  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  parts.forEach(part => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const strong = document.createElement('strong');
      strong.style.color = 'var(--text-primary)';
      strong.textContent = part.slice(2, -2);
      frag.appendChild(strong);
    } else {
      frag.appendChild(document.createTextNode(part));
    }
  });

  return frag;
}
