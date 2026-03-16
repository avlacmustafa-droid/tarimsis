import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Konunun yanıtlarını getir (beğeni sayılarıyla)
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("forum_replies")
    .select("*, profiles!forum_replies_user_id_fkey(full_name, avatar_url)")
    .eq("topic_id", id)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const replies = data || [];
  const replyIds = replies.map((r: { id: string }) => r.id);

  // Beğeni sayılarını al
  let likeCounts: Record<string, number> = {};
  let userLikes: Set<string> = new Set();

  if (replyIds.length > 0) {
    const { data: likesData } = await supabase
      .from("forum_reply_likes")
      .select("reply_id, user_id")
      .in("reply_id", replyIds);

    if (likesData) {
      for (const like of likesData) {
        likeCounts[like.reply_id] = (likeCounts[like.reply_id] || 0) + 1;
        if (user && like.user_id === user.id) {
          userLikes.add(like.reply_id);
        }
      }
    }
  }

  const enrichedReplies = replies.map((r: Record<string, unknown>) => ({
    ...r,
    like_count: likeCounts[r.id as string] || 0,
    user_liked: userLikes.has(r.id as string),
  }));

  return NextResponse.json(enrichedReplies);
}

// Yanıt ekle
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { content } = body;

  if (!content?.trim()) {
    return NextResponse.json({ error: "Yanıt içeriği zorunludur" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("forum_replies")
    .insert({
      topic_id: id,
      user_id: user.id,
      content: content.trim(),
    })
    .select("*, profiles!forum_replies_user_id_fkey(full_name, avatar_url)")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Konu sahibine bildirim gönder (kendine yanıt vermiyorsa)
  const { data: topic } = await supabase
    .from("forum_topics")
    .select("user_id, title")
    .eq("id", id)
    .single();

  if (topic && topic.user_id !== user.id) {
    const replierName = (data as { profiles?: { full_name?: string } }).profiles?.full_name || "Birisi";
    await supabase.from("notifications").insert({
      user_id: topic.user_id,
      type: "forum_reply",
      title: `${replierName} konunuza yanıt verdi`,
      message: (topic.title as string).substring(0, 100),
      link: `/dashboard/forum/${id}`,
    });
  }

  return NextResponse.json(data, { status: 201 });
}
