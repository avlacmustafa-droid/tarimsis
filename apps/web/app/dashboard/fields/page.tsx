import Link from "next/link";
import { MapPin, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import type { Database } from "@tarimsis/supabase";
import { FieldList } from "./field-list";

type Field = Database["public"]["Tables"]["fields"]["Row"];

export default async function FieldsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("fields")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  const fields = (data as Field[] | null) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Arazilerim</h1>
        <Link href="/dashboard/fields/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Arazi Ekle
          </Button>
        </Link>
      </div>

      {fields.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-muted-foreground">
          <MapPin className="mb-2 h-10 w-10" />
          <p>Henüz arazi eklenmedi</p>
          <p className="text-sm">Harita üzerinde arazinizi çizerek ekleyin</p>
        </div>
      ) : (
        <FieldList fields={fields} />
      )}
    </div>
  );
}
