export type GameState = 'ready' | 'playing' | 'result';

export type GameMode = 'classic' | 'speed-demon' | 'zen' | 'blind';

export interface GameModeConfig {
  id: GameMode;
  name: string;
  shortName: string;
  description: string;
  minDuration: number;
  maxDuration: number;
}

export interface ScoreAttempt {
  id: string;
  timestamp: number;
  stoppedPercentage: number;
  difference: number; // absolute error
  accuracy: number;
  ratingTitle: string;
  ratingTier: string;
  speedMs: number;
  mode: GameMode;
  isNewBest?: boolean;
}

export interface PerformanceRating {
  tier: 'perfect' | 'legendary' | 'incredible' | 'amazing' | 'great' | 'good' | 'try-again';
  title: string;
  badge: string;
  subtitle: string;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  maxDiff: number;
  confettiLevel: 'legendary' | 'huge' | 'light' | 'none';
}

export interface PlayerStats {
  personalBest: ScoreAttempt | null;
  totalAttempts: number;
  totalGamesCompleted: number;
  attemptsUnderPointOne: number;
  attemptsUnderPointFive: number;
  lastPlayedDate: number | null;
  bestStreakUnderHalfPercent: number;
  currentStreak: number;
  bestByMode: Partial<Record<GameMode, ScoreAttempt>>;
  history: ScoreAttempt[];
}

export interface ChallengeData {
  targetPercentage: number;
  targetDiff: number;
}
