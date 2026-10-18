"use client";

import React, { useEffect, useRef } from "react";
import {
  Check,
  CheckCheck,
  Hash,
  Mic,
  Sparkles,
  Volume2,
  ZoomIn,
} from "lucide-react";
import { Channel, Message, TEAM_MEMBERS } from "../../types/chat";

interface MessageListProps {
  messages: Message[];
  currentUser: string;
  activeChannel: Channel;
  typingUsers: string[];
  onReact: (messageId: string, emoji: string) => void;
  onPreviewMedia: (
    url: string,
    type: "image" | "video",
    sender?: string,
    caption?: string,
  ) => void;
}

const QUICK_REACTIONS = ["👍", "❤️", "🔥", "🚀", "👏", "😂"];

export default function MessageList({
  messages,
  currentUser,
  activeChannel,
  typingUsers,
  onReact,
  onPreviewMedia,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  const formatTime = (timestamp: number) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getMemberInfo = (name: string) => {
    return TEAM_MEMBERS.find((m) => m.name === name);
  };

  const isMessageRead = (msg: Message) => {
    if (msg.status === "read") return true;
    if (msg.readBy && msg.readBy.some((u) => u !== msg.sender)) return true;
    return false;
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-5 relative">
      {/* Channel Welcome Banner */}
      <div className="p-5 rounded-2xl glass-card border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 text-indigo-400 shrink-0">
            <Hash className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm md:text-base font-bold text-white flex items-center gap-2">
              Bem-vindo ao canal #{activeChannel.name}
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {activeChannel.description}
            </p>
          </div>
        </div>
        <span className="text-[11px] text-slate-400 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-xl self-start sm:self-center shrink-0">
          Sincronizado em tempo real
        </span>
      </div>

      {/* Empty State */}
      {messages.length === 0 ? (
        <div className="py-16 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-3xl bg-slate-900/90 border border-slate-800 flex items-center justify-center text-indigo-400 mb-4 shadow-inner">
            <Hash className="w-8 h-8 opacity-75" />
          </div>
          <p className="text-slate-300 font-semibold text-sm">
            Nenhuma mensagem em #{activeChannel.name} ainda
          </p>
          <p className="text-slate-500 text-xs max-w-xs mt-1">
            Envie uma mensagem de texto, imagem, emoji ou grave uma nota de voz
            para iniciar a conversa!
          </p>
        </div>
      ) : (
        messages.map((msg) => {
          const isMe = msg.sender === currentUser;
          const member = getMemberInfo(msg.sender);
          const readStatus = isMessageRead(msg);
          const audioSrc =
            msg.mediaType === "audio" ? msg.mediaUrl : undefined;
          const imgSrc =
            msg.imageUrl ||
            (msg.mediaType === "image" ? msg.mediaUrl : undefined);

          return (
            <div
              key={msg.id}
              className={`flex gap-3.5 group animate-in fade-in slide-in-from-bottom-1 duration-200 ${
                isMe ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar */}
              <div className="relative shrink-0 mt-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    msg.avatar ||
                    member?.avatar ||
                    `https://api.dicebear.com/7.x/bottts/svg?seed=${msg.sender}`
                  }
                  alt={msg.sender}
                  className="w-9 h-9 rounded-xl bg-slate-800 p-0.5 border border-slate-700/80 shadow-md"
                />
              </div>

              {/* Message Content Wrapper */}
              <div
                className={`flex flex-col max-w-[82%] sm:max-w-[68%] ${
                  isMe ? "items-end" : "items-start"
                }`}
              >
                {/* Sender & Role Badge */}
                <div
                  className={`flex items-center gap-2 mb-1 px-1 ${
                    isMe ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <span className="text-xs font-semibold text-slate-200">
                    {msg.sender}
                  </span>
                  {member && (
                    <span
                      className={`text-[9px] font-medium px-1.5 py-0.2 rounded border ${member.badgeColor}`}
                    >
                      {member.role}
                    </span>
                  )}
                </div>

