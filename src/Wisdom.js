/**
 * Wisdom.js — Quran ayat & authentic hadith pool with contextual selection
 *
 * Every entry has: text, source, category, trigger
 * Categories: gratitude, consistency, patience, excellence, urgency, accountability, mercy, courage
 * Triggers: positive (good performance), negative (missed/slipped), streak_break, level_up,
 *           perfect_day, prayer, comeback, general
 */

var WISDOM_POOL = [

  // ============================================================
  // POSITIVE REINFORCEMENT
  // ============================================================

  // Gratitude / Shukr
  {
    text: 'If you are grateful, I will surely increase you in favor.',
    source: 'Surah Ibrahim 14:7',
    category: 'gratitude',
    trigger: 'positive'
  },
  {
    text: 'So remember Me; I will remember you. Be grateful to Me and do not deny Me.',
    source: 'Surah Al-Baqarah 2:152',
    category: 'gratitude',
    trigger: 'positive'
  },
  {
    text: 'He who does not thank people does not thank Allah.',
    source: 'Abu Dawud, Tirmidhi',
    category: 'gratitude',
    trigger: 'positive'
  },

  // Consistency
  {
    text: 'The most beloved of deeds to Allah are those that are most consistent, even if they are small.',
    source: 'Bukhari & Muslim',
    category: 'consistency',
    trigger: 'positive'
  },
  {
    text: 'Take up good deeds only as much as you are able, for the best deeds are those done regularly even if they are few.',
    source: 'Ibn Majah',
    category: 'consistency',
    trigger: 'positive'
  },
  {
    text: 'Whoever is consistent in praying at night, and sleep overcomes him, Allah will record for him the reward of his prayer, and his sleep will be charity for him.',
    source: 'Abu Dawud, Nasa\'i',
    category: 'consistency',
    trigger: 'positive'
  },

  // Excellence / Ihsan
  {
    text: 'Indeed, Allah loves those who act with excellence.',
    source: 'Surah Al-Baqarah 2:195',
    category: 'excellence',
    trigger: 'positive'
  },
  {
    text: 'Allah has prescribed excellence in everything. So if you kill, kill well; and if you slaughter, slaughter well.',
    source: 'Muslim',
    category: 'excellence',
    trigger: 'positive'
  },
  {
    text: 'Indeed, Allah loves that when any of you does something, he does it with excellence.',
    source: 'Bayhaqi, Abu Ya\'la',
    category: 'excellence',
    trigger: 'perfect_day'
  },

  // Patience / Sabr
  {
    text: 'Indeed, with hardship comes ease. Indeed, with hardship comes ease.',
    source: 'Surah Ash-Sharh 94:5-6',
    category: 'patience',
    trigger: 'positive'
  },
  {
    text: 'And be patient, for indeed Allah does not allow to be lost the reward of those who do good.',
    source: 'Surah Hud 11:115',
    category: 'patience',
    trigger: 'positive'
  },
  {
    text: 'How wonderful is the affair of the believer, for all his affairs are good. If something good happens to him, he is thankful and that is good for him. If something bad happens to him, he is patient and that is good for him.',
    source: 'Muslim',
    category: 'patience',
    trigger: 'positive'
  },
  {
    text: 'No fatigue, disease, sorrow, sadness, hurt, or distress befalls a Muslim, even the prick of a thorn, except that Allah expiates some of his sins for that.',
    source: 'Bukhari & Muslim',
    category: 'patience',
    trigger: 'positive'
  },

  // Success / Reward
  {
    text: 'And whoever fears Allah — He will make a way out for him. And will provide for him from where he does not expect.',
    source: 'Surah At-Talaq 65:2-3',
    category: 'patience',
    trigger: 'positive'
  },
  {
    text: 'Allah does not burden a soul beyond that it can bear.',
    source: 'Surah Al-Baqarah 2:286',
    category: 'courage',
    trigger: 'positive'
  },
  {
    text: 'So whoever does an atom\'s weight of good will see it.',
    source: 'Surah Az-Zalzalah 99:7',
    category: 'excellence',
    trigger: 'positive'
  },

  // ============================================================
  // NEGATIVE REINFORCEMENT
  // ============================================================

  // Wasted Time / Urgency
  {
    text: 'By time, indeed mankind is in loss — except those who believe and do righteous deeds, and encourage each other to truth, and encourage each other to patience.',
    source: 'Surah Al-Asr 103:1-3',
    category: 'urgency',
    trigger: 'negative'
  },
  {
    text: 'Take benefit of five before five: your youth before your old age, your health before your sickness, your wealth before your poverty, your free time before your preoccupation, and your life before your death.',
    source: 'Al-Hakim, Bayhaqi',
    category: 'urgency',
    trigger: 'negative'
  },
  {
    text: 'There are two blessings that many people are deceived into losing: health and free time.',
    source: 'Bukhari',
    category: 'urgency',
    trigger: 'negative'
  },
  {
    text: 'The feet of the son of Adam will not move on the Day of Judgment until he is asked about his life and how he spent it, his knowledge and what he did with it, his wealth and how he earned it and spent it, and his body and how he used it.',
    source: 'Tirmidhi',
    category: 'accountability',
    trigger: 'negative'
  },
  {
    text: 'Be in this world as if you were a stranger or a traveler along a path.',
    source: 'Bukhari',
    category: 'urgency',
    trigger: 'negative'
  },

  // Accountability
  {
    text: 'Every soul will taste death. And you will only receive your full reward on the Day of Resurrection.',
    source: 'Surah Ali \'Imran 3:185',
    category: 'accountability',
    trigger: 'negative'
  },
  {
    text: 'Did you think that We created you in play and that you would not be returned to Us?',
    source: 'Surah Al-Mu\'minun 23:115',
    category: 'accountability',
    trigger: 'negative'
  },
  {
    text: 'And We have already created man and know what his soul whispers to him, and We are closer to him than his jugular vein.',
    source: 'Surah Qaf 50:16',
    category: 'accountability',
    trigger: 'negative'
  },
  {
    text: 'Account yourselves before you are held to account, and weigh your deeds before they are weighed for you.',
    source: 'Umar ibn al-Khattab (ra)',
    category: 'accountability',
    trigger: 'negative'
  },

  // Self-Deception / Laziness
  {
    text: 'O you who have believed, why do you say what you do not do? It is most hateful in the sight of Allah that you say what you do not do.',
    source: 'Surah As-Saff 61:2-3',
    category: 'accountability',
    trigger: 'negative'
  },
  {
    text: 'The strong believer is better and more beloved to Allah than the weak believer, while there is good in both.',
    source: 'Muslim',
    category: 'courage',
    trigger: 'negative'
  },
  {
    text: 'O Allah, I seek refuge in You from anxiety and sorrow, from weakness and laziness, from miserliness and cowardice, from the burden of debts and from being overpowered by men.',
    source: 'Bukhari',
    category: 'courage',
    trigger: 'negative'
  },

  // ============================================================
  // STREAK BREAK SPECIFIC
  // ============================================================
  {
    text: 'Say: O My servants who have transgressed against themselves, do not despair of the mercy of Allah. Indeed, Allah forgives all sins.',
    source: 'Surah Az-Zumar 39:53',
    category: 'mercy',
    trigger: 'streak_break'
  },
  {
    text: 'Every son of Adam sins, and the best of those who sin are those who repent.',
    source: 'Tirmidhi, Ibn Majah',
    category: 'mercy',
    trigger: 'streak_break'
  },
  {
    text: 'Allah is more pleased with the repentance of His servant than a man who loses his camel in a desert and then finds it.',
    source: 'Bukhari & Muslim',
    category: 'mercy',
    trigger: 'streak_break'
  },
  {
    text: 'And whoever does a wrong or wrongs himself but then seeks forgiveness of Allah will find Allah Forgiving and Merciful.',
    source: 'Surah An-Nisa 4:110',
    category: 'mercy',
    trigger: 'streak_break'
  },

  // ============================================================
  // COMEBACK / PHOENIX
  // ============================================================
  {
    text: 'Do not belittle any good deed, even if it is meeting your brother with a cheerful face.',
    source: 'Muslim',
    category: 'consistency',
    trigger: 'comeback'
  },
  {
    text: 'The one who repents from sin is like the one who has no sin.',
    source: 'Ibn Majah',
    category: 'mercy',
    trigger: 'comeback'
  },
  {
    text: 'And it is He who accepts repentance from His servants and pardons misdeeds, and He knows what you do.',
    source: 'Surah Ash-Shura 42:25',
    category: 'mercy',
    trigger: 'comeback'
  },

  // ============================================================
  // LEVEL UP
  // ============================================================
  {
    text: 'And that there is not for man except that for which he strives.',
    source: 'Surah An-Najm 53:39',
    category: 'excellence',
    trigger: 'level_up'
  },
  {
    text: 'And those who strive for Us — We will surely guide them to Our ways.',
    source: 'Surah Al-Ankabut 29:69',
    category: 'excellence',
    trigger: 'level_up'
  },
  {
    text: 'Is the reward for good anything but good?',
    source: 'Surah Ar-Rahman 55:60',
    category: 'gratitude',
    trigger: 'level_up'
  },

  // ============================================================
  // PRAYER SPECIFIC
  // ============================================================
  {
    text: 'Indeed, prayer prohibits immorality and wrongdoing, and the remembrance of Allah is greater.',
    source: 'Surah Al-Ankabut 29:45',
    category: 'excellence',
    trigger: 'prayer'
  },
  {
    text: 'The first matter the servant will be held accountable for on the Day of Judgment is the prayer. If it is sound, then the rest of his deeds will be sound. If it is deficient, then the rest of his deeds will be deficient.',
    source: 'Tabarani',
    category: 'accountability',
    trigger: 'prayer'
  },
  {
    text: 'Between a man and disbelief and paganism is the abandonment of prayer.',
    source: 'Muslim',
    category: 'urgency',
    trigger: 'prayer'
  },

  // ============================================================
  // PERFECT DAY
  // ============================================================
  {
    text: 'Whoever comes with a good deed will have ten times the like thereof.',
    source: 'Surah Al-An\'am 6:160',
    category: 'gratitude',
    trigger: 'perfect_day'
  },
  {
    text: 'He has succeeded who purifies himself, and mentions the name of his Lord and prays.',
    source: 'Surah Al-A\'la 87:14-15',
    category: 'excellence',
    trigger: 'perfect_day'
  },

  // ============================================================
  // GENERAL / RAMADAN
  // ============================================================
  {
    text: 'When Ramadan begins, the gates of Paradise are opened, the gates of Hellfire are closed, and the devils are chained.',
    source: 'Bukhari & Muslim',
    category: 'urgency',
    trigger: 'general'
  },
  {
    text: 'Whoever fasts Ramadan out of faith and in the hope of reward, his previous sins will be forgiven.',
    source: 'Bukhari & Muslim',
    category: 'gratitude',
    trigger: 'general'
  },
  {
    text: 'Tie your camel, then put your trust in Allah.',
    source: 'Tirmidhi',
    category: 'excellence',
    trigger: 'general'
  },
  {
    text: 'The best of you are those who are best in character.',
    source: 'Bukhari',
    category: 'excellence',
    trigger: 'general'
  }
];

/**
 * Get a contextual wisdom entry based on yesterday's performance
 */
function getContextualWisdom(context) {
  var trigger = context.trigger || 'general';
  var pool = WISDOM_POOL.filter(function(w) { return w.trigger === trigger; });

  // Fallback to general if no entries match
  if (pool.length === 0) {
    pool = WISDOM_POOL.filter(function(w) { return w.trigger === 'general'; });
  }

  // Use day-of-year as seed for deterministic daily rotation within the trigger pool
  var today = new Date();
  var dayOfYear = getDayOfYear(today);
  var index = dayOfYear % pool.length;

  return pool[index];
}

/**
 * Determine the wisdom trigger based on yesterday's performance data
 */
function determineWisdomTrigger(yesterdayData) {
  if (!yesterdayData) return 'general';

  // Streak just broke
  if (yesterdayData.streakBroke) return 'streak_break';

  // Comeback from break
  if (yesterdayData.isPhoenix) return 'comeback';

  // Perfect day
  if (yesterdayData.habitsScore === HABITS.length) return 'perfect_day';

  // Missed check-in or poor performance
  if (!yesterdayData.completed) return 'negative';
  if (yesterdayData.habitsScore <= 2) return 'negative';

  // Prayer not done (specific reminder)
  if (yesterdayData.prayerMissed) return 'prayer';

  // Good day
  return 'positive';
}

/**
 * Format a wisdom entry for display
 */
function formatWisdom(entry) {
  return '"' + entry.text + '"\n— ' + entry.source;
}

/**
 * Get the wisdom data to populate the Wisdom sheet during setup
 */
function getWisdomSheetData() {
  return WISDOM_POOL.map(function(w) {
    return [w.text, w.source, w.category, w.trigger];
  });
}
