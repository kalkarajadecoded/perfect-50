'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ScoreAttempt } from '@/types/game';
import { drawScoreCard, downloadScoreCardImage, copyScoreCardImageToClipboard, getShareText } from '@/lib/shareCard';
import { X, Download, Copy, Check, Share2, Send } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  attempt: ScoreAttempt | null;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, attempt }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  useEffect(() => {
    if (isOpen && attempt && canvasRef.current) {
      drawScoreCard(canvasRef.current, attempt);
    }
  }, [isOpen, attempt]);

  if (!isOpen || !attempt) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : 'https://antiactivity.com/perfect-50';
  const challengeUrl = `${currentUrl}?challenge=${attempt.stoppedPercentage.toFixed(3)}&diff=${attempt.difference.toFixed(3)}`;
  const shareText = getShareText(attempt, currentUrl);

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(challengeUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleCopyText = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    }
  };

  const handleCopyImage = async () => {
    const success = await copyScoreCardImageToClipboard(attempt);
    if (success) {
      setCopiedImage(true);
      setTimeout(() => setCopiedImage(false), 2500);
    } else {
      downloadScoreCardImage(attempt);
    }
  };

  const handleDownloadImage = () => {
    downloadScoreCardImage(attempt, `perfect-50-${attempt.stoppedPercentage.toFixed(3)}pct.png`);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Perfect 50% Reflex Challenge',
          text: `I stopped at ${attempt.stoppedPercentage.toFixed(3)}% on AntiActivity! Can you beat me?`,
          url: challengeUrl,
        });
      } catch {
        // User dismissed
      }
    }
  };

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `🎯 I stopped at ${attempt.stoppedPercentage.toFixed(3)}% (Diff: ±${attempt.difference.toFixed(3)}%) on "Perfect 50%" by AntiActivity! Can you beat me?\n\nPlay here: ${challengeUrl}`
  )}`;

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `🎯 I stopped at ${attempt.stoppedPercentage.toFixed(3)}% on Perfect 50%! Can you beat my score?\n\nPlay here: ${challengeUrl}`
  )}`;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl bg-[#18181B] border border-[#27272A] rounded-3xl p-5 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col gap-4 max-h-[92vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
          <div>
            <span className="text-[11px] font-bold tracking-widest text-purple-400 uppercase">
              VIRAL SCORE CARD
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#FAFAFA]">
              Share Your Result
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

        {/* Canvas Visual Score Card Preview */}
        <div className="w-full relative rounded-2xl overflow-hidden border border-[#27272A] bg-[#09090B] shadow-inner">
          <canvas
            ref={canvasRef}
            className="w-full h-auto block rounded-2xl aspect-[1200/630]"
          />
        </div>

        {/* Primary Action Buttons: Download & Copy Image */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            onClick={handleDownloadImage}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(168,85,247,0.35)] transition-all cursor-pointer active:scale-[0.98]"
          >
            <Download className="w-4 h-4" />
            <span>Download PNG Image</span>
          </button>

          <button
            onClick={handleCopyImage}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#27272A] hover:bg-zinc-700 border border-zinc-700 text-[#FAFAFA] font-bold text-sm transition-all cursor-pointer active:scale-[0.98]"
          >
            {copiedImage ? (
              <>
                <Check className="w-4 h-4 text-[#A3E635]" />
                <span className="text-[#A3E635]">Image Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-zinc-400" />
                <span>Copy to Clipboard</span>
              </>
            )}
          </button>
        </div>

        {/* Challenge Link Copy Box */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-zinc-400 flex items-center justify-between">
            <span>Challenge a Friend Link</span>
            <span className="text-[11px] text-purple-400">Encodes your score</span>
          </label>
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#09090B] border border-[#27272A]">
            <input
              type="text"
              readOnly
              value={challengeUrl}
              className="bg-transparent text-xs font-mono text-zinc-300 px-2 py-1 flex-1 outline-none select-all truncate"
            />
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Social Share Grid */}
        <div className="pt-2 border-t border-[#27272A] flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-medium text-zinc-400">Quick share:</span>

          <div className="flex items-center gap-2">
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                onClick={handleNativeShare}
                className="px-3 py-1.5 rounded-lg bg-[#27272A] hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
            )}

            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-[#09090B] hover:bg-zinc-900 border border-[#27272A] text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span className="font-black text-xs">𝕏</span>
              <span>Post</span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-600/40 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Send className="w-3 h-3" />
              <span>WhatsApp</span>
            </a>

            <button
              onClick={handleCopyText}
              className="px-3 py-1.5 rounded-lg bg-[#27272A] hover:bg-zinc-700 text-zinc-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              {copiedText ? <Check className="w-3 h-3 text-[#A3E635]" /> : <Copy className="w-3 h-3" />}
              <span>{copiedText ? 'Copied!' : 'Copy Text'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
