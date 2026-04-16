# Productivity Playbook — CLAUDE.md

This is the schema file for the Productivity Playbook project. It governs how the LLM operates across two domains: the **gamified productivity app** (docs/ + src/) and the **Obsidian knowledge vault** (master of psychology/). The LLM is the disciplined wiki maintainer. Kevin curates sources, directs analysis, and asks the right questions. The LLM does everything else.

---

## Project Architecture

```
productivity-playbook/
├── docs/                        # Frontend PWA (vanilla JS, offline-capable)
├── src/                         # Google Apps Script backend (Sheets as DB)
├── master of psychology/        # Obsidian vault — the LLM Wiki
│   ├── raw/                     # Layer 1: Immutable source documents
│   ├── wiki/                    # Layer 2: LLM-generated knowledge pages
│   ├── index.md                 # Content catalog — every wiki page listed
│   ├── log.md                   # Chronological operation log
│   └── .obsidian/               # Obsidian config (do not modify)
├── CLAUDE.md                    # This file — the wiki schema
└── README.md                    # App setup guide
```

---

## The Three Layers

### Layer 1: Raw Sources (`master of psychology/raw/`)
Kevin's curated source documents. Articles, book chapters, papers, podcast notes, web clips. **Immutable** — the LLM reads from them but never modifies them. This is the source of truth. Organized by curriculum phase:

```
raw/
├── [all source files dropped here — flat, no subfolders]
└── assets/                      # Images, diagrams, downloaded attachments
```

Kevin drops all sources into `raw/` without organizing. The LLM determines which phase(s) each source belongs to during ingestion and tags accordingly in the wiki pages.

### Layer 2: The Wiki (`master of psychology/wiki/`)
LLM-generated markdown files. The LLM owns this layer entirely — creates pages, updates them, maintains cross-references, resolves contradictions. Kevin reads it; the LLM writes it.

```
wiki/
├── overview.md                  # High-level synthesis of the entire curriculum
├── concepts/                    # Concept pages (e.g., cognitive-biases.md, self-determination-theory.md)
├── entities/                    # Entity pages — people, books, frameworks, models
│   ├── people/                  # (e.g., kahneman.md, cialdini.md, bandura.md)
│   ├── books/                   # (e.g., thinking-fast-and-slow.md, influence.md)
│   ├── frameworks/              # (e.g., system-1-system-2.md, six-principles-of-persuasion.md)
│   └── models/                  # (e.g., elaboration-likelihood-model.md, batna.md)
├── summaries/                   # Source summaries (one per ingested source)
├── comparisons/                 # Cross-source analyses, contrasts, syntheses
├── phases/                      # Phase overview pages (phase-1-overview.md, etc.)
├── applied/                     # Practical application notes, exercises, techniques
└── crystallized/                # Distilled insights from research sessions and explorations
```

### Layer 3: The Schema (this file)
Defines conventions, workflows, page formats, and quality standards. Co-evolved by Kevin and the LLM over time.

---

## The Curriculum

7 phases, sequenced to build foundational knowledge first then layer applied skills:

| Phase | Domain | Key Authors |
|-------|--------|-------------|
| 1 | Cognitive Foundations | Kahneman, Tversky, Aronson, Cialdini, Salovey/Mayer |
| 2 | Decision Science | Kahneman (collections), Bazerman, Anderson |
| 3 | Motivation Science | Ryan/Deci (SDT), Bandura (self-efficacy) |
| 4 | Communication Foundations | Aristotle, Munter, Heath brothers, Stone/Patton/Heen |
| 5 | Negotiation | Fisher/Ury, Malhotra/Bazerman, Shell, Raiffa, Voss |
| 6 | Advanced Persuasion | Cialdini (Pre-Suasion), Pratkanis/Aronson, Lax/Sebenius, Schwartz, Sutherland, Berger, Kenrick/Goldstein |
| 7 | Leadership Communication | Bradford/Robin, Duarte, Abrahams |

---

## Page Format Standards

### Frontmatter (YAML)
Every wiki page must include YAML frontmatter for Dataview queries and lifecycle tracking:

```yaml
---
title: "Page Title"
type: concept | entity | summary | comparison | phase-overview | applied | crystallized
phase: [1-7]                     # Which curriculum phase(s) this relates to
authors: []                      # Relevant authors
sources: []                      # Links to raw source files that informed this page
confidence: 0.0-1.0              # How well-supported this content is
source_count: 0                  # Number of sources backing claims
created: YYYY-MM-DD
updated: YYYY-MM-DD
supersedes: []                   # Pages this replaces or updates
tags: []                         # Obsidian tags for filtering
status: active | stale | superseded
---
```

### Entity Pages (people, books, frameworks, models)
```markdown
# [Entity Name]

**Type:** Person | Book | Framework | Model
**Phase(s):** [relevant phases]
**Key Contribution:** [one-line summary]

## Overview
[2-3 paragraph summary of who/what this is and why it matters]

## Key Ideas
- [Bullet points of core concepts, each linking to relevant concept pages]

## Connections
- **Builds on:** [[links to predecessors/influences]]
- **Extended by:** [[links to successors/extensions]]
- **Contradicts:** [[links to opposing views]]
- **Applied in:** [[links to applied/ pages]]

## Sources
- [[link to raw source 1]]
- [[link to raw source 2]]
```

### Concept Pages
```markdown
# [Concept Name]

**Phase(s):** [relevant phases]
**Confidence:** [score]

## Definition
[Clear, precise definition]

## Key Findings
[What the research says, with citations to source summaries]

## Mechanisms
[How/why this works — the underlying psychology]

## Applications
[How to use this in practice — links to applied/ pages]

## Cross-References
- **Related concepts:** [[links]]
- **Key authors:** [[links]]
- **Frameworks that use this:** [[links]]

## Open Questions
[What's unresolved, debated, or worth investigating further]
```

### Source Summaries
```markdown
# [Source Title] — Summary

**Author(s):** [names]
**Type:** Book chapter | Article | Paper | Lecture | Podcast
**Phase:** [number]
**Date ingested:** YYYY-MM-DD

## Key Takeaways
1. [Most important insight]
2. [Second most important]
3. [etc.]

## Detailed Notes
[Structured notes organized by theme or chapter]

## New Entities Introduced
- [[links to entity pages created or updated]]

## New Concepts Introduced
- [[links to concept pages created or updated]]

## Contradictions or Tensions
[Where this source disagrees with existing wiki content]

## Quotes Worth Keeping
> "Quote" — Author, Source, Page/Location
```

---

## Operations

### 1. INGEST — Processing a New Source

When Kevin drops a new source and asks for ingestion:

1. **Read** the full source document
2. **Discuss** key takeaways with Kevin — what stood out, what's surprising, what connects to existing knowledge
3. **Write source summary** in `wiki/summaries/`
4. **Create or update entity pages** for every person, book, framework, or model mentioned
5. **Create or update concept pages** for every significant concept
6. **Update phase overview** (`wiki/phases/phase-N-overview.md`)
7. **Update `wiki/overview.md`** if the source changes the big picture
8. **Check for contradictions** with existing wiki content — flag and propose resolution
9. **Update `index.md`** with new and modified pages
10. **Append to `log.md`** with format: `## [YYYY-MM-DD] ingest | Source Title`
11. **Update confidence scores** on affected pages (more sources = higher confidence)

A single source typically touches 10-15 wiki pages. Take it slow — quality over speed.

### 2. QUERY — Answering Questions Against the Wiki

When Kevin asks a question:

1. **Read `index.md`** to identify relevant pages
2. **Read relevant wiki pages** (follow cross-references as needed)
3. **Synthesize** an answer with citations to wiki pages and raw sources
4. **Consider filing the answer** as a new wiki page if it represents a valuable synthesis (e.g., in `wiki/comparisons/` or `wiki/crystallized/`)
5. **Log the query** in `log.md`: `## [YYYY-MM-DD] query | Question summary`

### 3. LINT — Health-Checking the Wiki

Periodically (or when Kevin asks), audit the wiki for:

- **Contradictions** between pages — propose resolution based on source recency and count
- **Stale claims** that newer sources have superseded — mark as `status: stale`
- **Orphan pages** with no inbound links — connect or flag
- **Missing pages** — important concepts mentioned but lacking their own page
- **Broken cross-references** — repair automatically
- **Confidence decay** — pages not reinforced by new sources lose confidence over time
- **Data gaps** — suggest new questions to investigate or sources to look for
- Log the lint pass: `## [YYYY-MM-DD] lint | Summary of findings`

### 4. CRYSTALLIZE — Compounding from Exploration

After a completed research thread, analysis, or deep conversation:

1. **Distill** the session into a structured digest in `wiki/crystallized/`
2. **Extract standalone facts** and update relevant concept/entity pages
3. **Strengthen or challenge** existing claims based on what was discovered
4. **Update confidence scores** where exploration reinforced or weakened existing knowledge

---

## Knowledge Lifecycle

### Confidence Scoring
Every claim carries implicit confidence based on:
- **Source count:** More sources = higher confidence
- **Recency:** Recent confirmation strengthens; long silence weakens
- **Contradiction count:** Contested claims score lower
- **Source authority:** Peer-reviewed > popular press; primary research > secondary summary

Scale: 0.0 (speculative) to 1.0 (established consensus)
- 0.1–0.3: Speculative or weakly supported — single anecdotal source, no experimental evidence
- 0.4–0.5: Single source in this wiki, but the finding itself may be well-established in the field
- 0.6–0.7: Well-supported — backed by named experiments with citations, even if from a single wiki source. Use for concepts from landmark papers/books by authoritative researchers (e.g., Kahneman, Cialdini, Milgram)
- 0.8–0.9: Multiple wiki sources confirm, or the concept is foundational and universally accepted
- 1.0: Definitional — the concept IS the field (e.g., "prospect theory" from Kahneman & Tversky)

Note: "source_count" refers to how many sources *in this wiki* back a claim, not how established it is in the broader literature. A concept like loss aversion may have source_count: 1 in the wiki but deserve confidence: 0.7 because it's backed by decades of replicated research.

### Supersession
When new information contradicts or updates an existing claim:
- The new claim explicitly links to what it supersedes
- Old page gets `status: superseded` and a link to the replacement
- Old content preserved but clearly marked — version control for knowledge

### Consolidation Tiers
Information flows upward through tiers as evidence accumulates:

1. **Working memory** — Raw observations from a single source (source summaries)
2. **Episodic memory** — Session-level synthesis (crystallized pages)
3. **Semantic memory** — Cross-source established facts (concept and entity pages)
4. **Procedural memory** — Proven techniques and workflows (applied pages)

Promotion happens during ingest and lint operations. A concept mentioned in one source is working memory. Confirmed across three sources, it gets promoted to a full concept page (semantic). Tested and validated in practice, it becomes an applied page (procedural).

---

## Entity Extraction and Typed Relationships

When ingesting, extract structured entities and relationships:

**Entity types:** Person, Book, Framework, Model, Concept, Principle, Study, Technique
**Relationship types:**
- `authored` — Person → Book/Paper
- `proposed` — Person → Framework/Model/Concept
- `builds_on` — Concept → Concept (intellectual lineage)
- `contradicts` — Concept → Concept (disagreement)
- `extends` — Framework → Framework (refinement)
- `applies` — Technique → Concept (practical application)
- `supports` — Study → Concept (empirical evidence)
- `part_of` — Concept → Phase (curriculum structure)

Use `[[wikilinks]]` for all cross-references. Obsidian's graph view renders these as a navigable knowledge graph.

---

## Index and Log

### `index.md`
Content-oriented catalog. Updated on every ingest. Format:

```markdown
# Wiki Index

## Phases
- [[phase-1-overview]] — Cognitive foundations: biases, heuristics, emotional intelligence
- [[phase-2-overview]] — Decision science: judgment under uncertainty, behavioral economics
...

## Concepts (alphabetical)
- [[anchoring]] — Cognitive bias where initial information disproportionately influences judgment (Phase 1, 2) [confidence: 0.8]
...

## Entities
### People
- [[kahneman]] — Nobel laureate, pioneer of behavioral economics (Phase 1, 2)
...
### Books
- [[thinking-fast-and-slow]] — Kahneman's synthesis of decades of research on dual-process theory
...
### Frameworks
- [[system-1-system-2]] — Dual-process model of cognition (Kahneman)
...

## Source Summaries
- [[summary-thinking-fast-and-slow-ch1]] — "The Characters of the Story" — introduces System 1 and System 2
...

## Comparisons
...

## Applied
...

## Crystallized
...
```

### `log.md`
Chronological, append-only. Each entry prefixed for parseability:

```markdown
# Wiki Log

## [2026-04-12] init | Wiki initialized with curriculum structure
- Created directory structure and phase overviews
- Established schema conventions in CLAUDE.md

## [2026-04-12] ingest | Thinking, Fast and Slow — Chapter 1
- Created summary: wiki/summaries/summary-tfas-ch1.md
- Created entity: wiki/entities/people/kahneman.md
- Created concept: wiki/concepts/system-1-system-2.md
- Updated: index.md, phase-1-overview.md
- Pages touched: 5
```

---

## Obsidian Conventions

- **Wikilinks everywhere:** Use `[[page-name]]` for all cross-references (Obsidian renders these as clickable links and graph edges)
- **File naming:** kebab-case, lowercase (e.g., `cognitive-biases.md`, `thinking-fast-and-slow.md`)
- **Tags:** Use YAML frontmatter tags, not inline `#tags` (cleaner for Dataview)
- **Images:** Store in `raw/assets/`, reference as `![[image-name.png]]`
- **No manual wiki edits:** Kevin reads the wiki in Obsidian. The LLM writes all content. If Kevin wants something changed, he tells the LLM.
- **Dataview-friendly:** Frontmatter should support queries like "all concepts in Phase 2 with confidence > 0.5"

---

## Quality Standards

- **Cite sources.** Every factual claim should trace back to a raw source or wiki page.
- **Flag uncertainty.** If something is speculative or based on a single source, say so explicitly.
- **Resolve contradictions.** Don't just note them — propose which claim is more likely correct and why. Kevin can override.
- **Keep it useful.** Every page should answer the question "why does this page exist?" If it doesn't earn its place, merge it into another page or remove it.
- **No hallucination.** Only write what the sources support. If the LLM isn't sure, it says so. The wiki earns trust by being reliable.
- **Maintain cross-references.** When updating a page, check what links to it and whether those pages need updates too.

---

## Integration with the Productivity Playbook

The Obsidian vault is a module within the broader gamified productivity system. Future integration points:

- **Achievements:** Unlock badges for curriculum milestones (e.g., "Phase 1 Complete", "100 Concepts Mapped")
- **Daily check-in:** "What did you learn today?" filed into the wiki as a crystallized insight
- **Applied techniques:** Concepts from the wiki that Kevin actively practices get tracked as habits or attributes
- **XP for learning:** Ingesting sources, completing phases, and building the wiki could earn XP in the playbook

These integrations will be built incrementally as the wiki matures.

---

## Working With This Schema

- This file is the LLM's operating manual for the wiki. Read it at the start of every session.
- When in doubt about structure or conventions, follow this schema.
- If something in the schema isn't working, Kevin and the LLM update it together.
- The schema evolves. What's written here today will be refined as we learn what works.
