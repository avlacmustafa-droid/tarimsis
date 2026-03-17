"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Newspaper,
  Search,
  X,
  RefreshCw,
  HandCoins,
  Megaphone,
  TrendingUp,
  Wheat,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  sourceUrl: string;
  category: string;
}

interface NewsCategory {
  id: string;
  label: string;
}

const CATEGORY_META: Record<string, { icon: React.ReactNode; color: string }> = {
  destek: {
    icon: <HandCoins className="h-4 w-4" />,
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  },
  duyuru: {
    icon: <Megaphone className="h-4 w-4" />,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
  },
  piyasa: {
    icon: <TrendingUp className="h-4 w-4" />,
    color: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
  },
  genel: {
    icon: <Wheat className="h-4 w-4" />,
    color: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400",
  },
};

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMin < 60) return `${diffMin} dk önce`;
  if (diffHours < 24) return `${diffHours} saat önce`;
  if (diffDays === 1) return "Dün";
  if (diffDays < 7) return `${diffDays} gün önce`;
  return date.toLocaleDateString("tr-TR", { day: "numeric", month: "long" });
}

export default function NewsPage() {
  const router = useRouter();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/news");
      const data = await res.json();
      setNews(data.news || []);
      setCategories(data.categories || []);
      setLastUpdated(data.lastUpdated || "");
    } catch {
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const filtered = useMemo(() => {
    let result = news;

    if (selectedCategory) {
      result = result.filter((n) => n.category === selectedCategory);
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.source.toLowerCase().includes(q),
      );
    }

    return result;
  }, [news, search, selectedCategory]);

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Başlık */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Tarım Haberleri
          </h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Güncel çiftçi destekleri, piyasa fiyatları ve tarım haberleri
          </p>
        </div>
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {new Date(lastUpdated).toLocaleTimeString("tr-TR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={fetchNews}
            disabled={loading}
          >
            <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Yenile
          </Button>
        </div>
      </div>

      {/* Arama */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Haber başlığı veya kaynak ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Kategori Filtreleri */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
            !selectedCategory
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          Tümü ({news.length})
        </button>
        {categories.map((cat) => {
          const meta = CATEGORY_META[cat.id];
          const count = news.filter((n) => n.category === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() =>
                setSelectedCategory(selectedCategory === cat.id ? null : cat.id)
              }
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                selectedCategory === cat.id
                  ? meta?.color
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {meta?.icon}
              {cat.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Haber Listesi */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                <div className="mt-2 space-y-2">
                  <div className="h-4 w-full animate-pulse rounded bg-muted" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between">
                  <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-16 animate-pulse rounded bg-muted" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="flex flex-col items-center py-16">
            <Newspaper className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-base font-medium">Haber bulunamadı</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {search || selectedCategory
                ? "Farklı anahtar kelimeler veya kategoriler deneyin"
                : "Haberler yüklenirken bir sorun oluştu"}
            </p>
            {(search || selectedCategory) && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory(null);
                }}
              >
                Filtreleri temizle
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item, index) => {
            const meta = CATEGORY_META[item.category];
            const catLabel = categories.find((c) => c.id === item.category)?.label;
            const articleUrl = `/dashboard/news/article?url=${encodeURIComponent(item.link)}&source=${encodeURIComponent(item.source)}&cat=${item.category}&date=${encodeURIComponent(item.pubDate)}`;
            return (
              <div
                key={`${item.title}-${index}`}
                onClick={() => router.push(articleUrl)}
                className="group cursor-pointer"
              >
                <Card className="h-full border-0 shadow-sm transition-all duration-200 group-hover:shadow-md group-hover:-translate-y-0.5">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${meta?.color}`}
                      >
                        {meta?.icon}
                        {catLabel}
                      </span>
                    </div>
                    <CardTitle className="mt-2 text-[15px] leading-snug line-clamp-3">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-medium truncate max-w-[60%]">
                        {item.source}
                      </span>
                      <span className="flex-shrink-0">
                        {timeAgo(item.pubDate)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
