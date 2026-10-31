'use client';

import React from 'react';
import { GameMode, GameState } from '@/types/game';
import { Shuffle, Zap, Hourglass, EyeOff } from 'lucide-react';

interface GameModeSelectorProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  gameState: GameState;
}

export const GameModeSelector: React.FC<GameModeSelectorProps> = ({
  currentMode,
  onSelectMode,
  gameState,
}) => {
  const isPlaying = gameState === 'playing';

  const modes: { id: GameMode; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: 'classic',
      label: 'Random Speed',
      desc: 'Different speed every round',
      icon: <Shuffle className="w-3.5 h-3.5" />,
    },
    {
      id: 'speed-demon',
      label: 'Speed Demon',
      desc: 'Fast and intense',
      icon: <Zap className="w-3.5 h-3.5" />,
    },
    {
      id: 'zen',
      label: 'Zen Slow',
      desc: 'Slow and precise',
      icon: <Hourglass className="w-3.5 h-3.5" />,
    },
    {
      id: 'blind',
      label: 'Blind Mode',
      desc: 'Timing without seeing progress',
      icon: <EyeOff className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* Title */}
      <span className="text-[11px] font-bold tracking-[0.2em] text-zinc-400 uppercase mb-2.5">
        CHOOSE YOUR MODE
      </span>

      {/* Pill Buttons: Responsive 2-column on mobile, 4-column horizontal on desktop */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2">
        {modes.map((m) => {
          const isSelected = currentMode === m.id;
          return (
            <button
              key={m.id}
              disabled={isPlaying}
              onClick={() => onSelectMode(m.id)}
              title={m.desc}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-full text-xs font-bold transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 border border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.35)]'
                  : 'bg-[#202024] border border-[#27272A] text-zinc-400 hover:text-zinc-200 hover:bg-[#27272A]'
              } ${isPlaying ? 'opacity-40 cursor-not-allowed' : 'active:scale-95'}`}
            >
              {m.icon}
              <span className="truncate">{m.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
