import {
  fetchOrders,
  selectOrders,
  selectOrdersIsLoading
} from '@slices/orders';
import { useDispatch, useSelector } from '@store';
import { Preloader } from '@ui';
import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectOrders);
  const isLoading = useSelector(selectOrdersIsLoading);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (isLoading || orders === null) return <Preloader />;

  return <ProfileOrdersUI orders={orders} />;
};
