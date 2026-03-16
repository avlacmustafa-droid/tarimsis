"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Clock,
  Eye,
  MessageCircle,
  CheckCircle2,
  Send,
  Trash2,
  Award,
  ThumbsUp,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FORUM_CATEGORIES } from "@tarimsis/shared";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface TopicData {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  is_solved: boolean;
  view_count: number;
  created_at: string;
  profiles: { full_name: string; avatar_url: string | null } | null;
}

interface ReplyData {
  id: string;
  topic_id: string;
  user_id: string;
  content: string;
  is_solution: boolean;
  created_at: string;
  like_count: number;
  user_liked: boolean;
  profiles: { full_name: string; avatar_url: string | null } | null;
}

const categoryColors: Record<string, string> = {
  general: "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300",
  disease: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
  fertilizing: "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400",
  irrigation: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
  planting: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  equipment: "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400",
  market: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400",
  other: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function timeAgo(dateStr: string) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return "az önce";
  if (diff < 3600) return `${Math.floor(diff / 60)} dk önce`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} saat önce`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} gün önce`;
  return date.toLocaleDateString("tr-TR");
}

export default function TopicDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [topic, setTopic] = useState<TopicData | null>(null);
  const [replies, setReplies] = useState<ReplyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState("");
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    loadUser();
    fetchTopic();
    fetchReplies();
  }, [id]);

  async function loadUser() {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) setCurrentUserId(user.id);
  }

  async function fetchTopic() {
    try {
      const res = await fetch(`/api/forum/topics/${id}`);
      if (res.ok) setTopic(await res.json());
    } catch {
      // ignore
    }
    setLoading(false);
  }

  async function fetchReplies() {
    try {
      const res = await fetch(`/api/forum/topics/${id}/replies`);
      if (res.ok) setReplies(await res.json());
    } catch {
      // ignore
    }
  }

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setSending(true);
    try {
      const res = await fetch(`/api/forum/topics/${id}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: replyContent }),
      });

      if (res.ok) {
        setReplyContent("");
        toast.success("Yanıtınız gönderildi");
        fetchReplies();
      }
    } catch {
      toast.error("Yanıt gönderilemedi");
    }
    setSending(false);
  }

  async function handleLike(replyId: string) {
    try {
      const res = await fetch(`/api/forum/replies/${replyId}/like`, {
        method: "POST",
      });
      if (res.ok) {
        const { liked } = await res.json();
        setReplies((prev) =>
          prev.map((r) =>
            r.id === replyId
              ? {
                  ...r,
                  user_liked: liked,
                  like_count: liked ? r.like_count + 1 : r.like_count - 1,
                }
              : r,
          ),
        );
      }
    } catch {
      // ignore
    }
  }

  async function handleMarkSolution(replyId: string) {
    try {
      const res = await fetch(`/api/forum/replies/${replyId}/solution`, {
        method: "POST",
      });
      if (res.ok) {
        setReplies((prev) =>
          prev.map((r) => ({
            ...r,
            is_solution: r.id === replyId,
          })),
        );
        setTopic((prev) => (prev ? { ...prev, is_solved: true } : prev));
        toast.success("Çözüm olarak işaretlendi");
      }
    } catch {
      toast.error("İşlem başarısız");
    }
  }

  async function handleSolveTopic() {
    try {
      await fetch(`/api/forum/topics/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_solved: true }),
      });
      setTopic((prev) => (prev ? { ...prev, is_solved: true } : prev));
      toast.success("Konu çözüldü olarak işaretlendi");
    } catch {
      // ignore
    }
  }

  async function handleDeleteTopic() {
    if (!confirm("Bu konuyu silmek istediğinize emin misiniz?")) return;

    try {
      const res = await fetch(`/api/forum/topics/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/dashboard/forum");
      }
    } catch {
      // ignore
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg font-medium">Konu bulunamadı</p>
        <Link href="/dashboard/forum">
          <Button variant="outline" className="mt-4">
            Foruma Dön
          </Button>
        </Link>
      </div>
    );
  }

  const isOwner = currentUserId === topic.user_id;

  // Çözüm yanıtını en üste al
  const sortedReplies = [...replies].sort((a, b) => {
    if (a.is_solution && !b.is_solution) return -1;
    if (!a.is_solution && b.is_solution) return 1;
    return 0;
  });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Geri & Başlık */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/forum">
          <Button variant="ghost" size="icon" className="rounded-xl">
            <ArrowLeft size={18} />
          </Button>
        </Link>
        <span className="text-sm text-muted-foreground">Forum</span>
      </div>

      {/* Konu Kartı */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-5 sm:p-6">
          {/* Kategori & Durum */}
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <span
              className={`rounded-md px-2.5 py-1 text-xs font-medium ${categoryColors[topic.category] || categoryColors.other}`}
            >
              {FORUM_CATEGORIES[topic.category] || topic.category}
            </span>
            {topic.is_solved && (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-950/40 dark:text-green-400">
                <CheckCircle2 size={13} />
                Çözüldü
              </span>
            )}
          </div>

          {/* Başlık */}
          <h1 className="text-xl font-bold sm:text-2xl">{topic.title}</h1>

          {/* Meta */}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              {topic.profiles?.avatar_url ? (
                <img
                  src={topic.profiles.avatar_url}
                  alt=""
                  className="h-6 w-6 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-primary to-emerald-600">
                  <User size={11} className="text-white" />
                </div>
              )}
              {topic.profiles?.full_name || "Anonim"}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {formatDate(topic.created_at)}
            </span>
            <span className="flex items-center gap-1">
              <Eye size={14} />
              {topic.view_count} görüntülenme
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle size={14} />
              {replies.length} yanıt
            </span>
          </div>

          {/* İçerik */}
          <div className="mt-5 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
            {topic.content}
          </div>

          {/* Aksiyon Butonları (konu sahibi için) */}
          {isOwner && (
            <div className="mt-6 flex gap-2 border-t pt-4">
              {!topic.is_solved && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-green-600 hover:bg-green-50 hover:text-green-700 dark:text-green-400 dark:hover:bg-green-950/30"
                  onClick={handleSolveTopic}
                >
                  <CheckCircle2 size={14} />
                  Çözüldü Olarak İşaretle
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/30"
                onClick={handleDeleteTopic}
              >
                <Trash2 size={14} />
                Sil
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Yanıtlar */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">
          Yanıtlar ({replies.length})
        </h2>

        {replies.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="flex flex-col items-center py-10">
              <MessageCircle className="h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                Henüz yanıt yok. İlk yanıtı siz verin!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {sortedReplies.map((reply) => (
              <Card
                key={reply.id}
                className={`border-0 shadow-sm transition-all ${
                  reply.is_solution
                    ? "ring-2 ring-green-500/30 bg-green-50/30 dark:bg-green-950/10"
                    : ""
                }`}
              >
                <CardContent className="p-4 sm:p-5">
                  {reply.is_solution && (
                    <div className="mb-3 flex items-center gap-1.5 text-xs font-medium text-green-600 dark:text-green-400">
                      <Award size={14} />
                      En İyi Yanıt — Çözüm olarak seçildi
                    </div>
                  )}
                  <div className="flex gap-3">
                    {reply.profiles?.avatar_url ? (
                      <img
                        src={reply.profiles.avatar_url}
                        alt=""
                        className="h-8 w-8 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                        <User size={14} className="text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium">
                          {reply.profiles?.full_name || "Anonim"}
                        </span>
                        {reply.user_id === topic.user_id && (
                          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                            Soru Sahibi
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {timeAgo(reply.created_at)}
                        </span>
                      </div>
                      <div className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                        {reply.content}
                      </div>

                      {/* Beğeni & Çözüm Butonları */}
                      <div className="mt-3 flex items-center gap-3">
                        <button
                          onClick={() => handleLike(reply.id)}
                          className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                            reply.user_liked
                              ? "bg-primary/10 text-primary"
                              : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                          }`}
                        >
                          <ThumbsUp
                            size={13}
                            className={reply.user_liked ? "fill-current" : ""}
                          />
                          {reply.like_count > 0
                            ? `${reply.like_count} Faydalı`
                            : "Faydalı"}
                        </button>

                        {isOwner &&
                          !reply.is_solution &&
                          reply.user_id !== topic.user_id && (
                            <button
                              onClick={() => handleMarkSolution(reply.id)}
                              className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-green-100 hover:text-green-700 dark:hover:bg-green-950/40 dark:hover:text-green-400"
                            >
                              <Award size={13} />
                              Çözüm Olarak Seç
                            </button>
                          )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Yanıt Yaz */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4 sm:p-5">
          <form onSubmit={handleReply} className="space-y-3">
            <label className="text-sm font-medium">Yanıtınız</label>
            <textarea
              placeholder="Düşüncelerinizi veya çözüm önerinizi paylaşın..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows={4}
              className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={sending || !replyContent.trim()}
                className="gap-1.5"
              >
                {sending ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Send size={14} />
                )}
                {sending ? "Gönderiliyor..." : "Yanıtla"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
