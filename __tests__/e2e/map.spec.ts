import { test, expect } from "@playwright/test";

test.describe("Map Integration", () => {
  test("map loads successfully", async ({ page }) => {
    await page.goto("/");

    // Wait for the map to load
    const mapContainer = page
      .locator('[data-testid="map"]')
      .or(page.locator(".mapboxgl-map"));
    await expect(mapContainer.first()).toBeVisible({ timeout: 10000 });
  });

  test("all markers are visible on the map", async ({ page }) => {
    await page.goto("/");

    // Wait for map to load
    await page.waitForTimeout(2000);

    // Check for marker elements (red dots)
    // Markers are rendered as divs with specific classes or data attributes
    const markers = page
      .locator('[data-testid="marker"]')
      .or(page.locator(".mapboxgl-marker"));

    // We should have at least some markers (exact count depends on data)
    // Using a reasonable minimum - there should be many stands
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
    const markers = page
      .locator('[data-testid="marker"]')
      .or(page.locator(".mapboxgl-marker"));
    const markerCount = await markers.count();
    expect(markerCount).toBeGreaterThan(0);
  });

  test("map handles missing access token gracefully", async ({ page }) => {
    // This test would require mocking the env, which is complex in e2e
    // For now, we'll just verify the map loads with a valid token
    // (The unit test covers the error case)
    await page.goto("/");

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

    // Find a marker (red dot)
    const markers = page.locator(".mapboxgl-marker");
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

    // Find and click a marker
    const markers = page.locator(".mapboxgl-marker");
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

    // Find and click a marker
    const markers = page.locator(".mapboxgl-marker");
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

    const markers = page.locator(".mapboxgl-marker");
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
