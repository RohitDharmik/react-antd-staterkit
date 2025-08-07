import React, { useMemo, useState } from "react";
import { Card, Button, Tag, List, Avatar, Calendar, Badge, Input, Select } from "antd";
// import { motion } from "framer-motion";
import { CalendarDays, Mail,  Bell, Clock, CheckCircle2, Plus } from "lucide-react";

const gmailMock = [
  { id: "m1", from: "techteam@lab.io", subject: "System update window", time: "09:12", unread: true },
  { id: "m2", from: "notifier@home", subject: "HVAC filter reminder", time: "08:05", unread: false },
];

const notionMock = [
  { id: "n1", title: "Refactor MQTT adapter", project: "NCC", due: "Today" },
  { id: "n2", title: "Design Automation blocks", project: "NCC", due: "Tomorrow" },
];

const remindersMock = [
  { id: "r1", title: "Stand-up", time: "10:00", important: true },
  { id: "r2", title: "Groceries pickup", time: "18:30", important: false },
];

export default function Briefing() {
  const [reminders, setReminders] = useState(remindersMock);
  const [newReminder, setNewReminder] = useState("");

  const addReminder = () => {
    if (!newReminder.trim()) return;
    setReminders((r) => [...r, { id: String(Date.now()), title: newReminder.trim(), time: "Anytime", important: false }]);
    setNewReminder("");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-200">Daily Briefing</h2>
          <div className="text-slate-400 text-sm">Calendar • Reminders • Gmail • Notion (mock)</div>
        </div>
        <Tag color="blue">Synced</Tag>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Calendar */}
        <Card className="glass hover-lift lg:col-span-2" bodyStyle={{ padding: 12 }}>
          <div className="flex items-center gap-2 px-2 pb-2">
            <CalendarDays size={18} className="text-blue-400" />
            <div className="text-slate-200">Calendar</div>
          </div>
          <div className="rounded-xl overflow-hidden border border-slate-800/60">
            <Calendar fullscreen={false} />
          </div>
        </Card>

        {/* Reminders */}
        <Card className="glass hover-lift" bodyStyle={{ padding: 12 }}>
          <div className="flex items-center justify-between px-1 pb-2">
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-amber-400" />
              <div className="text-slate-200">Reminders</div>
            </div>
            <div className="flex items-center gap-2">
              <Input
                size="small"
                value={newReminder}
                onChange={(e) => setNewReminder(e.target.value)}
                placeholder="Add reminder"
                className="bg-transparent text-slate-200"
              />
              <Button size="small" onClick={addReminder} icon={<Plus size={14} />} className="border border-slate-700 bg-slate-800/40 text-slate-200">
                Add
              </Button>
            </div>
          </div>
          <List
            itemLayout="horizontal"
            dataSource={reminders}
            renderItem={(r) => (
              <List.Item
                actions={[
                  <Tag key="time" className="border-slate-600 bg-slate-800/40 text-slate-300">{r.time}</Tag>,
                  r.important ? <Badge key="imp" color="red" text="Important" /> : <span key="imp" />,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar className="bg-slate-800 border border-slate-700"><Clock size={14} /></Avatar>}
                  title={<span className="text-slate-200">{r.title}</span>}
                  description={<div className="text-slate-500 text-xs">Personal</div>}
                />
              </List.Item>
            )}
          />
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Gmail */}
        <Card className="glass hover-lift" bodyStyle={{ padding: 12 }}>
          <div className="flex items-center gap-2 px-1 pb-2">
            <Mail size={18} className="text-rose-400" />
            <div className="text-slate-200">Gmail</div>
          </div>
          <List
            itemLayout="horizontal"
            dataSource={gmailMock}
            renderItem={(m) => (
              <List.Item actions={[<Tag key="time" className="border-slate-600 bg-slate-800/40 text-slate-300">{m.time}</Tag>]}>
                <List.Item.Meta
                  avatar={<Avatar className="bg-slate-800 border border-slate-700">{m.unread ? <Badge status="processing" /> : null}</Avatar>}
                  title={<div className="text-slate-200">{m.subject}</div>}
                  description={<div className="text-slate-500 text-xs">{m.from}</div>}
                />
              </List.Item>
            )}
          />
        </Card>

        {/* Notion */}
        <Card className="glass hover-lift" bodyStyle={{ padding: 12 }}>
          <div className="flex items-center gap-2 px-1 pb-2">
            <span className="text-slate-200">Notion</span>
          </div>
          <List
            itemLayout="horizontal"
            dataSource={notionMock}
            renderItem={(n) => (
              <List.Item actions={[<Tag key="due" color="blue">{n.due}</Tag>]}>
                <List.Item.Meta
                  avatar={<Avatar className="bg-slate-800 border border-slate-700">N</Avatar>}
                  title={<div className="text-slate-200">{n.title}</div>}
                  description={<div className="text-slate-500 text-xs">{n.project}</div>}
                />
              </List.Item>
            )}
          />
        </Card>
      </div>
    </div>
  );
}