import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
};

const ProtectedRoute = ({ onlyUnAuth = false }: TProtectedRouteProps) => {
  const location = useLocation();
  const isAuthenticated = false; // useSelectror(статус в слайсе User)

  if (!onlyUnAuth && !isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  if (onlyUnAuth && isAuthenticated) {
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
