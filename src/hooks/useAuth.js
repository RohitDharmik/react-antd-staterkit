// import { useContext } from 'react';
// import { AuthContext } from '../context/AuthContext';
// import { apiMiddleware } from '../services/middleware/middleware';

// const useAuth = () => {
//   const { user, setUser } = useContext(AuthContext);

//   const login = async (credentials) => {
//     const { data, error } = await apiMiddleware.post('/auth/login', credentials);
    
//     if (error) {
//       throw new Error(error);
//     }

//     localStorage.setItem('token', data?.token);
//     setUser(data?.user);
//     return data?.user;
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     setUser(null);
//   };

//   return { user, login, logout };
// };

// export default useAuth;
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Simple demo auth:
 * - Accepts only:
 *    email: admin@gmail.com
 *    password: admin123
 * - Persists a token and user to localStorage
 * - Provides logout to clear session
 */
const useAuth = () => {
  const { user, setUser } = useContext(AuthContext);

  const login = async ({ email, password, remember }) => {
    // Simulate API latency
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Basic credential check for demo
    const validEmail = 'admin@gmail.com';
    const validPassword = 'admin123';

    if ((email?.toLowerCase?.() ?? email) !== validEmail || password !== validPassword) {
      console.log('Invalid credentials', { email, password });
      
      throw new Error('Invalid credentials');
    }

    const demoUser = {
      id: 'demo-admin',
      name: 'Admin',
      email: validEmail,
      role: 'admin',
      preferences: { theme: 'dark', notifications: true },
    };
    const demoToken = 'demo-token-123-abc';

    // Persist session
    localStorage.setItem('token', demoToken);
    localStorage.setItem('user', JSON.stringify(demoUser));
    if (remember) {
      localStorage.setItem('remember', 'true');
    } else {
      localStorage.removeItem('remember');
    }

    setUser(demoUser);
    return demoUser;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('remember');
    setUser(null);
  };

  return { user, login, logout };
};

export default useAuth;