"use client";

import { useState, useEffect, useRef } from "react";
import {
  Bot,
  Send,
  Plus,
  ImagePlus,
  User,
  MessageSquare,
  Loader2,
  Trash2,
  Search,
  Menu,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  image_url?: string | null;
  created_at?: string;
}

interface Session {
  id: string;
  title: string;
  created_at: string;
}

export default function AiAssistantPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deletingSession, setDeletingSession] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/ai/sessions")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setSessions(data);
      });
  }, []);

  useEffect(() => {
    if (!activeSession) return;
    fetch(`/api/ai/sessions/${activeSession}/messages`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setMessages(data);
      });
  }, [activeSession]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const filteredSessions = searchQuery
    ? sessions.filter((s) =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : sessions;

  async function createSession() {
    const res = await fetch("/api/ai/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Yeni Sohbet" }),
    });
    const data = await res.json();
    if (res.ok) {
      setSessions((prev) => [data, ...prev]);
      setActiveSession(data.id);
      setMessages([]);
      setSidebarOpen(false);
    }
  }

  async function deleteSession(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm("Bu sohbeti silmek istediğinize emin misiniz?")) return;
    setDeletingSession(id);
    const res = await fetch(`/api/ai/sessions/${id}`, { method: "DELETE" });
    if (res.ok) {
      setSessions((prev) => prev.filter((s) => s.id !== id));
      if (activeSession === id) {
        setActiveSession(null);
        setMessages([]);
      }
      toast.success("Sohbet silindi");
    } else {
      toast.error("Sohbet silinemedi");
    }
    setDeletingSession(null);
  }

  async function handleSend() {
    if (!input.trim() && !image) return;

    let sessionId = activeSession;

    if (!sessionId) {
      const res = await fetch("/api/ai/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: input.slice(0, 50) || "Fotoğraf Analizi",
        }),
      });
      const data = await res.json();
      if (!res.ok) return;
      sessionId = data.id;
      setSessions((prev) => [data, ...prev]);
      setActiveSession(sessionId);
    }

    const userMsgId = Date.now().toString();
    const userMsg: Message = {
      id: userMsgId,
      role: "user",
      content: input || "Fotoğraf gönderildi",
      image_url: image || null,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    const sentInput = input;
    const sentImage = image;
    setInput("");
    setImage(null);
    setLoading(true);
    setError(null);

    const res = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: sentInput,
        image: sentImage,
        session_id: sessionId,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error);
      return;
    }

    // Kullanıcı mesajındaki base64'ü Storage URL ile değiştir
    if (data.image_url) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === userMsgId ? { ...m, image_url: data.image_url } : m,
        ),
      );
    }

    setMessages((prev) => [
      ...prev,
      {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
        created_at: new Date().toISOString(),
      },
    ]);

    // Oturum başlığını güncelle (ilk mesajsa)
    if (sessionId) {
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId && s.title === "Yeni Sohbet" && sentInput
            ? {
                ...s,
                title:
                  sentInput.length > 50
                    ? sentInput.slice(0, 47) + "..."
                    : sentInput,
              }
            : s,
        ),
      );
    }
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  function formatTime(dateStr?: string) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
  }

  function formatSessionDate(dateStr: string) {
    const d = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diffDays === 0) return "Bugün";
    if (diffDays === 1) return "Dün";
    if (diffDays < 7) return `${diffDays} gün önce`;
    return d.toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
  }

  const sessionSidebar = (
    <div className="flex h-full flex-col gap-2">
      <Button onClick={createSession} className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        Yeni Sohbet
      </Button>
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Sohbet ara..."
          className="h-9 pl-8 text-sm"
        />
      </div>
      <div className="flex-1 space-y-1 overflow-y-auto">
        {filteredSessions.map((s) => (
          <button
            key={s.id}
            onClick={() => {
              setActiveSession(s.id);
              setSidebarOpen(false);
            }}
            className={`group flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors ${
              activeSession === s.id
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5 shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="block truncate">{s.title}</span>
              <span
                className={`text-[10px] ${
                  activeSession === s.id
                    ? "text-primary-foreground/70"
                    : "text-muted-foreground"
                }`}
              >
                {formatSessionDate(s.created_at)}
              </span>
            </div>
            <button
              onClick={(e) => deleteSession(s.id, e)}
              disabled={deletingSession === s.id}
              className={`shrink-0 rounded p-1 opacity-0 transition-opacity group-hover:opacity-100 ${
                activeSession === s.id
                  ? "hover:bg-primary-foreground/10"
                  : "hover:bg-muted-foreground/10"
              }`}
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </button>
        ))}
        {filteredSessions.length === 0 && searchQuery && (
          <p className="py-4 text-center text-xs text-muted-foreground">
            Sonuç bulunamadı
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      {/* Mobil sidebar toggle */}
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-20 right-4 z-40 h-10 w-10 rounded-full shadow-lg md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Mobil sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Desktop */}
      <div className="hidden w-64 flex-col gap-2 md:flex">
        {sessionSidebar}
      </div>

      {/* Sidebar - Mobil */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-background p-4 shadow-xl transition-transform md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sessionSidebar}
      </div>

      {/* Chat Alanı */}
      <Card className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <CardContent className="flex min-w-0 flex-1 flex-col overflow-hidden p-4">
          {/* Mesajlar */}
          <div className="min-w-0 flex-1 space-y-4 overflow-x-hidden overflow-y-auto pb-4">
            {messages.length === 0 && !loading && (
              <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
                <Bot className="mb-3 h-12 w-12" />
                <p className="font-medium">AI Tarım Danışmanı</p>
                <p className="mt-1 text-center text-sm">
                  Tarımla ilgili sorularınızı sorun veya bitki fotoğrafı
                  yükleyin
                </p>
                <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {[
                    "Buğdayda pas hastalığı nasıl tedavi edilir?",
                    "Domates için en iyi gübreleme programı nedir?",
                    "Toprak pH'ı nasıl düzenlenir?",
                    "İlaçlama için uygun hava koşulları nelerdir?",
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => setInput(q)}
                      className="rounded-lg border p-2 text-left text-xs hover:bg-muted"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
              >
                {msg.role === "assistant" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div className="max-w-[70%] min-w-0 overflow-hidden">
                  {msg.image_url && (
                    <div className="mb-1.5">
                      <img
                        src={msg.image_url}
                        alt="Yüklenen fotoğraf"
                        className="max-h-48 rounded-lg object-cover"
                      />
                    </div>
                  )}
                  <div
                    className={`rounded-lg px-4 py-2 text-sm ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                    style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
                  >
                    <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                  </div>
                  <p
                    className={`mt-0.5 text-[10px] text-muted-foreground ${
                      msg.role === "user" ? "text-right" : ""
                    }`}
                  >
                    {formatTime(msg.created_at)}
                  </p>
                </div>
                {msg.role === "user" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-muted px-4 py-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Düşünüyor...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Hata */}
          {error && (
            <p className="mb-2 text-sm text-destructive">{error}</p>
          )}

          {/* Seçili fotoğraf önizleme */}
          {image && (
            <div className="mb-2 flex items-center gap-2">
              <img
                src={image}
                alt="Yüklenen"
                className="h-16 w-16 rounded-md object-cover"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setImage(null)}
              >
                Kaldır
              </Button>
            </div>
          )}

          {/* Input */}
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
            >
              <ImagePlus className="h-4 w-4" />
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tarımla ilgili sorunuzu yazın..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              disabled={loading}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={loading || (!input.trim() && !image)}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
