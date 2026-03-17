import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not logged in", authError });
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, is_admin, plan_type")
    .eq("id", user.id)
    .single();

  return NextResponse.json({
    userId: user.id,
    email: user.email,
    profile,
    profileError,
  });
}
