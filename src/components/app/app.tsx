import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileLayout,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';

import '../../index.css';
import styles from './app.module.css';

import { AppHeader } from '@components';
import { Preloader } from '@ui';

import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../protected-route/ProtectedRoute';
import { useSelector, useDispatch } from '@store';
import { useEffect } from 'react';
import { fetchIngredients } from '@slices/ingredients';
import {
  selectIngredients,
  selectIsLoading,
  selectError
} from '@slices/ingredients';

const App = () => {
  /** TODO: взять переменные из стора */
  const ingredients = useSelector(selectIngredients);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes>
        <Route
          path='/'
          element={
            isLoading ? (
              <Preloader />
            ) : error ? (
              <div
                className={`${styles.error} text text_type_main-medium pt-4`}
              >
                {error}
              </div>
            ) : ingredients.length > 0 ? (
              <ConstructorPage />
            ) : (
              <div
                className={`${styles.title} text text_type_main-medium pt-4`}
              >
                Нет игредиентов
              </div>
            )
          }
        />
        <Route path='/feed' element={<Feed />} />
        <Route element={<ProtectedRoute />}>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password' element={<ResetPassword />} />
          <Route path='/profile' element={<ProfileLayout />}>
            <Route index element={<Profile />} />
            <Route path='orders' element={<ProfileOrders />} />
          </Route>
        </Route>
        <Route path='*' element={<NotFound404 />} />
      </Routes>
    </div>
  );
};

export default App;
