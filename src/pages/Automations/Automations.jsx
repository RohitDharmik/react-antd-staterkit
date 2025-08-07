import React, { useMemo, useState } from "react";
import { Card, Button, Tag, Select, Input, List, Modal, Form, Tooltip } from "antd";
import { motion } from "framer-motion";
import { PlusCircle, Play, StopCircle, Zap, Clock, Cpu, Database, Save, Trash2, Link2, Activity } from "lucide-react";

// Mocked rule engine model (IFTTT-style)
const initialRules = [
  {
    id: "rule-1",
    name: "Evening Focus",
    enabled: true,
    trigger: { type: "time", op: "equals", value: "18:00" },
    conditions: [{ type: "device", key: "presence.home", op: "equals", value: "true" }],
    actions: [
      { type: "light", key: "light.living", op: "set", value: "on" },
      { type: "ac", key: "climate.hvac", op: "set", value: "cool:21" },
    ],
  },
];

const triggerOptions = [
  { value: "time.equals", label: "Time equals" },
  { value: "event.gpt_intent", label: "AI Intent detected" },
  { value: "mqtt.topic", label: "MQTT topic message" },
];

const conditionOptions = [
  { value: "device.presence.home", label: "Presence: home" },
  { value: "device.energy.low", label: "Energy: low" },
  { value: "device.locked.front_door", label: "Front Door Locked" },
];

const actionOptions = [
  { value: "light.light.living.on", label: "Light Living: On" },
  { value: "light.light.kitchen.off", label: "Light Kitchen: Off" },
  { value: "ac.climate.hvac.cool_22", label: "AC Cool 22°C" },
  { value: "notify.mobile.push", label: "Send Mobile Push" },
];

export default function Automations() {
  const [rules, setRules] = useState(initialRules);
  const [open, setOpen] = useState(false);

  const toggleRule = (id, enabled) =>
    setRules((rs) => rs.map((r) => (r.id === id ? { ...r, enabled } : r)));

  const deleteRule = (id) => setRules((rs) => rs.filter((r) => r.id !== id));

  const saveRule = (rule) => {
    if (rule.id) {
      setRules((rs) => rs.map((r) => (r.id === rule.id ? rule : r)));
    } else {
      setRules((rs) => [...rs, { ...rule, id: `rule-${Date.now()}` }]);
    }
    setOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-200">Automation Logic Builder</h2>
          <div className="text-slate-400 text-sm">Visual IFTTT-style rules (mock)</div>
        </div>
        <Button onClick={() => setOpen(true)} className="border border-slate-700 bg-slate-800/40 text-slate-200" icon={<PlusCircle size={16} />}>
          New Rule
        </Button>
      </div>

      <Card className="glass hover-lift" bodyStyle={{ padding: 12 }}>
        <List
          itemLayout="horizontal"
          dataSource={rules}
          renderItem={(r) => (
            <List.Item
              actions={[
                <Tag key="enabled" color={r.enabled ? "green" : "default"}>{r.enabled ? "Enabled" : "Disabled"}</Tag>,
                <Button key="edit" onClick={() => { setOpen(true); setTimeout(() => window.dispatchEvent(new CustomEvent("edit-rule", { detail: r })), 0); }}>
                  Edit
                </Button>,
                <Button key="del" danger icon={<Trash2 size={14} />} onClick={() => deleteRule(r.id)}>Delete</Button>,
              ]}
            >
              <List.Item.Meta
                title={<div className="text-slate-200">{r.name}</div>}
                description={
                  <div className="text-slate-400 text-xs">
                    Trigger: {r.trigger.type} {r.trigger.op} {r.trigger.value} • {r.conditions.length} condition(s) • {r.actions.length} action(s)
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      <Modal
        title="Create / Edit Rule"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        destroyOnClose
      >
        <RuleEditor onSave={saveRule} />
      </Modal>
    </div>
  );
}

function RuleEditor({ onSave }) {
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(null);

  React.useEffect(() => {
    const onEdit = (e) => {
      setEditing(e.detail);
      form.setFieldsValue(e.detail);
    };
    window.addEventListener("edit-rule", onEdit);
    return () => window.removeEventListener("edit-rule", onEdit);
  }, [form]);

  const onFinish = (values) => {
    const rule = {
      ...(editing || {}),
      name: values.name,
      enabled: true,
      trigger: parseTrigger(values.trigger),
      conditions: (values.conditions || []).map(parseCondition),
      actions: (values.actions || []).map(parseAction),
    };
    onSave(rule);
  };

  return (
    <Form layout="vertical" form={form} onFinish={onFinish} initialValues={{ name: "", trigger: "time.equals", conditions: [], actions: [] }}>
      <Form.Item label="Rule name" name="name" rules={[{ required: true }]}><Input /></Form.Item>
      <Form.Item label="Trigger" name="trigger">
        <Select options={triggerOptions} />
      </Form.Item>
      <Form.Item label="Conditions" name="conditions">
        <Select mode="multiple" options={conditionOptions} />
      </Form.Item>
      <Form.Item label="Actions" name="actions">
        <Select mode="multiple" options={actionOptions} />
      </Form.Item>
      <div className="flex justify-end gap-2">
        <Button htmlType="submit" type="primary" icon={<Save size={14} />}>Save</Button>
      </div>
    </Form>
  );
}

function parseTrigger(v) {
  if (v.startsWith("time.")) return { type: "time", op: v.split(".")[1], value: "18:00" };
  if (v.startsWith("event.")) return { type: "event", op: v.split(".")[1], value: "gpt_intent" };
  if (v.startsWith("mqtt.")) return { type: "mqtt", op: "topic", value: "home/+" };
  return { type: "custom", op: "eq", value: "" };
}
function parseCondition(v) {
  const [group, key1, key2] = v.split(".");
  return { type: group, key: `${key1}.${key2}`, op: "equals", value: "true" };
}
function parseAction(v) {
  const [domain, key, cmd] = v.split(".");
  if (domain === "light") return { type: "light", key, op: "set", value: cmd };
  if (domain === "ac") return { type: "ac", key, op: "set", value: "cool:22" };
  if (domain === "notify") return { type: "notify", key, op: "push", value: "message" };
  return { type: domain, key, op: "noop", value: "" };
}