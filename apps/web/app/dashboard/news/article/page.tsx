"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ArticleData {
  title: string;
  content: string[];
  image: string | null;
  sourceUrl: string;
}

export default function ArticlePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const url = searchParams.get("url");
  const source = searchParams.get("source");
  const category = searchParams.get("cat");
  const pubDate = searchParams.get("date");

  const [article, setArticle] = useState<ArticleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!url) return;
    setLoading(true);
    setError(false);

    fetch(`/api/news/article?url=${encodeURIComponent(url)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error || !data.content?.length) {
          setError(true);
        } else {
          setArticle(data);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [url]);

  const categoryLabels: Record<string, string> = {
    destek: "Destekler & Hibeler",
    duyuru: "Bakanlık Duyuruları",
    piyasa: "Piyasa & Fiyatlar",
    genel: "Genel Tarım",
  };

  const formattedDate = pubDate
    ? new Date(pubDate).toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Geri butonu */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/dashboard/news")}
        className="gap-1.5"
      >
        <ArrowLeft className="h-4 w-4" />
        Haberlere Dön
      </Button>

      {loading ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="flex flex-col items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="mt-4 text-sm text-muted-foreground">
              Haber içeriği yükleniyor...
            </p>
          </CardContent>
        </Card>
      ) : error ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="flex flex-col items-center py-16">
            <AlertTriangle className="h-10 w-10 text-amber-500" />
            <p className="mt-4 text-base font-medium">
              İçerik yüklenemedi
            </p>
            <p className="mt-1 text-sm text-muted-foreground text-center max-w-md">
              Bu haber kaynağı içerik paylaşımını kısıtlamış olabilir.
              Haberi orijinal kaynağından okuyabilirsiniz.
            </p>
            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/news")}
              >
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                Geri Dön
              </Button>
              {url && (
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <Button>
                    Kaynağa Git
                    <ExternalLink className="ml-1.5 h-4 w-4" />
                  </Button>
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      ) : article ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 sm:p-8">
            {/* Kategori ve tarih */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {category && categoryLabels[category] && (
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  {categoryLabels[category]}
                </span>
              )}
              {formattedDate && <span>{formattedDate}</span>}
              {source && (
                <span className="font-medium text-foreground/70">
                  {source}
                </span>
              )}
            </div>

            {/* Başlık */}
            <h1 className="mt-4 text-2xl font-bold leading-tight sm:text-3xl">
              {article.title}
            </h1>

            {/* Görsel */}
            {article.image && (
              <div className="mt-6 overflow-hidden rounded-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}

            {/* İçerik */}
            <div className="mt-6 space-y-4">
              {article.content.map((paragraph, i) => (
                <p
                  key={i}
                  className="text-[15px] leading-relaxed text-foreground/85"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Kaynak linki */}
            <div className="mt-8 flex items-center justify-between border-t pt-6">
              <p className="text-xs text-muted-foreground">
                Kaynak: {source || new URL(article.sourceUrl).hostname}
              </p>
              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm">
                  Orijinal Haberi Oku
                  <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
