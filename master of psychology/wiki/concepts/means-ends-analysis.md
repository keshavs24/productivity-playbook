---
title: "Means-Ends Analysis"
type: concept
phase: [2]
authors: ["Allen Newell", "Herbert Simon"]
sources: ["raw/assets/2-09 - Cognitive Psychology and Its Implications - Anderson.pdf"]
confidence: 0.7
source_count: 1
created: 2026-04-14
updated: 2026-04-14
supersedes: []
tags: [problem-solving, operator-selection, subgoals, GPS, phase-2]
status: active
---

# Means-Ends Analysis

**Phase(s):** 2
**Confidence:** 0.7

## Definition

Means-ends analysis is a problem-solving strategy in which the solver identifies differences between the current state and the goal state, finds an operator to eliminate the most important difference, and if that operator cannot be applied immediately, sets a **subgoal** to remove the obstacle blocking the operator. The means (operator) temporarily becomes the end (subgoal), enabling a recursive approach to complex problems.

## Key Findings

- Formalized in Newell and Simon's (1972) General Problem Solver (GPS) computer program, which successfully modeled human problem solving across algebra, calculus, logic, and monkey-and-bananas problems (Ernst & Newell, 1969) ([[summary-2-09-anderson-ch8]])
- Applied to the Tower of Hanoi, means-ends analysis produces the optimal 7-move solution for 3 disks through a 45-step reasoning process involving nested subgoals
- Move time in the Tower of Hanoi is a direct function of the number of subgoals that must be created: the first move (3 subgoals) takes 8.95 seconds; the second move (0 subgoals) takes 2.46 seconds (Anderson, Kushmerick, & Lebiere, 1993)
- Participants initially try the simpler [[difference-reduction]] strategy on the Tower of Hanoi; when this fails, they switch to means-ends analysis, after which the solution comes quickly (Kotovsky, Hayes, & Simon, 1985)
- fMRI shows prefrontal cortex BOLD response varies in synchrony with the number of goals held in working memory (Fincham et al., 2002)

## Mechanisms

Means-ends analysis works through two interlocking procedures:
1. **Flowchart 1:** Compare current state to goal state. If no differences, success. If differences exist, set a subgoal to eliminate the most important difference using Flowchart 2.
2. **Flowchart 2:** Search for an operator to eliminate the target difference. If found but blocked (a difference exists between the operator's precondition and the current state), set an **operator subgoal** to eliminate that blocking difference -- recursively invoking Flowchart 2.

This recursive structure enables the solver to maintain a hierarchy of goals and subgoals, allowing "backward" moves that temporarily increase distance from the goal. This is what distinguishes means-ends analysis from simple [[difference-reduction]] and makes it uniquely powerful.

## Applications

- The nursery-school example: "I want to take my son to school. What changes distance? My car. My car won't work. What's needed? A new battery. Where to get one? An auto repair shop. How to tell them? Call them." Each blocked operator generates a new subgoal.
- Career planning: Wanting a better job but needing education first requires tolerating a temporary deviation from the immediate goal (earning money) to achieve the longer-term goal
- Project management: Decomposing a large goal into subgoals, each of which may require further decomposition

## Cross-References
- **Related concepts:** [[problem-space]], [[difference-reduction]], [[bounded-rationality]]
- **Key authors:** [[newell-and-simon]]
- **Contrasts with:** [[difference-reduction]] (which is myopic and cannot handle backward moves)

## Open Questions
- What determines the limit on how many nested subgoals a person can maintain in working memory?
- How does expertise reduce the need for means-ends analysis by enabling more direct operator selection?
