---
title: "Rational Choice and the Framing of Decisions — Summary"
type: summary
phase: [2]
authors: [Amos Tversky, Daniel Kahneman]
sources: ["[[2-07 - Choices, Values, and Frames (Collection) - Kahneman, Tversky]]"]
confidence: 0.7
source_count: 1
created: 2026-04-14
updated: 2026-04-14
tags: [framing, rational-choice, invariance, dominance, prospect-theory, decision-making, expected-utility, phase-2]
status: active
---

# Rational Choice and the Framing of Decisions — Summary

**Author(s):** Amos Tversky and Daniel Kahneman
**Type:** Book chapter (Ch. 12 in *Choices, Values, and Frames*)
**Phase:** 2
**Date ingested:** 2026-04-14
**Originally published:** *Journal of Business*, 59:4, S251-S278, 1986

## Key Takeaways

1. No theory of choice can be both normatively adequate and descriptively accurate -- the normative requirements of rational choice (especially [[invariance-violation|invariance]] and [[dominance-violation|dominance]]) are systematically violated by actual human decision-makers.
2. The four foundational axioms of expected utility theory -- cancellation, transitivity, dominance, and invariance -- can be ordered by normative appeal, and the most basic ones (invariance and dominance) are the ones most frequently violated through [[framing-effects]].
3. [[prospect-theory]] is unique among alternative models because it is the only one that can accommodate violations of both dominance and invariance, since it is purely descriptive and makes no normative claims.
4. The axioms of rational choice are generally satisfied in "transparent" problems but violated in "nontransparent" ones -- the role of framing is to determine transparency.
5. The assumption of rationality is protected by "bolstering assumptions" (learning, incentives, market correction) that have surprisingly weak empirical support.

## Detailed Notes

### I. A Hierarchy of Normative Rules

Tversky and Kahneman identify four substantive assumptions underlying expected utility theory and order them by normative appeal:

**Cancellation** (weakest normative appeal): The elimination of any state of the world that yields the same outcome regardless of one's choice. This is the "sure-thing principle" of Savage (1954), the substitution axiom of von Neumann and Morgenstern (1944), and the independence condition of Luce and Krantz (1971). Challenged by Allais (1953) and Ellsberg (1961). Many theorists have rejected it.

**Transitivity**: If A is preferred to B and B to C, then A must be preferred to C. Necessary and sufficient for ordinal utility representation. Likely to hold when options are evaluated separately but may fail when consequences depend on the alternative to which an option is compared (as in regret theory). Cyclic preferences can support a "money pump."

**Dominance** (very strong normative appeal): If option A is better in one state and at least as good in all others, A should be chosen. Stochastic dominance: A is preferred to B if A's cumulative distribution is to the right of B's. "The cornerstone of the normative theory of choice."

**Invariance / [[extensionality]]** (strongest normative appeal): Different representations of the same choice problem should yield the same preference. Arrow (1982) called this "extensionality." So basic it is usually tacitly assumed in the characterization of options rather than explicitly stated as a testable axiom. A related concept, consequentialism, was discussed by Hammond (1985).

The four principles can be ordered by normative appeal: invariance and dominance seem essential; transitivity could be questioned; cancellation has been rejected by many authors. Most alternative models (Hansson 1975, Allais 1979, Machina 1982, Quiggin 1982, etc.) retain transitivity, dominance, and invariance while abandoning cancellation.

### II. Violations of Dominance

**Problem 1 (transparent dominance):** A two-stage game. Stage 1: 75% chance the game ends with nothing, 25% chance to advance to stage 2. Stage 2: Choose between (A) sure win of $30, or (B) 80% chance of winning $45. Before knowing stage 1 outcome, choose A or B. Result: 74% chose A (the sure thing in the conditional frame).

**Problem 2 (nontransparent dominance violation):** Same expected values reformulated as single-stage: (C) 25% chance of winning $30, or (D) 20% chance of winning $45. Now 58% preferred D. But Problems 1 and 2 are formally identical -- the actual probabilities are 25% for the safe option and 20% for the risky one in both cases. The sequential framing of Problem 1 creates [[pseudocertainty]]: the $30 feels "certain" once you reach stage 2, inducing the [[certainty-effect]]. In Problem 2 with no sequential framing, pseudocertainty vanishes.

The preference reversal is a [[dominance-violation]]: framing obscures the dominance relation that is transparent in the sequential formulation.

**Problem 6 (medical decisions with 72 physicians):** Tumor treatment decisions for a 40-year-old male:
- Case 1: Treatment A (20% death, 80% normal life, 30yr longevity) vs. Treatment B (certainty of normal life, 18yr longevity). 65% chose B -- risk averse, [[certainty-effect]].
- Case 2: Treatment C (80% death, 20% normal life, 30yr longevity) vs. Treatment D (75% death, 25% normal life, 18yr longevity). 68% chose C -- risk seeking, no certainty available.
- Case 3: Conditional framing -- 25% chance tumor is treatable; if treatable, same choices. 68% chose F (pseudocertain option).

64% of physicians who chose B in Case 1 switched to C in Case 2 -- violating expected utility. 56% who chose C in Case 2 selected F in Case 3 -- the [[pseudocertainty]] effect. Even trained medical professionals are susceptible to framing.

### III. Violations of Invariance

**Concurrent decision problem:** Two simultaneous decisions:
- Decision (i): A: sure gain of $240, vs. B: 25% chance of $1000 / 75% chance of $0.
- Decision (ii): C: sure loss of $750, vs. D: 75% chance of losing $1000 / 25% chance of losing nothing.

73% chose A and D. But A+D yields: 25% chance of winning $240 / 75% chance of losing $760. The combination B+C yields: 25% chance of winning $250 / 75% chance of losing $750. B+C stochastically dominates A+D, yet only 3% chose it. Isolated evaluation per [[prospect-theory]] predictions (risk aversion for gains, risk seeking for losses) produces a dominated portfolio.

### IV. Discussion and Alternative Models

**Table 12.1** summarizes violations and which models handle them:
| Violation | Models That Handle It |
|---|---|
| Cancellation (Allais/certainty effects) | All alternative models |
| Transitivity | Bivariate (nontransitive) models only |
| Dominance | [[prospect-theory]] only |
| Invariance / [[framing-effects]] | [[prospect-theory]] only |

Four classes of alternatives: (i) nonlinear functionals (Allais, Machina 1982), (ii) expectations quotient model (Chew & MacCrimmon 1979), (iii) bilinear models with nonadditive probabilities (Kahneman & Tversky 1979, Quiggin 1982, Schmeidler 1984, Segal 1984, Yaari 1984), (iv) nontransitive models / regret theory (Fishburn 1982, Bell 1982, Loomes & Sugden 1982).

**Prospect theory's unique position:** Purely descriptive, no normative claims. Machina (1982) criticized PT as "unacceptable" because it implies dominance violations -- but those violations are empirically observed, making the objection invalid. PT explains preferences whether or not they can be rationalized.

### V. Bolstering Assumptions Dismantled

Three common defenses of the rationality assumption:

1. **"Incentives will correct errors":** Errors persist with significant monetary payoffs. Elementary probabilistic reasoning blunders (Grether 1980), major choice inconsistencies (Grether & Plott 1979; Slovic & Lichtenstein 1983), and dominance violations are hardly reduced by incentives. Real-world high-stakes decisions also show errors -- the high failure rate of small businesses contradicts rational expectations. "Incentives do not operate by magic: they work by focusing attention and by prolonging deliberation." They prevent errors from insufficient attention but not from misperception or faulty intuition. Like visual illusions, decision illusions resist mere motivation.

2. **"Learning will correct errors":** Effective learning requires accurate, immediate feedback. Conditions often absent for important decisions: (i) outcomes are delayed, (ii) variability degrades feedback, (iii) no counterfactual information, (iv) most important decisions are unique. Organizational learning conditions are "hardly better."

3. **"Markets will correct individual irrationality":** Fails in important cases. Racetrack example: win market is efficient but place-and-show market is not -- bettors underestimate favorites' probability of finishing second or third (Hausch, Ziemba & Rubenstein 1981). Haltiwanger and Waldman (1985) and Russell and Thaler (1985) analyzed situations resistant to market correction. Akerlof and Yellen (1985) showed near-rationality theory: some errors have minimal individual impact but large aggregate economic effects.

### VI. The Core Thesis

"The main theme of this article has been that the normative and the descriptive analyses of choice should be viewed as separate enterprises." Where bolstering assumptions fail, trace the implications of descriptive findings (loss aversion, pseudocertainty, money illusion) for public policy, strategic decision-making, and macroeconomics.

## New Concepts Introduced

- [[invariance-violation]] -- systematic failure of decision-makers to maintain consistent preferences across different descriptions of the same problem
- [[dominance-violation]] -- choosing objectively inferior options when problem framing obscures the dominance relation
- [[extensionality]] -- Arrow's (1982) term for invariance; the requirement that different representations of the same random variables be treated identically

## Cross-References

- [[prospect-theory]] -- the only model accommodating all four types of empirical violations
- [[framing-effects]] -- the central mechanism producing invariance violations
- [[loss-aversion]] -- drives risk-seeking in the loss domain
- [[certainty-effect]] -- overweighting of certain outcomes drives pseudocertainty
- [[reflection-effect]] -- risk aversion for gains, risk seeking for losses
- [[pseudocertainty]] -- illusory certainty from conditional framing
- [[mental-accounting]] -- isolated evaluation produces dominated aggregate outcomes
- [[bounded-rationality]] -- explicitly linked to Simon's framework
- [[endowment-effect]] -- related to loss aversion in riskless choice
- [[summary-2-07-cvf-ch1-choices-values-frames]]
- [[summary-2-07-cvf-ch3-cumulative-prospect-theory]]
- [[kahneman]], [[tversky]]

## Quotes Worth Keeping

> "The thesis of the present article is that, in spite of these a priori arguments, the logic of choice does not provide an adequate foundation for a descriptive theory of decision making." -- Tversky & Kahneman, Ch. 12

> "The dream of constructing a theory that is acceptable both descriptively and normatively appears unrealizable." -- Tversky & Kahneman, Ch. 12

> "Perhaps the major finding of the present article is that the axioms of rational choice are generally satisfied in transparent situations and often violated in nontransparent ones." -- Tversky & Kahneman, Ch. 12

> "Incentives do not operate by magic: they work by focusing attention and by prolonging deliberation. Consequently, they are more likely to prevent errors that arise from insufficient attention and effort than errors that arise from misperception or faulty intuition." -- Tversky & Kahneman, Ch. 12
