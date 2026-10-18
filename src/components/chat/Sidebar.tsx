"use client";

import React, { useState } from "react";
import {
  Hash,
  Plus,
  Sparkles,
  Trash2,
  Users,
  X,
  Check,
  MessageSquarePlus,
  Radio,
  ShieldCheck,
} from "lucide-react";
import { Channel, TEAM_MEMBERS, UserProfile } from "../../types/chat";

interface SidebarProps {
  channels: Channel[];
  activeChannelId: string;
  onSelectChannel: (channelId: string) => void;
  onCreateChannel: (name: string, description: string) => Promise<void>;
  currentUser: string;
  onSelectUser: (userName: string) => void;
  onClearChat: () => void;
  unreadCounts: Record<string, number>;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export default function Sidebar({
  channels,
  activeChannelId,
  onSelectChannel,
  onCreateChannel,
  currentUser,
  onSelectUser,
  onClearChat,
  unreadCounts,
  isOpenMobile,
  onCloseMobile,
}: SidebarProps) {
  const [showNewChannelForm, setShowNewChannelForm] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [newChannelDesc, setNewChannelDesc] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const activeUserObj: UserProfile =
    TEAM_MEMBERS.find((m) => m.name === currentUser) || TEAM_MEMBERS[0];

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = newChannelName
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-_]/g, "");

    if (!formatted) return;

    setIsCreating(true);
    try {
      await onCreateChannel(
        formatted,
        newChannelDesc.trim() || `Canal #${formatted} criado por ${currentUser}`,
      );
      setNewChannelName("");
      setNewChannelDesc("");
      setShowNewChannelForm(false);
    } finally {
      setIsCreating(false);
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between select-none">
      <div className="space-y-6 overflow-y-auto pr-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative p-2.5 bg-gradient-to-br from-indigo-500 via-violet-600 to-fuchsia-600 rounded-2xl shadow-lg shadow-indigo-500/30 ring-1 ring-white/20">
              <Sparkles className="w-6 h-6 text-white" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-slate-900"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
                  NexusChat
                </h1>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  PRO
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                Firestore Realtime
              </p>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="md:hidden p-2 rounded-xl bg-slate-800/70 text-slate-400 hover:text-white transition"
            aria-label="Fechar menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Channels Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-indigo-400" />
              Canais de Conversa
            </span>
            <button
              onClick={() => setShowNewChannelForm(!showNewChannelForm)}
              className="flex items-center gap-1 text-xs font-medium text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 px-2 py-1 rounded-lg transition cursor-pointer"
              title="Criar novo canal"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo</span>
            </button>
          </div>

          {showNewChannelForm && (
            <form
              onSubmit={handleCreateSubmit}
              className="p-3 rounded-xl bg-slate-800/80 border border-indigo-500/40 space-y-2.5 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-indigo-300 flex items-center gap-1">
                  <MessageSquarePlus className="w-3.5 h-3.5" />
                  Novo Canal
                </span>
                <button
                  type="button"
                  onClick={() => setShowNewChannelForm(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                  #
                </span>
                <input
                  type="text"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  placeholder="nome-do-canal"
                  maxLength={28}
                  className="w-full bg-slate-900/90 text-xs text-white pl-6 pr-2.5 py-2 rounded-lg border border-slate-700 focus:border-indigo-500 focus:outline-none"
                  autoFocus
                />
              </div>
              <input
                type="text"
                value={newChannelDesc}
                onChange={(e) => setNewChannelDesc(e.target.value)}
                placeholder="Descrição curta (opcional)"
                maxLength={60}
                className="w-full bg-slate-900/90 text-xs text-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-700 focus:border-indigo-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={isCreating || !newChannelName.trim()}
                className="w-full py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-xs transition flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/30 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isCreating ? "Criando..." : "Confirmar Canal"}</span>
              </button>
            </form>
          )}

          <div className="space-y-1">
            {channels.map((channel) => {
              const isActive = channel.id === activeChannelId;
              const unread = unreadCounts[channel.id] || 0;

              return (
                <button
                  key={channel.id}
                  onClick={() => {
                    onSelectChannel(channel.id);
                    onCloseMobile();
                  }}
                  className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600/30 to-violet-600/15 text-white border border-indigo-500/40 shadow-sm shadow-indigo-500/10 font-medium"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span
                      className={`p-1 rounded-lg transition ${
                        isActive
                          ? "bg-indigo-500/30 text-indigo-300"
                          : "bg-slate-800/80 text-slate-400 group-hover:text-slate-200"
                      }`}
                    >
                      <Hash className="w-4 h-4" />
                    </span>
                    <div className="text-left truncate">
                      <p className="truncate leading-tight">{channel.name}</p>
                      <p className="text-[10px] text-slate-500 truncate max-w-[165px]">
                        {channel.description}
                      </p>
                    </div>
                  </div>

                  {unread > 0 && !isActive ? (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-500 text-white shadow">
                      {unread}
                    </span>
                  ) : isActive ? (
                    <span className="w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              Integrantes ({TEAM_MEMBERS.length})
            </span>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              Troca Rápida
            </span>
          </div>

          <div className="space-y-1.5">
            {TEAM_MEMBERS.map((member) => {
              const isSelected = currentUser === member.name;
              return (
                <button
                  key={member.name}
                  onClick={() => onSelectUser(member.name)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-slate-800/90 border border-indigo-500/50 shadow-md"
                      : "bg-slate-900/40 hover:bg-slate-800/50 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className={`w-9 h-9 rounded-xl bg-slate-800 p-0.5 border transition ${
                          isSelected
                            ? "border-indigo-400 ring-2 ring-indigo-500/20"
                            : "border-slate-700"
                        }`}
                      />
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-slate-900 ${
                          isSelected ? "bg-emerald-400" : "bg-slate-500"
                        }`}
                      />
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-xs font-semibold ${
                            isSelected ? "text-white" : "text-slate-300"
                          }`}
                        >
                          {member.name}
                        </span>
                        {isSelected && (
                          <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            Você
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 truncate">
                        {member.role}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="pt-4 mt-4 border-t border-slate-800/80 space-y-2.5">
        <div className="p-3 rounded-xl bg-gradient-to-r from-slate-900 via-slate-800/80 to-slate-900 border border-slate-700/60 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activeUserObj.avatar}
            alt={activeUserObj.name}
            className="w-10 h-10 rounded-xl bg-slate-800 border border-indigo-500/40 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <p className="text-xs font-bold text-white truncate">
                {activeUserObj.name}
              </p>
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            </div>
            <p className="text-[10px] text-slate-400 truncate">
              {activeUserObj.statusText}
            </p>
          </div>
        </div>

        <button
          onClick={onClearChat}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-red-500/25 bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-medium transition cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Limpar Mensagens do Canal</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="w-80 border-r border-slate-800/80 glass-panel p-5 hidden md:flex flex-col h-full shrink-0 z-20">
        {sidebarContent}
      </aside>

      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <aside className="relative w-80 max-w-[85vw] h-full glass-panel border-r border-slate-800 p-5 flex flex-col z-10">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
