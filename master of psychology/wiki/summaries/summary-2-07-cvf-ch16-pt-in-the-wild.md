---
title: "Prospect Theory in the Wild: Evidence from the Field — Summary"
type: summary
phase: [2]
authors: [Colin F. Camerer]
sources: ["[[2-07 - Choices, Values, and Frames (Collection) - Kahneman, Tversky]]"]
confidence: 0.7
source_count: 1
created: 2026-04-14
updated: 2026-04-14
tags: [prospect-theory, behavioral-finance, loss-aversion, field-evidence, disposition-effect, labor-supply, status-quo-bias, endowment-effect, horse-racing, insurance, lottery, phase-2]
status: active
---

# Prospect Theory in the Wild: Evidence from the Field — Summary

**Author(s):** Colin F. Camerer
**Type:** Book chapter (Ch. 16 in *Choices, Values, and Frames*)
**Phase:** 2
**Date ingested:** 2026-04-14

## Key Takeaways

1. Prospect theory can parsimoniously explain **10 distinct field phenomena** across finance, labor economics, consumer goods, insurance, and gambling that are anomalies for expected utility theory.
2. Three simple elements of prospect theory -- [[loss-aversion]], the [[reflection-effect]], and nonlinear probability weighting -- plus the assumption of narrow bracketing (isolated decision-making), account for all 10 patterns.
3. Expected utility theory requires contradictory ad hoc assumptions to explain these patterns individually (e.g., convex utility for lotteries contradicts the equity premium), while prospect theory explains them all consistently.
4. A crucial common thread: people must be **isolating or narrowly bracketing** decisions for prospect theory effects to manifest in field data.
5. Prospect theory is not merely a laboratory curiosity -- it has real explanatory power for naturally occurring economic phenomena with high-stakes decisions by experienced agents.

## Detailed Notes

### Table 16.1: Ten Field Phenomena

Camerer's master table organizes all 10 phenomena by domain, description, data type, isolated decision context, key prospect theory ingredient, and references:

| # | Domain | Phenomenon | PT Ingredient |
|---|--------|-----------|---------------|
| 1 | Stock market | [[equity-premium-puzzle]] | [[loss-aversion]] |
| 2 | Stock market | [[disposition-effect]] | [[reflection-effect]] |
| 3 | Labor economics | Downward-sloping labor supply | [[loss-aversion]] |
| 4 | Consumer goods | Asymmetric price elasticities | [[loss-aversion]] |
| 5 | Macroeconomics | Insensitivity to bad income news | Loss aversion + [[reflection-effect]] |
| 6 | Consumer choice | [[status-quo-bias]] / default bias | [[loss-aversion]] |
| 7 | Horse race betting | Favorite-longshot bias | Overweight low p(loss) |
| 8 | Horse race betting | End-of-the-day effect | [[reflection-effect]] |
| 9 | Lottery | Lotto demand | Overweight low p(win) |
| 10 | Insurance | Telephone wire repair insurance | Overweight low p(loss) |

### 1. Finance: The Equity Premium

The [[equity-premium-puzzle]] (Mehra & Prescott 1985): Stocks returned ~8% per year more than bonds over most of the 20th century. Under standard expected utility with reasonable risk aversion, the premium should be much smaller. A person with enough risk aversion to explain the premium would be indifferent between a coin flip paying $50,000 or $100,000 and a sure $51,209 -- absurdly risk-averse.

**Prospect theory explanation (Benartzi & Thaler 1995/1997):** Investors are not averse to variability of returns per se; they are averse to **loss** (negative returns). Annual stock returns are negative much more frequently than annual bond returns. With a [[loss-aversion]] coefficient of 2.25, and assuming investors evaluate portfolios over a **1-year horizon** (myopic loss aversion), the prospect values of stock and bond returns are roughly equal when stocks return 8% more -- exactly matching the observed premium.

Barberis, Huang, and Santos (1999) extended this by incorporating loss aversion into a standard general equilibrium asset pricing model, showing that loss aversion plus a "house money effect" (increased risk preference after gains) are both needed.

### 2. Finance: The Disposition Effect

Shefrin and Statman (1985) predicted that loss-averse investors who are risk-seeking in the domain of losses will: hold losing stocks too long (gambling for recovery) and sell winning stocks too early (locking in the sure gain). They named this the [[disposition-effect]].

**Odean's field study (in press at time of writing):** Obtained data from a brokerage firm covering all purchases and sales of a large sample of individual investors. Found:
- Investors held losing stocks a **median of 124 days** vs. only **104 days** for winners
- The unsold losers subsequently returned only **5%** in the following year
- The sold winners subsequently returned **11.6%** -- investors sold the wrong stocks
- The winner-loser holding difference **disappears in December** when tax-loss selling motivation temporarily overwhelms the disposition effect
- Weber and Camerer (1998) confirmed in experiments: subjects whose shares were automatically sold did not buy back losers more than winners, showing the effect is about reluctance to realize losses, not optimism about loser recovery

**Genovese and Meyer (in press):** Strong disposition effect in housing -- owners who face a nominal loss set prices too high and keep houses on the market too long before selling.

### 3. Labor Supply: NYC Cab Drivers

Camerer, Babcock, Loewenstein, and Thaler (this volume, Ch. 20) studied when NYC cab drivers quit for the day. Drivers lease cabs for a fixed fee for up to 12 hours. Many reported setting a **daily income target** and quitting when they reach it.

**Implication of daily targeting:** Drivers work long hours on bad days (low per-hour wage) and quit early on good days (high per-hour wage). This produces a **negative correlation** between hours and daily wage -- the opposite of standard labor supply theory, which predicts working more when wages are high.

**Data:** Correlation between hours and wages was **strongly negative** for inexperienced drivers and **close to zero** for experienced drivers. This suggests inexperienced drivers begin with the income-targeting heuristic but either quit driving or learn to shift toward fixed hours.

**PT explanation:** Drivers take a 1-day horizon and have a utility function that bends sharply at their daily income target (reference point). Falling short of the target feels like a "loss," creating strong motivation to keep working. Exceeding the target produces diminishing marginal gains, reducing motivation. This is [[loss-aversion]] applied to labor supply with a daily income reference point.

### 4. Asymmetric Price Elasticities of Consumer Goods

Loss-averse consumers dislike price increases (coded as losses relative to the reference price) more than they enjoy equivalent price decreases (coded as gains). This predicts **asymmetric elasticities**: quantity demanded should be more sensitive to price increases than to price decreases.

**Putler (1992):** Found this asymmetry in consumer purchases of eggs.

**Hardie, Johnson, and Fader (1993):** Replicated using a brand choice model for orange juice with scanner data. The reference price is the last price paid. They estimated a **coefficient of loss aversion around 2.4** for orange juice price changes.

**Important caveat:** For loss aversion to explain these results, consumers must be **narrowly bracketing** purchases of a specific good (eggs, orange juice). Otherwise, the small loss from one price increase would be integrated with gains/losses from other purchases and would not loom large.

### 5. Savings and Consumption: Insensitivity to Bad News

Standard life-cycle models predict that consumption should track "permanent income" -- people should smooth consumption by anticipating future earnings. Empirically, consumption is too closely tied to current income and drops too steeply after retirement.

**Shea (1995):** Studied unionized teachers whose next year's wage is negotiated in advance. Standard theory: if next year's wage is surprisingly good, spend more now; if bad, cut back now. **Actual finding:** Teachers spent more when future wages rose but **did not cut back** when future wages were cut.

**PT explanation (Bowman, Minehart & Rabin 1999):** Workers have reference-dependent utility u(c(t) - r(t)) with loss aversion. Consumption is "sticky downward" for two reasons: (1) cutting current consumption means consuming below the reference point, which is especially painful due to loss aversion; (2) owing to the reflection effect, workers are willing to gamble that next year's wages might not be as low as expected rather than accept a certain reduction.

### 6. Status Quo Bias, Endowment Effects, and Buying-Selling Price Gaps

**[[status-quo-bias]]** (Samuelson & Zeckhauser 1988): Exaggerated preference for the current state. When Harvard added new health plan options, older faculty stuck to previous plans more than newer faculty.

**Default bias** (Johnson, Hershey, Meszaros & Kunreuther 1993): Pennsylvania vs. New Jersey natural experiment with automobile insurance. Both states offered similar limited-rights vs. unlimited-rights policies but with different defaults. The percentage choosing limited-rights insurance was higher wherever it was the default.

**[[endowment-effect]]** (Kahneman, Knetsch & Thaler 1990): Coffee mug experiments -- those given mugs demand a selling price **2-3 times** higher than what those without mugs are willing to pay. Also documented in hypothetical "contingent valuations" of non-traded goods (clean air, environmental damage).

All three phenomena reflect [[loss-aversion]] relative to a reference point. Making something the status quo, default, or endowment establishes a reference point; any change away is coded as a loss.

### 7. Racetrack Betting: The Favorite-Longshot Bias

In parimutuel horse race betting, there is a pronounced bias toward betting on longshots (low probability of winning). Longshot horses with 2% of money bet win only about 1% of the time. Favorites are underbet -- some are so heavily favored (70% of win money) that betting on them yields only about $2.40 for a $2 bet.

**Jullien and Salanie (1997):** Most careful comparison study. Used all flat races in England over 10 years (34,443 races). Found cumulative prospect theory fits **much better** than rank-dependent utility theory and expected utility. Their estimates:
- Utility function for small money amounts is **convex** (risk-seeking for gains)
- Probability weighting for gain probabilities is almost linear
- Probability weighting for **loss probabilities severely overweights small probabilities** (pi(0.1) = 0.45, pi(0.3) = 0.65)

**Surprising implication:** Bettors like longshots because they have convex utility for money and weight their high chances of losing and small chances of winning roughly linearly. They hate favorites because, despite convex utility, they are **disproportionately afraid of the small chance of losing** when betting on a heavy favorite.

### 8. Racetrack Betting: The End-of-the-Day Effect

McGlothlin (1956) and Ali (1977): Bettors shift toward longshots and away from favorites **later in the racing day**.

**PT explanation:** Most bettors are losing by the last race. They open a mental account at the beginning of the day, close it at the end, and hate closing it in the red. Longshot bets can generate a large enough profit to cover earlier losses and break even. This is [[reflection-effect]] -- risk-seeking in the domain of losses.

The shift is so pronounced that some studies show **conservatively betting the favorite to show** (finish first, second, or third) in the last race is a profitable strategy despite the track's 15% take.

Expected utility cannot explain this within-day shift, because if bettors integrate wealth across days, the last race on Saturday is no different from the first race on the next outing.

### 9. State Lotteries (Lotto)

Lotto involves choosing 6 numbers from 40-50; jackpots can reach $350 million with rollovers. Introduced in many US states in 1980, accounted for half of state lottery sales by 1989.

**Cook and Clotfelter (1993):** Lotto's popularity comes from players being **more sensitive to the large jackpot** than to the correspondingly low probability of winning. Cross-state regressions show ticket sales strongly correlated with jackpot size (which correlates with population). Within states, weekly sales strongly correlate with rollover size.

**PT explanation:** Overweighting of low probabilities and insensitivity toward differences among very small probabilities. Larger populations can offer bigger jackpots at even longer odds while maintaining the same perceived probability of winning (because frequency of someone winning is similar). The larger jackpot is highly visible while the smaller probability is not.

### 10. Telephone Wire Repair Insurance

**Cicchetti and Dubin (1994):** Phone companies either require customers to pay ~$60 for wiring repair or buy insurance for $0.45/month. Expected cost of wire damage: only $0.26/month. So insurance is significantly overpriced relative to expected cost.

They found evidence of nonlinear probability weighting and status quo bias (previously uninsured customers were less likely to buy when a new insurance option was introduced).

**Rabin's proof (in press):** A mildly risk-averse expected utility maximizer who turns down a coin flip of win $11/lose $10 at all wealth levels should logically reject a coin flip with $100 loss **regardless of how much could be won**. This demolishes the expected utility explanation for small-stakes risk aversion.

**PT explanation:** Consumers overweight the small probability of wire damage. Loss aversion alone cannot explain the purchases (if loss-averse, they should also dislike the sure $0.45 monthly cost). The reflection effect cannot explain it either (convexity in losses predicts they should not insure). The key ingredient is **probability overweighting** plus **narrow bracketing** (focusing only on wire repair risk rather than integrating it with life's other ups and downs).

### 11. Conclusion

Camerer's summary of which PT features explain which phenomena:

**[[loss-aversion]] explains:** equity premium, cab driver labor supply, asymmetric price elasticities, insensitivity of consumption to bad income news, status quo bias and endowment effects.

**[[reflection-effect]] explains:** disposition effect (holding losers/selling winners), insensitivity of consumption to bad news (gambling on future wages), end-of-the-day effect at racetracks.

**Nonlinear probability weighting explains:** favorite-longshot bias, lotto lottery demand, telephone wire repair insurance purchases.

**Narrow bracketing is required for all:** Without isolating decisions, outcomes are mingled with other gains and losses, diluting the psychological influence of any single outcome.

**Advantage over expected utility:** Each EU explanation requires a special ad hoc assumption, and these assumptions often contradict each other across domains. Convex utility explains longshot/lotto popularity but predicts stocks should return *less* than bonds. Liquidity constraints explain cab drivers but incorrectly predict teachers getting bad news should cut back while those getting good news should not increase spending. Prospect theory explains all 10 patterns with three ingredients.

## New Concepts Introduced

- [[equity-premium-puzzle]] -- the empirical puzzle that stocks return far more than bonds require under standard risk aversion (already referenced in wiki, now with full PT explanation)
- Myopic loss aversion -- the combination of loss aversion and short evaluation horizons that explains the equity premium (Benartzi & Thaler)
- Daily income targeting -- cab drivers using a daily reference point for income decisions
- Narrow bracketing -- the assumption that people isolate individual decisions rather than integrating them into broader portfolios

## Cross-References

- [[prospect-theory]] -- the parent theory; all 10 applications derive from its three key features
- [[loss-aversion]] -- explains 5 of 10 phenomena
- [[reflection-effect]] -- explains 3 of 10 phenomena (gambling in domain of losses)
- [[framing-effects]] -- narrow bracketing is a form of framing (single decision vs. portfolio)
- [[disposition-effect]] -- application #2, with Odean's extensive field data
- [[status-quo-bias]] -- application #6, with natural experiments
- [[endowment-effect]] -- closely related to status quo bias through loss aversion
- [[mental-accounting]] -- narrow bracketing is a core mental accounting phenomenon
- [[reference-dependence]] -- foundational to all 10 applications
- [[behavioral-finance]] -- applications 1 and 2 are core behavioral finance findings
- [[summary-2-07-cvf-ch20-cab-drivers]] -- the full cab driver study (Ch. 20 of this volume)
- [[summary-2-07-cvf-ch8-endowment-loss-aversion-status-quo]] -- endowment effect chapter
- [[summary-2-07-cvf-ch14-mental-accounting-matters]] -- Thaler's mental accounting chapter
- [[kahneman]], [[tversky]], [[camerer]]

## Quotes Worth Keeping

> "The workhorses of economic analysis are simple formal models that can explain naturally occurring phenomena. Reflecting this taste, economists often say they will incorporate more psychological ideas into economics if those ideas can parsimoniously account for field data better than standard theories do." -- Camerer, Ch. 16

> "In all these examples it is also necessary to assume people are isolating or narrowly bracketing the relevant decisions. Bracketing narrowly focuses attention most dramatically on the possibility of a loss or extreme outcome, or a low probability." -- Camerer, Ch. 16

> "The problem is that these extras are truly ad hoc because each regularity requires a special assumption. Worse, an extra assumption that helps explain one regularity may contradict another." -- Camerer, Ch. 16 (on EU explanations)
