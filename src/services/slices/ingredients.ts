import {
  createSlice,
  createAsyncThunk,
  createSelector
} from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '@api';

interface IngredientsState {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
}

const initialState: IngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetch',
  getIngredientsApi
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Не удалось загрузить данные';
      });
  },
  selectors: {
    selectIngredients: (state) => state.ingredients,
    selectIngredientsIsLoading: (state) => state.isLoading,
    selectIngredientsError: (state) => state.error
  }
});

export const {
  selectIngredients,
  selectIngredientsIsLoading,
  selectIngredientsError
} = ingredientsSlice.selectors;

export const selectBuns = createSelector([selectIngredients], (items) =>
  items.filter((i) => i.type === 'bun')
);

export const selectMains = createSelector([selectIngredients], (items) =>
  items.filter((i) => i.type === 'main')
);

export const selectSauces = createSelector([selectIngredients], (items) =>
  items.filter((i) => i.type === 'sauce')
);

export default ingredientsSlice;
