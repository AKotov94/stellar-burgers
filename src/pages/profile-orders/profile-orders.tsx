import {
  fetchOrders,
  selectOrders,
  selectOrdersIsLoading
} from '@slices/orders';
import { useDispatch, useSelector } from '@store';
import { Preloader } from '@ui';
import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const isLoading = useSelector(selectOrdersIsLoading);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (isLoading) return <Preloader />;

  return <ProfileOrdersUI orders={orders} />;
};
