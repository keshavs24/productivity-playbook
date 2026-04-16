---
title: "Debiasing Taxonomy (Fischhoff)"
type: concept
phase: [2]
authors: ["Baruch Fischhoff"]
sources: ["raw/assets/2-06 - Judgment Under Uncertainty - Heuristics and Biases (Collection) - Kahneman, Slovic, Tversky.pdf"]
confidence: 0.7
source_count: 1
created: 2026-04-14
updated: 2026-04-14
supersedes: []
tags: [debiasing, taxonomy, hindsight-bias, overconfidence, judgment-improvement, destructive-testing, phase-2]
status: active
---

# Debiasing Taxonomy (Fischhoff)

**Phase(s):** 2
**Confidence:** 0.7

## Definition

Fischhoff's debiasing taxonomy (1982) is a systematic framework for classifying all debiasing strategies according to their **implicit assumption about the source of the bias**. The most important distinction is whether responsibility for the bias is attributed to the task, the judge, or a mismatch between the two. This classification reveals that different assumptions require fundamentally different corrective strategies ([[summary-2-06-hb-ch31-debiasing]]).

The taxonomy is organized hierarchically:

### 1. Faulty Tasks

**Unfair tasks** -- The experimental situation does not give the judge a fair chance:
- Raise stakes (make consequences real)
- Clarify instructions/stimuli
- Discourage second-guessing
- Use better response modes
- Ask fewer questions

**Misunderstood tasks** -- The judge interpreted the task differently than intended:
- Demonstrate an alternative goal the judge may be pursuing
- Demonstrate semantic disagreement (key terms mean different things)
- Demonstrate impossibility of task
- Demonstrate an overlooked distinction

### 2. Faulty Judges

**Perfectible individuals** -- Judges can learn with appropriate support:
- Warn about the possibility of bias
- Describe the bias's direction and magnitude
- Provide personalized feedback on performance
- Train extensively with feedback

**Incorrigible individuals** -- Judges cannot be improved:
- Replace them with models or algorithms
- Recalibrate their responses mechanically
- Plan on error (build error buffers into systems)

### 3. Mismatch Between Judge and Task

**Restructuring** -- Redesign the task to be more compatible with human cognition:
- Make knowledge explicit (force articulation)
- Search for discrepant information ("consider why you might be wrong")
- Decompose the problem into tractable components
- Consider alternative situations
- Offer alternative formulations (different terms, analogies)

**Education** -- Build new cognitive capabilities:
- Rely on substantive experts with domain-specific calibration
- Educate from childhood in probabilistic thinking

## Key Findings

Fischhoff applied this taxonomy exhaustively to two biases -- [[hindsight-bias]] and [[overconfidence-in-calibration]] -- cataloging every published debiasing attempt:

- **Hindsight bias:** Most strategies failed. The only partially successful approach was restructuring -- specifically, requiring subjects to generate reasons why the outcome could have been different (Slovic & Fischhoff, 1977). Warning, training, and task reformulation all failed.
- **Overconfidence:** Also highly resistant. The most effective restructuring approach was having respondents list reasons why their preferred answer might be wrong (Koriat, Lichtenstein, & Fischhoff, 1980). Training with personalized feedback showed some success (Lichtenstein & Fischhoff, 1980b). Weather forecasters showed excellent calibration, suggesting that intensive practice with clear feedback can work.

The overall pattern: **mechanical manipulations (raise stakes, change response format) rarely work. Psychological manipulations (change how people think about the problem) sometimes work.**

## Mechanisms

The taxonomy works because the source of a bias determines what kind of intervention can address it:
- If the task is unfair, fixing the task solves the problem without changing the person
- If the person is perfectible, education and feedback can help
- If the person is incorrigible, only external corrections (algorithms, error buffers) help
- If the mismatch is the problem, cognitive engineering -- restructuring the task to better fit human cognition -- is the most promising approach

Fischhoff's key insight: the most effective debiasing strategies involve changing the **psychological nature of the task** rather than simply exhorting people to try harder or changing surface features.

## Applications

- **Organizational decision-making:** Designing "devil's advocate" processes (restructuring through discrepant information search)
- **Medical decision-making:** Teaching Bayesian reasoning restructures how physicians think about diagnostic evidence ([[base-rate-fallacy-in-medicine]])
- **Risk assessment:** Experts' overconfident probability estimates should be mechanically recalibrated or replaced with structured models
- **Education reform:** Teaching probabilistic thinking from childhood rather than as a remedial adult intervention

## Cross-References

- **Related concepts:** [[debiasing-strategies]], [[hindsight-bias]], [[overconfidence-in-calibration]], [[clinical-vs-statistical-prediction]]
- **Key authors:** [[fischhoff]], [[kahneman]], [[tversky]]
- **Frameworks that use this:** [[debiasing-strategies]] (Bazerman & Moore's seven strategies build on this taxonomy)

## Open Questions

- Is the taxonomy exhaustive? Are there debiasing approaches that don't fit these categories?
- How does the "mismatch" category relate to the choice architecture / nudge framework of Thaler & Sunstein (2008)?
- Can the taxonomy predict in advance which debiasing strategy will work for a novel bias, or is it primarily a post-hoc classification scheme?
