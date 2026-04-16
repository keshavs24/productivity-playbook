---
title: "Clinical vs. Statistical Prediction"
type: concept
phase: [2]
authors: ["Paul Meehl", "Robyn M. Dawes"]
sources: ["raw/assets/2-06 - Judgment Under Uncertainty - Heuristics and Biases (Collection) - Kahneman, Slovic, Tversky.pdf"]
confidence: 0.7
source_count: 1
created: 2026-04-14
updated: 2026-04-14
supersedes: []
tags: [clinical-judgment, statistical-prediction, decision-making, expertise, phase-2]
status: active
---

# Clinical vs. Statistical Prediction

**Phase(s):** 2
**Confidence:** 0.7

## Definition

The clinical vs. statistical prediction debate concerns whether expert human judgment (clinical prediction) or mechanical combination of information (statistical prediction) produces more accurate forecasts. Meehl (1954) first systematically reviewed the evidence, and the verdict has been consistent for over 70 years: **statistical models outperform or match clinical judgment in virtually every domain studied**, when both use the same codable input variables.

## Key Findings

- Meehl (1954) reviewed studies showing proper linear models (regression-weighted) beat clinical intuition; by 1965 he found only one disputed exception ([[summary-2-06-hb-ch28-improper-linear-models]])
- Dawes (1979, 1982) extended this: even **improper** linear models (equal weights, random weights) beat clinical judgment -- see [[improper-linear-models]]
- Sawyer (1966) reviewed a plethora of studies confirming Meehl's generalization
- Einhorn (1972): Expert doctors coding Hodgkin's disease biopsies -- their individual codings predicted survival time in a regression model, but their overall clinical ratings did not predict survival at all. Experts know what to code but cannot integrate.
- No published study using codable inputs shows clinical judgment superior to statistical prediction. The burden of proof has been on clinical advocates for decades, and they have not met it.

## Mechanisms

The asymmetry arises from a fundamental human limitation: **people are better at selecting and coding information than at integrating it.** Key factors:

- **Integration overwhelms cognitive capacity.** Combining many cues with different scales and reliabilities exceeds working memory and computational ability.
- **Inconsistency.** Human judges are affected by context effects, fatigue, mood, recency, and order -- they apply different weights to the same cues at different times.
- **Overconfidence in complexity.** Judges report using configural strategies ("this cue means X unless that other cue is high") but their actual behavior is well-approximated by simple linear models.
- **[[availability]] bias in self-evaluation.** Memorable clinical successes (especially those that contradict formulas) reinforce belief in clinical judgment, while quiet statistical successes go unnoticed.

## Applications

- **Psychiatric diagnosis:** MMPI-based formulas outperform clinicians at neurosis/psychosis classification
- **Admissions decisions:** Simple GRE + GPA composites predict faculty ratings better than admissions committee judgments
- **Parole decisions:** Statistical risk assessment tools outperform parole board clinical impressions
- **Hiring:** Structured scoring rubrics outperform unstructured interviews
- **Medical prognosis:** Actuarial models for survival prediction outperform physician judgment

## Cross-References
- **Related concepts:** [[improper-linear-models]], [[bootstrapping-judgment]], [[overconfidence-in-calibration]], [[bounded-rationality]], [[system-1-system-2]]
- **Key authors:** [[meehl]], [[dawes]]
- **Source:** [[summary-2-06-hb-ch28-improper-linear-models]]

## Open Questions
- Does the clinical vs. statistical debate apply in domains requiring genuinely novel pattern recognition (e.g., identifying a new disease)? The statistical approach requires codable inputs and a criterion, which may not exist for truly novel situations.
- How should organizations balance the efficiency of models with the need for human accountability and perceived fairness in high-stakes decisions?
- Can hybrid approaches (human variable selection + model integration) capture the best of both worlds?
