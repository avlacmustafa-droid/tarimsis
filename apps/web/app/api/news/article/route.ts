import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "url parametresi gerekli" }, { status: 400 });
  }

  try {
    // Google News linki genelde redirect eder, takip et
    const res = await fetch(url, {
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Sayfa yüklenemedi" }, { status: 502 });
    }

    const html = await res.text();
    const finalUrl = res.url;

    // HTML'den ana içeriği çıkar
    const content = extractArticleContent(html);
    const title = extractTitle(html);
    const image = extractMainImage(html, finalUrl);

    return NextResponse.json({
      title,
      content,
      image,
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
  // og:title veya <title> tag'ından al
  const ogTitle = html.match(/<meta\s+(?:property|name)="og:title"\s+content="([^"]*)"/)?.[1];
  if (ogTitle) return decodeHTMLEntities(ogTitle);

  const titleTag = html.match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1];
  if (titleTag) return decodeHTMLEntities(titleTag.trim());

  return "";
}

function extractMainImage(html: string, baseUrl: string): string | null {
  const ogImage = html.match(/<meta\s+(?:property|name)="og:image"\s+content="([^"]*)"/)?.[1];
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
    // En az 40 karakter olan anlamlı paragrafları al
    if (text.length >= 40) {
      paragraphs.push(text);
    }
  }

  // Paragraf bulunamazsa h taglarından da topla
  if (paragraphs.length === 0) {
    const hRegex = /<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi;
    while ((match = hRegex.exec(cleaned)) !== null) {
      const text = stripTags(match[1]).trim();
      if (text.length >= 20) {
        paragraphs.push(text);
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
