const { chromium, firefox, webkit } = require('playwright');
const fs = require('fs');
const path = require('path');

const testURL = 'https://vtwin90.github.io/twinsi-christmas-2025/';
const screenshotDir = path.join(__dirname, '../../../screenshots');
const traceDir = path.join(__dirname, '../../../traces');
fs.rmSync(screenshotDir, { recursive: true, force: true });
fs.mkdirSync(screenshotDir, { recursive: true });
fs.mkdirSync(traceDir, { recursive: true });

const viewports = {
  desktop: { width: 1280, height: 800 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 667 },
};

async function isElementVisible(page, selector) {
  const el = await page.$(selector);
  if (!el) return { exists: false, visible: false };
  const box = await el.boundingBox();
  return { exists: true, visible: !!box && box.width > 0 && box.height > 0 };
}

(async () => {
  for (const browserType of [chromium, firefox, webkit]) {
    for (const [label, viewport] of Object.entries(viewports)) {
      const browser = await browserType.launch();
      const context = await browser.newContext({ viewport });
      await context.tracing.start({ screenshots: true, snapshots: true });
      const page = await context.newPage();

      console.log(`Testing layout in ${browserType.name()} (${label})...`);
      await page.goto(testURL, { timeout: 10000 });
      await page.waitForSelector('.calendar-box', { timeout: 8000 });

      const boxCount = await page.$$eval('.calendar-box', boxes => boxes.length);
      const layoutOK = await page.evaluate(() => {
        const body = document.body;
        return body.scrollWidth <= document.documentElement.clientWidth &&
               body.scrollHeight <= document.documentElement.clientHeight;
      });

      const { visible: boxVisible } = await isElementVisible(page, '.calendar-box');

      const log = `${browserType.name()} (${label}) Layout Test\n- Boxes found: ${boxCount}\n- First box visible: ${boxVisible}\n- Responsive layout OK: ${layoutOK}\n\n`;
      fs.appendFileSync(`${screenshotDir}/layout-results.log`, log);
      console.log(log);

      await page.screenshot({ path: `${screenshotDir}/layout-${browserType.name()}-${label}.png`, fullPage: true });
      await context.tracing.stop({ path: `${traceDir}/trace-layout-${browserType.name()}-${label}.zip` });
      await browser.close();
    }
  }
})();
