"use client";

import { useState, useEffect, useRef } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import {
  Send,
  User,
  MessageSquare,
  Sparkles,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";

type Message = {
  id?: string;
  sender: string;
  avatar: string;
  text?: string;
  imageUrl?: string;
  createdAt: number;
  reactions?: Record<string, number>;
};

// Avatares atualizados
const AVATARS = [
  {
    name: "Otávio",
    url: "https://api.dicebear.com/7.x/bottts/svg?seed=Otavio",
  },
  {
    name: "Vitória",
    url: "https://api.dicebear.com/7.x/bottts/svg?seed=Vitoria",
  },
  {
    name: "Professor",
    url: "https://api.dicebear.com/7.x/bottts/svg?seed=Prof",
  },
];

export default function ChatApp() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);
  const [currentUser, setCurrentUser] = useState<string>("Otávio");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentAvatar =
    AVATARS.find((a) => a.name === currentUser)?.url || AVATARS[0].url;

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Message, "id">),
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !imageUrlInput.trim()) return;

    const textToSend = inputText;
    const imgToSend = imageUrlInput;

    setInputText("");
    setImageUrlInput("");
    setShowImageInput(false);

    try {
      await addDoc(collection(db, "messages"), {
        sender: currentUser,
        avatar: currentAvatar,
        text: textToSend,
        imageUrl: imgToSend || null,
        createdAt: Date.now(),
        reactions: {},
      });
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  };

  const handleReact = async (messageId: string, emoji: string) => {
    const messageRef = doc(db, "messages", messageId);
    const targetMsg = messages.find((m) => m.id === messageId);
    if (!targetMsg) return;

    const currentReactions = targetMsg.reactions || {};
    const newCount = (currentReactions[emoji] || 0) + 1;

    try {
      await updateDoc(messageRef, {
        [`reactions.${emoji}`]: newCount,
      });
    } catch (error) {
      console.error("Erro ao reagir:", error);
    }
  };

  const handleClearChat = async () => {
    if (
      !confirm(
        "Tem certeza que deseja apagar todas as mensagens da demonstração?",
      )
    )
      return;
    try {
      const querySnapshot = await getDocs(collection(db, "messages"));
      querySnapshot.forEach(async (document) => {
        await deleteDoc(doc(db, "messages", document.id));
      });
    } catch (error) {
      console.error("Erro ao limpar chat:", error);
    }
  };

  return (
    <main className="flex h-screen w-full bg-slate-950 text-slate-100 font-sans">
      {/* Sidebar - Controles do App */}
      <aside className="w-80 border-r border-slate-800 bg-slate-900/50 p-6 flex flex-col justify-between hidden md:flex">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/30">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white leading-tight">
                NexusChat
              </h1>
              <p className="text-xs text-slate-400">Projeto Escolar</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
              Selecione seu Usuário:
            </label>
            <div className="space-y-2">
              {AVATARS.map((user) => (
                <button
                  key={user.name}
                  onClick={() => setCurrentUser(user.name)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg text-sm transition-all ${
                    currentUser === user.name
                      ? "bg-indigo-600/20 border border-indigo-500 text-indigo-300 font-medium"
                      : "bg-slate-800/50 hover:bg-slate-800 text-slate-300 border border-transparent"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={user.url}
                      alt={user.name}
                      className="w-6 h-6 rounded-full bg-slate-700"
                    />
                    {user.name}
                  </span>
                  {currentUser === user.name && (
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleClearChat}
            className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs transition"
          >
            <Trash2 className="w-4 h-4" />
            <span>Limpar Histórico de Mensagens</span>
          </button>

          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 text-xs text-slate-400">
            💡 <strong>Dica:</strong> Abra o site em 2 janelas/dispositivos para
            simular a troca de mensagens ao vivo na apresentação!
          </div>
        </div>
      </aside>

      {/* Área Central do Chat */}
      <section className="flex-1 flex flex-col h-full bg-slate-950">
        {/* Cabeçalho */}
        <header className="p-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentAvatar}
              alt={currentUser}
              className="w-10 h-10 rounded-full bg-indigo-600 p-1 border border-indigo-500/50"
            />
            <div>
              <h2 className="font-semibold text-white">Sala de Demonstração</h2>
              <p className="text-xs text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Sincronização Ativa ({currentUser})
              </p>
            </div>
          </div>

          {/* Seleção Mobile de Usuário */}
          <div className="md:hidden">
            <select
              value={currentUser}
              onChange={(e) => setCurrentUser(e.target.value)}
              className="bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded-lg p-2"
            >
              {AVATARS.map((a) => (
                <option key={a.name} value={a.name}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
        </header>

        {/* Lista de Mensagens */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-500 text-sm">
              Nenhuma mensagem enviada ainda. Digite algo abaixo!
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.sender === currentUser;
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${
                    isMe ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      msg.avatar ||
                      "https://api.dicebear.com/7.x/bottts/svg?seed=User"
                    }
                    alt={msg.sender}
                    className="w-8 h-8 rounded-full bg-slate-800 p-0.5 border border-slate-700 shrink-0 mt-1"
                  />

                  <div
                    className={`flex flex-col ${
                      isMe ? "items-end" : "items-start"
                    }`}
                  >
                    <span className="text-[10px] text-slate-400 mb-1 px-1">
                      {msg.sender}
                    </span>

                    <div
                      className={`group relative max-w-[80%] md:max-w-[60%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                        isMe
                          ? "bg-indigo-600 text-white rounded-tr-none"
                          : "bg-slate-800 text-slate-100 border border-slate-700/50 rounded-tl-none"
                      }`}
                    >
                      {msg.text && <p>{msg.text}</p>}

                      {msg.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={msg.imageUrl}
                          alt="Anexo enviado"
                          className="mt-2 rounded-lg max-h-48 object-cover border border-slate-700/50"
                        />
                      )}

                      <div
                        className={`absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition flex gap-1 bg-slate-900/90 border border-slate-700 p-1 rounded-full text-xs shadow-lg ${
                          isMe ? "-left-20" : "-right-20"
                        }`}
                      >
                        {["👍", "❤️", "🔥"].map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => msg.id && handleReact(msg.id, emoji)}
                            className="hover:scale-125 transition px-1"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>

                    {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {Object.entries(msg.reactions).map(([emoji, count]) => (
                          <span
                            key={emoji}
                            className="bg-slate-900 border border-slate-800 text-[10px] px-1.5 py-0.5 rounded-full text-slate-300"
                          >
                            {emoji} {count}
                          </span>
                        ))}
                      </div>
                    )}

                    <span className="text-[9px] text-slate-500 mt-1 px-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Formulário de Envio */}
        <form
          onSubmit={handleSendMessage}
          className="p-4 border-t border-slate-800 bg-slate-900/50 flex flex-col gap-2"
        >
          {showImageInput && (
            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="Cole o URL da imagem (ex: https://site.com/foto.jpg)..."
                className="flex-1 bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded-lg p-2 focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowImageInput(!showImageInput)}
              className={`p-3 rounded-xl border transition ${
                showImageInput
                  ? "bg-indigo-600/20 border-indigo-500 text-indigo-400"
                  : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
              }`}
              title="Anexar URL de Imagem"
            >
              <ImageIcon className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Enviar como ${currentUser}...`}
              className="flex-1 bg-slate-800/80 text-slate-100 placeholder-slate-500 text-sm border border-slate-700 focus:border-indigo-500 focus:outline-none rounded-xl px-4 py-3 transition"
            />

            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-medium px-5 py-3 rounded-xl transition flex items-center gap-2 text-sm shadow-md shadow-indigo-600/30"
            >
              <span>Enviar</span>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
