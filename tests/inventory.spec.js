const { test, expect } = require('@playwright/test');

test.describe.configure({ mode: 'serial' });

test.describe('Inventory Management App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/login.html');
    await page.fill('#username', 'admin');
    await page.fill('#password', 'password');
    await page.click('#submit-btn');
    await expect(page).toHaveURL(/index.html/);
  });

  test('should display initial items', async ({ page }) => {
    const rows = page.locator('#inventory-tbody tr');
    // Multiple tests might have added items if they share the same server instance
    const count = await rows.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('should add a new item', async ({ page }) => {
    const initialRows = page.locator('#inventory-tbody tr');
    const initialCount = await initialRows.count();

    await page.fill('#name', 'Playwright Item');
    await page.fill('#quantity', '20');
    await page.fill('#sku', 'SKU-PW');
    await page.click('#submit-btn');

    const rows = page.locator('#inventory-tbody tr');
    await expect(rows).toHaveCount(initialCount + 1);
    await expect(page.locator('#inventory-tbody')).toContainText('Playwright Item');
  });

  test('should edit an item', async ({ page }) => {
    const editBtn = page.locator('button.edit-btn').first();
    await editBtn.click();

    await page.fill('#name', 'Updated First Item');
    await page.fill('#quantity', '55');
    await page.click('#submit-btn');

    const rows = page.locator('#inventory-tbody tr');
    await expect(rows.first()).toContainText('Updated First Item');
    await expect(rows.first()).toContainText('55');
  });

  test('should delete an item', async ({ page }) => {
    page.on('dialog', async dialog => {
        await dialog.accept();
    });

    const rows = page.locator('#inventory-tbody tr');
    const initialCount = await rows.count();

    const deleteBtn = page.locator('button.delete-btn').first();
    await deleteBtn.click();

    await expect(page.locator('#inventory-tbody tr')).toHaveCount(initialCount - 1);
  });
});
