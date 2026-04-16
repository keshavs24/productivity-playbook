---
title: "Timid Choices and Bold Forecasts — Summary"
type: summary
phase: [2]
authors: [Daniel Kahneman, Dan Lovallo]
sources: ["[[2-07 - Choices, Values, and Frames (Collection) - Kahneman, Tversky]]"]
confidence: 0.7
source_count: 1
created: 2026-04-14
updated: 2026-04-14
tags: [risk-taking, inside-view, outside-view, narrow-framing, overconfidence, loss-aversion]
status: active
---

# Timid Choices and Bold Forecasts: A Cognitive Perspective on Risk Taking — Summary

**Author(s):** Daniel Kahneman and Dan Lovallo
**Type:** Book chapter (reprinted from *Management Science*, Vol. 39, No. 1, January 1993)
**Phase:** 2
**Date ingested:** 2026-04-14

## Key Takeaways

1. **Decision makers are subject to two conflicting biases that both stem from treating problems as unique:** (a) they adopt an [[inside-view-outside-view|inside view]] of forecasting that anchors on plans and scenarios, producing overly optimistic predictions ("bold forecasts"); and (b) they evaluate risky prospects one at a time using [[narrow-framing]], producing excessive risk aversion ("timid choices").
2. **The inside view vs. outside view distinction is one of the most important practical debiasing tools in the entire curriculum.** The inside view focuses on the unique features of the case at hand and constructs scenarios of future progress; the outside view ignores case specifics and instead looks at distributional data from a reference class of similar cases. The outside view is statistically superior but psychologically unnatural.
3. **Narrow framing combined with [[loss-aversion]] produces irrational levels of risk aversion.** When gambles are evaluated in isolation, people treat each as if it were their last decision, ignoring the risk-reducing effects of statistical aggregation across a portfolio of decisions. Even moderate risk aversion on individual problems implies near-risk-neutrality when those problems are aggregated, yet people fail to aggregate.
4. **Bold forecasts and timid choices partially cancel each other out, but this is not a reliable equilibrium.** The conjunction of biases is less disastrous than either alone, but "there ought to be a better way to control choice under risk than pitting two mistakes against each other."
5. **Organizations amplify rather than correct these biases.** Accountability, blame asymmetry, adversarial forecasting, groupthink, and the winner's curse all make organizational decisions at least as biased as individual ones.

## Detailed Notes

### Part 1: Timid Choices

The chapter identifies three well-established psychological facts about risk attitudes that jointly produce excessive risk aversion:

#### Risk Aversion
- Most people are generally risk averse: they prefer a sure thing to a gamble of equal expected value, and a low-variance gamble over a riskier one
- Two important exceptions: (1) people overpay for lottery tickets (risk-seeking for small probabilities of large gains); (2) people are risk-seeking in the domain of losses (preferring a gamble to a sure loss)
- The standard interpretation is decreasing marginal utility of gains, but [[prospect-theory]] adds two further causes: the certainty effect (overweighting sure gains vs. highly probable gains) and [[loss-aversion]] (losses weighted ~2-2.5x more than equivalent gains)
- Loss aversion is amplified in organizational contexts: the asymmetry between credit and blame enhances the gains/losses asymmetry in the decision maker's personal utilities. Decision makers become more risk averse when expecting review by others (Tetlock and Boettger 1991)

#### Near-Proportionality
- Risk attitudes are approximately proportional to stakes: cash equivalents for gambles of increasing size scale nearly linearly with the stakes
- A proportionately risk-averse individual who values a 0.50 chance to win $100 at $30 will value a 0.50 chance to win $1,000 at roughly $300, and a 0.50 chance to win $100,000 at approximately $30,000
- This is unreasonable because: (1) small gambles do not threaten survival and need not be avoided; (2) small gambles recur, offering aggregation opportunities
- If value follows a power function, u(x) = x^a, near-proportionality is explained by a being close to but less than 1 (Tversky and Kahneman 1992 estimated a = 0.73)

#### Narrow Decision Frames
- People tend to consider decision problems one at a time, isolating each from concurrent and future choices
- Classic demonstration: Tversky and Kahneman (1986) showed subjects prefer A ($240 sure) over B (25% of $1,000) AND prefer D (75% lose $1,000) over C (sure loss of $750). But A & D combined is dominated by B & C combined
- Samuelson's (1963) problem: people reject a single play of (50% win $200, 50% lose $100) but accept multiple plays -- especially when the compound distribution is shown. The individual who rejects one play is almost certainly facing future similar gambles, so should treat the single play as part of a broader policy

#### The Costs of Isolation
- The chapter provides a rigorous numerical demonstration of how aggregation erases risk aversion
- A proportionately risk-averse individual (power function with exponent 0.575, loss aversion coefficient 2.5) who is indifferent between a (0.50 chance to win $250 or lose $100) gamble and the status quo would value:
  - Two such gambles at $45 (not $0)
  - Six such gambles at $304 (average incremental value of $65, close to the EV of $75)
- A portfolio of three gambles (one 0.50 chance at $500, two at $250 each) has a certainty premium of only 13% of expected value, compared to 40% when evaluated individually. The cost of isolation is 27% of expected value
- Key implication: "A rational decision maker who applies a proportionately risk averse utility function to aggregate outcomes will set cash equivalents closer to risk neutrality for small gambles than for large ones"

### Part 2: Risk Taking in Organizations

#### Loss Aversion in Organizations
- Factors producing individual risk aversion are not neutralized in organizations; they may be strengthened
- Control procedures bias managers against choices that might lead to losses
- Swalm (1966): a manager at "an industrial giant" would decline a project with a 50-50 chance of gaining $300,000 or losing $60,000 for his company -- a 5:1 gain-to-loss ratio rejected because of loss aversion
- Several respondents stated their choices were "not in the best interests of the company" but in their own interests "as aspiring executives"

#### Narrow Framing in Organizations
- A consistent risk policy requires: (1) grouping superficially different problems together; (2) an appropriate procedure for evaluating aggregate performance
- Each decision may seem unique and large from the decision maker's level, even if it is recurrent and moderate from the firm's perspective
- Reducing the frequency of performance evaluations mitigates loss aversion (cf. [[myopic-loss-aversion]] -- Benartzi and Thaler)
- Executives in a hierarchy should encourage subordinates to adopt a higher level of risk acceptance than feels comfortable, because aggregation across subordinates' decisions reduces overall portfolio risk
- The "you win a few and you lose a few" attitude is a useful antidote to narrow framing, but it conflicts with imperatives for high standards and tight supervision

### Part 3: Bold Forecasts

#### The Inside View and the Outside View
- Kahneman's autobiographical curriculum story is the paradigm case: a team estimated 18-30 months to complete a curriculum project. When the outside view was invoked (what happened to similar teams?), the expert recalled that 40% of comparable teams never finished at all, and none finished in less than seven years. The team's own project took approximately eight years
- **Inside view:** focuses on the specifics of the case, the details of the plan, ideas about obstacles and how to overcome them. In its extreme form, it constructs a "representative scenario" of the future history
- **Outside view:** ignores the details of the case at hand. Instead it identifies a reference class of similar past cases and examines the distribution of outcomes in that class. It is "essentially statistical and comparative"
- The outside view is statistically superior because: (1) the future of a long undertaking is not foreseeable in detail; (2) the ensemble of possible future histories is huge and any specific scenario has negligible probability; (3) "although some scenarios are more likely or plausible than others, it is a serious error to assume that the outcomes of the most likely scenarios are also the most likely"
- **The inside view is overwhelmingly preferred in intuitive forecasting.** "The natural way to think about a problem is to bring to bear all one knows about it, with special attention to its unique features." The detour into statistics of related cases is psychologically unnatural and sometimes feels morally wrong (physicians and lawyers argue against statistical reasoning for particular cases)
- Consensus on a forecast does not validate it: "a shared deficiency of reasoning will also yield consensus"
- Statistical knowledge that is known to the forecaster will not necessarily be used, or even retrieved, when an inside view forecast is being made (Kahneman and Tversky 1973)

#### Overconfidence
- Massive evidence that people are overconfident in probability assignments: only ~80% correct when saying "99% sure"
- But there is no overconfidence when people estimate their overall accuracy after a session -- global estimates are accurate or slightly pessimistic (Gigerenzer et al. 1991, Griffin and Tversky 1992)
- This mirrors the inside/outside view distinction: evaluating individual items (inside view) produces overconfidence; evaluating aggregate performance (outside view) does not
- Cooper et al. (1988): over 80% of entrepreneurs estimated their own chance of success at 70% or better; one-third said success was certain. Meanwhile the five-year survival rate for new firms is around 33%

#### Unrealistic Optimism
- Three forms of optimistic bias (Taylor and Brown 1988): (1) unrealistically positive self-evaluations; (2) unrealistic optimism about future events; (3) illusion of control
- Most people believe themselves above median on nearly every positive trait (safe driving, sense of humor, managerial risk-taking)
- Managers view risk as a challenge to be overcome by skill, not as an uncontrollable factor to be accepted (March and Shapira 1987)

#### Organizational Optimism
- Organizations do not reliably correct optimistic bias. For unique/significant problems, there is no statistical quality control
- Adversarial resource competition incentivizes optimistic forecasts: only projects with highly favorable forecasts survive the competition for funding, and the winning project is disproportionately likely to have the largest optimistic error (winner's curse logic)
- Forecasts become targets, which creates incentives for optimistic goal-setting
- Pessimism is interpreted as disloyalty; bearers of bad news are shunned; groupthink reinforces optimistic biases
- Capital investment projects routinely finish late, over budget, and below initial goals. Rand Corporation data on pioneer process plants: actual costs typically more than double first estimates. PIMS data: >80% of projects fell short of planned market share
- Mergers and acquisitions: bidding firms on average do not make positive returns. Roll (1986) offers a "hubris hypothesis" -- firms overestimate synergies and their ability to manage the acquired firm

#### Costs and Benefits of Optimism
- Realism can be pathological and self-defeating (Taylor and Brown 1988): optimistic self-delusion is diagnostic of mental health and contributes to persistence
- This creates a genuine dilemma for organizations: "Is there a point at which truth becomes destructive and doubt self-fulfilling?"
- Kahneman and Lovallo leave this as an open tension, noting that some organizations maintain "two sets of forecasting books" (Bromiley 1986)

### Part 4: Concluding Remarks

- **Bold forecasts and timid attitudes to risk tend to have opposite effects.** It would be fortunate if they canceled out, but there is no reason to expect such a perfect outcome
- Corrective attempts should address both biases simultaneously. Increasing risk-taking alone could go too far if forecasts remain optimistic. Improving forecast realism alone could cause paralysis if risk aversion is uncorrected
- **The prescriptive recommendation:** adopt the [[inside-view-outside-view|outside view]] for both forecasting and risk policy. Treat the problem at hand as an instance of a broader category. This simultaneously reduces optimistic forecast bias and facilitates a consistent, portfolio-based risk policy
- People are strongly biased toward the inside view and will treat significant problems as unique even when reference-class data is available. "A deliberate effort will therefore be required to foster the optimal use of outside and inside views in forecasting, and the maintenance of globally consistent risk attitudes in distributed decision systems"

## New Entities Introduced

- [[lovallo]] — Dan Lovallo, co-author with Kahneman; organizational decision-making scholar

## New Concepts Introduced

- [[inside-view-outside-view]] — The central distinction: case-specific forecasting (inside) vs. reference-class forecasting (outside)
- [[narrow-framing]] — Evaluating risky choices one at a time rather than as a portfolio

## Cross-References

- [[loss-aversion]] — The 2-2.5x asymmetry between losses and gains is the primary engine driving "timid choices"
- [[overconfidence-in-calibration]] — Individual-item overconfidence vs. aggregate accuracy maps directly onto inside vs. outside view
- [[framing-effects]] — Narrow vs. broad framing of decisions determines whether aggregation benefits are realized
- [[bounded-rationality]] — The chapter's thesis is a specific form of bounded rationality: people are bounded in their ability to aggregate across decisions and to adopt reference-class reasoning
- [[debiasing-strategies]] — The outside view is presented as one of the most practical debiasing tools: simply ask "what happened to others in this situation?"
- [[prospect-theory]] — The chapter builds directly on prospect theory's value function (concave for gains, convex for losses, steeper for losses)
- [[myopic-loss-aversion]] — Benartzi and Thaler's concept (Ch. 17 in the same volume) is closely related: loss aversion + short evaluation periods = excessive risk aversion
- [[behavioral-finance]] — The chapter applies to capital investment, M&A, and entrepreneurial entry decisions

## Contradictions or Tensions

- The chapter acknowledges a genuine tension between the benefits of optimism (motivation, persistence, mental health) and the costs of unrealistic forecasts. Taylor and Brown (1988) argue optimistic self-delusion is healthy; Kahneman and Lovallo see it as a source of costly errors. No clean resolution is offered.
- The recommendation to encourage subordinates to accept more risk conflicts with the organizational reality that failure consequences fall disproportionately on the subordinate. The authors acknowledge this tension but do not resolve it.

## Quotes Worth Keeping

> "The thesis of this essay is that decision makers are excessively prone to treat problems as unique, neglecting both the statistics of the past and the multiple opportunities of the future." — Kahneman & Lovallo

> "We are surely not the only team to have tried to develop a curriculum where none existed before. Please try to recall as many such cases as you can... How long did it take them, from that point, to complete their projects?" — Kahneman's prompt to the curriculum expert, the paradigm example of invoking the outside view

> "Several respondents stated quite clearly that they were aware that their choices were not in the best interests of the company, but that they felt them to be in their own best interests as aspiring executives." — On organizational loss aversion amplifying individual risk aversion

> "Managers accept risks, in part, because they do not expect that they will have to bear them." — March and Shapira (1987), quoted in the chapter's concluding remarks
