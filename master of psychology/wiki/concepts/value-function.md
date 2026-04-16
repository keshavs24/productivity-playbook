---
title: "Value Function"
type: concept
phase: [1, 2]
authors: ["Daniel Kahneman", "Amos Tversky"]
sources: ["raw/assets/1-02 - Prospect Theory - An Analysis of Decision Under Risk (Paper) - Kahneman, Tversky.pdf", "raw/assets/2-08 - Judgment in Managerial Decision Making - Bazerman, Moore.pdf", "raw/assets/2-07 - Choices, Values, and Frames (Collection) - Kahneman, Tversky.pdf"]
confidence: 0.9
source_count: 3
created: 2026-04-13
updated: 2026-04-14
supersedes: []
tags: [prospect-theory, value, utility, gains-losses, phase-1]
status: active
---

# Value Function

**Phase(s):** 1, 2
**Confidence:** 0.9

## Definition

The value function is the core component of [[prospect-theory]] that maps **changes in wealth or welfare** (relative to a reference point) to subjective value. It replaces the utility function of expected utility theory.

## Three Key Properties

1. **[[reference-dependence]]:** Defined on *deviations* from a reference point, not on final states of wealth. A gain of $500 has the same value whether you're worth $10,000 or $10,000,000.

2. **Diminishing sensitivity (S-shape):**
   - **Concave for gains:** The difference between gaining $100 and $200 feels larger than between $1,100 and $1,200
   - **Convex for losses:** The difference between losing $100 and $200 feels larger than between $1,100 and $1,200
   - This mirrors Weber's Law in perception: sensitivity to changes diminishes with distance from the reference point

3. **Steeper for losses ([[loss-aversion]]):** v'(x) < v'(-x) for all x > 0. The function is steeper below the origin than above it. Losses hurt more than equivalent gains please.

## The Shape

The value function is S-shaped (see Figure 3 in the original paper): concave above the reference point, convex below, with the loss side steeper. Steepest at the reference point itself — people are most sensitive to small changes near their current state.

## Empirical Support

- Fishburn and Kochenberger reviewed value functions from 30 decision makers across five industries: most were concave for gains, convex for losses, with losses steeper in all but one case ([[summary-1-02-prospect-theory]])
- Problems 13 and 13' confirmed concavity for gains and convexity for losses through choice data
- The general aversion to symmetric fair bets confirmed the loss-aversion asymmetry

## Cross-References
- **Parent theory:** [[prospect-theory]]
- **Related concepts:** [[loss-aversion]], [[reference-dependence]], [[decision-weights]], [[reflection-effect]]
- **Key authors:** [[kahneman]], [[tversky]]
- **Precursor:** Markowitz (1952) -- first proposed that utility should be defined on gains/losses rather than final wealth

## Bazerman & Moore Extensions (Chapters 5-6)

Bazerman and Moore ([[summary-2-08-bazerman-ch5]], [[summary-2-08-bazerman-ch6]]) add practical applications of the value function:

- **Hedonic editing rules from [[mental-accounting]]:** The S-shape and steepness asymmetry produce practical hedonic rules: (1) segregate gains (multiple small gains > one large gain, because concavity means early dollars of each gain are most valued); (2) aggregate losses (one large loss < multiple small losses, because convexity means early dollars of each loss hurt most); (3) integrate small losses with larger gains; (4) segregate small gains from larger losses ("silver linings")
- **IRS problem:** Two $100 losses from separate accounts feel worse than one $200 loss because diminishing sensitivity means the first dollars of each loss hurt most
- **Portfolio irrationality:** The value function's concavity for gains (risk aversion) and convexity for losses (risk seeking) produce systematically dominated portfolios when decisions are framed separately (73% chose dominated options in Tversky & Kahneman's 1981 study)
- **Biological constraint:** Rayo and Becker (2007): The limited sensitivity of the subjective utility scale (the S-shape itself) is a biological constraint that necessitates reference point readjustment, creating the hedonic treadmill
