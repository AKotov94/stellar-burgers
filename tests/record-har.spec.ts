import { test } from '@playwright/test';

test('Ручная запись нужных эндпоинтов', async ({ page }) => {
  await page.routeFromHAR('tests/hars/ingredients.har', {
    url: /api\/ingredients/,
    update: true
  });
  await page.routeFromHAR('tests/hars/orders.har', {
    url: /\/(auth\/user|orders)/,
    update: true
  });
  await page.goto('/');
  await page.pause();
  await page.reload();
  await page.waitForResponse(/\/auth\/user/);
});
