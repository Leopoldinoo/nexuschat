"use client";

import React from "react";
import { X, ExternalLink, Download, ZoomIn } from "lucide-react";

interface MediaModalProps {
  mediaUrl: string | null;
  mediaType?: "image" | "video" | null;
  sender?: string;
  caption?: string;
  onClose: () => void;
}

export default function MediaModal({
  mediaUrl,
  mediaType = "image",
  sender,
  caption,
  onClose,
}: MediaModalProps) {
  if (!mediaUrl) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/70">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <ZoomIn className="w-4 h-4 text-indigo-400" />
            <span>
              Mídia compartilhada {sender ? `por ${sender}` : "no chat"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={mediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              title="Abrir original em nova aba"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href={mediaUrl}
              download
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              title="Baixar arquivo"
            >
              <Download className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 transition cursor-pointer"
              title="Fechar visualização"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Media Content */}
        <div className="p-4 flex items-center justify-center bg-slate-950/60 max-h-[75vh] overflow-auto">
          {mediaType === "video" ? (
            <video
              src={mediaUrl}
              controls
              autoPlay
              className="max-h-[70vh] w-auto rounded-xl border border-slate-800"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={mediaUrl}
              alt={caption || "Visualização ampliada"}
              className="max-h-[70vh] w-auto object-contain rounded-xl"
            />
          )}
        </div>

        {caption && (
          <div className="px-4 py-3 border-t border-slate-800 bg-slate-900/80 text-xs text-slate-300">
            {caption}
          </div>
        )}
      </div>
    </div>
  );
}
