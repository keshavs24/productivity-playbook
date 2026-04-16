---
title: "Probabilistic Reasoning in Clinical Medicine: Problems and Opportunities — Summary"
type: summary
phase: [2]
authors: ["David M. Eddy"]
sources: ["[[2-06 - Judgment Under Uncertainty - Heuristics and Biases (Collection) - Kahneman, Slovic, Tversky]]"]
confidence: 0.7
source_count: 1
created: 2026-04-14
updated: 2026-04-14
supersedes: []
tags: [base-rate-neglect, bayes-theorem, mammography, medical-decision-making, clinical-reasoning, predictive-accuracy, diagnostic-testing, phase-2]
status: active
---

# Probabilistic Reasoning in Clinical Medicine: Problems and Opportunities — Summary

**Author(s):** [[eddy|David M. Eddy]]
**Type:** Research chapter (Chapter 18 in *Judgment Under Uncertainty: Heuristics and Biases*)
**Published:** 1982, in Kahneman, Slovic, & Tversky (Eds.), Cambridge University Press
**Phase:** 2 -- Decision Science
**Date ingested:** 2026-04-14

## Key Takeaways

1. **Physicians systematically confuse retrospective accuracy with predictive accuracy** when interpreting diagnostic tests, leading to errors that can be off by a factor of 20 or more. This is the single most consequential application of [[base-rate-neglect]] documented in the literature.
2. **The mammography problem** is a landmark demonstration: given a 1% prior probability of cancer, a positive mammogram with 79.2% true-positive rate and 9.6% false-positive rate yields only ~7.7% probability of cancer -- yet ~95 out of 100 physicians estimate ~75%.
3. **The confusion of P(pos|ca) with P(ca|pos)** -- equating the probability of a positive test given cancer with the probability of cancer given a positive test -- is pervasive in the medical literature, medical textbooks, and clinical practice.
4. **The prior probability (base rate) of disease radically changes the meaning of test results.** A positive mammogram in a symptomatic woman with P(ca) = 8% yields P(ca|pos) = 40%; in an asymptomatic screening woman with P(ca) = 0.1%, it yields P(ca|pos) = ~2%. A twentyfold difference depending on who is being examined.
5. **Errors in probabilistic reasoning lead to real patient harm** -- both unnecessary biopsies (from overestimating cancer probability) and missed diagnoses (from misunderstanding what negative results mean).

## Detailed Notes

### The Problem: Biopsy Decisions for Breast Masses

A breast biopsy is not trivial. It typically involves excisional biopsy (~80% of cases), performed under general anesthesia (risk of anesthetic death ~2/10,000), a 1-2 inch incision, surgical removal of tissue, hospital admission, and ~$700 cost. Alternative needle biopsy is less invasive but considered less reliable for detecting malignant lesions. The central question: how should physicians use mammographic information to decide whether to biopsy?

Physicians can list possible diseases, assess symptom frequencies, compare findings to the patient, and estimate probabilities for each disease. Textbooks provide probabilistic information (e.g., descriptions of how chronic cystic disease differs from carcinoma using frequency words like "usually," "commonly," "approximately 15%").

### The Case of Mammography

Mammography works because malignant and non-malignant cells absorb X-rays differently. Mammograms are classified as positive or negative (or occasionally malignant/suspicious/benign). The test is imperfect: some malignant lesions are called benign, some benign lesions are called malignant. Two accuracy measures matter:

- **True-positive rate** (sensitivity): P(pos|ca) = .792 (from Snyder, 1966)
- **True-negative rate** (specificity): P(neg|benign) = .904

### The Bayesian Calculation

Given a prior probability of cancer P(ca) = .01 (1 in 100, based on the physician's experience with similar patients):

P(ca|pos) = P(pos|ca) * P(ca) / [P(pos|ca) * P(ca) + P(pos|benign) * P(benign)]

P(ca|pos) = (.792)(.01) / [(.792)(.01) + (.096)(.99)] = .077

**The correct answer: ~7.7% chance of cancer after a positive mammogram.** Not 75-80% as most physicians estimate.

### Incorrect Probabilistic Reasoning

Approximately **95 out of 100 physicians** (in an informal sample by the author) estimate P(ca|pos) to be ~75%. Casscells, Schoenberger, & Grayboys (1978) found similar results independently. The physicians confuse P(ca|pos) with P(pos|ca) -- they assume the probability of cancer given a positive X-ray equals the probability of a positive X-ray given cancer.

### The Retrospective vs. Predictive Accuracy Confusion

Eddy identifies two fundamentally different types of accuracy:

- **Retrospective accuracy**: P(pos|ca) and P(neg|no ca) -- determined by looking back at the X-ray diagnosis after the true histological diagnosis is known. This is what the literature reports.
- **Predictive accuracy**: P(ca|pos) and P(benign|neg) -- the accuracy important to the clinician who has an undiagnosed patient with an X-ray report. This is what clinicians need.

Evidence of the confusion in published medical literature:
- A 1964 *Radiology* article: "*the total correctness* of the X-ray diagnosis was 674 out of 759, or 89 percent" -- implying predictive accuracy equals retrospective accuracy
- *Clinical Obstetrics and Gynecology* (1966): "Asch found a 90 percent *correlation* of mammography with the pathologic findings"
- Egan (1972): "The *agreement* in radiologic and pathologic diagnosis was 91.6 percent"

All of these statements conflate the two accuracies.

### Explicit Errors in the Literature

**Example 1 (Surgery, Gynecology and Obstetrics, 1972):** An author states: "In women with proved carcinoma of the breast, in whom mammograms are performed, there is no X-ray evidence of malignant disease in approximately one out of five patients examined." The author incorrectly equated P(neg|ca) = .2 with P(ca|neg) = .2. The true P(ca|neg) depends on the prior probability and is much less than 1 in 100.

**Example 2 (National Observer, 1976):** A physician argued against routine screening mammography with five "observations and facts." He claimed that "15 percent of the women X-rayed will wind up with incorrect interpretations... 15 percent of the women will be given a false sense of security." Eddy's corrections:

- The 85% accuracy figure refers to differential diagnosis of known lesions, not screening. For screening, true-positive rate is roughly 60%, true-negative rate roughly 98%.
- P(ca,neg) = P(neg|ca) * P(ca) <= (.15)(.005) = .00075
- P(no ca,pos) = P(pos|no ca) * P(no ca) >= (.15)(.995) = .14925
- P(ca,neg) is about 200 times *less* likely than P(no ca,pos) -- the author had it backwards.
- Using Bayes' formula: P(ca|neg) = (.15)(.005) / [(.15)(.005) + (.85)(.995)] = .00089
- Of 10,000 screened asymptomatic women, the author thinks 1,269 will have a false sense of security; the actual number is about 9. Overestimated by a factor of ~150.

### The Importance of P(ca) -- Base Rate

Many physicians explicitly deny the relevance of base rates: "The patient is a case of one," "Statistics are for dead men." A textbook states: "When a patient consults his physician with an undiagnosed disease, neither he nor the doctor knows whether it is rare until the diagnosis is finally made. Statistical methods can only be applied to a population of thousands. The individual either has a rare disease or doesn't have it; the relative incidence of two diseases is completely irrelevant to the problem of making his diagnosis" (DeGowin & DeGowin, 1969, p. 6).

Yet physicians' behavior contradicts this -- they use base-rate reasoning implicitly: "When you hear hoofbeats, think of horses not of zebras," "Common things occur most commonly," "Follow Sutton's law: go where the money is."

The formal lesson: for a test of constant retrospective accuracy, the **predictive accuracy depends on the prevalence of cancer in the population being examined.** Comparing diagnostic clinic use (women with symptoms, P(ca) = 8%) with screening use (asymptomatic women, P(ca) = 0.1%):

- Diagnostic clinic, positive mammogram: P(ca|pos) = **40%**
- Screening clinic, positive mammogram: P(ca|pos) = **2%**

A twentyfold difference. Yet the test's retrospective accuracy is identical in both settings.

### Expanded Bayesian Calculation for Screening

When screening asymptomatic women, three disease categories exist: cancer, benign disease, and no disease. Using data from Wolfe (1965): P(no disease) roughly 60%, P(benign) roughly 40%, P(ca) roughly 0.1%. Assuming P(pos|no disease) = 0%:

P(ca|pos) is roughly 1 out of 49, or about **2%**.

### Implications: Mammograms and Biopsies

**The practice:** Most published clinical policy statements use only half of mammography's potential. They allow it to confirm suspicion (leading to biopsy) but not to reduce suspicion (avoiding biopsy). This asymmetric use wastes the test's diagnostic power.

A policy from *Archives of Surgery* (1966) exemplifies this with three patient categories:
- **Category A** (lump/dominant lesion): biopsy regardless of mammogram; mammography is "complementary"
- **Category B** (symptoms but no discrete mass): mammography "confirmatory" -- if clinical impression is benign, a benign mammogram should not dissuade from biopsy
- **Category C** (no signs/symptoms): mammogram can only increase number of biopsies

This nullifies the value of mammographic information in selecting patients in whom biopsy can be *avoided*.

**The potential:** Eddy models the impact on 1,000 patients with dominant lesions (P(ca) = 14%, true-positive rate = 52%, true-negative rate = 85%):
- Without mammography: all 1,000 biopsied, 860 unproductively
- With mammography: total immediate biopsies reduced from 1,000 to 240; patients with positive mammograms have 53% cancer rate; uncertain mammograms have 34%; negative mammograms have 4%
- 73% reduction in biopsies, from 1,000/1,000 to 270/1,000

### The Biopsy Threshold Concept

Eddy introduces the concept of a **biopsy threshold** -- the probability at which the physician and patient agree biopsy should be performed. This is crucial: if the threshold is 10%, a negative mammogram reducing cancer probability from 14% to 4% eliminates the need for biopsy. If the threshold is 1%, the 4% post-mammogram probability still exceeds it, and the mammogram does not change management.

Data from Shapiro, Strax, & Venet (1971) suggest approximately 31% of women had a biopsy threshold greater than 15%, 29% greater than 20%, and 5% exceeded 54%.

### Evaluation of Published Policy Statements

Eddy systematically evaluates seven published policy statements about mammography, demonstrating how each is undermined by faulty probabilistic reasoning:

1. "Mammography adds little to management of clinically palpable nodules requiring biopsy" -- **partially correct** but misses that mammography can split the group into subgroups with cancer ranging from 53% to 4%
2. "For clinical purposes mammography must provide accuracy at approximately 100 percent" -- **wrong**; even imperfect accuracy can be highly useful for patient management
3. "Mammography is not a substitute for biopsy" -- **correct** but incomplete; mammography and biopsy serve different functions, and in some patients mammography can obviate biopsy
4. "Every decision to biopsy should be preceded by a mammogram" -- **misunderstands**; for clinically obvious carcinoma, the mammogram changes management probability negligibly
5. "To defer biopsy of a clinically benign breast lesion called benign on mammography is a step backward" -- **wrong**; with P(ca) = 5%, a negative mammogram reduces P(ca) to ~1%, making 99/100 biopsies unproductive
6. "Mammography must never be used instead of biopsy for dominant lesions" -- disagrees with patients whose biopsy threshold exceeds 5%
7. "The fallacy comes in relying on mammography in doubtful cases" -- **logically backwards**; doubtful cases are exactly where mammographic information is most valuable

### The San Francisco Chronicle Anecdote

A real-world demonstration of probabilistic confusion. A woman and her physician discuss a xeromammogram:

- The doctor says it's "about as accurate as any picture can be" and that "even if the reading is negative... the only way to be certain is to cut the thing out."
- The woman's husband asks "So why get the X-ray taken in the first place?" Answer: "It's something to go on."
- The woman then plans a thermogram to confirm, believing combined testing would give 95% reliability.

This exchange shows how faulty probabilistic reasoning cascades through clinical decisions.

### Discussion

The probabilistic tools discussed have been available for centuries. Application to medical problems has grown (Lusted, 1968), but systematic methods for managing uncertainty have not yet "filtered down to affect the thinking of most practitioners." Medical problems are complex, and formal probabilistic reasoning provides great opportunities for improving quality and effectiveness of care.

## New Entities Introduced

- [[eddy]] -- David M. Eddy, physician and health policy researcher

## New Concepts Introduced

- [[base-rate-fallacy-in-medicine]] -- The systematic confusion of P(test|disease) with P(disease|test) in clinical settings
- [[retrospective-vs-predictive-accuracy]] -- The critical distinction between test accuracy measured by looking back (sensitivity/specificity) and accuracy for predicting an individual patient's condition

## Cross-References

- [[base-rate-neglect]] -- The general cognitive bias of which clinical reasoning errors are a domain-specific instance
- [[representativeness]] -- The heuristic that drives the confusion (matching test result to disease rather than computing base-rate-adjusted probabilities)
- [[clinical-vs-statistical-prediction]] -- Eddy's analysis is a powerful argument for formal statistical methods over clinical intuition
- [[overconfidence-in-calibration]] -- Physicians' confidence in their probability estimates vastly exceeds their accuracy
- [[heuristics-and-biases-program]] -- This chapter is a cornerstone application paper showing real-world consequences
- [[summary-2-06-hb-ch28-improper-linear-models]] -- Dawes's complementary chapter arguing for formal models over clinical judgment
- [[debiasing-strategies]] -- Eddy implicitly argues for debiasing through formal Bayesian tools

## Contradictions or Tensions

- Eddy notes a genuine tension in medicine: physicians' behavior shows they *do* use base-rate information implicitly ("horses not zebras"), yet their explicit reasoning and published statements deny its relevance ("the patient is a case of one"). This suggests the problem is not ignorance of base rates per se, but a failure to integrate them formally with diagnostic evidence.
- The DeGowin & DeGowin (1969) textbook passage explicitly declaring base rates "completely irrelevant" represents a direct confrontation between clinical tradition and Bayesian reasoning.

## Quotes Worth Keeping

> "Unfortunately, most physicians (approximately 95 out of 100 in an informal sample taken by the author) misinterpret the statements about the accuracy of the test and estimate P(ca|pos) to be about 75%." -- Eddy, Ch.18

> "The patient is a case of one" and "Statistics are for dead men." -- Medical maxims cited by Eddy as examples of base-rate dismissal

> "When a patient consults his physician with an undiagnosed disease, neither he nor the doctor knows whether it is rare until the diagnosis is finally made. Statistical methods can only be applied to a population of thousands." -- DeGowin & DeGowin (1969), quoted by Eddy

> "When you hear hoofbeats, think of horses not of zebras." -- Medical school maxim, cited by Eddy as evidence of implicit base-rate sensitivity

> "My purpose is not to argue for a specific mammography or biopsy policy... It is to suggest that we have not developed a formal way of reasoning probabilistically about this type of problem, that clinical judgment may be faulty, and that current clinical policies may be inconsistent or incorrect." -- Eddy, Ch.18
