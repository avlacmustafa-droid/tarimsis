import { NextRequest, NextResponse } from "next/server";

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  sourceUrl: string;
  category: string;
}

const NEWS_FEEDS: { query: string; category: string }[] = [
  { query: "çiftçi destek tarımsal destekleme", category: "destek" },
  { query: "tarım bakanlığı çiftçi duyuru", category: "duyuru" },
  { query: "tarım ürün fiyat piyasa hal", category: "piyasa" },
  { query: "tarım hasat ekim çiftçilik", category: "genel" },
];

function parseRSSItems(xml: string, category: string): NewsItem[] {
  const items: NewsItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];

    const title = itemXml.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim() ?? "";
    const link = itemXml.match(/<link>([\s\S]*?)<\/link>/)?.[1]?.trim() ?? "";
    const pubDate = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1]?.trim() ?? "";
    const source = itemXml.match(/<source[^>]*>([\s\S]*?)<\/source>/)?.[1]?.trim() ?? "";
    const sourceUrl = itemXml.match(/<source\s+url="([^"]*)">/)?.[1]?.trim() ?? "";

    if (title && link) {
      items.push({
        title: decodeHTMLEntities(title),
        link,
        pubDate,
        source: decodeHTMLEntities(source),
        sourceUrl,
        category,
      });
    }
  }

  return items;
}

function decodeHTMLEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category"); // optional filter

  const feedsToFetch = category
    ? NEWS_FEEDS.filter((f) => f.category === category)
    : NEWS_FEEDS;

  try {
    const results = await Promise.all(
      feedsToFetch.map(async (feed) => {
        const url = `https://news.google.com/rss/search?q=${encodeURIComponent(feed.query)}&hl=tr&gl=TR&ceid=TR:tr`;
        const res = await fetch(url, { next: { revalidate: 3600 } }); // 1 saat cache
        if (!res.ok) return [];
        const xml = await res.text();
        return parseRSSItems(xml, feed.category);
      }),
    );

    let allNews = results.flat();

    // Duplikasyonları kaldır (aynı başlık)
    const seen = new Set<string>();
    allNews = allNews.filter((item) => {
      const key = item.title.toLowerCase().slice(0, 60);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Tarihe göre sırala (en yeni önce)
    allNews.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

    // En fazla 50 haber döndür
    allNews = allNews.slice(0, 50);

    return NextResponse.json({
      news: allNews,
      lastUpdated: new Date().toISOString(),
      categories: [
        { id: "destek", label: "Destekler & Hibeler" },
        { id: "duyuru", label: "Bakanlık Duyuruları" },
        { id: "piyasa", label: "Piyasa & Fiyatlar" },
        { id: "genel", label: "Genel Tarım" },
      ],
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Haberler alınamadı", detail: String(error) },
      { status: 500 },
    );
  }
}
