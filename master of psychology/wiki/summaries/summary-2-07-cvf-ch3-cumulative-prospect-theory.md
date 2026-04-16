---
title: "Advances in Prospect Theory: Cumulative Representation of Uncertainty — Summary"
type: summary
phase: [2]
authors: ["Amos Tversky", "Daniel Kahneman"]
sources: ["raw/assets/2-07 - Choices, Values, and Frames (Collection) - Kahneman, Tversky.pdf"]
confidence: 0.8
source_count: 1
created: 2026-04-14
updated: 2026-04-14
supersedes: []
tags: [cumulative-prospect-theory, prospect-theory, decision-weights, value-function, loss-aversion, phase-2]
status: active
---

# Advances in Prospect Theory: Cumulative Representation of Uncertainty — Summary

**Author(s):** [[tversky|Amos Tversky]] and [[kahneman|Daniel Kahneman]]
**Type:** Major theoretical paper
**Published:** *Journal of Risk and Uncertainty*, 5, 297-323, 1992. Reprinted as Ch. 3 in *Choices, Values, and Frames* (2000).
**Phase:** 2 — Decision Science
**Date ingested:** 2026-04-14

## Key Takeaways

1. **Cumulative Prospect Theory (CPT) solves the two major technical limitations of original prospect theory.** Original PT (1979) could not handle prospects with more than two outcomes and could violate stochastic dominance. CPT fixes both by using a rank-dependent cumulative functional.
2. **The value function is a two-part power function** with median exponent alpha = beta = 0.88 for both gains and losses, confirming diminishing sensitivity. The median loss-aversion coefficient lambda = 2.25, confirming that losses are about twice as painful as equivalent gains.
3. **The weighting functions are inverse S-shaped** -- overweighting small probabilities and underweighting moderate-to-high probabilities. The median gamma = 0.61 (gains) and delta = 0.69 (losses). This produces the **fourfold pattern of risk attitudes**.
4. **Separate weighting functions for gains and losses** are needed. The gains weighting function is more curved than the losses function, meaning risk aversion for gains is more pronounced than risk seeking for losses at moderate-to-high probabilities.
5. **The fourfold pattern of risk attitudes is the most distinctive empirical prediction**: risk aversion for high-probability gains, risk seeking for low-probability gains, risk seeking for high-probability losses, risk aversion for low-probability losses. 22 of 25 subjects exhibited this complete pattern.

## Detailed Notes

### 1. Theory

CPT distinguishes two phases: **framing** (constructing a representation of acts, outcomes, and contingencies) and **valuation** (assessing the value of each prospect and choosing accordingly).

The key innovation is the **cumulative functional**: instead of transforming each probability separately (as in original PT), CPT transforms the entire cumulative distribution function. For a prospect with outcomes ranked x_-m <= ... <= x_0 <= ... <= x_n:

- The prospect is split into positive part f+ and negative part f-
- V(f) = V(f+) + V(f-) -- gains and losses are evaluated separately
- Decision weights are derived from differences in cumulative capacities, not from individual probabilities

For **risky prospects** (known probabilities), the decision weights use weighting functions w+ and w- applied to cumulative probabilities. This is the rank-dependent approach first proposed by Quiggin (1982) for gains, extended here to both gains and losses.

### Key Advantages over Original PT

1. **Applies to any finite prospect** (any number of outcomes), not just two-outcome gambles
2. **Extends to uncertain prospects** (unknown probabilities), not just risky ones
3. **Satisfies stochastic dominance** without requiring an editing phase to eliminate dominated options
4. **Allows different weighting functions for gains and losses**, generalizing the original assumption that w+ = w-

### 1.3 Values and Weights

The value function is assumed to be:
- Concave above the reference point (v''(x) <= 0, x >= 0)
- Convex below it (v''(x) >= 0, x <= 0)
- Steeper for losses than gains: v'(x) < v'(-x) for x >= 0

The principle of **diminishing sensitivity** applies to both values and weights: the impact of a change diminishes with distance from the reference point (for values) or from the boundaries of certainty and impossibility (for weights).

### 2. Experiment

25 graduate students from Berkeley and Stanford completed three one-hour sessions. Certainty equivalents were derived from binary choices between prospects and sure amounts, using a two-stage narrowing procedure.

**The fourfold pattern** confirmed at the individual level: For p >= .5, all 25 subjects were risk-averse for gains and risk-seeking for losses. The complete fourfold pattern held for 22 of 25 subjects.

**Parameter estimates (median):**
- Value function exponent: alpha = beta = 0.88
- Loss aversion coefficient: lambda = 2.25
- Weighting function (gains): gamma = 0.61
- Weighting function (losses): delta = 0.69

The value function is well-approximated by: v(x) = x^0.88 for gains; v(x) = -2.25(-x)^0.88 for losses.

The weighting functions are well-approximated by: w+(p) = p^gamma / (p^gamma + (1-p)^gamma)^(1/gamma) and w-(p) = p^delta / (p^delta + (1-p)^delta)^(1/delta).

**Loss aversion tests:** For mixed prospects (50-50 chance to win or lose), the gain must be about twice the loss to make the prospect acceptable. The median ratio was 2.25, with individual subjects ranging from about 1.5 to over 3.

### 3. Discussion

CPT retains the major features of original PT while providing a more rigorous mathematical framework. The cumulative functional is unlikely to be accurate in detail -- decision weights may be sensitive to formulation, spacing, and number of outcomes. But the qualitative properties are robust.

The paper notes that people can spend a lifetime in competitive environments without acquiring linear decision weights or avoiding framing effects. Human choices are orderly, though not always rational in the traditional sense.

## New Entities Introduced

- [[cumulative-prospect-theory]] — The updated, more rigorous version of prospect theory using rank-dependent cumulative weighting

## New Concepts Introduced

- [[cumulative-prospect-theory]] — Extension of PT using cumulative functional that handles any number of outcomes and satisfies stochastic dominance
- [[fourfold-pattern]] — The characteristic pattern: risk aversion for high-p gains, risk seeking for low-p gains, risk seeking for high-p losses, risk aversion for low-p losses

## Contradictions or Tensions

- **Supersedes aspects of [[summary-1-02-prospect-theory]]:** The cumulative version fixes limitations of the 1979 theory while preserving its core insights
- **The original assumption w+ = w- is not supported:** The gains weighting function is more curved (gamma = 0.61) than the losses function (delta = 0.69)

## Quotes Worth Keeping

> "The present theory retains the major features of the original version of prospect theory and introduces a (two-part) cumulative functional, which provides a convenient mathematical representation of decision weights."

> "The fourfold pattern of risk attitudes emerges as a major empirical generalization about choice under risk."

> "Prospect theory departs from the tradition that assumes the rationality of economic agents; it is proposed as a descriptive, not a normative, theory."
