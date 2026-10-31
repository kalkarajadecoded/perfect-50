const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function runBrowserTests() {
  const screenshotsDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();

  // Listen for console logs and errors
  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', (err) => {
    consoleErrors.push(err.toString());
  });

  console.log('Navigating to http://localhost:3000 ...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  // 1. Desktop Screenshot 1440x900
  await page.setViewport({ width: 1440, height: 900 });
  await page.screenshot({ path: path.join(screenshotsDir, 'desktop_1440x900.png'), fullPage: false });
  console.log('Saved desktop_1440x900.png');

  // 2. Tablet Screenshot 768x1024
  await page.setViewport({ width: 768, height: 1024 });
  await page.screenshot({ path: path.join(screenshotsDir, 'tablet_768x1024.png'), fullPage: false });
  console.log('Saved tablet_768x1024.png');

  // 3. Mobile Screenshot 390x844
  await page.setViewport({ width: 390, height: 844 });
  await page.screenshot({ path: path.join(screenshotsDir, 'mobile_390x844.png'), fullPage: false });
  console.log('Saved mobile_390x844.png');

  // 4. Test Gameplay: Click "START CHALLENGE", wait 800ms, click "STOP NOW!"
  console.log('Testing gameplay: Clicking START CHALLENGE...');
  await page.setViewport({ width: 1440, height: 900 });
  
  // Find start button
  const startBtn = await page.$('button[aria-label="Start Challenge"]');
  if (startBtn) {
    await startBtn.click();
    console.log('Clicked Start Challenge. Waiting 850ms for bar to move...');
    await new Promise((r) => setTimeout(r, 850));

    // Capture running screenshot
    await page.screenshot({ path: path.join(screenshotsDir, 'gameplay_running.png'), fullPage: false });
    console.log('Saved gameplay_running.png');

    // Click Stop button
    const stopBtn = await page.$('button[aria-label="Stop Now"]');
    if (stopBtn) {
      await stopBtn.click();
      console.log('Clicked Stop Now. Waiting 600ms for result...');
      await new Promise((r) => setTimeout(r, 600));

      // Capture result screen
      await page.screenshot({ path: path.join(screenshotsDir, 'gameplay_result.png'), fullPage: false });
      console.log('Saved gameplay_result.png');
    } else {
      console.error('Stop button not found!');
    }
  } else {
    console.error('Start button not found!');
  }

  // 5. Test Friend Challenge URL
  console.log('Testing friend challenge URL ?challenge=50.023&diff=0.023 ...');
  await page.goto('http://localhost:3000/?challenge=50.023&diff=0.023', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(screenshotsDir, 'challenge_banner.png'), fullPage: false });
  console.log('Saved challenge_banner.png');

  await browser.close();

  console.log('Console Errors count:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.log('Errors:', consoleErrors);
  }
  console.log('Browser tests completed successfully!');
}

runBrowserTests().catch((err) => {
  console.error('Browser test failed:', err);
  process.exit(1);
});
