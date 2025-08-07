import React, { Suspense, lazy } from "react";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import Home from "../pages/Home/Home";
import Dashboard from "../pages/Dashboard/Dashboard";
import Login from "../pages/Login/Login";
import PrivateRoute from "../components/templates/PrivateRoute";

// Lazy-loaded feature pages
const DeviceSync = lazy(() => import("../pages/DeviceSync/DeviceSync"));
const SmartHome = lazy(() => import("../pages/SmartHome/SmartHome"));
const AIConsole = lazy(() => import("../pages/AIConsole/AIConsole"));
const Profiles = lazy(() => import("../pages/Profiles/Profiles"));
const Briefing = lazy(() => import("../pages/Briefing/Briefing"));
const Automations = lazy(() => import("../pages/Automations/Automations"));
const Security = lazy(() => import("../pages/Security/Security"));
const Settings = lazy(() => import("../pages/Settings/Settings"));
const Analytics = lazy(() => import("../pages/Analytics/Analytics"));
const Labs = lazy(() => import("../pages/Labs/Labs"));

const withSuspense = (node) => (
  <Suspense fallback={<div className="p-6 text-slate-400">Loading...</div>}>{node}</Suspense>
);

export const routes = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "dashboard",
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ),
      },
      { path: "device-sync", element: withSuspense(<PrivateRoute><DeviceSync /></PrivateRoute>) },
      { path: "smart-home", element: withSuspense(<PrivateRoute><SmartHome /></PrivateRoute>) },
      { path: "ai-console", element: withSuspense(<PrivateRoute><AIConsole /></PrivateRoute>) },
      { path: "profiles", element: withSuspense(<PrivateRoute><Profiles /></PrivateRoute>) },
      { path: "briefing", element: withSuspense(<PrivateRoute><Briefing /></PrivateRoute>) },
      { path: "automations", element: withSuspense(<PrivateRoute><Automations /></PrivateRoute>) },
      { path: "security", element: withSuspense(<PrivateRoute><Security /></PrivateRoute>) },
      { path: "settings", element: withSuspense(<PrivateRoute><Settings /></PrivateRoute>) },
      { path: "analytics", element: withSuspense(<PrivateRoute><Analytics /></PrivateRoute>) },
      { path: "labs", element: withSuspense(<PrivateRoute><Labs /></PrivateRoute>) },
    ],
  },
  {
    path: "/board",
    element: <Dashboard />,
  },
  {
    path: "/login",
    element: (
      <AuthLayout>
        <Login />
      </AuthLayout>
    ),
  },
];
