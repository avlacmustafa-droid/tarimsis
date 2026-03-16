import { Plus, CalendarDays } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import type { Database } from "@tarimsis/supabase";
import { CalendarView } from "./calendar-view";

type CalendarEvent = Database["public"]["Tables"]["calendar_events"]["Row"];
type Field = Database["public"]["Tables"]["fields"]["Row"];

export default async function CalendarPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: eventsData } = await supabase
    .from("calendar_events")
    .select("*")
    .eq("user_id", user!.id)
    .order("event_date", { ascending: true });

  const { data: fieldsData } = await supabase
    .from("fields")
    .select("id, name")
    .eq("user_id", user!.id);

  const events = (eventsData as CalendarEvent[] | null) ?? [];
  const fields = (fieldsData as Pick<Field, "id" | "name">[] | null) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tarım Takvimi</h1>
        <Link href="/dashboard/calendar/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Etkinlik Ekle
          </Button>
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-muted-foreground">
          <CalendarDays className="mb-2 h-10 w-10" />
          <p>Henüz etkinlik yok</p>
          <p className="text-sm">
            Ekim, ilaçlama, hasat gibi etkinlikler ekleyin
          </p>
        </div>
      ) : (
        <CalendarView events={events} fields={fields} />
      )}
    </div>
  );
}
