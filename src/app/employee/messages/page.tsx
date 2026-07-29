"use client";

import React, { useState } from "react";
import { MessageSquare, Send, Paperclip, CheckCheck, Users, ShieldAlert } from "lucide-react";

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
  isSelf: boolean;
}

export default function EmployeeMessagesPage() {
  const [activeChannel, setActiveChannel] = useState("Engineering Guild");
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "1", sender: "Marcus Vance (Manager)", text: "Hey Alexander, did we finalize the Next.js edge caching headers?", time: "10:14 AM", isSelf: false },
    { id: "2", sender: "Alexander Vance", text: "Yes! Benchmark shows 320ms TTFB across US-East and EU-Central edge locations.", time: "10:15 AM", isSelf: true },
  ]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "Alexander Vance",
      text: inputMessage,
      time: "Just now",
      isSelf: true
    };
    setMessages([...messages, newMsg]);
    setInputMessage("");
  };

  return (
    <div className="space-y-6 text-white h-[calc(100vh-8rem)] flex flex-col">
      <div>
        <h1 className="text-2xl font-extrabold flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-blue-400" />
          <span>Real-Time Team Messaging</span>
        </h1>
        <p className="text-xs text-slate-400">
          Secure end-to-end chat channels with managers, squad teams, and client representatives.
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-6 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl min-h-0">
        {/* Sidebar Channels */}
        <div className="p-4 bg-slate-950 border-r border-slate-800 space-y-3">
          <h2 className="text-xs font-extrabold uppercase text-slate-400">Active Channels</h2>
          {["Engineering Guild", "Veloce SaaS Team", "Marcus Vance (Manager)", "David Sterling (Client)"].map((ch) => (
            <button
              key={ch}
              onClick={() => setActiveChannel(ch)}
              className={`w-full p-3 rounded-xl text-left text-xs font-bold transition-all ${
                activeChannel === ch ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              # {ch}
            </button>
          ))}
        </div>

        {/* Chat Main Area */}
        <div className="md:col-span-3 flex flex-col justify-between p-6">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white"># {activeChannel}</h2>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Socket.IO Connected
            </span>
          </div>

          {/* Messages Log */}
          <div className="flex-1 overflow-y-auto py-4 space-y-3 custom-scrollbar">
            {messages.map((m) => (
              <div key={m.id} className={`flex flex-col ${m.isSelf ? "items-end" : "items-start"}`}>
                <span className="text-[10px] text-slate-400 mb-0.5">{m.sender} • {m.time}</span>
                <div
                  className={`p-3 rounded-2xl max-w-md text-xs leading-relaxed ${
                    m.isSelf ? "bg-blue-600 text-white rounded-br-none" : "bg-slate-800 text-slate-200 rounded-bl-none"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Bar */}
          <form onSubmit={sendMessage} className="pt-3 border-t border-slate-800 flex gap-2">
            <button type="button" className="p-3 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
              <Paperclip className="w-4 h-4" />
            </button>
            <input
              type="text"
              placeholder={`Message #${activeChannel}...`}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1">
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
