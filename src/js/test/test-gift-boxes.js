const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const testURL = 'https://vtwin90.github.io/twinsi-christmas-2025/';
const screenshotDir = path.join(__dirname, '../../../screenshots');
const traceDir = path.join(__dirname, '../../../traces');
fs.mkdirSync(screenshotDir, { recursive: true });
fs.mkdirSync(traceDir, { recursive: true });

const selectedBoxes = [0, 1, 2]; // Boxes 1, 2, and 3 (0-indexed)
const isCI = process.env.GITHUB_ACTIONS === 'true';

async function isElementVisible(page, selector) {
  const el = await page.$(selector);
  if (!el) return { exists: false, visible: false };
  const box = await el.boundingBox();
  return { exists: true, visible: !!box && box.width > 0 && box.height > 0 };
}

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 375, height: 667 } });
  await context.tracing.start({ screenshots: true, snapshots: true });
  const page = await context.newPage();

  console.log('Testing gift boxes on mobile...');
  await page.goto(testURL, { timeout: 10000 });
  await page.waitForSelector('.calendar-box', { timeout: 8000 });

  const boxCount = await page.$$eval('.calendar-box', boxes => boxes.length);
  let modalSuccess = 0;
  let spotifyLoaded = 0;

  for (const i of selectedBoxes) {
    try {
      const freshBoxes = await page.$$('.calendar-box');
      const box = freshBoxes[i];
      await box.click({ force: true });
      await page.waitForTimeout(1500);

      const { visible: modalVisible } = await isElementVisible(page, '.gift-modal:not(.hidden)');
      const { visible: spotifyVisible } = await isElementVisible(page, 'iframe[src*="spotify"]');

      if (modalVisible) {
        modalSuccess++;
        if (spotifyVisible) spotifyLoaded++;
        if (!isCI) {
          await page.screenshot({ path: `${screenshotDir}/gift-modal-${i + 1}.png` });
        }
        await page.click('.close-modal').catch(() => {});
      }
    } catch (error) {
      console.warn(`Box ${i + 1} failed: ${error.message}`);
    }
  }

  const log = `Gift Box Test\n- Boxes found: ${boxCount}\n- Modals opened: ${modalSuccess}\n- Spotify loaded: ${spotifyLoaded}\n\n`;
  fs.appendFileSync(`${screenshotDir}/gift-results.log`, log);
  console.log(log);

  await context.tracing.stop({ path: `${traceDir}/trace-gift-boxes.zip` });
  await browser.close();
})();
