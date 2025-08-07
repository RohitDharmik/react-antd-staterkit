import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import {
  Layout,
  Row,
  Col,
  Card,
  Statistic,
  Typography,
  Button,
  List,
  Avatar,
  Progress,
  ConfigProvider,
  theme,
  Badge,
  Tooltip,
  Space,
  Tag,
  Divider,
  Switch,
  Alert,
} from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  BellOutlined,
  PoweroffOutlined,
  SecurityScanOutlined,
  DashboardOutlined,
  RocketOutlined,
  GitlabOutlined ,
  ApiOutlined,
  GlobalOutlined,
  
  ExperimentOutlined,
  FundOutlined,
  ClockCircleOutlined,
  FireOutlined,
  StarOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { PiShieldCheckLight } from "react-icons/pi";
import { gsap } from 'gsap';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip as RTooltip, PieChart, Pie, Cell } from 'recharts';
import { Cpu, Wifi, Settings, Search, Zap, Gauge, Activity, Radio } from 'lucide-react';
import { motion, useMotionValue } from "framer-motion";


const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

// Lightweight UI primitives via Tailwind utility classes
const panelClass = 'glass hover-lift relative overflow-hidden';
const accentClass = 'glass-accent hover-lift relative overflow-hidden';

function GlassCard({ className = '', children, ...rest }) {
  return (
    <div className={`${panelClass} ${className}`} {...rest}>
      {children}
    </div>
  );
}

function SectionHeader({ icon, title, right }) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-slate-200">{title}</span>
      </div>
      {right}
    </div>
  );
}

function IconButton({ icon, label }) {
  return (
    <button className="px-3 py-2 rounded-xl bg-slate-800/30 border border-slate-500/20 text-slate-200 hover:bg-slate-800/50 transition flex items-center gap-2">
      {icon}
      {label && <span className="text-sm">{label}</span>}
    </button>
  );
}

// Data
const notifications = [
  {
    id: 1,
    title: 'Neural Network Optimization Complete',
    description: 'Model "Orion-3" accuracy improved by 12.4% with new quantum algorithms',
    avatar: <GitlabOutlined  style={{ color: '#10b981' }} />,
    type: 'success',
    timestamp: '2 min ago',
    priority: 'high',
    category: 'AI',
    progress: 100,
    isNew: true,
  },
  {
    id: 2,
    title: 'Security Scan Completed',
    description: 'System vulnerability assessment finished. 0 critical issues found.',
    avatar: <PiShieldCheckLight  style={{ color: '#3b82f6' }} />,
    type: 'info',
    timestamp: '5 min ago',
    priority: 'medium',
    category: 'Security',
    progress: 100,
    isNew: true,
  },
  {
    id: 3,
    title: 'Energy Optimization Active',
    description: 'Smart power management reduced consumption by 18%',
    avatar: <ThunderboltOutlined style={{ color: '#f59e0b' }} />,
    type: 'warning',
    timestamp: '12 min ago',
    priority: 'medium',
    category: 'System',
    progress: 75,
    isNew: false,
  },
  {
    id: 4,
    title: 'Device Network Expanded',
    description: '3 new IoT devices connected to the mesh network',
    avatar: <ApiOutlined style={{ color: '#8b5cf6' }} />,
    type: 'info',
    timestamp: '1 hour ago',
    priority: 'low',
    category: 'Network',
    progress: 100,
    isNew: false,
  },
];

// Enhanced device statistics
const deviceStats = [
  { 
    title: 'Neural Processors', 
    value: 8, 
    icon: <GitlabOutlined  />, 
    color: '#3b82f6',
    trend: 'up',
    percentage: 12,
    subtitle: 'Active AI Cores',
    status: 'optimal'
  },
  { 
    title: 'Quantum Sensors', 
    value: 24, 
    icon: <ExperimentOutlined />, 
    color: '#10b981',
    trend: 'up',
    percentage: 8,
    subtitle: 'Environmental Monitors',
    status: 'excellent'
  },
  { 
    title: 'Security Nodes', 
    value: 16, 
    icon: <PiShieldCheckLight  />, 
    color: '#f59e0b',
    trend: 'stable',
    percentage: 0,
    subtitle: 'Protection Systems',
    status: 'secure'
  },
  { 
    title: 'Network Mesh', 
    value: 156, 
    icon: <GlobalOutlined />, 
    color: '#8b5cf6',
    trend: 'up',
    percentage: 24,
    subtitle: 'Connected Devices',
    status: 'expanding'
  },
];

// System performance data
const systemPerformance = [
  {
    title: 'CPU Clusters',
    value: 82,
    color: ['#3b82f6', '#1d4ed8'],
    icon: <RocketOutlined />,
    status: 'optimal'
  },
  {
    title: 'Memory Banks',
    value: 65,
    color: ['#10b981', '#059669'],
    icon: <DashboardOutlined />,
    status: 'good'
  },
  {
    title: 'Neural Load',
    value: 91,
    color: ['#8b5cf6', '#7c3aed'],
    icon: <GitlabOutlined  />,
    status: 'high'
  },
  {
    title: 'Quantum State',
    value: 78,
    color: ['#f59e0b', '#d97706'],
    icon: <ExperimentOutlined />,
    status: 'stable'
  },
];

// Quick action buttons with enhanced design
const quickActions = [
  { 
    label: 'Emergency Protocol', 
    icon: <PoweroffOutlined />, 
    type: 'danger', 
    description: 'Activate safety systems',
    hotkey: 'Ctrl+E'
  },
  { 
    label: 'Neural Boost', 
    icon: <GitlabOutlined  />, 
    type: 'primary', 
    description: 'Enhance AI processing',
    hotkey: 'Ctrl+N'
  },
  { 
    label: 'System Scan', 
    icon: <SecurityScanOutlined />, 
    type: 'default', 
    description: 'Full diagnostic check',
    hotkey: 'Ctrl+S'
  },
  { 
    label: 'Quantum Sync', 
    icon: <ExperimentOutlined />, 
    type: 'primary', 
    description: 'Synchronize quantum states',
    hotkey: 'Ctrl+Q'
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const cardHoverVariants = {
  hover: {
    scale: 1.02,
    y: -5,
    boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.6)',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
};

const glowVariants = {
  animate: {
    boxShadow: [
      '0 0 20px rgba(59, 130, 246, 0.3)',
      '0 0 40px rgba(59, 130, 246, 0.5)',
      '0 0 20px rgba(59, 130, 246, 0.3)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Enhanced Chart Component (Mock visualization)
const EnhancedChart = ({ data, type = 'area' }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % data.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [data.length]);

  return (
    <div className="relative h-48 overflow-hidden rounded-xl">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 animate-pulse" />
      <div className="relative h-full flex items-end justify-around p-4">
        {data.map((item, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center space-y-2"
            animate={{
              scale: activeIndex === index ? 1.1 : 1,
              opacity: activeIndex === index ? 1 : 0.7,
            }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className={`w-8 bg-gradient-to-t rounded-t-lg ${
                index === activeIndex
                  ? 'from-blue-400 to-purple-400'
                  : 'from-slate-600 to-slate-400'
              }`}
              style={{ height: `${item.value}%` }}
              animate={{ height: `${item.value}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
            <Text className="text-xs text-slate-400">{item.label}</Text>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Real-time status indicator
const StatusIndicator = ({ status, pulse = false }) => {
  const statusColors = {
    optimal: '#10b981',
    excellent: '#3b82f6',
    good: '#10b981',
    secure: '#f59e0b',
    expanding: '#8b5cf6',
    high: '#f59e0b',
    stable: '#10b981',
  };

  return (
    <motion.div
      className="flex items-center space-x-2"
      animate={pulse ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <div
        className="w-2 h-2 rounded-full"
        style={{
          backgroundColor: statusColors[status],
          boxShadow: `0 0 10px ${statusColors[status]}`,
        }}
      />
      <Text className="text-xs capitalize text-slate-300">{status}</Text>
    </motion.div>
  );
};

const Dashboard = () => {
  const [isNeuralMode, setIsNeuralMode] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const chartData = [
    { label: 'CPU', value: 82 },
    { label: 'GPU', value: 65 },
    { label: 'RAM', value: 91 },
    { label: 'NET', value: 78 },
    { label: 'QNT', value: 88 },
  ];

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#3b82f6',
          colorSuccess: '#10b981',
          colorWarning: '#f59e0b',
          colorError: '#ef4444',
          borderRadius: 16,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          fontSize: 14,
          colorBgContainer: 'transparent',
          colorBgElevated: 'transparent',
        },
        components: {
          Card: {
            headerBg: 'transparent',
            bodyBg: 'transparent',
          },
          Layout: {
            bodyBg: 'transparent',
            headerBg: 'transparent',
            siderBg: 'transparent',
          },
          Progress: {
            circleTextColor: '#fff',
          },
          Button: {
            colorBgContainer: 'rgba(59, 130, 246, 0.1)',
            colorBorder: 'rgba(59, 130, 246, 0.3)',
            borderRadius: 12,
          },
        },
      }}
    >
      <Layout style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-30"
              animate={{
                x: [0, window.innerWidth],
                y: [
                  Math.random() * window.innerHeight,
                  Math.random() * window.innerHeight,
                ],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
              style={{
                left: Math.random() * window.innerWidth,
                top: Math.random() * window.innerHeight,
              }}
            />
          ))}
        </div>

        <Content style={{ padding: '32px', position: 'relative' }}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Header Section (modernized with Tailwind + icons) */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-light bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
                    Neural Command Center
                  </h1>
                  <p className="text-slate-400 mt-2">
                    Advanced AI Assistant Hub — {currentTime.toLocaleTimeString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`${panelClass} px-3 py-2 flex items-center gap-2`}>
                    <Search size={16} className="text-slate-300" />
                    <input
                      placeholder="Search devices, automations..."
                      className="bg-transparent outline-none text-slate-200 placeholder:text-slate-500"
                    />
                  </div>
                  <Tooltip title="Toggle Neural Enhancement Mode">
                    <div className={`${panelClass} px-3 py-2 flex items-center gap-2`}>
                      <span className="text-slate-400 text-sm">Neural Mode</span>
                      <Switch
                        checked={isNeuralMode}
                        onChange={setIsNeuralMode}
                        style={{ backgroundColor: isNeuralMode ? '#3b82f6' : '#475569' }}
                      />
                    </div>
                  </Tooltip>
                  <Badge dot color="#10b981">
                    <Button type="text" icon={<BellOutlined />} size="large" />
                  </Badge>
                </div>
              </div>
            </div>

            {/* Status Alert */}
            <div className="mb-6">
              <div className="glass rounded-2xl border border-emerald-500/30 p-4">
                <div className="flex items-start gap-3">
                  <div className="text-emerald-400 mt-0.5"><GitlabOutlined  /></div>
                  <div className="flex-1">
                    <div className="text-slate-200">System Status: All Neural Networks Operating at Peak Performance</div>
                    <div className="text-slate-400 text-sm mt-1">
                      Quantum processors synchronized, security protocols active, energy optimization at 94%
                    </div>
                  </div>
                  <IconButton label="View Details" icon={<span className="w-1.5 h-1.5 rounded-full bg-emerald-400 block" />} />
                </div>
              </div>
            </div>

            <Row gutter={[24, 24]}>
              {/* Device Statistics */}
              {deviceStats.map((stat, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                  <motion.div
                    variants={{
                      ...itemVariants,
                      hover: cardHoverVariants.hover,
                    }}
                    whileHover="hover"
                  >
                    <Card
                      className="glass hover-lift"
                      bodyStyle={{ padding: '20px' }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div style={{ color: stat.color, fontSize: '24px' }}>
                          {stat.icon}
                        </div>
                        <StatusIndicator status={stat.status} pulse={index === 0} />
                      </div>
                      <Statistic
                        title={
                          <div>
                            <Text style={{ color: '#e2e8f0', fontWeight: 500 }}>
                              {stat.title}
                            </Text>
                            <br />
                            <Text style={{ color: '#64748b', fontSize: '12px' }}>
                              {stat.subtitle}
                            </Text>
                          </div>
                        }
                        value={stat.value}
                        valueStyle={{ 
                          color: stat.color, 
                          fontWeight: 600,
                          fontSize: '2rem'
                        }}
                        suffix={
                          stat.trend !== 'stable' && (
                            <span style={{ fontSize: '14px', marginLeft: '8px' }}>
                              {stat.trend === 'up' ? (
                                <ArrowUpOutlined style={{ color: '#10b981' }} />
                              ) : (
                                <ArrowDownOutlined style={{ color: '#ef4444' }} />
                              )}
                              {stat.percentage}%
                            </span>
                          )
                        }
                      />
                    </Card>
                  </motion.div>
                </Col>
              ))}

              {/* System Performance + Area Recharts */}
              <Col xs={24} lg={16}>
                <div className={panelClass}>
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-2">
                      <DashboardOutlined style={{ color: '#3b82f6' }} />
                      <span className="text-slate-200">System Performance Matrix</span>
                    </div>
                    <Tag color="blue" icon={<FireOutlined />}>Real-time</Tag>
                  </div>
                  <div className="px-4 pb-4">
                    <Row gutter={[16, 16]} align="middle">
                      {systemPerformance.map((item, index) => (
                        <Col xs={12} sm={6} key={index}>
                          <div className="text-center">
                            <div className="mb-2" style={{ color: item.color[0], fontSize: '20px' }}>
                              {item.icon}
                            </div>
                            <Progress
                              type="dashboard"
                              percent={item.value}
                              strokeColor={{ '0%': item.color[0], '100%': item.color[1] }}
                              strokeWidth={8}
                            />
                            <div className="mt-1">
                              <StatusIndicator status={item.status} />
                            </div>
                          </div>
                        </Col>
                      ))}
                    </Row>

                    <Divider style={{ borderColor: 'rgba(148,163,184,0.2)', margin: '16px 0' }} />

                    <div className="h-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={[{ t: '00:00', v: 22 }, { t: '04:00', v: 45 }, { t: '08:00', v: 65 }, { t: '12:00', v: 88 }, { t: '16:00', v: 72 }, { t: '20:00', v: 60 }]}>
                          <defs>
                            <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="t" stroke="#64748b" />
                          <YAxis stroke="#64748b" />
                          <RTooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 12, color: '#e2e8f0' }}/>
                          <Area type="monotone" dataKey="v" stroke="#3b82f6" fill="url(#colorPerf)" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </Col>

              {/* Quick Actions (Tailwind glass buttons) */}
              <Col xs={24} lg={8}>
                <GlassCard className="p-4 bg-glass-accent">
                  <SectionHeader
                    icon={<ThunderboltOutlined style={{ color: '#f59e0b' }} />}
                    title="Quantum Commands"
                  />
                  <div className="space-y-3 px-1 pb-1">
                    {quickActions.map((action, idx) => (
                      <button
                        key={idx}
                        className="w-full text-left glass hover-lift p-4 rounded-xl border border-slate-500/30 transition flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="text-xl"
                            style={{
                              color: action.type === 'danger' ? '#ef4444' :
                                     action.type === 'primary' ? '#3b82f6' : '#94a3b8'
                            }}
                          >
                            {action.icon}
                          </div>
                          <div>
                            <div className="text-slate-200 font-medium">{action.label}</div>
                            <div className="text-slate-500 text-xs">{action.description}</div>
                          </div>
                        </div>
                        <span className="text-[10px] px-2 py-1 rounded-md border border-blue-500/30 text-blue-400 bg-blue-500/10">
                          {action.hotkey}
                        </span>
                      </button>
                    ))}
                  </div>
                </GlassCard>
              </Col>

              {/* Notifications */}
              <Col xs={24} lg={16}>
                <div className={panelClass}>
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-2">
                      <BellOutlined style={{ color: '#8b5cf6' }} />
                      <span className="text-slate-200">Neural Activity Feed</span>
                    </div>
                    <Badge count={notifications.filter(n => n.isNew).length} size="small" />
                  </div>
                  <div className="px-3 pb-3">
                    <List
                      itemLayout="horizontal"
                      dataSource={notifications}
                      renderItem={(item, index) => (
                        <div className="p-3 my-2 rounded-xl border transition-colors duration-200"
                             style={{
                               background: item.isNew ? 'rgba(59,130,246,0.05)' : 'transparent',
                               borderColor: item.isNew ? 'rgba(59,130,246,0.2)' : 'transparent'
                             }}>
                          <List.Item style={{ padding: 0 }}>
                            <List.Item.Meta
                              avatar={<Avatar size="large" icon={item.avatar} style={{ backgroundColor: 'transparent', border: '1px solid rgba(148,163,184,0.2)' }} />}
                              title={<div className="flex items-center gap-2"><span className="text-slate-200">{item.title}</span>{item.isNew && <Tag color="blue" style={{ height: 18, lineHeight: '16px' }}>NEW</Tag>}</div>}
                              description={
                                <div>
                                  <span className="text-slate-400">{item.description}</span>
                                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                                    <ClockCircleOutlined /> {item.timestamp}
                                  </div>
                                </div>
                              }
                            />
                            <div className="text-right">
                              {item.progress < 100 && (
                                <Progress percent={item.progress} size="small" showInfo={false} strokeColor="#3b82f6" style={{ width: '80px' }} />
                              )}
                            </div>
                          </List.Item>
                        </div>
                      )}
                    />
                  </div>
                </div>
              </Col>

              {/* Neural Efficiency + Pie Recharts */}
              <Col xs={24} lg={8}>
                <div className={accentClass}>
                  <div className="flex items-center gap-2 p-4">
                    <FundOutlined style={{ color: '#10b981' }} />
                    <span className="text-slate-200">Neural Efficiency</span>
                  </div>
                  <div className="px-4 pb-4">
                    <div className="text-center mb-4">
                      <Statistic title={<span className="text-slate-400">Optimization Gain</span>} value={94.7} precision={1} valueStyle={{ color: '#10b981', fontSize: '2.2rem', fontWeight: 'bold' }} prefix={<ArrowUpOutlined />} suffix="%" />
                      <Progress percent={94.7} showInfo={false} strokeColor={{ '0%': '#10b981', '100%': '#059669' }} strokeWidth={8} style={{ marginTop: 12 }} />
                    </div>
                    <Divider style={{ borderColor: 'rgba(16,185,129,0.3)' }} />
                    <div className="h-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={[{ name: 'CPU', value: 35 }, { name: 'GPU', value: 25 }, { name: 'RAM', value: 20 }, { name: 'NET', value: 20 }]} dataKey="value" cx="50%" cy="50%" outerRadius={70}>
                            {['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'].map((c, i) => (
                              <Cell key={i} fill={c} />
                            ))}
                          </Pie>
                          <RTooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 12, color: '#e2e8f0' }}/>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-slate-400"><span>Energy Saved</span><span className="text-emerald-400 font-semibold">1.2 TW</span></div>
                      <div className="flex justify-between text-slate-400"><span>Processing Speed</span><span className="text-blue-400 font-semibold">+847%</span></div>
                      <div className="flex justify-between text-slate-400"><span>Network Latency</span><span className="text-amber-400 font-semibold">0.003ms</span></div>
                    </div>
                    <div className="mt-4 text-center">
                      <Tag icon={<StarOutlined />} color="gold" style={{ fontSize: 12, padding: '4px 12px' }}>Peak Performance Achieved</Tag>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </motion.div>
        </Content>
      </Layout>
    </ConfigProvider>
  );
};

export default Dashboard;
