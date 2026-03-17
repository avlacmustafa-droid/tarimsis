import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Admin kontrolü
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // İstatistikleri paralel çek
  const [
    { count: totalUsers },
    { count: totalFields },
    { count: totalTransactions },
    { count: totalTopics },
    { count: totalReplies },
    { count: totalEvents },
    { count: totalSessions },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("fields").select("*", { count: "exact", head: true }),
    supabase.from("transactions").select("*", { count: "exact", head: true }),
    supabase.from("forum_topics").select("*", { count: "exact", head: true }),
    supabase.from("forum_replies").select("*", { count: "exact", head: true }),
    supabase.from("calendar_events").select("*", { count: "exact", head: true }),
    supabase.from("chat_sessions").select("*", { count: "exact", head: true }),
  ]);

  // Plan dağılımı
  const { data: planData } = await supabase
    .from("profiles")
    .select("plan_type");

  const planCounts = { free: 0, monthly: 0, yearly: 0 };
  planData?.forEach((p) => {
    planCounts[p.plan_type as keyof typeof planCounts]++;
  });

  // Son 7 gün kayıt olan kullanıcılar
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const { count: newUsersWeek } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .gte("created_at", weekAgo.toISOString());

  return NextResponse.json({
    totalUsers: totalUsers || 0,
    totalFields: totalFields || 0,
    totalTransactions: totalTransactions || 0,
    totalTopics: totalTopics || 0,
    totalReplies: totalReplies || 0,
    totalEvents: totalEvents || 0,
    totalSessions: totalSessions || 0,
    planCounts,
    newUsersWeek: newUsersWeek || 0,
  });
}
