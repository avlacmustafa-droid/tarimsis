import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { PLAN_LIMITS } from "@tarimsis/shared";
import { findRelevantPesticideData } from "@/lib/pesticide-database";

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

function getExtension(mediaType: string): string {
  if (mediaType === "image/png") return "png";
  if (mediaType === "image/gif") return "gif";
  if (mediaType === "image/webp") return "webp";
  return "jpg";
}

const BASE_SYSTEM_PROMPT = `Sen Türkiye'de 20 yıllık deneyime sahip, T.C. Tarım ve Orman Bakanlığı sertifikalı uzman bir ziraat mühendisisin. TarımSis platformunda çiftçilere profesyonel danışmanlık veriyorsun.

Uzmanlık alanların:
- Bitki hastalıkları ve zararlıları teşhisi ve tedavisi
- Entegre zararlı yönetimi (IPM)
- Gübreleme programları ve bitki besleme
- Ekim/dikim/hasat zamanlaması
- Toprak analizi yorumlama
- Sulama yönetimi
- Türkiye tarım mevzuatı ve destekler

İLAÇ ÖNERİSİ KURALLARI (KESİNLİKLE UYULMALI):
- Sana veritabanından T.C. Tarım ve Orman Bakanlığı ruhsatlı ilaç bilgileri sağlanacak. İlaç önerisi yaparken MUTLAKA bu veritabanındaki bilgileri kullan.
- Veritabanında olmayan hastalık/bitki kombinasyonu sorulursa KENDİN İLAÇ İSMİ UYDURMA. Bunun yerine: "Bu hastalık/bitki için veritabanımızda spesifik bilgi bulunmamaktadır. İl/ilçe tarım müdürlüğünüze veya serbest ziraat mühendisine danışmanızı öneririz. bku.tarimorman.gov.tr adresinden güncel ruhsatlı ilaçları kontrol edebilirsiniz." de.
- "yeni nesil" ilaçları ÖNCELİKLE öner, klasikleri alternatif olarak belirt
- Türkiye'de yasaklı aktif maddeleri (Klorpirifos, Fipronil, zararlı Neonikotinoidler) KESİNLİKLE önerme
- Biyolojik mücadeleyi her zaman kimyasal mücadeleden önce öner

İLAÇ ÖNERİSİ YAPTIĞINDA ŞU DETAYLARI VER:
- **İlaç Adı:** Ticari isim (Aktif madde)
- **Dozaj:** Kesin dozaj
- **Uygulama Şekli:** Nasıl uygulanacak
- **Uygulama Zamanı:** Sabah erken saatler veya akşam üstü tercih edilmeli, rüzgarsız havada, ideal sıcaklık aralığı
- **Uygulama Aralığı:** Kaç günde bir tekrar edilmeli
- **Hasat Arası Süre (PHI):** Son ilaçlamadan hasada kaç gün
- **Direnç Yönetimi:** Aynı ilacı üst üste kullanmayın, farklı etki mekanizmalı ilaçlarla rotasyon yapın
- Sonuna şu notu ekle: "Bu bilgiler referans amaçlıdır. Güncel ruhsat durumunu bku.tarimorman.gov.tr adresinden kontrol edin ve uygulama öncesi bir ziraat mühendisine danışın."

Genel Kurallar:
- Türkçe yanıt ver, çiftçinin anlayacağı sade dilde
- Profesyonel ve detaylı ol ama gereksiz uzatma
- Pratik, uygulanabilir tavsiyeler ver
- Emin olmadığın konularda ziraat mühendisine danışmayı öner
- Fotoğraf varsa belirtileri detaylı açıkla`;

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  // Plan limiti kontrolü
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan_type")
    .eq("id", user.id)
    .single();

  const planType =
    (profile as { plan_type: string } | null)?.plan_type || "free";
  const limits = PLAN_LIMITS[planType as keyof typeof PLAN_LIMITS];

  // Bugünkü soru sayısını kontrol et
  const today = new Date().toISOString().split("T")[0];
  const { count } = await supabase
    .from("chat_messages")
    .select("*", { count: "exact", head: true })
    .eq("role", "user")
    .gte("created_at", `${today}T00:00:00`)
    .lt("created_at", `${today}T23:59:59`);

  // Session'a ait mesaj sayısını kontrol etmek için session_id'ye ihtiyacımız var
  // Basitleştirmek için user'ın tüm mesajlarına bakıyoruz
  if ((count ?? 0) >= limits.maxAiQuestionsPerDay) {
    return NextResponse.json(
      {
        error: `Günlük soru limitinize (${limits.maxAiQuestionsPerDay}) ulaştınız. Premium'a yükseltin.`,
      },
      { status: 403 },
    );
  }

  const body = await request.json();
  const { message, image, session_id } = body as {
    message: string;
    image?: string; // base64
    session_id: string;
  };

  if (!message && !image) {
    return NextResponse.json(
      { error: "Mesaj veya fotoğraf gerekli" },
      { status: 400 },
    );
  }

  // Fotoğraf limiti
  if (image) {
    const todayPhotos = await supabase
      .from("chat_messages")
      .select("*", { count: "exact", head: true })
      .eq("role", "user")
      .not("image_url", "is", null)
      .gte("created_at", `${today}T00:00:00`)
      .lt("created_at", `${today}T23:59:59`);

    if ((todayPhotos.count ?? 0) >= limits.maxPhotoAnalysis) {
      return NextResponse.json(
        { error: "Günlük fotoğraf analizi limitinize ulaştınız." },
        { status: 403 },
      );
    }
  }

  // Fotoğrafı Supabase Storage'a yükle
  let imageUrl: string | null = null;
  let mediaType: "image/jpeg" | "image/png" | "image/gif" | "image/webp" =
    "image/jpeg";

  if (image) {
    mediaType = getMediaType(image);
    const ext = getExtension(mediaType);
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    const fileName = `${user.id}/${session_id}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("chat-images")
      .upload(fileName, buffer, {
        contentType: mediaType,
        upsert: false,
      });

    if (!uploadError) {
      const {
        data: { publicUrl },
      } = supabase.storage.from("chat-images").getPublicUrl(fileName);
      imageUrl = publicUrl;
    }
  }

  // Kullanıcı mesajını kaydet
  await supabase.from("chat_messages").insert({
    session_id,
    role: "user" as const,
    content: message || "Fotoğraf gönderildi",
    image_url: imageUrl,
  });

  // İlk mesajsa oturum başlığını güncelle
  const { count: msgCount } = await supabase
    .from("chat_messages")
    .select("*", { count: "exact", head: true })
    .eq("session_id", session_id);

  if (msgCount === 1 && message) {
    const title = message.length > 50 ? message.slice(0, 47) + "..." : message;
    await supabase
      .from("chat_sessions")
      .update({ title })
      .eq("id", session_id);
  }

  // Claude API'ye gönder
  const content: Anthropic.MessageCreateParams["messages"][0]["content"] = [];

  if (image) {
    content.push({
      type: "image",
      source: {
        type: "base64",
        media_type: mediaType,
        data: image.replace(/^data:image\/\w+;base64,/, ""),
      },
    });
  }

  if (message) {
    content.push({ type: "text", text: message });
  }

  // Önceki mesajları al (son 10)
  const { data: history } = await supabase
    .from("chat_messages")
    .select("role, content")
    .eq("session_id", session_id)
    .order("created_at", { ascending: true })
    .limit(10);

  const messages: Anthropic.MessageCreateParams["messages"] = [];

  if (history && history.length > 1) {
    // Son mesaj hariç (az önce ekledik)
    for (const msg of history.slice(0, -1)) {
      const role = msg.role as "user" | "assistant";
      messages.push({ role, content: msg.content });
    }
  }

  messages.push({ role: "user", content });

  // Kullanıcı mesajı + sohbet geçmişinden ilgili ilaç veritabanı bilgilerini bul
  let searchText = message || "";
  // Önceki mesajlardan da bağlam al (bitki/hastalık adı önceki mesajlarda geçmiş olabilir)
  if (history && history.length > 0) {
    const recentContext = history
      .slice(-4)
      .map((m) => m.content)
      .join(" ");
    searchText = searchText + " " + recentContext;
  }
  const pesticideContext = searchText.trim()
    ? findRelevantPesticideData(searchText)
    : "";
  const systemPrompt = BASE_SYSTEM_PROMPT + pesticideContext;

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 3000,
      system: systemPrompt,
      messages,
    });

    const assistantText =
      response.content[0]?.type === "text" ? response.content[0].text : "";

    // Asistan yanıtını kaydet
    await supabase.from("chat_messages").insert({
      session_id,
      role: "assistant" as const,
      content: assistantText,
    });

    return NextResponse.json({ message: assistantText, image_url: imageUrl });
  } catch {
    return NextResponse.json(
      { error: "AI yanıt veremedi. Lütfen tekrar deneyin." },
      { status: 500 },
    );
  }
}
