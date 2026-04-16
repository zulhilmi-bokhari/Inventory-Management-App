const { test, expect } = require('@playwright/test');

test.describe.configure({ mode: 'serial' });

test.describe('Inventory Management App', () => {
  test.beforeAll(async () => {
      // Server is assumed to be running
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('should display initial items', async ({ page }) => {
    const rows = page.locator('#inventory-tbody tr');
    await expect(rows).toHaveCount(2);
    await expect(rows.first()).toContainText('Item A');
  });

  test('should add a new item', async ({ page }) => {
    await page.fill('#name', 'Playwright Item');
    await page.fill('#quantity', '20');
    await page.fill('#price', '15.99');
    await page.click('#submit-btn');

    const rows = page.locator('#inventory-tbody tr');
    await expect(rows).toHaveCount(3);
    await expect(page.locator('#inventory-tbody')).toContainText('Playwright Item');
  });

  test('should edit an item', async ({ page }) => {
    // Edit the second item (ID 2: Item B)
    const editBtn = page.locator('button.edit-btn').nth(1);
    await editBtn.click();

    await page.fill('#name', 'Updated Item B');
    await page.fill('#quantity', '50');
    await page.click('#submit-btn');

    const rows = page.locator('#inventory-tbody tr');
    await expect(rows.nth(1)).toContainText('Updated Item B');
    await expect(rows.nth(1)).toContainText('50');
  });

  test('should delete an item', async ({ page }) => {
    page.on('dialog', async dialog => {
        await dialog.accept();
    });

    // Initial count might be 3 if "add" ran before
    const initialCount = await page.locator('#inventory-tbody tr').count();

    const deleteBtn = page.locator('button.delete-btn').first();
    await deleteBtn.click();

    await expect(page.locator('#inventory-tbody tr')).toHaveCount(initialCount - 1);
  });
});
