'use client';

import React from 'react';
import { ScoreAttempt } from '@/types/game';
import { getRating } from '@/lib/ratings';
import { Trophy, RotateCcw, Swords, Share2, Download, Sparkles } from 'lucide-react';

interface ResultDisplayProps {
  attempt: ScoreAttempt;
  isNewBest: boolean;
  onTryAgain: () => void;
  onChallengeFriend: () => void;
  onShareScore: () => void;
  onDownloadCard: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({
  attempt,
  isNewBest,
  onTryAgain,
  onChallengeFriend,
  onShareScore,
  onDownloadCard,
}) => {
  const rating = getRating(attempt.difference);
  const diffStr = attempt.difference.toFixed(3);

  return (
    <div
      aria-live="polite"
      className="w-full flex flex-col items-center text-center animate-fadeIn select-none pt-2"
    >
      {/* 1. Personal Best Celebration Banner */}
      {isNewBest && (
        <div className="mb-3 animate-bounce inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/15 border border-yellow-400 text-yellow-300 text-xs sm:text-sm font-black tracking-wider uppercase shadow-[0_0_20px_rgba(234,179,8,0.35)]">
          <Trophy className="w-4 h-4 text-yellow-400" />
          <span>NEW PERSONAL BEST!</span>
          <Sparkles className="w-4 h-4 text-yellow-400" />
        </div>
      )}

      {/* 2. "YOUR RESULT" Label */}
      <span className="text-xs sm:text-sm font-bold tracking-widest text-zinc-400 uppercase">
        YOUR RESULT
      </span>

      {/* 3. Main Stopped Percentage Display */}
      <div className="text-6xl sm:text-7xl font-black font-mono tracking-tight text-white my-1 drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]">
        {attempt.stoppedPercentage.toFixed(3)}
        <span className="text-4xl text-purple-400">%</span>
      </div>

      {/* 4. Rating Badge & Subtitle */}
      <div className="flex flex-col items-center gap-1.5 mb-5">
        <div
          className={`px-4 py-1.5 rounded-full border text-xs sm:text-sm font-black tracking-wider uppercase inline-flex items-center gap-1.5 ${rating.badgeBg} ${rating.badgeBorder} text-white shadow-sm`}
        >
          <span>{rating.badge}</span>
        </div>
        <p className="text-xs sm:text-sm text-zinc-300">
          Only <strong className="text-white font-mono">{diffStr}</strong> percentage points away from perfection.
        </p>
      </div>

      {/* 5. Comparison Box: TARGET vs YOUR STOP and DIFFERENCE */}
      <div className="w-full max-w-md rounded-2xl bg-[#111114] border border-[#27272A] p-4 sm:p-5 mb-5 shadow-inner">
        <div className="grid grid-cols-2 divide-x divide-[#27272A] pb-3 border-b border-[#27272A]/70">
          <div className="flex flex-col items-center pr-3">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              TARGET
            </span>
            <span className="text-2xl sm:text-3xl font-black font-mono text-zinc-300 mt-1">
              50.000%
            </span>
          </div>

          <div className="flex flex-col items-center pl-3">
            <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">
              YOUR STOP
            </span>
            <span className="text-2xl sm:text-3xl font-black font-mono text-white mt-1">
              {attempt.stoppedPercentage.toFixed(3)}%
            </span>
          </div>
        </div>

        <div className="pt-3 flex flex-col items-center">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
            DIFFERENCE
          </span>
          <span className="text-lg sm:text-xl font-bold font-mono text-purple-300 mt-0.5">
            {diffStr} percentage points
          </span>
        </div>
      </div>

      {/* 6. Viral Sharing Prompt */}
      <p className="text-xs sm:text-sm font-semibold text-zinc-300 mb-3">
        Think your friends can beat this?
      </p>

      {/* 7. Action Buttons Grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* TRY AGAIN */}
        <button
          onClick={onTryAgain}
          className="h-12 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all cursor-pointer group active:scale-[0.98]"
        >
          <RotateCcw className="w-4 h-4 transition-transform group-hover:-rotate-90" />
          <span>TRY AGAIN</span>
        </button>

        {/* CHALLENGE FRIEND */}
        <button
          onClick={onChallengeFriend}
          className="h-12 rounded-xl bg-[#202024] hover:bg-zinc-700 text-zinc-100 border border-purple-500/40 hover:border-purple-400 font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-[0.98]"
        >
          <Swords className="w-4 h-4 text-purple-400" />
          <span>CHALLENGE FRIEND</span>
        </button>

        {/* SHARE SCORE */}
        <button
          onClick={onShareScore}
          className="h-12 rounded-xl bg-[#202024] hover:bg-zinc-700 text-zinc-100 border border-[#27272A] hover:border-zinc-500 font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-[0.98]"
        >
          <Share2 className="w-4 h-4 text-blue-400" />
          <span>SHARE SCORE</span>
        </button>

        {/* DOWNLOAD SCORE CARD */}
        <button
          onClick={onDownloadCard}
          className="h-12 rounded-xl bg-[#202024] hover:bg-zinc-700 text-zinc-100 border border-[#27272A] hover:border-zinc-500 font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-[0.98]"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>DOWNLOAD CARD</span>
        </button>
      </div>
    </div>
  );
};
