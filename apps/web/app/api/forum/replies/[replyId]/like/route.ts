import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Beğeni toggle (beğen/geri al)
export async function POST(
  _req: NextRequest,
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

  // Mevcut beğeniyi kontrol et
  const { data: existing } = await supabase
    .from("forum_reply_likes")
    .select("id")
    .eq("reply_id", replyId)
    .eq("user_id", user.id)
    .single();

  if (existing) {
    // Beğeniyi kaldır
    await supabase
      .from("forum_reply_likes")
      .delete()
      .eq("id", existing.id);

    return NextResponse.json({ liked: false });
  } else {
    // Beğeni ekle
    const { error } = await supabase
      .from("forum_reply_likes")
      .insert({ reply_id: replyId, user_id: user.id });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ liked: true });
  }
}
