---
title: "Debiasing Strategies"
type: concept
phase: [2]
authors: ["Max H. Bazerman", "Don A. Moore", "Baruch Fischhoff", "Richard Larrick"]
sources: ["raw/assets/2-08 - Judgment in Managerial Decision Making - Bazerman, Moore.pdf", "raw/assets/2-06 - Judgment Under Uncertainty - Heuristics and Biases (Collection) - Kahneman, Slovic, Tversky.pdf"]
confidence: 0.75
source_count: 2
created: 2026-04-14
updated: 2026-04-14
supersedes: []
tags: [debiasing, decision-improvement, linear-models, expertise, analogical-reasoning, outsider-view, nudge, choice-architecture, phase-2]
status: active
---

# Debiasing Strategies

**Phase(s):** 2
**Confidence:** 0.7

## Definition

Debiasing strategies are structured interventions designed to reduce or eliminate the systematic biases that distort human judgment and decision making. Bazerman and Moore (2013) present a seven-strategy framework in the final chapter of *Judgment in Managerial Decision Making*, organizing the strategies into two tiers: three **broad strategies** that aim to change overall intuitive responses to decision-making situations (use decision-analysis tools, acquire expertise, debias your judgment), and four **targeted strategies** that provide techniques for improving specific decisions in specific contexts (reason analogically, take an outsider's view, understand biases in others, nudge wiser decisions).

The framework builds on Fischhoff's (1982) foundational debiasing work and Larrick's (2004) comprehensive review, integrating insights from [[system-1-system-2]] dual-process theory, Lewin's change model, and Thaler and Sunstein's (2008) nudge architecture.

## The Seven Strategies

### Strategy 1: Use Decision-Analysis Tools
Replace intuitive integration of information with formal procedures -- particularly **linear models** (weighted additive formulas). Linear models outperform expert judgment across domains because humans are good at selecting relevant variables but poor at consistently integrating them (Dawes, 1979). Key advantages:
- **Consistency:** A model always produces the same output from the same inputs; human judgment varies with mood, fatigue, and context
- **Bias resistance:** Models use only empirically validated data, avoiding [[availability]], [[representativeness]], and [[anchoring-and-adjustment]] distortions
- **Transparency:** The weights reveal what matters, enabling organizational learning

Key evidence: Einhorn (1972) showed physicians could code relevant biopsy features but not integrate them into accurate survival predictions; a regression model using their own variables could. Dawes (1971) showed a linear model outperformed an admissions committee. Schmidt and Hunter (1998) found unstructured interviews predict only 14% of job performance variance.

Practical forms include expected-value calculations, multi-attribute utility models, structured interviews, and statistical prediction rules.

### Strategy 2: Acquire Expertise
Experience alone does not debias. Tversky and Kahneman (1986) identify four conditions required for learning from experience -- all rarely met in real-world decisions: (i) immediate feedback, (ii) low environmental variability, (iii) counterfactual information, (iv) repeated similar decisions. Without these conditions, biases persist or even strengthen with experience (Neale & Northcraft, 1987 showed real-estate agents were as anchored as students).

**The experience/expertise distinction** (Neale & Northcraft, 1989): Experience is passive repeated feedback. Expertise is a "strategic conceptualization" of what rational decision-making entails and which biases threaten it. True expertise requires:
- Awareness of the biases documented across Chapters 1-11
- Understanding **why** biases occur (the underlying heuristics)
- Transferable knowledge that works in new contexts
- Continuous monitoring of one's own decision processes

The "Acquiring a Company" experiment (Ball, Bazerman, & Carroll, 1991) demonstrates the failure of experience: across 20 trials with full feedback and real money, only 5 of 72 MBA participants learned to avoid the [[bounded-awareness]] trap. Even hundreds of trials fail (Bereby-Meyer & Grosskopf, 2008).

### Strategy 3: Debias Your Judgment
The most direct attack on bias, structured around Lewin's three-stage change model:

**Unfreezing** -- Overcoming resistance to acknowledging flawed judgment. Three forces resist change:
1. Years of reliance on intuitive strategies create inertia
2. Past professional success provides positive reinforcement for current (biased) approaches
3. Balance theory (Heider, 1958): "my decisions are flawed" conflicts with "I am successful," so the latter cognition dominates

**Change** -- Three steps:
1. Clarify the specific judgmental deficiency (abstract from the concrete example to the general bias)
2. Explain the roots -- the heuristic or psychological mechanism that produces the bias
3. Reassure that biases are universal, not personal failings

The most powerful general-purpose technique is **"consider the opposite"** (Lord, Lepper, & Preston, 1984): deliberately play devil's advocate with your own conclusions. This directly counteracts [[confirmation-heuristic]] and reduces [[overconfidence-in-calibration]], hindsight, and [[anchoring-and-adjustment]] effects (Larrick, 2004; Mussweiler, Strack, & Pfeiffer, 2000). Baron (1994) refines this into two sub-strategies:
- Ask: "How likely is a yes answer if my hypothesis is false?"
- Generate alternative hypotheses and choose the test that best distinguishes them

**Refreezing** -- New strategies must become intuitive through repeated conscious application. Schedule routine "checkups" to evaluate recent decisions for bias. Without periodic reinforcement, old biases return because the underlying heuristics are cognitively natural.

Fischhoff (1982) warns that debiasing is "extremely difficult" and must be "closely monitored and guided by a psychological framework for change." Simply warning people about a bias (e.g., hindsight bias) and instructing them to avoid it does not eliminate it.

### Strategy 4: Reason Analogically
Analogical reasoning -- abstracting common lessons from two or more situations -- is a remarkably effective debiasing technique. When people learn from a single case, they focus on superficial context features and assume the lesson applies only to that specific domain. When they compare two structurally similar cases, they identify the shared deep structure and form an abstract schema that transfers to new situations (Thompson, Gentner, & Loewenstein, 2000).

Key findings:
- **Similarity-based comparison:** Gentner, Loewenstein, and Thompson (2003a) showed that participants who compared two analogous negotiation exercises and explained how they were related achieved greater debiasing than those who analyzed each exercise separately
- **Difference-based comparison:** Idson et al. (2004) showed that examining differences between two versions of the same problem (e.g., two versions of the Monty Hall problem) helped participants generalize principles that transferred even to the resistant "Acquiring a Company" problem
- **Diverse analogical training:** Moran, Bereby-Meyer, and Bazerman (2008) found that comparing two cases illustrating different value-creating strategies (e.g., logrolling vs. compatibility) fostered deeper learning of general principles than specific training on a single strategy -- though training that is too diverse may lose applicability

The practical implication: when learning a principle, always study at least two examples and explicitly compare their structural similarities and differences. This is why case-based teaching works better than lectures for transferable learning.

### Strategy 5: Take an Outsider's View
Kahneman and Lovallo (1993) distinguish two perspectives:
- The **insider view**: treats each decision as unique, focuses on specifics, tends toward [[overestimation]] driven by optimism and [[overconfidence-in-calibration]]
- The **outsider view**: generalizes across similar past situations, incorporates [[base-rate-neglect]]-corrected statistical base rates

The insider view dominates because we instinctively attend to the details of our particular situation rather than historical patterns. Key demonstrations:
- Kahneman's curriculum team estimated 18-30 months; reference class data showed 40% of comparable projects were never completed, none in under seven years (actual: eight years)
- 80%+ of entrepreneurs rate their success probability at 70%+; actual five-year survival rate is ~33% (Cooper, Woo, & Dunkelberg, 1988)
- People predict friends' renovations will go 20-50% over budget while believing their own will finish on time

**Practical techniques:**
- Ask a trusted friend or colleague with relevant experience for their honest estimate
- Imagine the decision is a friend's and ask what advice you would give
- Explicitly identify the reference class of similar past decisions and look up the base rates
- The key is giving the outsider perspective a stronger voice in the final decision

### Strategy 6: Understand Biases in Others
Extends debiasing from self-audit to auditing the decisions, recommendations, and forecasts of others. The same biases that affect your own judgment affect everyone you work with -- subordinates, advisers, analysts, competitors.

**The regression-to-the-mean correction:** When an analyst's forecast deviates from the group mean, adjust it back toward the mean in proportion to the analyst's historical accuracy. Kahneman and Tversky (1982) formalize this as a five-step process:
1. Select a comparison group
2. Assess the distribution of the comparison group
3. Incorporate intuitive estimation (identify the forecast to be adjusted)
4. Assess the correlation between past forecasts and actual outcomes
5. Apply: adjusted estimate = group mean + correlation x (initial estimate - group mean)

**Three-phase model for general bias correction in others:**
1. Accurately perceive the decision context
2. Identify the likely bias(es) at work
3. Make appropriate logical adjustments

**Competitive exploitation:** Fuller and Thaler created mutual funds that profit from predictable biases in other market participants (e.g., analyst underreaction to positive news creates temporary undervaluation). Understanding biases in others is not merely defensive -- it can be a source of strategic advantage.

### Strategy 7: Nudge Wiser and More Ethical Decisions
Drawing on Thaler and Sunstein's (2008) *Nudge*, this strategy shifts from changing individual minds to designing **choice architectures** that anticipate human biases and channel behavior toward better outcomes -- while preserving freedom of choice ("libertarian paternalism").

Key examples:
- **Organ donation:** Switching from opt-in to opt-out programs increases donation rates from 4-28% to 86-100% (Johnson & Goldstein, 2003). The current system exploits [[loss-aversion]] and status quo bias to produce suboptimal outcomes; changing the default reverses these forces.
- **Save More Tomorrow** (Thaler & Benartzi, 2004): Workers commit in advance to increase 401(k) contributions with future raises. Leverages [[hyperbolic-discounting]], inertia, and [[loss-aversion]] (increases come from new income, not current pay). Tripled savings rates in two years; adopted by 39% of large U.S. employers by 2007.
- **Joint evaluation in hiring** (Bohnet, van Geen, & Bazerman, 2012): Evaluating candidates one-at-a-time activates gender stereotypes; evaluating two or more jointly shifts focus to individual capabilities, producing both more ethical and more accurate hiring.

Nudges can be quite simple. The principle: think about the mistakes humans predictably make, then design systems that correct for those mistakes by changing defaults, frames, or comparison contexts.

## Key Findings

- The seven strategies are complementary, not competing -- different strategies work best for different bias types and decision contexts
- Strategies 1-3 are **broad-spectrum** (aim to change general intuitive tendencies); Strategies 4-7 are **targeted** (improve specific decisions in specific contexts)
- Individual debiasing (Strategies 1-5) has limited durability without systemic support; Strategy 7 (nudging) provides the structural reinforcement that makes individual gains stick
- "Consider the opposite" is the single most powerful general-purpose debiasing technique (Larrick, 2004)
- Debiasing is an ongoing process, not a one-time fix -- Lewin's refreezing stage requires continuous vigilance and periodic self-audits
- Managers should reward good decision processes, not just good outcomes, because uncertainty means good decisions sometimes fail and bad decisions sometimes succeed

## Mechanisms

Debiasing works by interrupting the automatic [[system-1-system-2|System 1]] heuristic processes that produce bias and engaging deliberate System 2 reasoning. Each strategy targets a different point in the bias-production chain:

| Strategy | Mechanism | Primary Biases Targeted |
|----------|-----------|------------------------|
| 1. Decision-analysis tools | Replace intuitive integration with algorithmic integration | [[availability]], [[representativeness]], [[anchoring-and-adjustment]], inconsistency |
| 2. Acquire expertise | Build strategic conceptualization of rational decision-making | All biases (general awareness) |
| 3. Debias your judgment | Unfreeze-change-refreeze cycle; "consider the opposite" | [[confirmation-heuristic]], [[overconfidence-in-calibration]], [[anchoring-and-adjustment]] |
| 4. Reason analogically | Abstract structural principles from case comparisons | Context-bound learning, failure to transfer |
| 5. Take an outsider's view | Shift from insider uniqueness to reference-class base rates | [[overestimation]], [[overconfidence-in-calibration]], planning fallacy |
| 6. Understand biases in others | Regression-to-mean correction; bias identification in others | [[regression-to-the-mean]] neglect, all biases (in others) |
| 7. Nudge | Redesign choice architecture to channel behavior | [[loss-aversion]], status quo bias, [[hyperbolic-discounting]], inertia |

## Applications

- **Hiring:** Use structured interviews + linear models (Strategy 1); evaluate candidates jointly rather than separately (Strategy 7)
- **Forecasting and planning:** Apply outsider view with reference-class data (Strategy 5); adjust analysts' forecasts toward the mean using the five-step process (Strategy 6)
- **Negotiation:** Compare multiple case studies to build transferable schemas (Strategy 4); consider the opposite of your assumptions about the other party's intentions (Strategy 3)
- **Investment:** Prefer index funds over active management to avoid [[overconfidence-in-calibration]] (Strategy 1); exploit others' biases as Fuller-Thaler does (Strategy 6)
- **Policy design:** Use opt-out defaults, commitment devices, and joint evaluation to nudge better societal outcomes (Strategy 7)
- **Personal decisions:** Schedule periodic decision audits (Strategy 3 refreezing); ask friends for outsider estimates on important life decisions (Strategy 5)

## Cross-References

- **Related concepts:** [[system-1-system-2]], [[bounded-rationality]], [[overconfidence-in-calibration]], [[confirmation-heuristic]], [[anchoring-and-adjustment]], [[loss-aversion]], [[availability]], [[representativeness]], [[overestimation]], [[hyperbolic-discounting]], [[base-rate-neglect]], [[regression-to-the-mean]], [[preference-reversal]], [[bounded-awareness]], [[fundamental-attribution-error]]
- **Key authors:** [[entities/people/kahneman]], [[entities/people/tversky]], Bazerman, Moore, Fischhoff, Larrick, Dawes, Thaler, Sunstein
- **Frameworks that use this:** [[entities/frameworks/system-1-system-2]], Lewin's change model (unfreeze-change-refreeze), Thaler & Sunstein's choice architecture
- **Source summary:** [[summary-2-08-bazerman-ch13]]

## Fischhoff's Foundational Debiasing Taxonomy (1982)

Bazerman and Moore's seven strategies build on Fischhoff's earlier foundational taxonomy ([[debiasing-taxonomy]]), which classifies debiasing methods by their implicit assumption about the source of the bias ([[summary-2-06-hb-ch31-debiasing]]):

- **Faulty tasks:** The experimental situation was unfair (raise stakes, clarify instructions) or misunderstood (demonstrate alternative goals, semantic disagreement)
- **Faulty judges:** Perfectible individuals (warn, describe, provide feedback, train) or incorrigible individuals (replace, recalibrate, plan on error)
- **Mismatch between judge and task:** Restructuring (make knowledge explicit, search for discrepant information, decompose problems, consider alternatives) or education (rely on experts, educate from childhood)

Fischhoff's exhaustive review of debiasing attempts for [[hindsight-bias]] and [[overconfidence-in-calibration]] found that **mechanical manipulations (raising stakes, changing response format) rarely succeed, while psychological manipulations (changing how people think about the problem) sometimes do.** The most effective specific technique: having respondents list reasons why their preferred answer might be wrong (Koriat, Lichtenstein, & Fischhoff, 1980) -- a finding that directly informs Bazerman & Moore's Strategy 3 ("consider the opposite").

## Open Questions

- **Durability:** How long do debiasing gains from Strategy 3 (unfreezing/change/refreezing) persist without reinforcement? Larrick (2004) notes most gains are short-term without continued practice.
- **Interaction effects:** Do the seven strategies compound, or do some partially substitute for others? The chapter presents them as complementary but provides little evidence on their combined effects.
- **Cultural variation:** Most debiasing research uses Western (often MBA) samples. Do the same strategies work across cultures where decision-making norms differ?
- **AI and algorithms:** As decision-analysis tools (Strategy 1) become more powerful through machine learning, how does the human role in "choosing variables and setting weights" evolve? Does algorithmic decision-making create new biases even as it eliminates old ones?
- **Ethical dimensions of nudging:** When does nudging cross from libertarian paternalism into manipulation? Who decides what constitutes a "better" decision? The authors assume organ donation and higher savings are uncontroversially good, but many nudge applications involve more contested values.
