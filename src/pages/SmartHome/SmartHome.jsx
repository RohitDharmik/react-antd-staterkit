import React, { useEffect, useMemo, useState } from "react";
import { Card, Button, Tag, List, Avatar, Switch, Modal, Input, Select } from "antd";
import { motion } from "framer-motion";
import { Lightbulb, Power, Thermometer, Fan, Plug, House, Wifi, Radio, Sun, Moon, Flame } from "lucide-react";

// Mocked Home Assistant + MQTT stubs
const mockEntities = [
  { id: "light.living", type: "light", name: "Living Room", state: "on", brightness: 78, room: "Living", icon: <Lightbulb size={16} /> },
  { id: "light.kitchen", type: "light", name: "Kitchen", state: "off", brightness: 0, room: "Kitchen", icon: <Lightbulb size={16} /> },
  { id: "switch.plug_3d", type: "plug", name: "3D Printer", state: "off", room: "Lab", icon: <Plug size={16} /> },
  { id: "climate.hvac", type: "ac", name: "HVAC", state: "cool", temp: 22, fan: "auto", room: "Whole Home", icon: <Thermometer size={16} /> },
  { id: "fan.ceiling", type: "fan", name: "Ceiling Fan", state: "on", speed: 2, room: "Bedroom", icon: <Fan size={16} /> },
];

const scenePresets = [
  { id: "scene.relax", name: "Relax", accent: "purple", desc: "Warm dim lights, soft fan" },
  { id: "scene.focus", name: "Focus", accent: "blue", desc: "Cool bright lights, AC cool" },
  { id: "scene.sleep", name: "Sleep", accent: "amber", desc: "Lights off, AC auto, fan low" },
];

export default function SmartHome() {
  const [entities, setEntities] = useState(mockEntities);
  const [isSceneOpen, setSceneOpen] = useState(false);
  const [filter, setFilter] = useState("all");

  // Mock real-time updates
  useEffect(() => {
    const t = setInterval(() => {
      setEntities((list) =>
        list.map((e) =>
          e.type === "light" && e.state === "on"
            ? { ...e, brightness: Math.max(10, Math.min(100, e.brightness + (Math.random() > 0.5 ? 1 : -1))) }
            : e
        )
      );
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const visible = useMemo(() => {
    if (filter === "all") return entities;
    if (filter === "lights") return entities.filter((e) => e.type === "light");
    if (filter === "climate") return entities.filter((e) => e.type === "ac");
    if (filter === "switches") return entities.filter((e) => e.type === "plug" || e.type === "fan");
    return entities;
  }, [filter, entities]);

  const toggleEntity = (id) => {
    setEntities((list) =>
      list.map((e) =>
        e.id === id
          ? {
              ...e,
              state:
                e.type === "light" || e.type === "plug" || e.type === "fan"
                  ? e.state === "on"
                    ? "off"
                    : "on"
                  : e.type === "ac"
                  ? e.state === "cool"
                    ? "off"
                    : "cool"
                  : e.state,
            }
          : e
      )
    );
  };

  const applyScene = (sceneId) => {
    setEntities((list) =>
      list.map((e) => {
        if (sceneId === "scene.relax") {
          if (e.type === "light") return { ...e, state: "on", brightness: 35 };
          if (e.type === "ac") return { ...e, state: "off" };
          if (e.type === "fan") return { ...e, state: "on", speed: 1 };
        }
        if (sceneId === "scene.focus") {
          if (e.type === "light") return { ...e, state: "on", brightness: 85 };
          if (e.type === "ac") return { ...e, state: "cool", temp: 21, fan: "auto" };
          if (e.type === "fan") return { ...e, state: "off" };
        }
        if (sceneId === "scene.sleep") {
          if (e.type === "light") return { ...e, state: "off", brightness: 0 };
          if (e.type === "ac") return { ...e, state: "auto", temp: 24, fan: "low" };
          if (e.type === "fan") return { ...e, state: "on", speed: 1 };
        }
        return e;
      })
    );
    setSceneOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-200">Smart Home Control</h2>
          <div className="text-slate-400 text-sm">Home Assistant + MQTT (mocked)</div>
        </div>
        <div className="flex items-center gap-2">
          <Select
            size="small"
            value={filter}
            onChange={setFilter}
            options={[
              { value: "all", label: "All" },
              { value: "lights", label: "Lights" },
              { value: "switches", label: "Switches" },
              { value: "climate", label: "Climate" },
            ]}
            className="min-w-[140px]"
          />
          <Button onClick={() => setSceneOpen(true)} className="border border-slate-700 bg-slate-800/40 text-slate-200">
            Scenes
          </Button>
        </div>
      </div>

      {/* Scenes */}
      <Card className="glass hover-lift" bodyStyle={{ padding: 16 }}>
        <div className="grid md:grid-cols-3 gap-3">
          {scenePresets.map((s) => (
            <button
              key={s.id}
              onClick={() => applyScene(s.id)}
              className="p-3 rounded-xl border border-slate-700/60 bg-slate-800/40 text-left hover:bg-slate-800/60 transition"
            >
              <div className="flex items-center justify-between">
                <div className="text-slate-200 font-medium">{s.name}</div>
                <Tag color={s.accent}>{s.accent}</Tag>
              </div>
              <div className="text-xs text-slate-500 mt-1">{s.desc}</div>
            </button>
          ))}
        </div>
      </Card>

      {/* Entities */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <Card className="glass hover-lift" bodyStyle={{ padding: 12 }}>
          <List
            itemLayout="horizontal"
            dataSource={visible}
            renderItem={(e) => (
              <List.Item
                actions={[
                  <Tag key="type" className="border-slate-600 bg-slate-800/40 text-slate-300">
                    {e.type}
                  </Tag>,
                  <Switch
                    key="toggle"
                    checked={e.type === "ac" ? e.state !== "off" : e.state === "on"}
                    onChange={() => toggleEntity(e.id)}
                  />,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar className="bg-slate-800 border border-slate-700">{e.icon}</Avatar>}
                  title={
                    <div className="flex items-center gap-2">
                      <span className="text-slate-200">{e.name}</span>
                      <Tag color={e.state === "on" || e.state === "cool" ? "green" : e.state === "off" ? "default" : "blue"}>
                        {String(e.state)}
                      </Tag>
                    </div>
                  }
                  description={
                    <div className="text-slate-400 text-xs flex items-center gap-3">
                      <House size={12} /> {e.room}
                      {e.type === "light" && <><Sun size={12} /> {e.brightness}%</>}
                      {e.type === "ac" && (
                        <>
                          <Thermometer size={12} /> {e.temp}°C <Radio size={12} /> {e.fan}
                        </>
                      )}
                      {e.type === "fan" && (
                        <>
                          <Fan size={12} /> speed {e.speed}
                        </>
                      )}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      </motion.div>

      {/* Scenes modal */}
      <Modal
        title="Apply Scene"
        open={isSceneOpen}
        onCancel={() => setSceneOpen(false)}
        footer={null}
        className="dark"
      >
        <div className="space-y-3">
          {scenePresets.map((s) => (
            <Card key={s.id} className="bg-slate-900/60 border border-slate-700/60">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-slate-200">{s.name}</div>
                  <div className="text-xs text-slate-500">{s.desc}</div>
                </div>
                <Button onClick={() => applyScene(s.id)} className="border border-slate-700 bg-slate-800/40 text-slate-200">
                  Apply
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Modal>
    </div>
  );
}