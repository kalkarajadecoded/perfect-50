'use client';

import React from 'react';
import { GameMode, GameState } from '@/types/game';

interface ProgressBarProps {
  currentPercentage: number;
  gameState: GameState;
  gameMode: GameMode;
  stoppedPercentage: number | null;
  freezeRipple: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentPercentage,
  gameState,
  gameMode,
  stoppedPercentage,
  freezeRipple,
}) => {
  const isPlaying = gameState === 'playing';
  const isResult = gameState === 'result';

  // Blind mode: fade bar when between 30% and 70% during gameplay
  const isBlindZone =
    gameMode === 'blind' &&
    isPlaying &&
    currentPercentage >= 30 &&
    currentPercentage <= 70;

  // Percentage to display in the bar
  const displayPercentage = isResult && stoppedPercentage !== null
    ? stoppedPercentage
    : currentPercentage;

  const stopPosPercent = Math.max(0, Math.min(100, displayPercentage));

  return (
    <div className="w-full flex flex-col select-none relative pt-4">
      {/* Target Marker: Stationary Triangle Indicator Above 50% Line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-30">
        <span className="text-[10px] font-bold text-white tracking-widest leading-none drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]">
          ▼
        </span>
      </div>

      {/* Main Track: 32px height, 16px radius, #27272A background */}
      <div className="relative w-full h-8 rounded-2xl bg-[#27272A] border border-zinc-700/60 overflow-hidden shadow-inner">
        {/* Stationary Target Marker Line at exactly 50% */}
        <div
          className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 z-20 pointer-events-none bg-white shadow-[0_0_8px_#ffffff,0_0_16px_rgba(168,85,247,0.9)]"
          title="Target: 50.000%"
        />

        {/* Progress Fill: Purple-to-blue gradient (#A855F7 -> #3B82F6) */}
        <div
          className={`h-full relative rounded-2xl transition-[opacity] duration-150 ${
            isBlindZone ? 'opacity-0' : 'opacity-100'
          }`}
          style={{
            width: `${Math.max(0.5, Math.min(100, displayPercentage))}%`,
            background: 'linear-gradient(90deg, #A855F7 0%, #7C3AED 50%, #3B82F6 100%)',
            boxShadow: '0 0 25px rgba(168, 85, 247, 0.45), inset 0 0 10px rgba(255, 255, 255, 0.2)',
          }}
        >
          {/* Subtle animated lighting/sheen */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-transparent pointer-events-none" />

          {/* Moving Indicator at leading edge */}
          <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-white shadow-[0_0_12px_#ffffff,0_0_20px_#3B82F6] rounded-r-md" />
        </div>

        {/* Blind mode overlay notice */}
        {isBlindZone && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 text-[11px] font-mono font-bold tracking-widest text-purple-400 animate-pulse">
            [ BLIND ZONE ]
          </div>
        )}

        {/* Freeze Shockwave Ripple Effect */}
        {freezeRipple && isResult && (
          <div
            className="absolute top-1/2 -translate-y-1/2 w-14 h-14 rounded-full border-2 border-purple-400 bg-purple-500/30 animate-shockwave pointer-events-none z-30"
            style={{ left: `calc(${stopPosPercent}% - 28px)` }}
          />
        )}

        {/* Freeze Stopped Needle Indicator */}
        {isResult && (
          <div
            className="absolute top-0 bottom-0 w-1 -translate-x-1/2 z-30 pointer-events-none bg-yellow-300 shadow-[0_0_12px_#fde047]"
            style={{ left: `${stopPosPercent}%` }}
          />
        )}
      </div>

      {/* Markers below the progress bar: 0%, 25%, 50%, 75%, 100% */}
      <div className="w-full flex justify-between px-1 pt-2.5 text-xs font-mono text-zinc-400 pointer-events-none">
        <span className="w-8 text-left">0%</span>
        <span className="w-8 text-center">25%</span>
        {/* Highlighted 50% marker */}
        <span className="w-8 text-center font-bold text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">
          50%
        </span>
        <span className="w-8 text-center">75%</span>
        <span className="w-8 text-right">100%</span>
      </div>
    </div>
  );
};
