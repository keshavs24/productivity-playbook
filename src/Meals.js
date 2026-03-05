/**
 * Meals.js — 7-day OMAD meal plan for cutting
 * All meals: air fryer only, allowed foods only
 * Target: ~2,350 kcal | 190g protein | 80g fat | 100g carbs
 */

/**
 * Get the 7-day rotating meal plan data
 */
function getMealPlanData() {
  return [
    // DAY 1
    {
      day: 'Day 1',
      name: 'Garlic-Paprika Chicken + Berry Parfait',
      components: [
        { food: 'Air-fried chicken breast (garlic powder, smoked paprika, pepper)', amount: '350g (12oz)', cal: 578, p: 108, c: 0, f: 13, airFryer: '375\u00b0F, 12-15 min, flip halfway' },
        { food: 'Air-fried broccoli florets', amount: '250g', cal: 88, p: 7, c: 14, f: 1, airFryer: '375\u00b0F, 10-12 min, shake halfway' },
        { food: 'Air-fried bell peppers (sliced)', amount: '200g', cal: 62, p: 2, c: 12, f: 0.5, airFryer: '375\u00b0F, 8-10 min' },
        { food: 'Greek yogurt (2%, plain) + strawberries', amount: '300g + 200g', cal: 262, p: 31, c: 26, f: 6, airFryer: 'Raw' },
        { food: 'Blueberries', amount: '100g', cal: 57, p: 1, c: 14, f: 0.3, airFryer: 'Raw' },
        { food: 'Almonds (raw)', amount: '50g', cal: 290, p: 11, c: 11, f: 25, airFryer: 'Raw' },
        { food: 'Walnuts', amount: '25g', cal: 163, p: 4, c: 3, f: 16, airFryer: 'Raw' },
        { food: 'Apple (medium)', amount: '1', cal: 95, p: 0.5, c: 25, f: 0.3, airFryer: 'Raw' },
        { food: 'Whey protein (1 scoop, water)', amount: '30g', cal: 120, p: 25, c: 3, f: 1.5, airFryer: 'Shake' },
        { food: 'Olive oil spray (cooking)', amount: '10ml', cal: 88, p: 0, c: 0, f: 10, airFryer: 'Spray' }
      ]
    },
    // DAY 2
    {
      day: 'Day 2',
      name: 'Tuna-Stuffed Peppers + Lemon Chicken Strips',
      components: [
        { food: 'Canned tuna in water (drained) + celery + pepper', amount: '2 cans (340g)', cal: 360, p: 80, c: 0, f: 4, airFryer: 'Mix raw' },
        { food: 'Bell peppers (halved, stuffed with tuna)', amount: '300g', cal: 93, p: 3, c: 18, f: 0.7, airFryer: '375\u00b0F, 8-10 min' },
        { food: 'Air-fried chicken strips (lemon pepper)', amount: '250g', cal: 413, p: 77, c: 0, f: 9, airFryer: '375\u00b0F, 12 min, flip halfway' },
        { food: 'Air-fried asparagus', amount: '200g', cal: 40, p: 4, c: 8, f: 0.4, airFryer: '375\u00b0F, 7-8 min' },
        { food: 'Greek yogurt + raspberries', amount: '300g + 150g', cal: 276, p: 32, c: 29, f: 6, airFryer: 'Raw' },
        { food: 'Almonds', amount: '55g', cal: 319, p: 12, c: 12, f: 27, airFryer: 'Raw' },
        { food: 'Orange (large)', amount: '1', cal: 86, p: 2, c: 22, f: 0.2, airFryer: 'Raw' },
        { food: 'Whey protein (1 scoop)', amount: '30g', cal: 120, p: 25, c: 3, f: 1.5, airFryer: 'Shake' },
        { food: 'Olive oil spray', amount: '10ml', cal: 88, p: 0, c: 0, f: 10, airFryer: 'Spray' }
      ]
    },
    // DAY 3
    {
      day: 'Day 3',
      name: 'Cajun Chicken + Cauliflower Rice + Walnut Crunch',
      components: [
        { food: 'Air-fried chicken breast (cajun: paprika, cayenne, garlic, oregano)', amount: '350g', cal: 578, p: 108, c: 0, f: 13, airFryer: '375\u00b0F, 12-15 min, flip halfway' },
        { food: 'Air-fried cauliflower rice', amount: '300g', cal: 75, p: 6, c: 15, f: 1, airFryer: '400\u00b0F, 10 min, shake often' },
        { food: 'Air-fried green beans', amount: '200g', cal: 62, p: 4, c: 14, f: 0.4, airFryer: '375\u00b0F, 8-10 min' },
        { food: 'Raw spinach salad', amount: '150g', cal: 35, p: 4, c: 5, f: 0.6, airFryer: 'Raw' },
        { food: 'Greek yogurt + cherries', amount: '250g + 150g', cal: 259, p: 27, c: 33, f: 4, airFryer: 'Raw' },
        { food: 'Walnuts', amount: '50g', cal: 327, p: 8, c: 7, f: 33, airFryer: 'Raw' },
        { food: 'Almonds', amount: '30g', cal: 174, p: 6, c: 7, f: 15, airFryer: 'Raw' },
        { food: 'Grapefruit (half)', amount: '1/2', cal: 52, p: 1, c: 13, f: 0.2, airFryer: 'Raw' },
        { food: 'Whey protein (1.5 scoops)', amount: '45g', cal: 180, p: 38, c: 4, f: 2, airFryer: 'Shake' },
        { food: 'Olive oil spray', amount: '10ml', cal: 88, p: 0, c: 0, f: 10, airFryer: 'Spray' }
      ]
    },
    // DAY 4
    {
      day: 'Day 4',
      name: 'Mediterranean Tuna Bowl + Apple-Almond Yogurt',
      components: [
        { food: 'Canned tuna (drained) + lemon + oregano + pepper', amount: '2 cans (340g)', cal: 360, p: 80, c: 0, f: 4, airFryer: 'Mix raw' },
        { food: 'Air-fried chicken breast (Italian herbs)', amount: '250g', cal: 413, p: 77, c: 0, f: 9, airFryer: '375\u00b0F, 12-15 min' },
        { food: 'Air-fried zucchini rounds', amount: '300g', cal: 51, p: 4, c: 10, f: 0.8, airFryer: '400\u00b0F, 10 min, flip halfway' },
        { food: 'Raw spinach + cucumber salad', amount: '200g + 150g', cal: 56, p: 5, c: 8, f: 0.8, airFryer: 'Raw' },
        { food: 'Greek yogurt + diced apple', amount: '300g + 1 apple', cal: 293, p: 31, c: 36, f: 5, airFryer: 'Raw' },
        { food: 'Almonds', amount: '50g', cal: 290, p: 11, c: 11, f: 25, airFryer: 'Raw' },
        { food: 'Walnuts', amount: '25g', cal: 163, p: 4, c: 3, f: 16, airFryer: 'Raw' },
        { food: 'Raspberries', amount: '100g', cal: 52, p: 1, c: 12, f: 0.7, airFryer: 'Raw' },
        { food: 'Whey protein (1 scoop)', amount: '30g', cal: 120, p: 25, c: 3, f: 1.5, airFryer: 'Shake' },
        { food: 'Olive oil spray', amount: '10ml', cal: 88, p: 0, c: 0, f: 10, airFryer: 'Spray' }
      ]
    },
    // DAY 5
    {
      day: 'Day 5',
      name: 'Spicy Chicken Bites + Triple-Berry Protein Bowl',
      components: [
        { food: 'Air-fried chicken bites (cubed, cayenne + garlic)', amount: '350g', cal: 578, p: 108, c: 0, f: 13, airFryer: '400\u00b0F, 10-12 min, shake halfway' },
        { food: 'Air-fried broccoli', amount: '200g', cal: 70, p: 6, c: 11, f: 0.8, airFryer: '375\u00b0F, 10 min' },
        { food: 'Air-fried Brussels sprouts (halved)', amount: '200g', cal: 86, p: 7, c: 18, f: 0.6, airFryer: '375\u00b0F, 15-18 min, shake halfway' },
        { food: 'Raw baby spinach', amount: '100g', cal: 23, p: 3, c: 4, f: 0.4, airFryer: 'Raw' },
        { food: 'Greek yogurt + strawberries + blueberries + raspberries', amount: '300g + 100g each', cal: 339, p: 33, c: 45, f: 6, airFryer: 'Raw' },
        { food: 'Almonds', amount: '55g', cal: 319, p: 12, c: 12, f: 27, airFryer: 'Raw' },
        { food: 'Walnuts', amount: '30g', cal: 196, p: 5, c: 4, f: 20, airFryer: 'Raw' },
        { food: 'Whey protein (1 scoop)', amount: '30g', cal: 120, p: 25, c: 3, f: 1.5, airFryer: 'Shake' },
        { food: 'Olive oil spray', amount: '10ml', cal: 88, p: 0, c: 0, f: 10, airFryer: 'Spray' }
      ]
    },
    // DAY 6
    {
      day: 'Day 6',
      name: 'Air-Fried Tuna Patties + Herb Chicken + Grapefruit',
      components: [
        { food: 'Tuna patties (2 cans + 1 egg + almond flour, formed)', amount: '2 cans + extras', cal: 478, p: 86, c: 4, f: 12, airFryer: '400\u00b0F, 10 min, flip at 5 min' },
        { food: 'Air-fried chicken breast (salt + pepper + herbs)', amount: '200g', cal: 330, p: 62, c: 0, f: 7, airFryer: '375\u00b0F, 12 min' },
        { food: 'Air-fried asparagus', amount: '200g', cal: 40, p: 4, c: 8, f: 0.4, airFryer: '375\u00b0F, 7-8 min' },
        { food: 'Air-fried cauliflower florets', amount: '250g', cal: 63, p: 5, c: 13, f: 0.8, airFryer: '375\u00b0F, 12 min, shake' },
        { food: 'Greek yogurt + strawberries', amount: '300g + 150g', cal: 246, p: 31, c: 23, f: 6, airFryer: 'Raw' },
        { food: 'Grapefruit (whole)', amount: '1', cal: 104, p: 2, c: 26, f: 0.3, airFryer: 'Raw' },
        { food: 'Almonds', amount: '40g', cal: 232, p: 9, c: 8, f: 20, airFryer: 'Raw' },
        { food: 'Walnuts', amount: '30g', cal: 196, p: 5, c: 4, f: 20, airFryer: 'Raw' },
        { food: 'Whey protein (1 scoop)', amount: '30g', cal: 120, p: 25, c: 3, f: 1.5, airFryer: 'Shake' },
        { food: 'Olive oil spray', amount: '10ml', cal: 88, p: 0, c: 0, f: 10, airFryer: 'Spray' }
      ]
    },
    // DAY 7
    {
      day: 'Day 7',
      name: 'Recovery Feast: Chicken + Mixed Veggies + Berry Bowl',
      components: [
        { food: 'Air-fried chicken breast (garlic powder, simple)', amount: '400g (14oz)', cal: 660, p: 124, c: 0, f: 14, airFryer: '375\u00b0F, 14-16 min, flip halfway' },
        { food: 'Air-fried mixed veggies (broccoli + peppers + green beans + zucchini)', amount: '400g total', cal: 120, p: 8, c: 22, f: 1, airFryer: '375\u00b0F, 10-12 min, shake' },
        { food: 'Raw spinach + cucumber side salad', amount: '150g + 100g', cal: 39, p: 4, c: 5, f: 0.5, airFryer: 'Raw' },
        { food: 'Greek yogurt + blueberries', amount: '350g + 150g', cal: 317, p: 36, c: 34, f: 6.5, airFryer: 'Raw' },
        { food: 'Almonds', amount: '50g', cal: 290, p: 11, c: 11, f: 25, airFryer: 'Raw' },
        { food: 'Walnuts', amount: '25g', cal: 163, p: 4, c: 3, f: 16, airFryer: 'Raw' },
        { food: 'Apple (medium)', amount: '1', cal: 95, p: 0.5, c: 25, f: 0.3, airFryer: 'Raw' },
        { food: 'Whey protein (1 scoop)', amount: '30g', cal: 120, p: 25, c: 3, f: 1.5, airFryer: 'Shake' },
        { food: 'Olive oil spray', amount: '10ml', cal: 88, p: 0, c: 0, f: 10, airFryer: 'Spray' }
      ]
    }
  ];
}

/**
 * Get the weekly shopping list
 */
function getShoppingList() {
  return [
    // Protein
    { item: 'Chicken breast (boneless, skinless)', qty: '2.5 kg (~5.5 lb)', category: 'Protein', notes: 'Buy in bulk, portion into 250-400g bags, freeze' },
    { item: 'Canned tuna in water', qty: '6 cans (170g each)', category: 'Protein', notes: 'Chunk light or albacore' },
    { item: 'Whey protein isolate', qty: '1 tub (monthly)', category: 'Protein', notes: 'Unflavored or vanilla, ~25g protein/scoop' },
    { item: 'Eggs', qty: '6 (for tuna patties)', category: 'Protein', notes: 'Used as binder for Day 6 patties' },
    // Dairy
    { item: 'Greek yogurt (2%, plain)', qty: '2 kg (~4.4 lb)', category: 'Dairy', notes: 'Fage or Chobani, no added sugar' },
    // Vegetables
    { item: 'Broccoli (fresh or frozen)', qty: '1 kg', category: 'Vegetables', notes: 'Cut into florets for air fryer' },
    { item: 'Bell peppers (red + green)', qty: '6-8', category: 'Vegetables', notes: 'For stuffing (Day 2) and air frying' },
    { item: 'Cauliflower', qty: '2 heads', category: 'Vegetables', notes: 'Pulse for cauli rice (Day 3), florets (Day 6)' },
    { item: 'Zucchini', qty: '3-4', category: 'Vegetables', notes: 'Slice into rounds for air frying' },
    { item: 'Asparagus', qty: '2 bunches', category: 'Vegetables', notes: 'Trim ends, air fry whole' },
    { item: 'Brussels sprouts', qty: '400g', category: 'Vegetables', notes: 'Halve for air frying' },
    { item: 'Green beans', qty: '400g', category: 'Vegetables', notes: 'Trim ends' },
    { item: 'Baby spinach', qty: '500g bag', category: 'Vegetables', notes: 'For salads (raw)' },
    { item: 'Cucumber', qty: '2-3', category: 'Vegetables', notes: 'For salads' },
    // Fruits (Low GI only)
    { item: 'Strawberries', qty: '500g', category: 'Fruits', notes: 'GI ~25, best berry choice' },
    { item: 'Blueberries', qty: '400g', category: 'Fruits', notes: 'GI ~53, moderate' },
    { item: 'Raspberries', qty: '300g', category: 'Fruits', notes: 'GI ~25, very high fiber' },
    { item: 'Cherries', qty: '300g', category: 'Fruits', notes: 'GI ~22, lowest GI fruit' },
    { item: 'Apples', qty: '3-4', category: 'Fruits', notes: 'GI ~36, good fiber' },
    { item: 'Grapefruit', qty: '2', category: 'Fruits', notes: 'GI ~25' },
    { item: 'Oranges', qty: '2', category: 'Fruits', notes: 'GI ~35' },
    // Nuts
    { item: 'Raw almonds', qty: '500g bag', category: 'Nuts', notes: 'Key calorie source, 290 cal/50g' },
    { item: 'Walnuts', qty: '300g bag', category: 'Nuts', notes: 'Best omega-3 nut' },
    { item: 'Almond flour', qty: '200g', category: 'Nuts', notes: 'For tuna patties (Day 6)' },
    // Pantry
    { item: 'Olive oil spray', qty: '1 can', category: 'Pantry', notes: 'For air frying' },
    { item: 'Garlic powder', qty: '1', category: 'Pantry', notes: 'Staple seasoning' },
    { item: 'Smoked paprika', qty: '1', category: 'Pantry', notes: 'Key flavor for chicken' },
    { item: 'Cayenne pepper', qty: '1', category: 'Pantry', notes: 'For spicy days, thermogenic boost' },
    { item: 'Italian herb mix (oregano, basil, thyme)', qty: '1', category: 'Pantry', notes: 'For Mediterranean days' },
    { item: 'Black pepper', qty: '1', category: 'Pantry', notes: 'Fresh ground preferred' },
    { item: 'Lemon juice', qty: '2 lemons', category: 'Pantry', notes: 'For tuna and chicken' },
    // Supplements
    { item: 'Creatine monohydrate', qty: '500g (monthly)', category: 'Supplements', notes: '5g daily with meal' },
    { item: 'Fish oil (EPA/DHA)', qty: '1 bottle', category: 'Supplements', notes: '2-3g combined EPA+DHA daily' },
    { item: 'Vitamin D3', qty: '1 bottle', category: 'Supplements', notes: '2,000-4,000 IU daily' },
    { item: 'Magnesium glycinate', qty: '1 bottle', category: 'Supplements', notes: '400mg before bed/suhoor' },
    { item: 'Electrolyte mix / Lite Salt', qty: '1', category: 'Supplements', notes: 'Critical during Ramadan' }
  ];
}

/**
 * Full-day eating schedule data — the strict daily framework.
 * Suhoor is fixed. Main meal rotates (7-day plan). Track running calories.
 * Target: 2,350 cal | 190g P | 80g F | 100g C
 */
function getDailyScheduleData() {
  return {
    suhoor: {
      label: 'SUHOOR \u2014 PRE-FAJR (eat this EVERY day)',
      items: [
        { food: 'Greek yogurt, plain 2% (Fage/Chobani)', portion: '200g', cal: 132, p: 20, f: 3.0, c: 7,  note: 'Casein = slow amino acid release over 6-7hrs of fast' },
        { food: 'Raw almonds',                           portion: '30g',  cal: 174, p: 6,  f: 15.0, c: 7, note: 'Healthy fat = sustained energy, no blood sugar spike' },
        { food: 'Whey protein shake (water)',            portion: '1 scoop (30g)', cal: 120, p: 25, f: 1.5, c: 3, note: 'Prevents muscle catabolism during 15-hr fast' },
        { food: 'Water',                                 portion: '500ml+', cal: 0, p: 0, f: 0, c: 0,    note: 'LAST WATER until Iftar. Hydrate now.' }
      ],
      subtotal: { cal: 426, p: 51, f: 19.5, c: 17 },
      checkboxRules: [
        '\u2714 Magnesium glycinate 400mg taken',
        '\u2714 Creatine 5g in water taken',
        '\u2714 Stopped eating 5 min before Fajr Adhan'
      ]
    },
    fast: {
      label: 'FAST \u2014 FAJR \u2192 MAGHRIB (~14-15 hours)',
      note: 'No food. No water. Stay productive \u2014 the hunger is the work.'
    },
    iftar: {
      label: 'IFTAR BREAK \u2014 AT MAGHRIB ADHAN',
      items: [
        { food: 'Dates',  portion: '2 small (~20g)', cal: 45, p: 0, f: 0, c: 12, note: 'Sunnah. Fast glucose to liver. DO NOT eat more.' },
        { food: 'Water',  portion: '250-500ml',       cal: 0,  p: 0, f: 0, c: 0,  note: 'Drink slowly. Then pray Maghrib.' }
      ],
      subtotal: { cal: 45, p: 0, f: 0, c: 12 },
      note: '\u27a1 Pray Maghrib \u2192 wait 30-45 min \u2192 then sit for main meal'
    },
    mainMeal: {
      label: 'MAIN MEAL \u2014 1 to 1.5 HRS AFTER IFTAR',
      note: 'Use the 7-day rotation below. Weigh everything. Guessing = failing.',
      template: [
        { food: 'Chicken thighs OR breast (air fryer \u2014 see recipes)',  portion: '300-350g raw', cal: 408, p: 50, f: 22.0, c: 0,  note: '380\u00b0F thighs 22min / 375\u00b0F breast 14min' },
        { food: 'Air-fried vegetables (pick 2: broccoli/peppers/asparagus/zucchini/green beans)', portion: '350g total', cal: 105, p: 8, f: 1.0, c: 18, note: 'Fill half your plate. 375\u00b0F, 10-12 min.' },
        { food: 'Greek yogurt, plain',              portion: '200g', cal: 132, p: 20, f: 3.0, c: 7,  note: 'Eat as dessert bowl \u2014 add berries on top' },
        { food: 'Mixed berries (strawberries/raspberries/blueberries)', portion: '200g', cal: 92, p: 1.5, f: 0.6, c: 21, note: 'Low GI. Natural sweetness without sugar crash.' },
        { food: 'Raw almonds',                      portion: '50g',  cal: 290, p: 11, f: 25.0, c: 11, note: 'Eat with meal or after. Weigh them.' },
        { food: 'Walnuts',                          portion: '25g',  cal: 163, p: 4,  f: 16.0, c: 3,  note: 'Best omega-3 nut. Anti-inflammatory.' },
        { food: 'Whey protein shake (water)',        portion: '1 scoop (30g)', cal: 120, p: 25, f: 1.5, c: 3, note: 'Drink 45-60 min after main meal' }
      ],
      subtotal: { cal: 1310, p: 119.5, f: 69.1, c: 63 }
    },
    buffer: {
      label: '\u26a1 CALORIE BUFFER \u2014 use these to hit exactly 2,350',
      note: 'After tracking above (Suhoor 426 + Dates 45 + Main ~1,310 = ~1,781), you need ~569 more cal. Pick from:',
      options: [
        { food: '+50g almonds',           cal: 290, p: 11,  f: 25.0, c: 11 },
        { food: '+1 scoop whey shake',    cal: 120, p: 25,  f: 1.5,  c: 3  },
        { food: '+100g Greek yogurt',     cal: 66,  p: 10,  f: 1.5,  c: 3  },
        { food: '+100g chicken thighs',   cal: 136, p: 17,  f: 7.0,  c: 0  },
        { food: '+1 apple (medium)',       cal: 95,  p: 0.5, f: 0.3,  c: 25 }
      ],
      combo: 'RECOMMENDED: +50g almonds (290) + 1 scoop whey (120) + 100g yogurt (66) + apple (95) = +571 cal \u2192 TOTAL: 2,352 cal \u2714'
    },
    lateSnack: {
      label: 'OPTIONAL LATE SNACK (only if genuinely hungry)',
      warning: '\u26a0\ufe0f HARD STOP: no food within 1 HOUR before Suhoor starts.',
      items: [
        { food: 'Greek yogurt',        portion: '150g',     cal: 99,  p: 15, f: 2.0, c: 5, note: 'Best choice \u2014 casein before sleep' },
        { food: 'Whey protein shake',  portion: '1 scoop',  cal: 120, p: 25, f: 1.5, c: 3, note: 'If short on protein for the day' }
      ]
    },
    grandTotal: {
      label: 'GRAND TOTAL TARGET',
      cal: 2350, p: 190, f: 80, c: 100
    }
  };
}

/**
 * Write the full-day eating schedule section to the sheet.
 * This goes at the TOP of the Meals tab.
 */
function writeDailyScheduleSection(sheet) {
  var G = {
    SUHOOR_BG:  '#1b5e20',  SUHOOR_ROW:  '#e8f5e9',
    FAST_BG:    '#424242',  FAST_ROW:    '#f5f5f5',
    IFTAR_BG:   '#f57f17',  IFTAR_ROW:   '#fff8e1',
    MAIN_BG:    '#0d47a1',  MAIN_ROW:    '#e3f2fd',
    BUFFER_BG:  '#e65100',  BUFFER_ROW:  '#fff3e0',
    SNACK_BG:   '#6a1b9a',  SNACK_ROW:   '#f3e5f5',
    TOTAL_BG:   '#2e7d32',  WHITE:       '#ffffff',
    LABEL_FG:   '#1a1a1a',  NOTE_FG:     '#555555',
    GOLD:       '#f9a825'
  };

  var d = getDailyScheduleData();
  var r = 1;

  // ── TITLE ──────────────────────────────────────────────────────────────
  sheet.getRange(r, 1, 1, 8).merge()
    .setValue('\ud83d\uddd3\ufe0f  DAILY EATING SCHEDULE \u2014 RAMADAN OMAD CUT  |  TARGET: 2,350 cal \u00b7 190g P \u00b7 80g F \u00b7 100g C')
    .setBackground(G.TOTAL_BG).setFontColor(G.WHITE)
    .setFontSize(13).setFontWeight('bold').setHorizontalAlignment('center');
  sheet.setRowHeight(r, 36);
  r++;

  // ── COLUMN HEADERS ─────────────────────────────────────────────────────
  var cols = ['FOOD / TIMING', 'PORTION', 'CAL', 'PROTEIN', 'CARBS', 'FAT', 'RUNNING TOTAL', 'NOTES'];
  sheet.getRange(r, 1, 1, 8).setValues([cols])
    .setBackground('#37474f').setFontColor(G.WHITE)
    .setFontWeight('bold').setFontSize(9).setHorizontalAlignment('center');
  sheet.setRowHeight(r, 22);
  r++;

  var running = 0;

  // Helper: write one food row, return next row
  function writeRow(row, food, portion, cal, p, f, c, note, rowBg) {
    running += cal;
    var runStr = cal > 0 ? running + ' cal' : '\u2014';
    var calStr = cal > 0 ? cal : '\u2014';
    var vals = [[food, portion, calStr, (p > 0 ? p + 'g' : '\u2014'), (c > 0 ? c + 'g' : '\u2014'), (f > 0 ? f + 'g' : '\u2014'), runStr, note]];
    sheet.getRange(row, 1, 1, 8).setValues(vals)
      .setBackground(rowBg).setFontSize(9)
      .setFontColor(G.LABEL_FG).setHorizontalAlignment('center');
    sheet.getRange(row, 1).setHorizontalAlignment('left').setFontWeight('normal');
    sheet.getRange(row, 8).setFontColor(G.NOTE_FG).setFontStyle('italic');
    sheet.setRowHeight(row, 20);
  }

  // Helper: write section header
  function writeHeader(row, text, bg) {
    sheet.getRange(row, 1, 1, 8).merge()
      .setValue(text).setBackground(bg).setFontColor(G.WHITE)
      .setFontSize(10).setFontWeight('bold').setHorizontalAlignment('left');
    sheet.setRowHeight(row, 26);
  }

  // Helper: subtotal row
  function writeSubtotal(row, label, cal, p, f, c, bg) {
    sheet.getRange(row, 1, 1, 2).merge().setValue(label)
      .setBackground(bg).setFontColor(G.WHITE)
      .setFontSize(9).setFontWeight('bold').setHorizontalAlignment('left');
    sheet.getRange(row, 3).setValue(cal).setBackground(bg).setFontColor(G.GOLD).setFontWeight('bold').setHorizontalAlignment('center');
    sheet.getRange(row, 4).setValue(p + 'g').setBackground(bg).setFontColor(G.WHITE).setFontWeight('bold').setHorizontalAlignment('center');
    sheet.getRange(row, 5).setValue(c + 'g').setBackground(bg).setFontColor(G.WHITE).setFontWeight('bold').setHorizontalAlignment('center');
    sheet.getRange(row, 6).setValue(f + 'g').setBackground(bg).setFontColor(G.WHITE).setFontWeight('bold').setHorizontalAlignment('center');
    sheet.getRange(row, 7).setValue(running + ' cal').setBackground(bg).setFontColor(G.GOLD).setFontWeight('bold').setHorizontalAlignment('center');
    sheet.getRange(row, 8).setBackground(bg);
    sheet.setRowHeight(row, 22);
  }

  // ── SUHOOR ─────────────────────────────────────────────────────────────
  writeHeader(r, '\ud83c\udf19  ' + d.suhoor.label + '  \u00b7  Before Fajr Adhan', G.SUHOOR_BG); r++;
  for (var si = 0; si < d.suhoor.items.length; si++) {
    var si_ = d.suhoor.items[si];
    writeRow(r, si_.food, si_.portion, si_.cal, si_.p, si_.f, si_.c, si_.note, G.SUHOOR_ROW); r++;
  }
  writeSubtotal(r, 'SUHOOR SUBTOTAL', d.suhoor.subtotal.cal, d.suhoor.subtotal.p, d.suhoor.subtotal.f, d.suhoor.subtotal.c, G.SUHOOR_BG); r++;
  // Suhoor checklist
  for (var sc = 0; sc < d.suhoor.checkboxRules.length; sc++) {
    sheet.getRange(r, 1, 1, 8).merge().setValue(d.suhoor.checkboxRules[sc])
      .setBackground('#c8e6c9').setFontColor('#1b5e20').setFontSize(8).setHorizontalAlignment('left');
    sheet.setRowHeight(r, 16); r++;
  }
  // Spacer
  sheet.getRange(r, 1, 1, 8).setBackground('#ffffff'); sheet.setRowHeight(r, 6); r++;

  // ── FAST ───────────────────────────────────────────────────────────────
  writeHeader(r, '\u23f3  ' + d.fast.label + '  \u00b7  ' + d.fast.note, G.FAST_BG); r++;
  sheet.getRange(r, 1, 1, 8).setBackground('#ffffff'); sheet.setRowHeight(r, 6); r++;

  // ── IFTAR ──────────────────────────────────────────────────────────────
  writeHeader(r, '\u2600\ufe0f  ' + d.iftar.label, G.IFTAR_BG); r++;
  for (var ii = 0; ii < d.iftar.items.length; ii++) {
    var ii_ = d.iftar.items[ii];
    writeRow(r, ii_.food, ii_.portion, ii_.cal, ii_.p, ii_.f, ii_.c, ii_.note, G.IFTAR_ROW); r++;
  }
  writeSubtotal(r, 'IFTAR SUBTOTAL', d.iftar.subtotal.cal, d.iftar.subtotal.p, d.iftar.subtotal.f, d.iftar.subtotal.c, G.IFTAR_BG); r++;
  sheet.getRange(r, 1, 1, 8).merge().setValue(d.iftar.note)
    .setBackground('#fff8e1').setFontColor('#5d4037').setFontSize(9).setHorizontalAlignment('center').setFontStyle('italic');
  sheet.setRowHeight(r, 18); r++;
  sheet.getRange(r, 1, 1, 8).setBackground('#ffffff'); sheet.setRowHeight(r, 6); r++;

  // ── MAIN MEAL ──────────────────────────────────────────────────────────
  writeHeader(r, '\ud83c\udf7d\ufe0f  ' + d.mainMeal.label + '  \u00b7  ' + d.mainMeal.note, G.MAIN_BG); r++;
  for (var mi = 0; mi < d.mainMeal.template.length; mi++) {
    var mi_ = d.mainMeal.template[mi];
    writeRow(r, mi_.food, mi_.portion, mi_.cal, mi_.p, mi_.f, mi_.c, mi_.note, G.MAIN_ROW); r++;
  }
  writeSubtotal(r, 'MAIN MEAL SUBTOTAL', d.mainMeal.subtotal.cal, d.mainMeal.subtotal.p, d.mainMeal.subtotal.f, d.mainMeal.subtotal.c, G.MAIN_BG); r++;
  sheet.getRange(r, 1, 1, 8).setBackground('#ffffff'); sheet.setRowHeight(r, 6); r++;

  // ── BUFFER ─────────────────────────────────────────────────────────────
  writeHeader(r, d.buffer.label, G.BUFFER_BG); r++;
  sheet.getRange(r, 1, 1, 8).merge().setValue(d.buffer.note)
    .setBackground(G.BUFFER_ROW).setFontColor('#424242').setFontSize(9).setHorizontalAlignment('left').setWrap(true);
  sheet.setRowHeight(r, 20); r++;
  for (var bi = 0; bi < d.buffer.options.length; bi++) {
    var bo = d.buffer.options[bi];
    writeRow(r, bo.food, '\u2014', bo.cal, bo.p, bo.f, bo.c, '', G.BUFFER_ROW); r++;
  }
  sheet.getRange(r, 1, 1, 8).merge().setValue(d.buffer.combo)
    .setBackground('#ffe0b2').setFontColor('#bf360c')
    .setFontSize(9).setFontWeight('bold').setHorizontalAlignment('left').setWrap(true);
  sheet.setRowHeight(r, 20); r++;
  sheet.getRange(r, 1, 1, 8).setBackground('#ffffff'); sheet.setRowHeight(r, 6); r++;

  // ── LATE SNACK ─────────────────────────────────────────────────────────
  writeHeader(r, '\ud83c\udf19  ' + d.lateSnack.label, G.SNACK_BG); r++;
  sheet.getRange(r, 1, 1, 8).merge().setValue(d.lateSnack.warning)
    .setBackground('#fce4ec').setFontColor('#c62828')
    .setFontSize(9).setFontWeight('bold').setHorizontalAlignment('center');
  sheet.setRowHeight(r, 18); r++;
  for (var li = 0; li < d.lateSnack.items.length; li++) {
    var li_ = d.lateSnack.items[li];
    writeRow(r, li_.food, li_.portion, li_.cal, li_.p, li_.f, li_.c, li_.note, G.SNACK_ROW); r++;
  }
  sheet.getRange(r, 1, 1, 8).setBackground('#ffffff'); sheet.setRowHeight(r, 8); r++;

  // ── GRAND TOTAL ────────────────────────────────────────────────────────
  var gt = d.grandTotal;
  sheet.getRange(r, 1, 1, 2).merge().setValue('\ud83c\udfaf  DAILY TARGET')
    .setBackground(G.TOTAL_BG).setFontColor(G.WHITE).setFontSize(11).setFontWeight('bold').setHorizontalAlignment('center');
  sheet.getRange(r, 3).setValue(gt.cal + ' cal').setBackground(G.TOTAL_BG).setFontColor(G.GOLD).setFontSize(11).setFontWeight('bold').setHorizontalAlignment('center');
  sheet.getRange(r, 4).setValue(gt.p + 'g P').setBackground(G.TOTAL_BG).setFontColor(G.WHITE).setFontSize(10).setFontWeight('bold').setHorizontalAlignment('center');
  sheet.getRange(r, 5).setValue(gt.c + 'g C').setBackground(G.TOTAL_BG).setFontColor(G.WHITE).setFontSize(10).setFontWeight('bold').setHorizontalAlignment('center');
  sheet.getRange(r, 6).setValue(gt.f + 'g F').setBackground(G.TOTAL_BG).setFontColor(G.WHITE).setFontSize(10).setFontWeight('bold').setHorizontalAlignment('center');
  sheet.getRange(r, 7, 1, 2).merge().setValue('Every. Single. Day.').setBackground(G.TOTAL_BG).setFontColor(G.GOLD).setFontSize(10).setFontStyle('italic').setHorizontalAlignment('center');
  sheet.setRowHeight(r, 32); r++;

  // ── HARD RULES BOX ─────────────────────────────────────────────────────
  r++; // blank spacer
  sheet.getRange(r, 1, 1, 8).merge()
    .setValue('\ud83d\udd34  NON-NEGOTIABLE RULES \u2014 THESE DON\'T MOVE')
    .setBackground('#b71c1c').setFontColor(G.WHITE)
    .setFontSize(10).setFontWeight('bold').setHorizontalAlignment('center');
  sheet.setRowHeight(r, 26); r++;
  var hardRules = [
    '1. WEIGH ALL FOOD. A food scale costs \u00a310. Guessing your almonds = 300 cal over = week ruined.',
    '2. NO EATING OUTSIDE THIS SCHEDULE. If it\'s not on this page, it doesn\'t go in your mouth.',
    '3. RATE YOURSELF IN THE DAILY LOG. 5 = you followed this exactly. 1 = you went off plan. No lying to yourself.',
    '4. THE WINDOW CLOSES. 1 hour before Suhoor = done. Close the kitchen. No exceptions.',
    '5. RAMADAN IS THE ADVANTAGE. Everyone else is undisciplined. You have a built-in reason to fast 15 hours. USE IT.',
    '6. IF YOU SLIP: rate yourself honestly (1-2), get back to it next meal. One bad meal doesn\'t ruin a cut. Quitting does.'
  ];
  for (var hr = 0; hr < hardRules.length; hr++) {
    sheet.getRange(r, 1, 1, 8).merge().setValue(hardRules[hr])
      .setBackground(hr % 2 === 0 ? '#ffebee' : '#ffffff')
      .setFontColor('#424242').setFontSize(9).setHorizontalAlignment('left').setWrap(true);
    sheet.setRowHeight(r, 20); r++;
  }
  r++; // trailing spacer

  return r; // next available row for subsequent sections
}

/**
 * All chicken recipes — no-marinade AND marinated, for both thighs and breast.
 * Air fryer only. Returns array of recipe objects.
 */
function getChickenRecipes() {
  return [
    // ====================================================
    // THIGHS — NO MARINADE (cook right now!)
    // ====================================================
    {
      name: 'Classic Garlic Paprika Thighs',
      type: 'THIGHS \u2014 NO MARINADE',
      readyIn: '25 min',
      cookTime: '22-24 min',
      temp: '380\u00b0F',
      macros: '~340 cal | 42g P | 18g F | 0g C (per 250g)',
      color: '#1b5e20',
      ingredients: [
        '250g boneless skinless chicken thighs',
        '1 tsp garlic powder',
        '1 tsp smoked paprika',
        '\u00bd tsp black pepper',
        '\u00bd tsp salt',
        'Olive oil spray'
      ],
      method: [
        'Pat thighs completely dry with paper towel (CRITICAL for crispiness)',
        'Mix all spices in a small bowl',
        'Coat thighs evenly on both sides',
        'Spray air fryer basket lightly',
        'Cook smooth-side DOWN at 380\u00b0F for 12 min',
        'Flip, cook another 10-12 min until internal temp hits 165\u00b0F',
        'Rest 3 min before cutting'
      ],
      tips: [
        'Don\u2019t skip drying \u2014 moisture = steaming not crisping',
        'Don\u2019t overcrowd basket (leave space between thighs)',
        'Check at 20 min, thicker thighs need more time',
        'Thighs are forgiving \u2014 can cook to 175\u00b0F for extra juicy dark meat'
      ]
    },
    {
      name: 'Cajun Spice Thighs',
      type: 'THIGHS \u2014 NO MARINADE',
      readyIn: '25 min',
      cookTime: '22-24 min',
      temp: '380\u00b0F',
      macros: '~340 cal | 42g P | 18g F | 1g C (per 250g)',
      color: '#1b5e20',
      ingredients: [
        '250g boneless skinless chicken thighs',
        '1 tsp smoked paprika',
        '\u00bd tsp cayenne (adjust to heat preference)',
        '\u00bd tsp garlic powder',
        '\u00bd tsp onion powder',
        '\u00bd tsp dried oregano',
        '\u00bd tsp black pepper',
        '\u00bd tsp salt',
        'Olive oil spray'
      ],
      method: [
        'Pat thighs dry',
        'Mix all spices and rub evenly over both sides',
        'Let sit 5-10 min while air fryer preheats to 380\u00b0F',
        'Cook smooth-side down 12 min, flip, 10-12 min more',
        'Internal temp 165\u00b0F+. Rest 3 min'
      ],
      tips: [
        'Excellent with roasted broccoli or cauliflower',
        'For extra heat: double the cayenne',
        'Add a squeeze of lemon after cooking \u2014 cuts the spice beautifully'
      ]
    },
    {
      name: 'Lemon Pepper Thighs',
      type: 'THIGHS \u2014 NO MARINADE',
      readyIn: '25 min',
      cookTime: '22-24 min',
      temp: '380\u00b0F',
      macros: '~340 cal | 42g P | 18g F | 0g C (per 250g)',
      color: '#1b5e20',
      ingredients: [
        '250g boneless skinless chicken thighs',
        '1.5 tsp lemon pepper seasoning (or: 1 tsp black pepper + zest of 1 lemon)',
        '\u00bd tsp garlic powder',
        '\u00bd tsp salt',
        'Juice of \u00bd lemon (squeeze over after cooking)',
        'Olive oil spray'
      ],
      method: [
        'Pat thighs dry',
        'Rub lemon pepper, garlic powder, salt over both sides',
        'Air fry at 380\u00b0F \u2014 12 min smooth-side down, flip, 10 min more',
        'Squeeze fresh lemon over immediately after cooking'
      ],
      tips: [
        'Fresh lemon zest is way better than pre-mixed lemon pepper',
        'Great with asparagus (cook asparagus last 8 min alongside)'
      ]
    },
    // ====================================================
    // THIGHS \u2014 MARINATED (plan ahead, next-level results)
    // ====================================================
    {
      name: 'Yogurt Garlic Thighs (THE BEST ONE)',
      type: 'THIGHS \u2014 MARINADE (2hr min, overnight ideal)',
      readyIn: '25 min + marinade',
      cookTime: '22-24 min',
      temp: '380\u00b0F',
      macros: '~370 cal | 46g P | 18g F | 4g C (per 250g)',
      color: '#e65100',
      ingredients: [
        '250g boneless skinless chicken thighs',
        '3 tbsp Greek yogurt (tenderizes the meat \u2014 key ingredient!)',
        '3 cloves garlic (minced) or 1.5 tsp garlic powder',
        '1 tsp smoked paprika',
        '1 tsp cumin',
        '\u00bd tsp cayenne (optional)',
        'Juice of \u00bd lemon',
        '1 tsp salt',
        '\u00bd tsp black pepper'
      ],
      method: [
        'Mix all marinade ingredients in a bowl',
        'Score thighs with a knife (3-4 shallow cuts) so marinade penetrates',
        'Coat thighs completely, cover, refrigerate 2hr minimum (overnight = incredible)',
        'Remove from fridge 15 min before cooking',
        'Shake off excess marinade (don\u2019t wipe \u2014 leave a coating)',
        'Air fry at 380\u00b0F: 12 min, flip, 10-12 min more',
        'Watch the yogurt coating \u2014 it gets a beautiful char. Normal and delicious.'
      ],
      tips: [
        'WHY YOGURT: The lactic acid breaks down muscle fibers \u2014 you get restaurant-quality tenderness without equipment',
        'The longer you marinate the better \u2014 24hr is the sweet spot',
        'Overnight batch: marinate 4-5 thighs Sunday night for Mon-Tue meals',
        'The yogurt coating gets slightly charred \u2014 this is the best part, don\u2019t panic',
        'Tastes exactly like a shawarma spice rub \u2014 add more cumin if you want that flavor'
      ]
    },
    {
      name: 'Spicy Harissa-Style Thighs',
      type: 'THIGHS \u2014 MARINADE (1hr min)',
      readyIn: '25 min + marinade',
      cookTime: '22-24 min',
      temp: '380\u00b0F',
      macros: '~345 cal | 42g P | 18g F | 2g C (per 250g)',
      color: '#e65100',
      ingredients: [
        '250g boneless skinless chicken thighs',
        '2 tbsp Greek yogurt',
        '1 tbsp olive oil',
        '2 tsp smoked paprika',
        '1 tsp cayenne (more = hotter)',
        '1 tsp cumin',
        '1 tsp garlic powder',
        '\u00bd tsp coriander powder',
        'Juice of \u00bd lemon',
        '1 tsp salt'
      ],
      method: [
        'Mix all marinade ingredients into a thick paste',
        'Score chicken, coat thickly in paste, marinate 1hr minimum',
        'Air fry 380\u00b0F: 12 min each side. Should look deeply red and charred on edges',
        'Rest 3 min. Squeeze more lemon over top before eating'
      ],
      tips: [
        'This is basically a dry harissa \u2014 bold, smoky, spicy and incredible',
        'Excellent on Days 3 and 5 of your meal plan',
        'Make extra: slice cold leftovers over spinach salad for a killer bowl'
      ]
    },
    // ====================================================
    // BREAST \u2014 NO MARINADE
    // ====================================================
    {
      name: 'Simple Garlic Herb Breast',
      type: 'BREAST \u2014 NO MARINADE',
      readyIn: '20 min',
      cookTime: '12-16 min',
      temp: '375\u00b0F',
      macros: '~290 cal | 54g P | 7g F | 0g C (per 300g)',
      color: '#0d47a1',
      ingredients: [
        '300g boneless skinless chicken breast',
        '1 tsp garlic powder',
        '\u00bd tsp dried Italian herbs (oregano + thyme)',
        '\u00bd tsp smoked paprika',
        '\u00bd tsp black pepper',
        '\u00bd tsp salt',
        'Olive oil spray'
      ],
      method: [
        'POUND TO EVEN THICKNESS (most important step for breast) \u2014 use a zip-lock bag and a heavy cup, pound thicker end until uniform ~2cm',
        'Pat dry completely',
        'Rub all seasonings evenly over both sides',
        'Spray basket lightly',
        'Cook at 375\u00b0F: 6-8 min, flip, 6-8 min more',
        'STOP at 160\u00b0F internal (will carry-cook to 165\u00b0F while resting)',
        'Rest 5 min before slicing \u2014 DO NOT skip this'
      ],
      tips: [
        'Breast is unforgiving \u2014 overcooked = dry. Use a thermometer if you have one',
        'Pounding is optional but STRONGLY recommended \u2014 even thickness = even cooking',
        'Slice against the grain for maximum tenderness',
        'If breast is very thick (>3cm), slice horizontally into 2 thin pieces first'
      ]
    },
    {
      name: 'Smoked Paprika + Cayenne Breast',
      type: 'BREAST \u2014 NO MARINADE',
      readyIn: '20 min',
      cookTime: '12-15 min',
      temp: '375\u00b0F',
      macros: '~290 cal | 54g P | 7g F | 1g C (per 300g)',
      color: '#0d47a1',
      ingredients: [
        '300g boneless skinless chicken breast',
        '1.5 tsp smoked paprika',
        '\u00bd tsp cayenne',
        '1 tsp garlic powder',
        '\u00bd tsp cumin',
        '\u00bd tsp salt',
        'Olive oil spray'
      ],
      method: [
        'Pound breast to even thickness',
        'Pat completely dry',
        'Rub spices evenly (this is a bold dry rub \u2014 don\u2019t be shy)',
        'Air fry 375\u00b0F: 7 min, flip, 6-7 min more',
        'Rest 5 min, slice against the grain'
      ],
      tips: [
        'Great sliced over spinach + cucumber + yogurt dressing (thin Greek yogurt + lemon + garlic)',
        'Good protein bowl option: slice thin, pair with air-fried cauliflower + hot sauce'
      ]
    },
    // ====================================================
    // BREAST \u2014 MARINATED
    // ====================================================
    {
      name: 'Lemon Garlic Herb Breast',
      type: 'BREAST \u2014 MARINADE (30min min)',
      readyIn: '20 min + marinade',
      cookTime: '12-15 min',
      temp: '375\u00b0F',
      macros: '~295 cal | 54g P | 8g F | 2g C (per 300g)',
      color: '#e65100',
      ingredients: [
        '300g boneless skinless chicken breast',
        'Juice + zest of 1 lemon',
        '3 cloves garlic (minced)',
        '1 tbsp olive oil',
        '1 tsp dried oregano',
        '\u00bd tsp dried thyme',
        '1 tsp salt',
        '\u00bd tsp black pepper'
      ],
      method: [
        'Pound breast to even thickness, then score lightly with knife',
        'Mix all marinade ingredients, coat chicken',
        'Marinate in fridge: 30 min minimum, 4 hrs ideal',
        'Pat OFF excess liquid before air frying (prevents steaming)',
        'Air fry 375\u00b0F: 7 min, flip, 6-8 min, rest 5 min'
      ],
      tips: [
        'The olive oil in marinade helps create a better crust than no-marinade versions',
        'This is the one to batch-cook \u2014 make 4 breasts Sunday, use Mon-Thu'
      ]
    },
    {
      name: 'Yogurt Citrus Breast (Most Juicy)',
      type: 'BREAST \u2014 MARINADE (2hr min)',
      readyIn: '20 min + marinade',
      cookTime: '12-15 min',
      temp: '375\u00b0F',
      macros: '~310 cal | 58g P | 7g F | 4g C (per 300g)',
      color: '#e65100',
      ingredients: [
        '300g boneless skinless chicken breast',
        '3 tbsp Greek yogurt',
        'Juice of \u00bd lemon + \u00bd orange',
        '2 tsp garlic powder',
        '1 tsp smoked paprika',
        '\u00bd tsp cumin',
        '1 tsp salt',
        '\u00bd tsp black pepper'
      ],
      method: [
        'Pound breast, score lightly',
        'Mix yogurt marinade, coat completely',
        'Refrigerate 2-4 hrs (overnight = incredible)',
        'Leave the yogurt coating on (don\u2019t wipe)',
        'Air fry 375\u00b0F: 7 min, flip carefully, 7-8 min more',
        'Coating will char slightly \u2014 this is correct and delicious',
        'Rest 5 min, slice against the grain'
      ],
      tips: [
        'Best breast recipe in the whole plan \u2014 yogurt keeps it incredibly moist even at 165\u00b0F',
        'Citrus brightens the whole dish and offsets the richness',
        'Slice thin and fan out on plate \u2014 looks and tastes professional',
        'If in a rush: even 30 min of marinating makes a difference'
      ]
    }
  ];
}

/**
 * Write the chicken recipes section into the Meals sheet.
 * Called by setupMealsSheet().
 */
function writeChickenRecipesSection(sheet, startRow) {
  var SECTION_BG    = '#1b5e20';
  var THIGH_BG      = '#e8f5e9';
  var BREAST_BG     = '#e3f2fd';
  var MARINADE_BG   = '#fff3e0';
  var HEADER_FG     = '#ffffff';
  var LABEL_FG      = '#1a1a1a';

  // Section title
  sheet.getRange(startRow, 1, 1, 8).merge()
    .setValue('\ud83c\udf57  CHICKEN RECIPES \u2014 AIR FRYER ONLY  |  Thighs + Breast  |  No-Marinade & Marinated')
    .setBackground(SECTION_BG).setFontColor(HEADER_FG)
    .setFontSize(13).setFontWeight('bold').setHorizontalAlignment('center');

  var r = startRow + 1;

  var recipes = getChickenRecipes();

  for (var i = 0; i < recipes.length; i++) {
    var rec = recipes[i];

    // Detect section group for background
    var isThigh   = rec.type.indexOf('THIGH') !== -1;
    var isMarinade = rec.type.indexOf('MARINADE') !== -1;
    var rowBg     = isThigh ? (isMarinade ? '#fff3e0' : '#e8f5e9') : (isMarinade ? '#fff3e0' : '#e3f2fd');
    var typeBg    = isThigh ? '#2e7d32' : '#1565c0';
    if (isMarinade) typeBg = '#e65100';

    // Recipe title row
    sheet.getRange(r, 1, 1, 8).merge()
      .setValue(rec.name)
      .setBackground(typeBg).setFontColor(HEADER_FG)
      .setFontSize(11).setFontWeight('bold').setHorizontalAlignment('center');
    r++;

    // Type + stats row
    sheet.getRange(r, 1, 1, 8).merge()
      .setValue(rec.type + '  \u00b7  Ready in: ' + rec.readyIn + '  \u00b7  Cook: ' + rec.temp + ' / ' + rec.cookTime + '  \u00b7  ' + rec.macros)
      .setBackground(rowBg).setFontColor('#424242')
      .setFontSize(9).setHorizontalAlignment('center').setFontStyle('italic');
    r++;

    // Ingredients label
    sheet.getRange(r, 1).setValue('INGREDIENTS:')
      .setFontWeight('bold').setFontSize(9).setBackground(rowBg);
    sheet.getRange(r, 2, 1, 7).merge()
      .setValue(rec.ingredients.join('  |  '))
      .setBackground(rowBg).setFontSize(9).setWrap(true);
    r++;

    // Method
    sheet.getRange(r, 1).setValue('METHOD:')
      .setFontWeight('bold').setFontSize(9).setBackground(rowBg);
    for (var m = 0; m < rec.method.length; m++) {
      if (m === 0) {
        sheet.getRange(r, 2, 1, 7).merge()
          .setValue((m + 1) + '. ' + rec.method[m])
          .setBackground(rowBg).setFontSize(9).setWrap(true);
      } else {
        sheet.getRange(r + m, 1).setBackground(rowBg);
        sheet.getRange(r + m, 2, 1, 7).merge()
          .setValue((m + 1) + '. ' + rec.method[m])
          .setBackground(rowBg).setFontSize(9).setWrap(true);
      }
    }
    r += rec.method.length;

    // Tips
    sheet.getRange(r, 1).setValue('TIPS:')
      .setFontWeight('bold').setFontSize(9).setBackground('#fffde7');
    sheet.getRange(r, 2, 1, 7).merge()
      .setValue(rec.tips.map(function(t) { return '\u2022 ' + t; }).join('  \u00b7\u00b7  '))
      .setBackground('#fffde7').setFontSize(9).setFontColor('#5d4037').setWrap(true);
    r++;

    // Spacer row
    sheet.getRange(r, 1, 1, 8).setBackground('#ffffff');
    r++;
  }

  // Quick reference cheat sheet at the end
  var cheatRows = [
    ['\ud83d\udc54 CHICKEN THIGHS \u2014 AIR FRYER CHEAT SHEET', ''],
    ['Boneless skinless thighs:', '380\u00b0F | 22-25 min total | Flip at 12 min | Internal: 165-175\u00b0F'],
    ['Bone-in thighs:', '380\u00b0F | 28-32 min total | Flip at 15 min | Internal: 165\u00b0F+'],
    ['THIGH TIPS:', 'Pat DRY before cooking. Dark meat = more forgiving. Slightly overcooking is FINE. More fat = naturally juicy.'],
    ['', ''],
    ['\ud83d\udc56 CHICKEN BREAST \u2014 AIR FRYER CHEAT SHEET', ''],
    ['Boneless skinless breast:', '375\u00b0F | 12-16 min total | Flip at 7 min | Internal: 160\u00b0F (carry-cooks to 165\u00b0F)'],
    ['Breast TIPS:', 'POUND TO EVEN THICKNESS. Rest 5 min after cooking. Don\u2019t go past 165\u00b0F. Slice against grain.']
  ];

  sheet.getRange(r, 1, 1, 8).merge()
    .setValue('\u26a1 QUICK REFERENCE')
    .setBackground(SECTION_BG).setFontColor(HEADER_FG)
    .setFontSize(11).setFontWeight('bold').setHorizontalAlignment('center');
  r++;

  for (var cr = 0; cr < cheatRows.length; cr++) {
    var label = cheatRows[cr][0];
    var val   = cheatRows[cr][1];
    if (val === '' && label !== '') {
      sheet.getRange(r, 1, 1, 8).merge()
        .setValue(label)
        .setBackground('#2e7d32').setFontColor('#ffffff')
        .setFontSize(10).setFontWeight('bold').setHorizontalAlignment('left');
    } else if (label === '' && val === '') {
      sheet.getRange(r, 1, 1, 8).setBackground('#ffffff');
    } else {
      sheet.getRange(r, 1).setValue(label).setFontWeight('bold').setFontSize(9).setBackground('#e8f5e9');
      sheet.getRange(r, 2, 1, 7).merge().setValue(val).setFontSize(9).setBackground('#e8f5e9').setWrap(true);
    }
    r++;
  }

  return r; // return next available row
}

// ============================================================
// FAST TRACK ACTIONS
// ============================================================

function getFastTrackActions() {
  // daysSaved per session = extra_cal / (TDEE - DAILY_CALORIES) = cal / 516
  return [
    { name: '30 min fasted walk (during fast)',         shortName: 'Fasted Walk', cal: 175, daysSaved: 0.34, notes: 'Fasted state = more fat oxidized. Low intensity. Safe any time during Ramadan fast.' },
    { name: '10,000 steps today (vs ~5k baseline)',     shortName: '10k Steps',   cal: 250, daysSaved: 0.48, notes: 'NEAT king. Walk on calls. Take stairs. Park far. Easiest sustainable habit.' },
    { name: '30 min moderate cardio post-Iftar',        shortName: 'Cardio 30m',  cal: 250, daysSaved: 0.48, notes: 'Wait 90 min after eating. 60-70% max HR. Treadmill / bike / elliptical.' },
    { name: 'Cut to 2,100 cal today (save 250)',        shortName: 'Eat 2,100',   cal: 250, daysSaved: 0.48, notes: 'Only when genuinely not hungry. Never below 2,100 \u2014 muscle catabolism risk.' },
    { name: 'HIIT 20 min (sprints / burpees / jumps)',  shortName: 'HIIT 20m',    cal: 350, daysSaved: 0.68, notes: 'Max effort. ~100 cal afterburn. Limit 2-3x/week. NOT during the fast.' },
    { name: 'Cold shower 3+ min',                       shortName: 'Cold Shower', cal: 75,  daysSaved: 0.15, notes: 'Brown fat activation + anti-inflammatory. Easy daily win. Stack with morning.' }
  ];
}

// ============================================================
// WRITE DAY VARIETY SECTION
// ============================================================

/**
 * Write compact 7-day eating cards at the top of the Meals tab.
 * Each card shows the complete daily schedule for that day's rotation.
 */
function writeDayVarietySection(sheet, startRow) {
  var r = startRow;
  var SUHOOR_CAL = 426; var SUHOOR_P = 51; var SUHOOR_F = 20; var SUHOOR_C = 17;
  var IFTAR_CAL  = 45;  var IFTAR_P  = 0;  var IFTAR_F  = 0;  var IFTAR_C  = 12;
  var TARGET = 2350;

  // Section header
  sheet.getRange(r, 1, 1, 8).merge()
    .setValue('YOUR COMPLETE EATING PLAN \u2014 BY DAY')
    .setBackground('#1b5e20').setFontColor('#ffffff')
    .setFontWeight('bold').setFontSize(12).setHorizontalAlignment('center');
  sheet.setRowHeight(r, 32);
  r++;

  sheet.getRange(r, 1, 1, 8).merge()
    .setValue('Find today\'s day number \u2192 your full eating plan from Suhoor to sleep is here. Rotate Day 1\u21927 across the week. Same Suhoor daily. Main meal changes for variety.')
    .setBackground('#e8f5e9').setFontColor('#1b5e20').setFontSize(9).setFontStyle('italic').setWrap(true);
  sheet.setRowHeight(r, 22);
  r++;

  var days = getMealPlanData();
  var headerColors = ['#1b5e20','#2e7d32','#388e3c','#43a047','#2e7d32','#388e3c','#1b5e20'];

  for (var d = 0; d < days.length; d++) {
    var day = days[d];

    // Sum this day's main meal totals
    var mainCal = 0, mainP = 0, mainF = 0, mainC = 0;
    for (var ci = 0; ci < day.components.length; ci++) {
      mainCal += day.components[ci].cal; mainP += day.components[ci].p;
      mainF   += day.components[ci].f;  mainC += day.components[ci].c;
    }
    mainCal = Math.round(mainCal); mainP = Math.round(mainP);
    mainF   = Math.round(mainF);   mainC = Math.round(mainC);

    var grandCal = SUHOOR_CAL + IFTAR_CAL + mainCal;
    var buffer   = Math.max(0, TARGET - grandCal);
    var totalCal = grandCal + buffer;

    // Brief main-meal description (first 3 proteins/veg)
    var foods = day.components.slice(0, 3).map(function(c) {
      return c.food.split('(')[0].split('+')[0].trim().replace(/^Air-fried /, '');
    });
    var mainDesc = foods.join(' + ') + (day.components.length > 3 ? ' + yogurt, nuts, whey' : '');

    // ── DAY HEADER ──
    sheet.getRange(r, 1, 1, 8).merge()
      .setValue('DAY ' + (d + 1) + ' \u2014 ' + day.name.toUpperCase())
      .setBackground(headerColors[d]).setFontColor('#ffffff')
      .setFontWeight('bold').setFontSize(10).setHorizontalAlignment('left');
    sheet.setRowHeight(r, 26); r++;

    // Sub-headers
    var subHdrs = [['MEAL PHASE','WHAT YOU EAT','CAL','PROTEIN','FAT','CARBS','','TIPS']];
    sheet.getRange(r, 1, 1, 8).setValues(subHdrs)
      .setBackground('#c8e6c9').setFontColor('#1b5e20').setFontSize(7).setFontWeight('bold').setHorizontalAlignment('center');
    sheet.getRange(r, 2).setHorizontalAlignment('left');
    sheet.getRange(r, 8).setHorizontalAlignment('left');
    sheet.getRange(r, 7).setValue('');
    sheet.setRowHeight(r, 14); r++;

    // SUHOOR
    sheet.getRange(r, 1).setValue('SUHOOR (pre-Fajr)').setBackground('#e8f5e9').setFontSize(8).setFontWeight('bold').setFontColor('#1b5e20');
    sheet.getRange(r, 2).setValue('Greek yogurt 200g + Almonds 30g + Whey 1 scoop').setBackground('#e8f5e9').setFontSize(8).setWrap(true);
    sheet.getRange(r, 3).setValue(SUHOOR_CAL).setBackground('#e8f5e9').setFontSize(8).setHorizontalAlignment('center').setFontWeight('bold').setFontColor('#1b5e20');
    sheet.getRange(r, 4).setValue(SUHOOR_P + 'g').setBackground('#e8f5e9').setFontSize(8).setHorizontalAlignment('center');
    sheet.getRange(r, 5).setValue(SUHOOR_F + 'g').setBackground('#e8f5e9').setFontSize(8).setHorizontalAlignment('center');
    sheet.getRange(r, 6).setValue(SUHOOR_C + 'g').setBackground('#e8f5e9').setFontSize(8).setHorizontalAlignment('center');
    sheet.getRange(r, 7).setValue('').setBackground('#e8f5e9');
    sheet.getRange(r, 8).setValue('Same EVERY day. Eat before Fajr. Stop 5 min before adhan.').setBackground('#e8f5e9').setFontSize(7).setFontColor('#555555').setWrap(true);
    sheet.setRowHeight(r, 22); r++;

    // IFTAR
    sheet.getRange(r, 1).setValue('IFTAR (Maghrib)').setBackground('#fff8e1').setFontSize(8).setFontWeight('bold').setFontColor('#e65100');
    sheet.getRange(r, 2).setValue('2 dates + 500ml water \u2192 pray Maghrib \u2192 wait 30-45 min').setBackground('#fff8e1').setFontSize(8).setWrap(true);
    sheet.getRange(r, 3).setValue(IFTAR_CAL).setBackground('#fff8e1').setFontSize(8).setHorizontalAlignment('center').setFontWeight('bold').setFontColor('#e65100');
    sheet.getRange(r, 4).setValue('0g').setBackground('#fff8e1').setFontSize(8).setHorizontalAlignment('center');
    sheet.getRange(r, 5).setValue('0g').setBackground('#fff8e1').setFontSize(8).setHorizontalAlignment('center');
    sheet.getRange(r, 6).setValue(IFTAR_C + 'g').setBackground('#fff8e1').setFontSize(8).setHorizontalAlignment('center');
    sheet.getRange(r, 7).setValue('').setBackground('#fff8e1');
    sheet.getRange(r, 8).setValue('Pray FIRST. 2 dates only \u2014 no more. Don\'t stuff yourself.').setBackground('#fff8e1').setFontSize(7).setFontColor('#555555').setWrap(true);
    sheet.setRowHeight(r, 22); r++;

    // MAIN MEAL
    sheet.getRange(r, 1).setValue('MAIN MEAL (1-1.5hr after Iftar)').setBackground('#e3f2fd').setFontSize(8).setFontWeight('bold').setFontColor('#1565c0');
    sheet.getRange(r, 2).setValue(mainDesc).setBackground('#e3f2fd').setFontSize(8).setWrap(true);
    sheet.getRange(r, 3).setValue(mainCal).setBackground('#e3f2fd').setFontSize(8).setHorizontalAlignment('center').setFontWeight('bold').setFontColor('#1565c0');
    sheet.getRange(r, 4).setValue(mainP + 'g').setBackground('#e3f2fd').setFontSize(8).setHorizontalAlignment('center');
    sheet.getRange(r, 5).setValue(mainF + 'g').setBackground('#e3f2fd').setFontSize(8).setHorizontalAlignment('center');
    sheet.getRange(r, 6).setValue(mainC + 'g').setBackground('#e3f2fd').setFontSize(8).setHorizontalAlignment('center');
    sheet.getRange(r, 7).setValue('').setBackground('#e3f2fd');
    sheet.getRange(r, 8).setValue('Weigh everything. Full breakdown in Day ' + (d + 1) + ' plan below.').setBackground('#e3f2fd').setFontSize(7).setFontColor('#555555').setWrap(true);
    sheet.setRowHeight(r, 28); r++;

    // BUFFER (if needed)
    if (buffer > 0) {
      sheet.getRange(r, 1).setValue('\u26a1 BUFFER NEEDED').setBackground('#fff3e0').setFontSize(8).setFontWeight('bold').setFontColor('#e65100');
      sheet.getRange(r, 2).setValue('Short by ~' + buffer + ' cal. Add: almonds / whey shake / Greek yogurt / more chicken.').setBackground('#fff3e0').setFontSize(8).setWrap(true);
      sheet.getRange(r, 3).setValue('+' + buffer).setBackground('#fff3e0').setFontSize(8).setHorizontalAlignment('center').setFontWeight('bold').setFontColor('#e65100');
      sheet.getRange(r, 4, 1, 5).merge().setValue('Prioritize protein sources to stay on macros.').setBackground('#fff3e0').setFontSize(7).setFontColor('#e65100');
      sheet.setRowHeight(r, 22); r++;
    }

    // TOTAL row
    var totalP = Math.round(SUHOOR_P + mainP);
    var totalF = Math.round(SUHOOR_F + mainF);
    var totalC = Math.round(SUHOOR_C + IFTAR_C + mainC);
    sheet.getRange(r, 1, 1, 4).merge()
      .setValue('\u2714 DAY ' + (d + 1) + ' TOTAL: ~' + totalCal + ' cal')
      .setBackground('#2e7d32').setFontColor('#f9a825').setFontWeight('bold').setFontSize(9).setHorizontalAlignment('center');
    sheet.getRange(r, 5, 1, 4).merge()
      .setValue('~' + totalP + 'g P   \u00b7   ~' + totalF + 'g F   \u00b7   ~' + totalC + 'g C')
      .setBackground('#2e7d32').setFontColor('#ffffff').setFontWeight('bold').setFontSize(9).setHorizontalAlignment('center');
    sheet.setRowHeight(r, 22); r++;

    // Spacer
    sheet.getRange(r, 1, 1, 8).merge().setValue('').setBackground('#f0f0f0');
    sheet.setRowHeight(r, 5); r++;
  }

  return r;
}

// ============================================================
// WRITE FAST TRACK SECTION
// ============================================================

/**
 * Write the full Fast Track section: menu, weekly log with checkboxes,
 * and all-time cumulative progress tracker with projected 6-pack date.
 */
function writeFastTrackSection(sheet, startRow) {
  var r = startRow;
  var actions  = getFastTrackActions();
  var colLetters = ['B','C','D','E','F','G']; // cols 2-7 = 6 action checkboxes
  var dayLabels  = ['MON','TUE','WED','THU','FRI','SAT','SUN'];
  var deficit    = CUT.TDEE - CUT.DAILY_CALORIES;                 // 516
  var lbsToLose  = CUT.START_WEIGHT - CUT.TARGET_WEIGHT;          // 13.2
  var daysNeeded = Math.round(lbsToLose / CUT.RATE_PER_WEEK * 7); // 92

  // ── MAIN HEADER ──────────────────────────────────────────────────────────
  sheet.getRange(r, 1, 1, 8).merge()
    .setValue('\u26a1  FAST TRACK \u2014 ACCELERATE YOUR 6-PACK')
    .setBackground('#1b5e20').setFontColor('#f9a825')
    .setFontWeight('bold').setFontSize(13).setHorizontalAlignment('center');
  sheet.setRowHeight(r, 36); r++;

  sheet.getRange(r, 1, 1, 8).merge()
    .setValue('Every action below adds to your deficit BEYOND your normal cut. Check off what you do each day \u2014 it builds into a weekly total that shaves real days off your 6-pack deadline.')
    .setBackground('#e8f5e9').setFontColor('#1b5e20').setFontSize(9).setFontStyle('italic').setWrap(true);
  sheet.setRowHeight(r, 28); r++;

  sheet.getRange(r, 1, 1, 8).merge()
    .setValue('THE MATH: Current deficit = ' + deficit + ' cal/day (TDEE ' + CUT.TDEE + ' \u2212 eaten ' + CUT.DAILY_CALORIES + '). Days saved per session = extra cal \u00f7 ' + deficit + '. Every rep counts.')
    .setBackground('#f9fbe7').setFontColor('#2e7d32').setFontSize(8).setWrap(true);
  sheet.setRowHeight(r, 22); r++;

  // ── FAST TRACK MENU ──────────────────────────────────────────────────────
  r++; // spacer
  sheet.getRange(r, 1, 1, 8).merge()
    .setValue('FAST TRACK MENU \u2014 REFERENCE')
    .setBackground('#43a047').setFontColor('#ffffff')
    .setFontWeight('bold').setFontSize(10).setHorizontalAlignment('center');
  sheet.setRowHeight(r, 24); r++;

  sheet.getRange(r, 1, 1, 8).setValues([['ACTION', 'CAL / SESSION', 'DAYS SAVED', 'WHY IT WORKS', '', '', '', '']])
    .setBackground('#c8e6c9').setFontColor('#1b5e20').setFontWeight('bold').setFontSize(8).setHorizontalAlignment('center');
  sheet.getRange(r, 4, 1, 5).merge();
  sheet.getRange(r, 4).setHorizontalAlignment('left');
  sheet.setRowHeight(r, 18); r++;

  for (var i = 0; i < actions.length; i++) {
    var a   = actions[i];
    var bg  = i % 2 === 0 ? '#f1f8e9' : '#ffffff';
    sheet.getRange(r, 1).setValue(a.name).setBackground(bg).setFontSize(9).setWrap(true);
    sheet.getRange(r, 2).setValue('+' + a.cal + ' cal').setBackground(bg).setFontSize(9)
      .setHorizontalAlignment('center').setFontColor('#2e7d32').setFontWeight('bold');
    sheet.getRange(r, 3).setValue('+' + a.daysSaved.toFixed(2) + ' days').setBackground(bg).setFontSize(9)
      .setHorizontalAlignment('center').setFontColor('#1565c0').setFontWeight('bold');
    sheet.getRange(r, 4, 1, 5).merge().setValue(a.notes).setBackground(bg).setFontSize(8)
      .setFontColor('#555555').setWrap(true);
    sheet.setRowHeight(r, 22); r++;
  }

  // ── THIS WEEK'S LOG ──────────────────────────────────────────────────────
  r++; // spacer
  sheet.getRange(r, 1, 1, 8).merge()
    .setValue('THIS WEEK\'S FAST TRACK LOG \u2014 Check off what you do each day. Col H shows your daily bonus.')
    .setBackground('#1565c0').setFontColor('#ffffff')
    .setFontWeight('bold').setFontSize(10).setHorizontalAlignment('center');
  sheet.setRowHeight(r, 28); r++;

  // Action name headers (B-G) + "DAYS" label in H
  sheet.getRange(r, 1).setValue('DAY')
    .setBackground('#1565c0').setFontColor('#ffffff').setFontWeight('bold').setFontSize(8).setHorizontalAlignment('center');
  for (var i = 0; i < 6; i++) {
    sheet.getRange(r, 2 + i).setValue(actions[i].shortName)
      .setBackground('#1565c0').setFontColor('#f9a825').setFontWeight('bold').setFontSize(8)
      .setHorizontalAlignment('center').setWrap(true);
  }
  sheet.getRange(r, 8).setValue('TODAY\'S TOTAL')
    .setBackground('#1565c0').setFontColor('#f9a825').setFontWeight('bold').setFontSize(8)
    .setHorizontalAlignment('center').setWrap(true);
  sheet.setRowHeight(r, 30); r++;

  // Per-session days-saved sub-row
  sheet.getRange(r, 1).setValue('per session:')
    .setBackground('#e3f2fd').setFontSize(7).setFontColor('#1565c0').setHorizontalAlignment('right').setFontStyle('italic');
  for (var i = 0; i < 6; i++) {
    sheet.getRange(r, 2 + i).setValue('+' + actions[i].daysSaved.toFixed(2) + 'd')
      .setBackground('#e3f2fd').setFontSize(7).setFontColor('#1565c0').setHorizontalAlignment('center');
  }
  sheet.getRange(r, 8).setValue('days saved').setBackground('#e3f2fd').setFontSize(7).setFontColor('#1565c0').setHorizontalAlignment('center');
  sheet.setRowHeight(r, 15); r++;

  // Mon-Sun rows: labels + backgrounds + per-day total formulas
  var monRow = r;
  for (var d = 0; d < 7; d++) {
    var dayBg  = d % 2 === 0 ? '#fafafa' : '#f0f4ff';
    var curRow = r + d;
    sheet.getRange(curRow, 1).setValue(dayLabels[d])
      .setBackground(dayBg).setFontWeight('bold').setFontSize(9).setHorizontalAlignment('center');
    // Checkbox background prep (checkboxes set in batch below)
    sheet.getRange(curRow, 2, 1, 6).setBackground(dayBg).setHorizontalAlignment('center');
    // Per-day total formula in col H
    var parts = [];
    for (var i = 0; i < 6; i++) {
      parts.push('IF(' + colLetters[i] + curRow + ',' + actions[i].daysSaved + ',0)');
    }
    sheet.getRange(curRow, 8).setFormula('=ROUND(' + parts.join('+') + ',2)')
      .setBackground(dayBg).setFontColor('#1565c0').setFontWeight('bold').setFontSize(9).setHorizontalAlignment('center');
    sheet.setRowHeight(curRow, 24);
  }
  // Batch-create all 42 checkboxes (7 days × 6 actions)
  var cbRule = SpreadsheetApp.newDataValidation().requireCheckbox().build();
  sheet.getRange(monRow, 2, 7, 6).setDataValidation(cbRule).setValue(false);
  r += 7;
  var sunRow = r - 1;

  // Sessions-per-action summary row
  sheet.getRange(r, 1).setValue('Sessions this week:')
    .setBackground('#c8e6c9').setFontSize(8).setFontWeight('bold').setFontColor('#1b5e20').setHorizontalAlignment('right');
  for (var i = 0; i < 6; i++) {
    var col = colLetters[i];
    sheet.getRange(r, 2 + i)
      .setFormula('=COUNTIF(' + col + monRow + ':' + col + sunRow + ',TRUE)')
      .setBackground('#c8e6c9').setFontSize(9).setFontWeight('bold').setFontColor('#1b5e20').setHorizontalAlignment('center');
  }
  var countRow = r;
  sheet.getRange(r, 8).setValue('').setBackground('#c8e6c9');
  sheet.setRowHeight(r, 18); r++;

  // Days-saved-per-action summary row
  sheet.getRange(r, 1).setValue('Days saved per action:')
    .setBackground('#a5d6a7').setFontSize(8).setFontWeight('bold').setFontColor('#1b5e20').setHorizontalAlignment('right');
  for (var i = 0; i < 6; i++) {
    var col = colLetters[i];
    sheet.getRange(r, 2 + i)
      .setFormula('=ROUND(' + col + countRow + '*' + actions[i].daysSaved + ',2)')
      .setBackground('#a5d6a7').setFontSize(9).setFontWeight('bold').setFontColor('#1b5e20').setHorizontalAlignment('center');
  }
  var daysSavedRow = r;
  sheet.getRange(r, 8).setValue('').setBackground('#a5d6a7');
  sheet.setRowHeight(r, 18); r++;

  // WEEK TOTAL row
  sheet.getRange(r, 1, 1, 7).merge()
    .setValue('WEEK TOTAL DAYS SAVED:')
    .setBackground('#2e7d32').setFontColor('#f9a825').setFontWeight('bold').setFontSize(10).setHorizontalAlignment('right');
  sheet.getRange(r, 8)
    .setFormula('=ROUND(SUM(B' + daysSavedRow + ':G' + daysSavedRow + '),2)')
    .setBackground('#f9a825').setFontColor('#1b5e20').setFontWeight('bold').setFontSize(13).setHorizontalAlignment('center');
  sheet.setRowHeight(r, 30); r++;

  // Carry-forward tip
  sheet.getRange(r, 1, 1, 8).merge()
    .setValue('\u2192 At the end of the week, copy the number above into the ALL-TIME log below. Watch your 6-pack date get closer every week.')
    .setBackground('#e8f5e9').setFontColor('#2e7d32').setFontSize(8).setFontStyle('italic').setWrap(true);
  sheet.setRowHeight(r, 18); r++;

  // ── ALL-TIME PROGRESS TRACKER ────────────────────────────────────────────
  r++; // spacer
  sheet.getRange(r, 1, 1, 8).merge()
    .setValue('ALL-TIME FAST TRACK PROGRESS \u2014 Your 6-Pack Countdown')
    .setBackground('#1b5e20').setFontColor('#f9a825')
    .setFontWeight('bold').setFontSize(11).setHorizontalAlignment('center');
  sheet.setRowHeight(r, 28); r++;

  // Goal context
  sheet.getRange(r, 1, 1, 8).merge()
    .setValue('GOAL: ' + CUT.START_WEIGHT + ' \u2192 ' + CUT.TARGET_WEIGHT + ' lbs (' + lbsToLose.toFixed(1) + ' lbs to lose)   \u00b7   ' + CUT.RATE_PER_WEEK + ' lb/week normal pace   \u00b7   ~' + daysNeeded + ' days at base deficit (' + deficit + ' cal/day)')
    .setBackground('#f1f8e9').setFontColor('#1b5e20').setFontSize(8).setWrap(true).setFontStyle('italic');
  sheet.setRowHeight(r, 22); r++;

  // Cut start date input
  sheet.getRange(r, 1).setValue('CUT START DATE \u2192')
    .setBackground('#fff9c4').setFontWeight('bold').setFontSize(9).setFontColor('#e65100').setHorizontalAlignment('right');
  sheet.getRange(r, 2, 1, 2).merge()
    .setValue(new Date())
    .setBackground('#fff9c4').setFontWeight('bold').setFontSize(10).setHorizontalAlignment('center')
    .setNumberFormat('yyyy-mm-dd');
  sheet.getRange(r, 4, 1, 5).merge()
    .setValue('Update this if your cut started earlier. All projected dates recalculate automatically.')
    .setBackground('#fff9c4').setFontSize(8).setFontColor('#e65100').setFontStyle('italic').setWrap(true);
  var startDateRow = r;
  sheet.setRowHeight(r, 22); r++;

  // Cumulative log headers
  r++; // spacer
  sheet.getRange(r, 1, 1, 8).setValues([['WEEK #','WEEK STARTING','DAYS SAVED THIS WEEK','RUNNING TOTAL','','','','']])
    .setBackground('#1565c0').setFontColor('#ffffff').setFontWeight('bold').setFontSize(8).setHorizontalAlignment('center');
  sheet.getRange(r, 5, 1, 4).merge();
  sheet.setRowHeight(r, 20); r++;

  // 20 weekly data rows (pre-formatted)
  var cumDataStartRow = r;
  for (var w = 0; w < 20; w++) {
    var cumBg = w % 2 === 0 ? '#f8f9fa' : '#ffffff';
    sheet.getRange(r, 1).setValue('Week ' + (w + 1)).setBackground(cumBg).setFontSize(9).setHorizontalAlignment('center').setFontColor('#888888');
    sheet.getRange(r, 2).setValue('').setBackground(cumBg).setNumberFormat('yyyy-mm-dd').setFontSize(9).setHorizontalAlignment('center').setFontColor('#555555');
    sheet.getRange(r, 3).setValue('').setBackground(cumBg).setFontSize(10).setHorizontalAlignment('center').setFontColor('#1b5e20').setFontWeight('bold');
    sheet.getRange(r, 4).setFormula('=IFERROR(SUM($C$' + cumDataStartRow + ':C' + r + '),0)')
      .setBackground(cumBg).setFontSize(9).setHorizontalAlignment('center').setFontColor('#1565c0').setFontWeight('bold');
    sheet.getRange(r, 5, 1, 4).merge().setValue('').setBackground(cumBg);
    sheet.setRowHeight(r, 20); r++;
  }
  var cumDataEndRow = r - 1;

  // ── SUMMARY: TOTAL DAYS SAVED + PROJECTED DATES ──────────────────────────
  r++; // spacer

  // Total days saved
  sheet.getRange(r, 1, 1, 3).merge()
    .setValue('TOTAL DAYS SAVED (all time):')
    .setBackground('#1b5e20').setFontColor('#ffffff').setFontWeight('bold').setFontSize(10).setHorizontalAlignment('right');
  sheet.getRange(r, 4).setFormula('=IFERROR(D' + cumDataEndRow + ',0)')
    .setBackground('#f9a825').setFontColor('#1b5e20').setFontWeight('bold').setFontSize(13).setHorizontalAlignment('center');
  sheet.getRange(r, 5, 1, 4).merge()
    .setValue('days shaved off your 6-pack goal \u2014 keep stacking')
    .setBackground('#1b5e20').setFontColor('#a5d6a7').setFontSize(9).setFontStyle('italic');
  sheet.setRowHeight(r, 30); r++;

  // Original projected date
  sheet.getRange(r, 1, 1, 3).merge()
    .setValue('Original projected 6-pack date:')
    .setBackground('#f5f5f5').setFontSize(9).setHorizontalAlignment('right').setFontColor('#888888');
  sheet.getRange(r, 4).setFormula('=IFERROR(B' + startDateRow + '+' + daysNeeded + ',"Set start date above")')
    .setBackground('#f5f5f5').setFontSize(9).setHorizontalAlignment('center').setNumberFormat('yyyy-mm-dd').setFontColor('#888888');
  sheet.getRange(r, 5, 1, 4).merge()
    .setValue('(base pace, no fast track)')
    .setBackground('#f5f5f5').setFontSize(8).setFontColor('#aaaaaa');
  sheet.setRowHeight(r, 20); r++;

  // New projected date
  sheet.getRange(r, 1, 1, 3).merge()
    .setValue('\u2714 YOUR NEW PROJECTED DATE:')
    .setBackground('#2e7d32').setFontColor('#ffffff').setFontWeight('bold').setFontSize(10).setHorizontalAlignment('right');
  sheet.getRange(r, 4).setFormula('=IFERROR(B' + startDateRow + '+' + daysNeeded + '-D' + cumDataEndRow + ',"Enter fast track days above")')
    .setBackground('#f9a825').setFontColor('#1b5e20').setFontWeight('bold').setFontSize(12).setHorizontalAlignment('center').setNumberFormat('yyyy-mm-dd');
  sheet.getRange(r, 5, 1, 4).merge()
    .setValue('Every session moves this date closer. This is your real scoreboard.')
    .setBackground('#2e7d32').setFontColor('#a5d6a7').setFontSize(9).setFontStyle('italic');
  sheet.setRowHeight(r, 30); r++;

  r++; // trailing spacer
  return r;
}

/**
 * Get suhoor plan for Ramadan
 */
function getSuhoorPlan() {
  return {
    title: 'SUHOOR (Pre-Dawn) — Slow-Release Protein',
    target: '~300-400 kcal, 30-50g protein',
    components: [
      { food: 'Greek yogurt (casein = slow-digesting)', amount: '200g', cal: 132, p: 20, c: 7, f: 3 },
      { food: 'Almonds', amount: '30g', cal: 174, p: 6, c: 7, f: 15 },
      { food: 'Whey protein (optional, if need more protein)', amount: '1 scoop', cal: 120, p: 25, c: 3, f: 1.5 }
    ],
    notes: [
      'Casein in Greek yogurt releases amino acids for 6-7 hours',
      'Drink 500ml-1L water at suhoor',
      'Take magnesium glycinate (400mg) for recovery + cramps',
      'Add pinch of salt to water for electrolytes',
      'Eat slowly and stop 10 min before Fajr'
    ]
  };
}
