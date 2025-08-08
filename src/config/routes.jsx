import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import PrivateRoute from '../components/templates/PrivateRoute';

import Home from '../pages/Home/Home';
import Dashboard from '../pages/Dashboard/Dashboard';
import AIConsole from '../pages/AIConsole/AIConsole';
import Briefing from '../pages/Briefing/Briefing';
import Analytics from '../pages/Analytics/Analytics';
import Settings from '../pages/Settings/Settings';
import Profiles from '../pages/Profiles/Profiles';
import Security from '../pages/Security/Security';
import SmartHome from '../pages/SmartHome/SmartHome';
import Automations from '../pages/Automations/Automations';
import DeviceSync from '../pages/DeviceSync/DeviceSync';
import Labs from '../pages/Labs/Labs';
import Login from '../pages/Login/Login';

// Public pages
import LandingPage from '../pages/Public/LandingPage';
import About from '../pages/Public/About';
import Features from '../pages/Public/Features';
import Docs from '../pages/Public/Docs';
import Contact from '../pages/Public/Contact';
import PublicLayout from '../layouts/PublicLayout';

const router = createBrowserRouter([
  // Public routes wrapped with common PublicLayout
  {
    path: '/',
    element: (
      <PublicLayout>
        <LandingPage />
      </PublicLayout>
    ),
  },
  {
    path: '/about',
    element: (
      <PublicLayout>
        <About />
      </PublicLayout>
    ),
  },
  {
    path: '/features',
    element: (
      <PublicLayout>
        <Features />
      </PublicLayout>
    ),
  },
  {
    path: '/docs',
    element: (
      <PublicLayout>
        <Docs />
      </PublicLayout>
    ),
  },
  {
    path: '/contact',
    element: (
      <PublicLayout>
        <Contact />
      </PublicLayout>
    ),
  },

  // Auth route (public, themed but kept simple)
  {
    path: '/login',
    element: (
      <PublicLayout>
        <Login />
      </PublicLayout>
    ),
  },
  // Private app routes remain under MainLayout + PrivateRoute
  {
    path: '/',
    element: (
      <PrivateRoute>
        <MainLayout />
      </PrivateRoute>
    ),
    children: [
      // {  path: 'dashboard',index: true, element: <Home /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'console', element: <AIConsole /> },
      { path: 'briefing', element: <Briefing /> },
      { path: 'analytics', element: <Analytics /> },
      { path: 'settings', element: <Settings /> },
      { path: 'profiles', element: <Profiles /> },
      { path: 'security', element: <Security /> },
      { path: 'smarthome', element: <SmartHome /> },
      { path: 'automations', element: <Automations /> },
      { path: 'devices', element: <DeviceSync /> },
      { path: 'labs', element: <Labs /> },
    ],
  },
]);

export { router };

