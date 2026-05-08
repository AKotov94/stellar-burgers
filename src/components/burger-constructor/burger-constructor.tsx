import { FC, useMemo, useState } from 'react';
import { TConstructorIngredient, TOrder } from '@utils-types';
import { BurgerConstructorUI, Preloader } from '@ui';
import { useDispatch, useSelector } from '@store';
import {
  createOrder,
  selectConstructorIsCreating,
  selectConstructorItems
} from '@slices/constructor';
import { selectUserIsAuthenticated } from '@slices/user';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const constructorItems = useSelector(selectConstructorItems);
  const isAuthenticated = useSelector(selectUserIsAuthenticated);
  const orderRequest = useSelector(selectConstructorIsCreating);

  const [orderModalData, setOrderModalData] = useState<TOrder | null>(null); // Не понял, зачем хранить orderModalData глобально в сторе, если это только уведомление о создании заказа. Созданный заказ можно посмотреть в истории, где достоверные данные с сервера.

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }
    const orderData = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((i) => i._id),
      constructorItems.bun._id
    ];
    dispatch(createOrder(orderData))
      .unwrap()
      .then((data) => setOrderModalData(data.order))
      .catch(() => {});
  };
  const closeOrderModal = () => setOrderModalData(null);

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
