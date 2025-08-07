import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { BellOutlined } from "@ant-design/icons";
import { Cpu, Bot, Home, Settings, Shield, Sparkles, SlidersHorizontal, BarChart3, FlaskConical, RefreshCw } from "lucide-react";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: <Cpu size={18} /> },
  { to: "/device-sync", label: "Device Sync", icon: <RefreshCw size={18} /> },
  { to: "/smart-home", label: "Smart Home", icon: <Home size={18} /> },
  { to: "/ai-console", label: "AI Console", icon: <Bot size={18} /> },
  { to: "/profiles", label: "Profiles", icon: <Shield size={18} /> },
  { to: "/briefing", label: "Briefing", icon: <Sparkles size={18} /> },
  { to: "/automations", label: "Automations", icon: <SlidersHorizontal size={18} /> },
  { to: "/security", label: "Security", icon: <Shield size={18} /> },
  { to: "/analytics", label: "Analytics", icon: <BarChart3 size={18} /> },
  { to: "/labs", label: "Labs", icon: <FlaskConical size={18} /> },
  { to: "/settings", label: "Settings", icon: <Settings size={18} /> },
];

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_800px_at_10%_-10%,rgba(59,130,246,0.12),transparent),radial-gradient(1200px_800px_at_90%_110%,rgba(99,102,241,0.12),transparent)] text-slate-200">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex md:w-64 lg:w-72 flex-col glass min-h-screen border-r border-slate-800/60">
          {/* Profile */}
          <div className="p-4 border-b border-slate-800/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 border border-slate-700/60" />
              <div className="flex-1">
                <div className="text-slate-100 text-sm">Neural Assistant</div>
                <div className="text-xs text-slate-400">Online • Synced</div>
              </div>
              <button className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-700/60 bg-slate-800/40 hover:bg-slate-800/60">Theme</button>
            </div>
          </div>
          {/* Nav */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl transition border ${
                    isActive
                      ? "bg-blue-500/10 border-blue-500/40 text-blue-300"
                      : "bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50"
                  }`
                }
              >
                <span className="shrink-0 opacity-90">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </NavLink>
            ))}
          </nav>
          {/* Footer */}
          <div className="p-3 border-t border-slate-800/60 text-xs text-slate-500">
            v0.1 • Neural Command Center
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1">
          {/* Top bar */}
          <div className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-slate-900/40 border-b border-slate-800/60">
            <div className="h-14 flex items-center justify-between px-4">
              <div className="md:hidden">
                {/* Placeholder for mobile menu button, future enhancement */}
              </div>
              <div className="text-sm text-slate-400">Immersive AI Control Center</div>
              <div className="flex items-center gap-2">
                <button className="px-2.5 py-1.5 rounded-lg border border-slate-700/60 bg-slate-800/40 hover:bg-slate-800/60">
                  <BellOutlined />
                </button>
              </div>
            </div>
          </div>

          {/* Page container */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="p-4 md:p-6"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
