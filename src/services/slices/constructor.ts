import { orderBurgerApi } from '@api';
import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';

interface ConstructorState {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
  isCreating: boolean;
  error: string | null;
}

const initialState: ConstructorState = {
  bun: null,
  ingredients: [],
  isCreating: false,
  error: null
};

export const createOrder = createAsyncThunk(
  'constructor/create',
  async (ingredients: string[]) => await orderBurgerApi(ingredients)
);

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addBun: (state, action: PayloadAction<TIngredient>) => {
      state.bun = action.payload;
    },
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.ingredients.push(action.payload);
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },
    moveIngredientUp: (state, action: PayloadAction<string>) => {
      const index = state.ingredients.findIndex((i) => i.id === action.payload);
      if (index > 0) {
        [state.ingredients[index], state.ingredients[index - 1]] = [
          state.ingredients[index - 1],
          state.ingredients[index]
        ];
      }
    },
    moveIngredientDown: (state, action: PayloadAction<string>) => {
      const index = state.ingredients.findIndex((i) => i.id === action.payload);
      if (index < state.ingredients.length - 1) {
        [state.ingredients[index], state.ingredients[index + 1]] = [
          state.ingredients[index + 1],
          state.ingredients[index]
        ];
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state) => {
        state.bun = null;
        state.ingredients = [];
        state.isCreating = false;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.error.message ?? 'Не удалось разместить заказ';
      });
  },
  selectors: {
    selectConstructorIngredients: (state) => state.ingredients,
    selectConstructorBun: (state) => state.bun,
    selectConstructorIsCreating: (state) => state.isCreating,
    selectConstructorError: (state) => state.error
  }
});

export const {
  selectConstructorIngredients,
  selectConstructorBun,
  selectConstructorIsCreating,
  selectConstructorError
} = constructorSlice.selectors;

export const selectConstructorItems = createSelector(
  [selectConstructorBun, selectConstructorIngredients],
  (bun, ingredients) => ({
    bun,
    ingredients
  })
);

export const {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown
} = constructorSlice.actions;

export default constructorSlice;
