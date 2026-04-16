/**
 * learn.js — Skill tree tab with full-screen reader mode
 * Views: domain overview → skill list → full-screen study reader
 */

import { getSkillProgress, updateSkill, getFlashcardStates, updateFlashcardState } from '../firebase.js';
import { createProgressBar } from '../components/progress-bar.js';
import { getDueCards, getNewCards, initializeSkillCards, getReviewStats } from '../spaced-repetition.js';
import { openFlashcardReview } from '../components/flashcard-review.js';

let skillsData = null;
let flashcardsData = null;
let challengesData = null;
let synthesisData = null;
let casesData = null;
let masteryQData = null;
let flashcardStates = {};
let userProgress = {};
let currentView = 'domains';
let currentDomain = null;
let currentSkill = null;

const MASTERY_RANKS = [
  { min: 0,  label: 'Talib',   desc: 'Student' },
  { min: 10, label: 'Daris',   desc: 'Learner' },
  { min: 25, label: 'Fahim',   desc: 'Understander' },
  { min: 45, label: 'Hakim',   desc: 'Wise' },
  { min: 65, label: 'Ustadh',  desc: 'Master' },
];

const ICONS = { thinking: '🧠', drive: '🔥', influence: '💬', leadership: '👑' };

export async function renderLearn(isFirstLoad) {
  const panel = document.getElementById('tab-learn');
  if (!panel) return;

  if (!skillsData) {
    try {
      const resp = await fetch('data/skills.json');
      skillsData = await resp.json();
    } catch (e) {
      panel.textContent = '';
      const err = document.createElement('div');
      err.className = 'empty-state';
      const t = document.createElement('div');
      t.className = 'empty-state__title';
      t.textContent = 'Failed to load curriculum';
      err.appendChild(t);
      panel.appendChild(err);
      return;
    }
  }

  // Load all curriculum data files (cached after first load)
  if (!flashcardsData) {
    const loads = await Promise.allSettled([
      fetch('data/flashcards.json').then(r => r.json()),
      fetch('data/challenges.json').then(r => r.json()),
      fetch('data/synthesis-prompts.json').then(r => r.json()),
      fetch('data/cases.json').then(r => r.json()),
      fetch('data/mastery-questions.json').then(r => r.json()),
    ]);
    flashcardsData = loads[0].status === 'fulfilled' ? loads[0].value : [];
    challengesData = loads[1].status === 'fulfilled' ? loads[1].value : [];
    synthesisData = loads[2].status === 'fulfilled' ? loads[2].value : [];
    casesData = loads[3].status === 'fulfilled' ? loads[3].value : [];
    masteryQData = loads[4].status === 'fulfilled' ? loads[4].value : [];
  }

  try {
    userProgress = await getSkillProgress();
    flashcardStates = await getFlashcardStates();
  } catch (e) { /* offline ok */ }

  renderCurrentView(panel);
}

function renderCurrentView(panel) {
  panel.textContent = '';
  if (currentView === 'domains') renderDomainsView(panel);
  else if (currentView === 'skills') renderSkillsView(panel, currentDomain);
  const spacer = document.createElement('div');
  spacer.style.height = 'var(--sp-8)';
  panel.appendChild(spacer);
}

// ============================================================
// DOMAINS VIEW
// ============================================================

function renderDomainsView(panel) {
  const header = document.createElement('div');
  header.style.padding = 'var(--sp-4) 0 var(--sp-2)';
  const h1 = document.createElement('h2');
  h1.textContent = 'Master Psychology';
  header.appendChild(h1);
  const sub = document.createElement('p');
  sub.className = 'text-muted';
  sub.style.cssText = 'font-size: 0.875rem; margin-top: var(--sp-1);';
  sub.textContent = '70 applied skills from your curriculum';
  header.appendChild(sub);
  panel.appendChild(header);

  // Mastery rank
  const totalMastered = Object.values(userProgress).filter(p => p.status === 'mastered').length;
  const rank = MASTERY_RANKS.slice().reverse().find(r => totalMastered >= r.min) || MASTERY_RANKS[0];

  const rankLabel = document.createElement('h3');
  rankLabel.className = 'section-label';
  rankLabel.textContent = 'Mastery Rank';
  panel.appendChild(rankLabel);

  const rankCard = document.createElement('div');
  rankCard.className = 'card';
  const rankRow = document.createElement('div');
  rankRow.className = 'row row--between';
  const rankTitle = document.createElement('div');
  rankTitle.className = 'data-value';
  rankTitle.style.fontSize = '1.25rem';
  rankTitle.textContent = rank.label;
  rankRow.appendChild(rankTitle);
  const rankMeta = document.createElement('div');
  rankMeta.className = 'text-muted';
  rankMeta.style.fontSize = '0.8125rem';
  rankMeta.textContent = `${totalMastered} of 70 mastered`;
  rankRow.appendChild(rankMeta);
  rankCard.appendChild(rankRow);
  rankCard.insertAdjacentHTML('beforeend',
    '<div style="margin-top: var(--sp-3);">' + createProgressBar((totalMastered / 70) * 100) + '</div>');
  panel.appendChild(rankCard);

  // Daily review card
  if (flashcardsData && flashcardsData.length > 0) {
    const dueCards = getDueCards(flashcardStates, flashcardsData);
    if (dueCards.length > 0) {
      const reviewLabel = document.createElement('h3');
      reviewLabel.className = 'section-label';
      reviewLabel.textContent = 'Daily Review';
      panel.appendChild(reviewLabel);

      const reviewCard = document.createElement('div');
      reviewCard.className = 'card card--interactive';
      reviewCard.style.cssText = 'border-color: var(--accent-border); cursor: pointer;';

      const reviewRow = document.createElement('div');
      reviewRow.className = 'row row--between';
      const reviewTitle = document.createElement('div');
      reviewTitle.style.cssText = 'font-weight: 600; font-size: 1rem;';
      reviewTitle.textContent = `${dueCards.length} cards due`;
      reviewRow.appendChild(reviewTitle);
      const reviewAction = document.createElement('div');
      reviewAction.style.cssText = 'color: var(--accent); font-weight: 500; font-size: 0.875rem;';
      reviewAction.textContent = 'Start Review →';
      reviewRow.appendChild(reviewAction);
      reviewCard.appendChild(reviewRow);

      const reviewDesc = document.createElement('div');
      reviewDesc.style.cssText = 'font-size: 0.8125rem; color: var(--text-tertiary); margin-top: var(--sp-2);';
      const stats = getReviewStats(flashcardStates);
      reviewDesc.textContent = `${stats.learned} cards learned · ${stats.mature} mature`;
      reviewCard.appendChild(reviewDesc);

      reviewCard.addEventListener('click', () => {
        openFlashcardReview(
          dueCards.slice(0, 20), // Cap at 20 per session
          flashcardStates,
          async (cardId, newState) => {
            flashcardStates[cardId] = newState;
            await updateFlashcardState(cardId, newState);
          },
          (stats) => {
            renderCurrentView(document.getElementById('tab-learn'));
          }
        );
      });

      panel.appendChild(reviewCard);
    }
  }

  // Domain grid
  const domainLabel = document.createElement('h3');
  domainLabel.className = 'section-label';
  domainLabel.textContent = 'Domains';
  panel.appendChild(domainLabel);

  const grid = document.createElement('div');
  grid.className = 'domain-grid';

  skillsData.domains.forEach(domain => {
    const skills = domain.skills || [];
    const mastered = skills.filter(s => (userProgress[s.id] || {}).status === 'mastered').length;

    const card = document.createElement('div');
    card.className = `domain-card domain-card--${domain.id} card--interactive`;

    const icon = document.createElement('div');
    icon.className = 'domain-card__icon';
    icon.textContent = ICONS[domain.id] || '📘';
    card.appendChild(icon);

    const title = document.createElement('div');
    title.className = 'domain-card__title';
    title.textContent = domain.label;
    card.appendChild(title);

    const meta = document.createElement('div');
    meta.className = 'domain-card__meta';
    meta.textContent = domain.description;
    card.appendChild(meta);

    const progressDiv = document.createElement('div');
    progressDiv.style.cssText = 'display: flex; align-items: center; gap: 8px;';
    progressDiv.insertAdjacentHTML('beforeend',
      `<div class="progress-bar progress-bar--${domain.id}" style="flex:1;"><div class="progress-bar__fill" style="width:${skills.length ? (mastered / skills.length * 100) : 0}%"></div></div>`);
    const countEl = document.createElement('span');
    countEl.style.cssText = 'font-size: 0.75rem; color: var(--text-tertiary); white-space: nowrap;';
    countEl.textContent = `${mastered} / ${skills.length}`;
    progressDiv.appendChild(countEl);
    card.appendChild(progressDiv);

    card.addEventListener('click', () => {
      currentDomain = domain;
      currentView = 'skills';
      renderCurrentView(document.getElementById('tab-learn'));
    });

    grid.appendChild(card);
  });

  panel.appendChild(grid);
}

// ============================================================
// SKILLS LIST VIEW
// ============================================================

function renderSkillsView(panel, domain) {
  const back = document.createElement('button');
  back.type = 'button';
  back.className = 'skill-detail__back';
  back.textContent = '← Domains';
  back.addEventListener('click', () => {
    currentView = 'domains';
    currentDomain = null;
    renderCurrentView(panel);
  });
  panel.appendChild(back);

  const header = document.createElement('div');
  header.style.marginBottom = 'var(--sp-6)';
  const h2 = document.createElement('h2');
  h2.textContent = domain.label;
  header.appendChild(h2);
  const desc = document.createElement('p');
  desc.className = 'text-muted';
  desc.style.cssText = 'font-size: 0.875rem; margin-top: var(--sp-1);';
  desc.textContent = domain.description;
  header.appendChild(desc);
  panel.appendChild(header);

  const skills = domain.skills || [];
  const tiers = [
    { num: 1, label: 'Foundational', req: 'No prerequisites' },
    { num: 2, label: 'Intermediate', req: 'Master 3 foundational skills' },
    { num: 3, label: 'Advanced', req: 'Master 3 intermediate skills' },
  ];

  tiers.forEach(tier => {
    const tierSkills = skills.filter(s => s.tier === tier.num);
    if (!tierSkills.length) return;

    const prevMastered = tier.num === 1 ? 999 :
      skills.filter(s => s.tier === tier.num - 1 && (userProgress[s.id] || {}).status === 'mastered').length;
    const unlocked = tier.num === 1 || prevMastered >= 3;

    const tierLabel = document.createElement('h3');
    tierLabel.className = 'section-label';
    tierLabel.textContent = `Tier ${tier.num} · ${tier.label}`;
    if (!unlocked) tierLabel.style.opacity = '0.4';
    panel.appendChild(tierLabel);

    if (!unlocked) {
      const lockMsg = document.createElement('div');
      lockMsg.className = 'text-muted';
      lockMsg.style.cssText = 'font-size: 0.8125rem; margin-bottom: var(--sp-4);';
      lockMsg.textContent = tier.req;
      panel.appendChild(lockMsg);
    }

    const list = document.createElement('div');
    list.className = 'skill-list';

    tierSkills.forEach(skill => {
      const progress = userProgress[skill.id] || {};
      const status = progress.status || 'available';

      const card = document.createElement('div');
      card.className = 'skill-card';
      if (!unlocked) card.classList.add('skill-card--locked');
      if (status === 'mastered') card.classList.add('skill-card--mastered');

      const domainTag = document.createElement('div');
      domainTag.className = `skill-card__domain skill-card__domain--${domain.id}`;
      domainTag.textContent = `Tier ${skill.tier}`;
      card.appendChild(domainTag);

      const title = document.createElement('div');
      title.className = 'skill-card__title';
      title.textContent = skill.title;
      card.appendChild(title);

      const subtitle = document.createElement('div');
      subtitle.className = 'skill-card__subtitle';
      subtitle.textContent = skill.subtitle;
      card.appendChild(subtitle);

      const stepCount = status === 'mastered' ? 3 : status === 'in_progress' ? 2 : status === 'studied' ? 1 : 0;
      const progDiv = document.createElement('div');
      progDiv.className = 'skill-card__progress';
      progDiv.insertAdjacentHTML('beforeend', createProgressBar(stepCount / 3 * 100, { variant: domain.id }));
      const stepLabel = document.createElement('span');
      stepLabel.textContent = status === 'mastered' ? 'Mastered' : `${stepCount}/3`;
      progDiv.appendChild(stepLabel);
      card.appendChild(progDiv);

      if (unlocked) {
        card.addEventListener('click', () => openReader(skill));
      }

      list.appendChild(card);
    });

    panel.appendChild(list);
  });
}

// ============================================================
// FULL-SCREEN READER MODE
// ============================================================

function openReader(skill) {
  const progress = userProgress[skill.id] || {};
  const status = progress.status || 'available';
  let activeMode = 'study';

  const reader = document.createElement('div');
  reader.className = 'reader-mode';

  // Header
  const header = document.createElement('div');
  header.className = 'reader-header';
  const backBtn = document.createElement('button');
  backBtn.type = 'button';
  backBtn.className = 'reader-header__back';
  backBtn.textContent = '← Back';
  backBtn.addEventListener('click', () => closeReader(reader));
  header.appendChild(backBtn);

  const headerInfo = document.createElement('div');
  headerInfo.className = 'reader-header__progress';
  headerInfo.textContent = skill.title;
  header.appendChild(headerInfo);
  reader.appendChild(header);

  // Mode tabs
  const skillCards = (flashcardsData || []).filter(c => c.skillId === skill.id);
  const dueCards = getDueCards(flashcardStates, skillCards);
  const skillChallenges = (challengesData || []).find(c => c.skillId === skill.id);
  const skillCases = (casesData || []).filter(c => c.skillIds && c.skillIds.includes(skill.id));
  const skillSynthesis = (synthesisData || []).filter(s => s.skillIds && s.skillIds.includes(skill.id));
  const skillAssessment = (masteryQData || []).find(q => q.skillId === skill.id);

  const modes = [
    { id: 'study', label: 'Study' },
    { id: 'recall', label: 'Recall', badge: dueCards.length || null },
    { id: 'apply', label: 'Apply' },
    { id: 'connect', label: 'Connect', badge: skillSynthesis.length || null },
    { id: 'cases', label: 'Cases', badge: skillCases.length || null },
    { id: 'assess', label: 'Assess' },
  ];

  const modeTabs = document.createElement('div');
  modeTabs.className = 'mode-tabs';
  modes.forEach(mode => {
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'mode-tab';
    if (mode.id === activeMode) tab.classList.add('mode-tab--active');
    tab.dataset.mode = mode.id;
    tab.textContent = mode.label;
    if (mode.badge) {
      const badge = document.createElement('span');
      badge.className = 'mode-tab__badge';
      badge.textContent = mode.badge;
      tab.appendChild(badge);
    }
    tab.addEventListener('click', () => {
      activeMode = mode.id;
      modeTabs.querySelectorAll('.mode-tab').forEach(t => t.classList.remove('mode-tab--active'));
      tab.classList.add('mode-tab--active');
      renderMode();
    });
    modeTabs.appendChild(tab);
  });
  reader.appendChild(modeTabs);

  // Content area
  const content = document.createElement('div');
  content.id = 'reader-content';
  reader.appendChild(content);

  function renderMode() {
    content.textContent = '';
    const body = document.createElement('div');
    body.className = 'reader-body';

    switch (activeMode) {
      case 'study': renderStudyMode(body, skill); break;
      case 'recall': renderRecallMode(body, skill, skillCards, dueCards, reader); break;
      case 'apply': renderApplyMode(body, skill, skillChallenges); break;
      case 'connect': renderConnectMode(body, skill, skillSynthesis); break;
      case 'cases': renderCasesMode(body, skill, skillCases); break;
      case 'assess': renderAssessMode(body, skill, skillAssessment); break;
    }

    content.appendChild(body);
  }

  // Escape key
  const escHandler = (e) => {
    if (e.key === 'Escape') { closeReader(reader); document.removeEventListener('keydown', escHandler); }
  };
  document.addEventListener('keydown', escHandler);

  renderMode();
  document.body.appendChild(reader);
}

// ============================================================
// MODE RENDERERS
// ============================================================

function renderStudyMode(body, skill) {
  // Domain tag
  const tag = document.createElement('div');
  tag.className = `reader-domain-tag reader-domain-tag--${skill.domain}`;
  tag.textContent = `${currentDomain ? currentDomain.label : skill.domain} · Tier ${skill.tier}`;
  body.appendChild(tag);

  const title = document.createElement('h1');
  title.className = 'reader-title';
  title.textContent = skill.title;
  body.appendChild(title);

  const sub = document.createElement('p');
  sub.className = 'reader-subtitle';
  sub.textContent = skill.subtitle;
  body.appendChild(sub);

  // Concept content
  if (skill.content) {
    const prose = document.createElement('div');
    prose.className = 'prose';
    prose.appendChild(safeMarkdown(skill.content));
    body.appendChild(prose);
  }

  // Source readings
  if (skill.relatedSummaries && skill.relatedSummaries.length > 0) {
    const divider = document.createElement('hr');
    divider.className = 'prose';
    body.appendChild(divider);

    const srcHeader = document.createElement('h2');
    srcHeader.style.cssText = 'font-family: "Space Grotesk"; font-size: 1.3125rem; font-weight: 700; margin-bottom: 0.5rem;';
    srcHeader.textContent = `Source Readings (${skill.relatedSummaries.length})`;
    body.appendChild(srcHeader);

    skill.relatedSummaries.forEach((summary, idx) => {
      const block = document.createElement('details');
      block.style.cssText = 'margin-bottom: 0.75rem; background: var(--bg-surface); border: 1px solid var(--bg-subtle); border-radius: var(--radius-md); overflow: hidden;';
      const titleEl = document.createElement('summary');
      titleEl.style.cssText = 'cursor: pointer; padding: 1rem 1.25rem; display: flex; align-items: center; gap: 0.75rem;';

      const num = document.createElement('span');
      num.style.cssText = 'font-family: "Space Mono"; font-size: 0.75rem; color: var(--text-tertiary); width: 24px;';
      num.textContent = String(idx + 1).padStart(2, '0');
      titleEl.appendChild(num);

      const info = document.createElement('div');
      info.style.flex = '1';
      const t = document.createElement('div');
      t.style.cssText = 'font-weight: 500; font-size: 0.9375rem;';
      t.textContent = summary.title;
      info.appendChild(t);
      if (summary.authors) {
        const a = document.createElement('div');
        a.style.cssText = 'font-size: 0.75rem; color: var(--text-tertiary); margin-top: 2px;';
        a.textContent = summary.authors;
        info.appendChild(a);
      }
      titleEl.appendChild(info);

      const arrow = document.createElement('span');
      arrow.style.cssText = 'font-size: 0.625rem; color: var(--text-tertiary); transition: transform 200ms;';
      arrow.textContent = '▶';
      titleEl.appendChild(arrow);
      block.appendChild(titleEl);

      let rendered = false;
      block.addEventListener('toggle', () => {
        arrow.style.transform = block.open ? 'rotate(90deg)' : '';
        if (block.open && !rendered) {
          const c = document.createElement('div');
          c.className = 'prose';
          c.style.cssText = 'padding: 0 1.25rem 1.25rem;';
          c.appendChild(safeMarkdown(summary.content));
          block.appendChild(c);
          rendered = true;
        }
      });
      body.appendChild(block);
    });
  }

  // Mark as studied button
  const progress = userProgress[skill.id] || {};
  if (!progress.status || progress.status === 'available') {
    const action = document.createElement('div');
    action.style.cssText = 'margin-top: 3rem; padding-bottom: 2rem;';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn--primary btn--full';
    btn.textContent = 'I\'ve studied this — mark as learned';
    btn.addEventListener('click', async () => {
      await updateSkill(skill.id, { status: 'studied', studiedAt: new Date().toISOString() });
      userProgress[skill.id] = { ...progress, status: 'studied' };
      if (flashcardsData) {
        const newStates = initializeSkillCards(skill.id, flashcardsData);
        Object.entries(newStates).forEach(([cardId, state]) => {
          flashcardStates[cardId] = state;
          updateFlashcardState(cardId, state);
        });
      }
      btn.textContent = '✓ Marked as studied';
      btn.disabled = true;
      btn.style.opacity = '0.5';
    });
    action.appendChild(btn);
    body.appendChild(action);
  }
}

function renderRecallMode(body, skill, skillCards, dueCards, reader) {
  const title = document.createElement('h2');
  title.style.cssText = 'margin-bottom: var(--sp-2);';
  title.textContent = 'Spaced Repetition';
  body.appendChild(title);

  const desc = document.createElement('p');
  desc.style.cssText = 'color: var(--text-secondary); margin-bottom: var(--sp-6); line-height: 1.6;';
  desc.textContent = `${skillCards.length} flashcards for this skill. Cards are scheduled using the SM-2 algorithm — the more you get right, the longer the interval before you see them again.`;
  body.appendChild(desc);

  // Stats
  const stats = document.createElement('div');
  stats.className = 'card';
  stats.style.marginBottom = 'var(--sp-6)';
  const statItems = [
    { label: 'Total cards', value: skillCards.length },
    { label: 'Due today', value: dueCards.length },
    { label: 'Learned', value: skillCards.filter(c => flashcardStates[c.id] && flashcardStates[c.id].repetitions >= 1).length },
    { label: 'Mature (21d+)', value: skillCards.filter(c => flashcardStates[c.id] && flashcardStates[c.id].interval >= 21).length },
  ];
  statItems.forEach(s => {
    const row = document.createElement('div');
    row.className = 'row row--between';
    row.style.padding = 'var(--sp-2) 0';
    const label = document.createElement('span');
    label.className = 'text-muted';
    label.style.fontSize = '0.875rem';
    label.textContent = s.label;
    row.appendChild(label);
    const val = document.createElement('span');
    val.className = 'data-value';
    val.textContent = s.value;
    row.appendChild(val);
    stats.appendChild(row);
  });
  body.appendChild(stats);

  if (dueCards.length > 0) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn--primary btn--full';
    btn.textContent = `Review ${dueCards.length} due cards`;
    btn.addEventListener('click', () => {
      closeReader(reader);
      openFlashcardReview(dueCards, flashcardStates,
        async (cardId, newState) => { flashcardStates[cardId] = newState; await updateFlashcardState(cardId, newState); },
        () => renderCurrentView(document.getElementById('tab-learn'))
      );
    });
    body.appendChild(btn);
  } else {
    const done = document.createElement('div');
    done.className = 'empty-state';
    const t = document.createElement('div');
    t.className = 'empty-state__title';
    t.textContent = 'All caught up!';
    done.appendChild(t);
    const d = document.createElement('div');
    d.className = 'empty-state__desc';
    d.textContent = 'No cards due. Come back later for your next review.';
    done.appendChild(d);
    body.appendChild(done);
  }
}

function renderApplyMode(body, skill, skillChallenges) {
  const title = document.createElement('h2');
  title.style.marginBottom = 'var(--sp-2)';
  title.textContent = 'Apply in Real Life';
  body.appendChild(title);

  const desc = document.createElement('p');
  desc.style.cssText = 'color: var(--text-secondary); margin-bottom: var(--sp-6); line-height: 1.6;';
  desc.textContent = 'Three graduated challenges that take you from observing the concept to teaching it to others.';
  body.appendChild(desc);

  if (!skillChallenges) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    const t = document.createElement('div');
    t.className = 'empty-state__title';
    t.textContent = 'No challenges available';
    empty.appendChild(t);
    body.appendChild(empty);
    return;
  }

  const levels = [
    { key: 'observe', label: 'Level 1: Observe', desc: 'Notice the concept in your daily life', icon: '👁' },
    { key: 'intervene', label: 'Level 2: Intervene', desc: 'Deliberately use or counteract the concept', icon: '⚡' },
    { key: 'teach', label: 'Level 3: Teach', desc: 'Explain it to someone else', icon: '🎓' },
  ];

  levels.forEach(level => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.marginBottom = 'var(--sp-4)';

    const header = document.createElement('div');
    header.className = 'row';
    header.style.marginBottom = 'var(--sp-3)';
    const headerTitle = document.createElement('div');
    headerTitle.style.cssText = 'font-weight: 600; font-size: 0.9375rem;';
    headerTitle.textContent = `${level.icon} ${level.label}`;
    header.appendChild(headerTitle);
    card.appendChild(header);

    const chalText = document.createElement('p');
    chalText.style.cssText = 'font-size: 0.9375rem; line-height: 1.7; color: var(--text-secondary); margin-bottom: var(--sp-4);';
    chalText.textContent = skillChallenges[level.key] || 'Challenge not available';
    card.appendChild(chalText);

    // Journal entry
    const textarea = document.createElement('textarea');
    textarea.className = 'textarea';
    textarea.rows = 3;
    textarea.placeholder = `Write your ${level.key} entry here...`;
    card.appendChild(textarea);

    const saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.className = 'btn btn--secondary';
    saveBtn.style.marginTop = 'var(--sp-3)';
    saveBtn.textContent = 'Save Entry';
    saveBtn.addEventListener('click', async () => {
      const text = textarea.value.trim();
      if (!text) return;
      const { addChallengeEntry } = await import('../firebase.js');
      await addChallengeEntry(skill.id, level.key, text);
      saveBtn.textContent = '✓ Saved';
      saveBtn.disabled = true;
    });
    card.appendChild(saveBtn);

    body.appendChild(card);
  });
}

function renderConnectMode(body, skill, prompts) {
  const title = document.createElement('h2');
  title.style.marginBottom = 'var(--sp-2)';
  title.textContent = 'Connect Across Concepts';
  body.appendChild(title);

  const desc = document.createElement('p');
  desc.style.cssText = 'color: var(--text-secondary); margin-bottom: var(--sp-6); line-height: 1.6;';
  desc.textContent = 'Synthesis questions that force you to connect this concept to others. Writing your answer is where real understanding happens.';
  body.appendChild(desc);

  if (!prompts.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    const t = document.createElement('div');
    t.className = 'empty-state__title';
    t.textContent = 'No synthesis prompts yet';
    empty.appendChild(t);
    const d = document.createElement('div');
    d.className = 'empty-state__desc';
    d.textContent = 'Study more skills to unlock cross-concept synthesis questions.';
    empty.appendChild(d);
    body.appendChild(empty);
    return;
  }

  prompts.forEach((prompt, i) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.marginBottom = 'var(--sp-4)';

    const num = document.createElement('div');
    num.style.cssText = 'font-family: "Space Mono"; font-size: 0.75rem; color: var(--text-tertiary); margin-bottom: var(--sp-2);';
    num.textContent = `Prompt ${i + 1}`;
    card.appendChild(num);

    const qText = document.createElement('p');
    qText.style.cssText = 'font-size: 1rem; line-height: 1.7; color: var(--text-primary); margin-bottom: var(--sp-4);';
    qText.textContent = prompt.prompt;
    card.appendChild(qText);

    const textarea = document.createElement('textarea');
    textarea.className = 'textarea';
    textarea.rows = 5;
    textarea.placeholder = 'Write your synthesis here...';
    card.appendChild(textarea);

    const saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.className = 'btn btn--secondary';
    saveBtn.style.marginTop = 'var(--sp-3)';
    saveBtn.textContent = 'Save Response';
    saveBtn.addEventListener('click', async () => {
      const text = textarea.value.trim();
      if (!text) return;
      const { saveSynthesis } = await import('../firebase.js');
      await saveSynthesis(prompt.id, prompt.skillIds, text);
      saveBtn.textContent = '✓ Saved';
      saveBtn.disabled = true;
    });
    card.appendChild(saveBtn);

    body.appendChild(card);
  });
}

function renderCasesMode(body, skill, cases) {
  const title = document.createElement('h2');
  title.style.marginBottom = 'var(--sp-2)';
  title.textContent = 'Case Studies';
  body.appendChild(title);

  const desc = document.createElement('p');
  desc.style.cssText = 'color: var(--text-secondary); margin-bottom: var(--sp-6); line-height: 1.6;';
  desc.textContent = 'Harvard case method: read the situation, decide what you would do, then reveal what actually happened.';
  body.appendChild(desc);

  if (!cases.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    const t = document.createElement('div');
    t.className = 'empty-state__title';
    t.textContent = 'No cases for this skill';
    empty.appendChild(t);
    body.appendChild(empty);
    return;
  }

  cases.forEach(c => {
    const card = document.createElement('div');
    card.className = 'case-card';

    const caseTitle = document.createElement('h3');
    caseTitle.style.cssText = 'font-family: "Space Grotesk"; font-size: 1.0625rem; font-weight: 700; margin-bottom: var(--sp-4);';
    caseTitle.textContent = c.title;
    card.appendChild(caseTitle);

    const situation = document.createElement('div');
    situation.className = 'case-card__situation';
    situation.textContent = c.situation;
    card.appendChild(situation);

    const decision = document.createElement('div');
    decision.className = 'case-card__decision';
    decision.textContent = c.decisionPoint;
    card.appendChild(decision);

    // User response area
    const textarea = document.createElement('textarea');
    textarea.className = 'textarea';
    textarea.rows = 3;
    textarea.placeholder = 'What would you do? Write your answer before revealing...';
    textarea.style.marginBottom = 'var(--sp-3)';
    card.appendChild(textarea);

    // Reveal section (hidden)
    const revealSection = document.createElement('div');
    revealSection.className = 'case-card__reveal';

    const revealTitle = document.createElement('h3');
    revealTitle.style.cssText = 'font-family: "Space Grotesk"; font-size: 0.875rem; font-weight: 600; color: var(--accent); margin-bottom: var(--sp-2);';
    revealTitle.textContent = 'What Actually Happened';
    revealSection.appendChild(revealTitle);

    const revealText = document.createElement('p');
    revealText.style.cssText = 'font-size: 0.9375rem; line-height: 1.7; color: var(--text-primary); margin-bottom: var(--sp-3);';
    revealText.textContent = c.reveal;
    revealSection.appendChild(revealText);

    const debrief = document.createElement('div');
    debrief.className = 'case-card__debrief';
    debrief.textContent = c.debrief;
    revealSection.appendChild(debrief);

    card.appendChild(revealSection);

    // Reveal button
    const revealBtn = document.createElement('button');
    revealBtn.type = 'button';
    revealBtn.className = 'btn btn--secondary btn--full';
    revealBtn.textContent = 'Reveal Answer';
    revealBtn.addEventListener('click', () => {
      revealSection.classList.add('case-card__reveal--visible');
      revealBtn.style.display = 'none';
    });
    card.appendChild(revealBtn);

    body.appendChild(card);
  });
}

function renderAssessMode(body, skill, assessment) {
  const title = document.createElement('h2');
  title.style.marginBottom = 'var(--sp-2)';
  title.textContent = 'Mastery Assessment';
  body.appendChild(title);

  const desc = document.createElement('p');
  desc.style.cssText = 'color: var(--text-secondary); margin-bottom: var(--sp-6); line-height: 1.6;';
  desc.textContent = 'Open-ended questions that test genuine understanding. Write thoughtful responses — these require analysis and synthesis, not memorization.';
  body.appendChild(desc);

  if (!assessment || !assessment.questions) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    const t = document.createElement('div');
    t.className = 'empty-state__title';
    t.textContent = 'No assessment available';
    empty.appendChild(t);
    body.appendChild(empty);
    return;
  }

  const questionsCard = document.createElement('div');
  questionsCard.className = 'card';

  assessment.questions.forEach((q, i) => {
    const qDiv = document.createElement('div');
    qDiv.className = 'assessment-q';

    const num = document.createElement('div');
    num.className = 'assessment-q__num';
    num.textContent = `Question ${i + 1} of ${assessment.questions.length}`;
    qDiv.appendChild(num);

    const qText = document.createElement('div');
    qText.className = 'assessment-q__text';
    qText.textContent = q;
    qDiv.appendChild(qText);

    const textarea = document.createElement('textarea');
    textarea.className = 'textarea';
    textarea.rows = 5;
    textarea.placeholder = 'Write your response...';
    qDiv.appendChild(textarea);

    questionsCard.appendChild(qDiv);
  });

  body.appendChild(questionsCard);

  // Submit assessment
  const submitBtn = document.createElement('button');
  submitBtn.type = 'button';
  submitBtn.className = 'btn btn--primary btn--full';
  submitBtn.style.marginTop = 'var(--sp-6)';
  submitBtn.textContent = 'Submit Assessment';
  submitBtn.addEventListener('click', async () => {
    const responses = [];
    questionsCard.querySelectorAll('textarea').forEach(ta => responses.push(ta.value.trim()));
    const allFilled = responses.every(r => r.length > 20);
    if (!allFilled) {
      submitBtn.textContent = 'Please answer all questions (20+ chars each)';
      submitBtn.style.background = 'var(--error)';
      setTimeout(() => {
        submitBtn.textContent = 'Submit Assessment';
        submitBtn.style.background = '';
      }, 2000);
      return;
    }
    await updateSkill(skill.id, { status: 'mastered', assessmentResponses: responses, masteredAt: new Date().toISOString() });
    userProgress[skill.id] = { ...userProgress[skill.id], status: 'mastered' };
    submitBtn.textContent = '✓ Mastered!';
    submitBtn.disabled = true;
  });
  body.appendChild(submitBtn);
}

function closeReader(reader) {
  reader.classList.add('reader-mode--closing');
  setTimeout(() => reader.remove(), 200);
}

// ============================================================
// MARKDOWN RENDERER
// ============================================================

/**
 * Render markdown safely using marked.js + DOMPurify.
 * Falls back to custom parser if libraries aren't loaded.
 * Returns a DocumentFragment or element.
 */
function safeMarkdown(md) {
  if (typeof marked !== 'undefined' && typeof DOMPurify !== 'undefined') {
    const container = document.createElement('div');
    const rawHtml = marked.parse(md, { breaks: false, gfm: true });
    const cleanHtml = DOMPurify.sanitize(rawHtml);
    const template = document.createElement('template');
    template.innerHTML = cleanHtml;
    return template.content;
  }
  // Fallback to custom parser
  return renderMarkdown(md);
}

function renderMarkdown(md) {
  const frag = document.createDocumentFragment();
  const lines = md.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === '') { i++; continue; }

    if (line.startsWith('## ')) {
      const h = document.createElement('h3');
      h.textContent = line.replace(/^#+\s*/, '');
      frag.appendChild(h);
      i++; continue;
    }

    if (line.startsWith('> ')) {
      const bq = document.createElement('blockquote');
      let qt = line.replace(/^>\s*/, '');
      i++;
      while (i < lines.length && lines[i].startsWith('> ')) {
        qt += ' ' + lines[i].replace(/^>\s*/, '');
        i++;
      }
      bq.textContent = qt;
      frag.appendChild(bq);
      continue;
    }

    if (line.startsWith('- ')) {
      const ul = document.createElement('ul');
      while (i < lines.length && lines[i].startsWith('- ')) {
        const li = document.createElement('li');
        li.appendChild(inlineFmt(lines[i].replace(/^-\s*/, '')));
        ul.appendChild(li);
        i++;
      }
      frag.appendChild(ul);
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      const ol = document.createElement('ol');
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        const li = document.createElement('li');
        li.appendChild(inlineFmt(lines[i].replace(/^\d+\.\s*/, '')));
        ol.appendChild(li);
        i++;
      }
      frag.appendChild(ol);
      continue;
    }

    // Paragraph
    let paraText = line;
    i++;
    while (i < lines.length && lines[i].trim() !== '' && !lines[i].startsWith('#') && !lines[i].startsWith('- ') && !lines[i].startsWith('> ') && !/^\d+\.\s/.test(lines[i])) {
      paraText += ' ' + lines[i];
      i++;
    }
    const p = document.createElement('p');
    p.appendChild(inlineFmt(paraText));
    frag.appendChild(p);
  }

  return frag;
}

function inlineFmt(text) {
  const frag = document.createDocumentFragment();
  const rx = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let last = 0;
  let m;
  while ((m = rx.exec(text)) !== null) {
    if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
    const tk = m[0];
    if (tk.startsWith('**')) {
      const s = document.createElement('strong');
      s.textContent = tk.slice(2, -2);
      frag.appendChild(s);
    } else if (tk.startsWith('`')) {
      const c = document.createElement('code');
      c.textContent = tk.slice(1, -1);
      frag.appendChild(c);
    } else if (tk.startsWith('*')) {
      const e = document.createElement('em');
      e.textContent = tk.slice(1, -1);
      frag.appendChild(e);
    }
    last = m.index + tk.length;
  }
  if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
  return frag;
}
