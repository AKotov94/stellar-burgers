import { getFeedsApi } from '@api';
import {
  createAsyncThunk,
  createSelector,
  createSlice
} from '@reduxjs/toolkit';
import { TOrdersData } from '@utils-types';

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

export const fetchFeeds = createAsyncThunk(
  'feeds/fetch',
  async () => await getFeedsApi()
);

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
        state.feeds = action.payload;
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

export const selectOrders = createSelector(
  [selectFeeds],
  (feeds) => feeds?.orders ?? []
);

export const selectFeedStats = createSelector([selectFeeds], (slice) => ({
  total: slice?.total,
  totalToday: slice?.totalToday
}));

export default feedsSlice;
