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
import Password from 'antd/es/input/Password';

const useAuth = () => {
  const { user, setUser } = useContext(AuthContext);

  const login = async (credentials) => {
    // --- DEMO MODE: Using static JSON data instead of an API call ---
    // Simulate an API delay to mimic a real network request
    await new Promise(resolve => setTimeout(resolve, 500)); 

    // Define the static JSON data you want to use for the demo
    const demoUser = {
      id: 'demo123',
      name: 'John Doe',
      email: "admin@gmail.com", // Use the email from the credentials for a personal touch
      role: 'admin',
      Password: 'password', // Use a static password for demo purposes
      preferences: {
        theme: 'dark',
        notifications: true,
      },
    };

    const demoToken = 'demo-token-123-abc';

    // The rest of the logic is the same as the original API call
    localStorage.setItem('token', demoToken);
    setUser(demoUser);
    return demoUser;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return { user, login, logout };
};

export default useAuth;