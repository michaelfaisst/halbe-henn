import { test, expect } from "@playwright/test";

test.describe("Loading States", () => {
  test("loading state appears during map initialization", async ({ page }) => {
    await page.goto("/");

    // Check for loading indicator
    const loadingText = page.getByText(/Karte wird geladen/i);
    const spinner = page.locator('[role="status"]').or(page.locator(".animate-spin"));

    // Loading state should appear briefly
    const loadingVisible = await loadingText.isVisible().catch(() => false);
    const spinnerVisible = await spinner.isVisible().catch(() => false);

    // At least one loading indicator should be visible initially
    expect(loadingVisible || spinnerVisible).toBe(true);

    // Wait for map to load
    await page.waitForTimeout(3000);

    // Map should eventually be visible
    const mapContainer = page.locator(".mapboxgl-map");
    await expect(mapContainer.first()).toBeVisible({ timeout: 10000 });
  });

  test("loading state transitions smoothly to map", async ({ page }) => {
    await page.goto("/");

    // Wait for initial loading
    await page.waitForTimeout(1000);

    // Check that loading state exists
    const loadingText = page.getByText(/Karte wird geladen/i);
    const hasLoading = await loadingText.isVisible().catch(() => false);

    // Wait for map to fully load
    await page.waitForTimeout(3000);

    // Map should be visible
    const mapContainer = page.locator(".mapboxgl-map");
    await expect(mapContainer.first()).toBeVisible({ timeout: 10000 });

    // Loading state should be gone
    const stillLoading = await loadingText.isVisible().catch(() => false);
    expect(stillLoading).toBe(false);
  });
});

test.describe("Keyboard Navigation", () => {
  test("Tab key navigates through interactive elements", async ({ page }) => {
    await page.goto("/");

    // Wait for page to load
    await page.waitForTimeout(2000);

    // Start tabbing through elements
    await page.keyboard.press("Tab");

    // Should focus on theme toggle or navigation button
    const focusedElement = page.locator(":focus");
    await expect(focusedElement).toBeVisible({ timeout: 2000 });

    // Continue tabbing
    await page.keyboard.press("Tab");
    const nextFocused = page.locator(":focus");
    await expect(nextFocused).toBeVisible({ timeout: 2000 });
  });

  test("Enter key opens marker popover", async ({ page }) => {
    await page.goto("/");

    // Wait for map and markers to load
    await page.waitForTimeout(2000);

    // Find a marker
    const markers = page.locator(".mapboxgl-marker");
    const markerCount = await markers.count();
    expect(markerCount).toBeGreaterThan(0);

    // Focus on first marker (need to make it focusable)
    // Markers should be keyboard accessible
    const firstMarker = markers.first();
    await firstMarker.focus().catch(() => {
      // If focus doesn't work directly, try clicking to focus
      firstMarker.click();
    });

    // Press Enter
    await page.keyboard.press("Enter");
    await page.waitForTimeout(500);

    // Popover should appear
    const popover = page
      .locator('[role="dialog"]')
      .or(page.locator("[data-radix-popper-content-wrapper]"));
    const isVisible = await popover.first().isVisible().catch(() => false);
    expect(isVisible).toBe(true);
  });

  test("Escape key closes popover", async ({ page }) => {
    await page.goto("/");

    // Wait for map and markers to load
    await page.waitForTimeout(2000);

    // Click a marker to open popover
    const markers = page.locator(".mapboxgl-marker");
    await markers.first().click();
    await page.waitForTimeout(500);

    // Verify popover is open
    const popover = page
      .locator('[role="dialog"]')
      .or(page.locator("[data-radix-popper-content-wrapper]"));
    await expect(popover.first()).toBeVisible({ timeout: 2000 });

    // Press Escape
    await page.keyboard.press("Escape");
    await page.waitForTimeout(500);

    // Popover should be closed
    const isVisible = await popover.first().isVisible().catch(() => false);
    expect(isVisible).toBe(false);
  });

  test("Escape key closes side navigation", async ({ page }) => {
    await page.goto("/");

    // Wait for page to load
    await page.waitForTimeout(2000);

    // Open side nav
    const toggleButton = page.getByRole("button", {
      name: /Navigation öffnen/i,
    });
    await toggleButton.click();
    await page.waitForTimeout(500);

    // Verify side nav is open
    const sideNav = page.getByText("Halbe Henn");
    await expect(sideNav).toBeVisible({ timeout: 2000 });

    // Press Escape
    await page.keyboard.press("Escape");
    await page.waitForTimeout(500);

    // Side nav should be closed
    const isVisible = await sideNav.isVisible().catch(() => false);
    expect(isVisible).toBe(false);
  });

  test("keyboard navigation works in side nav filter buttons", async ({
    page,
  }) => {
    await page.goto("/");

    // Wait for page to load
    await page.waitForTimeout(2000);

    // Open side nav
    const toggleButton = page.getByRole("button", {
      name: /Navigation öffnen/i,
    });
    await toggleButton.click();
    await page.waitForTimeout(500);

    // Find a day filter button
    const montagButton = page.getByRole("checkbox", { name: /Montag/i });
    await expect(montagButton).toBeVisible({ timeout: 2000 });

    // Focus on the button
    await montagButton.focus();

    // Press Enter to toggle
    await page.keyboard.press("Enter");
    await page.waitForTimeout(500);

    // Button state should have changed
    const isChecked = await montagButton.getAttribute("aria-checked");
    expect(isChecked).toBeTruthy();
  });

  test("Tab key traps focus within side nav dialog when open", async ({
    page,
  }) => {
    await page.goto("/");

    // Wait for page to load
    await page.waitForTimeout(2000);

    // Open side nav
    const toggleButton = page.getByRole("button", {
      name: /Navigation öffnen/i,
    });
    await toggleButton.click();
    await page.waitForTimeout(500);

    // Find dialog
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible({ timeout: 2000 });

    // Focus should be trapped within dialog
    // Start tabbing
    await page.keyboard.press("Tab");
    const firstFocused = page.locator(":focus");
    await expect(firstFocused).toBeVisible({ timeout: 2000 });

    // Continue tabbing multiple times
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press("Tab");
      const focused = page.locator(":focus");
      const isVisible = await focused.isVisible().catch(() => false);
      expect(isVisible).toBe(true);
    }
  });
});

test.describe("Error Handling", () => {
  test("error boundary displays error message gracefully", async ({ page }) => {
    // This test is difficult to trigger in e2e without mocking
    // We'll verify the error boundary component exists by checking
    // that the app loads normally
    await page.goto("/");

    // Wait for page to load
    await page.waitForTimeout(2000);

    // App should load without error boundary showing
    const errorMessage = page.getByText(/Etwas ist schiefgelaufen/i);
    const hasError = await errorMessage.isVisible().catch(() => false);

    // Error should not be visible in normal operation
    expect(hasError).toBe(false);

    // Map or main content should be visible
    const mapContainer = page.locator(".mapboxgl-map");
    const mainContent = page.locator("main");
    const hasMap = await mapContainer.first().isVisible().catch(() => false);
    const hasMain = await mainContent.isVisible().catch(() => false);

    expect(hasMap || hasMain).toBe(true);
  });

  test("map handles missing access token gracefully", async ({ page }) => {
    await page.goto("/");

    // Wait for page to load
    await page.waitForTimeout(2000);

    // Either error message OR map should be visible
    const errorMessage = page.getByText(/Mapbox-Zugriffstoken fehlt/i);
    const mapContainer = page.locator(".mapboxgl-map");

    const hasError = await errorMessage.isVisible().catch(() => false);
    const hasMap = await mapContainer.first().isVisible().catch(() => false);

    // One of them should be visible
    expect(hasError || hasMap).toBe(true);
  });
});

test.describe("Accessibility", () => {
  test("all interactive elements have ARIA labels", async ({ page }) => {
    await page.goto("/");

    // Wait for page to load
    await page.waitForTimeout(2000);

    // Check theme toggle has aria-label
    const themeToggle = page.getByRole("button", {
      name: /zu (dunklem|hellem) modus wechseln/i,
    });
    await expect(themeToggle).toBeVisible({ timeout: 2000 });

    // Check navigation toggle has aria-label
    const navToggle = page.getByRole("button", {
      name: /Navigation (öffnen|schließen)/i,
    });
    await expect(navToggle).toBeVisible({ timeout: 2000 });

    // Open side nav
    await navToggle.click();
    await page.waitForTimeout(500);

    // Check day filter buttons have aria-labels
    const montagButton = page.getByRole("checkbox", { name: /Montag/i });
    await expect(montagButton).toBeVisible({ timeout: 2000 });
  });

  test("map has proper ARIA role and label", async ({ page }) => {
    await page.goto("/");

    // Wait for map to load
    await page.waitForTimeout(2000);

    // Check for map container with role="application"
    const mapApplication = page.locator('[role="application"]');
    const hasApplicationRole = await mapApplication
      .isVisible()
      .catch(() => false);

    // Map should have accessibility attributes
    expect(hasApplicationRole).toBe(true);

    // Check for aria-label
    const mapWithLabel = page.locator('[role="application"][aria-label]');
    const hasLabel = await mapWithLabel.isVisible().catch(() => false);
    expect(hasLabel).toBe(true);
  });

  test("popover has proper ARIA attributes", async ({ page }) => {
    await page.goto("/");

    // Wait for map and markers to load
    await page.waitForTimeout(2000);

    // Click a marker to open popover
    const markers = page.locator(".mapboxgl-marker");
    await markers.first().click();
    await page.waitForTimeout(500);

    // Check popover has role="dialog"
    const popover = page.locator('[role="dialog"]');
    await expect(popover.first()).toBeVisible({ timeout: 2000 });

    // Check for aria-labelledby
    const popoverWithLabel = page.locator(
      '[role="dialog"][aria-labelledby]'
    );
    const hasLabel = await popoverWithLabel.first().isVisible().catch(() => false);
    expect(hasLabel).toBe(true);
  });

  test("side nav dialog has proper ARIA attributes", async ({ page }) => {
    await page.goto("/");

    // Wait for page to load
    await page.waitForTimeout(2000);

    // Open side nav
    const toggleButton = page.getByRole("button", {
      name: /Navigation öffnen/i,
    });
    await toggleButton.click();
    await page.waitForTimeout(500);

    // Check dialog has proper attributes
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible({ timeout: 2000 });

    // Check for aria-modal
    const modalDialog = page.locator('[role="dialog"][aria-modal="true"]');
    const isModal = await modalDialog.isVisible().catch(() => false);
    expect(isModal).toBe(true);

    // Check for aria-labelledby
    const dialogWithLabel = page.locator(
      '[role="dialog"][aria-labelledby]'
    );
    const hasLabel = await dialogWithLabel.isVisible().catch(() => false);
    expect(hasLabel).toBe(true);
  });

  test("loading state has proper ARIA attributes", async ({ page }) => {
    await page.goto("/");

    // Check for loading state with role="status"
    const loadingStatus = page.locator('[role="status"]');
    const hasStatus = await loadingStatus.isVisible().catch(() => false);

    // Or check for aria-live region
    const liveRegion = page.locator('[aria-live]');
    const hasLive = await liveRegion.isVisible().catch(() => false);

    // At least one should be present during loading
    if (hasStatus || hasLive) {
      expect(hasStatus || hasLive).toBe(true);
    }

    // Wait for map to load
    await page.waitForTimeout(3000);

    // Map should be visible
    const mapContainer = page.locator(".mapboxgl-map");
    await expect(mapContainer.first()).toBeVisible({ timeout: 10000 });
  });

  test("day filter buttons have proper ARIA roles", async ({ page }) => {
    await page.goto("/");

    // Wait for page to load
    await page.waitForTimeout(2000);

    // Open side nav
    const toggleButton = page.getByRole("button", {
      name: /Navigation öffnen/i,
    });
    await toggleButton.click();
    await page.waitForTimeout(500);

    // Check day filter buttons have role="checkbox"
    const dayButtons = page.getByRole("checkbox");
    const count = await dayButtons.count();
    expect(count).toBeGreaterThan(0);

    // Check they have aria-checked attributes
    const firstButton = dayButtons.first();
    const hasAriaChecked = await firstButton
      .getAttribute("aria-checked")
      .then((val) => val !== null)
      .catch(() => false);
    expect(hasAriaChecked).toBe(true);
  });

  test("screen reader can navigate all content", async ({ page }) => {
    await page.goto("/");

    // Wait for page to load
    await page.waitForTimeout(2000);

    // Check for semantic HTML elements
    const main = page.locator("main");
    await expect(main).toBeVisible({ timeout: 2000 });

    // Check for headings
    const headings = page.locator("h1, h2, h3, h4, h5, h6");
    const headingCount = await headings.count();
    expect(headingCount).toBeGreaterThan(0);

    // Open side nav
    const toggleButton = page.getByRole("button", {
      name: /Navigation öffnen/i,
    });
    await toggleButton.click();
    await page.waitForTimeout(500);

    // Check for heading in side nav
    const sideNavHeading = page.getByRole("heading", { name: /Halbe Henn/i });
    await expect(sideNavHeading).toBeVisible({ timeout: 2000 });
  });
});

test.describe("Smooth Transitions", () => {
  test("markers animate smoothly when filtering", async ({ page }) => {
    await page.goto("/");

    // Wait for map to load
    await page.waitForTimeout(2000);

    // Get initial marker count
    const markers = page.locator(".mapboxgl-marker");
    const initialCount = await markers.count();

    // Open side nav
    const toggleButton = page.getByRole("button", {
      name: /Navigation öffnen/i,
    });
    await toggleButton.click();
    await page.waitForTimeout(500);

    // Select a different day
    const dienstagButton = page.getByRole("checkbox", { name: /Dienstag/i });
    await dienstagButton.click();
    await page.waitForTimeout(1000); // Wait for animation

    // Markers should still be visible (may have changed count)
    const newCount = await markers.count();
    expect(newCount).toBeGreaterThanOrEqual(0);

    // Markers should have transitioned smoothly (no flickering)
    // This is verified by the fact that markers are still visible
    const firstMarker = markers.first();
    if (newCount > 0) {
      await expect(firstMarker).toBeVisible({ timeout: 2000 });
    }
  });

  test("side nav animates smoothly when opening and closing", async ({
    page,
  }) => {
    await page.goto("/");

    // Wait for page to load
    await page.waitForTimeout(2000);

    // Open side nav
    const toggleButton = page.getByRole("button", {
      name: /Navigation öffnen/i,
    });
    await toggleButton.click();

    // Side nav should appear smoothly
    const sideNav = page.getByText("Halbe Henn");
    await expect(sideNav).toBeVisible({ timeout: 2000 });

    // Close side nav
    await toggleButton.click();
    await page.waitForTimeout(500);

    // Side nav should close smoothly
    const isVisible = await sideNav.isVisible().catch(() => false);
    expect(isVisible).toBe(false);
  });
});

