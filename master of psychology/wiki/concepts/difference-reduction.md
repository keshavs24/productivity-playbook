---
title: "Difference Reduction"
type: concept
phase: [2]
authors: ["Allen Newell", "Herbert Simon"]
sources: ["raw/assets/2-09 - Cognitive Psychology and Its Implications - Anderson.pdf"]
confidence: 0.7
source_count: 1
created: 2026-04-14
updated: 2026-04-14
supersedes: []
tags: [problem-solving, hill-climbing, operator-selection, phase-2]
status: active
---

# Difference Reduction

**Phase(s):** 2
**Confidence:** 0.7

## Definition

Difference reduction (also called **hill climbing**) is a problem-solving strategy in which the solver selects the operator that most reduces the difference between the current state and the goal state (or, equivalently, maximizes similarity to the goal). It is a simple, widely used heuristic but is fundamentally **myopic** -- it evaluates only whether the next step is an improvement without considering whether the overall plan will work.

## Key Findings

- Difference reduction is common across species; even chickens use it (walking toward food rather than around a fence), but unlike higher primates, they cannot override it when a backward move is required (Kohler, 1927) ([[summary-2-09-anderson-ch8]])
- In the hobbits-and-orcs river-crossing problem, one-third of participants chose to send two hobbits backward (recreating the previous state) rather than make the correct move of sending a hobbit and orc backward, because the correct move appeared to increase distance from the goal (Jeffries, Polson, Razran, & Atwood, 1977)
- More sophisticated measures of similarity improve difference reduction: in the eight puzzle, using tile sequence (whether tiles are followed by their correct successors) rather than just tile position leads to more effective solutions (Nilsson, 1971)
- Difference reduction also produces suboptimal results in life decisions -- people trapped in suboptimal jobs unwilling to endure temporary income reduction for education that would lead to higher earnings

## Mechanisms

The solver computes a similarity or distance measure between each possible next state and the goal state, then selects the operator producing the state closest to the goal. The fundamental limitation: the goal landscape may have **local maxima** (hilltops lower than the true peak) where every immediate move looks like it increases distance from the goal, trapping the solver.

## Applications

- Recognize when you are stuck on a "local maximum" -- the correct path may require temporarily moving away from your goal
- Combine with [[means-ends-analysis]] for more effective problem solving
- Use more sophisticated measures of "closeness" to improve hill-climbing effectiveness

## Cross-References
- **Related concepts:** [[means-ends-analysis]], [[problem-space]]
- **Contrasts with:** [[means-ends-analysis]] (which can handle backward moves through subgoals)

## Open Questions
- When is difference reduction sufficient versus when is means-ends analysis required?
