// Run against a local Vite server: node scripts/ui-smoke.mjs http://127.0.0.1:5181
// Requires Playwright and its Chromium browser in the development environment.
import assert from "node:assert/strict";
import { chromium } from "playwright";
const url = process.argv[2];
assert(url, "Pass the local app URL");
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const width of [1440, 768, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(url);
    await page.locator(".hero").waitFor();
    assert.equal(
      await page.locator("form").count(),
      0,
      "Landing must be separate from workspace",
    );
    for (const route of [
      "dashboard",
      "walletHub",
      "deployer",
      "privacy",
      "home",
    ]) {
      await page
        .locator('a[href="#' + route + '"]')
        .first()
        .click();
      await page.waitForFunction(
        (route) => location.hash === "#" + route,
        route,
      );
      await page
        .locator(route === "home" ? ".hero" : ".workspace-content")
        .waitFor();
      assert.equal(await page.locator("h1").count(), 1);
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        "Horizontal overflow at " + width + " on " + route,
      );
      if (route === "dashboard") {
        assert(
          await page.locator('button[type="submit"]').isDisabled(),
          "Disconnected submission must be disabled",
        );
        assert.equal(
          await page.locator('input:not([type="checkbox"])').count(),
          3,
        );
      }
      await page.screenshot({
        path: "/tmp/" + new URL(url).port + "-" + width + "-" + route + ".png",
        fullPage: true,
      });
    }
    await page.goto(url + "#privacy");
    await page.reload();
    await page.locator(".privacy-layout").waitFor();
    await page.locator('a[href="#dashboard"]').first().click();
    await page.goBack();
    await page.locator(".privacy-layout").waitFor();
  }
  assert.deepEqual(errors, [], "No browser runtime errors");
  console.log(
    "PASS: landing/workspace separation, all routes, reload/back, disabled forms, and overflow at 1440/768/390px.",
  );
} finally {
  await browser.close();
}
