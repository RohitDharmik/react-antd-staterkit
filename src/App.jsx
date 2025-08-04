import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { routes } from './config/routes';

const AppRoutes = () => useRoutes(routes);

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;
