---
title: "Retrospective vs. Predictive Accuracy"
type: concept
phase: [2]
authors: ["David M. Eddy"]
sources: ["raw/assets/2-06 - Judgment Under Uncertainty - Heuristics and Biases (Collection) - Kahneman, Slovic, Tversky.pdf"]
confidence: 0.7
source_count: 1
created: 2026-04-14
updated: 2026-04-14
supersedes: []
tags: [diagnostic-testing, bayes-theorem, sensitivity, specificity, predictive-value, medical-decision-making, phase-2]
status: active
---

# Retrospective vs. Predictive Accuracy

**Phase(s):** 2
**Confidence:** 0.7

## Definition

Retrospective accuracy and predictive accuracy are two fundamentally different ways of evaluating a diagnostic test, and confusing them is the core error behind the [[base-rate-fallacy-in-medicine]] ([[summary-2-06-hb-ch18-clinical-reasoning]]).

- **Retrospective accuracy** (sensitivity and specificity): P(pos|disease) and P(neg|no disease). Measured by looking backward from known diagnoses to test results. This is what clinical research reports.
- **Predictive accuracy** (positive and negative predictive value): P(disease|pos) and P(no disease|neg). The probability of disease given a test result. This is what clinicians actually need when facing an undiagnosed patient.

The two are related by Bayes' theorem but are **not interchangeable**. Predictive accuracy depends on the base rate (prevalence) of disease in the population being tested, while retrospective accuracy does not.

## Key Findings

- [[eddy|Eddy]] (1982) found that the published medical literature systematically reports retrospective accuracy but uses language implying predictive accuracy.
- With constant retrospective accuracy, a positive mammogram means P(ca|pos) = 40% in a diagnostic population (P(ca) = 8%) but only P(ca|pos) = 2% in a screening population (P(ca) = 0.1%) -- a twentyfold difference.
- Physicians, textbook authors, and policy writers consistently make this confusion, using phrases like "the accuracy of mammography is 90 percent" without specifying which accuracy they mean.

## Mechanisms

The confusion arises because retrospective accuracy is intuitively salient -- it directly describes the test's performance -- while the Bayesian adjustment for base rates is counterintuitive. The [[representativeness]] heuristic drives the substitution: the test result "represents" the disease, so the test's accuracy feels like it should directly translate to disease probability.

## Applications

- **All diagnostic testing:** Every medical test, screening program, and risk assessment depends on this distinction.
- **Communication of test results to patients:** Patients and physicians must understand that a "90% accurate" test does not mean a positive result carries a 90% chance of disease.
- **Public health policy:** Screening programs for low-prevalence conditions generate many false positives even with excellent tests.

## Cross-References

- **Related concepts:** [[base-rate-fallacy-in-medicine]], [[base-rate-neglect]], [[representativeness]]
- **Key authors:** [[eddy]]

## Open Questions

- Would presenting test results in natural frequency format (e.g., "out of 1,000 women, 10 have cancer, 8 of those will test positive, and 99 without cancer will also test positive") eliminate the confusion more effectively than probability formats?
