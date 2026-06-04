jest.mock('@api', () => {
  const originalModule = jest.requireActual('@api');

  return {
    __esModule: true,
    ...originalModule,
    getOrdersApi: jest.fn()
  };
});

import * as api from '@api';
import { fetchOrders, resetOrders } from '@slices/orders';
import store from '@store';
import { TOrder } from '@utils-types';

const mockOrders: TOrder[] = [
  {
    _id: '6a1fd67e6a172d001b98b999',
    ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa093c'],
    status: 'done',
    name: 'Краторный бургер',
    createdAt: '2026-06-03T07:23:42.099Z',
    updatedAt: '2026-06-03T07:23:42.167Z',
    number: 106059
  },
  {
    _id: '6a1fd0a36a172d001b98b98f',
    ingredients: [
      '643d69a5c3f7b9001cfa093c',
      '643d69a5c3f7b9001cfa093e',
      '643d69a5c3f7b9001cfa093c'
    ],
    status: 'done',
    name: 'Люминесцентный краторный бургер',
    createdAt: '2026-06-03T06:58:43.506Z',
    updatedAt: '2026-06-03T06:58:43.568Z',
    number: 106058
  },
  {
    _id: '6a1fced56a172d001b98b98c',
    ingredients: [
      '643d69a5c3f7b9001cfa093c',
      '643d69a5c3f7b9001cfa0941',
      '643d69a5c3f7b9001cfa093c'
    ],
    status: 'done',
    name: 'Био-марсианский краторный бургер',
    createdAt: '2026-06-03T06:51:01.226Z',
    updatedAt: '2026-06-03T06:51:01.290Z',
    number: 106057
  }
];

describe('Редюсер orders', () => {
  afterEach(() => {
    jest.clearAllMocks();
    store.dispatch(resetOrders());
  });

  test('pending: isLoading значение true, error значение сбрасывается', async () => {
    store.dispatch(
      fetchOrders.rejected(
        new Error('Ошибка предыдещео запроса'),
        'fake-request-id'
      )
    );
    expect(store.getState().orders.error).toBe('Ошибка предыдещео запроса');
    expect(store.getState().orders.isLoading).toBe(false);

    const getFeedsSpy = jest.spyOn(
      api,
      'getOrdersApi'
    ) as jest.MockedFunction<any>;
    const hangingPromise = new Promise<TOrder[]>(() => {});
    getFeedsSpy.mockReturnValue(hangingPromise);

    const pendingActionPromise = store.dispatch(fetchOrders());
    const state = store.getState().orders;

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.orders).toBeNull();

    expect(getFeedsSpy).toHaveBeenCalledTimes(1);
    pendingActionPromise.catch(() => {});
  });

  test('fulfilled: orders записывает данные, isLoading значеение false', async () => {
    const getFeedsSpy = jest
      .spyOn(api, 'getOrdersApi')
      .mockResolvedValue(mockOrders);

    await store.dispatch(fetchOrders());
    const state = store.getState().orders;

    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.orders).toEqual(mockOrders);
    expect(getFeedsSpy).toHaveBeenCalledTimes(1);
  });

  test('rejected: error записывает ошибку, isLoading значение false', async () => {
    const getFeedsSpy = jest
      .spyOn(api, 'getOrdersApi')
      .mockRejectedValue(new Error('Тестовая ошибка'));

    await store.dispatch(fetchOrders());
    const state = store.getState().orders;

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Тестовая ошибка');
    expect(state.orders).toBeNull();
    expect(getFeedsSpy).toHaveBeenCalledTimes(1);
  });
});
