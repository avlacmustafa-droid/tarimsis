import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Tek konu detayı
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: topic, error } = await supabase
    .from("forum_topics")
    .select("*, profiles!forum_topics_user_id_fkey(full_name, avatar_url)")
    .eq("id", id)
    .single();

  if (error || !topic) {
    return NextResponse.json({ error: "Konu bulunamadı" }, { status: 404 });
  }

  // Görüntülenme sayısını artır
  const currentCount = (topic as Record<string, unknown>).view_count as number || 0;
  await supabase
    .from("forum_topics")
    .update({ view_count: currentCount + 1 })
    .eq("id", id);

  return NextResponse.json(topic);
}

// Konuyu güncelle (çözüldü işaretle)
export async function PATCH(
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

  const { error } = await supabase
    .from("forum_topics")
    .update(body)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// Konuyu sil
export async function DELETE(
  _req: NextRequest,
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

  const { error } = await supabase
    .from("forum_topics")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
