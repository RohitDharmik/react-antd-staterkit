import React, { useEffect, useState } from "react";
import { Card, Tag, Button, Progress, List, Avatar, Switch } from "antd";
import { motion } from "framer-motion";
import { Smartphone, Monitor, Watch, RefreshCw, Wifi, Battery, Cloud } from "lucide-react";

const mockDevices = [
  { id: "pc-01", type: "PC", name: "Quantum Workstation", status: "online", battery: null, wifi: -52, lastSync: "2m ago" },
  { id: "phone-12", type: "Phone", name: "Pixel X", status: "online", battery: 78, wifi: -60, lastSync: "30s ago" },
  { id: "watch-77", type: "Wearable", name: "NeuroBand", status: "sleeping", battery: 55, wifi: -70, lastSync: "10m ago" },
];

const typeIcon = (type) => {
  if (type === "PC") return <Monitor size={18} />;
  if (type === "Phone") return <Smartphone size={18} />;
  return <Watch size={18} />;
};

export default function DeviceSync() {
  const [devices, setDevices] = useState(mockDevices);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const i = setInterval(() => {
      setDevices((d) =>
        d.map((x) =>
          x.battery !== null
            ? { ...x, battery: Math.max(0, x.battery - Math.floor(Math.random() * 3)) }
            : x
        )
      );
    }, 8000);
    return () => clearInterval(i);
  }, []);

  const handleSyncAll = async () => {
    setSyncing(true);
    await new Promise((r) => setTimeout(r, 1200));
    setDevices((d) => d.map((x) => ({ ...x, lastSync: "just now" })));
    setSyncing(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-200">Device Sync</h2>
        <Button
          icon={<RefreshCw size={16} />}
          loading={syncing}
          onClick={handleSyncAll}
          className="border border-slate-700 bg-slate-800/40 text-slate-200"
        >
          Sync All
        </Button>
      </div>

      <Card className="glass hover-lift" bodyStyle={{ padding: 16 }}>
        <List
          itemLayout="horizontal"
          dataSource={devices}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Tag key="status" color={item.status === "online" ? "green" : "default"}>{item.status}</Tag>,
                item.battery !== null ? (
                  <div key="batt" className="flex items-center gap-1 text-slate-400">
                    <Battery size={14} /> {item.battery}%
                  </div>
                ) : (
                  <span key="batt" />
                ),
                <div key="wifi" className="flex items-center gap-1 text-slate-400">
                  <Wifi size={14} /> {item.wifi} dBm
                </div>,
                <div key="ls" className="text-slate-500">{item.lastSync}</div>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar shape="square" className="bg-slate-800 border border-slate-700">
                    {typeIcon(item.type)}
                  </Avatar>
                }
                title={
                  <div className="flex items-center gap-2">
                    <span className="text-slate-200">{item.name}</span>
                    <Tag className="border-slate-600 bg-slate-800/40 text-slate-300">{item.type}</Tag>
                  </div>
                }
                description={
                  <div className="text-slate-400 text-sm flex items-center gap-2">
                    <Cloud size={14} /> Synced via cloud channel
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="grid md:grid-cols-3 gap-4"
      >
        {devices.map((d) => (
          <Card key={d.id} className="glass hover-lift" bodyStyle={{ padding: 16 }}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="text-slate-300">{typeIcon(d.type)}</div>
                <div>
                  <div className="text-slate-200 text-sm">{d.name}</div>
                  <div className="text-xs text-slate-500">ID: {d.id}</div>
                </div>
              </div>
              <Tag color={d.status === "online" ? "green" : "default"}>{d.status}</Tag>
            </div>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Auto-sync</span>
                <Switch defaultChecked />
              </div>
              {d.battery !== null && (
                <Progress percent={d.battery} size="small" strokeColor="#3b82f6" />
              )}
              <Button className="w-full border border-slate-700 bg-slate-800/40 text-slate-300">Open Controls</Button>
            </div>
          </Card>
        ))}
      </motion.div>
    </div>
  );
}