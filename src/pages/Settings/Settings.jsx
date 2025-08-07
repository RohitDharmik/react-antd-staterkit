import React, { useState } from "react";
import { Card, Button, Input, Select, Switch, Upload, Tabs, Form, Tag } from "antd";
import { motion } from "framer-motion";
import { User, Mic, Sparkles, Palette, Save, UploadCloud, Bot } from "lucide-react";

export default function Settings() {
  const [theme, setTheme] = useState("glass-dark");
  const [voice, setVoice] = useState("Alloy");
  const [persona, setPersona] = useState("Concise");
  const [accent, setAccent] = useState("#3b82f6");

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-200">Personalization Settings</h2>
        <div className="text-slate-400 text-sm">Avatar • Voice • Themes • Assistant personality (mock)</div>
      </div>

      <Tabs
        defaultActiveKey="profile"
        items={[
          { key: "profile", label: "Profile", children: <ProfileTab /> },
          { key: "voice", label: "Voice & Audio", children: <VoiceTab voice={voice} setVoice={setVoice} /> },
          { key: "theme", label: "Theme", children: <ThemeTab theme={theme} setTheme={setTheme} accent={accent} setAccent={setAccent} /> },
          { key: "assistant", label: "Assistant", children: <AssistantTab persona={persona} setPersona={setPersona} /> },
        ]}
      />
    </div>
  );
}

function ProfileTab() {
  return (
    <Card className="glass hover-lift" bodyStyle={{ padding: 16 }}>
      <Form layout="vertical" onFinish={() => {}}>
        <div className="grid md:grid-cols-2 gap-4">
          <Form.Item label="Display Name" name="displayName"><Input placeholder="Your name" /></Form.Item>
          <Form.Item label="Email" name="email"><Input placeholder="you@example.com" /></Form.Item>
        </div>
        <Form.Item label="Avatar">
          <Upload>
            <Button icon={<UploadCloud size={16} />} className="border border-slate-700 bg-slate-800/40 text-slate-200">Upload Avatar</Button>
          </Upload>
        </Form.Item>
        <div className="flex justify-end">
          <Button type="primary" icon={<Save size={14} />}>Save Profile</Button>
        </div>
      </Form>
    </Card>
  );
}

function VoiceTab({ voice, setVoice }) {
  return (
    <Card className="glass hover-lift" bodyStyle={{ padding: 16 }}>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <div className="text-slate-200 mb-2">Preferred Voice</div>
          <Select
            value={voice}
            onChange={setVoice}
            options={[
              { value: "Alloy", label: "Alloy" },
              { value: "Nova", label: "Nova" },
              { value: "Verse", label: "Verse" },
            ]}
            className="min-w-[180px]"
          />
        </div>
        <div>
          <div className="text-slate-200 mb-2">Voice Activity</div>
          <Switch defaultChecked /> <span className="text-slate-400 text-sm ml-2">Enable voice confirmations</span>
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <Button type="primary" icon={<Save size={14} />}>Save Voice</Button>
      </div>
    </Card>
  );
}

function ThemeTab({ theme, setTheme, accent, setAccent }) {
  return (
    <Card className="glass hover-lift" bodyStyle={{ padding: 16 }}>
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <div className="text-slate-200 mb-2">Theme</div>
          <Select
            value={theme}
            onChange={setTheme}
            options={[
              { value: "glass-dark", label: "Glass Dark" },
              { value: "glass-contrast", label: "Glass Contrast" },
              { value: "neon", label: "Neon" },
            ]}
            className="min-w-[180px]"
          />
        </div>
        <div>
          <div className="text-slate-200 mb-2">Accent Color</div>
          <Input type="color" value={accent} onChange={(e) => setAccent(e.target.value)} />
        </div>
        <div>
          <div className="text-slate-200 mb-2">Animations</div>
          <Switch defaultChecked /> <span className="text-slate-400 text-sm ml-2">Enable UI Animations</span>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <Tag color="blue">Glass</Tag>
        <Tag color="purple">Blur</Tag>
        <Tag color="cyan">Neon</Tag>
      </div>
      <div className="flex justify-end mt-4">
        <Button type="primary" icon={<Save size={14} />}>Save Theme</Button>
      </div>
    </Card>
  );
}

function AssistantTab({ persona, setPersona }) {
  return (
    <Card className="glass hover-lift" bodyStyle={{ padding: 16 }}>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <div className="text-slate-200 mb-2">Persona</div>
          <Select
            value={persona}
            onChange={setPersona}
            options={[
              { value: "Concise", label: "Concise" },
              { value: "Friendly", label: "Friendly" },
              { value: "Technical", label: "Technical" },
            ]}
            className="min-w-[180px]"
          />
        </div>
        <div>
          <div className="text-slate-200 mb-2">Proactive Suggestions</div>
          <Switch defaultChecked /> <span className="text-slate-400 text-sm ml-2">Allow proactive hints</span>
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <Button type="primary" icon={<Save size={14} />}>Save Assistant</Button>
      </div>
    </Card>
  );
}