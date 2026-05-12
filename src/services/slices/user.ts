import {
  forgotPasswordApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  resetPasswordApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import {
  createAsyncThunk,
  createSelector,
  createSlice
} from '@reduxjs/toolkit';
import { TUser } from '@utils-types';

interface UserState {
  isAuthChecked: boolean;
  user: TUser | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  isAuthChecked: false,
  user: null,
  isLoading: false,
  error: null
};

export const registerUser = createAsyncThunk('user/register', registerUserApi);

export const loginUser = createAsyncThunk('user/login', loginUserApi);

export const forgotPassword = createAsyncThunk(
  'user/forgotPass',
  forgotPasswordApi
);

export const resetPassword = createAsyncThunk(
  'user/resetPass',
  resetPasswordApi
);

export const updateUser = createAsyncThunk('user/update', updateUserApi);

export const logOut = createAsyncThunk('user/logOut', logoutApi);

export const checkUserAuth = createAsyncThunk('user/checkAuth', async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    throw new Error('Нет refresh token');
  }
  return await getUserApi();
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //# registerUser
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message ?? 'Не удалось зарегистрировать пользователя';
      })
      //# loginUser
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Не удалось авторизоваться';
      })
      //# forgotPassword
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Не удалось восстановить пароль';
      })
      //# resetPassword
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Не удалось сменить пароль';
      })
      //# updateUser
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message ?? 'Не удалось обновить данные пользователя';
      })
      //# logOut
      .addCase(logOut.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logOut.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthChecked = true;
      })
      .addCase(logOut.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message ?? 'Не удалось выйти из личного кабинета';
      })
      //# checkUserAuth
      .addCase(checkUserAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.user = action.payload.user;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthChecked = true;
      });
  },
  selectors: {
    selectUserisAuthChecked: (state) => state.isAuthChecked,
    selectUser: (state) => state.user,
    selectUserIsLoading: (state) => state.isLoading,
    selectUserError: (state) => state.error,
    selectUserIsAuthenticated: (state) =>
      state.isAuthChecked && state.user !== null
  }
});

export const {
  selectUserisAuthChecked,
  selectUser,
  selectUserIsLoading,
  selectUserError,
  selectUserIsAuthenticated
} = userSlice.selectors;

export const selectUserData = createSelector(
  [selectUser, selectUserIsLoading, selectUserError],
  (user, isLoading, error) => ({
    user,
    isLoading,
    error
  })
);

export default userSlice;
