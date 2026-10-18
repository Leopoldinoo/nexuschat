export type MessageStatus = "sent" | "delivered" | "read";

export type MediaType = "image" | "video" | "audio" | null;

export interface Message {
  id?: string;
  channelId: string;
  sender: string;
  senderRole?: string;
  avatar: string;
  text?: string;
  imageUrl?: string | null;
  mediaUrl?: string | null;
  mediaType?: MediaType;
  audioDuration?: number;
  createdAt: number;
  status?: MessageStatus;
  readBy?: string[];
  reactions?: Record<string, number>;
  replyTo?: {
    id: string;
    sender: string;
    text: string;
  } | null;
}

export interface Channel {
  id: string;
  name: string;
  description: string;
  icon?: string;
  createdAt: number;
  createdBy?: string;
  isDefault?: boolean;
}

export interface UserProfile {
  name: string;
  role: string;
  avatar: string;
  color: string;
  badgeColor: string;
  statusText: string;
}

export interface TypingStatus {
  user: string;
  channelId: string;
  isTyping: boolean;
  updatedAt: number;
}

export const TEAM_MEMBERS: UserProfile[] = [
  {
    name: "Otávio",
    role: "Líder Técnico & Dev",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Otavio&backgroundColor=6366f1",
    color: "from-indigo-500 to-violet-600",
    badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    statusText: "Apresentando o NexusChat 🚀",
  },
  {
    name: "Vitória",
    role: "UI/UX & Design",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Vitoria&backgroundColor=ec4899",
    color: "from-pink-500 to-rose-600",
    badgeColor: "bg-pink-500/20 text-pink-300 border-pink-500/30",
    statusText: "Refinando a interface ✨",
  },
  {
    name: "Professor",
    role: "Avaliador / Docente",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Prof&backgroundColor=10b981",
    color: "from-emerald-500 to-teal-600",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    statusText: "Avaliando a apresentação 📋",
  },
  {
    name: "Davi",
    role: "Arquitetura & Backend",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Davi&backgroundColor=06b6d4",
    color: "from-cyan-500 to-blue-600",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    statusText: "Monitorando o Firestore 🔥",
  },
  {
    name: "Marcos",
    role: "QA & Apresentação",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Marcos&backgroundColor=f59e0b",
    color: "from-amber-500 to-orange-600",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    statusText: "Testando recursos em tempo real ⚡",
  },
];

export const DEFAULT_CHANNELS: Channel[] = [
  {
    id: "geral",
    name: "geral",
    description: "Canal principal de bate-papo e avisos gerais da turma",
    createdAt: 1700000000000,
    createdBy: "Sistema",
    isDefault: true,
  },
  {
    id: "apresentacao",
    name: "apresentacao",
    description: "Demonstração ao vivo dos recursos do NexusChat na sala",
    createdAt: 1700000001000,
    createdBy: "Otávio",
    isDefault: true,
  },
  {
    id: "duvidas-projeto",
    name: "duvidas-projeto",
    description: "Espaço para perguntas do Professor e colegas sobre o código",
    createdAt: 1700000002000,
    createdBy: "Professor",
    isDefault: true,
  },
];
