---
title: "The Robust Beauty of Improper Linear Models in Decision Making — Summary"
type: summary
phase: [2]
authors: ["Robyn M. Dawes"]
sources: ["raw/assets/2-06 - Judgment Under Uncertainty - Heuristics and Biases (Collection) - Kahneman, Slovic, Tversky.pdf"]
confidence: 0.7
source_count: 1
created: 2026-04-14
updated: 2026-04-14
supersedes: []
tags: [linear-models, clinical-vs-statistical, bootstrapping, decision-making, judgment, phase-2]
status: active
---

# The Robust Beauty of Improper Linear Models in Decision Making — Summary

**Author(s):** [[dawes|Robyn M. Dawes]]
**Type:** Research paper (Chapter 28 in *Judgment Under Uncertainty: Heuristics and Biases*)
**Published:** 1982, in Kahneman, Slovic, & Tversky (Eds.), Cambridge University Press
**Phase:** 2 — Decision Science
**Date ingested:** 2026-04-14

## Key Takeaways

1. **Proper linear models** (regression-weighted) consistently outperform clinical/intuitive judgment when predicting from the same input variables. This was established by Meehl (1954) and has never been overturned -- not a single published study shows clinical judgment superior to statistical prediction using the same codable inputs.
2. The stunning finding: even **improper linear models** -- where weights are chosen non-optimally (equal weights, random weights, or bootstrapped from judges) -- routinely outperform expert human judgment.
3. **"The whole trick is to know what variables to look at and then know how to add."** People are excellent at selecting relevant predictor variables and coding them directionally; they are poor at integrating information from diverse sources. Linear models are good at integration.
4. Equal-weight models outperform the average random model, which performs about as well as bootstrapped models of expert judges. This means the judges' expertise lies in variable selection, not in weighting.
5. Objections to linear models (wrong criterion, wrong judges, dehumanizing) have had 25 years to produce counterexamples and have failed.

## Detailed Notes

### Proper vs. Improper Linear Models

- A **proper linear model** optimizes weights to maximize prediction of the criterion (e.g., regression, discriminant function analysis).
- An **improper linear model** uses weights chosen by any non-optimal method: equal weights, intuitive weights, or even random weights (with correct sign).
- Meehl (1954): Proper models beat clinical judgment. Dawes's contribution: even improper models beat clinical judgment.

### The Graduate Admissions Example

Dawes (1971) predicted faculty ratings of University of Oregon psychology graduate students from GRE scores, undergraduate GPA, and institutional selectivity.

- Cross-validated multiple correlation of the proper model: .38
- Correlation of admissions committee clinical predictions: .19 (one-fourth the variance)
- Equal-weighted model (standardized GRE + GPA + selectivity): .48 -- *higher* than the proper regression model on cross-validation

The equal-weighted model outperformed both the experts and the optimized regression because equal weights are more stable across samples.

### The Marital Happiness Model

To illustrate that improper models can predict important outcomes: rate of lovemaking minus rate of fighting predicted self-rated marital happiness.

- Alexander's sample: All 12 unhappily married couples argued more than they had intercourse; only 2 of 30 happy couples did.
- Replication at Oregon: correlation of .40 (p < .05)
- Replication in Texas (Thornton): correlation of .81 (p < .01)

"If we love more than we hate, we are happy; if we hate more than we love, we are miserable." Crude, but powerful.

### Why Clinical Judgment Loses

People are better at **selecting and coding** information than at **integrating** it. This is the fundamental asymmetry:

- Expert doctors coding Hodgkin's disease biopsies (Einhorn, 1972): Their individual codings predicted survival time when used in a regression model, but their overall clinical ratings did not predict survival at all.
- Chess grand masters consider no more moves than experts; they just know which ones to look at (deGroot, 1965; Simon & Chase, 1973).
- A linear model "distills underlying policy from otherwise variable behavior" -- it is the judges' inconsistency, not their lack of knowledge, that makes them inferior.

### Bootstrapping

Bootstrapping = building a linear model of an expert's judgments, then using the model instead of the expert. This consistently works because:

- Paramorphic models of judges eliminate noise (context effects, fatigue, mood)
- Wiggins & Kohen (1971): Linear models of every single University of Illinois judge outperformed the judges themselves at predicting GPAs
- L.R. Goldberg (1970): 26 of 29 clinical psychologists were outperformed by their own bootstrapped models for neurosis/psychosis diagnosis
- The one published exception (Libby, 1976, on bankruptcy prediction by loan officers) was reversed when Goldberg rescaled the skewed predictor distributions

### Random Models Work Too

Dawes and Corrigan (1974) constructed 10,000 random linear models for each of five prediction tasks. Random weights (correct sign, drawn from a normal distribution, applied to standardized variables) performed about as well as bootstrapped models of expert judges.

Equal-weight models did even better than random. Mathematical reason: the correlation of the average of correlated variables with a criterion is higher than the average of their individual correlations.

Implication: the judges' specific weighting expertise contributes essentially nothing beyond knowing the direction of each variable. "The flat maximum" -- weights near optimal produce nearly optimal outputs.

### The Denver Bullet Decision

Hammond and Adelman (1976) used improper linear modeling to resolve a politically contentious policy question: what bullet should the Denver Police Department use?

- They separated the policy question (what matters: stopping effectiveness, injury probability, bystander harm) from the empirical question (how do bullets score on those dimensions)
- Policymakers set weights (equally); ballistics experts rated bullets on dimensions
- Result: a bullet that was both more effective AND less harmful than either the existing or proposed bullet
- Accepted by City Council and all parties

### Objections and Dawes's Responses

**Technical objections:**
- "Correlation coefficient is wrong" -- But most real decisions are comparative (selecting best k from N), for which rank-preserving correlations are ideal.
- "Average judges hide good ones" -- Data say otherwise: in Goldberg's study, only 5 of 29 clinicians beat the unit-weight model; in Wiggins & Kohen, zero did.
- "Use better experts" -- "Particularly compelling is the fact that people who argue that different criteria or judges would produce different results have had 25 years to produce examples, and they have failed."
- "Short-term criteria are trivial" -- Distant futures are *less* predictable, so the advantage of models should hold or grow.

**Psychological objections:**
- [[availability]]-driven selective memory of clinical successes ("I knew someone who...") reinforces belief in clinical prediction.
- Self-fulfilling prophecies: admissions officers credit themselves when admitted students succeed, but the success partly results from admission itself.
- The "illusion of predictability": statistical models bluntly confront us with how poorly we can predict; clinical prediction lets us maintain "the comforting illusion that life is in fact predictable."

**Ethical objections:**
- "Reducing people to numbers is dehumanizing" -- Dawes's response: "A GPA represents 3 1/2 years of behavior... Do we really believe that we can do a better or a fairer job by a 10-minute folder evaluation or a half-hour interview?" To rely on clinical judgment when models are superior is "cognitive conceit" that cheats the people we serve.

## New Entities Introduced

- [[dawes]] -- Robyn M. Dawes, psychologist, Carnegie Mellon University / University of Oregon
- [[meehl]] -- Paul Meehl, psychologist, University of Minnesota; author of *Clinical Versus Statistical Prediction* (1954)

## New Concepts Introduced

- [[improper-linear-models]] -- Linear models with non-optimal weights (equal, random, bootstrapped) that still outperform human judgment
- [[clinical-vs-statistical-prediction]] -- The systematic finding that statistical/mechanical combination of information outperforms expert intuitive judgment
- [[bootstrapping-judgment]] -- Building a linear model of an expert's judgments and using the model instead of the expert

## Contradictions or Tensions

- Dawes argues that the distinction between "selecting variables" (human expertise) and "integrating variables" (model expertise) is the crux. This directly supports the [[system-1-system-2]] framework: System 1 is good at pattern recognition and variable identification; System 2 integration is unreliable and should be outsourced to models.
- The finding that equal weights outperform regression weights on cross-validation is counterintuitive but well-established. It occurs because optimal weights capitalize on sample-specific noise; equal weights are perfectly stable.
- Fischhoff ([[summary-2-06-hb-ch23-hindsight-bias]]) references Dawes's work directly, noting that "simple linear models are extraordinarily powerful predictors" -- confirming the convergence between these two chapters.
- Dawes's argument that clinical prediction is maintained partly through [[availability]] of vivid successes connects this paper back to the foundational heuristics of [[summary-1-01-judgment-under-uncertainty]].

## Quotes Worth Keeping

> "The whole trick is to know what variables to look at and then know how to add." — Dawes & Corrigan, 1974, p. 105, quoted by Dawes

> "People -- especially the experts in a field -- are much better at selecting and coding information than they are at integrating it." — Dawes, p. 396

> "Particularly compelling is the fact that people who argue that different criteria or judges or variables or time frames would produce different results have had 25 years in which to produce examples, and they have failed to do so." — Dawes, p. 407

> "Statistical prediction, because it includes the specification (usually a low correlation coefficient) of exactly how poorly we can predict, bluntly strikes us with the fact that life is not all that predictable. Unsystematic clinical prediction, in contrast, allows us the comforting illusion that life is in fact predictable and that we can predict it." — Dawes, p. 410

> "No matter how ethically uncomfortable we may feel at 'reducing people to mere numbers,' the fact remains that our clients are people who deserve to be treated in the best manner possible... To do otherwise is to cheat the people we serve." — Dawes, p. 412
