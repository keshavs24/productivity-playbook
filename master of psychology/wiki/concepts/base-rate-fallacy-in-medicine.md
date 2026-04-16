---
title: "Base-Rate Fallacy in Medicine"
type: concept
phase: [2]
authors: ["David M. Eddy"]
sources: ["raw/assets/2-06 - Judgment Under Uncertainty - Heuristics and Biases (Collection) - Kahneman, Slovic, Tversky.pdf"]
confidence: 0.7
source_count: 1
created: 2026-04-14
updated: 2026-04-14
supersedes: []
tags: [base-rate-neglect, bayes-theorem, mammography, medical-decision-making, diagnostic-testing, phase-2]
status: active
---

# Base-Rate Fallacy in Medicine

**Phase(s):** 2
**Confidence:** 0.7

## Definition

The base-rate fallacy in medicine is the systematic confusion of the probability of a positive test result given disease, P(pos|disease), with the probability of disease given a positive test, P(disease|pos). This is a domain-specific and consequential manifestation of [[base-rate-neglect]], documented by [[eddy|David M. Eddy]] (1982) in his landmark analysis of how physicians interpret mammography results.

The confusion leads to dramatic overestimation of the probability of disease after a positive test. In Eddy's mammography example, the correct probability of cancer given a positive mammogram and a 1% base rate is ~7.7%, but approximately 95% of physicians estimate it at ~75% -- an error of nearly tenfold.

## Key Findings

- **The mammography problem** ([[summary-2-06-hb-ch18-clinical-reasoning]]): With P(ca) = 1%, sensitivity = 79.2%, false-positive rate = 9.6%, Bayes' theorem yields P(ca|pos) = 7.7%. Physicians estimate ~75%.
- **Casscells, Schoenberger, & Grayboys (1978)** independently confirmed the finding: even at Harvard Medical School, most physicians make this error.
- The confusion appears in published medical literature, textbooks, and policy statements -- it is not merely a laboratory curiosity.
- The base rate (prevalence) of disease creates a **twentyfold difference** in the meaning of a positive mammogram: P(ca|pos) = 40% in a symptomatic diagnostic population vs. 2% in an asymptomatic screening population, despite identical test accuracy.

## Mechanisms

The error is driven by the [[representativeness]] heuristic: a positive test result "looks like" cancer, so physicians match their probability estimate to the test's apparent diagnostic power rather than computing the base-rate-adjusted posterior probability. The distinction between retrospective accuracy (sensitivity/specificity) and [[retrospective-vs-predictive-accuracy|predictive accuracy]] (positive/negative predictive value) is not taught or internalized.

A secondary mechanism is the medical culture's explicit dismissal of base rates: "The patient is a case of one," "Statistics are for dead men" (DeGowin & DeGowin, 1969).

## Applications

- **Diagnostic test interpretation:** Every diagnostic test -- mammography, PSA, COVID rapid tests, cardiac stress tests -- is subject to this fallacy. The predictive value always depends on the base rate.
- **Screening program design:** Screening asymptomatic populations with low disease prevalence produces many false positives, even with highly accurate tests.
- **Biopsy threshold decisions:** Eddy's concept of the biopsy threshold -- the probability at which biopsy is warranted -- cannot be applied without correct Bayesian reasoning.
- **Medical education:** Teaching Bayesian reasoning to physicians is a [[debiasing-strategies|debiasing strategy]] with direct clinical impact.

## Cross-References

- **Related concepts:** [[base-rate-neglect]], [[representativeness]], [[retrospective-vs-predictive-accuracy]], [[overconfidence-in-calibration]]
- **Key authors:** [[eddy]], [[kahneman]], [[tversky]]
- **Frameworks that use this:** [[debiasing-strategies]], [[clinical-vs-statistical-prediction]]

## Open Questions

- How effective is teaching Bayesian reasoning to medical students? Does it persist beyond the classroom?
- Do natural frequency representations (e.g., "1 out of 100 women have cancer; of those 1, the mammogram will detect about 80%") reduce the error more effectively than probability formats?
- How widespread is the error in modern medicine, given decades of awareness since Eddy's 1982 paper?
