---
title: "Representativeness Heuristic"
type: concept
phase: [1, 2]
authors: ["Amos Tversky", "Daniel Kahneman"]
sources: ["raw/assets/1-01 - Judgment Under Uncertainty - Heuristics and Biases (Paper) - Tversky, Kahneman.pdf", "raw/assets/2-08 - Judgment in Managerial Decision Making - Bazerman, Moore.pdf"]
confidence: 0.6
source_count: 2
created: 2026-04-13
updated: 2026-04-14
supersedes: []
tags: [heuristic, cognitive-bias, judgment, probability, phase-1]
status: active
---

# Representativeness Heuristic

**Phase(s):** 1, 2
**Confidence:** 0.6

## Definition

The representativeness heuristic is a mental shortcut where people judge the probability that A belongs to category B by assessing **how similar A is to the typical member of B** — how "representative" it is. The more A resembles B, the higher the judged probability, regardless of base rates, sample sizes, or statistical considerations.

## Key Findings

- People judge probabilities by similarity, not by Bayesian reasoning ([[summary-1-01-judgment-under-uncertainty]])
- When representativeness information is available, people largely ignore [[base-rate-neglect|base rates]] — even when base rates are explicitly provided
- The heuristic produces at least six documented biases: [[base-rate-neglect]], [[law-of-small-numbers]], [[gamblers-fallacy]], insensitivity to predictability, [[illusion-of-validity]], and failure to recognize [[regression-to-the-mean]]
- The errors are cognitive, not motivational — they persist without stakes and appear in trained statisticians

## Mechanisms

Representativeness works because similarity is a fast, automatic computation that the mind performs effortlessly. Judging "how much does this look like that?" is cognitively cheap compared to computing Bayesian posterior probabilities. The heuristic substitutes an easy question (similarity) for a hard one (probability).

The deeper mechanism: the mind treats the sample as a miniature of the population. If the description "fits" the category, the probability is judged high — even when the category is statistically rare. This is why personality descriptions overwhelm base rates: the description creates a vivid match to a stereotype.

## Applications

- **Hiring/interviewing:** The [[illusion-of-validity]] means interviewers feel confident about candidates who "look the part" even when interview performance has low predictive validity
- **Medical diagnosis:** Symptoms that are "representative" of a disease lead to diagnosis even when the disease is rare (base-rate neglect)
- **Investing:** A company whose recent performance "looks like" a winner gets predicted to continue — even from small samples or unreliable indicators
- **Stereotyping:** Social judgments about individuals based on group resemblance rather than population statistics

## Cross-References
- **Related concepts:** [[availability]], [[anchoring-and-adjustment]], [[base-rate-neglect]], [[law-of-small-numbers]], [[gamblers-fallacy]], [[illusion-of-validity]], [[regression-to-the-mean]]
- **Key authors:** [[tversky]], [[kahneman]]
- **Frameworks that use this:** [[heuristics-and-biases-program]]

## Bazerman & Moore Extensions

Bazerman and Moore ([[summary-2-08-bazerman-ch3]]) add five specific biases emanating from the representativeness heuristic, with rich managerial examples:

- **Insensitivity to base rates:** Lisa's Down syndrome test problem -- a positive result with 86% accuracy and 5% false positive rate given 1/1000 base rate yields only 1.7% actual probability, but most people estimate much higher. Entrepreneurs spend too much time imagining their success and too little considering the base rate of failure (Moore, Oesch, & Zietsma, 2007). Graduate admissions favor students from schools with lenient grading, ignoring the base rate of grade inflation (Moore, Swift, Sharek, & Gino, 2010)
- **Insensitivity to sample size:** "Four out of five dentists" claims are meaningless without knowing total dentists surveyed. The hospital problem extended with explicit managerial framing
- **Misconceptions of chance:** The "hot hand" fallacy -- exhaustive analyses of Philadelphia 76ers and Boston Celtics show no hot hand; only chance patterns and random streaks (Gilovich, Vallone, & Tversky, 1985). Even research psychologists fall victim to the [[law-of-small-numbers]]
- **Regression to the mean:** Baseball batting average correlation is only ~.41 from one year to the next (Texas Rangers data). The flight instructor example shows how regression creates the false belief that punishment works better than reward
- **Conjunction fallacy:** The Linda problem extended with the flood/earthquake conjunction -- people judged a California earthquake causing a flood drowning >1000 as more likely than simply a flood anywhere in North America drowning >1000 (Tversky & Kahneman, 1983)
- The representativeness heuristic can operate unconsciously, producing racial discrimination and other biased social judgments
- Germ theory of disease was slow to be accepted because invisible organisms causing plagues was not "representative"

## Open Questions
- How does representativeness interact with motivation and emotion? (The 1974 paper explicitly excludes motivational factors, but later research may complicate this.)
- Can training in statistical reasoning reduce representativeness-based errors, or does the heuristic operate automatically below conscious awareness? (Bazerman suggests even scientific training may not eliminate its biasing influence)
- How does representativeness interact with the [[availability]] heuristic when they pull in different directions?
