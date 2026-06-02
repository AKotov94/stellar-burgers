import constructorSlice, {
  addBun,
  addIngredient,
  initialState,
  moveIngredientDown,
  moveIngredientUp,
  removeIngredient
} from '@slices/constructor';
import { TConstructorIngredient, TIngredient } from '@utils-types';

const reducer = constructorSlice.reducer;

const mockBun: TIngredient = {
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
};

const mockIng1: TConstructorIngredient = {
  id: 'uniq_1',
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
};

const mockIng2: TConstructorIngredient = {
  id: 'uniq_2',
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
};

const mockIng3: TConstructorIngredient = {
  id: 'uniq_3',
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
};

describe('Редюсер burgerConstructor', () => {
  test('Добавление булки конструктор', () => {
    const state = { ...initialState };
    const action = addBun(mockBun);
    const newState = reducer(state, action);

    expect(newState.bun).toEqual(mockBun);
    expect(newState.ingredients).toEqual([]);
  });

  test('Добавление ингредиента в конструктор', () => {
    const state = { ...initialState };
    const action = addIngredient(mockIng1);
    const newState = reducer(state, action);

    expect(newState.ingredients[0]).toEqual(mockIng1);
    expect(newState.bun).toBeNull;
  });

  test('Удаление ингредиента из конструктора', () => {
    const state = {
      ...initialState,
      ingredients: [mockIng1, mockIng2, mockIng3]
    };
    const action = removeIngredient('uniq_2');
    const newState = reducer(state, action);

    expect(newState.ingredients).toHaveLength(2);
    expect(newState.ingredients.map((i) => i.id)).toEqual(['uniq_1', 'uniq_3']);
  });

  test('Перемещение ингредиента вверх', () => {
    const state = {
      ...initialState,
      ingredients: [mockIng1, mockIng2, mockIng3]
    };
    const action = moveIngredientUp('uniq_3');
    const newState = reducer(state, action);

    expect(newState.ingredients.map((i) => i.id)).toEqual([
      'uniq_1',
      'uniq_3',
      'uniq_2'
    ]);
  });

  test('Перемещение первого ингредиента вверх (порядок не должен измениться)', () => {
    const state = {
      ...initialState,
      ingredients: [mockIng1, mockIng2, mockIng3]
    };
    const action = moveIngredientUp('uniq_1');
    const newState = reducer(state, action);

    expect(newState.ingredients.map((i) => i.id)).toEqual([
      'uniq_1',
      'uniq_2',
      'uniq_3'
    ]);
  });

  test('Перемещение ингредиента вниз', () => {
    const state = {
      ...initialState,
      ingredients: [mockIng1, mockIng2, mockIng3]
    };
    const action = moveIngredientDown('uniq_1');
    const newState = reducer(state, action);

    expect(newState.ingredients.map((i) => i.id)).toEqual([
      'uniq_2',
      'uniq_1',
      'uniq_3'
    ]);
  });

  test('Перемещение последнего ингредиента вниз (порядок не должен измениться)', () => {
    const state = {
      ...initialState,
      ingredients: [mockIng1, mockIng2, mockIng3]
    };
    const action = moveIngredientDown('uniq_3');
    const newState = reducer(state, action);

    expect(newState.ingredients.map((i) => i.id)).toEqual([
      'uniq_1',
      'uniq_2',
      'uniq_3'
    ]);
  });
});
