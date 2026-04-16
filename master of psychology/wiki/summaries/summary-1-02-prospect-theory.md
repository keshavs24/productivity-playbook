---
title: "Prospect Theory: An Analysis of Decision Under Risk — Summary"
type: summary
phase: [1, 2]
authors: ["Daniel Kahneman", "Amos Tversky"]
sources: ["raw/assets/1-02 - Prospect Theory - An Analysis of Decision Under Risk (Paper) - Kahneman, Tversky.pdf"]
confidence: 0.9
source_count: 1
created: 2026-04-13
updated: 2026-04-13
supersedes: []
tags: [prospect-theory, loss-aversion, decision-making, behavioral-economics, risk, phase-1]
status: active
---

# Prospect Theory: An Analysis of Decision Under Risk — Summary

**Author(s):** [[kahneman|Daniel Kahneman]] and [[tversky|Amos Tversky]]
**Type:** Seminal research paper
**Published:** *Econometrica*, Vol. 47, No. 2, March 1979, pp. 263–292
**Phase:** 1 — Cognitive Foundations (also foundational for Phase 2)
**Date ingested:** 2026-04-13

## Key Takeaways

1. **Expected utility theory fails as a descriptive model.** People systematically violate its core axioms in predictable ways. The paper documents these violations through a series of elegant choice problems.
2. **Prospect theory is proposed as an alternative.** It replaces utility theory's focus on final wealth states with a model based on **changes from a reference point** (gains and losses), a concave-convex **value function**, and non-linear **decision weights**.
3. **Loss aversion is the central insight:** losses loom larger than equivalent gains. The value function is steeper for losses than gains.
4. **The certainty effect:** people overweight outcomes that are certain relative to merely probable outcomes. This drives risk aversion for gains and risk seeking for losses.
5. **Framing matters profoundly:** the same objective choice, presented differently, produces different preferences — violating the invariance principle of rational choice.

## Detailed Notes

### Part 1: Critique of Expected Utility Theory

The paper opens by laying out the three tenets of expected utility theory (EUT):
1. **Expectation:** Overall utility = probability-weighted sum of outcome utilities
2. **Asset integration:** A prospect is evaluated by integrating it with current wealth
3. **Risk aversion:** The utility function is concave (diminishing marginal utility)

Kahneman and Tversky then systematically demolish EUT as a descriptive model through a series of choice problems administered to Israeli students and university faculty (with amounts relative to ~3,000 Israeli pounds monthly income).

### The Certainty Effect

People overweight outcomes obtained with certainty relative to merely probable outcomes. This is the **[[certainty-effect]]**.

**Problem 1 vs. Problem 2 (Allais-type):**
- Problem 1: 82% chose B (2,400 certain) over A (33% chance of 2,500 + 66% chance of 2,400 + 1% chance of 0)
- Problem 2: 83% chose C (33% chance of 2,500) over D (34% chance of 2,400)
- These preferences are **inconsistent** under EUT. The shift from certainty to probability (Problem 1→2) produces a greater reduction in desirability than the equivalent proportional reduction when both options are uncertain.

**Problems 3 & 4 (simpler Allais):**
- Problem 3: 80% chose B (3,000 certain) over A (4,000 at 80%)
- Problem 4: 65% chose C (4,000 at 20%) over D (3,000 at 25%)
- Again inconsistent: the substitution axiom is violated. Reducing probability from 1.0 to .25 has a bigger psychological impact than reducing from .80 to .20, even though the ratio is the same.

**Problems 5 & 6 (non-monetary):**
- The certainty effect holds for non-monetary outcomes (vacation trips), confirming it is not an artifact of the utility-of-money function.

**Problems 7 & 8 (possibility effect):**
- When probabilities are substantial (.45 vs .90), people choose the more probable option
- When probabilities are tiny (.001 vs .002), people choose the *larger* payoff — the mere *possibility* of winning dominates
- This shows a qualitative shift at the boundary between impossibility and possibility, mirroring the certainty effect at the other end

### The Reflection Effect

When the signs of all outcomes are reversed (gains → losses), **preferences reverse**.

**Table I findings:**
- Problem 3: Risk averse for gains — prefer (3,000) certain over (4,000, .80)
- Problem 3': Risk *seeking* for losses — prefer (-4,000, .80) over (-3,000) certain
- This pattern held across all four problem pairs: risk aversion in the positive domain, risk seeking in the negative domain

The reflection effect has profound implications:
1. Risk aversion is NOT a universal trait — it is domain-dependent
2. The certainty effect works in both directions: for gains, it produces risk aversion (preferring a sure gain over a larger probable gain); for losses, it produces risk *seeking* (preferring a probable larger loss over a certain smaller loss)
3. The common explanation for risk aversion (concave utility = diminishing marginal utility of wealth) cannot explain risk seeking for losses

### Probabilistic Insurance

Problem 9 presents a scenario where an insurance company offers coverage that pays only 50% of the time (e.g., covers losses on odd days but not even days). 80% of subjects rejected this, even though EUT with a concave utility function implies probabilistic insurance should be *preferred* to regular insurance.

This reveals that reducing probability of loss from p to p/2 is much less valuable than reducing it from p/2 to 0. People want the *certainty* of protection, not just a reduction in expected loss. This has major practical implications for how people evaluate risk-reduction measures (burglar alarms, safety equipment, etc.).

### The Isolation Effect

People simplify choices by discarding components shared by all alternatives and focusing only on what distinguishes them. This **[[isolation-effect]]** produces inconsistent preferences when the same choice can be decomposed different ways.

**Problem 10 (two-stage game):**
- Stage 1: 75% chance of getting nothing, 25% chance of reaching Stage 2
- Stage 2: Choose between (4,000, .80) or (3,000) certain
- 78% chose the certain 3,000 — but this is equivalent to Problem 4 where 65% chose the risky option
- The sequential framing makes the certainty of 3,000 in Stage 2 psychologically salient, even though the *overall* probabilities are identical

**Problems 11 & 12 (bonus framing):**
- Problem 11: Given 1,000 bonus, choose between (1,000, .50) or (500 certain) — 84% chose certain 500
- Problem 12: Given 2,000 bonus, choose between (-1,000, .50) or (-500 certain) — 69% chose the gamble
- These are **identical in final wealth** but produce opposite preferences because the reference point (the bonus) changes what counts as a "gain" vs. "loss"

This is the empirical foundation for **[[framing-effects]]**: the carriers of value are **changes relative to a reference point**, not final states of wealth.

### Part 2: The Theory

Prospect theory proposes a two-phase model of choice:

#### Phase 1: Editing
Before evaluation, prospects are simplified through several operations:
- **Coding:** Outcomes are perceived as gains or losses relative to a **reference point** (usually current asset position, but can be shifted by expectations or framing)
- **Combination:** Probabilities of identical outcomes are combined
- **Segregation:** Riskless components are separated from risky components
- **Cancellation:** Components shared by all prospects are discarded (the isolation effect)
- **Simplification:** Probabilities and outcomes are rounded; extremely unlikely outcomes may be discarded
- **Dominance detection:** Dominated alternatives are eliminated

The editing phase is critical because it determines the *frame* in which the prospect is evaluated — and different frames can lead to different choices.

#### Phase 2: Evaluation
The edited prospect is evaluated using two functions:

**The Value Function v(x) — [[value-function]]:**
Three key properties:
1. **Reference dependence:** Value is defined on *changes* from a reference point, not final states. "The carriers of value are changes in wealth or welfare, rather than final states."
2. **Concave for gains, convex for losses:** Diminishing sensitivity — the difference between 100 and 200 feels larger than between 1,100 and 1,200 (for both gains and losses). The function is S-shaped.
3. **Steeper for losses than gains (loss aversion):** "Losses loom larger than gains." The value function is steeper below the reference point than above it. Symmetric fair bets (x, .50; -x, .50) are unattractive, and the aversiveness *increases* with stake size.

The S-shaped value function was confirmed by Problems 13 and 13', showing concavity for gains and convexity for losses. The steepness asymmetry (loss aversion) was confirmed by the general aversion to symmetric bets.

Empirical support: Fishburn and Kochenberger's review of 30 decision makers across five industries found most utility functions were concave for gains and convex for losses, with losses steeper than gains in all but one case.

**The Weighting Function π(p) — [[decision-weights]]:**
Decision weights replace objective probabilities. They are NOT subjective probabilities. They measure the *impact* of events on the desirability of prospects.

Key properties:
1. **Overweighting of small probabilities:** π(p) > p for small p. This explains both lottery ticket purchase (small chance of large gain is overweighted) and insurance purchase (small chance of large loss is overweighted).
2. **Subcertainty:** For all 0 < p < 1, π(p) + π(1-p) < 1. The weights for complementary events sum to less than 1, implying systematic underweighting of moderate-to-high probabilities.
3. **Subproportionality:** For small p, the ratio of decision weights is closer to unity than for large p. That is, the weighting function is relatively flat in the middle and steep near the endpoints (0 and 1).
4. **Discontinuities at endpoints:** Sharp jumps near impossibility (0) and certainty (1). The categorical difference between "impossible" and "possible," and between "possible" and "certain," produces quantal effects.

The weighting function is not well-defined near the endpoints; very small probabilities may be either overweighted or rounded to zero (discarded in editing). Similarly, very high probabilities may be either underweighted or rounded to 1.

### The Formal Model

For regular prospects (where outcomes are all positive or all negative):
- V(x, p; y, q) = π(p)v(x) + π(q)v(y)

For strictly positive or strictly negative prospects:
- V(x, p; y, q) = v(y) + π(p)[v(x) - v(y)]  — the riskless component plus the decision-weighted value difference

The theory generalizes expected utility by:
- Replacing the utility function u(x) with the value function v(x) defined on gains/losses
- Replacing probabilities p with decision weights π(p)
- Adding the editing phase that determines framing

### Discussion and Limitations

The paper acknowledges several limitations:
1. The theory is developed for **simple prospects** (at most two non-zero outcomes with stated probabilities). Extension to more complex choices requires further work.
2. The editing phase can produce **intransitivities** (A preferred to B, B preferred to C, C preferred to A) because different pairs may be edited differently.
3. The theory does not specify how reference points are determined — only that they exist and that outcomes are evaluated relative to them.
4. Shifts in reference point (through framing, adaptation, or aspiration changes) can change preferences for the same objective gamble.

The appendix provides an axiomatic foundation ensuring the uniqueness of π and v (up to ratio scale for v).

## New Entities Introduced
- (No new people — [[kahneman]] and [[tversky]] already exist)

## New Concepts Introduced
- [[prospect-theory]] — Alternative to expected utility theory based on gains/losses, value function, and decision weights
- [[loss-aversion]] — Losses loom larger than equivalent gains; the value function is steeper for losses
- [[certainty-effect]] — Overweighting of certain outcomes relative to merely probable ones
- [[reflection-effect]] — Risk preferences reverse when outcomes switch from gains to losses
- [[isolation-effect]] — Discarding shared components leads to framing-dependent preferences
- [[framing-effects]] — Same objective choice, different framing, different preferences
- [[value-function]] — S-shaped function: concave for gains, convex for losses, steeper for losses; defined on changes from reference point
- [[decision-weights]] — Non-linear transformation of probabilities: overweight small p, underweight moderate-to-high p
- [[reference-dependence]] — Value is determined by changes from a reference point, not absolute states

## Contradictions or Tensions
- **With expected utility theory:** The entire paper is a systematic critique of EUT. Prospect theory replaces EUT as a descriptive model while acknowledging EUT may remain normatively appropriate.
- **With 1-01 (Heuristics paper):** No contradiction — deep complementarity. The heuristics paper shows *how* people judge probabilities (heuristically); this paper shows *how* those distorted probabilities feed into choice (through decision weights). The framing/isolation effects connect to the representativeness heuristic's sensitivity to surface features.
- **Internal tension:** The theory handles simple prospects (2 outcomes) well but struggles with complex multi-outcome prospects. Later work (Cumulative Prospect Theory, 1992) addresses this.

## Quotes Worth Keeping

> "The carriers of value or utility are changes of wealth, rather than final asset positions that include current wealth. This conclusion is the cornerstone of an alternative theory of risky choice." — p. 273

> "A salient characteristic of attitudes to changes in welfare is that losses loom larger than gains. The aggravation that one experiences in losing a sum of money appears to be greater than the pleasure associated with gaining the same amount." — p. 279

> "We propose that the value function is (i) defined on deviations from the reference point; (ii) generally concave for gains and commonly convex for losses; (iii) steeper for losses than for gains." — p. 279

> "The prevalence of the purchase of insurance against both large and small losses has been regarded by many as strong evidence for the concavity of the utility function for money... However, an examination of the relative attractiveness of various forms of insurance does not support the notion that the utility function for money is concave everywhere." — p. 269

> "Apparently, reducing the probability of a loss from p to p/2 is less valuable than reducing the probability of that loss from p/2 to 0." — p. 270 (on probabilistic insurance)

> "Two prospects that are equivalent in probabilities and outcomes could have different values depending on their formulation." — p. 271 (on the isolation effect — the foundation of framing)
