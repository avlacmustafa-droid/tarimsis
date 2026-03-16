import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Tüm konuları getir
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);

  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort") || "newest";
  const solved = searchParams.get("solved");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 20;
  const offset = (page - 1) * limit;

  let query = supabase
    .from("forum_topics")
    .select("*, profiles!forum_topics_user_id_fkey(full_name, avatar_url)", { count: "exact" });

  // Sıralama
  if (sort === "oldest") {
    query = query.order("created_at", { ascending: true });
  } else if (sort === "most_viewed") {
    query = query.order("view_count", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  query = query.range(offset, offset + limit - 1);

  if (category && category !== "all") {
    query = query.eq("category", category);
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
  }

  if (solved === "true") {
    query = query.eq("is_solved", true);
  } else if (solved === "false") {
    query = query.eq("is_solved", false);
  }

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Her konu için yanıt sayısını al
  const topicIds = (data || []).map((t: { id: string }) => t.id);
  let replyCounts: Record<string, number> = {};

  if (topicIds.length > 0) {
    const { data: replyData } = await supabase
      .from("forum_replies")
      .select("topic_id")
      .in("topic_id", topicIds);

    if (replyData) {
      replyCounts = replyData.reduce(
        (acc: Record<string, number>, r: { topic_id: string }) => {
          acc[r.topic_id] = (acc[r.topic_id] || 0) + 1;
          return acc;
        },
        {},
      );
    }
  }

  const topics = (data || []).map((topic: Record<string, unknown>) => ({
    ...topic,
    reply_count: replyCounts[topic.id as string] || 0,
  }));

  return NextResponse.json({ topics, total: count || 0, page, limit });
}

// Yeni konu oluştur
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, content, category } = body;

  if (!title?.trim() || !content?.trim()) {
    return NextResponse.json({ error: "Başlık ve içerik zorunludur" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("forum_topics")
    .insert({
      user_id: user.id,
      title: title.trim(),
      content: content.trim(),
      category: category || "general",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
