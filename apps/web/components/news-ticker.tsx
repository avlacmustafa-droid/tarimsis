"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Newspaper } from "lucide-react";

interface NewsItem {
  title: string;
  link: string;
  source: string;
}

export function NewsTicker() {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    fetch("/api/news")
      .then((r) => r.json())
      .then((data) => {
        if (data.news?.length) {
          setNews(
            data.news.slice(0, 8).map((item: NewsItem) => ({
              title: item.title.length > 60 ? item.title.slice(0, 60) + "…" : item.title,
              link: item.link,
              source: item.source,
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  if (news.length === 0) return null;

  const tickerText = news
    .map((n) => `${n.title} (${n.source})`)
    .join("  \u2022  ");

  return (
    <div className="relative overflow-hidden rounded-xl border bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 dark:border-green-900/30">
      <div className="flex items-center">
        <div className="relative z-10 flex shrink-0 items-center gap-1.5 bg-green-600 px-3 py-2 text-xs font-bold text-white shadow-md">
          <Newspaper className="h-3.5 w-3.5" />
          <span>TARIM HABERLERİ</span>
        </div>

        <div className="relative flex-1 overflow-hidden py-2">
          <div
            className="flex whitespace-nowrap hover:[animation-play-state:paused]"
            style={{
              animation: "ticker 15s linear infinite",
            }}
          >
            <span className="inline-block px-4 text-sm font-medium text-green-800 dark:text-green-200">
              {tickerText}
            </span>
            <span className="inline-block px-4 text-sm font-medium text-green-800 dark:text-green-200">
              {tickerText}
            </span>
          </div>
        </div>

        <Link
          href="/dashboard/news"
          className="relative z-10 shrink-0 px-3 py-2 text-[11px] font-semibold text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200 transition-colors"
        >
          Tümü →
        </Link>
      </div>
    </div>
  );
}
