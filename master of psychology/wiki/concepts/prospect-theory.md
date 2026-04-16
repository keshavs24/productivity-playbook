---
title: "Prospect Theory"
type: concept
phase: [1, 2]
authors: ["Daniel Kahneman", "Amos Tversky"]
sources: ["raw/assets/1-02 - Prospect Theory - An Analysis of Decision Under Risk (Paper) - Kahneman, Tversky.pdf", "raw/assets/2-08 - Judgment in Managerial Decision Making - Bazerman, Moore.pdf", "raw/assets/2-07 - Choices, Values, and Frames (Collection) - Kahneman, Tversky.pdf"]
confidence: 0.9
source_count: 3
created: 2026-04-13
updated: 2026-04-14
supersedes: []
tags: [theory, decision-making, behavioral-economics, risk, phase-1, phase-2]
status: active
---

# Prospect Theory

**Phase(s):** 1, 2
**Confidence:** 0.9

## Definition

Prospect theory is a descriptive model of decision-making under risk that replaces expected utility theory. Its core claims: (1) people evaluate outcomes as **gains and losses relative to a reference point**, not as final wealth states; (2) the **[[value-function]]** is S-shaped — concave for gains, convex for losses, and steeper for losses (**[[loss-aversion]]**); (3) people transform probabilities through a non-linear **[[decision-weights]]** function that overweights small probabilities and underweights moderate-to-high probabilities.

## Key Findings

- Systematically demolishes expected utility theory through choice problems showing violations of the substitution axiom, the expectation principle, and asset integration ([[summary-1-02-prospect-theory]])
- **[[certainty-effect]]:** Certain outcomes are overweighted relative to merely probable ones
- **[[reflection-effect]]:** Risk aversion for gains reverses to risk seeking for losses
- **[[isolation-effect]]:** People discard shared components, leading to framing-dependent preferences
- **[[loss-aversion]]:** Losses feel roughly 2-2.5x as painful as equivalent gains feel good
- The theory operates in two phases: an **editing phase** (framing, simplification) and an **evaluation phase** (value function × decision weights)

## Mechanisms

Prospect theory is grounded in basic perceptual principles. Just as the perception of brightness depends on changes from adaptation level (not absolute luminance), the perception of value depends on changes from a reference point. The S-shape of the value function mirrors Weber's Law: sensitivity to changes diminishes with distance from the reference point, for both gains and losses.

The decision weight function captures the psychology of probability: the categorical difference between "impossible" and "possible" and between "possible" and "certain" matters more than proportional changes in the middle of the probability range.

## Applications

- **Negotiation:** Loss aversion means concessions feel larger to the giver than the receiver — critical for Phase 5
- **Marketing/pricing:** Framing a price as a discount (avoiding a loss) vs. a surcharge (paying extra) produces different responses to identical economics
- **Insurance:** People overpay for certainty (comprehensive coverage) and reject probabilistic risk reduction
- **Investing:** The disposition effect — investors sell winners too early (locking in gains) and hold losers too long (hoping to avoid realizing a loss)
- **Policy:** Framing outcomes as losses vs. gains changes public support for identical policies

## Cross-References
- **Related concepts:** [[loss-aversion]], [[certainty-effect]], [[reflection-effect]], [[isolation-effect]], [[framing-effects]], [[value-function]], [[decision-weights]], [[reference-dependence]]
- **Key authors:** [[kahneman]], [[tversky]]
- **Builds on:** [[heuristics-and-biases-program]], Allais paradox, Markowitz (1952) on reference points
- **Extended by:** Cumulative Prospect Theory (Tversky & Kahneman, 1992), Thaler's [[mental-accounting]], nudge theory
- **Downstream effects:** [[endowment-effect]], [[escalation-of-commitment]], [[sunk-cost-fallacy]], [[pseudocertainty]], [[preference-reversal]]

## Bazerman & Moore Extensions (Chapters 5-8)

Bazerman and Moore ([[summary-2-08-bazerman-ch5]], [[summary-2-08-bazerman-ch6]], [[summary-2-08-bazerman-ch7]], [[summary-2-08-bazerman-ch8]]) demonstrate prospect theory's reach into managerial decision making:

- **Sequential decision portfolios:** When decisions are made one at a time, prospect theory's risk aversion for gains and risk seeking for losses produces dominated aggregate portfolios. Organizations need integrated risky decision procedures.
- **Evolutionary explanation:** Rayo & Becker (2007) argue that reference-dependent evaluation was adaptive because the subjective utility scale has limited sensitivity. The reference point must readjust to maintain motivation, creating the hedonic treadmill.
- **Escalation of commitment:** Prospect theory's risk seeking in losses explains why decision-makers continue failing investments -- quitting is a sure loss, continuing is a gamble.
- **Mental accounting:** Thaler's (1999) [[mental-accounting]] is a direct extension of prospect theory's value function to how people categorize and evaluate financial transactions.
- **Real-world evidence:** Effects documented in taxi drivers, professional golfers, insurance purchasing, eBay behavior, NBA draft decisions, and even capuchin monkeys.

## Choices, Values, and Frames Extensions (Chs. 1, 3)

The CVF collection ([[summary-2-07-cvf-ch1-choices-values-frames]], [[summary-2-07-cvf-ch3-cumulative-prospect-theory]]) provides critical extensions:

- **Extension to riskless choice:** Ch. 1 demonstrates that the psychophysics of value (S-shaped value function, loss aversion) apply to transactions, trades, and consumer behavior -- not just gambles. The cost-loss distinction and [[mental-accounting]] emerge as core applications.
- **[[cumulative-prospect-theory]] (Ch. 3):** The 1992 revision fixes the two major limitations of original PT: (1) extends to prospects with any number of outcomes, and (2) satisfies stochastic dominance. Uses rank-dependent cumulative weighting. Empirically calibrated: alpha = beta = 0.88, lambda = 2.25, gamma = 0.61, delta = 0.69.
- **The [[fourfold-pattern]]:** CPT's most distinctive empirical prediction -- risk aversion for high-p gains, risk seeking for low-p gains, risk seeking for high-p losses, risk aversion for low-p losses -- confirmed in 22 of 25 individual subjects.
- **Field evidence (Ch. 20):** NYC cab drivers exhibit negative wage elasticity due to daily income targeting -- a powerful real-world demonstration of [[loss-aversion]] and narrow bracketing.

## Camerer's "Prospect Theory in the Wild" (Ch. 16, CVF)

Camerer ([[summary-2-07-cvf-ch16-pt-in-the-wild]]) catalogs **10 real-world phenomena** that are anomalies for expected utility but explained by prospect theory:

| # | Domain | Phenomenon | PT Ingredient |
|---|--------|-----------|---------------|
| 1 | Finance | [[equity-premium-puzzle]] | [[loss-aversion]] |
| 2 | Finance | [[disposition-effect]] | [[reflection-effect]] |
| 3 | Labor | NYC cab drivers' negative wage elasticity | [[loss-aversion]] |
| 4 | Consumer goods | Asymmetric price elasticities | [[loss-aversion]] |
| 5 | Macroeconomics | Consumption insensitive to bad income news | Loss aversion + reflection |
| 6 | Consumer choice | [[status-quo-bias]] / default / [[endowment-effect]] | [[loss-aversion]] |
| 7 | Horse racing | Favorite-longshot bias | Overweight low p(loss) |
| 8 | Horse racing | End-of-day effect | [[reflection-effect]] |
| 9 | Lottery | Lotto demand for large jackpots | Overweight low p(win) |
| 10 | Insurance | Telephone wire repair insurance | Overweight low p(loss) |

All 10 require the assumption of **narrow bracketing** -- people isolating decisions rather than integrating them into broader portfolios. Prospect theory's advantage: three ingredients explain all 10 patterns consistently, while EU requires contradictory ad hoc assumptions.

## Tversky & Kahneman's Formal Analysis (Ch. 12, CVF)

In [[summary-2-07-cvf-ch12-rational-choice-framing]], Tversky and Kahneman demonstrate that prospect theory is the **only** alternative decision model that accommodates observed violations of both dominance and invariance. Four classes of alternative models (nonlinear functionals, expectations quotients, bilinear/nonadditive models, nontransitive/regret models) each fail on at least one category of empirical violation. Prospect theory succeeds because it is purely descriptive and imposes no normative constraints.

## Open Questions
- How are reference points determined? The theory assumes they exist but doesn't fully specify the mechanism.
- How does prospect theory extend to multi-outcome prospects? (Addressed in [[cumulative-prospect-theory]], 1992)
- What is the exact loss-aversion ratio? (Estimates range from ~1.5 to ~2.5; median 2.25 in CPT data; may vary by domain)
