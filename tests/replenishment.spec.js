const { test, expect } = require('@playwright/test');

test.describe.configure({ mode: 'serial' });

test.describe('Inventory and Replenishment', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/login.html');
    await page.fill('#username', 'admin');
    await page.fill('#password', 'password');
    await page.click('#submit-btn');
    await expect(page).toHaveURL(/index.html/);
  });

  test('should handle Person in Charge when adding item', async ({ page }) => {
    await page.fill('#name', 'Charlie Item');
    await page.fill('#quantity', '10');
    await page.fill('#sku', 'SKU-C');
    await page.fill('#personInCharge', 'Charlie');
    await page.click('#submit-btn');

    const row = page.locator('#inventory-tbody tr').last();
    await expect(row).toContainText('Charlie');
  });

  test('should perform replenishment and show in summary', async ({ page }) => {
    // 1. Add an item
    await page.fill('#name', 'Store Room Item');
    await page.fill('#quantity', '10');
    await page.fill('#sku', 'SKU-SR');
    await page.fill('#personInCharge', 'Dave');
    await page.click('#submit-btn');

    // 2. Replenish it
    page.on('dialog', async dialog => {
      if (dialog.message().includes('quantity to add')) {
        await dialog.accept('25');
      } else if (dialog.message().includes('responsible')) {
        await dialog.accept('Dave');
      } else {
        await dialog.accept(); // alert
      }
    });

    const replenishBtn = page.locator('button.replenish-btn').last();
    await replenishBtn.click();

    // Verify quantity updated in list
    const row = page.locator('#inventory-tbody tr').last();
    await expect(row).toContainText('35'); // 10 + 25

    // 3. Go to summary page
    await page.click('a[href="summary.html"]');
    await expect(page).toHaveURL(/summary.html/);

    // 4. Verify summary table
    const summaryRow = page.locator('#summary-tbody tr').last();
    await expect(summaryRow).toContainText('Dave');
    await expect(summaryRow).toContainText('25');
    await expect(summaryRow).toContainText('Store Room Item');
  });
});
