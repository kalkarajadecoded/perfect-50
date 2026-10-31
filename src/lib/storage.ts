import { PlayerStats, ScoreAttempt } from '@/types/game';

const STORAGE_KEY = 'antiactivity_perfect50_stats_v2';

const defaultStats: PlayerStats = {
  personalBest: null,
  totalAttempts: 0,
  totalGamesCompleted: 0,
  attemptsUnderPointOne: 0,
  attemptsUnderPointFive: 0,
  lastPlayedDate: null,
  bestStreakUnderHalfPercent: 0,
  currentStreak: 0,
  bestByMode: {},
  history: [],
};

export function getStoredStats(): PlayerStats {
  if (typeof window === 'undefined') return defaultStats;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultStats;
    const parsed = JSON.parse(raw);
    return {
      ...defaultStats,
      ...parsed,
      bestByMode: parsed.bestByMode || {},
      history: Array.isArray(parsed.history) ? parsed.history : [],
    };
  } catch (err) {
    console.warn('Failed to parse local stats, using defaults', err);
    return defaultStats;
  }
}

export function saveStats(stats: PlayerStats): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (err) {
    console.warn('Failed to save stats to localStorage', err);
  }
}

export function recordNewAttempt(attempt: ScoreAttempt): {
  isNewOverallBest: boolean;
  isNewModeBest: boolean;
  updatedStats: PlayerStats;
} {
  const current = getStoredStats();
  let isNewOverallBest = false;
  let isNewModeBest = false;

  // Strict check: lower absolute error is strictly better. Do not trigger when matching.
  if (!current.personalBest || attempt.difference < current.personalBest.difference) {
    isNewOverallBest = true;
    current.personalBest = { ...attempt, isNewBest: true };
  }

  // Best by mode check
  const modeBest = current.bestByMode[attempt.mode];
  if (!modeBest || attempt.difference < modeBest.difference) {
    isNewModeBest = true;
    current.bestByMode[attempt.mode] = { ...attempt };
  }

  current.totalAttempts += 1;
  current.totalGamesCompleted += 1;
  current.lastPlayedDate = Date.now();

  if (attempt.difference <= 0.100) {
    current.attemptsUnderPointOne += 1;
  }
  if (attempt.difference <= 0.500) {
    current.attemptsUnderPointFive += 1;
  }

  // Streak tracking (< 0.5% difference)
  if (attempt.difference <= 0.5) {
    current.currentStreak += 1;
    if (current.currentStreak > current.bestStreakUnderHalfPercent) {
      current.bestStreakUnderHalfPercent = current.currentStreak;
    }
  } else {
    current.currentStreak = 0;
  }

  current.history = [attempt, ...current.history.slice(0, 19)];

  saveStats(current);
  return { isNewOverallBest, isNewModeBest, updatedStats: current };
}

export function clearPlayerStats(): PlayerStats {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }
  return defaultStats;
}
