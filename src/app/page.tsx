'use client';

import React, { useState, useEffect, useRef, useCallback, Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { GameMode, GameState, ScoreAttempt, ChallengeData, PlayerStats } from '@/types/game';
import { getRating, calculateAccuracy } from '@/lib/ratings';
import { getStoredStats, recordNewAttempt, clearPlayerStats } from '@/lib/storage';
import { sound } from '@/lib/sound';
import { fireConfetti } from '@/lib/confetti';
import { Header } from '@/components/Header';
import { ChallengeBanner } from '@/components/ChallengeBanner';
import { GameModeSelector } from '@/components/GameModeSelector';
import { ProgressBar } from '@/components/ProgressBar';
import { ResultDisplay } from '@/components/ResultDisplay';
import { GameButton } from '@/components/GameButton';
import { ShareModal } from '@/components/ShareModal';
import { StatsModal } from '@/components/StatsModal';
import { HowToPlayModal } from '@/components/HowToPlayModal';
import { downloadScoreCardImage } from '@/lib/shareCard';

function getRandomDuration(mode: GameMode): number {
  switch (mode) {
    case 'speed-demon':
      return Math.floor(Math.random() * 300) + 700; // 700ms - 1000ms
    case 'zen':
      return Math.floor(Math.random() * 1200) + 3800; // 3800ms - 5000ms
    case 'blind':
      return Math.floor(Math.random() * 800) + 1600; // 1600ms - 2400ms
    case 'classic':
    default:
      // Randomize speed between rounds (1300ms to 2600ms)
      return Math.floor(Math.random() * 1300) + 1300;
  }
}

function PerfectFiftyGame() {
  const searchParams = useSearchParams();

  // Core Game State
  const [gameState, setGameState] = useState<GameState>('ready');
  const [gameMode, setGameMode] = useState<GameMode>('classic');
  const [currentSpeedMs, setCurrentSpeedMs] = useState<number>(1800);
  const [currentPercentage, setCurrentPercentage] = useState<number>(0);
  const [stoppedPercentage, setStoppedPercentage] = useState<number | null>(null);

  // FX & Animation States
  const [screenShake, setScreenShake] = useState<boolean>(false);
  const [freezeRipple, setFreezeRipple] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Score & History
  const [currentAttempt, setCurrentAttempt] = useState<ScoreAttempt | null>(null);
  const [isNewBest, setIsNewBest] = useState<boolean>(false);
  const [stats, setStats] = useState<PlayerStats>(getStoredStats);

  // Challenge from friend derived from URL
  const [challengeDismissed, setChallengeDismissed] = useState<boolean>(false);
  const challenge: ChallengeData | null = useMemo(() => {
    if (challengeDismissed) return null;
    const targetChallengeParam = searchParams.get('challenge');
    const targetDiffParam = searchParams.get('diff');
    if (targetChallengeParam) {
      const targetVal = parseFloat(targetChallengeParam);
      const targetDiff = targetDiffParam
        ? parseFloat(targetDiffParam)
        : Math.abs(targetVal - 50.0);
      if (!isNaN(targetVal) && targetVal >= 0 && targetVal <= 100) {
        return {
          targetPercentage: targetVal,
          targetDiff: isNaN(targetDiff) ? 0.05 : targetDiff,
        };
      }
    }
    return null;
  }, [searchParams, challengeDismissed]);

  // Modals
  const [shareModalOpen, setShareModalOpen] = useState<boolean>(false);
  const [selectedAttemptForShare, setSelectedAttemptForShare] = useState<ScoreAttempt | null>(null);
  const [statsModalOpen, setStatsModalOpen] = useState<boolean>(false);
  const [helpModalOpen, setHelpModalOpen] = useState<boolean>(false);

  // Animation references using performance.now()
  const rafIdRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const currentSpeedRef = useRef<number>(currentSpeedMs);
  const isPlayingRef = useRef<boolean>(false);
  const loopRef = useRef<(ts: number) => void>(() => {});

  // Keep speed ref in sync
  useEffect(() => {
    currentSpeedRef.current = currentSpeedMs;
  }, [currentSpeedMs]);

  // Clean up RAF helper
  const cancelActiveRAF = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    isPlayingRef.current = false;
  }, []);

  // Animation frame loop using performance.now() and requestAnimationFrame
  const step = useCallback((timestamp: number) => {
    if (!isPlayingRef.current) return;

    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }

    const elapsed = timestamp - startTimeRef.current;
    const duration = currentSpeedRef.current;

    // Ping-pong cycle (0 -> 100 -> 0 -> 100)
    const cyclePos = (elapsed % (duration * 2)) / duration;
    let pct: number;

    if (cyclePos <= 1) {
      pct = cyclePos * 100;
    } else {
      pct = (2 - cyclePos) * 100;
    }

    setCurrentPercentage(pct);

    rafIdRef.current = requestAnimationFrame((ts) => loopRef.current(ts));
  }, []);

  useEffect(() => {
    loopRef.current = step;
  }, [step]);

  // Start the challenge
  const startGame = useCallback(() => {
    cancelActiveRAF();

    const newSpeed = getRandomDuration(gameMode);
    setCurrentSpeedMs(newSpeed);
    currentSpeedRef.current = newSpeed;

    setCurrentPercentage(0);
    setStoppedPercentage(null);
    setCurrentAttempt(null);
    setIsNewBest(false);
    setFreezeRipple(false);
    setGameState('playing');
    isPlayingRef.current = true;
    startTimeRef.current = 0;

    sound.playStart();

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(20);
    }

    rafIdRef.current = requestAnimationFrame((ts) => loopRef.current(ts));
  }, [gameMode, cancelActiveRAF]);

  // Stop the challenge
  const stopGame = useCallback(() => {
    if (!isPlayingRef.current) return;

    // Sub-millisecond calculation using performance.now()
    const stopTime = performance.now();
    cancelActiveRAF();

    const elapsed = stopTime - startTimeRef.current;
    const duration = currentSpeedRef.current;
    const cyclePos = (elapsed % (duration * 2)) / duration;
    let rawPercent: number;

    if (cyclePos <= 1) {
      rawPercent = cyclePos * 100;
    } else {
      rawPercent = (2 - cyclePos) * 100;
    }

    const finalStopped = Math.max(0, Math.min(100, rawPercent));
    setStoppedPercentage(finalStopped);
    setFreezeRipple(true);
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 300);

    sound.playFreeze();
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([40, 30, 40]);
    }

    const diff = Math.abs(finalStopped - 50.0);
    const accuracy = calculateAccuracy(diff);
    const rating = getRating(diff);

    const attempt: ScoreAttempt = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
      stoppedPercentage: finalStopped,
      difference: diff,
      accuracy,
      ratingTitle: rating.title,
      ratingTier: rating.tier,
      speedMs: duration,
      mode: gameMode,
    };

    // Transition to Result Screen
    setCurrentAttempt(attempt);
    setGameState('result');

    // Save to LocalStorage
    const { isNewOverallBest, updatedStats } = recordNewAttempt(attempt);
    setIsNewBest(isNewOverallBest);
    setStats(updatedStats);

    // Celebration effects
    if (rating.confettiLevel !== 'none') {
      fireConfetti(rating.confettiLevel);
      sound.playCelebration(rating.confettiLevel);
    } else if (diff > 5.0) {
      sound.playMiss();
    }
  }, [gameMode, cancelActiveRAF]);

  // Reset to ready state
  const resetGame = useCallback(() => {
    cancelActiveRAF();
    setCurrentPercentage(0);
    setStoppedPercentage(null);
    setCurrentAttempt(null);
    setIsNewBest(false);
    setFreezeRipple(false);
    setGameState('ready');
  }, [cancelActiveRAF]);

  // Change mode cleanly without corrupting active game
  const handleSelectMode = useCallback((newMode: GameMode) => {
    if (isPlayingRef.current) return;
    setGameMode(newMode);
    setCurrentSpeedMs(getRandomDuration(newMode));
    resetGame();
  }, [resetGame]);

  // Global Keyboard shortcuts: Space, R, M
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        shareModalOpen ||
        statsModalOpen ||
        helpModalOpen
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault(); // Prevent spacebar scrolling!
        if (e.repeat) return; // Prevent key repeat spam

        if (gameState === 'ready') {
          startGame();
        } else if (gameState === 'playing') {
          stopGame();
        } else if (gameState === 'result') {
          startGame();
        }
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        resetGame();
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        const muted = sound.toggleMute();
        setIsMuted(muted);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, startGame, stopGame, resetGame, shareModalOpen, statsModalOpen, helpModalOpen]);

  // Clean up on unmount
  useEffect(() => {
    return () => cancelActiveRAF();
  }, [cancelActiveRAF]);

  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const handleOpenShare = () => {
    if (currentAttempt) {
      setSelectedAttemptForShare(currentAttempt);
      setShareModalOpen(true);
    }
  };

  const handleChallengeFriend = () => {
    if (currentAttempt) {
      setSelectedAttemptForShare(currentAttempt);
      setShareModalOpen(true);
    }
  };

  const handleDownloadCard = () => {
    if (currentAttempt) {
      downloadScoreCardImage(currentAttempt, `perfect-50-${currentAttempt.stoppedPercentage.toFixed(3)}pct.png`);
    }
  };

  const handleSelectAttemptForShare = (att: ScoreAttempt) => {
    setSelectedAttemptForShare(att);
    setStatsModalOpen(false);
    setShareModalOpen(true);
  };

  const handleClearStats = () => {
    const fresh = clearPlayerStats();
    setStats(fresh);
    setIsNewBest(false);
  };

  return (
    <div
      className={`relative min-h-screen flex flex-col justify-between bg-[#09090B] bg-grid-subtle text-[#FAFAFA] select-none overflow-x-hidden ${
        screenShake ? 'animate-micro-shake' : ''
      }`}
    >
      {/* Background Ambient Glows */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-purple-600/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="fixed bottom-10 right-10 w-[300px] h-[300px] bg-blue-600/5 blur-[100px] rounded-full pointer-events-none -z-10" />

      {/* HEADER */}
      <Header
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenStats={() => setStatsModalOpen(true)}
        onOpenHelp={() => setHelpModalOpen(true)}
        personalBest={stats.personalBest}
      />

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6 sm:py-10 z-10 w-full max-w-4xl mx-auto">
        {/* Friend Challenge Banner if opened with link */}
        {challenge && (
          <div className="w-full max-w-[680px] mb-4">
            <ChallengeBanner
              challenge={challenge}
              lastAttempt={currentAttempt}
              onDismiss={() => setChallengeDismissed(true)}
            />
          </div>
        )}

        {/* HERO SECTION */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center text-center mb-6"
        >
          {/* Small Badge: 🎯 PRECISION CHALLENGE */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold tracking-wider uppercase mb-3 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            <span>🎯 PRECISION CHALLENGE</span>
          </div>

          {/* Main Heading: PERFECT 50% */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#FAFAFA] mb-1.5">
            PERFECT <span className="text-purple-400 drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]">50%</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-zinc-300 font-medium max-w-md">
            Think you can stop exactly at 50.000%?
          </p>

          <span className="text-xs text-zinc-400 mt-0.5">
            One tap. One chance. Perfect timing.
          </span>
        </motion.div>

        {/* MAIN GAME CARD: Max width 680px, bg #18181B, border 1px solid #27272A, border radius 24px, padding 36px desktop / 20px mobile */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="w-full max-w-[680px] rounded-3xl bg-[#18181B] border border-[#27272A] p-5 sm:p-9 card-glow flex flex-col gap-6"
        >
          <AnimatePresence mode="wait">
            {gameState === 'result' && currentAttempt ? (
              <motion.div
                key="result-state"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-6"
              >
                {/* Frozen Progress Bar */}
                <ProgressBar
                  currentPercentage={currentPercentage}
                  gameState={gameState}
                  gameMode={gameMode}
                  stoppedPercentage={stoppedPercentage}
                  freezeRipple={freezeRipple}
                />

                {/* Result Display */}
                <ResultDisplay
                  attempt={currentAttempt}
                  isNewBest={isNewBest}
                  onTryAgain={startGame}
                  onChallengeFriend={handleChallengeFriend}
                  onShareScore={handleOpenShare}
                  onDownloadCard={handleDownloadCard}
                />
              </motion.div>
            ) : (
              <motion.div
                key="play-state"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-6"
              >
                {/* SECTION 1: Target Display */}
                <div className="flex flex-col items-center text-center">
                  <span className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
                    YOUR TARGET
                  </span>
                  <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-[#FAFAFA] mt-1">
                    {gameState === 'playing' ? (
                      <span className="text-purple-400 animate-mystery">??.???%</span>
                    ) : (
                      <>
                        50.000<span className="text-3xl sm:text-4xl text-purple-400 font-sans">%</span>
                      </>
                    )}
                  </div>
                  <span className="text-xs text-zinc-400 mt-1">
                    Stop the bar as close to the center as possible.
                  </span>
                </div>

                {/* SECTION 2: Progress Bar */}
                <ProgressBar
                  currentPercentage={currentPercentage}
                  gameState={gameState}
                  gameMode={gameMode}
                  stoppedPercentage={stoppedPercentage}
                  freezeRipple={freezeRipple}
                />

                {/* SECTION 3: Primary Action Button */}
                <GameButton
                  gameState={gameState}
                  onStart={startGame}
                  onStop={stopGame}
                  onTryAgain={startGame}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* GAME MODES: Compact mode selector below the game card */}
        <div className="w-full max-w-[680px] mt-6">
          <GameModeSelector
            currentMode={gameMode}
            onSelectMode={handleSelectMode}
            gameState={gameState}
          />
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full py-4 text-center text-xs text-zinc-400 pointer-events-none select-none">
        <span>AntiActivity • Waste Time. Perfectly. • Perfect 50%</span>
      </footer>

      {/* MODALS */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        attempt={selectedAttemptForShare || currentAttempt}
      />

      <StatsModal
        isOpen={statsModalOpen}
        onClose={() => setStatsModalOpen(false)}
        stats={stats}
        onClearStats={handleClearStats}
        onSelectAttemptForShare={handleSelectAttemptForShare}
      />

      <HowToPlayModal
        isOpen={helpModalOpen}
        onClose={() => setHelpModalOpen(false)}
      />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#09090B] flex items-center justify-center text-purple-400 font-mono text-sm">
          Loading Perfect 50%...
        </div>
      }
    >
      <PerfectFiftyGame />
    </Suspense>
  );
}
