import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("crop_history")
    .select("*")
    .eq("field_id", id)
    .eq("user_id", user.id)
    .order("start_date", { ascending: false });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();

  const { data, error } = await supabase
    .from("crop_history")
    .insert({
      field_id: id,
      user_id: user.id,
      crop_name: body.crop_name,
      start_date: body.start_date,
      end_date: body.end_date || null,
      yield_amount: body.yield_amount || null,
      yield_unit: body.yield_unit || "kg",
      notes: body.notes || null,
    })
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  // Aktif ürünü fields tablosunda güncelle
  if (!body.end_date) {
    await supabase
      .from("fields")
      .update({ current_crop: body.crop_name })
      .eq("id", id);
  }

  return NextResponse.json(data, { status: 201 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const historyId = searchParams.get("historyId");
  if (!historyId)
    return NextResponse.json({ error: "historyId required" }, { status: 400 });

  const { error } = await supabase
    .from("crop_history")
    .delete()
    .eq("id", historyId)
    .eq("user_id", user.id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
