import { Middleware } from '@reduxjs/toolkit';
import { checkUserAuth, loginUser, logOut, registerUser } from '@slices/user';
import { RootState } from '@store';
import { deleteCookie, setCookie } from 'src/utils/cookie';

export const authMiddleware: Middleware<{}, RootState> =
  (store) => (next) => (action) => {
    const result = next(action);

    if (
      loginUser.fulfilled.match(action) ||
      registerUser.fulfilled.match(action)
    ) {
      const { accessToken, refreshToken } = action.payload;
      setCookie('accessToken', accessToken);
      setCookie('refreshToken', refreshToken);
    }

    if (logOut.fulfilled.match(action)) {
      deleteCookie('accessToken');
      deleteCookie('refreshToken');
    }

    if (checkUserAuth.rejected.match(action)) {
      deleteCookie('accessToken');
      deleteCookie('refreshToken');
    }

    return result;
  };
