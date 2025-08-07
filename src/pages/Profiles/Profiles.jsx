import React, { useMemo, useState } from "react";
import { Card, Button, Input, Select, Tag, Modal, Form, List, Avatar, Upload, Tabs, Switch } from "antd";
import { motion } from "framer-motion";
import { User, Mic, Fingerprint, ShieldCheck, PlusCircle, Trash2, Edit3, Camera, Mic2, Save } from "lucide-react";

const initialProfiles = [
  { id: "u-alex", name: "Alex", role: "Owner", voice: "Nova", permissions: ["admin", "devices", "automations"], face: true, voiceSig: true, color: "#60a5fa" },
  { id: "u-sam", name: "Sam", role: "Member", voice: "Alloy", permissions: ["devices"], face: true, voiceSig: false, color: "#22c55e" },
];

export default function Profiles() {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const filtered = useMemo(
    () => profiles.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())),
    [search, profiles]
  );

  const onSave = (values) => {
    if (editing) {
      setProfiles((ps) => ps.map((p) => (p.id === editing.id ? { ...p, ...values } : p)));
    } else {
      const id = `u-${values.name.toLowerCase()}`;
      setProfiles((ps) => [...ps, { id, ...values }]);
    }
    setOpen(false);
    setEditing(null);
  };

  const onDelete = (id) => setProfiles((ps) => ps.filter((p) => p.id !== id));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-200">Profile Management</h2>
          <div className="text-slate-400 text-sm">Face/Voice profiles, permissions and preferences (mock)</div>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search profiles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-56 bg-transparent text-slate-200"
          />
          <Button
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
            className="border border-slate-700 bg-slate-800/40 text-slate-200"
            icon={<PlusCircle size={16} />}
          >
            Add Profile
          </Button>
        </div>
      </div>

      <Card className="glass hover-lift" bodyStyle={{ padding: 12 }}>
        <List
          itemLayout="horizontal"
          dataSource={filtered}
          renderItem={(p) => (
            <List.Item
              actions={[
                <Tag key="role" color={p.role === "Owner" ? "gold" : "blue"}>{p.role}</Tag>,
                <Tag key="face" color={p.face ? "green" : "default"}>{p.face ? "Face" : "No Face"}</Tag>,
                <Tag key="voice" color={p.voiceSig ? "purple" : "default"}>{p.voiceSig ? "Voice" : "No Voice"}</Tag>,
                <Button key="edit" onClick={() => { setEditing(p); setOpen(true); }} className="border border-slate-700 bg-slate-800/40 text-slate-200" icon={<Edit3 size={14} />}>Edit</Button>,
                <Button key="del" danger onClick={() => onDelete(p.id)} icon={<Trash2 size={14} />}>Remove</Button>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar style={{ background: `${p.color}22`, color: p.color, border: "1px solid rgba(148,163,184,.3)" }}>
                    <User size={16} />
                  </Avatar>
                }
                title={
                  <div className="flex items-center gap-2">
                    <span className="text-slate-200">{p.name}</span>
                    <div className="flex gap-1">
                      {p.permissions.map((perm) => (
                        <Tag key={perm} className="border-slate-600 bg-slate-800/40 text-slate-300 text-xs">{perm}</Tag>
                      ))}
                    </div>
                  </div>
                }
                description={<div className="text-slate-400 text-xs">Preferred voice: {p.voice}</div>}
              />
            </List.Item>
          )}
        />
      </Card>

      <Modal
        title={editing ? "Edit Profile" : "Add Profile"}
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
      >
        <ProfileForm defaultValues={editing || { name: "", role: "Member", voice: "Alloy", permissions: ["devices"], face: false, voiceSig: false, color: "#60a5fa" }} onSave={onSave} />
      </Modal>
    </div>
  );
}

function ProfileForm({ defaultValues, onSave }) {
  const [form] = Form.useForm();

  return (
    <Form
      layout="vertical"
      initialValues={defaultValues}
      form={form}
      onFinish={onSave}
    >
      <Form.Item label="Name" name="name" rules={[{ required: true }]}>
        <Input placeholder="Enter name" />
      </Form.Item>

      <div className="grid grid-cols-2 gap-3">
        <Form.Item label="Role" name="role">
          <Select
            options={[
              { value: "Owner", label: "Owner" },
              { value: "Member", label: "Member" },
              { value: "Guest", label: "Guest" },
            ]}
          />
        </Form.Item>

        <Form.Item label="Preferred Voice" name="voice">
          <Select
            options={[
              { value: "Alloy", label: "Alloy" },
              { value: "Nova", label: "Nova" },
              { value: "Verse", label: "Verse" },
            ]}
          />
        </Form.Item>
      </div>

      <Form.Item label="Permissions" name="permissions">
        <Select
          mode="multiple"
          options={[
            { value: "admin", label: "Admin" },
            { value: "devices", label: "Devices" },
            { value: "automations", label: "Automations" },
            { value: "analytics", label: "Analytics" },
          ]}
        />
      </Form.Item>

      <div className="grid grid-cols-2 gap-3">
        <Form.Item label="Face Registered" name="face" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item label="Voice Signature" name="voiceSig" valuePropName="checked">
          <Switch />
        </Form.Item>
      </div>

      <Form.Item label="Accent Color" name="color">
        <Input type="color" />
      </Form.Item>

      <div className="flex justify-end gap-2">
        <Button onClick={() => form.resetFields()}>Reset</Button>
        <Button type="primary" htmlType="submit" icon={<Save size={14} />}>Save</Button>
      </div>
    </Form>
  );
}