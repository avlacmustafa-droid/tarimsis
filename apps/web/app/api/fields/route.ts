import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PLAN_LIMITS } from "@tarimsis/shared";

// Arazi listele
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("fields")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// Arazi ekle
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  // Plan kontrolü
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan_type")
    .eq("id", user.id)
    .single();

  const planType = (profile as { plan_type: string } | null)?.plan_type || "free";
  const limits = PLAN_LIMITS[planType as keyof typeof PLAN_LIMITS];

  const { count } = await supabase
    .from("fields")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  if ((count ?? 0) >= limits.maxFields) {
    return NextResponse.json(
      { error: "Arazi limitinize ulaştınız. Premium'a yükseltin." },
      { status: 403 },
    );
  }

  const body = await request.json();

  const { data, error } = await supabase
    .from("fields")
    .insert({
      user_id: user.id,
      name: body.name,
      location_name: body.location_name,
      area_sqm: body.area_sqm,
      coordinates: body.coordinates,
      current_crop: body.current_crop,
      soil_type: body.soil_type,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
