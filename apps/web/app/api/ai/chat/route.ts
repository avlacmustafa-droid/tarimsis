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

const BASE_SYSTEM_PROMPT = `Sen TarımSis platformunun AI tarım danışmanısın. Türk çiftçilere yardımcı oluyorsun.

Uzmanlık alanların:
- Bitki hastalıkları ve zararlıları teşhisi
- Gübreleme ve ilaçlama tavsiyeleri
- Ekim ve hasat zamanlaması
- Toprak analizi yorumlama
- Sulama yönetimi
- Türkiye'ye özgü tarımsal bilgiler
- Tarımsal destekler ve teşvikler

İLAÇ ÖNERİSİ KURALLARI (ÇOK ÖNEMLİ):
- Sana veritabanından ruhsatlı ilaç bilgileri sağlanacak. İlaç önerisi yaparken MUTLAKA bu veritabanındaki bilgileri kullan.
- Veritabanında olmayan bir hastalık/bitki kombinasyonu sorulursa, KENDİN İLAÇ ÖNERİSİ YAPMA. Bunun yerine: "Bu hastalık/bitki için veritabanımızda spesifik bilgi bulunmamaktadır. İl/ilçe tarım müdürlüğünüzden veya ziraat mühendisinden ruhsatlı ilaç bilgisi almanızı öneririz. Ayrıca bku.tarimorman.gov.tr adresinden kontrol edebilirsiniz." de.
- SADECE Türkiye'de T.C. Tarım ve Orman Bakanlığı tarafından ruhsatlı olan bitki koruma ürünlerini öner
- İlaç önerirken mutlaka aktif madde adını, ticari ismini, dozajını ve hasat arası süresini belirt
- Her ilaç önerisinin sonuna şu notu ekle: "⚠️ Bu bilgiler referans amaçlıdır. İlacın güncel ruhsat durumunu bku.tarimorman.gov.tr adresinden kontrol edin ve uygulama öncesi bir ziraat mühendisine danışın."
- Türkiye'de yasaklı veya kısıtlı aktif maddeleri (örn: Klorpirifos, Fipronil, Neonikotinoidler arılara zararlı olanlar) KESİNLİKLE önerme
- Biyolojik mücadele yöntemlerini her zaman kimyasal mücadeleden önce öner

Genel Kurallar:
- Türkçe yanıt ver
- Kısa ve öz ol, gereksiz uzatma
- Pratik ve uygulanabilir tavsiyeler ver
- Emin olmadığın konularda uzman/ziraat mühendisine danışmayı öner
- Fotoğraf analizi yapıyorsan hastalık/zararlı belirtilerini detaylı açıkla
- İlaç ve gübre önerilerinde dozaj bilgisi ver`;

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

  // Kullanıcı mesajından ilgili ilaç veritabanı bilgilerini bul
  const pesticideContext = message ? findRelevantPesticideData(message) : "";
  const systemPrompt = BASE_SYSTEM_PROMPT + pesticideContext;

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
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
