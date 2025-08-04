import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import Home from "../pages/Home/Home";
import Dashboard from "../pages/Dashboard/Dashboard";
import Login from "../pages/Login/Login";
import PrivateRoute from "../components/templates/PrivateRoute";

export const routes = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '', element: <Home /> },
      { path: 'dashboard', element: <PrivateRoute><Dashboard /></PrivateRoute> }
    ]
  },
  {
    path: '/login',
    element: <AuthLayout><Login /></AuthLayout>
  }
];
