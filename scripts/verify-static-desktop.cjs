const assert = require("node:assert/strict");
const fs = require("node:fs");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");

(async () => {
  const browser = await chromium.launch();
  const origin = process.env.QA_ORIGIN || "http://localhost:3300";
  const checks = [];
  for (const width of [1440, 768, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    assert.equal((await page.goto(origin + "/pre-order", { waitUntil: "networkidle" })).status(), 200);
    await page.locator("#design").scrollIntoViewIfNeeded();
    await page.waitForFunction(() => [...document.querySelectorAll("#design img")].every(image => image.complete && image.naturalWidth > 0));
    assert.equal(await page.locator("#design img").count(), 4);
    assert.equal(await page.locator("#design video, #design .port-caption, footer .reference-note").count(), 0);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    fs.mkdirSync("docs/launch-evidence/static-desktop", { recursive: true });
    await page.locator("#design").screenshot({ path: `docs/launch-evidence/static-desktop/design-${width}.png` });
    await page.locator("#highlights").scrollIntoViewIfNeeded();
    const video = page.locator("#highlights video");
    assert.equal(await video.getAttribute("src"), "/site/wicclaw/highlights-mx-xlargewc.mp4");
    await page.getByRole("button", { name: "Show ai desktop highlight", exact: true }).click();
    await page.waitForFunction(() => document.querySelector("#highlights video").readyState >= 2);
    const pause = page.getByRole("button", { name: "Pause highlights", exact: true });
    if (await pause.count()) await pause.click();
    assert.equal(await video.evaluate(element => element.paused), true);
    assert.deepEqual(errors, []);
    checks.push(`${width}px: four loaded static images, no rotation/caption/footer paragraph, no overflow, highlight video loaded and paused, no browser errors`);
    await page.close();
  }
  await browser.close();
  console.log(JSON.stringify({ passed: checks.length, failed: 0, checks }, null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; });
