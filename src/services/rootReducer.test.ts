import { rootReducer } from '@store';
import { initialState as ingredientsInitial } from '@slices/ingredients';
import { initialState as constructorInitial } from '@slices/constructor';
import { initialState as feedsInitial } from '@slices/feeds';
import { initialState as userInitial } from '@slices/user';
import { initialState as ordersInitial } from '@slices/orders';

describe('Проверка инциализации rootReducer', () => {
  test('Возвращае корректное начальное состояние при undefined и неизвестном экшене', () => {
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(initialState).toBeDefined();

    expect(initialState).toHaveProperty('ingredients');
    expect(initialState).toHaveProperty('constructor');
    expect(initialState).toHaveProperty('feeds');
    expect(initialState).toHaveProperty('user');
    expect(initialState).toHaveProperty('orders');

    expect(initialState.ingredients).toEqual(ingredientsInitial);
    expect(initialState.burgerConstructor).toEqual(constructorInitial);
    expect(initialState.feeds).toEqual(feedsInitial);
    expect(initialState.user).toEqual(userInitial);
    expect(initialState.orders).toEqual(ordersInitial);
  });
});
