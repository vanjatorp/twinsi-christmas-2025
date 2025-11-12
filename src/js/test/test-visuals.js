const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const testURL = 'https://vtwin90.github.io/twinsi-christmas-2025/';
const screenshotDir = path.join(__dirname, '../../../screenshots');
const traceDir = path.join(__dirname, '../../../traces');
fs.mkdirSync(screenshotDir, { recursive: true });
fs.mkdirSync(traceDir, { recursive: true });

// Helper: check visibility via computed styles
async function isStyleVisible(page, selector) {
  return await page.$eval(selector, el => {
    const style = getComputedStyle(el);
    return style.display !== 'none' &&
           style.visibility !== 'hidden' &&
           parseFloat(style.opacity) > 0;
  }).catch(() => false);
}

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await context.tracing.start({ screenshots: true, snapshots: true });
  const page = await context.newPage();

  console.log('Testing visuals...');
  await page.goto(testURL, { timeout: 10000 });
  await page.waitForTimeout(3000);

  const fontFamily = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
  const snowflakeAnimating = await page.$eval('.snowflake', el => getComputedStyle(el).animationName !== 'none').catch(() => false);

  const visuals = {
    stars: await isStyleVisible(page, '.stars'),
    aurora: await isStyleVisible(page, '.aurora-layer'),
    auroraSecondary: await isStyleVisible(page, '.aurora-layer.secondary'),
    iceberg: await isStyleVisible(page, '.ice-floe'),
    icebear: await isStyleVisible(page, '.container.icebear'),
    icebearFace: await isStyleVisible(page, '.icebear-face'),
    christmasHat: await isStyleVisible(page, '.christmas-hat'),
    snoreZ1: await isStyleVisible(page, '.z-1'),
    snoreZ2: await isStyleVisible(page, '.z-2'),
    snoreZ3: await isStyleVisible(page, '.z-3'),
  };

  const log = `Visuals Test
- Font family: ${fontFamily}
- Snowflake animation: ${snowflakeAnimating}
- Stars visible: ${visuals.stars}
- Aurora visible: ${visuals.aurora}
- Aurora secondary visible: ${visuals.auroraSecondary}
- Iceberg visible: ${visuals.iceberg}
- Icebear visible: ${visuals.icebear}
- Icebear face visible: ${visuals.icebearFace}
- Christmas hat visible: ${visuals.christmasHat}
- Snore Z1 visible: ${visuals.snoreZ1}
- Snore Z2 visible: ${visuals.snoreZ2}
- Snore Z3 visible: ${visuals.snoreZ3}\n\n`;

  fs.appendFileSync(`${screenshotDir}/visuals-results.log`, log);
  console.log(log);

  await page.screenshot({ path: `${screenshotDir}/visuals.png`, fullPage: true });
  await context.tracing.stop({ path: `${traceDir}/trace-visuals.zip` });
  await browser.close();
})();
