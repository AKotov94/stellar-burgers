import { deleteCookie, setCookie } from '@cookie';
import { Middleware } from '@reduxjs/toolkit';
import { checkUserAuth, loginUser, logOut, registerUser } from '@slices/user';
import { RootState } from '@store';

export const authMiddleware: Middleware<{}, RootState> =
  (store) => (next) => (action) => {
    const result = next(action);

    if (
      loginUser.fulfilled.match(action) ||
      registerUser.fulfilled.match(action)
    ) {
      const { accessToken, refreshToken } = action.payload;
      setCookie('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    }

    if (logOut.fulfilled.match(action)) {
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
    }

    if (checkUserAuth.rejected.match(action)) {
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
    }

    return result;
  };
