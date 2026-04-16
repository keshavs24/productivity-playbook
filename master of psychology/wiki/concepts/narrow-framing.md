---
title: "Narrow Framing"
type: concept
phase: [2]
authors: [Daniel Kahneman, Dan Lovallo, Amos Tversky]
sources: ["[[2-07 - Choices, Values, and Frames (Collection) - Kahneman, Tversky]]"]
confidence: 0.7
source_count: 1
created: 2026-04-14
updated: 2026-04-14
supersedes: []
tags: [framing, risk-aversion, loss-aversion, mental-accounting, decision-making, phase-2]
status: active
---

# Narrow Framing

**Phase(s):** 2
**Confidence:** 0.7

## Definition

Narrow framing (also called narrow bracketing or isolation) is the tendency to **evaluate risky choices one at a time** rather than as part of a portfolio of decisions. When a decision maker adopts a narrow frame, each gamble or risky prospect is assessed in isolation -- as if it were the only decision the person will ever face -- rather than being aggregated with concurrent and future risky choices.

Narrow framing is consequential because, when combined with [[loss-aversion]], it produces **excessive risk aversion**. A gamble that would be rejected in isolation (because the pain of the potential loss outweighs the pleasure of the potential gain) may become attractive when considered as part of a larger portfolio, where the law of large numbers reduces the probability of a net loss. By failing to aggregate, decision makers forgo the risk-reducing benefits of statistical diversification and end up paying an unnecessarily high "certainty premium" to avoid risks.

## Key Findings

### The Concurrent-Decisions Demonstration (Tversky and Kahneman 1986)
Subjects were given two decisions simultaneously:
- Decision (i): Choose between (A) a sure gain of $240 [84%] or (B) 25% chance to gain $1,000 [16%]
- Decision (ii): Choose between (C) a sure loss of $750 [13%] or (D) 75% chance to lose $1,000 [87%]

Most subjects chose A & D. But A & D combined (25% chance to win $240, 75% chance to lose $760) is **dominated** by B & C combined (25% chance to win $250, 75% chance to lose $750). Narrow framing of each decision separately led to a dominated combined outcome.

### Samuelson's Problem (Samuelson 1963)
Many people reject a single play of a gamble offering equal chances to win $200 or lose $100, but would accept multiple plays -- especially when the compound distribution of outcomes is made explicit (Redelmeier and Tversky 1992). The key insight from Kahneman and Lovallo: the person offered a single play is almost certainly not facing their last opportunity to accept a positive-EV gamble. Future similar opportunities exist, so the single play should be evaluated as part of a broader policy for m + 1 such gambles, where m is the number of similar opportunities expected within the planning horizon.

### The Costs of Isolation (Kahneman and Lovallo 1993)
Using a prospect-theory utility function (power function with exponent 0.575, loss aversion coefficient 2.5):
- An individual indifferent to a single (50/50: win $250 or lose $100) gamble would value **two** such gambles at $45 and **six** at $304
- A portfolio of three gambles evaluated together commands a certainty premium of only 13% of expected value vs. 40% when evaluated individually
- The cost of narrow framing: **27% of expected value** lost to unnecessary risk aversion
- With broader aggregation, even extreme individual risk aversion "quickly vanishes when gambles are considered part of a portfolio"

### Myopic Loss Aversion (Benartzi and Thaler 1995)
[[myopic-loss-aversion]] is the combination of narrow framing with loss aversion applied to investment evaluation. Investors who evaluate portfolio returns frequently (e.g., daily or monthly) experience more frequent paper losses and thus demand a higher risk premium than investors who evaluate infrequently. This helps explain the equity premium puzzle -- the historically large gap between stock and bond returns.

## Mechanisms

1. **Cognitive isolation:** Each decision problem naturally occupies its own mental frame. Concurrent decisions and future opportunities are not spontaneously integrated ([[mental-accounting]])
2. **Loss aversion amplification:** Within a narrow frame, the potential loss on each individual gamble looms large (weighted ~2-2.5x vs. gains). With aggregation, the probability of a net loss across the portfolio drops rapidly, neutralizing loss aversion
3. **Certainty effect interaction:** The narrow frame makes the certainty of the status quo (not taking the gamble) especially attractive relative to the uncertainty of the gamble
4. **Near-proportionality:** Risk attitudes are approximately proportional across stake sizes, meaning people are nearly as risk averse for small gambles as for large ones -- which is incoherent when small gambles can be aggregated

## Applications

- **Investment policy:** Evaluate portfolio performance less frequently. An investor who checks returns daily will perceive more losses and demand a higher risk premium than one who checks annually
- **Organizational risk management:** Group risky decisions into portfolios. A CEO who evaluates each division's risky project independently will approve fewer positive-EV projects than one who evaluates the aggregate risk across all divisions
- **Personal decision making:** When facing a risky choice, ask: "How many decisions like this will I face in my lifetime?" If the answer is many, adopt a risk policy rather than agonizing over each individual gamble
- **Entrepreneurship:** The risk of any single venture may be high, but a career containing multiple ventures (or an economy containing many entrepreneurs) benefits from aggregation

## Cross-References

- **Related concepts:** [[loss-aversion]], [[framing-effects]], [[mental-accounting]], [[myopic-loss-aversion]], [[inside-view-outside-view]], [[prospect-theory]]
- **Key authors:** [[kahneman]], [[tversky]], [[lovallo]], [[thaler]]
- **Applied in:** [[summary-2-07-cvf-ch22-timid-choices]]

## Open Questions

- Can people be trained to spontaneously adopt broader frames? The evidence suggests this is difficult, as narrow framing is deeply natural. Institutional nudges (e.g., less frequent reporting) may be more effective than individual training.
- How does narrow framing interact with the planning fallacy? The [[inside-view-outside-view]] distinction addresses optimism in forecasting; narrow framing addresses excess caution in choice. Together they produce the paradox of the chapter's title: bold forecasts + timid choices.
