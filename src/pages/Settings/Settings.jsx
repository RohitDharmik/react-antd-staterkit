import React, { useMemo, useState } from "react";
import { Card, Button, Input, Select, Switch, Upload, Tabs, Form, Tag, ConfigProvider, theme as antdTheme } from "antd";
import { motion } from "framer-motion";
import { User, Mic, Sparkles, Palette, Save, UploadCloud, Bot } from "lucide-react";
import { usePersonalization } from "../../context/PersonalizationContext";

export default function Settings() {
  // Use global values and allow saving to apply app-wide
  const { theme: globalTheme, accent: globalAccent, setTheme: setGlobalTheme, setAccent: setGlobalAccent } = usePersonalization();
  const [voice, setVoice] = useState("Alloy");
  const [persona, setPersona] = useState("Concise");

  // local preview state then save globally when user clicks Save Theme
  const [localTheme, setLocalTheme] = useState(globalTheme || "glass-dark");
  const [localAccent, setLocalAccent] = useState(globalAccent || "#3b82f6");

  const saveThemeGlobally = () => {
    setGlobalTheme(localTheme);
    setGlobalAccent(localAccent);
  };

  const antdPreviewTheme = useMemo(() => {
    const base = {
      token: {
        colorPrimary: localAccent,
        colorLink: localAccent,
        colorInfo: localAccent,
        borderRadius: 16,
        colorBgContainer: 'transparent',
        colorBgElevated: 'transparent',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      },
      components: {
        Card: { headerBg: 'transparent', bodyBg: 'transparent' },
        Layout: { bodyBg: 'transparent', headerBg: 'transparent', siderBg: 'transparent' },
        Button: { borderRadius: 12 },
      },
      algorithm: antdTheme.darkAlgorithm
    };
    return base;
  }, [localAccent, localTheme]);

  // skeleton/empty demo flags
  const [loading, setLoading] = useState(true);
  const [hasData, setHasData] = useState(true);

  React.useEffect(() => {
    const t = setTimeout(() => {
      setLoading(false);
      setHasData(true);
    }, 800);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div className="container-page">
        <div className="space-y-4">
          <div className="h-8 w-64 rounded-md bg-white/10 animate-pulse" />
          <div className="grid md:grid-cols-2 gap-4">
            <div className="glass-panel p-5 space-y-3">
              <div className="h-4 w-40 rounded bg-white/10 animate-pulse" />
              <div className="h-4 w-64 rounded bg-white/10 animate-pulse" />
              <div className="h-4 w-52 rounded bg-white/10 animate-pulse" />
            </div>
            <div className="glass-panel p-5 space-y-3">
              <div className="h-4 w-40 rounded bg-white/10 animate-pulse" />
              <div className="h-4 w-56 rounded bg-white/10 animate-pulse" />
              <div className="h-4 w-48 rounded bg-white/10 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="container-page">
        <div className="glass-panel p-6">
          <div className="text-slate-300 text-sm">No settings available.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page">
      <div className="mb-4">
        <h2 className="h2">Personalization Settings</h2>
        <div className="p text-slate-400">Avatar • Voice • Themes • Assistant personality (mock)</div>
      </div>

      <Tabs
        defaultActiveKey="profile"
        items={[
          { key: "profile", label: "Profile", children: <ProfileTab /> },
          { key: "voice", label: "Voice & Audio", children: <VoiceTab voice={voice} setVoice={setVoice} /> },
          { key: "theme", label: "Theme", children: <ThemeTab theme={localTheme} setTheme={setLocalTheme} accent={localAccent} setAccent={setLocalAccent} antdPreviewTheme={antdPreviewTheme} onSave={saveThemeGlobally} /> },
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

function ThemeTab({ theme, setTheme, accent, setAccent, antdPreviewTheme, onSave }) {
  const previewStyle = {
    '--bg-dark-start': theme === 'neon' ? '#0a0f1f' : theme === 'glass-contrast' ? '#0b1220' : '#0f172a',
    '--bg-dark-mid': theme === 'neon' ? '#101a35' : theme === 'glass-contrast' ? '#0f172a' : '#1e293b',
    '--bg-dark-end': theme === 'neon' ? '#0a0f1f' : theme === 'glass-contrast' ? '#0b1220' : '#0f172a',
    '--accent': accent,
    '--accent-contrast': theme === 'neon' ? '#051018' : '#0b1220',
    '--text-on-accent': theme === 'glass-contrast' ? '#f2e7ff' : theme === 'neon' ? '#cff9ff' : '#e6f6ff',
  };

  return (
    <div>
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
          <div className="text-xs text-slate-400 mt-1">High contrast text/colors auto-applied.</div>
        </div>
        <div>
          <div className="text-slate-200 mb-2">Preview Actions</div>
          <Button type="primary" onClick={onSave}>Save Theme</Button>
        </div>
      </div>

      {/* Local preview area */}
      <div
        style={previewStyle}
        className="mt-4 rounded-2xl overflow-hidden border border-slate-700/60"
      >
        <div
          className="p-4"
          style={{
            background: `
              radial-gradient(800px 400px at 80% 20%, color-mix(in oklab, var(--accent, #3b82f6) 20%, transparent), transparent),
              radial-gradient(600px 300px at 20% 80%, color-mix(in oklab, var(--accent, #8b5cf6) 20%, transparent), transparent),
              linear-gradient(135deg, var(--bg-dark-start) 0%, var(--bg-dark-mid) 50%, var(--bg-dark-end) 100%)
            `,
          }}
        >
          <ConfigProvider theme={antdPreviewTheme}>
            <Card className="glass hover-lift" bodyStyle={{ padding: 16 }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-slate-200 font-medium">Preview</div>
                  <div className="text-slate-400 text-sm">Shows how components look with current selection</div>
                </div>
                <Button type="primary">Primary</Button>
              </div>
              <div className="flex gap-2 mt-4">
                <Tag color="blue">Glass</Tag>
                <Tag color="purple">Blur</Tag>
                <Tag color="cyan">Neon</Tag>
              </div>
              <div className="flex justify-end mt-4">
                <Button type="primary" icon={<Save size={14} />} onClick={onSave}>Save Theme</Button>
              </div>
            </Card>
          </ConfigProvider>
        </div>
      </div>
    </div>
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