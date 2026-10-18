"use client";

import React from "react";
import {
  Hash,
  Menu,
  Search,
  Sparkles,
  CheckCheck,
  Users,
  X,
} from "lucide-react";
import { Channel, TEAM_MEMBERS } from "../../types/chat";

interface ChatHeaderProps {
  activeChannel: Channel;
  currentUser: string;
  onSelectUser: (user: string) => void;
  messageCount: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenMobileMenu: () => void;
  onMarkAllRead: () => void;
}

export default function ChatHeader({
  activeChannel,
  currentUser,
  onSelectUser,
  messageCount,
  searchQuery,
  onSearchChange,
  onOpenMobileMenu,
  onMarkAllRead,
}: ChatHeaderProps) {
  return (
    <header className="h-18 border-b border-slate-800/80 glass-panel px-4 md:px-6 flex items-center justify-between gap-3 shrink-0 z-10">
      {/* Left: Channel Info & Mobile Hamburger */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-xl bg-slate-800/80 border border-slate-700/70 text-slate-300 hover:text-white transition"
          aria-label="Abrir menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 shadow-inner">
            <Hash className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm md:text-base text-white truncate">
                {activeChannel.name}
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {messageCount} {messageCount === 1 ? "mensagem" : "mensagens"}
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate max-w-[200px] sm:max-w-md">
              {activeChannel.description}
            </p>
          </div>
        </div>
      </div>

      {/* Right: Search, Avatars Stack, Mark Read & Mobile User Selector */}
      <div className="flex items-center gap-2.5">
        {/* Search Input */}
        <div className="relative hidden lg:block w-56">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar no canal..."
            className="w-full bg-slate-900/80 text-xs text-slate-200 placeholder-slate-500 pl-8 pr-7 py-2 rounded-xl border border-slate-800 focus:border-indigo-500/60 focus:outline-none transition"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Team Avatar Stack (Desktop) */}
        <div className="hidden sm:flex items-center -space-x-2 mr-1">
          {TEAM_MEMBERS.map((member) => {
            const isMe = member.name === currentUser;
            return (
              <button
                key={member.name}
                onClick={() => onSelectUser(member.name)}
                title={`Alternar para ${member.name} (${member.role})`}
                className={`relative rounded-full transition-transform hover:scale-110 hover:z-10 cursor-pointer ${
                  isMe ? "z-10 ring-2 ring-indigo-500" : "opacity-80 hover:opacity-100"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-7 h-7 rounded-full bg-slate-800 border border-slate-900"
                />
              </button>
            );
          })}
        </div>

        {/* Mark All as Read Button */}
        <button
          onClick={onMarkAllRead}
          title="Marcar mensagens como lidas (✓✓)"
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 text-emerald-300 text-xs font-medium transition cursor-pointer"
        >
          <CheckCheck className="w-4 h-4 text-emerald-400" />
          <span className="hidden xl:inline">Confirmar Leitura</span>
        </button>

        {/* Mobile Quick User Switcher */}
        <div className="md:hidden flex items-center">
          <select
            value={currentUser}
            onChange={(e) => onSelectUser(e.target.value)}
            aria-label="Selecionar usuário"
            className="bg-slate-800/90 text-xs text-slate-100 border border-slate-700 rounded-xl px-2.5 py-2 focus:outline-none focus:border-indigo-500"
          >
            {TEAM_MEMBERS.map((member) => (
              <option key={member.name} value={member.name}>
                👤 {member.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}
