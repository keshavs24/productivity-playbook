/**
 * Achievements.js — Badge definitions, condition checking, and unlock logic
 */

/**
 * Get all achievement definitions
 */
function getAchievementDefinitions() {
  return [
    // ============================================================
    // STREAK BADGES
    // ============================================================
    { icon: '🌱', name: 'First Steps', description: 'Complete a 3-day streak', category: 'Streak', xp: 50,
      check: function(d) { return d.bestStreak >= 3; } },
    { icon: '⚔️', name: 'Sabr Begins', description: 'Complete a 7-day streak', category: 'Streak', xp: 100,
      check: function(d) { return d.bestStreak >= 7; } },
    { icon: '🛡️', name: 'Fortnight of Istiqamah', description: 'Complete a 14-day streak', category: 'Streak', xp: 200,
      check: function(d) { return d.bestStreak >= 14; } },
    { icon: '🌙', name: 'Ramadan Warrior', description: 'Complete a 30-day streak', category: 'Streak', xp: 500,
      check: function(d) { return d.bestStreak >= 30; } },
    { icon: '🏔️', name: 'Quarterly Mujahid', description: 'Complete a 90-day streak', category: 'Streak', xp: 1000,
      check: function(d) { return d.bestStreak >= 90; } },
    { icon: '🔥', name: 'Phoenix Rising', description: 'Returned after a broken streak and logged 3 consecutive days', category: 'Streak', xp: 100,
      check: function(d) { return d.phoenixCompleted; } },

    // ============================================================
    // PRAYER / DEEN BADGES
    // ============================================================
    { icon: '🕌', name: 'Fajr Fighter x10', description: 'Woke before Fajr 10 times', category: 'Deen', xp: 150,
      check: function(d) { return d.habitCounts[0] >= 10; } },
    { icon: '🤲', name: 'Fajr Fighter x30', description: 'Woke before Fajr 30 times', category: 'Deen', xp: 300,
      check: function(d) { return d.habitCounts[0] >= 30; } },
    { icon: '☪️', name: 'Salah Guardian', description: 'All 5 prayers for 7 straight days', category: 'Deen', xp: 300,
      check: function(d) { return d.consecutiveHabit[1] >= 7; } },
    { icon: '📖', name: 'Dhikr of the Consistent', description: 'Quran reading 30 days straight', category: 'Deen', xp: 500,
      check: function(d) { return d.consecutiveHabit[5] >= 30; } },
    { icon: '⭐', name: 'Deen Master', description: 'Deen attribute average 4+ for 14 days', category: 'Deen', xp: 300,
      check: function(d) { return d.attrStreaks[3] >= 14; } },

    // ============================================================
    // HABIT BADGES
    // ============================================================
    { icon: '💎', name: 'Yawm Kamil (Perfect Day)', description: 'All 7 habits in one day', category: 'Habits', xp: 100,
      check: function(d) { return d.perfectDays >= 1; } },
    { icon: '👑', name: 'Perfect Week', description: '100% habits for 7 consecutive days', category: 'Habits', xp: 500,
      check: function(d) { return d.consecutivePerfectDays >= 7; } },
    { icon: '⚡', name: 'Iron Discipline x5', description: '5 Perfect Days in a single week', category: 'Habits', xp: 250,
      check: function(d) { return d.perfectDaysThisWeek >= 5; } },
    { icon: '🏋️', name: 'Gym Rat x30', description: '30 workouts logged', category: 'Habits', xp: 300,
      check: function(d) { return d.habitCounts[2] >= 30; } },
    { icon: '💪', name: 'Gym Rat x60', description: '60 workouts logged', category: 'Habits', xp: 500,
      check: function(d) { return d.habitCounts[2] >= 60; } },
    { icon: '🧠', name: 'Deep Worker x20', description: '20 days of 4h+ deep work', category: 'Habits', xp: 200,
      check: function(d) { return d.habitCounts[3] >= 20; } },
    { icon: '🚀', name: 'Ship It x10', description: 'Shipped something 10 times', category: 'Habits', xp: 150,
      check: function(d) { return d.habitCounts[4] >= 10; } },
    { icon: '📚', name: 'Bookworm x30', description: 'Read 30 min for 30 days', category: 'Habits', xp: 300,
      check: function(d) { return d.habitCounts[6] >= 30; } },

    // ============================================================
    // BUSINESS BADGES
    // ============================================================
    { icon: '💵', name: '$5K Club', description: 'Hit $5,000 MRR', category: 'Business', xp: 500,
      check: function(d) { return d.maxMRR >= 5000; } },
    { icon: '💰', name: '$10K Club', description: 'Hit $10,000 MRR', category: 'Business', xp: 500,
      check: function(d) { return d.maxMRR >= 10000; } },
    { icon: '🏦', name: '$15K Club', description: 'Hit $15,000 MRR', category: 'Business', xp: 500,
      check: function(d) { return d.maxMRR >= 15000; } },
    { icon: '💎', name: '$20K Club', description: 'Hit $20,000 MRR', category: 'Business', xp: 500,
      check: function(d) { return d.maxMRR >= 20000; } },
    { icon: '🏆', name: '$25K Club', description: 'Hit $25,000 MRR', category: 'Business', xp: 500,
      check: function(d) { return d.maxMRR >= 25000; } },
    { icon: '🛡️', name: 'Rizq Guardian', description: 'Hit $30,000 MRR — Target achieved!', category: 'Business', xp: 2000,
      check: function(d) { return d.maxMRR >= 30000; } },
    { icon: '⚜️', name: '$50K Club', description: 'Hit $50,000 MRR', category: 'Business', xp: 1000,
      check: function(d) { return d.maxMRR >= 50000; } },
    { icon: '👑', name: 'Rizq Master', description: 'Hit $100,000 MRR — The ultimate goal!', category: 'Business', xp: 5000,
      check: function(d) { return d.maxMRR >= 100000; } },
    { icon: '📈', name: 'Growth Spurt', description: '20%+ MRR growth in a single week', category: 'Business', xp: 300,
      check: function(d) { return d.maxWeeklyMRRGrowth >= 0.20; } },
    { icon: '📊', name: 'Consistent Growth', description: 'MRR grew every week for 4 consecutive weeks', category: 'Business', xp: 500,
      check: function(d) { return d.consecutiveMRRGrowthWeeks >= 4; } },

    // ============================================================
    // FITNESS BADGES
    // ============================================================
    { icon: '⚖️', name: 'Weigh-In Warrior', description: 'Logged weight 30 days in a row', category: 'Fitness', xp: 200,
      check: function(d) { return d.consecutiveWeighIns >= 30; } },
    { icon: '🎯', name: 'Lean Machine', description: 'Hit body fat target', category: 'Fitness', xp: 2000,
      check: function(d) { return d.bodyFatTarget; } },
    { icon: '🔥', name: 'Beast Mode', description: 'Workout streak of 21 days', category: 'Fitness', xp: 400,
      check: function(d) { return d.consecutiveHabit[2] >= 21; } },
    { icon: '🥗', name: 'Clean Eater x7', description: 'Diet score 4+ for 7 consecutive days', category: 'Diet', xp: 200,
      check: function(d) { return d.dietStreak >= 7; } },
    { icon: '🥩', name: 'OMAD Warrior', description: 'Diet score 5 for 14 consecutive days', category: 'Diet', xp: 500,
      check: function(d) { return d.perfectDietStreak >= 14; } },
    { icon: '🏆', name: 'OMAD Master', description: 'Diet score 5 for 30 consecutive days', category: 'Diet', xp: 1000,
      check: function(d) { return d.perfectDietStreak >= 30; } },
    { icon: '📉', name: 'First 5 Down', description: 'Lost 5 lb from starting weight', category: 'Diet', xp: 300,
      check: function(d) { return d.weightLost >= 5; } },
    { icon: '⚖️', name: '10 lb Shredded', description: 'Lost 10 lb from starting weight', category: 'Diet', xp: 500,
      check: function(d) { return d.weightLost >= 10; } },
    { icon: '🔥', name: 'Sub-16% Club', description: 'Body fat below 16%', category: 'Diet', xp: 500,
      check: function(d) { return d.lowestBF > 0 && d.lowestBF <= 16; } },
    { icon: '💪', name: 'Sub-14% Club', description: 'Body fat below 14%', category: 'Diet', xp: 750,
      check: function(d) { return d.lowestBF > 0 && d.lowestBF <= 14; } },
    { icon: '⚡', name: 'No Late Night Snack x14', description: 'Diet score 4+ for 14 straight days', category: 'Diet', xp: 400,
      check: function(d) { return d.dietStreak >= 14; } },
    { icon: '📊', name: 'Scale Soldier', description: 'Logged weight (AM+PM) for 30 straight days', category: 'Diet', xp: 300,
      check: function(d) { return d.consecutiveWeighIns >= 30; } },

    // ============================================================
    // CHARACTER BADGES
    // ============================================================
    { icon: '🗿', name: 'Unshakeable', description: 'Mental Toughness avg 4+ for 14 days', category: 'Character', xp: 300,
      check: function(d) { return d.attrStreaks[4] >= 14; } },
    { icon: '🤝', name: 'Man of His Word', description: 'Reliability avg 4+ for 14 days', category: 'Character', xp: 300,
      check: function(d) { return d.attrStreaks[5] >= 14; } },
    { icon: '🎯', name: 'Laser Focus', description: 'Focus avg 4+ for 14 days', category: 'Character', xp: 300,
      check: function(d) { return d.attrStreaks[1] >= 14; } },
    { icon: '🦁', name: 'Iron Will', description: 'Discipline avg 4+ for 14 days', category: 'Character', xp: 300,
      check: function(d) { return d.attrStreaks[0] >= 14; } },
    { icon: '✨', name: 'Full Character', description: 'All 6 attributes avg 4+ for 7 days', category: 'Character', xp: 1000,
      check: function(d) {
        for (var i = 0; i < ATTRIBUTES.length; i++) {
          if ((d.attrStreaks[i] || 0) < 7) return false;
        }
        return true;
      }
    },

    // ============================================================
    // LIFT BADGES
    // ============================================================
    { icon: '🏋️', name: 'First Lift', description: 'Log your first lift session', category: 'Lifts', xp: 50,
      check: function(d) { return d.liftSessions >= 1; } },
    { icon: '⚒️', name: 'Iron Disciple', description: 'Complete 30 lift sessions', category: 'Lifts', xp: 500,
      check: function(d) { return d.liftSessions >= 30; } },
    { icon: '💥', name: 'PR Breaker', description: 'Set 10 personal records', category: 'Lifts', xp: 300,
      check: function(d) { return d.prCount >= 10; } },
    { icon: '🔱', name: 'Volume King', description: 'Log 500 total sets', category: 'Lifts', xp: 500,
      check: function(d) { return d.totalSets >= 500; } },
    { icon: '🦾', name: 'Century Lifter', description: 'Complete 100 lift sessions', category: 'Lifts', xp: 1000,
      check: function(d) { return d.liftSessions >= 100; } },

    // ============================================================
    // PRAYER BADGES
    // ============================================================
    { icon: '🕋', name: 'Fard Guardian', description: 'All 5 fard prayers for 7 consecutive days', category: 'Prayer', xp: 300,
      check: function(d) { return d.fardStreak >= 7; } },
    { icon: '🌙', name: 'Qiyam Al-Layl', description: 'Witr prayer for 30 consecutive days', category: 'Prayer', xp: 500,
      check: function(d) { return d.witrStreak >= 30; } },
    { icon: '✨', name: 'Full Salah x7', description: 'All 11 prayers for 7 consecutive days', category: 'Prayer', xp: 750,
      check: function(d) { return d.fullPrayerStreak >= 7; } },
    { icon: '🤲', name: 'Fard Guardian x30', description: 'All 5 fard prayers for 30 consecutive days', category: 'Prayer', xp: 750,
      check: function(d) { return d.fardStreak >= 30; } },

    // ============================================================
    // NUTRITION BADGES
    // ============================================================
    { icon: '🥗', name: 'Macro Master', description: 'Log nutrition 7 consecutive days with protein target hit', category: 'Nutrition', xp: 200,
      check: function(d) { return d.nutritionStreak >= 7; } },
    { icon: '📊', name: 'Nutrition Tracker x30', description: 'Log nutrition for 30 consecutive days', category: 'Nutrition', xp: 500,
      check: function(d) { return d.nutritionStreak >= 30; } },
    { icon: '🎯', name: 'Calorie Sniper', description: 'Stay within 100 cal of target for 7 days', category: 'Nutrition', xp: 300,
      check: function(d) { return d.calorieAccuracyStreak >= 7; } },

    // ============================================================
    // META / LEVEL BADGES
    // ============================================================
    { icon: '🔍', name: 'Mureed (Seeker)', description: 'Reach Level 5', category: 'Meta', xp: 100,
      check: function(d) { return d.level >= 5; } },
    { icon: '⚔️', name: 'Mujtahid (Striver)', description: 'Reach Level 10', category: 'Meta', xp: 200,
      check: function(d) { return d.level >= 10; } },
    { icon: '🏅', name: 'Mutqin (Excellence)', description: 'Reach Level 20', category: 'Meta', xp: 500,
      check: function(d) { return d.level >= 20; } },
    { icon: '🏛️', name: 'Istiqamah (Steadfast)', description: 'Reach Level 30', category: 'Meta', xp: 1000,
      check: function(d) { return d.level >= 30; } },
    { icon: '💫', name: 'XP 10K Club', description: 'Earn 10,000 total XP', category: 'Meta', xp: 500,
      check: function(d) { return d.totalXP >= 10000; } },
    { icon: '📋', name: 'Reviewer', description: 'Complete 4 weekly reviews', category: 'Meta', xp: 100,
      check: function(d) { return d.weeklyReviews >= 4; } },
    { icon: '📝', name: 'Consistent Reviewer', description: 'Complete 12 weekly reviews', category: 'Meta', xp: 300,
      check: function(d) { return d.weeklyReviews >= 12; } }
  ];
}

/**
 * Gather all data needed for achievement condition checking
 */
function gatherAchievementData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var log = ss.getSheetByName(SHEET_NAMES.DAILY_LOG);
  var review = ss.getSheetByName(SHEET_NAMES.WEEKLY_REVIEW);
  var dataSheet = ss.getSheetByName(SHEET_NAMES.DATA);

  if (!log) return null;

  var lastRow = log.getLastRow();
  if (lastRow < 2) return null;

  var allData = log.getRange(2, 1, lastRow - 1, DL.CALORIES_EST).getValues();

  var data = {
    bestStreak: 0,
    totalXP: 0,
    level: 1,
    perfectDays: 0,
    consecutivePerfectDays: 0,
    perfectDaysThisWeek: 0,
    habitCounts: [],     // Total count per habit
    consecutiveHabit: [], // Current consecutive days per habit
    attrStreaks: [],      // Consecutive days each attribute >= 4
    maxMRR: 0,
    maxWeeklyMRRGrowth: 0,
    consecutiveMRRGrowthWeeks: 0,
    consecutiveWeighIns: 0,
    bodyFatTarget: false,
    phoenixCompleted: false,
    weeklyReviews: 0,
    dietStreak: 0,           // Consecutive days diet score >= 4
    perfectDietStreak: 0,    // Consecutive days diet score == 5
    weightLost: 0,           // Total weight lost from CUT.START_WEIGHT
    lowestBF: 0,             // Lowest body fat % recorded
    liftSessions: 0,         // Total lift sessions
    prCount: 0,              // Total PRs set
    totalSets: 0,            // Total sets logged
    fardStreak: 0,           // Consecutive days all 5 fard
    witrStreak: 0,           // Consecutive days witr done
    fullPrayerStreak: 0,     // Consecutive days all 11 prayers
    nutritionStreak: 0,      // Consecutive days with nutrition logged
    calorieAccuracyStreak: 0 // Consecutive days within 100 cal of target
  };

  // Initialize arrays
  for (var h = 0; h < HABITS.length; h++) {
    data.habitCounts[h] = 0;
    data.consecutiveHabit[h] = 0;
  }
  for (var a = 0; a < ATTRIBUTES.length; a++) {
    data.attrStreaks[a] = 0;
  }

  // Process daily log data
  var currentPerfectStreak = 0;
  var currentWeighInStreak = 0;
  var currentDietStreak = 0;
  var currentPerfectDietStreak = 0;
  var monday = getMonday(new Date());
  var prevDate = null;

  for (var i = 0; i < allData.length; i++) {
    var row = allData[i];
    var date = row[DL.DATE - 1];
    var completed = row[DL.COMPLETED - 1];
    var streak = row[DL.STREAK - 1] || 0;
    var totalXP = row[DL.TOTAL_XP - 1] || 0;
    var mrr = row[DL.MRR - 1] || 0;
    var weight = row[DL.WEIGHT - 1];
    var bodyFat = row[DL.BODY_FAT - 1];
    var habitsScore = row[DL.HABITS_SCORE - 1] || 0;

    // Best streak
    if (streak > data.bestStreak) data.bestStreak = streak;

    // Total XP (use latest)
    data.totalXP = totalXP;

    // MRR
    if (mrr > data.maxMRR) data.maxMRR = mrr;

    // Habit counts
    for (var hc = 0; hc < HABITS.length; hc++) {
      if (row[DL.HABIT_START - 1 + hc] === true) {
        data.habitCounts[hc]++;
      }
    }

    // Perfect day
    if (habitsScore === HABITS.length) {
      data.perfectDays++;
      currentPerfectStreak++;
      if (currentPerfectStreak > data.consecutivePerfectDays) {
        data.consecutivePerfectDays = currentPerfectStreak;
      }
      // Check if this week
      if (date instanceof Date && stripTime(date) >= monday) {
        data.perfectDaysThisWeek++;
      }
    } else {
      currentPerfectStreak = 0;
    }

    // Consecutive habit tracking
    var isConsecutive = prevDate && date instanceof Date &&
      daysBetween(prevDate, date) === 1;

    for (var ch = 0; ch < HABITS.length; ch++) {
      if (row[DL.HABIT_START - 1 + ch] === true) {
        if (isConsecutive || i === 0) {
          data.consecutiveHabit[ch]++;
        } else {
          data.consecutiveHabit[ch] = 1;
        }
      } else {
        data.consecutiveHabit[ch] = 0;
      }
    }

    // Attribute streaks (consecutive days >= 4)
    for (var ca = 0; ca < ATTRIBUTES.length; ca++) {
      var attrVal = row[DL.ATTR_START - 1 + ca];
      if (attrVal && attrVal >= 4) {
        if (isConsecutive || i === 0) {
          data.attrStreaks[ca]++;
        } else {
          data.attrStreaks[ca] = 1;
        }
      } else {
        data.attrStreaks[ca] = 0;
      }
    }

    // Weight tracking
    if (weight && weight > 0) {
      if (isConsecutive || i === 0) {
        currentWeighInStreak++;
      } else {
        currentWeighInStreak = 1;
      }
      if (currentWeighInStreak > data.consecutiveWeighIns) {
        data.consecutiveWeighIns = currentWeighInStreak;
      }
    } else {
      currentWeighInStreak = 0;
    }

    // Body fat target
    if (bodyFat && bodyFat <= GOALS.sixPack.targetBodyFat) {
      data.bodyFatTarget = true;
    }

    // Body fat tracking
    if (bodyFat && bodyFat > 0) {
      if (data.lowestBF === 0 || bodyFat < data.lowestBF) {
        data.lowestBF = bodyFat;
      }
    }

    // Weight lost
    if (weight && weight > 0) {
      var lost = CUT.START_WEIGHT - weight;
      if (lost > data.weightLost) data.weightLost = lost;
    }

    // Diet score tracking
    var dietScore = row[DL.DIET_SCORE - 1];
    if (dietScore && dietScore >= 4) {
      if (isConsecutive || i === 0) {
        currentDietStreak = (currentDietStreak || 0) + 1;
      } else {
        currentDietStreak = 1;
      }
      if (currentDietStreak > data.dietStreak) data.dietStreak = currentDietStreak;
    } else {
      currentDietStreak = 0;
    }

    if (dietScore && dietScore === 5) {
      if (isConsecutive || i === 0) {
        currentPerfectDietStreak = (currentPerfectDietStreak || 0) + 1;
      } else {
        currentPerfectDietStreak = 1;
      }
      if (currentPerfectDietStreak > data.perfectDietStreak) data.perfectDietStreak = currentPerfectDietStreak;
    } else {
      currentPerfectDietStreak = 0;
    }

    prevDate = date instanceof Date ? stripTime(date) : prevDate;
  }

  // Level
  data.level = getLevelFromXP(data.totalXP);

  // Phoenix check
  if (dataSheet) {
    var phoenixActivated = dataSheet.getRange('F4').getValue();
    if (phoenixActivated && data.bestStreak >= 3) {
      data.phoenixCompleted = true;
    }
  }

  // Weekly reviews count
  if (review) {
    var reviewLastRow = review.getLastRow();
    if (reviewLastRow >= 2) {
      var reviews = review.getRange(2, 18, reviewLastRow - 1, 1).getValues(); // "What Worked" column
      for (var wr = 0; wr < reviews.length; wr++) {
        if (reviews[wr][0] && String(reviews[wr][0]).trim().length > 0) {
          data.weeklyReviews++;
        }
      }
    }
  }

  // Lift data
  try {
    data.liftSessions = countLiftSessions();
    data.prCount = countPRs();
    data.totalSets = countTotalSets();
  } catch(e) { /* Lifts sheet may not exist */ }

  // Prayer streak data
  try {
    var prayerSheet = ss.getSheetByName(SHEET_NAMES.PRAYERS);
    if (prayerSheet && prayerSheet.getLastRow() >= 2) {
      var prayerData = prayerSheet.getRange(2, 1, prayerSheet.getLastRow() - 1, PRA.COMPLETION).getValues();
      var currentFardStreak = 0;
      var currentWitrStreak = 0;
      var currentFullStreak = 0;
      var prevPrayerDate = null;

      for (var pi = 0; pi < prayerData.length; pi++) {
        var pRow = prayerData[pi];
        var pDate = pRow[PRA.DATE - 1];
        var isPrayerConsecutive = prevPrayerDate && pDate instanceof Date &&
          daysBetween(prevPrayerDate, pDate) === 1;

        // Check all 5 fard
        var allFardDone = true;
        for (var fi = 0; fi < FARD_PRAYER_COLS.length; fi++) {
          if (pRow[FARD_PRAYER_COLS[fi] - 1] !== true) { allFardDone = false; break; }
        }

        if (allFardDone) {
          currentFardStreak = (isPrayerConsecutive || pi === 0) ? currentFardStreak + 1 : 1;
          if (currentFardStreak > data.fardStreak) data.fardStreak = currentFardStreak;
        } else {
          currentFardStreak = 0;
        }

        // Check witr
        if (pRow[PRA.WITR - 1] === true) {
          currentWitrStreak = (isPrayerConsecutive || pi === 0) ? currentWitrStreak + 1 : 1;
          if (currentWitrStreak > data.witrStreak) data.witrStreak = currentWitrStreak;
        } else {
          currentWitrStreak = 0;
        }

        // Check all 11 prayers
        var allDone = true;
        for (var ai2 = PRA.FAJR_SUNNAH; ai2 <= PRA.WITR; ai2++) {
          if (pRow[ai2 - 1] !== true) { allDone = false; break; }
        }

        if (allDone) {
          currentFullStreak = (isPrayerConsecutive || pi === 0) ? currentFullStreak + 1 : 1;
          if (currentFullStreak > data.fullPrayerStreak) data.fullPrayerStreak = currentFullStreak;
        } else {
          currentFullStreak = 0;
        }

        prevPrayerDate = pDate instanceof Date ? stripTime(pDate) : prevPrayerDate;
      }
    }
  } catch(e) { /* Prayers sheet may not exist */ }

  // Nutrition streak data
  try {
    var nutSheet = ss.getSheetByName(SHEET_NAMES.NUTRITION);
    if (nutSheet && nutSheet.getLastRow() >= 2) {
      var nutData = nutSheet.getRange(2, 1, nutSheet.getLastRow() - 1, NUT.CALORIES).getValues();
      // Group by date
      var nutByDate = {};
      for (var ni = 0; ni < nutData.length; ni++) {
        var nDate = nutData[ni][NUT.DATE - 1];
        if (nDate instanceof Date) {
          var nKey = stripTime(nDate).getTime();
          if (!nutByDate[nKey]) nutByDate[nKey] = 0;
          nutByDate[nKey] += (nutData[ni][NUT.CALORIES - 1] || 0);
        }
      }

      // Sort dates and check streak
      var nutDates = Object.keys(nutByDate).sort();
      var currentNutStreak = 0;
      var currentAccStreak = 0;
      for (var nd = 0; nd < nutDates.length; nd++) {
        var isNutConsecutive = nd > 0 &&
          (parseInt(nutDates[nd]) - parseInt(nutDates[nd - 1])) === 86400000;
        currentNutStreak = (isNutConsecutive || nd === 0) ? currentNutStreak + 1 : 1;
        if (currentNutStreak > data.nutritionStreak) data.nutritionStreak = currentNutStreak;

        var calDiff = Math.abs(nutByDate[nutDates[nd]] - CUT.DAILY_CALORIES);
        if (calDiff <= 100) {
          currentAccStreak = (isNutConsecutive || nd === 0) ? currentAccStreak + 1 : 1;
          if (currentAccStreak > data.calorieAccuracyStreak) data.calorieAccuracyStreak = currentAccStreak;
        } else {
          currentAccStreak = 0;
        }
      }
    }
  } catch(e) { /* Nutrition sheet may not exist */ }

  // MRR growth weeks (from weekly review)
  if (review) {
    var reviewLastRow2 = review.getLastRow();
    if (reviewLastRow2 >= 2) {
      var growthData = review.getRange(2, 7, reviewLastRow2 - 1, 2).getValues(); // MRR Growth, Growth %
      var consecutiveGrowth = 0;
      for (var g = 0; g < growthData.length; g++) {
        var growth = growthData[g][0];
        var growthPct = growthData[g][1];
        if (growth > 0) {
          consecutiveGrowth++;
          if (consecutiveGrowth > data.consecutiveMRRGrowthWeeks) {
            data.consecutiveMRRGrowthWeeks = consecutiveGrowth;
          }
          if (growthPct > data.maxWeeklyMRRGrowth) {
            data.maxWeeklyMRRGrowth = growthPct;
          }
        } else {
          consecutiveGrowth = 0;
        }
      }
    }
  }

  return data;
}

/**
 * Check all achievements and unlock any newly earned ones
 */
function checkAchievements() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var achieveSheet = ss.getSheetByName(SHEET_NAMES.ACHIEVEMENTS);
  if (!achieveSheet) return;

  var achievementData = gatherAchievementData();
  if (!achievementData) return;

  var definitions = getAchievementDefinitions();
  var lastRow = achieveSheet.getLastRow();
  if (lastRow < 2) return;

  var earned = achieveSheet.getRange(2, 7, definitions.length, 1).getValues(); // Earned? column

  for (var i = 0; i < definitions.length; i++) {
    if (i >= earned.length) break;
    if (earned[i][0] === true) continue; // Already earned

    var badge = definitions[i];
    try {
      if (badge.check(achievementData)) {
        // Unlock!
        var row = i + 2;
        achieveSheet.getRange(row, 6).setValue(new Date()); // Date Earned
        achieveSheet.getRange(row, 7).setValue(true);       // Earned?

        // Show notification
        try {
          var wisdom = getContextualWisdom({ trigger: 'level_up' });
          SpreadsheetApp.getUi().alert(
            badge.icon + ' ACHIEVEMENT UNLOCKED: ' + badge.name + '!\n\n' +
            badge.description + '\n+' + badge.xp + ' XP\n\n' +
            formatWisdom(wisdom)
          );
        } catch (err) {
          // UI not available in trigger context
        }
      }
    } catch (err) {
      // Skip this badge if check fails
    }
  }
}
