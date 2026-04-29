import { RootState } from '@store';
import { createSelector } from '@reduxjs/toolkit';

export const selectIngredients = (state: RootState) =>
  state.ingredients.ingredients;
export const selectIsLoading = (state: RootState) =>
  state.ingredients.isLoading;
export const selectError = (state: RootState) => state.ingredients.error;

export const selectBuns = createSelector([selectIngredients], (items) =>
  items.filter((i) => i.type === 'bun')
);

export const selectMains = createSelector([selectIngredients], (items) =>
  items.filter((i) => i.type === 'main')
);

export const selectSauces = createSelector([selectIngredients], (items) =>
  items.filter((i) => i.type === 'sauce')
);

export const selectConstructorBun = (state: RootState) =>
  state.burgerConstructor.bun;
export const selectConstructorIngredients = (state: RootState) =>
  state.burgerConstructor.ingredients;
