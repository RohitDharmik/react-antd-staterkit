import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const useAuth = () => {
  const { user, setUser } = useContext(AuthContext);

  const login = async (credentials) => {
    // Simulate API call
    const res = { token: 'fake-token', user: { email: credentials.email } };
    localStorage.setItem('token', res.token);
    setUser(res.user);
    return res.user;
  };

  return { user, login };
};

export default useAuth;
