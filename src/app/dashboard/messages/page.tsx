"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Search, Paperclip, ArrowLeft, MessageCircle, SendHorizonal, MoreVertical,
  Check, CheckCheck, File, FileText, ImageIcon, Download, X, Info, Star,
  StarOff, Trash2, Copy, Shield, AlertCircle, ChevronRight,
} from "lucide-react";
import { useNotificationStore } from "@/lib/notification-store";

// ─── Types ────────────────────────────────────────────────────────────────────

type MessageType = "text" | "file" | "system";

interface FileAttachment {
  name: string;
  size: string;
  type: "pdf" | "doc" | "image" | "other";
}

interface Message {
  id: string;
  type: MessageType;
  text?: string;
  file?: FileAttachment;
  time: string;
  isMe: boolean;
  read: boolean;
  starred?: boolean;
  groupLabel?: string;
  systemText?: string;
}

interface Conversation {
  id: string;
  name: string;
  initials: string;
  lastMessage: string;
  lastMessagePrefix?: string;
  time: string;
  unread: number;
  online: boolean;
  avatarColor: string;
  typing?: boolean;
  verified?: boolean;
  tag?: "buyer" | "seller" | "task";
  listingRef?: string;
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const conversations: Conversation[] = [
  { id: "1", name: "Adewale Properties", initials: "AP", avatarColor: "#0D8A5C", lastMessage: "Is this still available?", time: "2m", unread: 2, online: true, verified: true, tag: "seller", listingRef: "3BR Flat – Lekki Phase 1" },
  { id: "2", name: "Chidinma Okonkwo", initials: "CO", avatarColor: "#0a4d3a", lastMessage: "I'll bring the documents tomorrow morning.", time: "15m", unread: 1, online: true, tag: "buyer", listingRef: "Land Survey – Ajah" },
  { id: "3", name: "Emeka Nwosu", initials: "EN", avatarColor: "#086B43", lastMessage: "The price is negotiable. Let's talk.", time: "1h", unread: 0, online: false, tag: "seller", listingRef: "Toyota Camry 2019" },
  { id: "4", name: "Blessing Adekunle", initials: "BA", avatarColor: "#064e32", lastMessage: "Payment has been confirmed. Thank you!", lastMessagePrefix: "You: ", time: "3h", unread: 0, online: false, tag: "buyer", listingRef: "7-Seater Sofa Set" },
  { id: "5", name: "Obinna Eze", initials: "OE", avatarColor: "#0D8A5C", lastMessage: "Can we schedule a viewing for Saturday?", time: "5h", unread: 3, online: true, typing: true, tag: "buyer", listingRef: "Penthouse – Victoria Island" },
  { id: "6", name: "Aisha Mohammed", initials: "AM", avatarColor: "#0a4d3a", lastMessage: "The delivery arrived safely. Great service!", time: "1d", unread: 0, online: false, tag: "seller", listingRef: "Living Room Furniture Set" },
  { id: "7", name: "Tunde Bakare", initials: "TB", avatarColor: "#086B43", lastMessage: "I've sent the revised invoice.", lastMessagePrefix: "You: ", time: "1d", unread: 0, online: true, tag: "task", listingRef: "Interior Design Project" },
  { id: "8", name: "Folake Williams", initials: "FW", avatarColor: "#064e32", lastMessage: "Looking forward to our meeting next week.", time: "2d", unread: 0, online: false, tag: "task", listingRef: "Property Documentation" },
];

const sampleMessages: Record<string, Message[]> = {
  "1": [
    { id: "m1", type: "system", systemText: "Conversation started about '3BR Flat – Lekki Phase 1'", time: "", isMe: false, read: true },
    { id: "m2", type: "text", text: "Good afternoon! I saw your listing for the 3-bedroom flat in Lekki Phase 1.", time: "1:15 PM", isMe: false, read: true, groupLabel: "Today" },
    { id: "m3", type: "text", text: "Hello! Yes, the property is still available. Are you interested in viewing it?", time: "1:20 PM", isMe: true, read: true },
    { id: "m4", type: "text", text: "Definitely. What's the asking price?", time: "1:25 PM", isMe: false, read: true },
    { id: "m5", type: "text", text: "It's going for ₦85 million. Comes with a boys' quarter and ample parking space.", time: "1:30 PM", isMe: true, read: true },
    { id: "m6", type: "file", file: { name: "Property_Brochure.pdf", size: "2.4 MB", type: "pdf" }, time: "1:32 PM", isMe: true, read: true },
    { id: "m7", type: "text", text: "That's within my budget. Can I schedule a viewing this weekend?", time: "2:00 PM", isMe: false, read: true },
    { id: "m8", type: "text", text: "Saturday works perfectly. The estate is gated with 24/7 security.", time: "2:10 PM", isMe: true, read: true },
    { id: "m9", type: "file", file: { name: "Location_Map.jpg", size: "1.1 MB", type: "image" }, time: "2:11 PM", isMe: true, read: true },
    { id: "m10", type: "text", text: "Perfect. Looking forward to Saturday!", time: "2:25 PM", isMe: false, read: true },
    { id: "m11", type: "text", text: "Is this still available?", time: "2:28 PM", isMe: false, read: false },
  ],
  "2": [
    { id: "m1", type: "system", systemText: "Conversation started about 'Land Survey – Ajah'", time: "", isMe: false, read: true },
    { id: "m2", type: "text", text: "Hi Chidinma, I wanted to follow up on the land survey documents.", time: "9:00 AM", isMe: true, read: true, groupLabel: "Today" },
    { id: "m3", type: "text", text: "Good morning! The surveyor said they'll be ready by tomorrow.", time: "9:30 AM", isMe: false, read: true },
    { id: "m4", type: "text", text: "The total cost is ₦350,000 for the full survey plan and beacon placement.", time: "10:00 AM", isMe: false, read: true },
    { id: "m5", type: "text", text: "Okay, that's reasonable. I'll prepare the payment today.", time: "10:15 AM", isMe: true, read: true },
    { id: "m6", type: "file", file: { name: "Survey_Quote.pdf", size: "890 KB", type: "pdf" }, time: "10:20 AM", isMe: false, read: true },
    { id: "m7", type: "text", text: "Received. I'll process the payment once I confirm with the bank.", time: "10:45 AM", isMe: true, read: true },
    { id: "m8", type: "text", text: "I'll bring the documents tomorrow morning.", time: "11:00 AM", isMe: false, read: false },
  ],
  "3": [
    { id: "m1", type: "system", systemText: "Conversation started about 'Toyota Camry 2019'", time: "", isMe: false, read: true },
    { id: "m2", type: "text", text: "Hello Emeka, I'm interested in the Toyota Camry you listed.", time: "11:00 AM", isMe: true, read: true, groupLabel: "Today" },
    { id: "m3", type: "text", text: "Hi! Yes, 2019 Camry, first body, just 65,000 km. Nothing to fix.", time: "11:20 AM", isMe: false, read: true },
    { id: "m4", type: "file", file: { name: "Car_Documents.pdf", size: "3.2 MB", type: "pdf" }, time: "11:22 AM", isMe: false, read: true },
    { id: "m5", type: "text", text: "Impressive paperwork. You're asking ₦12 million?", time: "12:00 PM", isMe: true, read: true },
    { id: "m6", type: "text", text: "The price is negotiable. Let's talk.", time: "12:15 PM", isMe: false, read: true },
  ],
  "4": [
    { id: "m1", type: "system", systemText: "Transaction completed for '7-Seater Sofa Set'", time: "", isMe: false, read: true },
    { id: "m2", type: "text", text: "Good morning Blessing. Just confirming the payment for the sofa set.", time: "8:30 AM", isMe: true, read: true, groupLabel: "Today" },
    { id: "m3", type: "text", text: "Confirmed! ₦180,000 has been credited. Thank you!", time: "10:00 AM", isMe: false, read: true },
    { id: "m4", type: "file", file: { name: "Payment_Receipt.pdf", size: "124 KB", type: "pdf" }, time: "10:05 AM", isMe: false, read: true },
    { id: "m5", type: "text", text: "Payment has been confirmed. Thank you!", time: "10:05 AM", isMe: true, read: true },
    { id: "m6", type: "text", text: "Saturday works for delivery. I'll send the timeline.", time: "10:45 AM", isMe: false, read: true },
  ],
  "5": [
    { id: "m1", type: "system", systemText: "Conversation started about 'Penthouse – Victoria Island'", time: "", isMe: false, read: true },
    { id: "m2", type: "text", text: "Hi, I saw your penthouse listing in Victoria Island. Still available?", time: "3:00 PM", isMe: false, read: true, groupLabel: "Today" },
    { id: "m3", type: "text", text: "Yes! 4-bedroom with rooftop terrace. ₦25M per annum.", time: "3:15 PM", isMe: true, read: true },
    { id: "m4", type: "file", file: { name: "Penthouse_Photos.zip", size: "18.4 MB", type: "other" }, time: "3:16 PM", isMe: true, read: true },
    { id: "m5", type: "text", text: "That's on the higher end. Are there flexible payment terms?", time: "4:00 PM", isMe: false, read: true },
    { id: "m6", type: "text", text: "We can do quarterly — 25% upfront, then spread over 3 quarters.", time: "4:15 PM", isMe: true, read: true },
    { id: "m7", type: "text", text: "Can we schedule a viewing for Saturday?", time: "4:45 PM", isMe: false, read: false },
  ],
  "6": [
    { id: "m1", type: "system", systemText: "Order delivered — 'Living Room Furniture Set'", time: "", isMe: false, read: true },
    { id: "m2", type: "text", text: "Your tracking number is GIG-2024-78543. Driver calls before arrival.", time: "10:30 AM", isMe: false, read: true, groupLabel: "Yesterday" },
    { id: "m3", type: "file", file: { name: "Delivery_Note.pdf", size: "445 KB", type: "pdf" }, time: "10:31 AM", isMe: false, read: true },
    { id: "m4", type: "text", text: "Great. I'll be home all day.", time: "11:45 AM", isMe: true, read: true },
    { id: "m5", type: "text", text: "The delivery arrived safely. Great service!", time: "4:00 PM", isMe: false, read: true },
  ],
  "7": [
    { id: "m1", type: "system", systemText: "Task started — 'Interior Design Project'", time: "", isMe: false, read: true },
    { id: "m2", type: "text", text: "Tunde, the invoice had discrepancies — labour was quoted ₦200k but shows ₦250k.", time: "2:30 PM", isMe: true, read: true, groupLabel: "Yesterday" },
    { id: "m3", type: "text", text: "You're right, my mistake. I'll send a corrected version.", time: "3:30 PM", isMe: false, read: true },
    { id: "m4", type: "file", file: { name: "Invoice_Revised_v2.pdf", size: "198 KB", type: "pdf" }, time: "4:00 PM", isMe: false, read: true },
    { id: "m5", type: "text", text: "Received and confirmed. Payment processing this week.", time: "4:30 PM", isMe: true, read: true },
  ],
  "8": [
    { id: "m1", type: "system", systemText: "Meeting scheduled — 'Property Documentation'", time: "", isMe: false, read: true },
    { id: "m2", type: "text", text: "Tuesday at 10 AM at Ikoyi office — Suite 5. Visitor parking available.", time: "11:30 AM", isMe: false, read: true, groupLabel: "2 days ago" },
    { id: "m3", type: "file", file: { name: "Meeting_Agenda.docx", size: "67 KB", type: "doc" }, time: "11:31 AM", isMe: false, read: true },
    { id: "m4", type: "text", text: "I'll bring my lawyer and ID. Looking forward to it.", time: "1:00 PM", isMe: true, read: true },
    { id: "m5", type: "text", text: "Looking forward to our meeting next week.", time: "2:30 PM", isMe: false, read: true },
  ],
};

// ─── Sub-components ────────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <div className="flex items-end gap-2 max-w-[75%] py-1">
      <div className="bg-[#F3F4F6] rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex items-center gap-1.5">
          {[0, 150, 300].map((delay) => (
            <span key={delay} className="h-2 w-2 rounded-full bg-[#9CA3AF] animate-bounce"
              style={{ animationDelay: `${delay}ms`, animationDuration: "1s" }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function DateDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 py-4">
      <div className="flex-1 h-px bg-[#F3F4F6]" />
      <span className="text-[11px] font-medium text-[#9CA3AF] uppercase tracking-wide">{label}</span>
      <div className="flex-1 h-px bg-[#F3F4F6]" />
    </div>
  );
}

function SystemMessage({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center py-2">
      <div className="flex items-center gap-1.5 bg-[#F0FDF4] border border-[#BBF7D4] rounded-full px-3 py-1.5">
        <Shield className="h-3 w-3 text-[#0D8A5C]" />
        <span className="text-[11px] font-medium text-[#0D8A5C]">{text}</span>
      </div>
    </div>
  );
}

function FileBubble({ file, isMe }: { file: FileAttachment; isMe: boolean }) {
  const icon = {
    pdf: <FileText className="h-5 w-5 text-rose-500" />,
    doc: <FileText className="h-5 w-5 text-blue-500" />,
    image: <ImageIcon className="h-5 w-5 text-emerald-500" />,
    other: <File className="h-5 w-5 text-[#9CA3AF]" />,
  }[file.type];

  return (
    <div className={`flex items-center gap-3 rounded-2xl px-3.5 py-3 min-w-[200px] max-w-[260px] ${
      isMe ? "bg-[#0B7A52]" : "bg-white border border-[#E5E7EB]"
    }`}>
      <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${isMe ? "bg-white/10" : "bg-[#F3F4F6]"}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${isMe ? "text-white" : "text-[#374151]"}`}>{file.name}</p>
        <p className={`text-xs mt-0.5 ${isMe ? "text-white/60" : "text-[#9CA3AF]"}`}>{file.size}</p>
      </div>
      <button className={`p-1.5 rounded-lg shrink-0 transition-colors ${
        isMe ? "hover:bg-white/10 text-white/70 hover:text-white" : "hover:bg-[#F3F4F6] text-[#9CA3AF] hover:text-[#374151]"
      }`} aria-label="Download file">
        <Download className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function MessageBubble({ message, onStar }: { message: Message; onStar: (id: string) => void }) {
  const [hover, setHover] = useState(false);

  if (message.type === "system" && message.systemText) return <SystemMessage text={message.systemText} />;

  const actions = (
    <div className={`flex items-center gap-0.5 mb-5 transition-opacity duration-100 ${hover ? "opacity-100" : "opacity-0"}`}>
      <button onClick={() => onStar(message.id)}
        className="p-1.5 rounded-lg hover:bg-[#F3F4F6] text-[#9CA3AF] hover:text-amber-500 transition-colors"
        title={message.starred ? "Unstar" : "Star"}>
        {message.starred ? <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> : <StarOff className="h-3.5 w-3.5" />}
      </button>
      <button className="p-1.5 rounded-lg hover:bg-[#F3F4F6] text-[#9CA3AF] hover:text-[#374151] transition-colors" title="Copy">
        <Copy className="h-3.5 w-3.5" />
      </button>
    </div>
  );

  if (message.isMe) {
    return (
      <div className="flex justify-end group py-0.5" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
        <div className="flex items-end gap-1.5 max-w-[75%]">
          {actions}
          <div className="flex flex-col items-end">
            {message.type === "file" && message.file
              ? <FileBubble file={message.file} isMe={true} />
              : <div className="bg-[#0D8A5C] text-white rounded-2xl rounded-tr-sm px-4 py-2.5 shadow-sm">
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
            }
            <div className="flex items-center gap-1 mt-1 pr-0.5">
              <span className="text-[11px] text-[#9CA3AF]">{message.time}</span>
              {message.read
                ? <CheckCheck className="h-3.5 w-3.5 text-[#0D8A5C]" />
                : <Check className="h-3.5 w-3.5 text-[#9CA3AF]" />}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-1.5 group py-0.5" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div className="flex flex-col items-start max-w-[75%]">
        {message.type === "file" && message.file
          ? <FileBubble file={message.file} isMe={false} />
          : <div className="bg-[#F3F4F6] text-[#374151] rounded-2xl rounded-tl-sm px-4 py-2.5">
              <p className="text-sm leading-relaxed">{message.text}</p>
            </div>
        }
        <span className="text-[11px] text-[#9CA3AF] mt-1 pl-0.5">{message.time}</span>
      </div>
      {actions}
    </div>
  );
}

function ConversationItem({ conversation, isActive, onClick }: {
  conversation: Conversation; isActive: boolean; onClick: () => void;
}) {
  const tagColor: Record<string, string> = {
    buyer: "bg-emerald-50 text-emerald-700",
    seller: "bg-teal-50 text-teal-700",
    task: "bg-amber-50 text-amber-700",
  };
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all duration-150 border-l-2 ${
      isActive ? "bg-[#F0FDF4] border-l-[#0D8A5C]" : "border-l-transparent hover:bg-[#F9FAFB] hover:border-l-[#E5E7EB]"
    }`}>
      <div className="relative shrink-0">
        <div className="h-11 w-11 rounded-full flex items-center justify-center text-white text-sm font-semibold"
          style={{ backgroundColor: conversation.avatarColor }}>
          {conversation.initials}
        </div>
        {conversation.online && (
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-[#22C55E]" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <p className={`text-sm font-semibold truncate ${isActive ? "text-[#0D8A5C]" : "text-[#1F2937]"}`}>
              {conversation.name}
            </p>
            {conversation.verified && <Shield className="h-3 w-3 text-[#0D8A5C] shrink-0" />}
          </div>
          <span className="text-[11px] text-[#9CA3AF] shrink-0">{conversation.time}</span>
        </div>
        {conversation.tag && (
          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full mb-1 inline-block ${tagColor[conversation.tag]}`}>
            {conversation.tag}
          </span>
        )}
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-[#9CA3AF] truncate">
            {conversation.typing
              ? <span className="text-[#0D8A5C] font-medium">typing…</span>
              : <>{conversation.lastMessagePrefix && <span className="text-[#6B7280]">{conversation.lastMessagePrefix}</span>}{conversation.lastMessage}</>
            }
          </p>
          {conversation.unread > 0 && (
            <span className="h-5 min-w-[20px] rounded-full bg-[#0D8A5C] text-white text-[11px] font-bold flex items-center justify-center px-1.5 shrink-0">
              {conversation.unread}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full px-8 text-center">
      <div className="h-20 w-20 rounded-2xl bg-[#0D8A5C]/8 flex items-center justify-center mb-5">
        <MessageCircle className="h-9 w-9 text-[#0D8A5C]" />
      </div>
      <h2 className="text-base font-semibold text-[#1F2937] mb-1.5">Your messages</h2>
      <p className="text-sm text-[#9CA3AF] max-w-xs leading-relaxed">
        Select a conversation to read and reply. File sharing available for all chats.
      </p>
      <div className="flex items-center gap-2 mt-5 text-xs text-[#9CA3AF]">
        <Shield className="h-3.5 w-3.5 text-[#0D8A5C]" />
        <span>Protected by PostAll escrow & dispute system</span>
      </div>
    </div>
  );
}

function FilePreview({ file, onRemove }: { file: File; onRemove: () => void }) {
  const isImg = file.type.startsWith("image/");
  return (
    <div className="flex items-center gap-2.5 bg-[#F0FDF4] border border-[#BBF7D4] rounded-xl px-3 py-2 mb-2">
      <div className="h-8 w-8 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center shrink-0">
        {isImg ? <ImageIcon className="h-4 w-4 text-emerald-500" /> : <FileText className="h-4 w-4 text-rose-500" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-[#1F2937] truncate">{file.name}</p>
        <p className="text-[10px] text-[#9CA3AF]">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
      </div>
      <button onClick={onRemove} className="p-1 rounded-lg hover:bg-rose-50 text-[#9CA3AF] hover:text-rose-500 transition-colors">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function MessagesPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const [localMessages, setLocalMessages] = useState<Record<string, Message[]>>({ ...sampleMessages });
  const [localConversations, setLocalConversations] = useState<Conversation[]>(conversations.map((c) => ({ ...c })));
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const setUnreadMessageCount = useNotificationStore((s) => s.setUnreadMessageCount);

  useEffect(() => {
    const total = localConversations.reduce((sum, c) => sum + c.unread, 0);
    setUnreadMessageCount(total);
  }, [localConversations, setUnreadMessageCount]);

  useEffect(() => {
    setLocalConversations((prev) => prev.map((c) => ({ ...c, unread: 0 })));
  }, []);

  const active = localConversations.find((c) => c.id === selectedId);
  const messages = selectedId ? (localMessages[selectedId] || []) : [];
  const sharedFiles = messages.filter((m) => m.type === "file");

  const filtered = localConversations.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchQ = c.name.toLowerCase().includes(q) || c.lastMessage.toLowerCase().includes(q) || (c.listingRef?.toLowerCase().includes(q) ?? false);
    const matchTag = filterTag ? c.tag === filterTag : true;
    return matchQ && matchTag;
  });

  useEffect(() => {
    const t = textareaRef.current;
    if (t) { t.style.height = "auto"; t.style.height = Math.min(t.scrollHeight, 120) + "px"; }
  }, [newMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedId]);

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
    setMobileShowChat(true);
    setNewMessage("");
    setPendingFile(null);
    setShowInfo(false);
    setLocalConversations((prev) => prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
  }, []);

  const handleSend = useCallback(() => {
    if (!selectedId || (!newMessage.trim() && !pendingFile)) return;
    const t = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    if (pendingFile) {
      const sizeMB = (pendingFile.size / 1024 / 1024).toFixed(1);
      const ext = pendingFile.name.split(".").pop()?.toLowerCase() ?? "";
      const ft = pendingFile.type.startsWith("image/") ? "image" : ext === "pdf" ? "pdf" : (ext === "doc" || ext === "docx") ? "doc" : "other";
      const fm: Message = { id: `f-${Date.now()}`, type: "file", file: { name: pendingFile.name, size: `${sizeMB} MB`, type: ft as FileAttachment["type"] }, time: t, isMe: true, read: false };
      setLocalMessages((prev) => ({ ...prev, [selectedId]: [...(prev[selectedId] || []), fm] }));
      setPendingFile(null);
    }

    if (newMessage.trim()) {
      const tm: Message = { id: `t-${Date.now()}`, type: "text", text: newMessage.trim(), time: t, isMe: true, read: false };
      setLocalMessages((prev) => ({ ...prev, [selectedId]: [...(prev[selectedId] || []), tm] }));
      setLocalConversations((prev) => prev.map((c) => c.id === selectedId ? { ...c, lastMessage: newMessage.trim(), lastMessagePrefix: "You: ", time: "Just now" } : c));
      setNewMessage("");
    }
    setTimeout(() => textareaRef.current?.focus(), 50);
  }, [newMessage, pendingFile, selectedId]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }, [handleSend]);

  const handleStar = useCallback((id: string) => {
    if (!selectedId) return;
    setLocalMessages((prev) => ({ ...prev, [selectedId]: prev[selectedId].map((m) => m.id === id ? { ...m, starred: !m.starred } : m) }));
  }, [selectedId]);

  const totalUnread = localConversations.reduce((sum, c) => sum + c.unread, 0);
  const tagFilters: { key: string | null; label: string }[] = [
    { key: null, label: "All" }, { key: "buyer", label: "Buyers" }, { key: "seller", label: "Sellers" }, { key: "task", label: "Tasks" },
  ];

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 130px)" }}>

      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <Link href="/dashboard" className="p-2 -ml-2 rounded-xl hover:bg-[#F3F4F6] transition-colors text-[#6B7280] hover:text-[#374151]" aria-label="Back">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-[#0D8A5C]" />
            Messages
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {totalUnread > 0 ? `${totalUnread} unread` : "All caught up"}
          </p>
        </div>
      </div>

      {/* Container */}
      <div className="flex-1 rounded-xl border border-[#E5E7EB] bg-white overflow-hidden flex min-h-0 shadow-sm">

        {/* ── Sidebar ───────────────────────────────────────────── */}
        <div className={`w-full md:w-[300px] lg:w-[320px] shrink-0 flex flex-col border-r border-[#E5E7EB] h-full ${mobileShowChat ? "hidden md:flex" : "flex"}`}>

          <div className="px-4 pt-4 pb-3 border-b border-[#F3F4F6]">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
              <input type="text" placeholder="Search conversations…" value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-3 text-sm bg-[#F3F4F6] rounded-lg border-none outline-none placeholder:text-[#9CA3AF] text-[#1F2937] focus:ring-2 focus:ring-[#0D8A5C]/20 transition-shadow" />
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {tagFilters.map(({ key, label }) => (
                <button key={label} onClick={() => setFilterTag(key)}
                  className={`shrink-0 text-[11px] font-medium px-3 py-1 rounded-full transition-colors ${filterTag === key ? "bg-[#0D8A5C] text-white" : "bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]"}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <ScrollArea className="flex-1">
            {filtered.length > 0
              ? filtered.map((c) => <ConversationItem key={c.id} conversation={c} isActive={c.id === selectedId} onClick={() => handleSelect(c.id)} />)
              : <div className="flex flex-col items-center py-14 px-4 text-center">
                  <Search className="h-8 w-8 mb-3 text-[#E5E7EB]" />
                  <p className="text-sm font-medium text-[#374151]">No results</p>
                  <p className="text-xs text-[#9CA3AF] mt-1">Try a different search</p>
                </div>
            }
          </ScrollArea>

          <div className="px-4 py-3 border-t border-[#F3F4F6]">
            <div className="flex items-center gap-1.5 text-[11px] text-[#9CA3AF]">
              <Shield className="h-3 w-3 text-[#0D8A5C]" />
              <span>Escrow-protected conversations</span>
            </div>
          </div>
        </div>

        {/* ── Chat area ─────────────────────────────────────────── */}
        <div className={`flex-1 flex min-w-0 h-full ${mobileShowChat ? "flex" : "hidden md:flex"}`}>
          {active ? (
            <>
              {/* Main chat */}
              <div className="flex-1 flex flex-col min-w-0 min-h-0">

                {/* Chat header */}
                <div className="flex items-center gap-3 px-4 py-3 shrink-0 border-b border-[#E5E7EB]">
                  <button onClick={() => setMobileShowChat(false)}
                    className="md:hidden shrink-0 p-1.5 -ml-1 rounded-lg hover:bg-[#F3F4F6] text-[#374151] transition-colors" aria-label="Back">
                    <ArrowLeft className="h-5 w-5" />
                  </button>

                  <div className="relative shrink-0">
                    <div className="h-9 w-9 rounded-full flex items-center justify-center text-white text-xs font-semibold" style={{ backgroundColor: active.avatarColor }}>
                      {active.initials}
                    </div>
                    {active.online && <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#22C55E]" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold text-[#1F2937] truncate">{active.name}</p>
                      {active.verified && <Shield className="h-3.5 w-3.5 text-[#0D8A5C] shrink-0" />}
                    </div>
                    <p className="text-xs text-[#9CA3AF] mt-0.5">
                      {active.typing ? <span className="text-[#0D8A5C] font-medium">typing…</span>
                        : active.online ? <span className="text-[#22C55E] font-medium">Online now</span>
                        : "Offline"}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {active.listingRef && (
                      <Link href="/browse" className="hidden sm:flex items-center gap-1.5 text-xs text-[#0D8A5C] bg-[#F0FDF4] hover:bg-[#DCFCE7] border border-[#BBF7D4] rounded-lg px-2.5 py-1.5 transition-colors">
                        <span className="truncate max-w-[120px]">{active.listingRef}</span>
                        <ChevronRight className="h-3 w-3 shrink-0" />
                      </Link>
                    )}
                    <button onClick={() => setShowInfo((v) => !v)}
                      className={`p-2 rounded-lg transition-colors ${showInfo ? "bg-[#0D8A5C]/10 text-[#0D8A5C]" : "hover:bg-[#F3F4F6] text-[#9CA3AF] hover:text-[#374151]"}`}
                      aria-label="Info" title="Conversation info">
                      <Info className="h-4 w-4" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-[#F3F4F6] text-[#9CA3AF] hover:text-[#374151] transition-colors" aria-label="More">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1">
                  <div className="px-4 py-3 space-y-0.5">
                    {messages.map((msg) => (
                      <div key={msg.id}>
                        {msg.groupLabel && <DateDivider label={msg.groupLabel} />}
                        <MessageBubble message={msg} onStar={handleStar} />
                      </div>
                    ))}
                    {active.typing && <TypingDots />}
                    <div ref={messagesEndRef} className="h-1" />
                  </div>
                </ScrollArea>

                {/* Input */}
                <div className="shrink-0 px-4 pt-3 pb-4 border-t border-[#E5E7EB]">
                  {pendingFile && <FilePreview file={pendingFile} onRemove={() => setPendingFile(null)} />}

                  <div className="flex items-end gap-2">
                    <button onClick={() => fileInputRef.current?.click()}
                      className="shrink-0 p-2 rounded-xl hover:bg-[#F3F4F6] text-[#9CA3AF] hover:text-[#0D8A5C] transition-colors mb-0.5"
                      aria-label="Attach file" title="Attach file (PDF, image, Word, ZIP)">
                      <Paperclip className="h-5 w-5" />
                    </button>
                    <input ref={fileInputRef} type="file" className="hidden"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.zip"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) setPendingFile(f); e.target.value = ""; }} />

                    <div className="flex-1 bg-[#F3F4F6] rounded-2xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-[#0D8A5C]/20 transition-shadow">
                      <textarea ref={textareaRef} placeholder="Type a message… (Enter to send)" value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)} onKeyDown={handleKeyDown} rows={1}
                        className="w-full bg-transparent text-sm text-[#1F2937] outline-none border-none placeholder:text-[#9CA3AF] resize-none leading-relaxed"
                        style={{ maxHeight: "120px" }} />
                    </div>

                    <button onClick={handleSend} disabled={!newMessage.trim() && !pendingFile}
                      className={`shrink-0 h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-200 mb-0.5 ${
                        newMessage.trim() || pendingFile
                          ? "bg-[#0D8A5C] text-white hover:bg-[#086B43] shadow-md shadow-[#0D8A5C]/20"
                          : "bg-[#F3F4F6] text-[#D1D5DB] cursor-not-allowed"
                      }`} aria-label="Send">
                      <SendHorizonal className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="text-[10px] text-[#9CA3AF] mt-2 pl-1">
                    Accepts PDF, Word, JPG/PNG, ZIP — max 25 MB · Shift+Enter for new line
                  </p>
                </div>
              </div>

              {/* ── Info panel ──────────────────────────────────── */}
              {showInfo && (
                <div className="hidden lg:flex w-60 xl:w-64 shrink-0 flex-col border-l border-[#E5E7EB] bg-[#FAFAFA]">
                  <div className="px-4 py-3.5 border-b border-[#E5E7EB] flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-[#1F2937]">Details</h3>
                    <button onClick={() => setShowInfo(false)} className="p-1 rounded-lg hover:bg-[#F3F4F6] text-[#9CA3AF] hover:text-[#374151] transition-colors">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <ScrollArea className="flex-1">
                    <div className="p-4 space-y-6">

                      {/* User */}
                      <div className="text-center">
                        <div className="h-14 w-14 rounded-full flex items-center justify-center text-white text-lg font-semibold mx-auto mb-3"
                          style={{ backgroundColor: active.avatarColor }}>
                          {active.initials}
                        </div>
                        <p className="text-sm font-semibold text-[#1F2937]">{active.name}</p>
                        <div className="flex items-center justify-center gap-1.5 mt-1.5 flex-wrap">
                          {active.verified && (
                            <Badge className="text-[10px] bg-[#F0FDF4] text-[#0D8A5C] border-[#BBF7D4] gap-1 py-0.5">
                              <Shield className="h-2.5 w-2.5" />Verified
                            </Badge>
                          )}
                          {active.tag && (
                            <Badge variant="outline" className="text-[10px] py-0.5 capitalize">{active.tag}</Badge>
                          )}
                          <Badge variant="outline" className={`text-[10px] py-0.5 gap-1 ${active.online ? "text-[#22C55E] border-green-200" : "text-[#9CA3AF]"}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${active.online ? "bg-[#22C55E]" : "bg-[#9CA3AF]"}`} />
                            {active.online ? "Online" : "Offline"}
                          </Badge>
                        </div>
                      </div>

                      {/* Listing */}
                      {active.listingRef && (
                        <div>
                          <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wide mb-2">About</p>
                          <Link href="/browse" className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#0D8A5C]/40 transition-colors group">
                            <div className="h-7 w-7 rounded-lg bg-[#F0FDF4] flex items-center justify-center shrink-0">
                              <FileText className="h-3.5 w-3.5 text-[#0D8A5C]" />
                            </div>
                            <p className="text-xs font-medium text-[#374151] group-hover:text-[#0D8A5C] truncate transition-colors">
                              {active.listingRef}
                            </p>
                            <ChevronRight className="h-3 w-3 text-[#9CA3AF] group-hover:text-[#0D8A5C] shrink-0 ml-auto transition-colors" />
                          </Link>
                        </div>
                      )}

                      {/* Files */}
                      <div>
                        <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wide mb-2">
                          Shared Files ({sharedFiles.length})
                        </p>
                        {sharedFiles.length > 0 ? (
                          <div className="space-y-1.5">
                            {sharedFiles.map((msg) => msg.file && (
                              <div key={msg.id} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-[#E5E7EB] group hover:border-[#0D8A5C]/30 transition-colors">
                                <div className="h-7 w-7 rounded-lg bg-[#F3F4F6] flex items-center justify-center shrink-0">
                                  {msg.file.type === "pdf" ? <FileText className="h-3.5 w-3.5 text-rose-500" />
                                    : msg.file.type === "image" ? <ImageIcon className="h-3.5 w-3.5 text-emerald-500" />
                                    : <File className="h-3.5 w-3.5 text-[#9CA3AF]" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium text-[#374151] truncate">{msg.file.name}</p>
                                  <p className="text-[10px] text-[#9CA3AF]">{msg.file.size}</p>
                                </div>
                                <button className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-[#F3F4F6] text-[#9CA3AF] hover:text-[#374151] transition-all">
                                  <Download className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-[#9CA3AF] text-center py-5 bg-white rounded-xl border border-[#E5E7EB] border-dashed">
                            No files shared yet
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div>
                        <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wide mb-2">Actions</p>
                        <div className="space-y-1">
                          <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs text-[#374151] hover:bg-white hover:border hover:border-[#E5E7EB] transition-colors text-left">
                            <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
                            Report this user
                          </button>
                          <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs text-rose-500 hover:bg-rose-50 transition-colors text-left">
                            <Trash2 className="h-4 w-4 shrink-0" />
                            Delete conversation
                          </button>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              )}
            </>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
}
