'use client';

import React from 'react';
import { Gamepad2, Volume2, VolumeX, HelpCircle, Trophy } from 'lucide-react';
import { ScoreAttempt } from '@/types/game';

interface HeaderProps {
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenStats: () => void;
  onOpenHelp: () => void;
  personalBest: ScoreAttempt | null;
}

export const Header: React.FC<HeaderProps> = ({
  isMuted,
  onToggleMute,
  onOpenStats,
  onOpenHelp,
  personalBest,
}) => {
  return (
    <header className="w-full h-[72px] sticky top-0 z-40 bg-[#09090B]/85 backdrop-blur-md border-b border-[#27272A]">
      <div className="w-full max-w-6xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
        {/* Left: AntiActivity Branding + Controller Icon */}
        <div className="flex items-center gap-3 select-none">
          <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-400 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            <Gamepad2 className="w-5 h-5 text-purple-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-black tracking-tight text-[#FAFAFA]">
              AntiActivity
            </span>
            <span className="text-[10px] font-bold tracking-[0.15em] text-purple-400 uppercase leading-none">
              MINI GAMES
            </span>
          </div>
        </div>

        {/* Center: Desktop Navigation Pills */}
        <div className="hidden md:flex items-center gap-1 px-3 py-1 rounded-full bg-[#18181B] border border-[#27272A] text-xs font-semibold text-zinc-400">
          <span className="text-white px-2 py-0.5 rounded-full bg-purple-600/30 text-purple-300">
            Perfect 50%
          </span>
          <span className="text-zinc-600 px-1">•</span>
          <span className="hover:text-zinc-200 transition-colors cursor-pointer px-2">
            Challenges
          </span>
        </div>

        {/* Right Controls: PB, Help, Sound */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Personal Best Indicator */}
          <button
            onClick={onOpenStats}
            aria-label="View career statistics and personal best"
            title="View career stats and personal best"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#18181B] hover:bg-[#202024] border border-[#27272A] text-xs transition-colors cursor-pointer active:scale-95"
          >
            <Trophy className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
            <span className="text-zinc-400 hidden xs:inline">PB:</span>
            {personalBest ? (
              <span className="font-mono font-bold text-purple-300">
                {personalBest.stoppedPercentage.toFixed(3)}%
              </span>
            ) : (
              <span className="font-mono text-zinc-500">--.---%</span>
            )}
          </button>

          {/* Help Button */}
          <button
            onClick={onOpenHelp}
            aria-label="How to play instructions"
            title="How to Play"
            className="w-9 h-9 rounded-full bg-[#18181B] hover:bg-[#202024] border border-[#27272A] text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer active:scale-95"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleMute}
            aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
            title={isMuted ? 'Unmute Audio (M)' : 'Mute Audio (M)'}
            className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors cursor-pointer active:scale-95 ${
              isMuted
                ? 'bg-[#18181B] border-[#27272A] text-zinc-500 hover:text-zinc-300'
                : 'bg-purple-950/60 border-purple-500/40 text-purple-300 hover:text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.25)]'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
