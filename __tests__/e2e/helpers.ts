import { expect, type Page } from "@playwright/test";

export const navToggleButton = (page: Page) =>
  page.getByRole("button", {
    name: /Navigation öffnen|Navigation schließen/i,
  });

export const sideNavDialog = (page: Page) => page.locator("#side-nav-dialog");

export const sideNavHeading = (page: Page) => page.locator("#side-nav-title");

export const sideNavCloseButton = (page: Page) =>
  page.locator('button[aria-label="Schließen"]');

export const markersLocator = (page: Page) =>
  page.locator('[data-testid="marker"]').or(page.locator(".mapboxgl-marker"));

export const getDayCheckbox = (page: Page, dayLabel: string) =>
  page.getByRole("checkbox", { name: new RegExp(dayLabel, "i") });

export const openSideNav = async (page: Page) => {
  const dialog = sideNavDialog(page);
  if ((await dialog.count()) > 0) {
    return dialog;
  }
  await expect(navToggleButton(page)).toBeVisible({ timeout: 2000 });
  await navToggleButton(page).click();
  await expect(dialog).toBeVisible({ timeout: 2000 });
  return dialog;
};

export const closeSideNav = async (page: Page) => {
  const dialog = sideNavDialog(page);
  if ((await dialog.count()) === 0) {
    return;
  }
  const closeButton = sideNavCloseButton(page);
  if ((await closeButton.count()) > 0) {
    await closeButton.click();
  } else {
    await navToggleButton(page).click();
  }
  await expect(dialog).toHaveCount(0);
};

export const ensureDaySelected = async (
  page: Page,
  dayLabel = "Montag"
): Promise<void> => {
  await openSideNav(page);
  const dayCheckbox = getDayCheckbox(page, dayLabel);
  await expect(dayCheckbox).toBeVisible({ timeout: 2000 });
  const isChecked = (await dayCheckbox.getAttribute("aria-checked")) === "true";
  if (!isChecked) {
    await dayCheckbox.click();
    await expect(dayCheckbox).toHaveAttribute("aria-checked", "true");
  }
  await closeSideNav(page);
};

export const ensureMarkersVisible = async (page: Page) => {
  const markers = markersLocator(page);
  await expect(markers.first()).toBeVisible({ timeout: 10000 });
  return markers;
};
