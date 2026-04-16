---
title: "Cumulative Prospect Theory"
type: concept
phase: [2]
authors: ["Amos Tversky", "Daniel Kahneman"]
sources: ["raw/assets/2-07 - Choices, Values, and Frames (Collection) - Kahneman, Tversky.pdf"]
confidence: 0.7
source_count: 1
created: 2026-04-14
updated: 2026-04-14
supersedes: []
tags: [cumulative-prospect-theory, prospect-theory, decision-weights, behavioral-economics, phase-2]
status: active
---

# Cumulative Prospect Theory

**Phase(s):** 2
**Confidence:** 0.7

## Definition

Cumulative Prospect Theory (CPT) is the 1992 revision of [[prospect-theory]] that extends the original 1979 model to handle prospects with any number of outcomes and uncertain (not just risky) prospects. Its key innovation is replacing the separate transformation of individual probabilities with a rank-dependent **cumulative functional** that transforms the entire cumulative distribution function. This approach satisfies stochastic dominance without requiring the editing phase used in original PT.

## Key Findings

- **Fixes two limitations of original PT:** (1) Original PT could violate stochastic dominance; CPT does not. (2) Original PT only handled two-outcome prospects; CPT handles any number of outcomes. ([[summary-2-07-cvf-ch3-cumulative-prospect-theory]])
- **Separate weighting functions for gains and losses:** CPT allows different probability weighting functions w+ and w- for gains and losses, whereas original PT assumed they were identical. Empirically, gains weighting is more curved (gamma = 0.61) than losses weighting (delta = 0.69).
- **Precise parameter estimates from careful experimentation:** Median value function exponent alpha = beta = 0.88; median loss-aversion coefficient lambda = 2.25; confirming the S-shaped value function and approximately 2:1 loss-gain asymmetry.
- **The [[fourfold-pattern]] of risk attitudes** is confirmed at the individual level: 22 of 25 subjects showed risk aversion for high-probability gains, risk seeking for low-probability gains, risk seeking for high-probability losses, and risk aversion for low-probability losses.

## Mechanisms

CPT works through two phases:

1. **Framing phase:** The decision maker constructs a representation of acts, outcomes, and contingencies. Outcomes are coded as gains or losses relative to a reference point.

2. **Valuation phase:** The prospect is split into positive (f+) and negative (f-) parts. Each part is evaluated using the value function v(x) and rank-dependent decision weights derived from cumulative weighting functions. The total value V(f) = V(f+) + V(f-).

The cumulative approach means decision weights depend on the **rank** of an outcome, not just its probability. The weight assigned to the best outcome among gains uses the decumulative function; the weight assigned to the worst outcome among losses uses the cumulative function. This rank-dependence naturally produces overweighting of extreme outcomes (best gain, worst loss).

## Applications

- **Finance:** The fourfold pattern explains both insurance purchasing (risk aversion for low-probability losses) and lottery purchasing (risk seeking for low-probability gains)
- **Asset pricing:** CPT parameters help explain the equity premium puzzle, option pricing anomalies, and portfolio choice
- **Policy:** Any policy that frames outcomes as gains or losses will be affected by the asymmetric weighting functions

## Cross-References

- **Parent theory:** [[prospect-theory]]
- **Related concepts:** [[value-function]], [[decision-weights]], [[loss-aversion]], [[reference-dependence]], [[fourfold-pattern]], [[framing-effects]]
- **Key authors:** [[tversky]], [[kahneman]]
- **Builds on:** Original prospect theory (1979), Quiggin (1982) rank-dependent utility, Schmeidler (1989) Choquet expected utility
- **Source:** [[summary-2-07-cvf-ch3-cumulative-prospect-theory]]

## Open Questions

- How sensitive are decision weights to the formulation and spacing of outcomes?
- Does the weighting function shape vary across domains (money vs. health vs. time)?
- How does CPT perform for very complex prospects with many outcomes?
