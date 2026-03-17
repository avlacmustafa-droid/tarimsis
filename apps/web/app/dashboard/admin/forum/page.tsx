"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  MessagesSquare,
  Search,
  Trash2,
  Eye,
  MessageCircle,
  CheckCircle2,
  ArrowLeft,
  User,
  AlertTriangle,
  X,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FORUM_CATEGORIES } from "@tarimsis/shared";

interface ForumTopic {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  is_solved: boolean;
  view_count: number;
  reply_count: number;
  created_at: string;
  profiles: { full_name: string; avatar_url: string | null } | null;
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

export default function AdminForumPage() {
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [category, setCategory] = useState("all");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    setPage(1);
  }, [search, category]);

  useEffect(() => {
    fetchTopics();
  }, [search, category, page]);

  async function fetchTopics() {
    setLoading(true);
    const params = new URLSearchParams();
    if (category !== "all") params.set("category", category);
    if (search) params.set("search", search);
    params.set("page", String(page));

    try {
      const res = await fetch(`/api/forum/topics?${params}`);
      if (res.ok) {
        const data = await res.json();
        setTopics(data.topics);
        setTotal(data.total);
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }

  async function deleteTopic(id: string) {
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/forum/topics/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setTopics((prev) => prev.filter((t) => t.id !== id));
        setTotal((prev) => prev - 1);
      }
    } catch {
      // ignore
    }
    setDeleting(null);
    setConfirmDelete(null);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearch(searchInput);
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Başlık */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/admin">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft size={16} />
          </Button>
        </Link>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 dark:bg-orange-950/30">
          <MessagesSquare className="h-5 w-5 text-orange-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Forum Moderasyonu
          </h1>
          <p className="text-sm text-muted-foreground">{total} konu</p>
        </div>
      </div>

      {/* Filtre & Arama */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <form onSubmit={handleSearch} className="flex flex-1 gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Konu ara..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button type="submit" variant="outline">
            Ara
          </Button>
        </form>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Kategoriler</SelectItem>
            {Object.entries(FORUM_CATEGORIES).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Konu Listesi */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : topics.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          Konu bulunamadı.
        </div>
      ) : (
        <div className="space-y-2">
          {topics.map((topic) => (
            <Card key={topic.id} className="border-0 shadow-sm">
              <CardContent className="p-4 sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        href={`/dashboard/forum/${topic.id}`}
                        className="font-semibold hover:text-primary truncate"
                      >
                        {topic.title}
                      </Link>
                      {topic.is_solved && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-700 dark:bg-green-950/40 dark:text-green-400">
                          <CheckCircle2 size={10} />
                          Çözüldü
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                      {topic.content}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User size={11} />
                        {topic.profiles?.full_name || "Anonim"}
                      </span>
                      <span>{timeAgo(topic.created_at)}</span>
                      <span className="flex items-center gap-1">
                        <MessageCircle size={11} />
                        {topic.reply_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye size={11} />
                        {topic.view_count}
                      </span>
                      <span className="rounded bg-muted px-1.5 py-0.5 font-medium">
                        {FORUM_CATEGORIES[topic.category] || topic.category}
                      </span>
                    </div>
                  </div>

                  {/* Sil Butonu */}
                  <div className="flex items-center gap-2 sm:shrink-0">
                    {confirmDelete === topic.id ? (
                      <div className="flex items-center gap-1.5 rounded-lg border border-destructive/30 bg-destructive/5 p-2">
                        <AlertTriangle
                          size={14}
                          className="text-destructive"
                        />
                        <span className="text-xs text-destructive">
                          Emin misiniz?
                        </span>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={() => deleteTopic(topic.id)}
                          disabled={deleting === topic.id}
                        >
                          {deleting === topic.id ? "Siliniyor..." : "Evet"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-1"
                          onClick={() => setConfirmDelete(null)}
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setConfirmDelete(topic.id)}
                      >
                        <Trash2 size={14} />
                        Sil
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
