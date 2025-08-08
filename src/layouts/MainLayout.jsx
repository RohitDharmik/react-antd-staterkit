import React, { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BellOutlined, LogoutOutlined, CheckCircleOutlined, ClearOutlined } from "@ant-design/icons";
import { Cpu, Bot, Home, Settings, Shield, Sparkles, SlidersHorizontal, BarChart3, FlaskConical, RefreshCw } from "lucide-react";
import useAuth from "../hooks/useAuth";
import { Badge, Dropdown, Empty, ConfigProvider, theme as antdTheme } from "antd";
import { usePersonalization } from "../context/PersonalizationContext";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsapAnimations from "../utils/gsapAnimations";
import MouseLight from "../components/MouseLight";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: <Cpu size={18} /> },
  { to: "/devices", label: "Device Sync", icon: <RefreshCw size={18} /> },
  { to: "/smarthome", label: "Smart Home", icon: <Home size={18} /> },
  { to: "/console", label: "AI Console", icon: <Bot size={18} /> },
  { to: "/profiles", label: "Profiles", icon: <Shield size={18} /> },
  { to: "/briefing", label: "Briefing", icon: <Sparkles size={18} /> },
  { to: "/automations", label: "Automations", icon: <SlidersHorizontal size={18} /> },
  { to: "/security", label: "Security", icon: <Shield size={18} /> },
  { to: "/analytics", label: "Analytics", icon: <BarChart3 size={18} /> },
  { to: "/labs", label: "Labs", icon: <FlaskConical size={18} /> },
  { to: "/settings", label: "Settings", icon: <Settings size={18} /> },
];

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { accent } = usePersonalization();
  const [notifOpen, setNotifOpen] = useState(false);

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Neural update completed', desc: 'AI core performance +12%', time: '2m', tag: 'AI', read: false },
    { id: 2, title: 'Security scan clean', desc: '0 critical issues', time: '5m', tag: 'Security', read: false },
    { id: 3, title: 'Energy optimization', desc: 'Consumption down 18%', time: '12m', tag: 'System', read: false },
  ]);

  // Route enter effects: fade/translate, scroll-to-top, refresh ScrollTrigger
  useEffect(() => {
    // ensure GSAP plugin registered (safe repeat)
    try { gsap.registerPlugin(ScrollTrigger); } catch {}
    // scroll to top on new route
    // window.scrollTo({ top: 0, behavior: 'smooth' });

    // kill previous page timelines if any custom markers existed
    ScrollTrigger.getAll().forEach((st) => {
      // do not kill global triggers without markers; this is conservative
      // leave them; page elements will unmount anyway
    });

    // small page enter animation on container
    const page = document.querySelector('[data-route-container]');
    if (page) {
      gsap.fromTo(
        page,
        { autoAlpha: 0, y: 10, filter: 'blur(2px)' },
        { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.35, ease: 'power2.out' }
      );
    }

    // re-init section animations after paint
    requestAnimationFrame(() => {
      try {
        gsapAnimations.initScrollAnimations();
        ScrollTrigger.refresh();
      } catch {}
    });
  }, [location.pathname]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const clearAll = () => setNotifications([]);

  // Notifications dropdown: solid, elevated panel override
  const notifMenu = (
    <div
      className="w-80 rounded-2xl border"
      role="dialog"
      aria-label="Notifications"
      style={{
        background: 'var(--panel-bg, rgba(15,23,42,0.96))',
        borderColor: 'var(--panel-border, rgba(148,163,184,0.22))',
        boxShadow: 'var(--panel-shadow, 0 30px 80px -20px rgba(0,0,0,0.65))',
        backdropFilter: 'blur(6px)',
        zIndex: 10010,
        position: 'relative',
      }}
    >
      <div className="px-4 py-3 border-b border-slate-800/60 flex items-center justify-between">
        <div className="text-slate-200 text-sm font-medium">Notifications</div>
        <span className="text-[10px] px-2 py-0.5 rounded-md border text-cyan-200 border-cyan-400/30 bg-cyan-400/10">{unreadCount} new</span>
      </div>
      <div className="max-h-72 overflow-auto p-2">
        {notifications.length > 0 ? notifications.map(n => (
          <div
            key={n.id}
            className={`p-3 rounded-xl transition border focus-within:ring-2 focus-within:ring-cyan-400/40 ${
              n.read
                ? "border-slate-800/60 bg-slate-900/40"
                : "border-slate-700/60 hover:bg-slate-800/50"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-slate-100 text-sm">{n.title}</div>
                <div className="text-slate-400 text-xs mt-0.5">{n.desc}</div>
                <div className="text-slate-500 text-[10px] mt-1">{n.time} ago</div>
              </div>
              <span className="ml-3 text-[10px] px-2 py-0.5 rounded-md border border-slate-600/60 text-slate-300">{n.tag}</span>
            </div>
          </div>
        )) : (
          <div className="py-8">
            <Empty description={<span className="text-slate-500 text-xs">You're all caught up</span>} image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </div>
        )}
      </div>
      <div className="px-3 py-2 border-t border-slate-800/60 flex items-center justify-between gap-2">
        <button
          className="text-xs px-2.5 py-1 rounded-md border border-slate-700/60 text-slate-200 hover:bg-slate-800/60 inline-flex items-center gap-1"
          onClick={markAllRead}
        >
          <CheckCircleOutlined /> Mark all read
        </button>
        <button
          className="text-xs px-2.5 py-1 rounded-md border border-slate-700/60 text-slate-200 hover:bg-slate-800/60 inline-flex items-center gap-1"
          onClick={clearAll}
        >
          <ClearOutlined /> Clear
        </button>
      </div>
    </div>
  );

  const bellButtonClasses = useMemo(
    () =>
      `relative h-9 w-9 grid place-items-center rounded-xl transition
       ring-1 ${notifOpen ? "ring-blue-500/50" : "ring-slate-700/60"}
       ${notifOpen ? "bg-blue-500/10" : "bg-slate-800/40 hover:bg-slate-800/60"}
       shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]`,
    [notifOpen]
  );

  const handleLogout = () => {
    try {
      logout();
    } catch (e) {
      // ignore demo errors
    } finally {
      navigate("/login");
    }
  };

  const antdConfig = useMemo(() => ({
    algorithm: antdTheme.darkAlgorithm,
    token: {
      colorPrimary: accent,
      colorLink: accent,
      colorInfo: accent,
      colorBgContainer: 'transparent',
      colorBgElevated: 'transparent',
      borderRadius: 16,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
    components: {
      Card: { headerBg: 'transparent', bodyBg: 'transparent' },
      Layout: { bodyBg: 'transparent', headerBg: 'transparent', siderBg: 'transparent' },
      Button: { borderRadius: 12 },
      Tag: {},
    }
  }), [accent]);

  return (
    <ConfigProvider theme={antdConfig}>
      {/* Global mouse-follow light overlay */}
      <MouseLight />
      <div className="min-h-screen bg-[radial-gradient(1200px_800px_at_10%_-10%,rgba(59,130,246,0.12),transparent),radial-gradient(1200px_800px_at_90%_110%,rgba(99,102,241,0.12),transparent)] text-slate-200">
        <div className="flex">
          {/* Sidebar */}
          <aside className="hidden md:flex md:w-64 lg:w-72 flex-col glass min-h-screen border-r border-slate-800/60" aria-label="App navigation">
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
                    `flex items-center gap-3 px-3 py-2 rounded-xl transition border focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 ${
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
          <main className="flex-1" role="main" id="main">
            {/* Top bar */}
            <div className="sticky top-0 z-10 supports-[backdrop-filter]:backdrop-blur bg-slate-900/40 border-b border-slate-800/60">
              <div className="h-14 flex items-center justify-between px-4">
                <div className="md:hidden">
                  {/* Placeholder for mobile menu button, future enhancement */}
                </div>
                <div className="text-sm text-slate-400">Immersive AI Control Center</div>
                <div className="flex items-center gap-2">
                  {/* Wrap trigger to provide a stable local positioning context */}
                  <div id="notif-anchor" style={{ position: 'relative' }}>
                    <Dropdown
                      open={notifOpen}
                      onOpenChange={(open) => setNotifOpen(open)}
                      dropdownRender={() => notifMenu}
                      placement="bottomRight"
                      trigger={["click"]}
                      mouseEnterDelay={0.05}
                      mouseLeaveDelay={0.12}
                      arrow
                      autoAdjustOverflow
                      destroyPopupOnHide
                      overlayStyle={{ marginTop: 8, top: 150, right:10, width: 'auto', maxWidth: 'calc(100vw - 32px)' }}
                      // Render inside the anchor so popup aligns to the bell and ignores body transforms
                      getPopupContainer={() => document.getElementById('notif-anchor') || document.body}
                    >
                    <button
  className={bellButtonClasses}
  aria-label="Notifications"
  title="Notifications"
  // // Use opacity instead of visibility
  // style={{ opacity: notifOpen ? 0 : 1 }}
  onClick={(e) => e.preventDefault()}
>
  <span
    className="relative inline-flex items-center justify-center gap-1"
    style={{ transform: 'translateZ(0)' }}
  >
    <BellOutlined className="text-slate-200" />
    {unreadCount > 0 && !notifOpen && (
      <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
    )}
  </span>
</button>

                    </Dropdown>
                  </div>
                  <button
                    className="px-2.5 py-1.5 rounded-lg border border-red-500/40 bg-red-500/10 hover:bg-red-500/20 text-red-300"
                    onClick={handleLogout}
                    title="Logout"
                  >
                    <LogoutOutlined />
                  </button>
                </div>
              </div>
            </div>

            {/* Page container */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="px-4 md:px-6 py-4 md:py-6 max-w-7xl mx-auto"
              data-route-container
            >
              <Outlet />
            </motion.div>
          </main>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default MainLayout;

