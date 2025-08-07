import React from "react";
import { Card, Tag, List, Avatar, DatePicker, Select } from "antd";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip as RTooltip, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { BarChart3, Activity, Clock, Cpu, Cpu as CpuIcon, Radio, Bot, Zap } from "lucide-react";

const usageOverTime = [
  { t: "00", cmds: 12, devices: 4 },
  { t: "02", cmds: 18, devices: 5 },
  { t: "04", cmds: 8, devices: 3 },
  { t: "06", cmds: 25, devices: 8 },
  { t: "08", cmds: 32, devices: 12 },
  { t: "10", cmds: 28, devices: 10 },
  { t: "12", cmds: 40, devices: 14 },
  { t: "14", cmds: 36, devices: 12 },
  { t: "16", cmds: 30, devices: 10 },
  { t: "18", cmds: 48, devices: 15 },
  { t: "20", cmds: 44, devices: 14 },
  { t: "22", cmds: 26, devices: 9 },
];

const deviceEvents = [
  { k: "light", label: "Lights", value: 35, color: "#3b82f6" },
  { k: "plugs", label: "Plugs", value: 22, color: "#10b981" },
  { k: "climate", label: "Climate", value: 18, color: "#f59e0b" },
  { k: "media", label: "Media", value: 11, color: "#8b5cf6" },
  { k: "other", label: "Other", value: 14, color: "#94a3b8" },
];

const topCommands = [
  { id: "c1", text: "Turn on living lights", count: 18, latency: "120ms" },
  { id: "c2", text: "Set AC to 22", count: 14, latency: "180ms" },
  { id: "c3", text: "Good night scene", count: 11, latency: "150ms" },
  { id: "c4", text: "Start focus mode", count: 9, latency: "210ms" },
];

const logs = [
  { id: "l1", time: "10:22:11", type: "mqtt", msg: "home/living/light ON" },
  { id: "l2", time: "10:21:44", type: "assistant", msg: "intent: set_temperature 22" },
  { id: "l3", time: "10:19:08", type: "device", msg: "sensor.energy updated 312W" },
  { id: "l4", time: "10:18:59", type: "assistant", msg: "summary: 4 cmds last 5m" },
];

export default function Analytics() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-200">Analytics</h2>
          <div className="text-slate-400 text-sm">Usage trends • Device logs • Top commands (mock)</div>
        </div>
        <div className="flex items-center gap-2">
          <DatePicker.RangePicker className="bg-transparent text-slate-200" />
          <Select
            defaultValue="24h"
            options={[
              { value: "24h", label: "Last 24h" },
              { value: "7d", label: "Last 7 days" },
              { value: "30d", label: "Last 30 days" },
            ]}
            className="min-w-[120px]"
          />
        </div>
      </div>

      {/* KPI row */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="glass hover-lift" bodyStyle={{ padding: 16 }}>
          <div className="text-slate-400 text-xs">Total Commands</div>
          <div className="text-2xl text-slate-200 mt-1">307</div>
          <div className="text-xs text-emerald-400 mt-1">+12% vs. prev</div>
        </Card>
        <Card className="glass hover-lift" bodyStyle={{ padding: 16 }}>
          <div className="text-slate-400 text-xs">Avg Latency</div>
          <div className="text-2xl text-slate-200 mt-1">168ms</div>
          <div className="text-xs text-amber-400 mt-1">-8% vs. prev</div>
        </Card>
        <Card className="glass hover-lift" bodyStyle={{ padding: 16 }}>
          <div className="text-slate-400 text-xs">Active Devices</div>
          <div className="text-2xl text-slate-200 mt-1">42</div>
          <div className="text-xs text-blue-400 mt-1">+4 new</div>
        </Card>
        <Card className="glass hover-lift" bodyStyle={{ padding: 16 }}>
          <div className="text-slate-400 text-xs">Automation Fires</div>
          <div className="text-2xl text-slate-200 mt-1">89</div>
          <div className="text-xs text-purple-400 mt-1">+6% vs. prev</div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Area chart */}
        <Card className="glass hover-lift lg:col-span-2" bodyStyle={{ padding: 12 }}>
          <div className="flex items-center justify-between px-1 pb-2">
            <div className="flex items-center gap-2">
              <BarChart3 size={18} className="text-blue-400" />
              <div className="text-slate-200">Usage Over Time</div>
            </div>
            <Tag color="blue">Real-time</Tag>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usageOverTime}>
                <defs>
                  <linearGradient id="cmds" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="devices" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="t" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <RTooltip contentStyle={{ background: "rgba(15,23,42,0.9)", border: "1px solid rgba(148,163,184,0.2)", borderRadius: 12, color: "#e2e8f0" }} />
                <Area type="monotone" dataKey="cmds" stroke="#3b82f6" fill="url(#cmds)" strokeWidth={2} />
                <Area type="monotone" dataKey="devices" stroke="#10b981" fill="url(#devices)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Pie chart */}
        <Card className="glass hover-lift" bodyStyle={{ padding: 12 }}>
          <div className="text-slate-200 mb-2">Events by Domain</div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={deviceEvents} dataKey="value" cx="50%" cy="50%" outerRadius={76}>
                  {deviceEvents.map((d) => (
                    <Cell key={d.k} fill={d.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-1 text-xs">
            {deviceEvents.map((d) => (
              <div key={d.k} className="flex items-center justify-between text-slate-400">
                <span>{d.label}</span>
                <span style={{ color: d.color }}>{d.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Top commands */}
        <Card className="glass hover-lift" bodyStyle={{ padding: 12 }}>
          <div className="text-slate-200 mb-2">Top Commands</div>
          <List
            itemLayout="horizontal"
            dataSource={topCommands}
            renderItem={(c) => (
              <List.Item actions={[<Tag key="cnt" color="blue">{c.count}</Tag>, <Tag key="lat" color="purple">{c.latency}</Tag>]}>
                <List.Item.Meta
                  avatar={<Avatar className="bg-slate-800 border border-slate-700"><Bot size={14} /></Avatar>}
                  title={<div className="text-slate-200">{c.text}</div>}
                  description={<div className="text-slate-500 text-xs">Natural language</div>}
                />
              </List.Item>
            )}
          />
        </Card>

        {/* Live logs */}
        <Card className="glass hover-lift" bodyStyle={{ padding: 12 }}>
          <div className="text-slate-200 mb-2">Device Logs</div>
          <List
            itemLayout="horizontal"
            dataSource={logs}
            renderItem={(l) => (
              <List.Item actions={[<Tag key="type" color={l.type === "mqtt" ? "green" : l.type === "assistant" ? "blue" : "default"}>{l.type}</Tag>]}>
                <List.Item.Meta
                  avatar={<Avatar className="bg-slate-800 border border-slate-700"><Radio size={14} /></Avatar>}
                  title={<div className="text-slate-200">{l.msg}</div>}
                  description={<div className="text-slate-500 text-xs">{l.time}</div>}
                />
              </List.Item>
            )}
          />
        </Card>
      </div>
    </div>
  );
}