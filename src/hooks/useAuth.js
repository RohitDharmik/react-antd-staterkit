import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { apiMiddleware } from '../services/middleware/middleware';

const useAuth = () => {
  const { user, setUser } = useContext(AuthContext);

  const login = async (credentials) => {
    const { data, error } = await apiMiddleware.post('/auth/login', credentials);
    
    if (error) {
      throw new Error(error);
    }

    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return { user, login, logout };
};

export default useAuth;
