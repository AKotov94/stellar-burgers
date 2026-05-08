import { getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';
import { useEffect, useState } from 'react';

export const useOrderData = (orderId: string | undefined) => {
  const [orderData, setOrderData] = useState<TOrder | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setOrderData(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    getOrderByNumberApi(Number(orderId))
      .then((response) => {
        const order = response.orders?.[0];
        setOrderData(order);
      })
      .catch((err) => {
        setError(err.message ?? 'Не удалось загрузить заказ');
        setOrderData(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [orderId]);

  return { orderData, isLoading, error };
};
