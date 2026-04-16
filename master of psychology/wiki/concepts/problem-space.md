---
title: "Problem Space"
type: concept
phase: [2]
authors: ["Allen Newell", "Herbert Simon"]
sources: ["raw/assets/2-09 - Cognitive Psychology and Its Implications - Anderson.pdf"]
confidence: 0.7
source_count: 1
created: 2026-04-14
updated: 2026-04-14
supersedes: []
tags: [problem-solving, cognitive-psychology, search, operators, phase-2]
status: active
---

# Problem Space

**Phase(s):** 2
**Confidence:** 0.7

## Definition

A problem space (also called a state space) is the set of all possible **states** of a problem along with the **operators** for transforming one state into another. A state is a representation of the problem in some degree of solution. The **start state** is the initial situation, **intermediate states** are situations encountered on the way to a solution, and the **goal state** is the situation in which the problem is solved. Problem solving is conceptualized as a **search** through this space to find a path from the start state to the goal state.

## Key Findings

- Newell and Simon (1972) developed this framework in their landmark book *Human Problem Solving*, which became the dominant approach in both cognitive psychology and artificial intelligence ([[summary-2-09-anderson-ch8]])
- The eight puzzle illustrates the concept clearly: states are tile configurations, operators are tile movements into the empty cell, and the search tree of all possible move sequences expands rapidly
- The problem space can be visualized as a **search tree** -- an inverted tree with the start state as the root and branches representing all possible operator applications at each state
- The size of the problem space affects behavior: participants persist longer before giving up on problems with larger spaces (Payne & Duggan, 2011)

## Mechanisms

The problem space framework works because it decomposes the complexity of problem solving into two manageable questions: (1) what operators are available to the problem solver? and (2) how does the problem solver select among available operators? The first question determines which problem space the solver is working in. The second determines which path through the space the solver takes. Three operator-selection strategies are documented: **backup avoidance**, **[[difference-reduction]]**, and **[[means-ends-analysis]]**.

## Applications

- Any well-defined problem can be represented as a problem space -- from puzzles (eight puzzle, Tower of Hanoi) to real-world problems (career decisions, engineering design)
- When stuck on a problem, consider whether you are working in the wrong problem space entirely -- your representation of the problem may be excluding the operators needed for a solution (see [[functional-fixedness]])
- Expertise in a domain can be understood as knowing which paths through the problem space are productive and which are dead ends

## Cross-References
- **Related concepts:** [[means-ends-analysis]], [[difference-reduction]], [[functional-fixedness]], [[bounded-rationality]]
- **Key authors:** [[newell-and-simon]]
- **Frameworks that use this:** General Problem Solver (GPS)

## Open Questions
- How do people decide which problem space to search when the problem itself is ill-defined (no clear start or goal state)?
- How does expertise change the size or structure of the problem space a solver perceives?
