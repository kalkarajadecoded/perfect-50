'use client';

import React from 'react';
import { PlayerStats, ScoreAttempt } from '@/types/game';
import { getRating } from '@/lib/ratings';
import { X, Trophy, Target, Flame, RotateCcw, Trash2 } from 'lucide-react';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: PlayerStats;
  onClearStats: () => void;
  onSelectAttemptForShare: (attempt: ScoreAttempt) => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  stats,
  onClearStats,
  onSelectAttemptForShare,
}) => {
  if (!isOpen) return null;

  const pb = stats.personalBest;
  const pbRating = pb ? getRating(pb.difference) : null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl bg-[#18181B] border border-[#27272A] rounded-3xl p-5 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-400">
              <Trophy className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <span className="text-[11px] font-bold tracking-widest text-purple-400 uppercase">
                PLAYER PERFORMANCE
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#FAFAFA]">
                Career Statistics
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-9 h-9 rounded-xl text-zinc-400 hover:text-white hover:bg-[#27272A] border border-transparent hover:border-[#27272A] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Personal Best Featured Card */}
        {pb ? (
          <div className="relative overflow-hidden rounded-2xl bg-[#09090B] border border-purple-500/40 p-4 shadow-[0_0_25px_rgba(168,85,247,0.15)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-yellow-400 flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5" /> ALL-TIME PERSONAL BEST
                </span>
                {pbRating && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {pbRating.title}
                  </span>
                )}
              </div>
              <div className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tight">
                {pb.stoppedPercentage.toFixed(3)}
                <span className="text-2xl text-purple-400">%</span>
              </div>
              <div className="text-xs text-zinc-400 mt-1 font-mono">
                Diff: <strong className="text-purple-300">±{pb.difference.toFixed(3)}%</strong> • Accuracy: {pb.accuracy.toFixed(3)}%
              </div>
            </div>

            <button
              onClick={() => onSelectAttemptForShare(pb)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer shrink-0"
            >
              Share Score Card
            </button>
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-[#09090B] border border-dashed border-[#27272A] text-center text-sm text-zinc-500">
            No attempts recorded yet! Play a round to establish your personal best.
          </div>
        )}

        {/* 4-Stat Metric Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3 rounded-2xl bg-[#09090B] border border-[#27272A] flex flex-col">
            <span className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1">
              <RotateCcw className="w-3 h-3" /> Attempts
            </span>
            <span className="text-2xl font-black font-mono text-[#FAFAFA] mt-1">
              {stats.totalAttempts}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-[#09090B] border border-[#27272A] flex flex-col">
            <span className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1">
              <Target className="w-3 h-3 text-[#A3E635]" /> &le; 0.100%
            </span>
            <span className="text-2xl font-black font-mono text-[#A3E635] mt-1">
              {stats.attemptsUnderPointOne}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-[#09090B] border border-[#27272A] flex flex-col">
            <span className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1">
              <Target className="w-3 h-3 text-purple-400" /> &le; 0.500%
            </span>
            <span className="text-2xl font-black font-mono text-purple-300 mt-1">
              {stats.attemptsUnderPointFive}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-[#09090B] border border-[#27272A] flex flex-col">
            <span className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1">
              <Flame className="w-3 h-3 text-orange-400" /> Max Streak
            </span>
            <span className="text-2xl font-black font-mono text-orange-400 mt-1">
              {stats.bestStreakUnderHalfPercent}
            </span>
          </div>
        </div>

        {/* Recent Attempts History Table */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            Recent Attempts ({stats.history.length})
          </span>

          <div className="rounded-2xl border border-[#27272A] bg-[#09090B] overflow-hidden max-h-52 overflow-y-auto divide-y divide-[#27272A]/70">
            {stats.history.length === 0 ? (
              <div className="p-4 text-center text-xs text-zinc-500 font-medium">
                No recent attempts recorded.
              </div>
            ) : (
              stats.history.map((item, idx) => (
                <div
                  key={item.id || idx}
                  onClick={() => onSelectAttemptForShare(item)}
                  title="Click to view/share this score card"
                  className="px-3.5 py-2.5 flex items-center justify-between text-xs hover:bg-[#27272A]/50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-zinc-600 font-mono text-[10px] w-4">
                      #{idx + 1}
                    </span>
                    <span className="font-mono font-bold text-white text-sm">
                      {item.stoppedPercentage.toFixed(3)}%
                    </span>
                    <span className="text-[10px] text-zinc-500 capitalize">
                      [{item.mode}]
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`font-mono font-semibold ${
                        item.difference <= 0.05
                          ? 'text-[#A3E635]'
                          : item.difference <= 0.2
                          ? 'text-cyan-400'
                          : item.difference <= 0.5
                          ? 'text-purple-300'
                          : 'text-zinc-400'
                      }`}
                    >
                      ±{item.difference.toFixed(3)}%
                    </span>
                    <span className="text-zinc-500 group-hover:text-purple-400 transition-colors text-[11px]">
                      Share &rarr;
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Reset Career Stats Button */}
        {stats.totalAttempts > 0 && (
          <div className="pt-2 border-t border-[#27272A] flex justify-end">
            <button
              onClick={() => {
                if (window.confirm('Reset all your career stats and personal best?')) {
                  onClearStats();
                }
              }}
              className="text-xs text-zinc-500 hover:text-red-400 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Career Stats</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
