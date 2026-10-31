'use client';

import React from 'react';
import { GameState } from '@/types/game';
import { ArrowRight, Zap, RotateCcw } from 'lucide-react';

interface GameButtonProps {
  gameState: GameState;
  onStart: () => void;
  onStop: () => void;
  onTryAgain: () => void;
}

export const GameButton: React.FC<GameButtonProps> = ({
  gameState,
  onStart,
  onStop,
  onTryAgain,
}) => {
  const isReady = gameState === 'ready';
  const isPlaying = gameState === 'playing';
  const isResult = gameState === 'result';

  const handleClick = () => {
    if (isReady) {
      onStart();
    } else if (isPlaying) {
      onStop();
    } else if (isResult) {
      onTryAgain();
    }
  };

  return (
    <div className="w-full select-none flex flex-col items-center">
      <button
        onClick={handleClick}
        aria-label={
          isReady
            ? 'Start Challenge'
            : isPlaying
            ? 'Stop Now'
            : 'Try Again'
        }
        className={`w-full h-[58px] sm:h-[64px] rounded-2xl font-black text-lg sm:text-xl tracking-wider flex items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-[#18181B] ${
          isPlaying
            ? 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-blue-600 hover:from-purple-500 hover:via-fuchsia-500 hover:to-blue-500 text-white shadow-[0_0_35px_rgba(168,85,247,0.5)]'
            : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] hover:-translate-y-0.5'
        }`}
      >
        {isReady && (
          <>
            <span>START CHALLENGE</span>
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </>
        )}

        {isPlaying && (
          <>
            <span>STOP NOW!</span>
            <Zap className="w-5 h-5 sm:w-6 sm:h-6 fill-current animate-pulse text-yellow-300" />
          </>
        )}

        {isResult && (
          <>
            <span>TRY AGAIN</span>
            <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
          </>
        )}
      </button>

      {/* Keyboard Shortcut hint */}
      <div className="w-full text-center mt-3 text-xs text-zinc-400 flex items-center justify-center gap-2">
        <span>Press <kbd className="px-2 py-0.5 rounded bg-[#27272A] border border-zinc-700 font-mono text-[11px] text-zinc-300">Space</kbd> to {isReady ? 'start' : isPlaying ? 'stop' : 'try again'}</span>
        <span className="text-zinc-600">•</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-[#27272A] border border-zinc-700 font-mono text-[10px] text-zinc-400">R</kbd> Reset</span>
      </div>
    </div>
  );
};
