---
title: "Bootstrapping Judgment"
type: concept
phase: [2]
authors: ["Robyn M. Dawes", "Lewis R. Goldberg"]
sources: ["raw/assets/2-06 - Judgment Under Uncertainty - Heuristics and Biases (Collection) - Kahneman, Slovic, Tversky.pdf"]
confidence: 0.7
source_count: 1
created: 2026-04-14
updated: 2026-04-14
supersedes: []
tags: [bootstrapping, linear-models, expertise, judgment, decision-making, phase-2]
status: active
---

# Bootstrapping Judgment

**Phase(s):** 2
**Confidence:** 0.7

## Definition

Bootstrapping (in the context of judgment and decision making) is the process of building a linear model of an expert's judgments and then using that model in place of the expert. The model captures the expert's implicit weighting policy while eliminating the noise (inconsistency, context effects, fatigue) that degrades the expert's own predictions. The resulting "paramorphic representation" (Hoffman, 1960) consistently outperforms the expert from whom it was derived.

## Key Findings

- Wiggins & Kohen (1971): Linear models of *every single* University of Illinois graduate student judge outperformed the judges at predicting other students' GPAs ([[summary-2-06-hb-ch28-improper-linear-models]])
- Goldberg (1970): 26 of 29 clinical psychologists were outperformed by their own bootstrapped models for neurosis/psychosis diagnosis from MMPI profiles
- Dawes (1971): Bootstrapped models of admissions committee members outperformed the committee at predicting faculty ratings
- The one claimed exception (Libby, 1976, on loan officer bankruptcy predictions) was reversed when Goldberg rescaled the skewed predictor distributions
- Bootstrapping works because it "distills underlying policy from otherwise variable behavior" (Bowman, 1963; Goldberg, 1970; Dawes, 1971)

## Mechanisms

Bootstrapping succeeds because expert judges possess genuine expertise in two areas but are limited in a third:

1. **Variable selection** -- experts know what matters (what to measure, what to attend to)
2. **Directional coding** -- experts know which direction each variable points (higher GRE = better; more fighting = worse)
3. **Integration** -- experts are poor at consistently combining multiple cues. They vary from judgment to judgment, influenced by irrelevant factors.

The bootstrapped model captures (1) and (2) while replacing (3) with mechanical consistency. Since the model applies the expert's average policy without deviation, it outperforms the expert's noisy instantiation of that same policy.

However, Dawes and Corrigan (1974) showed that random and equal-weight models perform comparably to bootstrapped models, suggesting that the bootstrapped weights are not themselves particularly valuable -- any weights in the correct direction work about as well. See [[improper-linear-models]].

## Applications

- **Any domain where expert judgment is repeatedly applied to similar cases:** clinical diagnosis, risk assessment, hiring, loan decisions, graduate admissions, performance evaluation
- **Practical implementation:** Have an expert judge a training set of cases, then fit a regression model to the expert's judgments and use the model for all subsequent cases
- **Organizational efficiency:** Bootstrapping allows organizations to scale expert judgment without requiring the expert's continued involvement

## Cross-References
- **Related concepts:** [[improper-linear-models]], [[clinical-vs-statistical-prediction]], [[overconfidence-in-calibration]]
- **Key authors:** [[dawes]], [[meehl]]
- **Source:** [[summary-2-06-hb-ch28-improper-linear-models]]

## Open Questions
- In the age of machine learning, is bootstrapping still a useful concept, or has it been superseded by more sophisticated modeling approaches that can capture non-linear patterns?
- Does bootstrapping work in domains requiring genuinely configural judgment (where the meaning of one cue depends on another)? The evidence suggests linear models approximate even configural strategies well enough, but this remains debated.
