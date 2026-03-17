import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "url parametresi gerekli" }, { status: 400 });
  }

  // Google News linkleri sunucu tarafında çözümlenemez
  if (url.includes("news.google.com")) {
    return NextResponse.json({ error: "google_news_link" }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "tr-TR,tr;q=0.9",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Sayfa yüklenemedi" }, { status: 502 });
    }

    const html = await res.text();
    const finalUrl = res.url;

    const content = extractArticleContent(html);
    const title = extractTitle(html);
    const image = extractMainImage(html, finalUrl);
    const publishDate = extractPublishDate(html);

    return NextResponse.json({
      title,
      content,
      image,
      publishDate,
      sourceUrl: finalUrl,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "İçerik alınamadı", detail: String(error) },
      { status: 500 },
    );
  }
}

function extractTitle(html: string): string {
  const ogTitle = html.match(/<meta\s+(?:property|name)="og:title"\s+content="([^"]*)"/)?.[1]
    || html.match(/content="([^"]*)"\s+(?:property|name)="og:title"/)?.[1];
  if (ogTitle) return decodeHTMLEntities(ogTitle);

  const titleTag = html.match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1];
  if (titleTag) return decodeHTMLEntities(titleTag.trim());

  return "";
}

function extractMainImage(html: string, baseUrl: string): string | null {
  const ogImage = html.match(/<meta\s+(?:property|name)="og:image"\s+content="([^"]*)"/)?.[1]
    || html.match(/content="([^"]*)"\s+(?:property|name)="og:image"/)?.[1];
  if (ogImage) {
    if (ogImage.startsWith("http")) return ogImage;
    try {
      return new URL(ogImage, baseUrl).href;
    } catch {
      return null;
    }
  }
  return null;
}

function extractPublishDate(html: string): string | null {
  const published = html.match(/<meta\s+(?:property|name)="article:published_time"\s+content="([^"]*)"/)?.[1]
    || html.match(/content="([^"]*)"\s+(?:property|name)="article:published_time"/)?.[1];
  if (published) return published;

  const datePublished = html.match(/"datePublished"\s*:\s*"([^"]*)"/)?.[1];
  if (datePublished) return datePublished;

  return null;
}

function extractArticleContent(html: string): string[] {
  // Script, style, nav, header, footer, aside taglarını temizle
  let cleaned = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<nav[\s\S]*?<\/nav>/gi, "")
    .replace(/<header[\s\S]*?<\/header>/gi, "")
    .replace(/<footer[\s\S]*?<\/footer>/gi, "")
    .replace(/<aside[\s\S]*?<\/aside>/gi, "")
    .replace(/<form[\s\S]*?<\/form>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");

  // article tagı varsa onu tercih et
  const articleMatch = cleaned.match(/<article[\s\S]*?>([\s\S]*?)<\/article>/i);
  if (articleMatch) {
    cleaned = articleMatch[1];
  }

  // Paragrafları çıkar
  const paragraphs: string[] = [];
  const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let match;

  while ((match = pRegex.exec(cleaned)) !== null) {
    const text = stripTags(match[1]).trim();
    if (text.length >= 30) {
      paragraphs.push(text);
    }
  }

  // Paragraf bulunamazsa div'lerden topla
  if (paragraphs.length < 2) {
    const divRegex = /<div[^>]*class="[^"]*(?:content|text|body|detail)[^"]*"[^>]*>([\s\S]*?)<\/div>/gi;
    while ((match = divRegex.exec(cleaned)) !== null) {
      const innerPs = match[1].match(/<p[^>]*>([\s\S]*?)<\/p>/gi);
      if (innerPs) {
        for (const p of innerPs) {
          const text = stripTags(p).trim();
          if (text.length >= 30) paragraphs.push(text);
        }
      }
    }
  }

  return paragraphs;
}

function stripTags(html: string): string {
  return decodeHTMLEntities(
    html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim(),
  );
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
