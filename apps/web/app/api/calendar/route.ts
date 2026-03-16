import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const fieldId = searchParams.get("field_id");
  const month = searchParams.get("month"); // YYYY-MM

  let query = supabase
    .from("calendar_events")
    .select("*")
    .eq("user_id", user.id)
    .order("event_date", { ascending: true });

  if (fieldId) query = query.eq("field_id", fieldId);
  if (month) {
    const [year, mon] = month.split("-").map(Number);
    const start = `${month}-01`;
    const end = new Date(year, mon, 1).toISOString().split("T")[0];
    query = query.gte("event_date", start).lt("event_date", end);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
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

  const { data, error } = await supabase
    .from("calendar_events")
    .insert({
      user_id: user.id,
      type: body.type,
      title: body.title,
      description: body.description || null,
      field_id: body.field_id || null,
      event_date: body.event_date,
      reminder_enabled: body.reminder_enabled ?? false,
      reminder_date: body.reminder_date || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Hatırlatıcı etkinse bildirim oluştur
  if (body.reminder_enabled && data) {
    const eventDate = new Date(body.event_date).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
    });
    await supabase.from("notifications").insert({
      user_id: user.id,
      type: "calendar",
      title: `Takvim: ${body.title}`,
      message: `${eventDate} tarihli etkinliğiniz için hatırlatıcı ayarlandı`,
      link: "/dashboard/calendar",
    });
  }

  return NextResponse.json(data, { status: 201 });
}
