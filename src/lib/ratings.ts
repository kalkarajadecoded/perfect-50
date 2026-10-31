import { PerformanceRating } from '@/types/game';

export const RATINGS: PerformanceRating[] = [
  {
    tier: 'perfect',
    title: 'PERFECT!',
    badge: '🌟 PERFECT!',
    subtitle: 'Astronomical perfection! Exactly 50.000%!',
    color: '#eab308',
    badgeBg: 'bg-yellow-500/15',
    badgeBorder: 'border-yellow-400',
    maxDiff: 0.0005,
    confettiLevel: 'legendary',
  },
  {
    tier: 'legendary',
    title: 'LEGENDARY!',
    badge: '👑 LEGENDARY!',
    subtitle: 'Under 0.010% away! Master of reflexes.',
    color: '#a855f7',
    badgeBg: 'bg-purple-500/15',
    badgeBorder: 'border-purple-400',
    maxDiff: 0.01,
    confettiLevel: 'huge',
  },
  {
    tier: 'incredible',
    title: 'INCREDIBLE!',
    badge: '⚡ INCREDIBLE!',
    subtitle: 'Under 0.050% away! Superhuman precision.',
    color: '#3b82f6',
    badgeBg: 'bg-blue-500/15',
    badgeBorder: 'border-blue-400',
    maxDiff: 0.05,
    confettiLevel: 'huge',
  },
  {
    tier: 'amazing',
    title: 'AMAZING!',
    badge: '🎯 AMAZING!',
    subtitle: 'Sharp eye and laser-like reaction time.',
    color: '#a3e635',
    badgeBg: 'bg-lime-500/15',
    badgeBorder: 'border-lime-400',
    maxDiff: 0.25,
    confettiLevel: 'light',
  },
  {
    tier: 'great',
    title: 'GREAT!',
    badge: '💎 GREAT!',
    subtitle: 'Within 1 percentage point of perfection.',
    color: '#06b6d4',
    badgeBg: 'bg-cyan-500/15',
    badgeBorder: 'border-cyan-400',
    maxDiff: 1.0,
    confettiLevel: 'none',
  },
  {
    tier: 'good',
    title: 'GOOD!',
    badge: '👍 GOOD!',
    subtitle: 'Solid attempt. Try for under 0.500%!',
    color: '#a1a1aa',
    badgeBg: 'bg-zinc-800',
    badgeBorder: 'border-zinc-700',
    maxDiff: 3.0,
    confettiLevel: 'none',
  },
  {
    tier: 'try-again',
    title: 'TRY AGAIN!',
    badge: '😅 TRY AGAIN!',
    subtitle: 'A bit too far from center. Give it another shot!',
    color: '#ef4444',
    badgeBg: 'bg-red-500/15',
    badgeBorder: 'border-red-500/50',
    maxDiff: 50.0,
    confettiLevel: 'none',
  },
];

export function getRating(diff: number): PerformanceRating {
  const error = Math.abs(diff);

  if (error < 0.0005) {
    return RATINGS[0];
  }
  if (error <= 0.01) {
    return RATINGS[1];
  }
  if (error <= 0.05) {
    return RATINGS[2];
  }
  if (error <= 0.25) {
    return RATINGS[3];
  }
  if (error <= 1.0) {
    return RATINGS[4];
  }
  if (error <= 3.0) {
    return RATINGS[5];
  }
  return RATINGS[6];
}

export function calculateAccuracy(diff: number): number {
  const val = 100 - (Math.abs(diff) / 50) * 100;
  return Math.max(0, Math.min(100, val));
}

export function formatPercentDisplay(val: number): string {
  return val.toFixed(3) + '%';
}

export function formatDiffDisplay(diff: number): string {
  return diff.toFixed(3) + '%';
}
