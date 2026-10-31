'use client';

import React from 'react';
import { X } from 'lucide-react';
import { RATINGS } from '@/lib/ratings';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-[#18181B] border border-[#27272A] rounded-3xl p-5 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col gap-4 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
          <div>
            <span className="text-[11px] font-bold tracking-widest text-purple-400 uppercase">
              RULES & PRECISION
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#FAFAFA]">
              How to Play
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-9 h-9 rounded-xl text-zinc-400 hover:text-white hover:bg-[#27272A] border border-transparent hover:border-[#27272A] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Step Guide */}
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#09090B] border border-[#27272A]">
            <div className="w-7 h-7 rounded-lg bg-purple-900/50 text-purple-300 font-bold text-xs flex items-center justify-center shrink-0 border border-purple-500/30">
              1
            </div>
            <div className="text-xs text-zinc-300 leading-relaxed">
              <strong className="text-[#FAFAFA] block font-semibold text-sm mb-0.5">Start the Round</strong>
              Tap &quot;START CHALLENGE&quot; or press <kbd className="px-1.5 py-0.5 rounded bg-[#27272A] text-purple-300 font-mono text-[10px]">Space</kbd>. The moving progress bar begins filling smoothly.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#09090B] border border-[#27272A]">
            <div className="w-7 h-7 rounded-lg bg-purple-900/50 text-purple-300 font-bold text-xs flex items-center justify-center shrink-0 border border-purple-500/30">
              2
            </div>
            <div className="text-xs text-zinc-300 leading-relaxed">
              <strong className="text-[#FAFAFA] block font-semibold text-sm mb-0.5">Time the Freeze</strong>
              Tap &quot;STOP NOW!&quot; or hit Space to freeze the bar as close to the center <strong>50.000%</strong> vertical line as possible.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#09090B] border border-[#27272A]">
            <div className="w-7 h-7 rounded-lg bg-purple-900/50 text-purple-300 font-bold text-xs flex items-center justify-center shrink-0 border border-purple-500/30">
              3
            </div>
            <div className="text-xs text-zinc-300 leading-relaxed">
              <strong className="text-[#FAFAFA] block font-semibold text-sm mb-0.5">Compete & Challenge</strong>
              Stop within 0.050% for confetti celebrations, download your score card, and challenge friends to beat you!
            </div>
          </div>
        </div>

        {/* Rating Tiers Breakdown */}
        <div className="mt-1">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-2">
            Precision Ratings
          </span>
          <div className="rounded-2xl border border-[#27272A] bg-[#09090B] overflow-hidden divide-y divide-[#27272A] text-xs">
            {RATINGS.slice(0, 6).map((r) => (
              <div key={r.title} className="p-2.5 flex items-center justify-between">
                <span className="font-bold text-[#FAFAFA]">{r.title}</span>
                <span className="font-mono text-zinc-400 font-semibold">
                  &le; {r.maxDiff.toFixed(3)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-xs transition-colors cursor-pointer"
        >
          Got It, Let&apos;s Play!
        </button>
      </div>
    </div>
  );
};
