import { getFeedsApi } from '@api';
import {
  createAsyncThunk,
  createSelector,
  createSlice
} from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '@utils-types';

const EMPTY_ORDERS_ARRAY: TOrder[] = [];

interface FeedsState {
  feeds: TOrdersData | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: FeedsState = {
  feeds: null,
  isLoading: false,
  error: null
};

export const fetchFeeds = createAsyncThunk('feeds/fetch', getFeedsApi);

const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        const { success, ...feedsData } = action.payload;
        state.feeds = feedsData;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Не удалось загрузить данные';
      });
  },
  selectors: {
    selectFeeds: (state) => state.feeds,
    selectFeedsIsLoading: (state) => state.isLoading,
    selectFeedsError: (state) => state.error
  }
});

export const { selectFeeds, selectFeedsIsLoading, selectFeedsError } =
  feedsSlice.selectors;

export const selectFeedsData = createSelector(
  [selectFeeds],
  (data) => data?.orders ?? EMPTY_ORDERS_ARRAY
);

export const selectFeedsStats = createSelector([selectFeeds], (data) => ({
  total: data?.total,
  totalToday: data?.totalToday
}));

export default feedsSlice;
