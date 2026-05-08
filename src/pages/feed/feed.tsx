import { Modal, OrderInfo } from '@components';
import {
  fetchFeeds,
  selectFeedsData,
  selectFeedsIsLoading
} from '@slices/feeds';
import { useDispatch, useSelector } from '@store';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const orders = useSelector(selectFeedsData);
  const isLoading = useSelector(selectFeedsIsLoading);

  const { id } = useParams();
  const navigate = useNavigate();

  const isModalOpen = Boolean(id);

  const handleClose = () => {
    navigate('/feed', { replace: true });
  };

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  if (isLoading) return <Preloader />;

  return (
    <>
      <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeeds())} />;
      {isModalOpen && (
        <Modal title='' onClose={handleClose}>
          <OrderInfo />
        </Modal>
      )}
    </>
  );
};
