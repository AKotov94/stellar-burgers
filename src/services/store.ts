import { combineSlices, configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import constructorSlice from '@slices/constructor';
import feedsSlice from '@slices/feeds';
import ingredientsSlice from '@slices/ingredients';
import userSlice from '@slices/user';
import { authMiddleware } from './middlewares/authMiddleware';
import ordersSlice from '@slices/orders';

const rootReducer = combineSlices(
  ingredientsSlice,
  constructorSlice,
  feedsSlice,
  userSlice,
  ordersSlice
); // Заменить на импорт настоящего редьюсера

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authMiddleware),
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
