import React, { useState } from "react";
import { Card, Button, Tag, Tabs, Slider, Switch, Upload } from "antd";
import { motion } from "framer-motion";
import { Hand, SmilePlus, Layers, Aperture, Play, Rocket, UploadCloud } from "lucide-react";

export default function Labs() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-200">Experimental Labs</h2>
        <div className="text-slate-400 text-sm">Gestures • Emotions • AR overlays • Beta tools (mock)</div>
      </div>

      <Tabs
        defaultActiveKey="gestures"
        items={[
          { key: "gestures", label: "Gestures", children: <GesturesTab /> },
          { key: "emotions", label: "Emotions", children: <EmotionsTab /> },
          { key: "ar", label: "AR Overlays", children: <ARTab /> },
          { key: "beta", label: "Beta Tools", children: <BetaTab /> },
        ]}
      />
    </div>
  );
}

function GesturesTab() {
  const [enabled, setEnabled] = useState(true);
  const [sensitivity, setSensitivity] = useState(60);

  return (
    <Card className="glass hover-lift" bodyStyle={{ padding: 16 }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Hand size={18} className="text-blue-400" />
          <div className="text-slate-200">Gesture Controls</div>
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={enabled} onChange={setEnabled} />
          <Tag color={enabled ? "green" : "default"}>{enabled ? "Enabled" : "Disabled"}</Tag>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div>
          <div className="text-slate-400 text-sm mb-2">Sensitivity</div>
          <Slider value={sensitivity} onChange={setSensitivity} />
        </div>
        <div>
          <div className="text-slate-400 text-sm mb-2">Preview</div>
          <motion.div
            className="h-28 rounded-xl border border-slate-700 bg-slate-800/40 flex items-center justify-center"
            animate={{ rotate: [0, 4, -2, 0], scale: [1, 1.02, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Hand className="text-slate-400" />
          </motion.div>
        </div>
      </div>
    </Card>
  );
}

function EmotionsTab() {
  const [intensity, setIntensity] = useState(40);
  const [enableFX, setEnableFX] = useState(true);

  return (
    <Card className="glass hover-lift" bodyStyle={{ padding: 16 }}>
      <div className="flex items-center gap-2">
        <SmilePlus size={18} className="text-rose-400" />
        <div className="text-slate-200">Emotion Detection</div>
      </div>
      <div className="grid md:grid-cols-3 gap-4 mt-4">
        <div>
          <div className="text-slate-400 text-sm mb-2">Intensity</div>
          <Slider value={intensity} onChange={setIntensity} />
        </div>
        <div>
          <div className="text-slate-400 text-sm mb-2">Visual FX</div>
          <Switch checked={enableFX} onChange={setEnableFX} />
        </div>
        <div className="text-slate-400 text-sm">
          Live sentiment signals visualization with mocked data and shader-like highlights.
        </div>
      </div>
      <motion.div
        className="h-24 rounded-xl border border-slate-700 bg-gradient-to-r from-rose-500/10 via-purple-500/10 to-cyan-500/10 mt-4"
        animate={{ backgroundPositionX: ["0%", "100%"] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        style={{ backgroundSize: "200% 100%" }}
      />
    </Card>
  );
}

function ARTab() {
  return (
    <Card className="glass hover-lift" bodyStyle={{ padding: 16 }}>
      <div className="flex items-center gap-2">
        <Layers size={18} className="text-purple-400" />
        <div className="text-slate-200">AR Overlay Builder</div>
      </div>
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div className="space-y-3">
          <div className="text-slate-400 text-sm">Upload reference image</div>
          <Upload>
            <Button className="border border-slate-700 bg-slate-800/40 text-slate-200" icon={<UploadCloud size={16} />}>
              Upload
            </Button>
          </Upload>
          <div className="text-slate-400 text-sm">Overlay presets</div>
          <div className="grid grid-cols-3 gap-2">
            {["HUD", "Grid", "Depth", "Thermal", "Edges", "Bounds"].map((p) => (
              <button key={p} className="px-2 py-1 rounded-lg border border-slate-700 bg-slate-800/40 text-slate-300 text-xs hover:bg-slate-800/60">
                {p}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="text-slate-400 text-sm mb-2">Preview</div>
          <div className="h-40 rounded-xl border border-slate-700 bg-[radial-gradient(200px_120px_at_60%_40%,rgba(59,130,246,.15),transparent)] relative overflow-hidden">
            <motion.div
              className="absolute inset-0"
              animate={{ opacity: [0.6, 0.8, 0.6] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute left-4 top-4 w-24 h-16 border border-cyan-400/40 rounded"
              animate={{ x: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

function BetaTab() {
  return (
    <Card className="glass hover-lift" bodyStyle={{ padding: 16 }}>
      <div className="flex items-center gap-2">
        <Aperture size={18} className="text-cyan-400" />
        <div className="text-slate-200">Beta Tools</div>
      </div>
      <div className="grid md:grid-cols-3 gap-4 mt-4">
        {[
          { k: "motion", label: "Motion Synth", desc: "Procedural UI motion presets.", icon: <Play size={16} /> },
          { k: "sim", label: "Environment Sim", desc: "Mock IoT topology viz.", icon: <Rocket size={16} /> },
          { k: "fx", label: "Neon FX", desc: "Glow, scanlines, bloom.", icon: <Aperture size={16} /> },
        ].map((t) => (
          <div key={t.k} className="p-3 rounded-xl border border-slate-700 bg-slate-800/40">
            <div className="flex items-center justify-between">
              <div className="text-slate-200">{t.label}</div>
              <span className="text-slate-400">{t.icon}</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">{t.desc}</div>
            <button className="mt-3 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/40 text-slate-200 text-xs hover:bg-slate-800/60">
              Open
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}