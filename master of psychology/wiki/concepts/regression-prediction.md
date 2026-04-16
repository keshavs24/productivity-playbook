---
title: "Regression in Prediction"
type: concept
phase: [2]
authors: ["Daniel Kahneman", "Amos Tversky"]
sources: ["raw/assets/2-06 - Judgment Under Uncertainty - Heuristics and Biases (Collection) - Kahneman, Slovic, Tversky.pdf"]
confidence: 0.7
source_count: 1
created: 2026-04-14
updated: 2026-04-14
supersedes: []
tags: [regression, prediction, base-rate, forecasting, intuitive-prediction, corrective-procedures, phase-2]
status: active
---

# Regression in Prediction

**Phase(s):** 2
**Confidence:** 0.7

## Definition

Regression in prediction is the normative principle that optimal predictions should be **regressive** -- pulled toward the base rate or class average -- with the degree of regression determined by the predictability of the criterion. When predictability is zero, the best prediction is the class average regardless of case information. When predictability is perfect, the prediction can fully match the impression. In intermediate cases (the vast majority), predictions should fall between the impression-matched value and the class average.

Kahneman and Tversky (1982, Ch. 30) demonstrate that intuitive predictions are typically **nonregressive**: people match their predictions to their impressions (the "matching rule"), producing predictions that are systematically too extreme ([[summary-2-06-hb-ch30-intuitive-prediction]]).

## Key Findings

- Intuitive predictions follow a **matching rule**: the predicted value is selected so its percentile rank in the outcome distribution matches the case's percentile rank in the impression distribution.
- This matching rule ignores uncertainty and produces nonregressive predictions -- predictions as extreme as the impressions, regardless of how noisy the prediction environment is.
- The **planning fallacy** is a specific consequence: project completion estimates based on internal analysis of a specific plan are nonregressive relative to the distribution of actual completion times for similar projects.
- The correction formula: Regressed estimate = Class average + rho * (Intuitive estimate - Class average), where rho is the correlation between predictions and outcomes.
- Example: Intuitive prediction = 12,000 book copies, class average = 4,000, rho = 0.6. Regressed estimate = 4,000 + 0.6(8,000) = 8,800.

## Mechanisms

The nonregressiveness of intuitive prediction is driven by [[representativeness]] -- the case is matched to an outcome that "represents" or resembles the impression, without adjusting for the imperfect validity of the impression as a predictor. This is functionally equivalent to [[base-rate-neglect]]: the class average (base rate) is underweighted relative to case-specific (singular) information.

Kahneman and Tversky's five-step corrective procedure counteracts this by:
1. Anchoring the prediction to a reference class distribution
2. Separately assessing predictability (forcing attention to validity)
3. Mathematically adjusting the intuitive estimate toward the mean

## Applications

- **Forecasting:** Any prediction task -- economic, technological, political, medical -- should be checked for nonregressiveness by comparing the prediction to the reference class average.
- **Project planning:** The external approach ("How long do similar projects take?") corrects the internal approach's optimistic bias ([[planning-fallacy]]).
- **Personnel selection:** Interviewers' extreme positive or negative impressions should be regressed toward the mean performance of similar candidates.
- **Investment:** Analysts' predictions of exceptional returns should be regressed toward market base rates.

## Cross-References

- **Related concepts:** [[regression-to-the-mean]], [[base-rate-neglect]], [[representativeness]], [[anchoring-and-adjustment]], [[planning-fallacy]]
- **Key authors:** [[kahneman]], [[tversky]]
- **Frameworks that use this:** [[debiasing-strategies]], [[clinical-vs-statistical-prediction]]

## Open Questions

- How accurately can experts assess their own predictive validity (Step 4 of the corrective procedure)? If they overestimate validity due to [[hindsight-bias]], the correction will be insufficient.
- Does the five-step procedure improve prediction accuracy in field settings, or only in controlled experiments?
- How does this relate to Tetlock's (2005) finding that "foxes" (who integrate distributional data) outperform "hedgehogs" (who rely on singular theories)?
