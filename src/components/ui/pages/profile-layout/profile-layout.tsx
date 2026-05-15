import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { ProfileMenu } from '@components';
import commonStyles from '../common.module.css';
import styles from './profile-layout.module.css';

export const ProfileLayoutUI: FC = () => (
  <main className={`${commonStyles.container}`}>
    <div className={`mt-30 mr-15 ${styles.menu}`}>
      <ProfileMenu />
    </div>
    <Outlet />
  </main>
);
