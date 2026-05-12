import {
  fetchFeeds,
  selectFeedsData,
  selectFeedsIsLoading
} from '@slices/feeds';
import { useDispatch, useSelector } from '@store';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const orders = useSelector(selectFeedsData);
  const isLoading = useSelector(selectFeedsIsLoading);

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  if (isLoading) return <Preloader />;

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeeds())} />
  );
};
