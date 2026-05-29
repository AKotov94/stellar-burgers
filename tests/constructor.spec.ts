/// <reference types="node" />

import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

function getOrderMockDataFromHAR(): { number: string; body: string } {
  const harPath = path.join(__dirname, 'hars/orders.har');
  const har = JSON.parse(fs.readFileSync(harPath, 'utf-8'));

  const entry = har.log.entries.find(
    (e: any) => e.request.method === 'POST' && e.response.status === 200
  );

  const body = entry.response.content._file
    ? fs.readFileSync(
        path.join(path.dirname(harPath), entry.response.content._file),
        'utf-8'
      )
    : entry.response.content.text;

  const json = JSON.parse(body);

  return {
    number: String(json.order.number),
    body: body
  };
}

const { number: EXPECTED_ORDER_NUMBER, body: ORDER_MOCK_BODY } =
  getOrderMockDataFromHAR();

test.describe('Интеграционное тестирование конструктора бургеров', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.addInitScript(() => {
      localStorage.setItem('refreshToken', 'fake-refresh-token');
    });
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'Bearer fake-access-token',
        domain: 'localhost',
        path: '/'
      }
    ]);

    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: 'https://norma.education-services.ru/api/ingredients',
      update: false
    });
    await page.routeFromHAR('tests/hars/orders.har', {
      url: 'https://norma.education-services.ru/api/auth/user',
      update: false
    });

    await page.route(
      'https://norma.education-services.ru/api/orders',
      async (route) => {
        const headers = route.request().headers();
        const auth = headers.authorization;
        if (auth && auth !== 'undefined') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: ORDER_MOCK_BODY
          });
        } else {
          await route.fulfill({
            status: 401,
            body: JSON.stringify({ success: false, message: 'Unauthorized' })
          });
        }
      }
    );

    await page.goto('/');
    await page
      .getByTestId('preloader')
      .waitFor({ state: 'hidden', timeout: 10000 });
    await expect(page.getByTestId('ingredient-card').first()).toBeVisible();
  });

  test.afterEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.evaluate(() => localStorage.clear());
  });

  test.describe('Добавление ингрединетов', () => {
    const bunName = 'Краторная булка N-200i';
    const ingredientName = 'Биокотлета из марсианской Магнолии';
    test('Добавление булки в конструктор', async ({ page }) => {
      await page
        .getByTestId('ingredient-card')
        .filter({ hasText: bunName })
        .getByRole('button', { name: 'Добавить' })
        .click();
      await expect(page.getByTestId('constructor-bun-top')).toContainText(
        bunName
      );
      await expect(page.getByTestId('constructor-bun-bottom')).toContainText(
        bunName
      );
    });

    test('Добавление начинки в конструктор', async ({ page }) => {
      await page
        .getByTestId('ingredient-card')
        .filter({ hasText: ingredientName })
        .getByRole('button', { name: 'Добавить' })
        .click();
      await expect(
        page.getByTestId('constructor-ingredients-ul')
      ).toContainText(ingredientName);
    });
  });

  test.describe('Модальные окна', () => {
    const ingredientName = 'Хрустящие минеральные кольца';
    test.describe('Открытие/закрытие модального окна', () => {
      test('Открытие модального окна, закрытие по кнопке', async ({ page }) => {
        await page
          .getByTestId('ingredient-card')
          .filter({ hasText: ingredientName })
          .getByRole('link')
          .click();
        await expect(page.getByTestId('modal')).toBeVisible();

        await page.getByTestId('modal-close-button').click();
        await expect(page.getByTestId('modal')).toBeHidden();
      });

      test('Открытие модального окна, закрытие по внешней области', async ({
        page
      }) => {
        await page
          .getByTestId('ingredient-card')
          .filter({ hasText: ingredientName })
          .getByRole('link')
          .click();
        await expect(page.getByTestId('modal')).toBeVisible();

        await page
          .getByTestId('modal-overlay')
          .click({ position: { x: 10, y: 10 } });
        await expect(page.getByTestId('modal')).toBeHidden();
      });
    });

    test('Отображение в модальном окне выбранного ингредиента', async ({
      page
    }) => {
      await page
        .getByTestId('ingredient-card')
        .filter({ hasText: ingredientName })
        .getByRole('link')
        .click();

      const modal = page.getByTestId('modal');
      await expect(modal.getByTestId('modal-content')).toBeVisible();
      await expect(modal.getByTestId('ingredient-title')).toHaveText(
        ingredientName
      );
    });
  });

  test.describe('Оформление заказа', () => {
    const burger = [
      'Краторная булка N-200i',
      'Биокотлета из марсианской Магнолии',
      'Хрустящие минеральные кольца'
    ];

    test('Сборка бургера и создание заказа', async ({ page }) => {
      for (const ingredient of burger) {
        await page
          .getByTestId('ingredient-card')
          .filter({ hasText: ingredient })
          .getByRole('button', { name: 'Добавить' })
          .click();
      }

      await page.getByRole('button', { name: 'Оформить заказ' }).click();

      const orderModal = page.getByTestId('modal');
      await expect(orderModal).toBeVisible();

      await page.waitForTimeout(1000);

      await expect(orderModal.getByTestId('order-success')).toHaveText(
        'Ваш заказ начали готовить'
      );
      await expect(orderModal.getByTestId('order-number')).toHaveText(
        EXPECTED_ORDER_NUMBER
      );

      await page.getByTestId('modal-close-button').click();
      await expect(page.getByTestId('empty-constructor-bun-top')).toContainText(
        'Выберите булки'
      );
      await expect(
        page.getByTestId('empty-constructor-bun-bottom')
      ).toContainText('Выберите булки');
      await expect(
        page.getByTestId('empty-constructor-ingredient')
      ).toContainText('Выберите начинку');
    });
  });
});
