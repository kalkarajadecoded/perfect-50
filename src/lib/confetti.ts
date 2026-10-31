import confetti from 'canvas-confetti';

export function fireConfetti(level: 'legendary' | 'huge' | 'light' | 'none') {
  if (level === 'none' || typeof window === 'undefined') return;

  const purplePalette = ['#a855f7', '#c084fc', '#d946ef', '#ec4899', '#ffffff', '#eab308'];

  if (level === 'legendary') {
    // 1. Center explosion
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.6 },
      colors: purplePalette,
      scalar: 1.2,
      ticks: 300,
    });

    // 2. Left and Right Cannons
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 65,
        origin: { x: 0, y: 0.7 },
        colors: purplePalette,
      });
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 65,
        origin: { x: 1, y: 0.7 },
        colors: purplePalette,
      });
    }, 200);

    // 3. Falling stars
    setTimeout(() => {
      confetti({
        particleCount: 40,
        spread: 120,
        origin: { y: 0.4 },
        shapes: ['star', 'circle'],
        colors: ['#facc15', '#fbbf24', '#ffffff', '#e879f9'],
        scalar: 1.4,
      });
    }, 450);
  } else if (level === 'huge') {
    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.65 },
      colors: ['#a855f7', '#c084fc', '#38bdf8', '#ffffff'],
      ticks: 240,
    });
    setTimeout(() => {
      confetti({
        particleCount: 40,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#ec4899', '#a855f7', '#f43f5e'],
      });
    }, 150);
  } else if (level === 'light') {
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#c084fc', '#a855f7', '#ffffff'],
      ticks: 180,
    });
  }
}
