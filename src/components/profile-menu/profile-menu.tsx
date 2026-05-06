import { logOut } from '@slices/user';
import { useDispatch } from '@store';
import { ProfileMenuUI } from '@ui';
import { FC } from 'react';
import { useLocation } from 'react-router-dom';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logOut());
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
