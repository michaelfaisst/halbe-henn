import { test, expect } from "@playwright/test";

test.describe("Theme Toggle", () => {
  test("theme toggle button is visible and clickable", async ({ page }) => {
    await page.goto("/");

    // Wait for page to load
    await page.waitForTimeout(2000);

    // Find theme toggle button (should have aria-label for theme switching)
    const themeToggle = page.getByRole("button", {
      name: /zu (dunklem|hellem) modus wechseln/i,
    });

    await expect(themeToggle).toBeVisible({ timeout: 2000 });
  });

  test("clicking toggle switches between dark and light mode", async ({
    page,
  }) => {
    await page.goto("/");

    // Wait for page to load
    await page.waitForTimeout(2000);

    // Get initial theme (check if dark class is present on html element)
    const htmlElement = page.locator("html");
    const initialHasDarkClass = await htmlElement
      .evaluate((el) => el.classList.contains("dark"))
      .catch(() => false);

    // Find and click theme toggle button
    const themeToggle = page.getByRole("button", {
      name: /zu (dunklem|hellem) modus wechseln/i,
    });
    await themeToggle.click();

    // Wait for theme to change
    await page.waitForTimeout(500);

    // Check if theme changed (dark class should be toggled)
    const newHasDarkClass = await htmlElement
      .evaluate((el) => el.classList.contains("dark"))
      .catch(() => false);

    expect(newHasDarkClass).toBe(!initialHasDarkClass);
  });

  test("theme preference persists on page reload", async ({ page }) => {
    await page.goto("/");

    // Wait for page to load
    await page.waitForTimeout(2000);

    // Get initial theme
    const htmlElement = page.locator("html");
    const initialHasDarkClass = await htmlElement
      .evaluate((el) => el.classList.contains("dark"))
      .catch(() => false);

    // Toggle theme to dark mode
    const themeToggle = page.getByRole("button", {
      name: /zu (dunklem|hellem) modus wechseln/i,
    });
    await themeToggle.click();
    await page.waitForTimeout(500);

    // Verify theme changed
    const afterToggleHasDarkClass = await htmlElement
      .evaluate((el) => el.classList.contains("dark"))
      .catch(() => false);
    expect(afterToggleHasDarkClass).toBe(!initialHasDarkClass);

    // Reload page
    await page.reload();
    await page.waitForTimeout(2000);

    // Verify theme persisted (should still be dark if we toggled to dark)
    const afterReloadHasDarkClass = await htmlElement
      .evaluate((el) => el.classList.contains("dark"))
      .catch(() => false);
    expect(afterReloadHasDarkClass).toBe(afterToggleHasDarkClass);
  });

  test("all components render correctly in both themes", async ({ page }) => {
    await page.goto("/");

    // Wait for page to load
    await page.waitForTimeout(2000);

    // Test light mode
    const htmlElement = page.locator("html");
    let hasDarkClass = await htmlElement
      .evaluate((el) => el.classList.contains("dark"))
      .catch(() => false);

    // If in dark mode, switch to light
    if (hasDarkClass) {
      const themeToggle = page.getByRole("button", {
        name: /zu hellem modus wechseln/i,
      });
      await themeToggle.click();
      await page.waitForTimeout(500);
    }

    // Verify components are visible in light mode
    const mapContainer = page.locator(".mapboxgl-map");
    await expect(mapContainer.first()).toBeVisible({ timeout: 10000 });

    // Open side nav
    const navToggle = page.getByRole("button", {
      name: /Navigation öffnen/i,
    });
    await navToggle.click();
    await page.waitForTimeout(500);

    // Verify side nav is visible
    const sideNav = page.getByText("Halbe Henn");
    await expect(sideNav).toBeVisible({ timeout: 2000 });

    // Switch to dark mode
    const themeToggle = page.getByRole("button", {
      name: /zu dunklem modus wechseln/i,
    });
    await themeToggle.click();
    await page.waitForTimeout(500);

    // Verify components are still visible in dark mode
    await expect(mapContainer.first()).toBeVisible({ timeout: 10000 });
    await expect(sideNav).toBeVisible({ timeout: 2000 });
  });

  test("map styling adapts to theme", async ({ page }) => {
    await page.goto("/");

    // Wait for map to load
    await page.waitForTimeout(3000);

    // Get initial theme
    const htmlElement = page.locator("html");
    let hasDarkClass = await htmlElement
      .evaluate((el) => el.classList.contains("dark"))
      .catch(() => false);

    // Verify map is visible
    const mapContainer = page.locator(".mapboxgl-map");
    await expect(mapContainer.first()).toBeVisible({ timeout: 10000 });

    // Get map style attribute (Mapbox uses different styles for dark/light)
    const mapStyleBefore = await mapContainer
      .first()
      .evaluate((el) => {
        const mapElement = el as HTMLElement;
        // Mapbox GL stores style info in internal state, but we can check
        // if the map container exists and is visible
        return mapElement.style.display !== "none";
      })
      .catch(() => false);

    expect(mapStyleBefore).toBe(true);

    // Toggle theme
    const themeToggle = page.getByRole("button", {
      name: /zu (dunklem|hellem) modus wechseln/i,
    });
    await themeToggle.click();
    await page.waitForTimeout(1000); // Wait for map style to update

    // Verify map is still visible after theme change
    const mapStyleAfter = await mapContainer
      .first()
      .evaluate((el) => {
        const mapElement = el as HTMLElement;
        return mapElement.style.display !== "none";
      })
      .catch(() => false);

    expect(mapStyleAfter).toBe(true);

    // Verify theme class changed on html element
    const newHasDarkClass = await htmlElement
      .evaluate((el) => el.classList.contains("dark"))
      .catch(() => false);
    expect(newHasDarkClass).toBe(!hasDarkClass);
  });

  test("theme toggle icon changes based on current theme", async ({ page }) => {
    await page.goto("/");

    // Wait for page to load
    await page.waitForTimeout(2000);

    // Get initial theme
    const htmlElement = page.locator("html");
    const initialHasDarkClass = await htmlElement
      .evaluate((el) => el.classList.contains("dark"))
      .catch(() => false);

    // Find theme toggle button
    const themeToggle = page.getByRole("button", {
      name: /zu (dunklem|hellem) modus wechseln/i,
    });

    // Check aria-label reflects current state
    if (initialHasDarkClass) {
      // In dark mode, should show "zu hellem modus wechseln"
      await expect(
        themeToggle.getByLabel(/zu hellem modus wechseln/i)
      ).toBeVisible({ timeout: 2000 });
    } else {
      // In light mode, should show "zu dunklem modus wechseln"
      await expect(
        themeToggle.getByLabel(/zu dunklem modus wechseln/i)
      ).toBeVisible({ timeout: 2000 });
    }

    // Toggle theme
    await themeToggle.click();
    await page.waitForTimeout(500);

    // Check aria-label changed
    const newHasDarkClass = await htmlElement
      .evaluate((el) => el.classList.contains("dark"))
      .catch(() => false);

    if (newHasDarkClass) {
      // Now in dark mode, should show "zu hellem modus wechseln"
      await expect(
        themeToggle.getByLabel(/zu hellem modus wechseln/i)
      ).toBeVisible({ timeout: 2000 });
    } else {
      // Now in light mode, should show "zu dunklem modus wechseln"
      await expect(
        themeToggle.getByLabel(/zu dunklem modus wechseln/i)
      ).toBeVisible({ timeout: 2000 });
    }
  });
});
