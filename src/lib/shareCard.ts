import { ScoreAttempt } from '@/types/game';
import { getRating } from './ratings';

export function getShareText(attempt: ScoreAttempt, currentUrl?: string): string {
  const rating = getRating(attempt.difference);
  const diffStr = attempt.difference.toFixed(3);
  const baseUrl = currentUrl || (typeof window !== 'undefined' ? window.location.origin + window.location.pathname : 'https://antiactivity.com/perfect-50');
  const challengeLink = `${baseUrl}?challenge=${attempt.stoppedPercentage.toFixed(3)}&diff=${diffStr}`;

  return `🎯 PERFECT 50% on AntiActivity\n` +
    `I stopped at ${attempt.stoppedPercentage.toFixed(3)}% (${rating.badge})\n` +
    `Difference: ${diffStr} percentage points\n\n` +
    `Think you can get closer to 50%? Beat my score:\n${challengeLink}`;
}

export function drawScoreCard(canvas: HTMLCanvasElement, attempt: ScoreAttempt): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 1080 x 1080 high-res square post
  const width = 1080;
  const height = 1080;
  canvas.width = width;
  canvas.height = height;

  const rating = getRating(attempt.difference);
  const diffStr = attempt.difference.toFixed(3);

  // Background
  ctx.fillStyle = '#09090b';
  ctx.fillRect(0, 0, width, height);

  // Purple radial gradient in center
  const radGrad = ctx.createRadialGradient(width * 0.5, height * 0.42, 50, width * 0.5, height * 0.42, 600);
  radGrad.addColorStop(0, 'rgba(168, 85, 247, 0.28)');
  radGrad.addColorStop(0.5, 'rgba(59, 130, 246, 0.08)');
  radGrad.addColorStop(1, 'rgba(9, 9, 11, 0)');
  ctx.fillStyle = radGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle grid overlay
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
  ctx.lineWidth = 1;
  const gridSize = 40;
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Outer border
  ctx.strokeStyle = 'rgba(168, 85, 247, 0.3)';
  ctx.lineWidth = 4;
  ctx.strokeRect(30, 30, width - 60, height - 60);

  // Main Card background
  ctx.fillStyle = '#18181b';
  ctx.strokeStyle = '#27272a';
  ctx.lineWidth = 2;
  roundRect(ctx, 60, 60, width - 120, height - 120, 32);
  ctx.fill();
  ctx.stroke();

  // 1. Header: AntiActivity + Mini Games
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Small Badge: PRECISION CHALLENGE
  ctx.font = '700 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = 'rgba(168, 85, 247, 0.15)';
  ctx.strokeStyle = 'rgba(168, 85, 247, 0.5)';
  ctx.lineWidth = 1.5;
  const badgeText = '🎯 PRECISION CHALLENGE';
  const badgeW = ctx.measureText(badgeText).width + 36;
  roundRect(ctx, (width - badgeW) / 2, 115, badgeW, 38, 19);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#c084fc';
  ctx.fillText(badgeText, width / 2, 134);

  // Large Heading: PERFECT 50%
  ctx.font = '900 64px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#fafafa';
  ctx.fillText('PERFECT 50%', width / 2, 205);

  // Subtitle
  ctx.font = '500 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#a1a1aa';
  ctx.fillText('Think you can stop exactly at 50%?', width / 2, 255);

  // 2. Score Center Box
  const boxX = 110;
  const boxY = 300;
  const boxW = width - 220;
  const boxH = 460;

  ctx.fillStyle = '#111114';
  ctx.strokeStyle = '#27272a';
  ctx.lineWidth = 2;
  roundRect(ctx, boxX, boxY, boxW, boxH, 24);
  ctx.fill();
  ctx.stroke();

  // "YOUR RESULT"
  ctx.font = '700 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#71717a';
  ctx.fillText('YOUR RESULT', width / 2, 355);

  // The Score Number (Large)
  ctx.font = '900 110px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';
  ctx.shadowColor = 'rgba(168, 85, 247, 0.6)';
  ctx.shadowBlur = 30;
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`${attempt.stoppedPercentage.toFixed(3)}%`, width / 2, 445);
  ctx.shadowBlur = 0; // reset

  // Rating Pill
  ctx.font = '800 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const pillText = rating.badge;
  const pillW = ctx.measureText(pillText).width + 44;
  ctx.fillStyle = 'rgba(168, 85, 247, 0.2)';
  ctx.strokeStyle = rating.color;
  ctx.lineWidth = 2;
  roundRect(ctx, (width - pillW) / 2, 515, pillW, 46, 23);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.fillText(pillText, width / 2, 538);

  // "Only X% away from perfection"
  ctx.font = '600 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#d4d4d8';
  ctx.fillText(`Only ${diffStr}% away from perfection.`, width / 2, 595);

  // Comparison Row
  const barY = 645;
  const barW = boxW - 100;
  const barX = (width - barW) / 2;

  // Track
  ctx.fillStyle = '#27272a';
  roundRect(ctx, barX, barY, barW, 20, 10);
  ctx.fill();

  // 50% target tick
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(width / 2, barY - 6);
  ctx.lineTo(width / 2, barY + 26);
  ctx.stroke();

  // Fill bar up to stop
  const fillWidth = Math.max(8, Math.min(barW, (attempt.stoppedPercentage / 100) * barW));
  const grad = ctx.createLinearGradient(barX, barY, barX + fillWidth, barY);
  grad.addColorStop(0, '#a855f7');
  grad.addColorStop(1, '#3b82f6');
  ctx.fillStyle = grad;
  roundRect(ctx, barX, barY, fillWidth, 20, 10);
  ctx.fill();

  // Target text
  ctx.font = '700 18px ui-monospace, monospace';
  ctx.fillStyle = '#a1a1aa';
  ctx.fillText(`TARGET: 50.000%    •    ACCURACY: ${attempt.accuracy.toFixed(3)}%`, width / 2, 705);

  // 3. Bottom Call To Action & Branding
  ctx.font = '900 32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#a855f7';
  ctx.fillText('CAN YOU BEAT ME?', width / 2, 825);

  ctx.font = '700 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#fafafa';
  ctx.fillText('AntiActivity', width / 2, 890);

  ctx.font = '500 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#71717a';
  ctx.fillText('antiactivity.com/perfect-50  •  Waste Time. Perfectly.', width / 2, 925);
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function generateScoreCardBlob(attempt: ScoreAttempt): Promise<Blob | null> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(null);
    const canvas = document.createElement('canvas');
    drawScoreCard(canvas, attempt);
    canvas.toBlob((blob) => resolve(blob), 'image/png', 0.95);
  });
}

export function downloadScoreCardImage(attempt: ScoreAttempt, filename = 'perfect-50-score.png') {
  if (typeof window === 'undefined') return;
  const canvas = document.createElement('canvas');
  drawScoreCard(canvas, attempt);
  const url = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export async function copyScoreCardImageToClipboard(attempt: ScoreAttempt): Promise<boolean> {
  if (typeof window === 'undefined' || !navigator.clipboard || !window.ClipboardItem) return false;
  try {
    const blob = await generateScoreCardBlob(attempt);
    if (!blob) return false;
    await navigator.clipboard.write([
      new window.ClipboardItem({ 'image/png': blob }),
    ]);
    return true;
  } catch (err) {
    console.warn('Clipboard write image failed', err);
    return false;
  }
}
