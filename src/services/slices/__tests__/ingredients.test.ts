jest.mock('@api', () => {
  const originalModule = jest.requireActual('@api');

  return {
    __esModule: true,
    ...originalModule,
    getIngredientsApi: jest.fn()
  };
});

import { fetchIngredients } from '@slices/ingredients';
import store, { rootReducer } from '@store';
import { TIngredient } from '@utils-types';
import * as api from '@api';
import { configureStore } from '@reduxjs/toolkit';

const mockIngredients: TIngredient[] = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0942',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0948',
    name: 'Кристаллы марсианских альфа-сахаридов',
    type: 'main',
    proteins: 234,
    fat: 432,
    carbohydrates: 111,
    calories: 189,
    price: 762,
    image: 'https://code.s3.yandex.net/react/code/core.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/core-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/core-large.png'
  }
];

describe('Редюсер ingredients', () => {
  beforeEach(() => {
    store.replaceReducer(rootReducer);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  // test('pending: isLoading значение true, error значение сбрасывается', async () => {
  //   const getIngredientsSpy = jest.spyOn(
  //     api,
  //     'getIngredientsApi'
  //   ) as jest.MockedFunction<any>;
  //   const hangingPromise = new Promise<TIngredient[]>(() => {});
  //   getIngredientsSpy.mockReturnValue(hangingPromise);

  //   const pendingActionPromise = store.dispatch(fetchIngredients());
  //   const state = store.getState().ingredients;

  //   expect(state.isLoading).toBe(true);
  //   expect(state.error).toBeNull();
  //   expect(state.ingredients).toEqual([]);

  //   expect(getIngredientsSpy).toHaveBeenCalledTimes(1);
  //   pendingActionPromise.catch(() => {});
  // });

  test('fulfilled: ingredints записывает данные, isLoading значеение false', async () => {
    const getIngredientsSpy = jest
      .spyOn(api, 'getIngredientsApi')
      .mockResolvedValue(mockIngredients);

    await store.dispatch(fetchIngredients());
    const state = store.getState().ingredients;

    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.ingredients).toEqual(mockIngredients);
    expect(getIngredientsSpy).toHaveBeenCalledTimes(1);
  });

  test('rejected: error записывает ошибку, isLoading значение false', async () => {
    const getIngredientsSpy = jest
      .spyOn(api, 'getIngredientsApi')
      .mockRejectedValue(new Error('Тестовая ошибка'));

    await store.dispatch(fetchIngredients());
    const state = store.getState().ingredients;

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Тестовая ошибка');
    expect(state.ingredients).toEqual([]);
    expect(getIngredientsSpy).toHaveBeenCalledTimes(1);
  });
});
