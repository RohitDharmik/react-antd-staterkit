import React, { useEffect, useRef, useState } from "react";
import { Card, Button, Input, Tag, List, Avatar, Tooltip, Upload } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Send, Settings, Bot, User,  FileAudio, FileText, StopCircle, PlayCircle } from "lucide-react";

// Mocked GPT-4o / Whisper / ElevenLabs services
const mockChatCompletion = async (messages) => {
  await new Promise((r) => setTimeout(r, 600));
  const last = messages[messages.length - 1]?.content || "";
  return { role: "assistant", content: `Synthesized insight: ${last.slice(0, 72)}...` };
};
const mockTranscribe = async (blob) => {
  await new Promise((r) => setTimeout(r, 800));
  return "Transcribed text from audio (mocked Whisper).";
};
const mockTTS = async (text) => {
  await new Promise((r) => setTimeout(r, 300));
  return new Blob([`AUDIO:${text}`], { type: "audio/mpeg" });
};

export default function AIConsole() {
  const [messages, setMessages] = useState([
    { id: 1, role: "assistant", content: "Hello! I’m your Neural Assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [recording, setRecording] = useState(false);
  const [recognizing, setRecognizing] = useState(false);
  const [playing, setPlaying] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now(), role: "user", content: input.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    const reply = await mockChatCompletion([...messages, userMsg]);
    setMessages((m) => [...m, { id: Date.now() + 1, ...reply }]);
  };

  const startRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia) return;
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mr = new MediaRecorder(stream);
    mediaRecorderRef.current = mr;
    audioChunksRef.current = [];
    mr.ondataavailable = (e) => audioChunksRef.current.push(e.data);
    mr.onstop = async () => {
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      setRecognizing(true);
      const text = await mockTranscribe(blob);
      setRecognizing(false);
      setMessages((m) => [...m, { id: Date.now(), role: "user", content: text }]);
      const reply = await mockChatCompletion([...messages, { role: "user", content: text }]);
      setMessages((m) => [...m, { id: Date.now() + 1, ...reply }]);
      // optional play TTS
      const tts = await mockTTS(reply.content);
      if (audioRef.current) {
        audioRef.current.src = URL.createObjectURL(tts);
        audioRef.current.play();
      }
    };
    mr.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const playLastAssistant = async () => {
    const last = [...messages].reverse().find((m) => m.role === "assistant");
    if (!last) return;
    const tts = await mockTTS(last.content);
    if (audioRef.current) {
      audioRef.current.src = URL.createObjectURL(tts);
      setPlaying(true);
      await audioRef.current.play();
      setPlaying(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-200">AI Command Console</h2>
        <div className="flex items-center gap-2">
          <Tag color="blue">GPT-4o (mock)</Tag>
          <Tag color="green">Whisper (mock)</Tag>
          <Tag color="purple">ElevenLabs (mock)</Tag>
          <Button className="border border-slate-700 bg-slate-800/40 text-slate-200" icon={<Settings size={16} />}>
            Settings
          </Button>
        </div>
      </div>

      {/* Chat */}
      <Card className="glass hover-lift" bodyStyle={{ padding: 0 }}>
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3">
          <AnimatePresence>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className={`flex items-start gap-3 ${m.role === "assistant" ? "justify-start" : "justify-end"}`}
              >
                {m.role === "assistant" && (
                  <Avatar className="bg-slate-800 border border-slate-700"><Bot size={16} /></Avatar>
                )}
                <div className={`px-3 py-2 rounded-2xl max-w-[70%] border ${
                  m.role === "assistant" ? "bg-slate-800/50 border-slate-700" : "bg-blue-500/20 border-blue-500/40"
                }`}>
                  <div className="text-slate-200 text-sm whitespace-pre-wrap">{m.content}</div>
                </div>
                {m.role === "user" && (
                  <Avatar className="bg-slate-800 border border-slate-700"><User size={16} /></Avatar>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="border-t border-slate-800/60 p-3 flex items-center gap-2">
          <Tooltip title={recording ? "Stop recording" : "Record with Whisper (mock)"}>
            <Button
              onClick={recording ? stopRecording : startRecording}
              className={`border ${recording ? "border-red-500/40 bg-red-500/10" : "border-slate-700 bg-slate-800/40"} text-slate-200`}
              icon={recording ? <StopCircle size={16} /> : <Mic size={16} />}
            />
          </Tooltip>

          <Input.TextArea
            autoSize={{ minRows: 1, maxRows: 4 }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a natural language command..."
            className="bg-transparent text-slate-200"
          />

          <Tooltip title="Send">
            <Button onClick={handleSend} className="border border-blue-500/40 bg-blue-500/10 text-blue-200" icon={<Send size={16} />} />
          </Tooltip>

          <Tooltip title="Play last assistant reply (TTS mock)">
            <Button onClick={playLastAssistant} loading={playing} className="border border-slate-700 bg-slate-800/40 text-slate-200" icon={<PlayCircle size={16} />} />
          </Tooltip>
          <audio ref={audioRef} onEnded={() => setPlaying(false)} />
        </div>

        {recognizing && (
          <div className="border-t border-slate-800/60 p-2 text-xs text-slate-400">
            Transcribing audio... (mock)
          </div>
        )}
      </Card>
    </div>
  );
}