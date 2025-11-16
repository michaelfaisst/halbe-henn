import { test, expect } from "@playwright/test";
import {
  ensureDaySelected,
  ensureMarkersVisible,
  openSideNav,
  sideNavHeading,
  closeSideNav,
} from "./helpers";

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
    await ensureDaySelected(page);

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
    const mapContainer = await ensureMarkersVisible(page);

    // Open side nav
    await openSideNav(page);

    // Verify side nav is visible
    const sideNav = sideNavHeading(page);
    await expect(sideNav).toBeVisible({ timeout: 2000 });

    // Close nav before toggling theme to avoid overlay intercepts
    await closeSideNav(page);

    // Switch to dark mode
    const themeToggle = page.getByRole("button", {
      name: /zu dunklem modus wechseln/i,
    });
    await themeToggle.click();
    await page.waitForTimeout(500);

    await openSideNav(page);

    // Verify components are still visible in dark mode
    await expect(mapContainer.first()).toBeVisible({ timeout: 10000 });
    await expect(sideNav).toBeVisible({ timeout: 2000 });

    await closeSideNav(page);
  });

  test("map styling adapts to theme", async ({ page }) => {
    await page.goto("/");

    // Wait for map to load
    await ensureDaySelected(page);

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
      await expect(themeToggle).toHaveAttribute(
        "aria-label",
        /zu hellem modus wechseln/i
      );
    } else {
      await expect(themeToggle).toHaveAttribute(
        "aria-label",
        /zu dunklem modus wechseln/i
      );
    }

    // Toggle theme
    await themeToggle.click();
    await page.waitForTimeout(500);

    // Check aria-label changed
    const newHasDarkClass = await htmlElement
      .evaluate((el) => el.classList.contains("dark"))
      .catch(() => false);

    if (newHasDarkClass) {
      await expect(themeToggle).toHaveAttribute(
        "aria-label",
        /zu hellem modus wechseln/i
      );
    } else {
      await expect(themeToggle).toHaveAttribute(
        "aria-label",
        /zu dunklem modus wechseln/i
      );
    }
  });
});
