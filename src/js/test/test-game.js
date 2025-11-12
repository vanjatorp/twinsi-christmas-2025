const { chromium, firefox, webkit } = require('playwright');
const fs = require('fs');
const path = require('path');

const testURL = 'https://vtwin90.github.io/twinsi-cookie-catch/';
const screenshotDir = path.join(__dirname, '../../../screenshots');
const traceDir = path.join(__dirname, '../../../traces');
fs.mkdirSync(screenshotDir, { recursive: true });
fs.mkdirSync(traceDir, { recursive: true });

const browsers = { chromium, firefox, webkit };
const viewports = {
  desktop: { width: 1280, height: 800 },
  mobile: { width: 375, height: 667 },
};

// Helper: robust visibility check using bounding box
async function isElementVisible(page, selector) {
  const el = await page.$(selector);
  if (!el) return { exists: false, visible: false };
  const box = await el.boundingBox();
  return { exists: true, visible: !!box && box.width > 0 && box.height > 0 };
}

(async () => {
  for (const [browserName, browserType] of Object.entries(browsers)) {
    for (const [device, viewport] of Object.entries(viewports)) {
      const browser = await browserType.launch();
      const context = await browser.newContext({ viewport });
      await context.tracing.start({ screenshots: true, snapshots: true });
      const page = await context.newPage();

      console.log(`Testing game in ${browserName} (${device})...`);
      await page.goto(testURL, { timeout: 10000 });
      await page.waitForTimeout(2000);

      const canvasExists = await page.$('canvas');

      await page.waitForTimeout(45000); // wait for game to finish
      await page.waitForTimeout(3000);  // extra buffer for button to appear

      const { exists: playAgainExists, visible: playAgainVisible } = await isElementVisible(page, '#play-again');

      const log = `Game Test (${browserName}, ${device})\n- Canvas present: ${!!canvasExists}\n- Play again button exists: ${playAgainExists}\n- Play again button visible: ${playAgainVisible}\n\n`;
      fs.appendFileSync(`${screenshotDir}/game-results.log`, log);
      console.log(log);

      await page.screenshot({ path: `${screenshotDir}/game-${browserName}-${device}.png`, fullPage: true });
      await context.tracing.stop({ path: `${traceDir}/trace-game-${browserName}-${device}.zip` });
      await browser.close();
    }
  }
})();
