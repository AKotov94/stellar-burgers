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

import { AppHeader, OrderInfo } from '@components';
import { Preloader } from '@ui';

import {
  fetchIngredients,
  selectIngredients,
  selectIngredientsError,
  selectIngredientsIsLoading
} from '@slices/ingredients';
import { checkUserAuth, selectUserisAuthChecked } from '@slices/user';
import { useDispatch, useSelector } from '@store';
import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import ProtectedRoute from '../protected-route/ProtectedRoute';

const App = () => {
  const dispatch = useDispatch();

  /** TODO: взять переменные из стора */
  const ingredients = useSelector(selectIngredients);
  const isAuthChecked = useSelector(selectUserisAuthChecked);
  const isLoading = useSelector(selectIngredientsIsLoading);
  const error = useSelector(selectIngredientsError);

  const location = useLocation();
  const background = location.state?.background;

  useEffect(() => {
    if (ingredients.length === 0) dispatch(fetchIngredients());
    if (!isAuthChecked) dispatch(checkUserAuth());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={background || location}>
        <Route
          path='/'
          element={
            isLoading || (ingredients.length === 0 && !error) ? ( // Пришлось сделать так, потому что из-за HMR отправляется 2 запроса и при обновлении было мерцание "Нет ингредиентов"
              <Preloader key='ingredients-loader' />
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
                Нет ингредиентов
              </div>
            )
          }
        />
        <Route path='/ingredients/:id' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:id' element={<Feed />} />
        <Route element={<ProtectedRoute />}>
          <Route path='/profile' element={<ProfileLayout />}>
            <Route index element={<Profile />} />
            <Route path='orders' element={<ProfileOrders />} />
            <Route path='orders/:id' element={<OrderInfo />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute onlyUnAuth />}>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password' element={<ResetPassword />} />
        </Route>

        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes location={location}>

        </Routes>
      )}
    </div>
  );
};

export default App;
