import { getOrdersApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

interface OrdersState {
  orders: TOrder[] | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: null,
  isLoading: false,
  error: null
};

export const fetchOrders = createAsyncThunk(
  'orders/fetch',
  async () => await getOrdersApi()
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload ?? [];
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Не удалось загрузить данные';
      });
  },
  selectors: {
    selectOrders: (state) => state.orders,
    selectOrdersIsLoading: (state) => state.isLoading,
    selectOredersError: (state) => state.error
  }
});

export const { selectOrders, selectOrdersIsLoading, selectOredersError } =
  ordersSlice.selectors;

export default ordersSlice;
