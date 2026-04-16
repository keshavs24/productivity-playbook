---
title: "Improper Linear Models"
type: concept
phase: [2]
authors: ["Robyn M. Dawes"]
sources: ["raw/assets/2-06 - Judgment Under Uncertainty - Heuristics and Biases (Collection) - Kahneman, Slovic, Tversky.pdf"]
confidence: 0.7
source_count: 1
created: 2026-04-14
updated: 2026-04-14
supersedes: []
tags: [linear-models, decision-making, statistical-prediction, judgment, phase-2]
status: active
---

# Improper Linear Models

**Phase(s):** 2
**Confidence:** 0.7

## Definition

An improper linear model is a linear prediction model in which the weights assigned to predictor variables are chosen by a non-optimal method -- equal weighting, intuitive weighting, random weighting (with correct sign), or bootstrapped from expert judgments -- rather than being statistically optimized (as in regression). Dawes (1979, 1982) demonstrated that even these non-optimal models routinely outperform expert human judgment in prediction tasks.

## Key Findings

- Equal-weight models outperform bootstrapped models of experts, which outperform the experts themselves ([[summary-2-06-hb-ch28-improper-linear-models]])
- 10,000 random linear models (correct sign, random magnitude, applied to standardized variables) performed about as well as bootstrapped expert models across five prediction domains
- Graduate admissions: equal-weight model (standardized GRE + GPA + selectivity) correlated .48 with faculty ratings vs. .19 for admissions committee clinical judgment
- The "flat maximum" principle: weights that are near to optimal produce nearly the same output as optimal weights. The solution space is forgiving.
- Marital happiness was predicted by the crude formula "rate of lovemaking minus rate of fighting" -- replicated across three samples with correlations from .40 to .81
- In 25+ years since Meehl (1954), not a single published study has shown clinical judgment superior to statistical prediction using the same codable inputs

## Mechanisms

Improper linear models work because:

1. **People are good at variable selection, bad at integration.** Experts know what to look for (which variables matter and in what direction) but cannot reliably combine information from multiple incomparable sources. Linear models, even crudely weighted, integrate consistently.
2. **Models eliminate noise.** Expert judgments vary with context, mood, fatigue, and order effects. A model distills the underlying policy from this variable behavior.
3. **The flat maximum.** As long as predictor variables are scaled in the correct direction, the specific weights matter little. Different linear composites of positively correlated variables correlate highly with each other.

## Applications

- **Graduate admissions:** Several universities use linear models for initial screening (Illinois, NYU, Oregon, UC Santa Barbara)
- **Medical diagnosis:** Goldberg's MMPI formula for neurosis/psychosis diagnosis outperforms all tested clinical judges
- **Policy decisions:** The Denver bullet decision -- separating policy values from empirical assessment, then combining with equal weights -- produced a bullet superior on all dimensions
- **Hiring:** Simple scored rubrics (unit-weighted criteria) will outperform unstructured interviews for candidate selection
- **Risk assessment:** Any domain where experts must integrate multiple cues to reach a judgment is a candidate for replacement by a simple linear model

## Cross-References
- **Related concepts:** [[clinical-vs-statistical-prediction]], [[bootstrapping-judgment]], [[overconfidence-in-calibration]], [[bounded-rationality]]
- **Key authors:** [[dawes]], [[meehl]]
- **Source:** [[summary-2-06-hb-ch28-improper-linear-models]]
- **Related frameworks:** [[system-1-system-2]] -- the selection/integration distinction maps onto System 1 pattern recognition vs. System 2 computation

## Open Questions
- Do modern machine learning models (which are decidedly non-linear) finally outperform simple linear models in psychological prediction, or does the flat maximum still hold?
- How should the "what variables to include" step be formalized? This is where expert judgment remains essential.
- Can the equal-weighting principle be extended to domains with fundamentally non-compensatory structure (e.g., where one factor is an absolute disqualifier)?
