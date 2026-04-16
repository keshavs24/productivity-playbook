---
title: "Anderson Ch.11 - Decision Making"
type: summary
phase: [2]
authors: ["John R. Anderson"]
sources: ["raw/assets/2-09 - Cognitive Psychology and Its Implications - Anderson.pdf"]
confidence: 0.7
source_count: 1
created: 2026-04-14
updated: 2026-04-14
supersedes: []
tags: [decision-making, bayesian-reasoning, probability, utility, neuroscience, phase-2]
status: active
---

# Cognitive Psychology and Its Implications, Ch.11: Decision Making -- Summary

**Author(s):** John R. Anderson
**Type:** Book chapter (textbook)
**Phase:** 2
**Date ingested:** 2026-04-14

## Key Takeaways

1. Anderson provides the full mathematical foundations of Bayesian reasoning as the prescriptive (normative) model for probabilistic judgment, then demonstrates systematic human departures from it (base-rate neglect, conservatism).
2. The neuroscience of decision making reveals two dissociable brain systems: the dopamine/nucleus accumbens system encoding reward magnitude, and the ventromedial prefrontal cortex integrating probabilities with magnitudes -- the Phineas Gage case is the foundational demonstration.
3. Anderson frames heuristics as often adaptive rather than merely biased -- the recognition heuristic (Gigerenzer) can outperform exhaustive calculation, and probability judgments track real-world frequency via memory accessibility.

## Detailed Notes

### The Brain and Decision Making
- **Phineas Gage** (1848): iron bar destroyed the **[[ventromedial-prefrontal-cortex]]** -- survived but became "fitful, irreverent, capricious" with impaired decision making
- The ventromedial prefrontal cortex is important for motivation, emotional regulation, and social sensitivity (Gilbert, Spengler, Simons, Frith, & Burgess, 2006)
- Subsequent patients with similar damage: "socially incompetent," "decides against his best interest," "doesn't learn from his mistakes" (Sanfey, Hastie, Colvin, & Grafman, 2003)

### Probabilistic Judgment: Bayes's Theorem
- Anderson presents the complete **Bayesian framework** as the prescriptive model:
  - **Prior probability** Prob(H): probability of hypothesis before evidence
  - **Conditional probability** Prob(E|H): probability of evidence given hypothesis is true
  - **Posterior probability** Prob(H|E): probability of hypothesis after considering evidence
  - **Bayes's equation**: Prob(H|E) = [Prob(E|H) * Prob(H)] / [Prob(E|H) * Prob(H) + Prob(E|~H) * Prob(~H)]
- **Burglary example**: Door ajar, prior probability of burglary = .001, P(E|H) = .8, P(E|~H) = .01, posterior = .074 -- only 7.4% despite strong evidence because base rate is low
- **Frequency tree** representation (Hoffrage, Krauss, Martignon, & Gigerenzer, 2015): out of 100,000 households, 80 of 100 burgled homes have ajar doors, but 999 of 99,900 non-burgled homes also have ajar doors -- so only 80/(80+999) = .074
- Distinction between **prescriptive model** (how people ought to behave) and **descriptive model** (what people actually do)

### Base-Rate Neglect
- Kahneman and Tversky (1973) engineer/lawyer study: both the 70/30 and 30/70 groups estimated .90 probability for the "Jack" description matching engineer -- completely ignoring the base rate
- For "Dick" -- an uninformative description -- both groups estimated .50 rather than using the base rate (.70 or .30)
- **Cancer diagnostic example**: with base rate of 1/10,000, test sensitivity 95%, false positive rate 5%, actual probability of cancer given positive test is only .0019 (less than 1 in 500) -- yet most people estimate ~95%

### Bayesian Conservatism
- [[bayesian-conservatism]] (Edwards, 1968): people sometimes do the opposite of base-rate neglect -- they fail to update sufficiently in response to accumulating evidence
- Poker chip experiment: after 12 draws (8 red, 4 blue) from bags of 70/30 red or blue chips, Bayesian posterior = .97, but participants estimate only ~.75
- Edwards estimated people give between 1/5 and 1/2 of the proper weight to evidence
- Conservatism and base-rate neglect appear contradictory but may reflect different experimental conditions: conservatism when data accumulate incrementally, neglect when vivid individuating information is available at once

### Judgments of Probability
- When people must estimate probabilities from memory rather than direct observation, memory biases distort estimates
- Tversky and Kahneman (1974): people estimate more English words start with *k* than have *k* in the third position (the reverse is true) because initial-letter retrieval is easier -- explained by spreading-activation theory in memory
- Similarity biases probability estimates: H T H T T H seems more probable than H H H H H H (both equally likely) because the first resembles many other sequences
- **[[gamblers-fallacy]]**: people believe random processes self-correct -- casino operators exploit this

### The Adaptive Nature of the Recognition Heuristic
- [[recognition-heuristic]] (Goldstein & Gigerenzer, 1999, 2002): when people recognize one item but not another, they infer the recognized item scores higher on whatever criterion is being judged
- American students were MORE accurate at judging German city sizes than German students because they could use the recognition heuristic -- if they recognized a German city, it was probably large
- The heuristic works because media mention frequency correlates with city size (.72/.70), and recognition correlates with media mention frequency (.86/.79)
- People can adaptively combine recognition with other knowledge (Richter & Spath, 2006): they correctly chose mottled umbers over giant pandas for population size, overriding recognition because they knew pandas are endangered

### Making Decisions Under Uncertainty
- **Expected value theory** (von Neumann & Morgenstern, 1944): choose the option with highest expected value = probability x value
- People deviate from expected value -- preferring a certain $1 million over a 50% chance of $2.5 million (expected value $1.25 million)
- **[[subjective-utility]]** (Kahneman & Tversky, 1984): the value people place on outcomes is not linear with objective value -- the utility function is concave for gains (diminishing marginal utility) and steeper for losses than gains ([[loss-aversion]])
- **[[subjective-probability]]**: people associate subjective probabilities with events that differ from objective probabilities -- low probabilities are overweighted relative to high probabilities
- Anderson (1990) argued overweighting low probabilities may be rational because assertions of extremely low probability are often incorrect
- Not everyone has the same utility function -- someone who needs exactly $10,000 for a life-saving procedure has a step function in utility at that point

### Framing Effects
- [[framing-effects]]: different presentations of equivalent alternatives produce different choices because they shift where people perceive themselves on the subjective utility curve
- Kahneman and Tversky (1984) $15/$125 store example: people more willing to drive to save $5 on the $15 item than the $125 item -- same $5 saving but different subjective utility differences
- Racetrack betting example: framing the same choice as loss-region (A/B) vs. zero-point (C/D) reverses preferences
- **Asian Disease Problem** (Kahneman & Tversky, 1984): "200 saved" vs. "400 will die" -- 72% chose certain option in gain frame, only 22% in loss frame
- McNeil, Pauker, Sox, and Tversky (1982): even **doctors** choose different treatments depending on whether outcomes are framed as survival or mortality rates
- Shafir (1993): people may decide based on which choice is easiest to **justify** rather than which is objectively best -- the custody example where Parent B was both awarded AND denied custody more often
- **Trolley problem** (Greene, Sommerville, Nystrom, Darley, & Cohen, 2001): impersonal dilemmas activate parietal (calculation) regions; personal dilemmas activate ventromedial prefrontal (emotional) regions
- **Default effects**: organ donation, 401(k) enrollment, flu shots -- people choose the default option to avoid the need to justify an active choice (Johnson, Steffel, & Goldstein, 2005; Choi, Laibson, Madrian, & Metrick, 2003)

### Choosing Among Many Alternatives
- With many alternatives, people use simplifying strategies: **satisficing** (Simon, 1955) -- stopping at "good enough" -- or focusing on the few most important attributes
- Eye-tracking and MouseLab studies (Payne, Bettman, & Johnson, 1993; Shi, Wedel, & Pieters, 2013): people spend more time on important attributes and promising alternatives
- Three effects of adding a third option (Oppenheimer & Kelso, 2015):
  - **Similarity effect**: third option similar to option A steals votes from A, boosting B
  - **Attraction effect**: third option dominated by A makes A look better (decoy effect)
  - **Compromise effect**: third option makes A appear as a compromise, boosting A
- All three are driven by the need to justify one's choice (Mercier & Sperber, 2011)

### Neural Representation of Subjective Utility and Probability
- **Nucleus accumbens** (basal ganglia): dopamine neurons respond to reward magnitude but not probability; encodes subjective utility
- **Ventromedial prefrontal cortex**: responds to probability of reward; integrates probability with magnitude -- the key decision-making region
- Dopamine neurons encode **reward prediction error** (Schultz, 1998; Montague, Dayan, & Sejnowski, 1996): fire when reward exceeds expectation, depress when reward is less than expected
- **Feedback-related negativity (FRN)**: ERP component 200-350ms after reward, more negative when reward < expected, more positive when reward > expected (Walsh & Anderson, 2012)
- FRN shows a slow learning process even when explicit knowledge is immediate -- "their minds knew but their hearts had to learn" (Walsh & Anderson, 2011)
- **[[iowa-gambling-task]]** (Bechara, Damasio, Damasio, & Anderson, 1994): participants choose from "good" decks (+$250/10 cards) and "bad" decks (-$250/10 cards); normal participants learn to avoid bad decks, but patients with ventromedial prefrontal damage keep choosing high-reward/high-penalty decks and show no galvanic skin response to dangerous choices

### Conclusions
- All mammals have a dopamine reward system for basic approach/avoidance; humans additionally have a greatly expanded prefrontal cortex enabling reflection, self-regulation, and override of primitive urges
- The ventromedial prefrontal cortex is proportionally much larger in humans than in other apes, enabling acts of self-regulation (like diet plans) far beyond any other species

## New Concepts Introduced
- [[bayesian-conservatism]]
- [[recognition-heuristic]]
- [[iowa-gambling-task]]

## Contradictions or Tensions
- Conservatism and base-rate neglect appear contradictory -- Anderson notes this is an open question in the field (discussed in Questions for Thought)
- Anderson's own work (1990) defends overweighting of low probabilities as potentially rational -- contrasting with the standard view that subjective probability distortions are biases
- The recognition heuristic (Gigerenzer) presents a more optimistic view of heuristics than Kahneman/Tversky's framework -- heuristics as adaptive tools rather than sources of error

## Quotes Worth Keeping
> "Perhaps if we understood better how people respond to such uncertainty and to such contradictory information, we would also be in a better position to understand why there are so many failures of our good resolutions." -- Anderson, Ch.11 Conclusions
