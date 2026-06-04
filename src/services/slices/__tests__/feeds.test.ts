jest.mock('@api', () => {
  const originalModule = jest.requireActual('@api');

  return {
    __esModule: true,
    ...originalModule,
    getFeedsApi: jest.fn()
  };
});

import * as api from '@api';
import { fetchFeeds, resetFeeds } from '@slices/feeds';
import store from '@store';
import { TOrdersData } from '@utils-types';

const mockFeeds: TOrdersData = {
  orders: [
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
  ],
  total: 6682,
  totalToday: 3
};

describe('Редюсер feeds', () => {
  afterEach(() => {
    jest.clearAllMocks();
    store.dispatch(resetFeeds());
  });

  test('pending: isLoading значение true, error значение сбрасывается', async () => {
    store.dispatch(
      fetchFeeds.rejected(
        new Error('Ошибка предыдещео запроса'),
        'fake-request-id'
      )
    );
    expect(store.getState().feeds.error).toBe('Ошибка предыдещео запроса');
    expect(store.getState().feeds.isLoading).toBe(false);

    const getFeedsSpy = jest.spyOn(
      api,
      'getFeedsApi'
    ) as jest.MockedFunction<any>;
    const hangingPromise = new Promise<TOrdersData>(() => {});
    getFeedsSpy.mockReturnValue(hangingPromise);

    const pendingActionPromise = store.dispatch(fetchFeeds());
    const state = store.getState().feeds;

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.feeds).toBeNull();

    expect(getFeedsSpy).toHaveBeenCalledTimes(1);
    pendingActionPromise.catch(() => {});
  });

  test('fulfilled: feeds записывает данные, isLoading значеение false', async () => {
    const getFeedsSpy = jest
      .spyOn(api, 'getFeedsApi')
      .mockResolvedValue({ ...mockFeeds, success: true });

    await store.dispatch(fetchFeeds());
    const state = store.getState().feeds;

    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.feeds).toEqual(mockFeeds);
    expect(getFeedsSpy).toHaveBeenCalledTimes(1);
  });

  test('rejected: error записывает ошибку, isLoading значение false', async () => {
    const getFeedsSpy = jest
      .spyOn(api, 'getFeedsApi')
      .mockRejectedValue(new Error('Тестовая ошибка'));

    await store.dispatch(fetchFeeds());
    const state = store.getState().feeds;

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Тестовая ошибка');
    expect(state.feeds).toBeNull();
    expect(getFeedsSpy).toHaveBeenCalledTimes(1);
  });
});
