'use client';

import React from 'react';
import { Swords, CheckCircle2, XCircle, X } from 'lucide-react';
import { ChallengeData, ScoreAttempt } from '@/types/game';

interface ChallengeBannerProps {
  challenge: ChallengeData | null;
  lastAttempt: ScoreAttempt | null;
  onDismiss: () => void;
}

export const ChallengeBanner: React.FC<ChallengeBannerProps> = ({
  challenge,
  lastAttempt,
  onDismiss,
}) => {
  if (!challenge) return null;

  const hasAttempted = lastAttempt !== null;
  const isWinner = hasAttempted && lastAttempt.difference < challenge.targetDiff;
  const diffComparison = hasAttempted
    ? Math.abs(challenge.targetDiff - lastAttempt.difference).toFixed(3)
    : null;

  return (
    <div className="w-full">
      <div
        className={`relative overflow-hidden rounded-2xl p-3.5 sm:p-4 border transition-all ${
          !hasAttempted
            ? 'bg-[#18181B] border-purple-500/40 text-purple-200 shadow-[0_0_20px_rgba(168,85,247,0.15)]'
            : isWinner
            ? 'bg-[#18181B] border-[#A3E635]/60 text-[#A3E635] shadow-[0_0_25px_rgba(163,230,53,0.2)]'
            : 'bg-[#18181B] border-[#27272A] text-zinc-300'
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-xl flex items-center justify-center ${
                !hasAttempted
                  ? 'bg-purple-500/20 text-purple-300'
                  : isWinner
                  ? 'bg-[#A3E635]/20 text-[#A3E635]'
                  : 'bg-[#27272A] text-zinc-400'
              }`}
            >
              {!hasAttempted ? (
                <Swords className="w-5 h-5 animate-bounce" />
              ) : isWinner ? (
                <CheckCircle2 className="w-5 h-5 text-[#A3E635]" />
              ) : (
                <XCircle className="w-5 h-5 text-zinc-400" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400">
                  Friend Challenge Active
                </span>
                <span className="text-[11px] text-zinc-400">
                  Target: <strong className="text-white font-mono">{challenge.targetPercentage.toFixed(3)}%</strong> (±{challenge.targetDiff.toFixed(3)}%)
                </span>
              </div>

              <div className="text-xs sm:text-sm font-semibold mt-0.5">
                {!hasAttempted ? (
                  <span>A friend stopped at <span className="font-mono text-purple-300 font-bold">{challenge.targetPercentage.toFixed(3)}%</span>. Can you beat them?</span>
                ) : isWinner ? (
                  <span className="text-[#A3E635] font-bold">
                    🎉 YOU BEAT THE CHALLENGE! Ahead by {diffComparison}%!
                  </span>
                ) : (
                  <span>
                    Off by {diffComparison}%. They were closer! Try again!
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onDismiss}
            aria-label="Dismiss challenge"
            className="w-7 h-7 rounded-lg text-zinc-500 hover:text-white hover:bg-[#27272A] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
