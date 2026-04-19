const { test, expect } = require('@playwright/test');

test.describe.configure({ mode: 'serial' });

test.describe('Login and SKU Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/login.html');
  });

  test('should login successfully and manage items with SKU', async ({ page }) => {
    // 1. Login
    await page.fill('#username', 'admin');
    await page.fill('#password', 'password');
    await page.click('#submit-btn');

    await expect(page).toHaveURL(/index.html/);
    await expect(page.locator('#display-name')).toContainText('System Admin');

    // 2. Add an item with SKU
    await page.fill('#name', 'SKU Item');
    await page.fill('#quantity', '50');
    await page.fill('#sku', 'TEST-SKU-123');
    await page.click('#submit-btn');

    const row = page.locator('#inventory-tbody tr').last();
    await expect(row).toContainText('TEST-SKU-123');
    await expect(row).not.toContainText('$'); // Price should be gone

    // 3. Replenish
    page.on('dialog', async dialog => {
      if (dialog.message().includes('quantity to add')) {
        await dialog.accept('10');
      } else if (dialog.message().includes('responsible')) {
        await dialog.accept('System Admin');
      } else {
        await dialog.accept(); // alert
      }
    });

    const replenishBtn = page.locator('button.replenish-btn').last();
    await replenishBtn.click();

    await expect(row).toContainText('60');

    // 4. Logout
    await page.click('#logout-btn');
    await expect(page).toHaveURL(/login.html/);
  });

  test('should redirect to login if not authenticated', async ({ page }) => {
    await page.goto('http://localhost:3000/index.html');
    await expect(page).toHaveURL(/login.html/);
  });
});
