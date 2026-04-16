---
title: "Intuitive Prediction: Biases and Corrective Procedures — Summary"
type: summary
phase: [2]
authors: ["Daniel Kahneman", "Amos Tversky"]
sources: ["[[2-06 - Judgment Under Uncertainty - Heuristics and Biases (Collection) - Kahneman, Slovic, Tversky]]"]
confidence: 0.7
source_count: 1
created: 2026-04-14
updated: 2026-04-14
supersedes: []
tags: [intuitive-prediction, regression, base-rate-neglect, singular-vs-distributional, planning-fallacy, corrective-procedures, forecasting, phase-2]
status: active
---

# Intuitive Prediction: Biases and Corrective Procedures — Summary

**Author(s):** [[kahneman|Daniel Kahneman]] and [[tversky|Amos Tversky]]
**Type:** Research chapter (Chapter 30 in *Judgment Under Uncertainty: Heuristics and Biases*)
**Published:** 1982, in Kahneman, Slovic, & Tversky (Eds.), Cambridge University Press
**Phase:** 2 -- Decision Science
**Date ingested:** 2026-04-14

## Key Takeaways

1. **Intuitive predictions are typically nonregressive** -- people match their prediction to their impression of the case rather than adjusting toward the base rate, producing predictions that are systematically too extreme.
2. **Singular vs. distributional information**: Forecasters rely excessively on singular (case-specific) information and underweight distributional (base-rate) data, even when distributional data are available and more reliable.
3. **The planning fallacy** is a direct consequence of neglecting distributional information: people underestimate completion times because they focus on the internal features of the specific project rather than the distribution of outcomes in similar past projects.
4. **A five-step corrective procedure** can guide experts toward properly regressive predictions: (1) select a reference class, (2) assess its distribution, (3) make an intuitive estimate, (4) assess predictability, and (5) correct the intuitive estimate toward the mean.
5. **The key insight**: Intuitive predictions contain useful information but are biased in predictable ways; the solution is not to reject them but to debias them by integrating distributional data.

## Detailed Notes

### Singular and Distributional Data

Experts making predictions have access to two types of information:
- **Singular information** (case data): evidence about the particular case -- the author's style, the student's GPA, the patient's symptoms
- **Distributional information** (base-rate data): knowledge about the distribution of outcomes in similar cases -- how books of this type typically sell, how students with these credentials typically perform

The concept of distributional data does not coincide with the Bayesian concept of a prior probability distribution. Distributional data is defined by the nature of the data; prior probabilities are defined by the sequence of information acquisition.

Many prediction problems are essentially unique (e.g., forecasting nuclear energy demand in 2000, when a cure for leukemia will be found), making distributional data unavailable. In such cases, experts must rely on singular information. However, the evidence suggests that people are **insufficiently sensitive to distributional data even when such data are available** -- they rely primarily on singular information even when it is scanty and unreliable (Kahneman & Tversky, 1973; Tversky & Kahneman, Ch. 10).

### The Planning Fallacy

The context of planning provides many examples of distributional neglect:
- Scientists and writers are notoriously prone to underestimate completion time despite considerable experience of past failures
- Engineers underestimate repair times for power stations (Kidd, 1970)
- The planning fallacy is sometimes attributable to motivational factors (wishful thinking) but frequently occurs even when underestimation is penalized

The planning fallacy arises from an **internal approach** to prediction -- focusing on the specific problem's constituents rather than the distribution of outcomes in similar cases. The internal approach produces underestimation because a building can only be completed on time if there are no delays, no strikes, no unusual weather, etc. Each disruption is individually unlikely, but the combinatorial probability that at least one will occur is substantial (Bar-Hillel, 1973). Adjusting by a "slippage factor" fails because the adjusted value remains anchored too close to the initial estimate ([[anchoring-and-adjustment]]).

The **external approach** treats the specific problem as one of many: "How long do such projects usually last?" rather than "What are the specific factors in this project?" More reasonable estimates are likely from the external question.

The tendency to neglect distributional information is enhanced by:
- Perceived uniqueness of the problem
- Detailed acquaintance with the specific case
- Intense involvement
- The formulation of the question (asking about total cost induces internal thinking; asking about percentage of cost overruns invokes distributional thinking)

### Regression and Intuitive Prediction

In most prediction problems, the expert has both singular and distributional information. Psychological research (Kahneman & Tversky, 1973; Ross, 1977) suggests intuitive predictions follow a **simple matching rule**: the predicted value is selected so that the standing of the case in the distribution of outcomes matches its standing in the distribution of impressions.

**Example:** An editor reviews a novel manuscript and says: "This book reads like a best-seller. Among books of this type published in recent years, only one in twenty impressed me more." If asked to predict sales, the editor would likely predict top 5% of the distribution.

This matching rule is unsound because it **fails to take uncertainty into account.** When predictability is low (as in book sales), the best prediction should fall between the impression-matched value and the class average. The lower the predictability, the closer the prediction should be to the class average. Intuitive predictions are typically nonregressive: people make extreme predictions on the basis of information whose reliability and predictive validity are known to be low.

### A Corrective Procedure for Prediction

Kahneman and Tversky propose a **five-step corrective procedure**:

**Step 1: Selection of a reference class.** Identify a class to which the case can be meaningfully referred and for which the distribution of outcomes is known. The choice involves trade-offs: the most inclusive class allows the best estimate of the distribution, but may be too heterogeneous for meaningful comparison. The class of books by the same author provides the most natural comparison, but the book in question may fall outside previously observed ranges.

**Step 2: Assessment of the distribution for the reference class.** The expert should provide an estimate of the class average and the range of variability. For long-term forecasting where direct distributional data are unavailable, the distribution can sometimes be estimated indirectly (e.g., England's share of world market in various technologies as a proxy for a specific technology).

**Step 3: Intuitive estimation.** The expert makes an intuitive estimate based on singular information about the particular case. This estimate is likely to be nonregressive -- the next two steps correct for this.

**Step 4: Assessment of predictability.** The expert assesses the degree to which the available information permits accurate prediction. In linear prediction, the appropriate measure is the product-moment correlation between predictions and outcomes. Methods for assessing predictability:
- Direct subjective estimate of the correlation coefficient (for statistically sophisticated experts)
- Ordinal comparison: "If you were to consider two novels you are about to publish, how often would you be right in predicting which will sell more copies?" If the estimated proportion correct is q, then tau = 2q - 1 provides a crude approximation for the correlation.
- Comparing predictability to other domains (e.g., sales of books vs. point spreads in football vs. weather forecasting)

**Caution:** Estimates of predictability should be examined carefully. The expert may be subject to the [[hindsight-bias]] (Fischhoff, 1975), overestimating predictability of outcomes, or to [[availability]] bias, recalling primarily memorable cases where strong impressions were confirmed.

**Step 5: Correction of the intuitive estimate.** To correct for nonregressiveness, adjust the intuitive estimate toward the reference class average. If the estimate was nonregressive, the distance between the intuitive estimate and the class average should be reduced by a factor of the correlation coefficient (rho).

**Example:** Expert's intuitive prediction of book sales = 12,000 copies. Class average = 4,000 copies. Expert believes he would correctly rank pairs 80% of the time, so tau = 1.6 - 1 = 0.6. Regressed estimate = 4,000 + 0.6(12,000 - 4,000) = **8,800 copies**.

The effect of this correction is substantial when the intuitive estimate is relatively extreme or predictability is moderate to low.

### Objections and Responses

**Objection 1:** The expert may question the assumption that his initial estimate was nonregressive. This can be verified by asking the expert to estimate (a) the proportion of cases that would have made a stronger impression and (b) the proportion for which the outcome exceeds the prediction. If these proportions are approximately equal, the prediction is surely nonregressive.

**Objection 2:** Predictions should not be regressive because they yield conservative predictions near the class average and cannot predict exceptional outcomes. Response: A fallible predictor can retain a chance to correctly predict exceptional outcomes only at the cost of erroneously identifying many other cases as exceptional. Nonregressive predictions over-predict: any high prediction is associated with a substantial probability of being an overestimate, and any low prediction is an underestimate. In most situations, this bias is costly and should be eliminated.

### Concluding Remarks

The approach is based on three notions about forecasting: (1) most predictions and forecasts contain an irreducible intuitive component, (2) intuitive predictions of knowledgeable individuals contain much useful information, (3) these intuitive judgments are often biased in a predictable manner. The problem is not whether to accept or reject intuitive predictions, but how to debias and improve them.

The strategy of debiasing elicits from the expert relevant information that he would normally neglect and helps him integrate this information with his intuitive impressions in a manner that respects basic principles of statistical prediction.

## New Concepts Introduced

- [[regression-prediction]] -- The principle that optimal predictions should be regressive (pulled toward the base rate), with the degree of regression determined by the predictability of the criterion

## Cross-References

- [[base-rate-neglect]] -- The core bias underlying nonregressive prediction
- [[representativeness]] -- The heuristic that drives the matching rule (prediction matches impression)
- [[anchoring-and-adjustment]] -- Planning fallacy arises from insufficient adjustment from internal estimates
- [[regression-to-the-mean]] -- The statistical principle that predictions should respect
- [[hindsight-bias]] -- Can distort experts' assessments of their own predictive accuracy
- [[availability]] -- Can bias experts' recall of prediction successes and failures
- [[debiasing-strategies]] -- The five-step procedure is a structured debiasing technique
- [[clinical-vs-statistical-prediction]] -- The corrective procedure bridges clinical (intuitive) and statistical approaches
- [[summary-2-06-hb-ch18-clinical-reasoning]] -- Eddy demonstrates the same base-rate neglect in medical prediction
- [[summary-2-06-hb-ch28-improper-linear-models]] -- Dawes argues for replacing intuition with linear models; K&T argue for correcting intuition

## Contradictions or Tensions

- Kahneman and Tversky's approach here is more conciliatory toward intuitive judgment than Dawes's (Ch. 28). Dawes argues for *replacing* clinical judgment with linear models; K&T argue for *correcting* intuitive predictions by integrating them with distributional data. Both approaches respect the same underlying statistical principles but differ in how much they trust the human component.
- The five-step procedure requires the expert to assess predictability (Step 4), which is itself subject to bias (hindsight, availability). This creates a potential circularity: the debiasing tool depends on an estimate that may itself be biased.

## Quotes Worth Keeping

> "Intuitive predictions are typically nonregressive: people often make extreme predictions on the basis of information whose reliability and predictive validity are known to be low." -- Kahneman & Tversky, Ch.30

> "The problem is not whether to accept intuitive predictions at face value or to reject them, but rather how they can be debiased and improved." -- Kahneman & Tversky, Ch.30

> "A fallible predictor can retain a chance to correctly predict a few exceptional outcomes only at the cost of erroneously identifying many other cases as exceptional." -- Kahneman & Tversky, Ch.30
