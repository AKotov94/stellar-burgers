import { fetchFeeds, selectFeedsData } from '@slices/feeds';
import { selectIngredients } from '@slices/ingredients';
import { fetchOrders, selectOrders } from '@slices/orders';
import { useDispatch, useSelector } from '@store';
import { TIngredient } from '@utils-types';
import { FC, useEffect, useMemo } from 'react';
import { useMatch, useParams } from 'react-router-dom';
import { OrderInfoUI } from '../ui/order-info';
import { Preloader } from '../ui/preloader';

export const OrderInfo: FC = () => {
  /** TODO: взять переменные orderData и ingredients из стора */
  const dispatch = useDispatch();
  const { id } = useParams();
  const feedData = useSelector(selectFeedsData);
  const profileData = useSelector(selectOrders);
  const ingredients: TIngredient[] = useSelector(selectIngredients);

  const isFeedOrder = !!useMatch('/feed/:id');
  const isProfileOrder = !!useMatch('/profile/orders/:id');

  const orders = isFeedOrder ? feedData : profileData;

  const orderData = useMemo(
    () => orders?.find((order) => order.number === Number(id)),
    [orders, id]
  );

  useEffect(() => {
    if (!orderData) {
      if (isFeedOrder) dispatch(fetchFeeds());
      if (isProfileOrder) dispatch(fetchOrders());
    }
  }, [id, orderData, dispatch, isFeedOrder, isProfileOrder]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
