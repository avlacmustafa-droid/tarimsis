"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Sprout,
  Bug,
  Droplets,
  Scissors,
  Tractor,
  Leaf,
  MoreHorizontal,
  Bell,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CALENDAR_EVENT_LABELS } from "@tarimsis/shared";

interface CalendarEvent {
  id: string;
  type: string;
  title: string;
  description: string | null;
  field_id: string | null;
  event_date: string;
  reminder_enabled: boolean;
  reminder_date: string | null;
}

interface CalendarViewProps {
  events: CalendarEvent[];
  fields: { id: string; name: string }[];
}

const EVENT_ICONS: Record<string, typeof Sprout> = {
  planting: Sprout,
  spraying: Bug,
  fertilizing: Leaf,
  irrigation: Droplets,
  harvest: Scissors,
  plowing: Tractor,
  other: MoreHorizontal,
};

const EVENT_COLORS: Record<string, string> = {
  planting: "bg-green-100 text-green-700",
  spraying: "bg-red-100 text-red-700",
  fertilizing: "bg-amber-100 text-amber-700",
  irrigation: "bg-blue-100 text-blue-700",
  harvest: "bg-yellow-100 text-yellow-700",
  plowing: "bg-stone-100 text-stone-700",
  other: "bg-gray-100 text-gray-700",
};

export function CalendarView({ events, fields }: CalendarViewProps) {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedField, setSelectedField] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1; // Pazartesi başlangıç

  const fieldMap = Object.fromEntries(fields.map((f) => [f.id, f.name]));

  const filteredEvents = useMemo(() => {
    let result = events;
    if (selectedField) result = result.filter((e) => e.field_id === selectedField);
    if (selectedType) result = result.filter((e) => e.type === selectedType);
    return result;
  }, [events, selectedField, selectedType]);

  const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`;
  const monthEvents = filteredEvents.filter((e) => e.event_date.startsWith(monthKey));

  function getEventsForDay(day: number) {
    const dateStr = `${monthKey}-${String(day).padStart(2, "0")}`;
    return monthEvents.filter((e) => e.event_date === dateStr);
  }

  function prevMonth() {
    setCurrentDate(new Date(year, month - 1, 1));
  }

  function nextMonth() {
    setCurrentDate(new Date(year, month + 1, 1));
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu etkinliği silmek istediğinize emin misiniz?")) return;
    setDeletingId(id);
    const res = await fetch(`/api/calendar/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Etkinlik silindi");
    } else {
      toast.error("Etkinlik silinemedi");
    }
    router.refresh();
    setDeletingId(null);
  }

  const today = new Date();
  const isToday = (day: number) =>
    today.getFullYear() === year &&
    today.getMonth() === month &&
    today.getDate() === day;

  // Yaklaşan etkinlikler (bugün ve sonrası)
  const todayStr = today.toISOString().split("T")[0];
  const upcoming = filteredEvents
    .filter((e) => e.event_date >= todayStr)
    .slice(0, 5);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Takvim Grid */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-lg">
              {currentDate.toLocaleDateString("tr-TR", {
                month: "long",
                year: "numeric",
              })}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {fields.length > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">Arazi:</span>
                <select
                  value={selectedField}
                  onChange={(e) => setSelectedField(e.target.value)}
                  className="h-7 rounded-md border bg-background px-2 text-xs"
                >
                  <option value="">Tümü</option>
                  {fields.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">Tür:</span>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="h-7 rounded-md border bg-background px-2 text-xs"
              >
                <option value="">Tümü</option>
                {Object.entries(CALENDAR_EVENT_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            {(selectedField || selectedType) && (
              <button
                onClick={() => { setSelectedField(""); setSelectedType(""); }}
                className="text-xs text-primary hover:underline"
              >
                Temizle
              </button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Gün başlıkları */}
          <div className="mb-2 grid grid-cols-7 text-center text-xs font-medium text-muted-foreground">
            {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>
          {/* Günler */}
          <div className="grid grid-cols-7">
            {Array.from({ length: startOffset }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-10 sm:min-h-16 border-t p-0.5 sm:p-1" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayEvents = getEventsForDay(day);
              return (
                <div
                  key={day}
                  className={`group min-h-10 sm:min-h-16 border-t p-0.5 sm:p-1 ${isToday(day) ? "bg-primary/5" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-medium ${isToday(day) ? "rounded-full bg-primary px-1.5 py-0.5 text-primary-foreground" : ""}`}
                    >
                      {day}
                    </span>
                    <Link
                      href={`/dashboard/calendar/new?date=${monthKey}-${String(day).padStart(2, "0")}`}
                      className="hidden rounded p-0.5 text-muted-foreground hover:bg-muted group-hover:block"
                    >
                      <Plus className="h-3 w-3" />
                    </Link>
                  </div>
                  <div className="mt-0.5 space-y-0.5">
                    {dayEvents.slice(0, 2).map((e) => {
                      const Icon = EVENT_ICONS[e.type] || MoreHorizontal;
                      return (
                        <div
                          key={e.id}
                          className={`flex items-center gap-1 rounded px-1 py-0.5 text-[10px] leading-tight ${EVENT_COLORS[e.type] || EVENT_COLORS.other}`}
                          title={e.title}
                        >
                          <Icon className="h-2.5 w-2.5 shrink-0" />
                          <span className="truncate">{e.title}</span>
                          {e.reminder_enabled && (
                            <Bell className="h-2 w-2 shrink-0" />
                          )}
                        </div>
                      );
                    })}
                    {dayEvents.length > 2 && (
                      <span className="text-[10px] text-muted-foreground">
                        +{dayEvents.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Yaklaşan Etkinlikler */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Yaklaşan Etkinlikler</CardTitle>
        </CardHeader>
        <CardContent>
          {upcoming.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Yaklaşan etkinlik yok
            </p>
          ) : (
            <div className="space-y-3">
              {upcoming.map((e) => {
                const Icon = EVENT_ICONS[e.type] || MoreHorizontal;
                return (
                  <div
                    key={e.id}
                    className="flex items-start justify-between gap-2"
                  >
                    <div className="flex items-start gap-2">
                      <div
                        className={`mt-0.5 rounded p-1 ${EVENT_COLORS[e.type] || EVENT_COLORS.other}`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{e.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(e.event_date).toLocaleDateString("tr-TR")}
                          {e.field_id && fieldMap[e.field_id] && (
                            <> • {fieldMap[e.field_id]}</>
                          )}
                        </p>
                        {e.reminder_enabled && (
                          <p className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                            <Bell className="h-3 w-3" />
                            Hatırlatıcı aktif
                          </p>
                        )}
                        {e.description && (
                          <p className="text-xs text-muted-foreground">
                            {e.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0"
                      onClick={() => handleDelete(e.id)}
                      disabled={deletingId === e.id}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
