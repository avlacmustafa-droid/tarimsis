"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Newspaper, ChevronRight } from "lucide-react";

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
            data.news.slice(0, 20).map((item: NewsItem) => ({
              title: item.title,
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
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 shadow-md shadow-green-900/10">
      <div className="flex items-center">
        <div className="relative z-10 flex shrink-0 items-center gap-1.5 bg-emerald-800/50 px-4 py-2.5 backdrop-blur-sm">
          <Newspaper className="h-3.5 w-3.5 text-emerald-200" />
          <span className="text-[11px] font-bold tracking-wide text-white">HABERLER</span>
        </div>

        <div className="relative flex-1 overflow-hidden py-2.5">
          <div
            className="flex whitespace-nowrap hover:[animation-play-state:paused]"
            style={{
              animation: "ticker 30s linear infinite",
            }}
          >
            <span className="inline-block px-4 text-[13px] font-medium text-white/90">
              {tickerText}
            </span>
            <span className="inline-block px-4 text-[13px] font-medium text-white/90">
              {tickerText}
            </span>
          </div>
        </div>

        <Link
          href="/dashboard/news"
          className="relative z-10 flex shrink-0 items-center gap-0.5 px-3 py-2.5 text-[11px] font-bold text-white/70 hover:text-white transition-colors"
        >
          Tümü
          <ChevronRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
