/**
 * levels.ts — Level system ported from src/Config.js
 * XP threshold formula: 100 * level^1.5
 */

import { MAX_LEVEL, LEVEL_TITLES } from '@/lib/config'

export function getLevelXP(level: number): number {
  return Math.round(100 * Math.pow(level, 1.5))
}

export function getLevelTitle(level: number): string {
  if (level >= 50) return LEVEL_TITLES[50]
  return LEVEL_TITLES[level] || 'Tawbah'
}

export function getLevelFromXP(totalXP: number): number {
  for (let lvl = MAX_LEVEL; lvl >= 1; lvl--) {
    if (totalXP >= getLevelXP(lvl)) return lvl
  }
  return 1
}

export function getLevelProgress(totalXP: number): number {
  const level = getLevelFromXP(totalXP)
  const currentLevelXP = getLevelXP(level)
  const nextLevelXP = getLevelXP(Math.min(level + 1, MAX_LEVEL))
  if (nextLevelXP === currentLevelXP) return 1
  return (totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP)
}

export function getXPToNextLevel(totalXP: number): number {
  const level = getLevelFromXP(totalXP)
  const nextLevelXP = getLevelXP(Math.min(level + 1, MAX_LEVEL))
  return Math.max(0, nextLevelXP - totalXP)
}
