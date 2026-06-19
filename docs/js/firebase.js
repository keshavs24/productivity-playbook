/**
 * firebase.js — Firebase data layer
 *
 * Replaces api.js (Google Sheets REST) and store.js (IndexedDB cache/queue).
 * Firestore handles offline persistence, caching, and sync automatically.
 *
 * Data model:
 *   users/{uid}/dailyLogs/{YYYY-MM-DD}  — habits, attributes, XP, weight, MRR
 *   users/{uid}/prayers/{YYYY-MM-DD}    — 11 prayer flags + totals
 *   users/{uid}/nutrition/{docId}        — individual food entries
 *   users/{uid}/lifts/{docId}            — individual set entries
 *   users/{uid}/bodyComp/{YYYY-MM-DD}   — AM/PM weight, body fat
 *   users/{uid}/skills/{skillId}         — study/apply/reflect state
 *   users/{uid}/achievements/{achId}     — unlock state + date
 *   users/{uid}/weeklyReviews/{weekId}   — weekly muhasaba
 *   users/{uid}/profile                  — single doc: settings, custom habits
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js';
import {
  getFirestore, enableIndexedDbPersistence,
  collection, doc, getDoc, getDocs, setDoc, updateDoc, addDoc,
  query, where, orderBy, limit, Timestamp, onSnapshot
} from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js';
import {
  getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signInAnonymously, onAuthStateChanged, signOut
} from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js';

// ============================================================
// INITIALIZATION
// ============================================================

let app = null;
let db = null;
let auth = null;
let currentUser = null;
let authReadyResolve = null;
const authReady = new Promise(resolve => { authReadyResolve = resolve; });

/**
 * Initialize Firebase with project config.
 * Call this once at app startup.
 */
export function initFirebase(config) {
  app = initializeApp(config);
  db = getFirestore(app);
  auth = getAuth(app);

  // Enable offline persistence (Firestore caches locally automatically)
  enableIndexedDbPersistence(db).catch(err => {
    if (err.code === 'failed-precondition') {
      console.warn('Firestore persistence failed: multiple tabs open');
    } else if (err.code === 'unimplemented') {
      console.warn('Firestore persistence not available in this browser');
    }
  });

  // Listen for auth state changes
  onAuthStateChanged(auth, (user) => {
    currentUser = user;
    authReadyResolve(user);
  });
}

/**
 * Wait for auth to be ready (resolves with user or null).
 */
export function waitForAuth() {
  return authReady;
}

// ============================================================
// AUTH
// ============================================================

export function getCurrentUser() {
  return currentUser;
}

export async function signInAnon() {
  const cred = await signInAnonymously(auth);
  return cred.user;
}

export async function signInWithEmail(email, password) {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  } catch (e) {
    if (e.code === 'auth/user-not-found') {
      // Auto-create account for single-user app
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      return cred.user;
    }
    throw e;
  }
}

export async function logOut() {
  await signOut(auth);
  currentUser = null;
}

// ============================================================
// HELPERS
// ============================================================

function userRef(path) {
  if (!currentUser) throw new Error('Not authenticated');
  return `users/${currentUser.uid}/${path}`;
}

function todayId() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function weekId(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay() || 7;
  d.setDate(d.getDate() - day + 1); // Monday
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// ============================================================
// DAILY LOG
// ============================================================

/**
 * Get today's daily log, creating it if it doesn't exist.
 */
export async function getTodayLog() {
  const id = todayId();
  const ref = doc(db, userRef('dailyLogs'), id);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    return { id, ...snap.data() };
  }

  // Create today's entry with dynamic sizes from user config
  // Import here to avoid circular dependency
  let habitCount = 7, attrCount = 6;
  try {
    const { getHabits, getAttributes } = await import('./user-config.js');
    habitCount = getHabits().length;
    attrCount = getAttributes().length;
  } catch (e) { /* use defaults */ }

  const newLog = {
    date: id,
    completed: false,
    habits: new Array(habitCount).fill(false),
    attributes: new Array(attrCount).fill(0),
    mrr: 0,
    weight: 0,
    bodyFat: 0,
    winOfDay: '',
    dietScore: 0,
    caloriesEst: 0,
    xpEarned: 0,
    totalXp: 0,
    streak: 0,
    createdAt: Timestamp.now()
  };

  // Pre-fill MRR from yesterday
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yId = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
  try {
    const ySnap = await getDoc(doc(db, userRef('dailyLogs'), yId));
    if (ySnap.exists()) {
      newLog.mrr = ySnap.data().mrr || 0;
      newLog.totalXp = ySnap.data().totalXp || 0;
    }
  } catch (e) { /* ignore */ }

  await setDoc(ref, newLog);
  return { id, ...newLog };
}

/**
 * Update a field in today's log.
 */
export async function updateTodayLog(fields) {
  const id = todayId();
  const ref = doc(db, userRef('dailyLogs'), id);
  await updateDoc(ref, { ...fields, updatedAt: Timestamp.now() });
}

/**
 * Toggle a specific habit in today's log.
 */
export async function toggleHabit(index, value) {
  const log = await getTodayLog();
  const habits = [...log.habits];
  habits[index] = value;
  await updateTodayLog({ habits });
}

/**
 * Set a specific attribute in today's log.
 */
export async function setAttribute(index, value) {
  const log = await getTodayLog();
  const attributes = [...log.attributes];
  attributes[index] = value;
  await updateTodayLog({ attributes });
}

/**
 * Get recent daily logs (for heatmap, trends, etc).
 * Returns array sorted by date ascending.
 */
export async function getRecentLogs(days = 28) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffId = `${cutoff.getFullYear()}-${String(cutoff.getMonth() + 1).padStart(2, '0')}-${String(cutoff.getDate()).padStart(2, '0')}`;

  const ref = collection(db, userRef('dailyLogs'));
  const q = query(ref, where('date', '>=', cutoffId), orderBy('date', 'asc'));
  const snap = await getDocs(q);

  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/**
 * Get all daily logs (for XP totals, streaks, etc).
 */
export async function getAllLogs() {
  const ref = collection(db, userRef('dailyLogs'));
  const q = query(ref, orderBy('date', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ============================================================
// PRAYERS
// ============================================================

export async function getTodayPrayers() {
  const id = todayId();
  const ref = doc(db, userRef('prayers'), id);
  const snap = await getDoc(ref);

  if (snap.exists()) return { id, ...snap.data() };

  const newPrayers = {
    date: id,
    fajrSunnah: false, fajrFard: false,
    dhuhrSunnahBefore: false, dhuhrFard: false, dhuhrSunnahAfter: false,
    asrFard: false,
    maghribFard: false, maghribSunnah: false,
    ishaFard: false, ishaSunnah: false,
    witr: false,
    totalFard: 0,
    totalAll: 0,
    createdAt: Timestamp.now()
  };

  await setDoc(ref, newPrayers);
  return { id, ...newPrayers };
}

export async function updatePrayer(prayerKey, value) {
  const id = todayId();
  const ref = doc(db, userRef('prayers'), id);
  await updateDoc(ref, { [prayerKey]: value, updatedAt: Timestamp.now() });
}

export async function getRecentPrayers(days = 7) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffId = `${cutoff.getFullYear()}-${String(cutoff.getMonth() + 1).padStart(2, '0')}-${String(cutoff.getDate()).padStart(2, '0')}`;

  const ref = collection(db, userRef('prayers'));
  const q = query(ref, where('date', '>=', cutoffId), orderBy('date', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ============================================================
// NUTRITION
// ============================================================

export async function addFoodEntry(entry) {
  const ref = collection(db, userRef('nutrition'));
  const data = {
    date: todayId(),
    mealType: entry.mealType || '',
    foodName: entry.foodName || '',
    calories: entry.calories || 0,
    protein: entry.protein || 0,
    carbs: entry.carbs || 0,
    fat: entry.fat || 0,
    createdAt: Timestamp.now()
  };
  const docRef = await addDoc(ref, data);
  return { id: docRef.id, ...data };
}

export async function getTodayNutrition() {
  const id = todayId();
  const ref = collection(db, userRef('nutrition'));
  const q = query(ref, where('date', '==', id));
  const snap = await getDocs(q);
  const results = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  results.sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0));
  return results;
}

// ============================================================
// LIFTS
// ============================================================

export async function addLiftEntry(entry) {
  const ref = collection(db, userRef('lifts'));
  const data = {
    date: todayId(),
    sessionType: entry.sessionType || '',
    exercise: entry.exercise || '',
    setNum: entry.setNum || 1,
    weight: entry.weight || 0,
    reps: entry.reps || 0,
    rpe: entry.rpe || 0,
    notes: entry.notes || '',
    createdAt: Timestamp.now()
  };
  const docRef = await addDoc(ref, data);
  return { id: docRef.id, ...data };
}

export async function getTodayLifts() {
  const id = todayId();
  const ref = collection(db, userRef('lifts'));
  const q = query(ref, where('date', '==', id));
  const snap = await getDocs(q);
  const results = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  results.sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0));
  return results;
}

export async function getAllLifts() {
  const ref = collection(db, userRef('lifts'));
  const q = query(ref, orderBy('date', 'desc'), limit(500));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ============================================================
// BODY COMP
// ============================================================

export async function getTodayBodyComp() {
  const id = todayId();
  const ref = doc(db, userRef('bodyComp'), id);
  const snap = await getDoc(ref);
  return snap.exists() ? { id, ...snap.data() } : null;
}

export async function updateBodyComp(fields) {
  const id = todayId();
  const ref = doc(db, userRef('bodyComp'), id);
  await setDoc(ref, { date: id, ...fields, updatedAt: Timestamp.now() }, { merge: true });
}

export async function getRecentBodyComp(days = 14) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffId = `${cutoff.getFullYear()}-${String(cutoff.getMonth() + 1).padStart(2, '0')}-${String(cutoff.getDate()).padStart(2, '0')}`;

  const ref = collection(db, userRef('bodyComp'));
  const q = query(ref, where('date', '>=', cutoffId), orderBy('date', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ============================================================
// SKILLS (Skill Tree)
// ============================================================

export async function getSkillProgress() {
  const ref = collection(db, userRef('skills'));
  const snap = await getDocs(ref);
  const map = {};
  snap.docs.forEach(d => { map[d.id] = d.data(); });
  return map;
}

export async function updateSkill(skillId, fields) {
  const ref = doc(db, userRef('skills'), skillId);
  await setDoc(ref, { ...fields, updatedAt: Timestamp.now() }, { merge: true });
}

// ============================================================
// ACHIEVEMENTS
// ============================================================

export async function getAchievements() {
  const ref = collection(db, userRef('achievements'));
  const snap = await getDocs(ref);
  const map = {};
  snap.docs.forEach(d => { map[d.id] = d.data(); });
  return map;
}

export async function unlockAchievement(achId, data) {
  const ref = doc(db, userRef('achievements'), achId);
  await setDoc(ref, {
    ...data,
    unlockedAt: Timestamp.now(),
    unlocked: true
  }, { merge: true });
}

// ============================================================
// WEEKLY REVIEW
// ============================================================

export async function getWeeklyReview(weekStart = null) {
  const id = weekStart || weekId();
  const ref = doc(db, userRef('weeklyReviews'), id);
  const snap = await getDoc(ref);
  return snap.exists() ? { id, ...snap.data() } : null;
}

export async function saveWeeklyReview(fields) {
  const id = weekId();
  const ref = doc(db, userRef('weeklyReviews'), id);
  await setDoc(ref, { weekStart: id, ...fields, updatedAt: Timestamp.now() }, { merge: true });
}

// ============================================================
// USER PROFILE / SETTINGS
// ============================================================

export async function getProfile() {
  const ref = doc(db, 'users', currentUser.uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function updateProfile(fields) {
  const ref = doc(db, 'users', currentUser.uid);
  await setDoc(ref, { ...fields, updatedAt: Timestamp.now() }, { merge: true });
}

// ============================================================
// WISDOM
// ============================================================

/**
 * Wisdom quotes are stored in a top-level collection (shared, not per-user).
 * You can seed these once from the Google Sheet.
 */
export async function getRandomWisdom() {
  // For now, return from a local array until we seed Firestore
  // This will be replaced with a Firestore query
  return null;
}

// ============================================================
// FLASHCARD STATE (Spaced Repetition)
// ============================================================

export async function getFlashcardStates() {
  const ref = collection(db, userRef('flashcardStates'));
  const snap = await getDocs(ref);
  const map = {};
  snap.docs.forEach(d => { map[d.id] = d.data(); });
  return map;
}

export async function updateFlashcardState(cardId, state) {
  const ref = doc(db, userRef('flashcardStates'), cardId);
  await setDoc(ref, { ...state, updatedAt: Timestamp.now() }, { merge: true });
}

export async function batchUpdateFlashcardStates(updates) {
  // Updates is an array of { cardId, state }
  for (const { cardId, state } of updates) {
    await updateFlashcardState(cardId, state);
  }
}

// ============================================================
// CHALLENGE ENTRIES (Graduated challenges)
// ============================================================

export async function addChallengeEntry(skillId, level, entry) {
  const ref = collection(db, userRef('challengeEntries'));
  return await addDoc(ref, {
    skillId,
    level, // 'observe' | 'intervene' | 'teach'
    entry,
    date: todayId(),
    createdAt: Timestamp.now()
  });
}

export async function getChallengeEntries(skillId) {
  const ref = collection(db, userRef('challengeEntries'));
  const q = query(ref, where('skillId', '==', skillId));
  const snap = await getDocs(q);
  const results = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  results.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
  return results;
}

// ============================================================
// SYNTHESIS RESPONSES
// ============================================================

export async function saveSynthesis(promptId, skillIds, response) {
  const ref = collection(db, userRef('syntheses'));
  return await addDoc(ref, {
    promptId,
    skillIds,
    response,
    date: todayId(),
    createdAt: Timestamp.now()
  });
}

// ============================================================
// EXPORTS
// ============================================================

export { db, auth, Timestamp };
