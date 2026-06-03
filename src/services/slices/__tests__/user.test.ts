/**
 * @jest-environment jsdom
 */

jest.mock('@api', () => {
  const originalModule = jest.requireActual('@api');

  return {
    __esModule: true,
    ...originalModule,
    registerUserApi: jest.fn(),
    loginUserApi: jest.fn(),
    forgotPasswordApi: jest.fn(),
    resetPasswordApi: jest.fn(),
    updateUserApi: jest.fn(),
    logoutApi: jest.fn(),
    getUserApi: jest.fn()
  };
});

import * as api from '@api';
import {
  checkUserAuth,
  forgotPassword,
  loginUser,
  logOut,
  registerUser,
  resetPassword,
  resetUser,
  updateUser
} from '@slices/user';
import store from '@store';
import { TUser } from '@utils-types';

const loginUserMock: api.TLoginData = {
  email: 'test@example.com',
  password: 'testPassword'
};

const userMock: TUser = {
  email: 'test@example.com',
  name: 'Тестовый пользователь'
};

const registerUserMock: api.TRegisterData = {
  email: 'test@example.com',
  name: 'Тестовый пользователь',
  password: 'testPassword'
};

const updatedUserMock: TUser = {
  email: 'test@example.com',
  name: 'Обновленный тестовый пользователь'
};

const forgotPassMock: { email: string } = {
  email: 'test@example.com'
};

const resetPassMock: { password: string; token: string } = {
  password: 'testPassword',
  token: 'testToken'
};

describe('Редюсер user', () => {
  afterEach(() => {
    jest.clearAllMocks();
    store.dispatch(resetUser());
  });

  describe('registerUser', () => {
    test('pending: isLoading значение true, error значение сбрасывается', async () => {
      store.dispatch(
        registerUser.rejected(
          new Error('Ошибка предыдещео запроса'),
          'fake-request-id',
          registerUserMock
        )
      );
      expect(store.getState().user.error).toBe('Ошибка предыдещео запроса');
      expect(store.getState().user.isLoading).toBe(false);

      const registerUserSpy = jest.spyOn(
        api,
        'registerUserApi'
      ) as jest.MockedFunction<any>;
      const hangingPromise = new Promise<{
        success: boolean;
        user: TUser;
        accessToken: string;
        refreshToken: string;
      }>(() => {});
      registerUserSpy.mockReturnValue(hangingPromise);

      const pendingActionPromise = store.dispatch(
        registerUser(registerUserMock)
      );
      const state = store.getState().user;

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.user).toBeNull();

      expect(registerUserSpy).toHaveBeenCalledTimes(1);
      pendingActionPromise.catch(() => {});
    });

    test('fulfilled: user записывает данные, isLoading значение false', async () => {
      const registerUserSpy = jest
        .spyOn(api, 'registerUserApi')
        .mockResolvedValue({
          success: true,
          user: userMock,
          accessToken: 'test-token',
          refreshToken: 'test-refresh'
        });

      await store.dispatch(registerUser(registerUserMock));
      const state = store.getState().user;

      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.user).toEqual(userMock);
      expect(state.isAuthChecked).toBe(true);
      expect(registerUserSpy).toHaveBeenCalledTimes(1);
    });

    test('rejected: error записывает ошибку, isLoading значение false', async () => {
      const registerUserSpy = jest
        .spyOn(api, 'registerUserApi')
        .mockRejectedValue(new Error('Тестовая ошибка'));

      await store.dispatch(registerUser(registerUserMock));
      const state = store.getState().user;

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Тестовая ошибка');
      expect(state.user).toBeNull();
      expect(registerUserSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('loginUser', () => {
    test('pending: isLoading значение true, error значение сбрасывается', async () => {
      store.dispatch(
        loginUser.rejected(
          new Error('Ошибка предыдещео запроса'),
          'fake-request-id',
          loginUserMock
        )
      );
      expect(store.getState().user.error).toBe('Ошибка предыдещео запроса');

      const loginUserSpy = jest.spyOn(
        api,
        'loginUserApi'
      ) as jest.MockedFunction<any>;
      const hangingPromise = new Promise<{
        success: boolean;
        user: TUser;
        accessToken: string;
        refreshToken: string;
      }>(() => {});
      loginUserSpy.mockReturnValue(hangingPromise);

      const pendingActionPromise = store.dispatch(loginUser(loginUserMock));
      const state = store.getState().user;

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.user).toBeNull();

      expect(loginUserSpy).toHaveBeenCalledTimes(1);
      pendingActionPromise.catch(() => {});
    });

    test('fulfilled: user записывает данные, isLoading значение false', async () => {
      const loginUserSpy = jest.spyOn(api, 'loginUserApi').mockResolvedValue({
        success: true,
        user: userMock,
        accessToken: 'test-token',
        refreshToken: 'test-refresh'
      });

      await store.dispatch(loginUser(loginUserMock));
      const state = store.getState().user;

      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.user).toEqual(userMock);
      expect(state.isAuthChecked).toBe(true);
      expect(loginUserSpy).toHaveBeenCalledTimes(1);
    });

    test('rejected: error записывает ошибку, isLoading значение false', async () => {
      const loginUserSpy = jest
        .spyOn(api, 'loginUserApi')
        .mockRejectedValue(new Error('Тестовая ошибка'));

      await store.dispatch(loginUser(loginUserMock));
      const state = store.getState().user;

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Тестовая ошибка');
      expect(state.user).toBeNull();
      expect(loginUserSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('forgotPassword', () => {
    test('pending: isLoading значение true, error значение сбрасывается', async () => {
      store.dispatch(
        forgotPassword.rejected(
          new Error('Ошибка предыдещео запроса'),
          'fake-request-id',
          forgotPassMock
        )
      );

      const forgotPasswordSpy = jest.spyOn(
        api,
        'forgotPasswordApi'
      ) as jest.MockedFunction<any>;
      const hangingPromise = new Promise<{ success: boolean }>(() => {});
      forgotPasswordSpy.mockReturnValue(hangingPromise);

      const pendingActionPromise = store.dispatch(
        forgotPassword(forgotPassMock)
      );
      const state = store.getState().user;

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();

      expect(forgotPasswordSpy).toHaveBeenCalledTimes(1);
      pendingActionPromise.catch(() => {});
    });

    test('fulfilled: isLoading значение false', async () => {
      const forgotPasswordSpy = jest
        .spyOn(api, 'forgotPasswordApi')
        .mockResolvedValue({ success: true });

      await store.dispatch(forgotPassword(forgotPassMock));
      const state = store.getState().user;

      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(forgotPasswordSpy).toHaveBeenCalledTimes(1);
    });

    test('rejected: error записывает ошибку, isLoading значение false', async () => {
      const forgotPasswordSpy = jest
        .spyOn(api, 'forgotPasswordApi')
        .mockRejectedValue(new Error('Тестовая ошибка'));

      await store.dispatch(forgotPassword(forgotPassMock));
      const state = store.getState().user;

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Тестовая ошибка');
      expect(forgotPasswordSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('resetPassword', () => {
    test('pending: isLoading значение true, error значение сбрасывается', async () => {
      store.dispatch(
        resetPassword.rejected(
          new Error('Ошибка предыдещео запроса'),
          'fake-request-id',
          resetPassMock
        )
      );

      const resetPasswordSpy = jest.spyOn(
        api,
        'resetPasswordApi'
      ) as jest.MockedFunction<any>;
      const hangingPromise = new Promise<{ success: boolean }>(() => {});
      resetPasswordSpy.mockReturnValue(hangingPromise);

      const pendingActionPromise = store.dispatch(resetPassword(resetPassMock));
      const state = store.getState().user;

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();

      expect(resetPasswordSpy).toHaveBeenCalledTimes(1);
      pendingActionPromise.catch(() => {});
    });

    test('fulfilled: isLoading значение false', async () => {
      const resetPasswordSpy = jest
        .spyOn(api, 'resetPasswordApi')
        .mockResolvedValue({ success: true });

      await store.dispatch(resetPassword(resetPassMock));
      const state = store.getState().user;

      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(resetPasswordSpy).toHaveBeenCalledTimes(1);
    });

    test('rejected: error записывает ошибку, isLoading значение false', async () => {
      const resetPasswordSpy = jest
        .spyOn(api, 'resetPasswordApi')
        .mockRejectedValue(new Error('Тестовая ошибка'));

      await store.dispatch(resetPassword(resetPassMock));
      const state = store.getState().user;

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Тестовая ошибка');
      expect(resetPasswordSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateUser', () => {
    test('pending: isLoading значение true, error значение сбрасывается', async () => {
      store.dispatch(
        updateUser.rejected(
          new Error('Ошибка предыдещео запроса'),
          'fake-request-id',
          { name: 'Предыдющий пользователь' }
        )
      );

      const updateUserSpy = jest.spyOn(
        api,
        'updateUserApi'
      ) as jest.MockedFunction<any>;
      const hangingPromise = new Promise<{ success: boolean; user: TUser }>(
        () => {}
      );
      updateUserSpy.mockReturnValue(hangingPromise);

      const pendingActionPromise = store.dispatch(
        updateUser({ name: 'Обновленный тестовый пользователь' })
      );
      const state = store.getState().user;

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.user).toBeNull();

      expect(updateUserSpy).toHaveBeenCalledTimes(1);
      pendingActionPromise.catch(() => {});
    });

    test('fulfilled: user обновляется, isLoading значение false', async () => {
      const updateUserSpy = jest
        .spyOn(api, 'updateUserApi')
        .mockResolvedValue({ success: true, user: updatedUserMock });

      await store.dispatch(
        updateUser({ name: 'Обновленный тестовый пользователь' })
      );
      const state = store.getState().user;

      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.user).toEqual(updatedUserMock);
      expect(updateUserSpy).toHaveBeenCalledTimes(1);
    });

    test('rejected: error записывает ошибку, isLoading значение false', async () => {
      const updateUserSpy = jest
        .spyOn(api, 'updateUserApi')
        .mockRejectedValue(new Error('Тестовая ошибка'));

      await store.dispatch(
        updateUser({ name: 'Обновленный тестовый пользователь' })
      );
      const state = store.getState().user;

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Тестовая ошибка');
      expect(state.user).toBeNull();
      expect(updateUserSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('logOut', () => {
    test('pending: isLoading значение true, error значение сбрасывается', async () => {
      store.dispatch(
        logOut.rejected(
          new Error('Ошибка предыдещео запроса'),
          'fake-request-id'
        )
      );

      const logOutSpy = jest.spyOn(
        api,
        'logoutApi'
      ) as jest.MockedFunction<any>;
      const hangingPromise = new Promise<{ success: boolean }>(() => {});
      logOutSpy.mockReturnValue(hangingPromise);

      const pendingActionPromise = store.dispatch(logOut());
      const state = store.getState().user;

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();

      expect(logOutSpy).toHaveBeenCalledTimes(1);
      pendingActionPromise.catch(() => {});
    });

    test('fulfilled: user обнуляется, isLoading значение false', async () => {
      jest.spyOn(api, 'loginUserApi').mockResolvedValue({
        success: true,
        user: userMock,
        accessToken: 't',
        refreshToken: 't'
      });
      await store.dispatch(loginUser(loginUserMock));
      expect(store.getState().user.user).toEqual(userMock);

      const logOutSpy = jest
        .spyOn(api, 'logoutApi')
        .mockResolvedValue({ success: true });

      await store.dispatch(logOut());
      const state = store.getState().user;

      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.user).toBeNull();
      expect(state.isAuthChecked).toBe(true);
      expect(logOutSpy).toHaveBeenCalledTimes(1);
    });

    test('rejected: error записывает ошибку, isLoading значение false', async () => {
      const logOutSpy = jest
        .spyOn(api, 'logoutApi')
        .mockRejectedValue(new Error('Тестовая ошибка'));

      await store.dispatch(logOut());
      const state = store.getState().user;

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Тестовая ошибка');
      expect(logOutSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('checkUserAuth', () => {
    test('pending: isLoading значение true, error значение сбрасывается', async () => {
      const getItemSpy = jest
        .spyOn(Storage.prototype, 'getItem')
        .mockReturnValue('fake-refresh-token');

      store.dispatch(
        checkUserAuth.rejected(
          new Error('Ошибка предыдещео запроса'),
          'fake-request-id'
        )
      );

      const getUserSpy = jest.spyOn(
        api,
        'getUserApi'
      ) as jest.MockedFunction<any>;
      const hangingPromise = new Promise<{ success: boolean; user: TUser }>(
        () => {}
      );
      getUserSpy.mockReturnValue(hangingPromise);

      const pendingActionPromise = store.dispatch(checkUserAuth());
      const state = store.getState().user;

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();

      expect(getUserSpy).toHaveBeenCalledTimes(1);
      pendingActionPromise.catch(() => {});

      getItemSpy.mockRestore();
    });

    test('fulfilled: user записывается, isAuthChecked становится true', async () => {
      const getItemSpy = jest
        .spyOn(Storage.prototype, 'getItem')
        .mockReturnValue('fake-refresh-token');

      const getUserSpy = jest
        .spyOn(api, 'getUserApi')
        .mockResolvedValue({ success: true, user: userMock });

      await store.dispatch(checkUserAuth());
      const state = store.getState().user;

      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.user).toEqual(userMock);
      expect(state.isAuthChecked).toBe(true);
      expect(getUserSpy).toHaveBeenCalledTimes(1);

      getItemSpy.mockRestore();
    });

    test('rejected: user обнуляется, isAuthChecked становится true', async () => {
      const getItemSpy = jest
        .spyOn(Storage.prototype, 'getItem')
        .mockReturnValue('fake-refresh-token');

      const getUserSpy = jest
        .spyOn(api, 'getUserApi')
        .mockRejectedValue(new Error('Тестовая ошибка'));

      await store.dispatch(checkUserAuth());
      const state = store.getState().user;

      expect(state.isLoading).toBe(false);
      expect(state.user).toBeNull();
      expect(state.isAuthChecked).toBe(true);
      expect(getUserSpy).toHaveBeenCalledTimes(1);

      getItemSpy.mockRestore();
    });
  });
});
