import {
  selectUserisAuthChecked,
  selectUserIsAuthenticated
} from '@slices/user';
import { useSelector } from '@store';
import { Preloader } from '@ui';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
};

const ProtectedRoute = ({ onlyUnAuth = false }: TProtectedRouteProps) => {
  const location = useLocation();
  const isAuthenticated = useSelector(selectUserIsAuthenticated);
  const isAuthChecked = useSelector(selectUserisAuthChecked);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth) {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      return <Navigate to={from} replace />;
    }
    return <Outlet />;
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
