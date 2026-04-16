---
title: "Overconfidence in Calibration"
type: concept
phase: [1, 2]
authors: ["Amos Tversky", "Daniel Kahneman"]
sources: ["raw/assets/1-01 - Judgment Under Uncertainty - Heuristics and Biases (Paper) - Tversky, Kahneman.pdf", "raw/assets/2-08 - Judgment in Managerial Decision Making - Bazerman, Moore.pdf", "raw/assets/2-06 - Judgment Under Uncertainty - Heuristics and Biases (Collection) - Kahneman, Slovic, Tversky.pdf"]
confidence: 0.75
source_count: 3
created: 2026-04-13
updated: 2026-04-14
supersedes: []
tags: [cognitive-bias, anchoring, confidence, calibration, phase-1]
status: active
---

# Overconfidence in Calibration

**Phase(s):** 1, 2
**Confidence:** 0.75

## Definition

Overconfidence in calibration is the systematic tendency to set **confidence intervals that are far too narrow** — people believe they know more precisely than they actually do. When asked for ranges they are 98% sure contain the true value, the true value falls outside those ranges roughly 30% of the time.

## Key Findings

- Subjects asked to estimate quantities (e.g., the Dow-Jones average, lengths of rivers) and provide 1st/99th percentile bounds consistently set ranges too narrow ([[summary-1-01-judgment-under-uncertainty]])
- The error rate was ~30% instead of the expected 2% — a 15x calibration failure
- Two procedures were tested (setting extremes first vs. starting from a best estimate); both showed severe overconfidence
- This is distinct from overconfidence in accuracy (believing your point estimate is correct); calibration overconfidence is about the precision of your uncertainty

## Mechanisms

The [[anchoring-and-adjustment]] heuristic drives calibration overconfidence. When setting a confidence range, people start from their best estimate (the anchor) and adjust outward to set the bounds. But the adjustment is insufficient — they don't move far enough from the anchor. The result: ranges that are too centered on the point estimate, too narrow, and that exclude the true value far more often than they should.

## Applications

- **Project planning:** Time and cost estimates with "worst case" bounds that are routinely exceeded
- **Financial forecasting:** Analysts whose prediction ranges fail to capture actual outcomes
- **Strategic planning:** Business plans that underestimate the range of possible outcomes
- **Risk management:** Confidence intervals around risk estimates that are far too tight
- **Negotiation:** Overconfidence in one's assessment of BATNA or the other party's reservation price

## Bazerman & Moore Extensions

Bazerman and Moore ([[summary-2-08-bazerman-ch2]]) massively extend this concept by placing it within a three-part taxonomy of overconfidence:

- **Overprecision** ([[overprecision]]) is the formal name for calibration overconfidence -- the most robust form of overconfidence
- **Overestimation** ([[overestimation]]) -- thinking we are better than we actually are (self-enhancement, illusion of control, planning fallacy, optimistic biases)
- **Overplacement** ([[overplacement]]) -- thinking we are better than others (better-than-average effect, Lake Wobegon effect)
- Overconfidence is called "the mother of all biases" -- the most potent, pervasive, and pernicious (Griffin & Varey, 1996), blamed for wars, stock bubbles, bankruptcy, Chernobyl, the Challenger explosion, and the subprime crisis
- Overconfidence facilitates all other biases: if we were appropriately humble, we could more easily double-check and correct our flaws
- **Key new evidence:** Financial officers' 80% confidence intervals captured actual returns only 33% of the time (Ben-David, Graham, & Harvey, 2010); scientists' confidence intervals for physical constants were too narrow (Henrion & Fischhoff, 1986); experts in their own domains were equally overprecise (McKenzie, Liersch, & Yaniv, 2008)
- The prescription: strive for well-calibrated beliefs that match reality, not positive illusions

## Fischhoff's Debiasing Review (1982)

Fischhoff ([[summary-2-06-hb-ch31-debiasing]]) exhaustively reviewed all published attempts to debias overconfidence, organized by his [[debiasing-taxonomy]]:

- **Unfair tasks:** Response-mode manipulations (probability vs. odds, fixed-value vs. fixed-probability methods) had mixed results. Raising stakes did not reliably reduce overconfidence (Sieber, 1974). Proper scoring rules are theoretically ideal but asymmetrically penalize overconfidence, potentially producing mechanical reduction without improved understanding.
- **Misunderstood tasks:** Some extreme overconfidence occurs on tasks where subjects have no knowledge; Fischhoff & Slovic (1980) found overconfidence was only partially reduced by cautioning that tasks might be impossible.
- **Perfectible individuals:** Training with personalized feedback showed promise -- one round was as effective as extended series (Lichtenstein & Fischhoff, 1980b). Key conditions: large sample feedback, performance-specific information, discussion of uncertainty-probability mapping.
- **Incorrigible individuals:** Recalibration (mechanically adjusting confidence downward) requires task-specific knowledge of the overconfidence level, making it impractical in general.
- **Restructuring (most effective):** Having respondents list reasons why their preferred answer might be wrong (Koriat, Lichtenstein, & Fischhoff, 1980) reduced overconfidence. This works because it specifically prompts searching for disconfirming evidence. Listing reasons for AND against had no effect -- the critical element is the directional prompt to "consider why you might be wrong."
- **Education:** Weather forecasters show excellent calibration due to explicit feedback rewards (Murphy & Winkler, 1974). Experts without calibration training (psychologists, bankers, engineers, executives) show overconfidence. Difficulty level is the most potent factor: overconfidence with hard questions, underconfidence with easy ones.

Overall finding: overconfidence is remarkably resistant to most interventions. Effective debiasing requires changing the psychological nature of the task, not just exhorting people to be less confident.

## Cross-References
- **Parent heuristic:** [[anchoring-and-adjustment]]
- **Related concepts:** [[overprecision]], [[overestimation]], [[overplacement]], [[illusion-of-validity]], [[confirmation-heuristic]], [[debiasing-taxonomy]], [[debiasing-strategies]]
- **Key authors:** [[tversky]], [[kahneman]], [[bazerman]], [[fischhoff]]
