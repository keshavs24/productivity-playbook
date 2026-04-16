---
title: "Evidential Impact of Base Rates — Summary"
type: summary
phase: [2]
authors: [Amos Tversky, Daniel Kahneman]
sources: ["[[2-06 - Judgment Under Uncertainty - Heuristics and Biases (Collection) - Kahneman, Slovic, Tversky]]"]
confidence: 0.7
source_count: 1
created: 2026-04-14
updated: 2026-04-14
tags: [base-rate, causal-reasoning, representativeness, bayesian-reasoning, attribution, phase-2]
status: active
---

# Evidential Impact of Base Rates — Summary

**Author(s):** Amos Tversky and Daniel Kahneman
**Type:** Book chapter (Ch. 10 in *Judgment Under Uncertainty: Heuristics and Biases*, 1982)
**Phase:** 2
**Date ingested:** 2026-04-14

## Key Takeaways

1. **Not all base rates are created equal:** The critical distinction is between *causal* base rates (which suggest a causal factor explaining why any particular instance is more likely to yield one outcome) and *incidental* base rates (which are mere statistical artifacts of sampling and carry no causal implication). Causal base rates are utilized; incidental base rates are largely ignored.
2. **The cab problem** is a landmark demonstration: when base rates are incidental (85% Green cabs, 15% Blue), subjects ignore them entirely (median answer .80, matching witness reliability). When the same base rate is reframed as causal (85% of accidents involve Green cabs), it is integrated with witness testimony (median answer .60).
3. **The Harvard Medical School problem** illustrates extreme base-rate neglect: given a disease with 1/1000 prevalence and a test with 5% false positive rate, the correct answer to "what is the probability a positive result is a true positive" is about 2%, yet the most common answer from medical professionals was 95%.
4. **Base-rate neglect connects attribution research to judgment research:** The failure to use consensus information in attribution (Nisbett & Borgida, 1975) is formally equivalent to base-rate neglect in prediction, bridging social psychology and cognitive psychology.
5. **Procedural variables matter:** Within-subjects designs produce larger base-rate effects than between-subjects designs; repeated judgments with outcome feedback also increase base-rate use.

## Detailed Notes

### Introduction: The Base-Rate Problem

Tversky and Kahneman frame the chapter around the general problem: people must assess the probability of a target event on the basis of (a) base-rate frequency of the target outcome in a relevant population and (b) specific case evidence. The core finding: predictions by [[representativeness]] or similarity are generally insensitive to base-rate frequencies.

**The Harvard Medical School demonstration (Casscells, Schoenberger, & Grayboys, 1978):**
- 60 students and staff at Harvard Medical School were given: "If a test to detect a disease whose prevalence is 1/1000 has a false positive rate of 5%, what is the chance a positive result is a true positive?"
- The most common answer (almost half of participants): 95%
- The average answer: 56%
- Only 11 participants gave the correct answer of approximately 2%
- This demonstrates that even highly educated respondents fail to appreciate the significance of outcome base rate in relatively simple formal problems.

**The phenomenon is more general than representativeness:** Base-rate neglect occurs in judgments that cannot be readily interpreted in terms of representativeness (Hammerton, 1973), showing it is not merely a byproduct of the representativeness heuristic.

### Procedural Variables

Two key procedural variables affect base-rate utilization:

1. **Single-case vs. repeated judgments:** People tend to match the distribution of the criterion when making multiple predictions (probability learning), especially with outcome feedback. This produces larger base-rate effects in repeated-judgment experiments than in single-case experiments (Bar-Hillel & Fischhoff, 1981; Manis et al., 1980).

2. **Within-subjects vs. between-subjects design:** Base-rate data have more impact when base rates vary within problems presented to each subject than when different base rates are presented to different subjects (Fischhoff, Slovic, & Lichtenstein, 1979). The within-subjects procedure induces a general tendency to assign higher weight to the varied attribute, even when normatively irrelevant (Fischhoff & Bar-Hillel, 1980).

### Causal and Incidental Base Rates

This is the chapter's central theoretical contribution. A base rate is called **causal** if it suggests the existence of a causal factor that explains why any particular instance is more likely to yield one outcome. A base rate is called **incidental** if it does not lead to such an inference.

**Ajzen (1977) exam study:**
- **Causal version:** "Two years ago, a final exam was given in a course at Yale University. About 75% of the students failed (passed) the exam." This implies the exam was exceptionally difficult (or easy), a cause that affects every individual student.
- **Incidental version:** An educational psychologist selected students to interview, primarily concerned with reactions to failure, so about 75% of students in his sample had failed. This carries no implication about exam difficulty.
- Results: The causal base rate was much more potent. For causal base rates, judged probability of success was .34 higher when base rate of success was high vs. low. For incidental base rates, the corresponding difference was only .12.

**Ajzen (1977) course preference study:**
- Causal base rate: proportions of students enrolled in two courses (.70 and .30) -- implies differential attractiveness.
- Incidental base rate: a professor interviewed 70 students from one course and 30 from another for comparison purposes -- carries no information about popularity.
- The incidental base rate had no significant effect; the causal base rate had a strong effect (mean judged probability .65 vs. .36 for popular vs. unpopular course).

### The Cab Problem: A Landmark Demonstration

**Original version (incidental base rate):**
- A cab was involved in a hit-and-run accident at night. Two cab companies operate in the city: Green (85% of cabs) and Blue (15%).
- A witness identified the cab as Blue. Court tests show the witness correctly identifies cab color 80% of the time.
- By Bayes' rule: P(Blue|Witness says Blue) = (.15 x .80) / [(.15 x .80) + (.85 x .20)] = .12/.29 = .41
- The median and modal answer from subjects: .80 -- coinciding with the witness's reliability and apparently unaffected by the relative frequency of Blue and Green cabs.
- When the witness identification was omitted, almost all subjects gave the base rate (.15) as their answer -- so the base rate *was* used in the absence of case data.
- When "a witness identified the cab as Blue" was replaced by "a witness identified the color of the cab," the median response was .15 -- confirming the base rate was used to predict the target outcome and improperly used to predict the witness's report.

**Causal version:**
- Item (a) replaced with: "Although the two companies are roughly equal in size, 85% of cab accidents in the city involve Green cabs and 15% involve Blue cabs."
- The posterior probability is mathematically the same (.41), but the base rate is now causal: it implies Green cab drivers are more reckless or less competent.
- Median answer: .60 -- lying between the witness reliability (.80) and the correct answer (.41). The base rate is no longer ignored.

**Key insight:** The correlation between cab color and involvement in accidents is 0 for the incidental base rate and .7 for the causal version, even though the posterior probability is identical. This statistical fact reflects the psychological difference between the two base rates.

### Other Evidential Variables

**Specificity and causality interact:**
- **Bar-Hillel (1980a):** Replaced witness testimony with a report that the hit-and-run cab was equipped with an intercom, installed in 80% of Green cabs and 20% of Blue cabs. The incidental base rate was *not* discarded (median response .48).
- Bar-Hillel suggested the intercom evidence did not replace the base rate because it is less specific than an identification by a witness. Base-rate data are combined with other evidence either when the base rate has a causal interpretation or when the case evidence is no more specific than the base rate.

**Non-diagnostic evidence and base rates:**
- When specific but non-diagnostic evidence is presented (e.g., a description equally similar to an engineer and a lawyer), findings are not entirely consistent: Kahneman & Tversky (1973) found base-rate neglect; Ginosar & Trope (1980) found exclusive reliance on base rate. Most studies found intermediate results where the base rate was diluted but not discarded by non-diagnostic case data (Manis et al., 1980; Wells & Harvey, 1977).

### Internal versus External Attributions

Tversky and Kahneman connect the base-rate literature to attribution theory:

- A class of base-rate problems arises when evidence refers to internal-dispositional factors and the base rate refers to external-situational factors. A student's success on an exam is determined jointly by the student's talent (internal) and exam difficulty (external). The base rate of success (e.g., 75% of students failed) naturally expresses the external/situational factor.
- The question of whether situational or dispositional factors receive more weight in social attribution can be reformulated in terms of the weight assigned to corresponding base rates.

**Nisbett & Borgida (1975):**
- Showed that knowledge of the low frequency of helping behavior in the Darley-Latane (1968) study did not affect subjects' predictions of an individual participant's behavior observed in a brief filmed interview.
- This was the first explicit link between base-rate neglect in judgment research and the relative weight of situational factors in attribution.
- The study provoked controversy (Borgida, 1978; Wells & Harvey, 1977, 1978) and stimulated extensive research on the role of consensus information in prediction of behavior.

**Comparison of Nisbett-Borgida and Ajzen studies:**
- In Ajzen's (1977) causal base-rate condition, where 75% of students failed an exam, subjects inferred the exam was difficult -- a situational/external interpretation.
- In Nisbett and Borgida's helping study, the base rate of not helping was instead attributed to the participants being "mostly unfeeling brutes" (Wells & Harvey, 1977) -- a dispositional interpretation.
- The formal structure of the two problems is identical, but the base rate was utilized in one and neglected in the other. The difference: in the exam case, a surprising base rate was given a situational interpretation; in the helping case, it was given a dispositional interpretation, blocking the causal inference that would have made the base rate useful.

**Key conclusion:** Whether an extreme base rate is attributed to an accident of sampling or to situational factors depends on the context. It is more plausible that exam results reflect exam difficulty than that helping-study participants were exceptionally unhelpful. The use or neglect of consensus information in individual prediction depends critically on the interpretation of that information.

**Restoring base-rate effects:**
- Several studies that stressed the representativeness of the sample (Hansen & Donoghue, 1977; Hansen & Lowe, 1976; Wells & Harvey, 1978) restored a base-rate effect by blocking the dispositional inference about unusual characteristics of sample members.
- Kassin (1979a) enhanced the impact of base-rate data by informing subjects that the sample was large and therefore reliable.

## New Entities Introduced
- None (Tversky and Kahneman already have entity pages)

## New Concepts Introduced
- [[causal-vs-incidental-base-rates]] -- the central distinction of the chapter

## Concepts Updated
- [[base-rate-neglect]] -- significantly expanded with the causal/incidental distinction, cab problem, Harvard Medical School problem
- [[representativeness]] -- connection to base-rate neglect refined (base-rate neglect is broader than representativeness)

## Contradictions or Tensions
- Base-rate neglect is not absolute: causal base rates are used, incidental base rates are ignored. This complicates the claim that "people ignore base rates" -- the neglect is selective and depends on whether the base rate has a causal interpretation.
- Findings on non-diagnostic evidence are inconsistent: Kahneman & Tversky (1973) found neglect; Ginosar & Trope (1980) found reliance on base rate. Context and framing appear to moderate the effect.
- The chapter bridges social psychology (attribution) and cognitive psychology (judgment under uncertainty), showing that base-rate neglect in prediction is formally equivalent to the neglect of consensus/situational information in attribution.

## Quotes Worth Keeping

> "The most common response, given by almost half of the participants, was 95%. The average answer was 56%, and only 11 participants gave the appropriate response of 2%." -- on the Harvard Medical School problem

> "A base rate is called causal if it suggests the existence of a causal factor that explains why any particular instance is more likely to yield one outcome rather than another. A base rate is called incidental if it does not lead to such an inference." -- Tversky & Kahneman, Ch. 10

> "In spite of the witness's report, therefore, the hit-and-run cab is more likely to be Green than Blue, because the base rate is more extreme than the witness is credible." -- on the cab problem (correct answer = .41)

> "The use or neglect of consensus information in individual prediction depends critically on the interpretation of that information." -- Tversky & Kahneman, Ch. 10
