import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import {
  findRelevantPesticideData,
  findDiseasesByPlant,
  findDiseaseByName,
} from "@/lib/pesticide-database";

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

// AŞAMA 1: Sadece teşhis yap, ilaç önerme
const STEP1_DIAGNOSIS_PROMPT = `Sen Türkiye'de 20 yıllık deneyime sahip uzman bir ziraat mühendisisin. Çiftçilerin gönderdiği bitki fotoğraflarını analiz edip hastalık ve zararlı teşhisi yapıyorsun.

GÖREV: Fotoğrafı analiz et ve SADECE teşhis yap. İlaç veya tedavi önerisi YAPMA.

Yanıtını MUTLAKA aşağıdaki JSON formatında ver, başka hiçbir şey yazma:

{
  "bitki": "tespit edilen bitki türü (örn: Domates, Biber, Buğday)",
  "hastalik": "tespit edilen hastalık veya zararlı adı",
  "etmen": "patojen/zararlı türü (latince adı)",
  "belirtiler": ["fotoğrafta görülen belirti 1", "belirti 2"],
  "siddet": "Hafif | Orta | Şiddetli",
  "guven_orani": "Yüksek | Orta | Düşük",
  "alternatif_teshisler": ["olası alternatif teşhis 1", "alternatif 2"]
}

KURALLAR:
- Türkiye'de yaygın hastalık ve zararlıları öncelikli düşün
- Emin değilsen guven_orani'nı "Düşük" yap ve alternatif_teshisler'e olası teşhisleri ekle
- Fotoğrafta bitki yoksa veya net değilse bitki alanına "Belirsiz" yaz
- Hastalık adını Türkçe yaz (örn: "Mildiyö", "Külleme", "Yaprak Biti")
- SADECE JSON döndür, açıklama yazma`;

// AŞAMA 2: Teşhise göre profesyonel reçete oluştur
function buildStep2Prompt(pesticideContext: string): string {
  return `Sen Türkiye'de 20 yıllık deneyime sahip, Tarım ve Orman Bakanlığı sertifikalı uzman bir ziraat mühendisisin. Bitki koruma konusunda profesyonel reçete yazıyorsun.

Sana bir teşhis sonucu ve veritabanından ruhsatlı ilaç bilgileri verilecek. Bunları kullanarak profesyonel bir tedavi reçetesi hazırla.

İLAÇ ÖNERİSİ KURALLARI (KESİNLİKLE UYULMALI):
- SADECE aşağıda sana sağlanan veritabanındaki ruhsatlı ilaçları öner
- Veritabanında bilgi YOKSA KENDİN İLAÇ İSMİ UYDURMA. "Bu hastalık için veritabanımızda spesifik ilaç bilgisi bulunmamaktadır. İl/ilçe tarım müdürlüğünüze veya serbest ziraat mühendisine danışmanızı öneririz. bku.tarimorman.gov.tr adresinden güncel ruhsatlı ilaçları kontrol edebilirsiniz." yaz.
- "yeni nesil" olarak işaretli ilaçları ÖNCELİKLE öner, klasikleri alternatif olarak belirt
- Türkiye'de yasaklı aktif maddeleri (Klorpirifos, Fipronil, zararlı Neonikotinoidler) KESİNLİKLE önerme

PROFESYONEL REÇETE FORMATI:

## Teşhis Raporu
Hastalık/zararlı adı, etmeni, güven oranı

## Fotoğrafta Görülen Belirtiler
Madde madde belirtiler

## Hastalık Şiddeti
Derece ve ne anlama geldiği

## Tedavi Programı

### 1. Acil Müdahale
Hemen yapılması gerekenler

### 2. Biyolojik Mücadele
- Kullanılacak biyolojik ajanlar/yöntemler
- Uygulama şekli ve zamanı

### 3. Kimyasal Mücadele Programı
Her ilaç için:
- **İlaç Adı:** Ticari isim (Aktif madde)
- **Dozaj:** Kesin dozaj bilgisi
- **Uygulama Şekli:** Nasıl uygulanacak
- **Uygulama Zamanı:** Sabah erken/akşam üstü, sıcaklık aralığı
- **Uygulama Aralığı:** Kaç günde bir tekrar
- **Hasat Arası Süre (PHI):** Kaç gün
- **Dikkat:** Özel uyarılar

### 4. İlaç Dönüşüm Programı (Direnç Yönetimi)
Farklı etki mekanizmalı ilaçlarla rotasyon planı (direnç oluşmaması için)

### 5. Kültürel Önlemler
Yapılması gereken tarımsal uygulamalar

### 6. İzleme ve Takip
Ne zaman tekrar kontrol edilmeli, iyileşme belirtileri

## Önleme Programı
Gelecekte bu sorunun tekrarlanmaması için sezon planı

## Uyarılar
- PHI sürelerine mutlaka uyun
- İlaçlama sırasında koruyucu ekipman kullanın
- Bu bilgiler referans amaçlıdır. İlacın güncel ruhsat durumunu bku.tarimorman.gov.tr adresinden kontrol edin
- Uygulama öncesi mutlaka bir ziraat mühendisine danışın

${pesticideContext}`;
}

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

  const imageContent: Anthropic.ImageBlockParam = {
    type: "image",
    source: {
      type: "base64",
      media_type: mediaType,
      data: base64Data,
    },
  };

  const userText = description
    ? `Çiftçinin ek açıklaması: ${description}`
    : "Bu bitkinin fotoğrafını analiz et ve teşhis yap.";

  try {
    // ========== AŞAMA 1: TEŞHİS ==========
    const step1Response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: STEP1_DIAGNOSIS_PROMPT,
      messages: [
        {
          role: "user",
          content: [imageContent, { type: "text", text: userText }],
        },
      ],
    });

    const step1Text =
      step1Response.content[0]?.type === "text"
        ? step1Response.content[0].text
        : "";

    // JSON parse et
    let diagnosis: {
      bitki: string;
      hastalik: string;
      etmen: string;
      belirtiler: string[];
      siddet: string;
      guven_orani: string;
      alternatif_teshisler: string[];
    };

    try {
      // JSON bloğunu çıkar (bazen markdown code block içinde gelebilir)
      const jsonMatch = step1Text.match(/\{[\s\S]*\}/);
      diagnosis = JSON.parse(jsonMatch ? jsonMatch[0] : step1Text);
    } catch {
      // JSON parse başarısızsa, description + fotoğraf ile tek aşamalı fallback
      const fallbackContext = description
        ? findRelevantPesticideData(description)
        : "";
      const fallbackPrompt = buildStep2Prompt(fallbackContext);

      const fallbackResponse = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 3000,
        system: fallbackPrompt,
        messages: [
          {
            role: "user",
            content: [imageContent, { type: "text", text: userText }],
          },
        ],
      });

      const fallbackText =
        fallbackResponse.content[0]?.type === "text"
          ? fallbackResponse.content[0].text
          : "";
      return NextResponse.json({ diagnosis: fallbackText });
    }

    // ========== AŞAMA 2: VERİTABANINDAN İLAÇ ÇEK + REÇETE YAZ ==========

    // Teşhis sonucundan anahtar kelimeler oluştur
    const searchTerms = [
      diagnosis.bitki,
      diagnosis.hastalik,
      diagnosis.etmen,
      ...(diagnosis.alternatif_teshisler || []),
    ]
      .filter(Boolean)
      .join(" ");

    // Veritabanından ilgili ilaç bilgilerini çek
    let pesticideContext = findRelevantPesticideData(searchTerms);

    // Eğer hala bulamadıysa, description ile de dene
    if (!pesticideContext && description) {
      pesticideContext = findRelevantPesticideData(description);
    }

    const step2Prompt = buildStep2Prompt(pesticideContext);

    // Teşhis bilgisini kullanıcı mesajı olarak gönder
    const step2UserMessage = `Teşhis Sonucu:
- Bitki: ${diagnosis.bitki}
- Hastalık/Zararlı: ${diagnosis.hastalik}
- Etmen: ${diagnosis.etmen}
- Belirtiler: ${diagnosis.belirtiler?.join(", ")}
- Şiddet: ${diagnosis.siddet}
- Güven Oranı: ${diagnosis.guven_orani}
- Alternatif Teşhisler: ${diagnosis.alternatif_teshisler?.join(", ") || "Yok"}
${description ? `- Çiftçinin Açıklaması: ${description}` : ""}

Bu teşhise göre profesyonel bir tedavi reçetesi hazırla.`;

    const step2Response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 3000,
      system: step2Prompt,
      messages: [
        {
          role: "user",
          content: [imageContent, { type: "text", text: step2UserMessage }],
        },
      ],
    });

    const result =
      step2Response.content[0]?.type === "text"
        ? step2Response.content[0].text
        : "";

    return NextResponse.json({ diagnosis: result });
  } catch {
    return NextResponse.json(
      { error: "Analiz yapılamadı. Lütfen tekrar deneyin." },
      { status: 500 },
    );
  }
}
