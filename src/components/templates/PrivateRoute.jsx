import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return true ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
