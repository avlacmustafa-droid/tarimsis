"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Bell } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CALENDAR_EVENT_LABELS } from "@tarimsis/shared";
import type { CalendarEventType } from "@tarimsis/shared";

interface FieldOption {
  id: string;
  name: string;
}

const EVENT_TYPES = Object.keys(CALENDAR_EVENT_LABELS) as CalendarEventType[];

export default function NewCalendarEventPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefillDate = searchParams.get("date");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fields, setFields] = useState<FieldOption[]>([]);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderOption, setReminderOption] = useState("1_day");

  useEffect(() => {
    fetch("/api/fields")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setFields(data);
      });
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    const eventDate = formData.get("event_date") as string;

    let reminderDate: string | null = null;
    if (reminderEnabled && eventDate) {
      const eventD = new Date(eventDate + "T09:00:00");
      const offsets: Record<string, number> = {
        same_day: 0,
        "1_day": 1,
        "2_days": 2,
        "3_days": 3,
        "1_week": 7,
      };
      const days = offsets[reminderOption] ?? 1;
      eventD.setDate(eventD.getDate() - days);
      reminderDate = eventD.toISOString();
    }

    const body = {
      type: formData.get("type"),
      title: formData.get("title"),
      description: formData.get("description") || null,
      field_id: formData.get("field_id") || null,
      event_date: eventDate,
      reminder_enabled: reminderEnabled,
      reminder_date: reminderDate,
    };

    const res = await fetch("/api/calendar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      toast.error(data.error);
      setLoading(false);
      return;
    }

    toast.success("Etkinlik başarıyla eklendi");
    router.push("/dashboard/calendar");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Yeni Etkinlik Ekle</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Etkinlik Detayları</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type">Etkinlik Türü *</Label>
              <select
                id="type"
                name="type"
                required
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {EVENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {CALENDAR_EVENT_LABELS[t]}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Başlık *</Label>
              <Input
                id="title"
                name="title"
                placeholder="Örn: Buğday ekimi"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="event_date">Tarih *</Label>
              <Input
                id="event_date"
                name="event_date"
                type="date"
                defaultValue={prefillDate || new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="field_id">Arazi (Opsiyonel)</Label>
              <select
                id="field_id"
                name="field_id"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">Arazi seçin</option>
                {fields.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Açıklama</Label>
              <Input
                id="description"
                name="description"
                placeholder="Opsiyonel not"
              />
            </div>
          </CardContent>
        </Card>

        {/* Hatırlatıcı */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bell className="h-5 w-5" />
              Hatırlatıcı
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={reminderEnabled}
                onChange={(e) => setReminderEnabled(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <span className="text-sm font-medium">
                Bu etkinlik için hatırlatıcı oluştur
              </span>
            </label>

            {reminderEnabled && (
              <div className="space-y-2">
                <Label>Ne zaman hatırlatılsın?</Label>
                <select
                  value={reminderOption}
                  onChange={(e) => setReminderOption(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="same_day">Aynı gün (sabah 09:00)</option>
                  <option value="1_day">1 gün önce</option>
                  <option value="2_days">2 gün önce</option>
                  <option value="3_days">3 gün önce</option>
                  <option value="1_week">1 hafta önce</option>
                </select>
                <p className="text-xs text-muted-foreground">
                  Hatırlatıcı, etkinlik tarihinden önce Dashboard&apos;da ve takvimde görünecektir.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? "Kaydediliyor..." : "Kaydet"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            İptal
          </Button>
        </div>
      </form>
    </div>
  );
}
