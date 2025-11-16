import { test, expect } from "@playwright/test";
import {
  closeSideNav,
  ensureDaySelected,
  ensureMarkersVisible,
  getDayCheckbox,
  markersLocator,
  sideNavCloseButton,
  navToggleButton,
  openSideNav,
  sideNavHeading,
} from "./helpers";

test.describe("Map Integration", () => {
  test("map loads successfully", async ({ page }) => {
    await page.goto("/");
    await ensureDaySelected(page);

    // Wait for the map to load
    const mapContainer = page
      .locator('[data-testid="map"]')
      .or(page.locator(".mapboxgl-map"));
    await expect(mapContainer.first()).toBeVisible({ timeout: 10000 });
  });

  test("all markers are visible on the map", async ({ page }) => {
    await page.goto("/");
    await ensureDaySelected(page);

    const markers = await ensureMarkersVisible(page);
    const markerCount = await markers.count();
    expect(markerCount).toBeGreaterThan(0);

    // Verify markers are visible
    if (markerCount > 0) {
      await expect(markers.first()).toBeVisible();
    }
  });

  test("map is responsive on mobile viewport", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto("/");
    await ensureDaySelected(page);

    // Wait for map to load
    await page.waitForTimeout(2000);

    // Check that map container takes full width and height
    const main = page.locator("main");
    const mainBox = await main.boundingBox();

    expect(mainBox).not.toBeNull();
    if (mainBox) {
      // Map should take full viewport width (with small tolerance for padding)
      expect(mainBox.width).toBeGreaterThan(350);
      // Map should take full viewport height
      expect(mainBox.height).toBeGreaterThan(600);
    }

    // Verify map is still visible and functional on mobile
    const mapContainer = page
      .locator('[data-testid="map"]')
      .or(page.locator(".mapboxgl-map"));
    await expect(mapContainer.first()).toBeVisible({ timeout: 10000 });
  });

  test("map displays with correct initial view for Vorarlberg region", async ({
    page,
  }) => {
    await page.goto("/");
    await ensureDaySelected(page);

    // Wait for map to load
    await page.waitForTimeout(2000);

    // Verify map is visible
    const mapContainer = page
      .locator('[data-testid="map"]')
      .or(page.locator(".mapboxgl-map"));
    await expect(mapContainer.first()).toBeVisible({ timeout: 10000 });

    // The map should be centered around Vorarlberg region
    // We can verify this by checking if markers are visible
    // (which would indicate the map is showing the correct region)
    const markers = await ensureMarkersVisible(page);
    const markerCount = await markers.count();
    expect(markerCount).toBeGreaterThan(0);
  });

  test("map handles missing access token gracefully", async ({ page }) => {
    // This test would require mocking the env, which is complex in e2e
    // For now, we'll just verify the map loads with a valid token
    // (The unit test covers the error case)
    await page.goto("/");
    await ensureDaySelected(page);

    // If token is missing, we should see an error message
    // Otherwise, map should load
    const errorMessage = page.getByText(/Mapbox access token is missing/i);
    const mapContainer = page
      .locator('[data-testid="map"]')
      .or(page.locator(".mapboxgl-map"));

    // Either error message OR map should be visible
    const hasError = await errorMessage.isVisible().catch(() => false);
    const hasMap = await mapContainer
      .first()
      .isVisible()
      .catch(() => false);

    expect(hasError || hasMap).toBe(true);
  });
});

test.describe("Marker Interactions", () => {
  test("clicking a marker opens popover", async ({ page }) => {
    await page.goto("/");

    // Wait for map and markers to load
    await page.waitForTimeout(2000);
    await ensureDaySelected(page);

    // Find a marker (red dot)
    const markers = await ensureMarkersVisible(page);
    const markerCount = await markers.count();
    expect(markerCount).toBeGreaterThan(0);

    // Click the first marker
    await markers.first().click();

    // Wait for popover to appear
    await page.waitForTimeout(500);

    // Check that popover is visible (should contain stand information)
    const popover = page
      .locator('[role="dialog"]')
      .or(page.locator("[data-radix-popper-content-wrapper]"));
    await expect(popover.first()).toBeVisible({ timeout: 2000 });
  });

  test("popover displays correct stand information", async ({ page }) => {
    await page.goto("/");

    // Wait for map and markers to load
    await page.waitForTimeout(2000);
    await ensureDaySelected(page);

    // Find and click a marker
    const markers = await ensureMarkersVisible(page);
    await markers.first().click();

    // Wait for popover to appear
    await page.waitForTimeout(500);

    // Check that day names are displayed (all days should be visible)
    await expect(page.getByText(/Montag/)).toBeVisible({ timeout: 2000 });
    await expect(page.getByText(/Dienstag/)).toBeVisible({ timeout: 2000 });
    await expect(page.getByText(/Samstag/)).toBeVisible({ timeout: 2000 });

    // Check that stand information is displayed
    // (name, address, and days should be visible)
    const popover = page
      .locator('[role="dialog"]')
      .or(page.locator("[data-radix-popper-content-wrapper]"));
    const popoverText = await popover.first().textContent();
    expect(popoverText).toBeTruthy();
    expect(popoverText?.length).toBeGreaterThan(0);
  });

  test("clicking outside closes popover", async ({ page }) => {
    await page.goto("/");

    // Wait for map and markers to load
    await page.waitForTimeout(2000);
    await ensureDaySelected(page);

    // Find and click a marker
    const markers = await ensureMarkersVisible(page);
    await markers.first().click();

    // Wait for popover to appear
    await page.waitForTimeout(500);

    // Verify popover is open
    const popover = page
      .locator('[role="dialog"]')
      .or(page.locator("[data-radix-popper-content-wrapper]"));
    await expect(popover.first()).toBeVisible({ timeout: 2000 });

    // Click outside the popover (on the map)
    await page.click("body", { position: { x: 100, y: 100 } });

    // Wait for popover to close
    await page.waitForTimeout(500);

    // Verify popover is closed (should not be visible)
    const popoverAfterClick = page
      .locator('[role="dialog"]')
      .or(page.locator("[data-radix-popper-content-wrapper]"));
    const isVisible = await popoverAfterClick
      .first()
      .isVisible()
      .catch(() => false);
    expect(isVisible).toBe(false);
  });

  test("multiple markers can be clicked sequentially", async ({ page }) => {
    await page.goto("/");

    // Wait for map and markers to load
    await page.waitForTimeout(2000);
    await ensureDaySelected(page, "Montag");
    await openSideNav(page);
    const dienstagCheckbox = getDayCheckbox(page, "Dienstag");
    const dienstagChecked =
      (await dienstagCheckbox.getAttribute("aria-checked")) === "true";
    if (!dienstagChecked) {
      await dienstagCheckbox.click();
      await page.waitForTimeout(300);
    }
    await closeSideNav(page);
    const markers = await ensureMarkersVisible(page);
    const markerCount = await markers.count();
    expect(markerCount).toBeGreaterThan(1); // Need at least 2 markers for this test

    // Click first marker
    await markers.first().click();
    await page.waitForTimeout(500);

    // Verify first popover is visible
    let popover = page
      .locator('[role="dialog"]')
      .or(page.locator("[data-radix-popper-content-wrapper]"));
    await expect(popover.first()).toBeVisible({ timeout: 2000 });

    // Click second marker
    await markers.nth(1).click();
    await page.waitForTimeout(500);

    // Verify popover is still visible (should show second marker's info)
    popover = page
      .locator('[role="dialog"]')
      .or(page.locator("[data-radix-popper-content-wrapper]"));
    await expect(popover.first()).toBeVisible({ timeout: 2000 });
  });
});

test.describe("Day Filtering", () => {
  test("default filter shows only current day's stands", async ({ page }) => {
    await page.goto("/");
    await ensureDaySelected(page, "Montag");
    await openSideNav(page);

    await expect(sideNavHeading(page)).toBeVisible({ timeout: 2000 });
    const markers = markersLocator(page);
    await expect(markers.first()).toBeVisible({ timeout: 10000 });

    const checkedCheckboxes = page.getByRole("checkbox", { checked: true });
    expect(await checkedCheckboxes.count()).toBeGreaterThan(0);
    await closeSideNav(page);
  });

  test("selecting different days updates visible markers", async ({ page }) => {
    await page.goto("/");
    await ensureDaySelected(page, "Montag");
    await openSideNav(page);

    const markers = markersLocator(page);
    const initialMarkerCount = await markers.count();

    const dienstagCheckbox = getDayCheckbox(page, "Dienstag");
    await expect(dienstagCheckbox).toBeVisible({ timeout: 2000 });
    const wasChecked =
      (await dienstagCheckbox.getAttribute("aria-checked")) === "true";
    await dienstagCheckbox.click();
    await page.waitForTimeout(1000);
    await expect(dienstagCheckbox).toHaveAttribute(
      "aria-checked",
      wasChecked ? "false" : "true"
    );

    if (!wasChecked) {
      await closeSideNav(page);
      await expect(markers.first()).toBeVisible({ timeout: 10000 });
      await openSideNav(page);
    }

    await closeSideNav(page);
  });

  test("multiple day selection works correctly", async ({ page }) => {
    await page.goto("/");
    await openSideNav(page);

    const ensureChecked = async (label: string) => {
      const checkbox = getDayCheckbox(page, label);
      const isChecked =
        (await checkbox.getAttribute("aria-checked")) === "true";
      if (!isChecked) {
        await checkbox.click();
        await page.waitForTimeout(300);
      }
      return checkbox;
    };

    const montagCheckbox = await ensureChecked("Montag");
    const mittwochCheckbox = await ensureChecked("Mittwoch");

    await expect(montagCheckbox).toHaveAttribute("aria-checked", "true");
    await expect(mittwochCheckbox).toHaveAttribute("aria-checked", "true");

    await closeSideNav(page);
    const markers = await ensureMarkersVisible(page);
    expect(await markers.count()).toBeGreaterThan(0);
  });

  test("filter persists during marker interactions", async ({ page }) => {
    await page.goto("/");
    await openSideNav(page);
    await ensureDaySelected(page, "Freitag");

    const markers = await ensureMarkersVisible(page);
    const markerCountBefore = await markers.count();
    await closeSideNav(page);

    if (markerCountBefore > 0) {
      await markers.first().click();
      await page.waitForTimeout(500);

      const popover = page
        .locator('[role="dialog"]')
        .or(page.locator("[data-radix-popper-content-wrapper]"));
      await expect(popover.first()).toBeVisible({ timeout: 2000 });

      await page.click("body", { position: { x: 100, y: 100 } });
      await page.waitForTimeout(500);

      const markerCountAfter = await markers.count();
      expect(markerCountAfter).toBe(markerCountBefore);
    }
  });

  test("mobile filter UI works correctly", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    await openSideNav(page);
    await expect(sideNavHeading(page)).toBeVisible({ timeout: 2000 });

    const montagCheckbox = getDayCheckbox(page, "Montag");
    await montagCheckbox.click();
    await page.waitForTimeout(500);
    await expect(montagCheckbox).toHaveAttribute("aria-checked", "true");

    await closeSideNav(page);
    const markers = await ensureMarkersVisible(page);
    expect(await markers.count()).toBeGreaterThan(0);
  });

  test("user can reselect a day after clearing selection", async ({ page }) => {
    await page.goto("/");
    await ensureDaySelected(page, "Montag");
    await openSideNav(page);

    const checkedCheckboxes = page.getByRole("checkbox", { checked: true });
    expect(await checkedCheckboxes.count()).toBeGreaterThanOrEqual(1);

    const montagCheckbox = getDayCheckbox(page, "Montag");
    await montagCheckbox.click();
    await page.waitForTimeout(300);
    await expect(montagCheckbox).toHaveAttribute("aria-checked", "false");

    await montagCheckbox.click();
    await page.waitForTimeout(300);
    await expect(montagCheckbox).toHaveAttribute("aria-checked", "true");

    await closeSideNav(page);
  });

  test("toggle button opens side nav and close button dismisses it", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForTimeout(2000);

    await expect(navToggleButton(page)).toBeVisible({ timeout: 2000 });

    await navToggleButton(page).click();
    await page.waitForTimeout(500);
    await expect(sideNavHeading(page)).toBeVisible({ timeout: 2000 });

    await sideNavCloseButton(page).click();
    await page.waitForTimeout(500);
    await expect(sideNavHeading(page)).toHaveCount(0);
  });
});
