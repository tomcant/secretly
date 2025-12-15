import { browser } from "k6/browser";
import { check } from "https://jslib.k6.io/k6-utils/1.6.0/index.js";

const commonOptions = {
  executor: "shared-iterations",
  options: {
    browser: {
      type: "chromium",
    },
  },
};

export const options = {
  scenarios: {
    happyPath: {
      exec: "happyPath",
      ...commonOptions,
    },
  },
  thresholds: {
    checks: ["rate == 1"], // All checks must pass
    http_req_failed: ["rate == 0"], // All HTTP requests must succeed
  },
};

export async function happyPath() {
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(__ENV.START_URL);

    await page.waitForSelector("h1");

    await check(page.locator("h1"), {
      "header": async h1 => await h1.textContent() === "Secretly",
    });

    await screenshot(page, "01-initial-page-loaded.png");

    await page.locator("textarea").type("My secret");

    await page.click("button[type='submit']");

    await page.waitForSelector("input[readonly]");

    await screenshot(page, "02-secret-created.png");

    const shareableLink = await page.locator("input[readonly]").inputValue();
    await page.goto(shareableLink);

    await page.waitForSelector("h1");

    await check(page.locator("h1"), {
      "header": async h1 => await h1.textContent() === "Secret Revealed",
    });

    await check(page.locator("pre"), {
      "secret": async pre => await pre.textContent() === "My secret",
    });

    await screenshot(page, "03-secret-revealed.png");
  } finally {
    await page.close();
  }
}

async function screenshot(page, fileName) {
  // Wait for animations to complete before taking the screenshot
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `screenshots/${fileName}`, fullPage: true });
}
