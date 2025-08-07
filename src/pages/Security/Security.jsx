import React, { useMemo, useState } from "react";
import { Card, Button, Tag, List, Avatar, Modal, Form, Input, Switch, Tabs, Timeline, Badge } from "antd";
import { Shield, ShieldCheck, KeyRound, UserCheck, LogIn, LogOut, Camera, Mic, Eye, Lock, Unlock } from "lucide-react";

const accessLogsMock = [
  { id: "a1", actor: "Alex", action: "Face Unlock", result: "success", time: "09:12" },
  { id: "a2", actor: "Sam", action: "Voice Auth", result: "fail", time: "08:43" },
  { id: "a3", actor: "Service", action: "Device Token Refresh", result: "success", time: "08:01" },
];

export default function Security() {
  const [require2FA, setRequire2FA] = useState(true);
  const [lockout, setLockout] = useState(false);
  const [enrollOpen, setEnrollOpen] = useState(false);
  const [logs, setLogs] = useState(accessLogsMock);

  const addLog = (entry) => setLogs((l) => [{ id: String(Date.now()), ...entry }, ...l]);

  const simulateFaceAuth = () => {
    addLog({ actor: "Alex", action: "Face Unlock", result: "success", time: "now" });
  };
  const simulateVoiceAuth = () => {
    addLog({ actor: "Sam", action: "Voice Auth", result: "fail", time: "now" });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-200">Security Panel</h2>
          <div className="text-slate-400 text-sm">2FA with face/voice, lockout, access logs (mock)</div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setEnrollOpen(true)} className="border border-slate-700 bg-slate-800/40 text-slate-200" icon={<UserCheck size={16} />}>
            Enroll 2FA
          </Button>
          <Button onClick={() => setLockout((v) => !v)} className={`border ${lockout ? "border-red-500/40 bg-red-500/10 text-red-300" : "border-slate-700 bg-slate-800/40 text-slate-200"}`} icon={lockout ? <Lock size={16} /> : <Unlock size={16} />}>
            {lockout ? "Disable Lockout" : "Enable Lockout"}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Security settings */}
        <Card className="glass hover-lift" bodyStyle={{ padding: 16 }}>
          <div className="text-slate-200 mb-3">Authentication Settings</div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-slate-400">Require 2FA</div>
              <Switch checked={require2FA} onChange={setRequire2FA} />
            </div>
            <div className="flex items-center justify-between">
              <div className="text-slate-400">Device Lockout</div>
              <Switch checked={lockout} onChange={setLockout} />
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button onClick={simulateFaceAuth} className="border border-slate-700 bg-slate-800/40 text-slate-200" icon={<Camera size={16} />}>
                Test Face
              </Button>
              <Button onClick={simulateVoiceAuth} className="border border-slate-700 bg-slate-800/40 text-slate-200" icon={<Mic size={16} />}>
                Test Voice
              </Button>
            </div>
          </div>
        </Card>

        {/* Status */}
        <Card className="glass hover-lift" bodyStyle={{ padding: 16 }}>
          <div className="text-slate-200 mb-3">Status</div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">2FA</span>
              <Tag color={require2FA ? "green" : "default"}>{require2FA ? "Enabled" : "Disabled"}</Tag>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Lockout</span>
              <Tag color={lockout ? "red" : "default"}>{lockout ? "Active" : "Idle"}</Tag>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Anomalies</span>
              <Tag color="blue">0</Tag>
            </div>
          </div>
        </Card>

        {/* Quick controls */}
        <Card className="glass hover-lift" bodyStyle={{ padding: 16 }}>
          <div className="text-slate-200 mb-3">Quick Controls</div>
          <div className="grid grid-cols-2 gap-2">
            <Button className="border border-slate-700 bg-slate-800/40 text-slate-200" icon={<ShieldCheck size={16} />}>Secure Now</Button>
            <Button className="border border-slate-700 bg-slate-800/40 text-slate-200" icon={<KeyRound size={16} />}>Rotate Keys</Button>
            <Button className="border border-slate-700 bg-slate-800/40 text-slate-200" icon={<Eye size={16} />}>Review Events</Button>
            <Button className="border border-slate-700 bg-slate-800/40 text-slate-200" icon={<LogOut size={16} />}>Sign out all</Button>
          </div>
        </Card>
      </div>

      {/* Access logs */}
      <Card className="glass hover-lift" bodyStyle={{ padding: 12 }}>
        <div className="text-slate-200 mb-2">Access Logs</div>
        <List
          itemLayout="horizontal"
          dataSource={logs}
          renderItem={(l) => (
            <List.Item
              actions={[
                <Tag key="res" color={l.result === "success" ? "green" : "red"}>{l.result}</Tag>,
                <Tag key="time" className="border-slate-600 bg-slate-800/40 text-slate-300">{l.time}</Tag>,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar className="bg-slate-800 border border-slate-700"><Shield size={14} /></Avatar>}
                title={<div className="text-slate-200">{l.actor}</div>}
                description={<div className="text-slate-500 text-xs">{l.action}</div>}
              />
            </List.Item>
          )}
        />
      </Card>

      {/* Enrollment modal */}
      <Modal title="Enroll 2FA" open={enrollOpen} onCancel={() => setEnrollOpen(false)} footer={null}>
        <Form layout="vertical" onFinish={() => setEnrollOpen(false)}>
          <Form.Item label="User" name="user" rules={[{ required: true }]}><Input placeholder="Enter username" /></Form.Item>
          <div className="grid grid-cols-2 gap-3">
            <Button className="border border-slate-700 bg-slate-800/40 text-slate-200" icon={<Camera size={16} />}>Capture Face</Button>
            <Button className="border border-slate-700 bg-slate-800/40 text-slate-200" icon={<Mic size={16} />}>Record Voice</Button>
          </div>
          <div className="flex justify-end mt-4">
            <Button type="primary" htmlType="submit">Save</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}