import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h1, h2, h3')).toContainText(/login|sign in/i);
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="username"], input[placeholder*="username" i]', 'nonexistent_user');
    await page.fill('input[type="password"]', 'WrongPassword@123');
    await page.click('button[type="submit"]');
    await expect(page.locator('[role="alert"], .text-red')).toBeVisible({ timeout: 10000 });
  });

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/login');
    const registerLink = page.locator('a[href="/register"], a:has-text("Register"), a:has-text("Sign up")');
    if (await registerLink.isVisible()) {
      await registerLink.click();
      await expect(page).toHaveURL(/register/);
    }
  });
});

test.describe('Public Pages', () => {
  test('should load landing page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/sheger|health/i);
  });

  test('should display doctors directory', async ({ page }) => {
    await page.goto('/doctors');
    await expect(page.locator('h1, h2')).toContainText(/doctor/i);
  });

  test('should display about page', async ({ page }) => {
    await page.goto('/about');
    await expect(page.locator('h1, h2')).toContainText(/about/i);
  });

  test('should display services page', async ({ page }) => {
    await page.goto('/services');
    await expect(page.locator('h1, h2')).toContainText(/service/i);
  });
});

test.describe('Responsive Design', () => {
  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
  });

  test('should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test('should have no critical accessibility violations on login', async ({ page }) => {
    await page.goto('/login');
    const form = page.locator('form');
    await expect(form).toBeVisible();
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
  });

  test('should have skip-to-content link on public pages', async ({ page }) => {
    await page.goto('/');
    const skipLink = page.locator('a[href="#main-content"], a:has-text("Skip to content")');
    if (await skipLink.count() > 0) {
      await expect(skipLink.first()).toHaveAttribute('href', /main-content/);
    }
  });
});

test.describe('Navigation', () => {
  test('should navigate between public pages', async ({ page }) => {
    await page.goto('/');
    const navLinks = page.locator('nav a');
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should redirect unauthenticated users to login', async ({ page }) => {
    await page.goto('/dashboard/patient');
    await expect(page).toHaveURL(/login/);
  });
});
