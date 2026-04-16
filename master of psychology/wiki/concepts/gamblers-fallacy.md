---
title: "Gambler's Fallacy"
type: concept
phase: [1, 2]
authors: ["Amos Tversky", "Daniel Kahneman"]
sources: ["raw/assets/1-01 - Judgment Under Uncertainty - Heuristics and Biases (Paper) - Tversky, Kahneman.pdf", "raw/assets/2-09 - Cognitive Psychology and Its Implications - Anderson.pdf"]
confidence: 0.7
source_count: 2
created: 2026-04-13
updated: 2026-04-14
supersedes: []
tags: [cognitive-bias, representativeness, chance, randomness, phase-1]
status: active
---

# Gambler's Fallacy

**Phase(s):** 1, 2
**Confidence:** 0.5

## Definition

The gambler's fallacy is the belief that **a random process is self-correcting** — that after a run of one outcome (e.g., several heads in a row), the opposite outcome becomes more likely. People expect short sequences of random events to "look random" and balance out quickly.

## Key Findings

- People judge H-T-H-T-T-H as more likely than H-H-H-T-T-T or H-H-H-H-T-H in a fair coin toss, even though all are equally probable ([[summary-1-01-judgment-under-uncertainty]])
- The fallacy extends to any domain where people perceive randomness: roulette wheels, basketball shots, stock movements
- It is a direct consequence of the [[law-of-small-numbers]]: if small samples should mirror the population, then a run of heads "needs" to be balanced by tails

## Mechanisms

The [[representativeness]] heuristic drives this bias. A sequence that alternates looks "representative" of a random process. A sequence with long runs looks ordered or biased. People judge the probability of the sequence by how much it resembles their prototype of randomness — not by the actual probability (which is equal for all sequences of the same length).

## Applications

- **Gambling:** The classic: "red has come up 5 times, black is due"
- **Investing:** Expecting a stock to "bounce back" after a losing streak, or expecting a winning streak to end, purely because of the streak itself
- **Sports:** Benching a player after a cold streak on the assumption that the streak itself predicts poor future performance
- **Hiring:** Expecting that after several bad hires, the next hire is "due" to be good

## Anderson's Memory-Based Explanation (Ch.11)

Anderson ([[summary-2-09-anderson-ch11]]) offers a complementary cognitive mechanism based on **spreading-activation theory** from memory research:

- Similarity biases probability estimates: H T H T T H seems more probable than H H H H H H because the first sequence is similar to many other sequences in memory (e.g., H T H T H T, H T T H T H), while six straight heads is unlike any other sequence
- These similar sequences stored in memory "bias upward" the probability estimate of the target event via spreading activation
- The gambler's fallacy is practically exploitable: at racetracks using parimutuel betting, when favorites have won all day, bettors switch to long shots, causing favorite odds to deviate from true probabilities -- creating a profit opportunity for those who bet on the favorite
- Casino operators systematically profit from the fallacy: players on a losing streak keep playing, expecting the "law of averages" to compensate, but "the dice, cards, and roulette wheel do not know or care whether a gambler has had a string of losses"

## Cross-References
- **Parent heuristic:** [[representativeness]]
- **Related concepts:** [[law-of-small-numbers]], [[regression-to-the-mean]], [[recognition-heuristic]]
- **Key authors:** [[tversky]], [[kahneman]], [[anderson-john-r]]
