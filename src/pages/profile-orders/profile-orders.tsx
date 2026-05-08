import { Modal, OrderInfo } from '@components';
import {
  fetchOrders,
  selectOrders,
  selectOrdersIsLoading
} from '@slices/orders';
import { useDispatch, useSelector } from '@store';
import { Preloader } from '@ui';
import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const isLoading = useSelector(selectOrdersIsLoading);

  const { id } = useParams();
  const navigate = useNavigate();

  const isModalOpen = Boolean(id);

  const handleClose = () => {
    navigate('/profile/orders', { replace: true });
  };

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (isLoading) return <Preloader />;

  return (
    <>
      <ProfileOrdersUI orders={orders} />;
      {isModalOpen && (
        <Modal title='' onClose={handleClose}>
          <OrderInfo />
        </Modal>
      )}
    </>
  );
};
