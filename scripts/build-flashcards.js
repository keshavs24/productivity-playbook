#!/usr/bin/env node
/**
 * build-flashcards.js
 *
 * Reads the 70 curated skills from skills.json and generates
 * spaced repetition flashcards from each concept's content.
 *
 * Card types:
 *   1. DEFINITION — "What is [concept]?" → Definition text
 *   2. KEY_FINDING — "What did [study] find?" → Finding
 *   3. MECHANISM — "How does [concept] work?" → Mechanism explanation
 *   4. APPLICATION — "How would you apply [concept] to [domain]?" → Application
 *   5. DISTINCTION — "What's the difference between [A] and [B]?" → Distinction
 *
 * Output: docs/data/flashcards.json
 */

const fs = require('fs');
const path = require('path');

const SKILLS_PATH = path.join(__dirname, '..', 'docs', 'data', 'skills.json');
const OUTPUT_PATH = path.join(__dirname, '..', 'docs', 'data', 'flashcards.json');

const skillsData = JSON.parse(fs.readFileSync(SKILLS_PATH, 'utf8'));

const allCards = [];
let cardId = 0;

skillsData.domains.forEach(domain => {
  domain.skills.forEach(skill => {
    const content = skill.content || '';
    if (!content) return;

    const sections = parseSections(content);
    const cards = generateCards(skill, sections, domain);
    allCards.push(...cards);
  });
});

// Write output
fs.writeFileSync(OUTPUT_PATH, JSON.stringify(allCards, null, 2), 'utf8');
console.log(`Generated ${allCards.length} flashcards for ${skillsData.domains.reduce((n, d) => n + d.skills.length, 0)} skills`);
console.log(`Average: ${(allCards.length / 70).toFixed(1)} cards per skill`);
console.log(`Output: ${OUTPUT_PATH}`);

// ============================================================
// CARD GENERATION
// ============================================================

function generateCards(skill, sections, domain) {
  const cards = [];

  // Card Type 1: DEFINITION
  if (sections.definition) {
    cards.push(makeCard(skill, 'definition',
      `What is **${skill.title}**?`,
      cleanForAnswer(sections.definition)
    ));
  }

  // Card Type 2: KEY FINDINGS — one card per major bullet point
  if (sections.keyFindings) {
    const bullets = extractBullets(sections.keyFindings);
    bullets.slice(0, 5).forEach((bullet, i) => {
      // Turn the bullet into a question
      const q = bulletToQuestion(bullet, skill.title);
      if (q) {
        cards.push(makeCard(skill, 'finding',
          q.question,
          q.answer
        ));
      }
    });
  }

  // Card Type 3: MECHANISM
  if (sections.mechanisms) {
    cards.push(makeCard(skill, 'mechanism',
      `How does **${skill.title}** work? What are the underlying mechanisms?`,
      cleanForAnswer(sections.mechanisms)
    ));
  }

  // Card Type 4: APPLICATION
  if (sections.applications) {
    const appBullets = extractBullets(sections.applications);
    if (appBullets.length > 0) {
      cards.push(makeCard(skill, 'application',
        `Name 2-3 real-world applications of **${skill.title}**.`,
        appBullets.slice(0, 4).map(b => '• ' + b.trim()).join('\n')
      ));
    }
  }

  // Card Type 5: REVERSE — given the definition, name the concept
  if (sections.definition && sections.definition.length > 50) {
    const defClean = sections.definition
      .replace(new RegExp(skill.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '______')
      .replace(/\*\*/g, '');
    cards.push(makeCard(skill, 'reverse',
      `What concept is described here?\n\n"${defClean.slice(0, 200)}..."`,
      `**${skill.title}**`
    ));
  }

  // Card Type 6: SUBTITLE as question (the punchy hook)
  cards.push(makeCard(skill, 'hook',
    `"${skill.subtitle}" — What concept is this describing?`,
    `**${skill.title}**\n\n${(sections.definition || skill.definition || '').slice(0, 150)}...`
  ));

  return cards;
}

function makeCard(skill, type, question, answer) {
  return {
    id: `${skill.id}--${type}--${cardId++}`,
    skillId: skill.id,
    domain: skill.domain,
    type: type,
    question: question,
    answer: answer
  };
}

// ============================================================
// CONTENT PARSING
// ============================================================

function parseSections(content) {
  const sections = {};
  const parts = content.split(/^## /m);

  parts.forEach(part => {
    const lines = part.trim().split('\n');
    const heading = lines[0].toLowerCase().trim();
    const body = lines.slice(1).join('\n').trim();

    if (heading.includes('definition')) sections.definition = body;
    else if (heading.includes('key finding')) sections.keyFindings = body;
    else if (heading.includes('mechanism')) sections.mechanisms = body;
    else if (heading.includes('application')) sections.applications = body;
    else if (heading.includes('cross-reference')) sections.crossReferences = body;
    else if (heading.includes('open question')) sections.openQuestions = body;
  });

  return sections;
}

function extractBullets(text) {
  return text.split('\n')
    .filter(line => line.trim().startsWith('- ') || line.trim().startsWith('* '))
    .map(line => line.replace(/^[\s-*]+/, '').trim())
    .filter(b => b.length > 20); // Skip trivially short bullets
}

function bulletToQuestion(bullet, conceptTitle) {
  // Clean markdown
  const clean = bullet.replace(/\*\*/g, '').replace(/\[\[[^\]]+\]\]/g, '');

  // If it contains a study reference, make it about the study
  const studyMatch = clean.match(/([\w\s&]+)\s*\((\d{4})\)/);
  if (studyMatch) {
    return {
      question: `In the study of **${conceptTitle}**, what did ${studyMatch[1].trim()} (${studyMatch[2]}) find?`,
      answer: bullet
    };
  }

  // If it starts with a bold term, ask about that term
  const boldMatch = bullet.match(/^\*\*([^*]+)\*\*/);
  if (boldMatch) {
    return {
      question: `Regarding **${conceptTitle}**: What is **${boldMatch[1]}**?`,
      answer: bullet
    };
  }

  // Generic: turn the finding into a question
  if (clean.length > 30) {
    return {
      question: `True or false, and explain: "${clean.slice(0, 120)}..."`,
      answer: bullet
    };
  }

  return null;
}

function cleanForAnswer(text) {
  // Truncate very long answers but keep substance
  if (text.length > 600) {
    // Find a good break point
    const breakIdx = text.indexOf('\n\n', 400);
    if (breakIdx > 0 && breakIdx < 800) {
      return text.slice(0, breakIdx).trim();
    }
    return text.slice(0, 600).trim() + '...';
  }
  return text.trim();
}
