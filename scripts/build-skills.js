#!/usr/bin/env node
/**
 * build-skills.js
 * Reads the skill manifest from docs/data/skills.json (skill metadata + challenges),
 * then enriches each skill with the full concept content from the Obsidian vault.
 * Outputs the enriched skills.json back to docs/data/skills.json.
 *
 * Usage: node scripts/build-skills.js
 */

const fs = require('fs');
const path = require('path');

const VAULT_CONCEPTS = path.join(__dirname, '..', 'productivity-playbook', 'master of psychology', 'wiki', 'concepts');
const SKILLS_JSON = path.join(__dirname, '..', 'productivity-playbook', 'docs', 'data', 'skills.json');

// Check if paths exist, try alternate paths
let conceptsDir = VAULT_CONCEPTS;
if (!fs.existsSync(conceptsDir)) {
  // Try relative to script location
  conceptsDir = path.join(__dirname, '..', 'master of psychology', 'wiki', 'concepts');
}
if (!fs.existsSync(conceptsDir)) {
  console.error('Could not find concepts directory. Tried:');
  console.error('  ', VAULT_CONCEPTS);
  console.error('  ', path.join(__dirname, '..', 'master of psychology', 'wiki', 'concepts'));
  process.exit(1);
}

let skillsPath = SKILLS_JSON;
if (!fs.existsSync(skillsPath)) {
  skillsPath = path.join(__dirname, '..', 'docs', 'data', 'skills.json');
}
if (!fs.existsSync(skillsPath)) {
  console.error('Could not find skills.json');
  process.exit(1);
}

console.log('Reading skills.json from:', skillsPath);
console.log('Reading concepts from:', conceptsDir);

// Read current skills.json
const skillsData = JSON.parse(fs.readFileSync(skillsPath, 'utf8'));

let enriched = 0;
let missing = 0;

skillsData.domains.forEach(domain => {
  domain.skills.forEach(skill => {
    const conceptFile = path.join(conceptsDir, `${skill.id}.md`);

    if (!fs.existsSync(conceptFile)) {
      console.warn(`  MISSING: ${skill.id}.md`);
      missing++;
      return;
    }

    const raw = fs.readFileSync(conceptFile, 'utf8');
    const content = extractContent(raw);
    skill.content = content;
    enriched++;
  });
});

console.log(`\nConcept enrichment: ${enriched} skills enriched, ${missing} missing concept files.`);

/**
 * Extract the markdown content from a concept file.
 * Strips YAML frontmatter, cleans wikilinks, removes the title heading.
 */
function extractContent(raw) {
  let content = raw;
  if (content.startsWith('---')) {
    const endIdx = content.indexOf('---', 3);
    if (endIdx !== -1) {
      content = content.substring(endIdx + 3).trim();
    }
  }

  content = content.replace(/^#\s+.+\n+/, '');
  content = content.replace(/^\*\*Phase\(s\)\:\*\*.+\n/m, '');
  content = content.replace(/^\*\*Confidence\:\*\*.+\n/m, '');
  content = content.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2');
  content = content.replace(/\[\[([^\]]+)\]\]/g, '$1');
  content = content.replace(/\n{3,}/g, '\n\n');

  return content.trim();
}

/**
 * Find ALL related summary content for a concept.
 * Searches every summary file for mentions of this concept.
 * Returns ALL matches, sorted by relevance (mention density).
 */
function findRelatedSummaries(conceptId, summariesDir) {
  if (!fs.existsSync(summariesDir)) return [];

  const summaries = [];
  const files = fs.readdirSync(summariesDir).filter(f => f.endsWith('.md'));
  const searchTerms = [
    conceptId,
    conceptId.replace(/-/g, ' '),
    conceptId.replace(/-/g, '-'),
  ];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(summariesDir, file), 'utf8');
    const rawLower = raw.toLowerCase();

    // Count mentions (more mentions = more relevant)
    let mentions = 0;
    for (const term of searchTerms) {
      const termLower = term.toLowerCase();
      let idx = 0;
      while ((idx = rawLower.indexOf(termLower, idx)) !== -1) {
        mentions++;
        idx += termLower.length;
      }
    }

    if (mentions === 0) continue;

    const content = extractContent(raw);
    if (content.length < 300) continue; // Skip trivially short

    // Extract metadata
    let title = '';
    const titleMatch = raw.match(/title:\s*"([^"]+)"/);
    if (titleMatch) title = titleMatch[1];
    else title = file.replace('.md', '').replace(/^summary-/, '');

    let authors = '';
    const authMatch = raw.match(/authors:\s*\[([^\]]+)\]/);
    if (authMatch) authors = authMatch[1].replace(/"/g, '').trim();

    let source = '';
    const srcMatch = raw.match(/sources:\s*\["?\[\[([^\]"]+)\]\]"?\]/);
    if (srcMatch) source = srcMatch[1];

    // Determine phase from filename
    let phase = '';
    const phaseMatch = file.match(/^summary-(\d)/);
    if (phaseMatch) phase = phaseMatch[1];

    summaries.push({
      title,
      authors,
      source,
      phase,
      content,
      mentions,
      file
    });
  }

  // Sort by phase (curriculum order), then by mention count
  summaries.sort((a, b) => {
    if (a.phase !== b.phase) return (a.phase || '9').localeCompare(b.phase || '9');
    return b.mentions - a.mentions;
  });

  // Only keep summaries where this concept is a CORE topic (3+ mentions)
  // This eliminates passing mentions and keeps only deeply relevant sources
  const relevant = summaries.filter(s => s.mentions >= 3);

  // Cap at 10 to keep reading focused, not overwhelming
  return relevant.slice(0, 10);
}

// Also enrich with related summaries
const SUMMARIES_DIR = path.join(conceptsDir, '..', 'summaries');
console.log('Looking for summaries in:', SUMMARIES_DIR);

skillsData.domains.forEach(domain => {
  domain.skills.forEach(skill => {
    const related = findRelatedSummaries(skill.id, SUMMARIES_DIR);
    if (related.length > 0) {
      skill.relatedSummaries = related.map(s => ({
        title: s.title,
        authors: s.authors,
        source: s.source,
        phase: s.phase,
        content: s.content
      }));
      console.log(`  ${skill.id}: +${related.length} related summaries`);
    }
  });
});

// Final write with all enrichments
fs.writeFileSync(skillsPath, JSON.stringify(skillsData, null, 2), 'utf8');
const fileSizeKB = Math.round(fs.statSync(skillsPath).size / 1024);
console.log(`\nOutput: ${skillsPath} (${fileSizeKB}KB)`);
