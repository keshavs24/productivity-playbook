---
title: "Judgment Under Uncertainty: Heuristics and Biases — Summary"
type: summary
phase: [1]
authors: ["Amos Tversky", "Daniel Kahneman"]
sources: ["raw/assets/1-01 - Judgment Under Uncertainty - Heuristics and Biases (Paper) - Tversky, Kahneman.pdf"]
confidence: 0.9
source_count: 1
created: 2026-04-13
updated: 2026-04-13
supersedes: []
tags: [heuristics, biases, cognitive-psychology, judgment, decision-making, phase-1]
status: active
---

# Judgment Under Uncertainty: Heuristics and Biases — Summary

**Author(s):** [[tversky|Amos Tversky]] and [[kahneman|Daniel Kahneman]]
**Type:** Seminal research paper
**Published:** *Science*, Vol. 185, No. 4157, September 27, 1974, pp. 1124–1131
**Phase:** 1 — Cognitive Foundations
**Date ingested:** 2026-04-13

## Key Takeaways

1. People rely on a small number of **heuristic principles** to reduce complex probability judgments to simpler operations. These are generally useful but lead to **systematic and predictable errors**.
2. Three heuristics are identified: **[[representativeness]]**, **[[availability]]**, and **[[anchoring-and-adjustment]]**.
3. These biases are not attributable to motivational factors (wishful thinking, payoffs/penalties) — they are **cognitive**, found even in experienced researchers and statisticians.
4. Subjective probabilities systematically deviate from normative probability theory, and this has implications for any domain relying on human judgment under uncertainty.

## Detailed Notes

### The Central Thesis

Many decisions depend on beliefs about the likelihood of uncertain events. People assess these probabilities not through formal calculation but through heuristics — mental shortcuts. These heuristics are "quite useful, but sometimes they lead to severe and systematic errors." The biases are not random noise; they are predictable and directional.

### Heuristic 1: Representativeness

People assess the probability that object A belongs to class B (or that event A originates from process B) by evaluating **how much A resembles B** — how "representative" it is.

**Biases produced by representativeness:**

- **Insensitivity to prior probabilities (base rates).** When given a personality description of "Steve" (shy, helpful, meek, tidy, need for order), subjects judged the probability he was a librarian vs. farmer vs. pilot etc. based entirely on how much he resembled the stereotype — ignoring that there are far more farmers than librarians. Prior probabilities should matter enormously but were effectively discarded. Even when base rates were explicitly provided, subjects largely ignored them unless no other information was available.

- **Insensitivity to sample size.** Subjects failed to appreciate that small samples are more variable than large ones. When told a hospital has ~45 births/day vs. ~15 births/day and asked which would more often record >60% boys, most said "about the same." The correct answer is the smaller hospital, because small samples deviate more from the population mean. The "law of large numbers" was not intuitively applied.

- **Misconceptions of chance.** People expect random sequences to "look random" even in short runs. The sequence H-T-H-T-T-H is judged more likely than H-H-H-T-T-T (which looks too ordered) or H-H-H-H-T-H (which doesn't look fair). This is the **[[gamblers-fallacy]]** — expecting short sequences to be self-correcting. Tversky and Kahneman call this the "law of small numbers": the belief that small samples should mirror the population.

- **Insensitivity to predictability.** When given a favorable description of a company, subjects predicted high profits regardless of whether the description was known to be reliable. The favorableness of the input dominates the prediction; its reliability is neglected. Predictions should regress toward the mean when predictability is low, but people make extreme predictions even from weak evidence.

- **The illusion of validity.** People express high confidence in predictions based on input that is "representative" even when they know the input has low validity. Redundancy among inputs *increases* subjective confidence (the pattern seems more consistent) while actually *decreasing* accuracy (correlated inputs provide less independent information). Experienced clinicians, interviewers, and judges all show this pattern — confident predictions from weak data.

- **Misconceptions of regression.** People fail to recognize regression to the mean. When extreme performance is followed by average performance, people invent causal explanations (the instructor who praised good landings and then saw worse ones concluded praise was harmful; the one who criticized bad landings and saw improvement concluded criticism was effective). The phenomenon of regression remains "elusive" because it is incompatible with the belief that the predicted outcome should be maximally representative of the input.

### Heuristic 2: Availability

People assess the frequency or probability of an event by **how easily instances come to mind** — how "available" they are in memory.

**Biases produced by availability:**

- **Biases due to retrievability of instances.** If instances of a class are easily retrieved, that class is judged as more frequent. Familiarity, salience, and recency all affect retrieval. Example: subjects judged whether a list had more men or women — the list with famous names (of one gender) was judged to have more of that gender, regardless of actual count. The fame made those names more retrievable.

- **Biases due to effectiveness of a search set.** The cognitive structure of the search matters. Example: people judge words beginning with "r" as more common than words with "r" in the third position — because it's easier to search memory by first letter. In reality, "r" in third position is more common. The search strategy creates the bias.

- **Biases of imaginability.** When people must assess likelihood by mentally constructing scenarios, the ease of construction dominates. Example: how many committees of 2 can be formed from 10 people vs. committees of 8? People estimate far more committees of 2, because small groups are easier to imagine — but the correct answers are identical (both = 45).

- **Illusory correlation.** When two events are "associatively connected" (e.g., suspiciousness and peculiar eye drawings in diagnostic projective tests), people overestimate how often they co-occur. Chapman and Chapman showed that both naive subjects and experienced clinicians "rediscovered" correlations that had no basis in data, purely because the pairing seemed natural. Even when shown data where the correlation was actually *negative*, the illusory correlation persisted.

### Heuristic 3: Adjustment and Anchoring

People make estimates by **starting from an initial value and adjusting** — but adjustments are typically **insufficient**, so the final answer is biased toward the anchor.

**Biases produced by anchoring:**

- **Insufficient adjustment.** Subjects who watched a random wheel of fortune spin to 10 or 65, then estimated the percentage of African countries in the UN, gave median estimates of 25 and 45 respectively — massively different answers anchored by an obviously random number. Even with incentives for accuracy, anchoring persisted.

- **Biases in evaluation of conjunctive and disjunctive events.** People overestimate conjunctive probabilities (the probability that ALL of a series of likely events occur) and underestimate disjunctive probabilities (the probability that AT LEAST ONE of a series of unlikely events occurs). Example: subjects preferred betting on 7 successive successes at 90% each (conjunctive — actual probability 48%) over a single event at 50%, and preferred a single event at 50% over at least one success in 7 tries at 10% each (disjunctive — actual probability 52%). This has practical consequences: project planning is conjunctive (everything must go right), leading to overoptimism; risk assessment is disjunctive (any component can fail), leading to underestimation of risk.

- **Anchoring in assessment of subjective probability distributions.** When asked to set confidence intervals (e.g., the 1st and 99th percentile for the Dow-Jones average), people set ranges far too narrow. The true values fell outside stated 98% confidence intervals roughly 30% of the time, not 2%. Two procedures were tested — setting extremes first vs. setting a best estimate first — and both showed severe overconfidence, though the latter was somewhat worse.

### The Nature of These Biases

The paper emphasizes several critical points about the biases:

1. **Not motivational.** These are cognitive errors, not wishful thinking. They appear in problems with no stakes and no emotional content.
2. **Resistant to expertise.** Experienced researchers, statisticians, and trained professionals show the same biases. Even people with "extensive training in statistics" have intuitive judgments "liable to similar fallacies in more intricate and less transparent problems."
3. **Systematic, not random.** The errors are predictable in direction and magnitude, which means they can be studied, anticipated, and potentially corrected.
4. **Practically consequential.** The paper's closing argues that understanding these heuristics "could improve judgments and decisions in situations of uncertainty."

## New Entities Introduced
- [[tversky]] — Amos Tversky, cognitive psychologist, Hebrew University / Stanford
- [[kahneman]] — Daniel Kahneman, cognitive psychologist, Hebrew University / Princeton

## New Concepts Introduced
- [[representativeness]] — Heuristic: judging probability by similarity/resemblance
- [[availability]] — Heuristic: judging frequency/probability by ease of recall
- [[anchoring-and-adjustment]] — Heuristic: estimating by adjusting from an initial value
- [[base-rate-neglect]] — Ignoring prior probabilities when representativeness information is present
- [[law-of-small-numbers]] — Expecting small samples to mirror population properties
- [[gamblers-fallacy]] — Expecting random sequences to be self-correcting
- [[illusion-of-validity]] — Unwarranted confidence in predictions from representative but low-validity inputs
- [[regression-to-the-mean]] — Extreme values tend to be followed by less extreme ones; people fail to recognize this
- [[illusory-correlation]] — Overestimating co-occurrence of associatively linked events
- [[overconfidence-in-calibration]] — Setting confidence intervals far too narrow

## Contradictions or Tensions
- None with existing wiki content (this is the first source ingested).
- Internal tension worth noting: the paper claims these biases are "not attributable to motivational effects" but later research (including by Kahneman himself) explores how motivation and emotion *do* interact with heuristic processing. This will likely be revisited in later Phase 1 and Phase 2 sources.

## Quotes Worth Keeping

> "People rely on a limited number of heuristic principles which reduce the complex tasks of assessing probabilities and predicting values to simpler judgmental operations. In general, these heuristics are quite useful, but sometimes they lead to severe and systematic errors." — Tversky & Kahneman, p. 1124

> "The subjects' willingness to deduce the likelihood of a particular event from prior events was unrelated to their willingness to use the same prior events to generate probabilistic estimates." — paraphrased from base-rate neglect section

> "The notion that sampling variance decreases in proportion to sample size is apparently not part of people's repertoire of intuitions." — p. 1125

> "The production of a compelling scenario is likely to constrain future thinking. There is much evidence showing that, once an uncertain situation has been perceived or interpreted in a particular fashion, it is quite difficult to view it in any other way." — p. 1127 (on availability and imaginability)

> "In his evaluation of evidence, man is apparently not a conservative Bayesian: he is not Bayesian at all." — p. 1124 (on representativeness and base-rate neglect)

> "Subjective probabilities... are not 'conservative' as a chance process model would predict; they are nearly always more extreme." — p. 1129 (on anchoring and overconfidence)
