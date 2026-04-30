import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';

interface ConstructorState {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
}

const initialState: ConstructorState = {
  bun: null,
  ingredients: []
};

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
    },
    clearConstructor: () => ({ ...initialState })
  },
  selectors: {
    selectConstructorIngredients: (state) => state.ingredients,
    selectConstructorBun: (state) => state.bun
  }
});

export const { selectConstructorIngredients, selectConstructorBun } =
  constructorSlice.selectors;

export const {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown
} = constructorSlice.actions;

export default constructorSlice;
