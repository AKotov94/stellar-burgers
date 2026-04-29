import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { UseSelector } from 'react-redux';

type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
};

const ProtectedRoute = ({ onlyUnAuth }: TProtectedRouteProps) => <Outlet />;

export default ProtectedRoute;
