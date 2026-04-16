---
title: "Anderson Ch.10 - Reasoning"
type: summary
phase: [2]
authors: ["John R. Anderson"]
sources: ["raw/assets/2-09 - Cognitive Psychology and Its Implications - Anderson.pdf"]
confidence: 0.7
source_count: 1
created: 2026-04-14
updated: 2026-04-14
supersedes: []
tags: [reasoning, logic, deduction, induction, dual-process, cognitive-science, phase-2]
status: active
---

# Cognitive Psychology and Its Implications, Ch.10: Reasoning -- Summary

**Author(s):** John R. Anderson
**Type:** Book chapter (textbook)
**Phase:** 2
**Date ingested:** 2026-04-14

## Key Takeaways

1. Human reasoning consistently deviates from formal logic, but this does not mean humans are irrational -- their reasoning is often well-adapted to the complexities of the real world that laboratory tasks strip away.
2. People interpret conditional ("if-then") statements in multiple ways -- logical, causal, probabilistic, and permission-based -- and each interpretation activates different brain regions and produces different reasoning patterns.
3. Dual-process theory (Type 1 vs. Type 2 processes) provides the organizing framework: rapid associative Type 1 reasoning sometimes conflicts with slow deliberative Type 2 reasoning, and neither is always correct.

## Detailed Notes

### Reasoning and the Brain
- fMRI studies (Goel, Buchel, Frith, & Dolan, 2000) show that different brain regions activate depending on the type of reasoning problem:
  - **Content-free abstract syllogisms** (e.g., "All P are B") activate **parietal regions** associated with algebraic/spatial processing
  - **Meaningful-content syllogisms** (e.g., "All poodles are pets") activate **left ventral prefrontal and left temporal-parietal regions** associated with language processing
- When content is congruent with logic, accuracy is 84%; when incongruent (logically valid but counterintuitive conclusions like "All pets are vicious"), accuracy drops to 74%
- Content-free abstract reasoning accuracy: 77%

### Reasoning About Conditionals
- **Deductive reasoning** = conclusions follow with certainty from premises; **inductive reasoning** = conclusions follow probabilistically
- A **conditional statement** ("If A, then B") has an antecedent (A) and consequent (B)

#### Two Valid Rules of Inference
- **Modus ponens**: If A then B; A is true; therefore B is true (accepted ~98% of the time)
- **Modus tollens**: If A then B; B is false; therefore A is false (accepted only ~62% of the time)

#### Two Invalid Patterns (Fallacies)
- **Affirmation of the consequent**: If A then B; B is true; therefore A is true (~42% accept this fallacy)
- **Denial of the antecedent**: If A then B; A is false; therefore B is false (~42% accept this fallacy)
- Key finding from Evans (1993): modus tollens acceptance is only slightly greater than acceptance of the two invalid patterns

#### Causal Reasoning
- People often interpret "if-then" statements as causal rather than logical relationships (Weidenfeld, Oberauer, & Hornig, 2005)
- Sloman and Lagnado (2005): causal vs. conditional framing of identical network structures produces dramatically different reasoning (55% vs. 5% concluded Ball 1 could not move)
- Cummins et al. (1991): acceptance of valid inferences is modulated by real-world causal knowledge
- **Bayes nets** (Pearl, 1988) provide a graphical formalism for representing causal knowledge

### The Wason Selection Task
- [[wason-selection-task]]: given cards with letters/numbers and the rule "If vowel, then even number," only ~10% of participants select the logically correct pair (E and 7)
- 90% select E (correct), but only 25% select 7 (correct); 60% select 4 (incorrect -- affirming the consequent)

#### Permission Interpretation
- Performance dramatically improves (~74%) when the task is framed as detecting rule violations (e.g., drinking beer underage) -- the **[[permission-schema]]** (Cheng & Holyoak, 1985)
- Cosmides (1989) and Gigerenzer and Hug (1992) argued this reflects evolved **social contract** reasoning -- humans are naturally good at detecting cheaters
- Cheating condition: 80% correct; non-cheating condition: only 45% correct

#### Probabilistic Interpretation
- Oaksford and Chater (1994): the "errors" in the Wason task are rational if people interpret conditionals probabilistically and assume the referenced properties are rare
- Their mathematical model predicts the observed card selection frequencies

#### Training in Logic Does Not Help
- Cheng, Holyoak, Nisbett, and Oliver (1986): a semester course in logic improved Wason task performance by only 3%

### Reasoning About Quantifiers
- [[categorical-syllogisms]] use quantifiers: *all*, *some*, *no*, *some...not*
- People interpret "all" as "most" and "no" as "hardly any" -- probabilistic rather than absolute

#### The Atmosphere Hypothesis
- Woodworth and Sells (1935): the quantifiers in the premises create an "atmosphere" that biases people to accept conclusions using the same quantifiers

#### Mental Model Theory
- [[mental-model-theory]] (Johnson-Laird, 1983): people judge syllogisms by constructing a mental model satisfying the premises and checking if the conclusion holds
- Errors occur because people typically construct only one model and fail to consider alternatives
- Brain imaging: right frontal cortex more active for syllogisms; deductive reasoning right-localized, probabilistic reasoning left-localized (Kroger et al., 2008; Parsons & Osherson, 2001)

### Inductive Reasoning and Hypothesis Testing
- Wason's (1960) 2-4-6 task: participants sought confirming rather than disconfirming evidence
- Dunbar (1993): undergraduates recreating gene regulation research all initially tested only activation hypotheses; only a minority searched for the actual inhibitory mechanism
- fMRI (Fugelsang & Dunbar, 2005): inconsistent evidence produces greater ACC activation -- the same conflict-detection region active in Stroop tasks
- Okada and Simon (1997): pairs were much more successful than individuals because collaboration forces explicit articulation

### Dual-Process Theories
- **Type 1 processes**: rapid, automatic, relying on associations
- **Type 2 processes**: slow, deliberative, following normative prescriptions, demanding working memory
- Evidence: higher IQ correlates with normative performance (Newstead et al., 2004); quick responses align with Type 1, slower with Type 2; ACC more engaged when Types 1 and 2 conflict (de Neys et al., 2008)
- **Important nuance**: Type 1 is not always wrong -- in the real world, Type 1 processes can take advantage of the wisdom of experience

## New Concepts Introduced
- [[conditional-reasoning]]
- [[wason-selection-task]]
- [[categorical-syllogisms]]
- [[mental-model-theory]]
- [[permission-schema]]

## Contradictions or Tensions
- Anderson uses "Type 1/Type 2" (Evans, Stanovich) rather than "System 1/System 2" (Kahneman), noting the framework has been criticized as unfalsifiable
- Anderson emphasizes that "incorrect" reasoning in lab tasks may reflect adaptive real-world intelligence -- more sympathetic than Kahneman/Tversky's deficit framing
- The Oaksford & Chater probabilistic model reframes Wason task "errors" as optimal behavior under real-world assumptions

## Quotes Worth Keeping
> "Human reasoning is judged as deficient when compared against the standards of logic and mathematics, but AI systems built on these very standards are judged as deficient when compared against humans." -- Anderson, Ch.10 opener
