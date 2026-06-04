import constructorSlice from '@slices/constructor';
import feedsSlice from '@slices/feeds';
import ingredientsSlice from '@slices/ingredients';
import ordersSlice from '@slices/orders';
import userSlice from '@slices/user';
import { rootReducer } from '@store';

describe('Проверка инциализации rootReducer', () => {
  test('Возвращае корректное начальное состояние при undefined и неизвестном экшене', () => {
    const initAction = { type: 'UNKNOWN_ACTION' };

    const state = rootReducer(undefined, initAction);

    expect(state).toEqual({
      ingredients: ingredientsSlice.reducer(undefined, initAction),
      burgerConstructor: constructorSlice.reducer(undefined, initAction),
      feeds: feedsSlice.reducer(undefined, initAction),
      user: userSlice.reducer(undefined, initAction),
      orders: ordersSlice.reducer(undefined, initAction)
    });
  });
});
