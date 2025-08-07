import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PersonalizationProvider } from './context/PersonalizationContext';
import { router } from './config/routes';

const App = () => {
  return (
    <AuthProvider>
      <PersonalizationProvider>
        <RouterProvider router={router} />
      </PersonalizationProvider>
    </AuthProvider>
  );
};

export default App;
