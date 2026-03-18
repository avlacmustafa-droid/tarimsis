import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function getMediaType(
  dataUrl: string,
): "image/jpeg" | "image/png" | "image/gif" | "image/webp" {
  if (dataUrl.startsWith("data:image/png")) return "image/png";
  if (dataUrl.startsWith("data:image/gif")) return "image/gif";
  if (dataUrl.startsWith("data:image/webp")) return "image/webp";
  return "image/jpeg";
}

const DIAGNOSIS_PROMPT = `Sen uzman bir ziraat mühendisisin. Çiftçilerin gönderdiği bitki fotoğraflarını analiz edip hastalık ve zararlı teşhisi yapıyorsun.

Fotoğrafı analiz et ve aşağıdaki formatta Türkçe yanıt ver:

## Teşhis
Hastalık veya zararlının adını yaz. Emin değilsen olası teşhisleri listele.

## Belirtiler
Fotoğrafta gördüğün belirtileri madde madde yaz.

## Şiddet Derecesi
Hafif / Orta / Şiddetli olarak derecelendir.

## Tedavi Önerileri
- Kimyasal mücadele: Kullanılabilecek ilaçlar ve dozajları
- Biyolojik mücadele: Doğal çözümler
- Kültürel önlemler: Yapılması gerekenler

## Önleme
Gelecekte bu sorunun tekrarlanmaması için alınacak önlemler.

## Uyarı
Eğer teşhisten emin değilsen, mutlaka ziraat mühendisine veya il/ilçe tarım müdürlüğüne başvurmayı öner.

Kurallar:
- Her zaman Türkçe yanıt ver
- İlaç önerilerinde aktif madde adını ve ticari isimlerini belirt
- Dozaj bilgisi ver
- Türkiye'de yaygın hastalık ve zararlıları öncelikle düşün
- Eğer fotoğrafta bitki yoksa veya net değilse, bunu belirt`;

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const body = await request.json();
  const { image, description } = body as {
    image: string;
    description?: string;
  };

  if (!image) {
    return NextResponse.json(
      { error: "Fotoğraf gerekli" },
      { status: 400 },
    );
  }

  const mediaType = getMediaType(image);
  const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

  const content: Anthropic.MessageCreateParams["messages"][0]["content"] = [
    {
      type: "image",
      source: {
        type: "base64",
        media_type: mediaType,
        data: base64Data,
      },
    },
  ];

  if (description) {
    content.push({
      type: "text",
      text: `Çiftçinin ek açıklaması: ${description}`,
    });
  } else {
    content.push({
      type: "text",
      text: "Bu bitkinin fotoğrafını analiz et ve teşhis yap.",
    });
  }

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      system: DIAGNOSIS_PROMPT,
      messages: [{ role: "user", content }],
    });

    const result =
      response.content[0]?.type === "text" ? response.content[0].text : "";

    return NextResponse.json({ diagnosis: result });
  } catch {
    return NextResponse.json(
      { error: "Analiz yapılamadı. Lütfen tekrar deneyin." },
      { status: 500 },
    );
  }
}
