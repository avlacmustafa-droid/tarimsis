import { NextRequest, NextResponse } from "next/server";

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  sourceUrl: string;
  category: string;
  description: string;
}

// Google News RSS feeds (Türkçe tarım haberleri)
const GOOGLE_FEEDS: { query: string; category: string }[] = [
  { query: "çiftçi destek tarımsal destekleme", category: "destek" },
  { query: "tarım bakanlığı çiftçi duyuru", category: "duyuru" },
  { query: "tarım ürün fiyat piyasa hal", category: "piyasa" },
  { query: "tarım hasat ekim çiftçilik", category: "genel" },
];

// Anadolu Ajansı RSS feeds (doğrudan linkler)
const AA_FEEDS: { url: string; category: string }[] = [
  { url: "https://www.aa.com.tr/tr/rss/default?cat=ekonomi", category: "genel" },
];

function parseGoogleRSSItems(xml: string, category: string): NewsItem[] {
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

    // Description'dan haber özetini çıkar
    const descRaw = itemXml.match(/<description>([\s\S]*?)<\/description>/)?.[1]?.trim() ?? "";
    const descText = decodeHTMLEntities(descRaw).replace(/<[^>]*>/g, "").trim();

    if (title && link) {
      items.push({
        title: decodeHTMLEntities(title),
        link, // Google News linki - tıklanınca yeni sekmede açılacak
        pubDate,
        source: decodeHTMLEntities(source),
        sourceUrl,
        category,
        description: descText,
      });
    }
  }

  return items;
}

function parseAARSSItems(xml: string, defaultCategory: string): NewsItem[] {
  const items: NewsItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  // Tarım ile ilgili anahtar kelimeler
  const farmKeywords = [
    "tarım", "çiftçi", "hasat", "ekim", "gübre", "mazot", "destek",
    "buğday", "arpa", "mısır", "pamuk", "fındık", "zeytin", "çay",
    "süt", "et", "hayvancılık", "sera", "sulama", "tohum", "ipard",
    "çks", "toprak", "zirai", "ziraat", "üretici", "çeltik", "pirinç",
    "ayçiçeği", "şeker pancarı", "tütün", "arıcılık", "organik",
  ];

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];

    const title = itemXml.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim() ?? "";
    const link = itemXml.match(/<link>([\s\S]*?)<\/link>/)?.[1]?.trim() ?? "";
    const pubDate = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1]?.trim() ?? "";
    const description = itemXml.match(/<description>([\s\S]*?)<\/description>/)?.[1]?.trim() ?? "";
    const descText = decodeHTMLEntities(description).replace(/<[^>]*>/g, "").trim();

    // Sadece tarım ile ilgili haberleri al
    const combined = (title + " " + descText).toLowerCase();
    const isFarmRelated = farmKeywords.some((kw) => combined.includes(kw));

    if (title && link && isFarmRelated) {
      // Kategoriyi daha spesifik belirle
      let category = defaultCategory;
      if (combined.includes("destek") || combined.includes("hibe") || combined.includes("ipard") || combined.includes("mazot")) {
        category = "destek";
      } else if (combined.includes("bakanlık") || combined.includes("duyuru") || combined.includes("yönetmelik")) {
        category = "duyuru";
      } else if (combined.includes("fiyat") || combined.includes("piyasa") || combined.includes("borsa") || combined.includes("hal ")) {
        category = "piyasa";
      }

      items.push({
        title: decodeHTMLEntities(title),
        link, // AA linkleri doğrudan çalışır
        pubDate,
        source: "Anadolu Ajansı",
        sourceUrl: "https://www.aa.com.tr",
        category,
        description: descText,
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
    .replace(/&apos;/g, "'")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec)));
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category");

  try {
    // Google News ve AA RSS'lerini paralel çek
    const googleFeeds = category
      ? GOOGLE_FEEDS.filter((f) => f.category === category)
      : GOOGLE_FEEDS;

    const [googleResults, aaResults] = await Promise.all([
      // Google News RSS'leri
      Promise.all(
        googleFeeds.map(async (feed) => {
          const url = `https://news.google.com/rss/search?q=${encodeURIComponent(feed.query)}&hl=tr&gl=TR&ceid=TR:tr`;
          try {
            const res = await fetch(url, { next: { revalidate: 3600 } });
            if (!res.ok) return [];
            const xml = await res.text();
            return parseGoogleRSSItems(xml, feed.category);
          } catch {
            return [];
          }
        }),
      ),
      // AA RSS'leri
      Promise.all(
        AA_FEEDS.map(async (feed) => {
          try {
            const res = await fetch(feed.url, { next: { revalidate: 3600 } });
            if (!res.ok) return [];
            const xml = await res.text();
            return parseAARSSItems(xml, feed.category);
          } catch {
            return [];
          }
        }),
      ),
    ]);

    let allNews = [...googleResults.flat(), ...aaResults.flat()];

    // Duplikasyonları kaldır (benzer başlık)
    const seen = new Set<string>();
    allNews = allNews.filter((item) => {
      const key = item.title.toLowerCase().slice(0, 50);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Tarihe göre sırala (en yeni önce)
    allNews.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

    // Kategori filtresi
    if (category) {
      allNews = allNews.filter((item) => item.category === category);
    }

    // En fazla 60 haber döndür
    allNews = allNews.slice(0, 60);

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
