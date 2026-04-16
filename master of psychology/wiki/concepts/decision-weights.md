---
title: "Decision Weights"
type: concept
phase: [1, 2]
authors: ["Daniel Kahneman", "Amos Tversky"]
sources: ["raw/assets/1-02 - Prospect Theory - An Analysis of Decision Under Risk (Paper) - Kahneman, Tversky.pdf", "raw/assets/2-07 - Choices, Values, and Frames (Collection) - Kahneman, Tversky.pdf"]
confidence: 0.8
source_count: 2
created: 2026-04-13
updated: 2026-04-14
supersedes: []
tags: [prospect-theory, probability, weighting, phase-1]
status: active
---

# Decision Weights

**Phase(s):** 1, 2
**Confidence:** 0.8

## Definition

Decision weights (π) are the non-linear transformation of stated probabilities in [[prospect-theory]]. They replace objective probabilities in the evaluation of prospects. Decision weights are **not subjective probabilities** — they measure the *impact* of events on the desirability of prospects, not beliefs about likelihood.

## Key Properties

1. **Overweighting of small probabilities:** π(p) > p for small p. This explains lottery purchases (tiny chance of a big gain is overweighted) and insurance purchases (tiny chance of a big loss is overweighted).

2. **Subcertainty:** π(p) + π(1-p) < 1 for all 0 < p < 1. The decision weights for complementary events sum to less than 1. This means the total weight assigned to all uncertain outcomes is less than the weight assigned to a certain outcome.

3. **Subproportionality:** The weighting function is flatter in the middle and steeper near the endpoints. Proportional changes in probability matter more when starting near 0 or 1 than when starting in the middle range.

4. **Discontinuities at boundaries:** Sharp jumps at p = 0 (impossible → possible) and p = 1 (possible → certain). These quantal effects reflect categorical distinctions in the mind.

## The Shape

The weighting function (Figure 4 in the paper) is:
- Below the diagonal for moderate-to-high probabilities (underweighting)
- Above the diagonal for small probabilities (overweighting)
- Steep near p = 0 and p = 1
- Relatively flat in the middle range
- Not well-defined very near the endpoints (very small probabilities may be either overweighted or discarded entirely; very high probabilities may be treated as certain)

## Applications

- **Lottery/gambling:** People buy lottery tickets because π(.001) >> .001 — the tiny probability of winning gets a disproportionate decision weight
- **Insurance:** People buy insurance because π(.001) for the loss is also overweighted — the possibility of catastrophic loss commands attention
- **Risk communication:** "1 in a million chance" may be treated as far more probable than it is (overweighted) or may be discarded as "impossible" — the weighting function is unstable near zero
- **Marketing:** "You could win!" exploits the overweighting of small probabilities. Lottery-style promotions are effective even when odds are negligible.

## Cumulative Prospect Theory Refinements

[[cumulative-prospect-theory]] ([[summary-2-07-cvf-ch3-cumulative-prospect-theory]]) provides critical advances:

- **Rank-dependent cumulative weighting:** Instead of transforming each probability separately, CPT transforms cumulative probabilities. Decision weights depend on the rank of an outcome, not just its probability. This eliminates stochastic dominance violations.
- **Separate weighting functions for gains (w+) and losses (w-):** Original PT assumed w+ = w-. CPT allows them to differ. Empirically, w+ is more curved (gamma = 0.61) than w- (delta = 0.69), meaning risk aversion for gains is more pronounced than risk seeking for losses at moderate-to-high probabilities.
- **Precise parametric form:** w+(p) = p^gamma / (p^gamma + (1-p)^gamma)^(1/gamma). This one-parameter form has an inverse S-shape: concave near 0, convex near 1, with a crossover point.
- **The [[fourfold-pattern]] of risk attitudes** emerges from the interaction of the value function shape and the weighting function shape.

## Cross-References
- **Parent theory:** [[prospect-theory]], [[cumulative-prospect-theory]]
- **Related concepts:** [[certainty-effect]], [[value-function]], [[availability]] (which affects *perceived* probability, feeding into the weighting function), [[fourfold-pattern]]
- **Key authors:** [[kahneman]], [[tversky]]
