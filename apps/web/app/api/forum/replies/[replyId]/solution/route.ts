import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Yanıtı çözüm olarak işaretle (sadece konu sahibi)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ replyId: string }> },
) {
  const { replyId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Yanıtı ve konuyu bul
  const { data: reply } = await supabase
    .from("forum_replies")
    .select("topic_id")
    .eq("id", replyId)
    .single();

  if (!reply) {
    return NextResponse.json({ error: "Yanıt bulunamadı" }, { status: 404 });
  }

  // Konu sahibini kontrol et
  const { data: topic } = await supabase
    .from("forum_topics")
    .select("user_id")
    .eq("id", reply.topic_id)
    .single();

  if (!topic || topic.user_id !== user.id) {
    return NextResponse.json(
      { error: "Sadece konu sahibi çözüm seçebilir" },
      { status: 403 },
    );
  }

  // Önceki çözümü kaldır
  await supabase
    .from("forum_replies")
    .update({ is_solution: false })
    .eq("topic_id", reply.topic_id);

  // Yeni çözümü işaretle
  await supabase
    .from("forum_replies")
    .update({ is_solution: true })
    .eq("id", replyId);

  // Konuyu çözülmüş olarak işaretle
  await supabase
    .from("forum_topics")
    .update({ is_solved: true })
    .eq("id", reply.topic_id);

  return NextResponse.json({ success: true });
}
