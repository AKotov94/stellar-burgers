import { test } from '@playwright/test';

test('Ручная запись нужных эндпоинтов', async ({ page }) => {
  await page.routeFromHAR('tests/hars/ingredients.har', {
    url: /api\/ingredients/,
    update: false
  });
  await page.routeFromHAR('tests/hars/orders.har', {
    url: /\/(auth\/user|orders)/,
    update: false
  });
  await page.goto('/');
  await page.pause();
  await page.reload();
  await page.waitForResponse(/\/auth\/user/);
});
