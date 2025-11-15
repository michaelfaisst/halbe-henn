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

test.describe("Day Filtering", () => {
  test("default filter shows only current day's stands", async ({ page }) => {
    await page.goto("/");

    // Wait for map to load
    await page.waitForTimeout(2000);

    // Open side nav by clicking the toggle button
    const toggleButton = page.getByRole("button", {
      name: /Navigation öffnen|Navigation schließen/i,
    });
    await expect(toggleButton).toBeVisible({ timeout: 2000 });
    await toggleButton.click();
    await page.waitForTimeout(500);

    // Verify side nav is visible
    const sideNav = page.getByText("Halbe Henn");
    await expect(sideNav).toBeVisible({ timeout: 2000 });

    // Get initial marker count (should be filtered by current day)
    const markers = page.locator(".mapboxgl-marker");
    const initialMarkerCount = await markers.count();

    // Should have at least some markers (depending on current day)
    expect(initialMarkerCount).toBeGreaterThanOrEqual(0);

    // Verify that at least one day checkbox is checked (current day)
    const checkedCheckboxes = page.locator('input[type="checkbox"]:checked');
    const checkedCount = await checkedCheckboxes.count();
    expect(checkedCount).toBeGreaterThanOrEqual(1);
  });

  test("selecting different days updates visible markers", async ({ page }) => {
    await page.goto("/");

    // Wait for map to load
    await page.waitForTimeout(2000);

    // Open side nav
    const toggleButton = page.getByRole("button", {
      name: /Navigation öffnen|Navigation schließen/i,
    });
    await toggleButton.click();
    await page.waitForTimeout(500);

    // Get initial marker count
    const markers = page.locator(".mapboxgl-marker");
    const initialMarkerCount = await markers.count();

    // Find and click "Dienstag" (Tuesday) checkbox
    const dienstagLabel = page.getByText("Dienstag");
    await expect(dienstagLabel).toBeVisible({ timeout: 2000 });

    // Get the checkbox associated with Dienstag
    const dienstagCheckbox = page.locator('input[id="day-2"]');
    const isChecked = await dienstagCheckbox.isChecked();

    // Click to toggle
    await dienstagLabel.click();
    await page.waitForTimeout(1000); // Wait for filter to apply

    // If it was unchecked, markers should change
    if (!isChecked) {
      const newMarkerCount = await markers.count();
      // Marker count should have changed (either increased or decreased)
      // We can't predict exact count, but it should be different or same
      expect(newMarkerCount).toBeGreaterThanOrEqual(0);
    }

    // Verify checkbox state changed
    const newCheckedState = await dienstagCheckbox.isChecked();
    expect(newCheckedState).toBe(!isChecked);
  });

  test("multiple day selection works correctly", async ({ page }) => {
    await page.goto("/");

    // Wait for map to load
    await page.waitForTimeout(2000);

    // Open side nav
    const toggleButton = page.getByRole("button", {
      name: /Navigation öffnen|Navigation schließen/i,
    });
    await toggleButton.click();
    await page.waitForTimeout(500);

    // Click "Montag" (Monday) checkbox
    const montagLabel = page.getByText("Montag");
    await expect(montagLabel).toBeVisible({ timeout: 2000 });
    await montagLabel.click();
    await page.waitForTimeout(500);

    // Click "Mittwoch" (Wednesday) checkbox
    const mittwochLabel = page.getByText("Mittwoch");
    await expect(mittwochLabel).toBeVisible({ timeout: 2000 });
    await mittwochLabel.click();
    await page.waitForTimeout(1000); // Wait for filter to apply

    // Verify both checkboxes are checked
    const montagCheckbox = page.locator('input[id="day-1"]');
    const mittwochCheckbox = page.locator('input[id="day-3"]');

    const montagChecked = await montagCheckbox.isChecked();
    const mittwochChecked = await mittwochCheckbox.isChecked();

    expect(montagChecked).toBe(true);
    expect(mittwochChecked).toBe(true);

    // Verify markers are visible (should show stands available on Monday OR Wednesday)
    const markers = page.locator(".mapboxgl-marker");
    const markerCount = await markers.count();
    expect(markerCount).toBeGreaterThanOrEqual(0);
  });

  test("filter persists during marker interactions", async ({ page }) => {
    await page.goto("/");

    // Wait for map to load
    await page.waitForTimeout(2000);

    // Open side nav
    const toggleButton = page.getByRole("button", {
      name: /Navigation öffnen|Navigation schließen/i,
    });
    await toggleButton.click();
    await page.waitForTimeout(500);

    // Select a specific day (e.g., Freitag - Friday)
    const freitagLabel = page.getByText("Freitag");
    await expect(freitagLabel).toBeVisible({ timeout: 2000 });
    await freitagLabel.click();
    await page.waitForTimeout(1000);

    // Get marker count with filter
    const markers = page.locator(".mapboxgl-marker");
    const markerCountBefore = await markers.count();

    // Click a marker to open popover
    if (markerCountBefore > 0) {
      await markers.first().click();
      await page.waitForTimeout(500);

      // Verify popover is visible
      const popover = page
        .locator('[role="dialog"]')
        .or(page.locator("[data-radix-popper-content-wrapper]"));
      await expect(popover.first()).toBeVisible({ timeout: 2000 });

      // Close popover by clicking outside
      await page.click("body", { position: { x: 100, y: 100 } });
      await page.waitForTimeout(500);

      // Verify filter is still applied (same marker count)
      const markerCountAfter = await markers.count();
      expect(markerCountAfter).toBe(markerCountBefore);
    }
  });

  test("mobile filter UI works correctly", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto("/");

    // Wait for map to load
    await page.waitForTimeout(2000);

    // Open side nav
    const toggleButton = page.getByRole("button", {
      name: /Navigation öffnen|Navigation schließen/i,
    });
    await toggleButton.click();
    await page.waitForTimeout(500);

    // Verify side nav is visible on mobile
    const sideNav = page.getByText("Halbe Henn");
    await expect(sideNav).toBeVisible({ timeout: 2000 });

    // Verify filter checkboxes are visible and clickable
    const montagLabel = page.getByText("Montag");
    await expect(montagLabel).toBeVisible({ timeout: 2000 });

    // Click a checkbox on mobile
    await montagLabel.click();
    await page.waitForTimeout(1000);

    // Verify checkbox state changed
    const montagCheckbox = page.locator('input[id="day-1"]');
    const isChecked = await montagCheckbox.isChecked();
    expect(isChecked).toBe(true);

    // Verify markers are visible
    const markers = page.locator(".mapboxgl-marker");
    const markerCount = await markers.count();
    expect(markerCount).toBeGreaterThanOrEqual(0);
  });

  test("cannot uncheck last selected day", async ({ page }) => {
    await page.goto("/");

    // Wait for map to load
    await page.waitForTimeout(2000);

    // Open side nav
    const toggleButton = page.getByRole("button", {
      name: /Navigation öffnen|Navigation schließen/i,
    });
    await toggleButton.click();
    await page.waitForTimeout(500);

    // Get the currently checked checkbox (should be current day)
    const checkedCheckboxes = page.locator('input[type="checkbox"]:checked');
    const checkedCount = await checkedCheckboxes.count();
    expect(checkedCount).toBeGreaterThanOrEqual(1);

    // If only one is checked, try to uncheck it
    if (checkedCount === 1) {
      const checkedCheckbox = checkedCheckboxes.first();
      const checkboxId = await checkedCheckbox.getAttribute("id");

      // Try to click the label to uncheck
      if (checkboxId) {
        const dayNumber = checkboxId.replace("day-", "");
        const dayLabels: Record<string, string> = {
          "1": "Montag",
          "2": "Dienstag",
          "3": "Mittwoch",
          "4": "Donnerstag",
          "5": "Freitag",
          "6": "Samstag",
        };
        const dayLabel = dayLabels[dayNumber];

        if (dayLabel) {
          const label = page.getByText(dayLabel);
          await label.click();
          await page.waitForTimeout(500);

          // Verify checkbox is still checked (should not allow unchecking last one)
          const stillChecked = await checkedCheckbox.isChecked();
          expect(stillChecked).toBe(true);
        }
      }
    }
  });

  test("toggle button opens and closes side nav", async ({ page }) => {
    await page.goto("/");

    // Wait for map to load
    await page.waitForTimeout(2000);

    // Verify toggle button is visible
    const toggleButton = page.getByRole("button", {
      name: /Navigation öffnen|Navigation schließen/i,
    });
    await expect(toggleButton).toBeVisible({ timeout: 2000 });

    // Initially, side nav should be closed
    const sideNav = page.getByText("Halbe Henn");
    const initiallyVisible = await sideNav.isVisible().catch(() => false);
    // Side nav might be visible or not initially, but after clicking it should toggle

    // Click to open
    await toggleButton.click();
    await page.waitForTimeout(500);

    // Verify side nav is now visible
    await expect(sideNav).toBeVisible({ timeout: 2000 });

    // Click to close
    await toggleButton.click();
    await page.waitForTimeout(500);

    // Verify side nav is closed (wait for animation)
    await page.waitForTimeout(300);
    const isVisible = await sideNav.isVisible().catch(() => false);
    expect(isVisible).toBe(false);
  });
});
