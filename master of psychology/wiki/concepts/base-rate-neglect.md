---
title: "Base-Rate Neglect"
type: concept
phase: [1, 2]
authors: ["Amos Tversky", "Daniel Kahneman"]
sources: ["raw/assets/1-01 - Judgment Under Uncertainty - Heuristics and Biases (Paper) - Tversky, Kahneman.pdf", "raw/assets/2-09 - Cognitive Psychology and Its Implications - Anderson.pdf", "[[2-06 - Judgment Under Uncertainty - Heuristics and Biases (Collection) - Kahneman, Slovic, Tversky]]"]
confidence: 0.8
source_count: 3
created: 2026-04-13
updated: 2026-04-14
supersedes: []
tags: [cognitive-bias, representativeness, probability, bayes, phase-1]
status: active
---

# Base-Rate Neglect

**Phase(s):** 1, 2
**Confidence:** 0.8

## Definition

Base-rate neglect is the tendency to **ignore or underweight prior probabilities** (how common something is in the population) when individuating information (a description, a story, a specific case) is available. People judge probability by how well the case matches the category, not by how common the category is.

## Key Findings

- The "Steve" experiment: a description of a shy, tidy person was judged likely to be a librarian regardless of whether subjects were told the base rate of librarians vs. farmers in the population ([[summary-1-01-judgment-under-uncertainty]])
- When no individuating information was provided, subjects correctly used base rates. But as soon as any descriptive information was given — even worthless information — base rates were abandoned.
- The effect holds even when base rates are explicitly stated and recently provided.
- From the standpoint of formal probability (Bayes' theorem), base rates should have enormous influence on posterior probability. Subjects are "not Bayesian at all."

## Mechanisms

The [[representativeness]] heuristic substitutes "how similar is this description to the category prototype?" for the harder question "what is the probability this person belongs to this category given the description AND the base rates?" Similarity is computed automatically and feels compelling; base rates are abstract and statistical and feel inert.

## Applications

- **Medical screening:** A positive test for a rare disease is more likely a false positive than a true positive — but doctors and patients both neglect the base rate of the disease
- **Criminal justice:** Eyewitness descriptions that "fit" a suspect lead to conviction even when the base rate of innocent matches is high
- **Hiring:** Compelling interviews override statistical evidence about job category success rates
- **Sales/persuasion:** A vivid testimonial overwhelms actuarial data

## Anderson's Bayesian Framework (Ch.11)

Anderson ([[summary-2-09-anderson-ch11]]) provides the full mathematical formalization using **Bayes's theorem** as the prescriptive (normative) model:

- **Bayes's equation**: Prob(H|E) = [Prob(E|H) x Prob(H)] / [Prob(E|H) x Prob(H) + Prob(E|~H) x Prob(~H)]
- **Burglary example**: Door ajar, prior P(burglary) = .001, P(ajar|burglary) = .8, P(ajar|no burglary) = .01 -- posterior = only .074 despite strong evidence, because the base rate is so low
- **Cancer diagnostic example**: With base rate 1/10,000, test sensitivity 95%, false positive rate 5%, actual probability of cancer given positive test = .0019 (less than 1 in 500) -- yet most people estimate ~95%. This is base-rate neglect with potentially life-altering consequences.
- **Frequency tree** visualization (Hoffrage, Krauss, Martignon, & Gigerenzer, 2015): representing Bayesian reasoning as natural frequencies (80 out of 1,089 ajar-door houses were burgled) makes the base-rate contribution more intuitive
- **Tension with conservatism**: Anderson notes the paradox that [[bayesian-conservatism]] (Edwards, 1968) finds the opposite bias -- people under-weight evidence. This may reflect different task structures: conservatism appears with incremental evidence, base-rate neglect with vivid one-shot descriptions.

## Tversky & Kahneman: Causal vs. Incidental Base Rates (Ch. 10)

Tversky and Kahneman ([[summary-2-06-hb-ch10-evidential-base-rates]]) introduce a critical refinement: not all base rates are treated equally. The key distinction is between [[causal-vs-incidental-base-rates]]:

- **Causal base rates** suggest a causal factor (e.g., "75% of students failed the exam" implies the exam was difficult). These are utilized in judgment.
- **Incidental base rates** are statistical artifacts of sampling (e.g., "the interviewer selected mostly failing students"). These are largely ignored.
- **The cab problem:** When 85% of cabs in the city are Green (incidental), subjects ignore the base rate (median = .80, matching witness reliability). When 85% of *accidents* involve Green cabs (causal, implying reckless drivers), the base rate is integrated (median = .60). Correct answer by Bayes' rule: .41 in both cases.
- **Harvard Medical School:** 60 medical students and staff asked about a disease with 1/1000 prevalence and 5% false positive rate. Almost half answered 95%; only 11 gave the correct answer of ~2%.
- Base-rate neglect is broader than the [[representativeness]] heuristic: it occurs in judgments that cannot be interpreted in terms of representativeness (Hammerton, 1973).
- **Procedural variables:** Within-subjects designs produce larger base-rate effects than between-subjects designs; repeated judgments with feedback also increase base-rate utilization.
- **Connection to attribution:** The failure to use consensus information in attribution (Nisbett & Borgida, 1975; [[summary-2-06-hb-ch9-attribution-shortcomings]]) is formally equivalent to incidental base-rate neglect. Whether base rates are used depends on whether they receive a causal (situational) interpretation.

## Cross-References
- **Parent heuristic:** [[representativeness]]
- **Related concepts:** [[law-of-small-numbers]], [[illusion-of-validity]], [[bayesian-conservatism]], [[causal-vs-incidental-base-rates]], [[fundamental-attribution-error]], [[abstract-vs-concrete-information]]
- **Key authors:** [[tversky]], [[kahneman]], [[anderson-john-r]]
- **Source summaries:** [[summary-1-01-judgment-under-uncertainty]], [[summary-2-06-hb-ch10-evidential-base-rates]]
