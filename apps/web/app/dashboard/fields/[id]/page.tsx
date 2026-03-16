import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Wallet,
  Calendar,
  MapPin,
  Layers,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Database } from "@tarimsis/supabase";
import { FieldDetailMap } from "./field-detail-map";
import { DeleteFieldButton } from "./delete-field-button";
import { EditFieldForm } from "./edit-field-form";
import { CropHistory } from "./crop-history";

type Field = Database["public"]["Tables"]["fields"]["Row"];
type Transaction = Database["public"]["Tables"]["transactions"]["Row"];
type CalendarEvent = Database["public"]["Tables"]["calendar_events"]["Row"];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default async function FieldDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("fields")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) notFound();

  const field = data as Field;
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

  // Arazi bazlı işlemleri çek
  const { data: txData } = await supabase
    .from("transactions")
    .select("*")
    .eq("field_id", id)
    .order("transaction_date", { ascending: false });

  const transactions = (txData as Transaction[] | null) ?? [];

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const recentTransactions = transactions.slice(0, 5);

  // Arazi bazlı takvim etkinliklerini çek
  const { data: eventData } = await supabase
    .from("calendar_events")
    .select("*")
    .eq("field_id", id)
    .gte("event_date", new Date().toISOString().split("T")[0])
    .order("event_date", { ascending: true })
    .limit(5);

  const upcomingEvents = (eventData as CalendarEvent[] | null) ?? [];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/fields">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{field.name}</h1>
            {field.location_name && (
              <p className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                {field.location_name}
              </p>
            )}
          </div>
        </div>
        <DeleteFieldButton fieldId={field.id} />
      </div>

      {/* Özet Kartları */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {field.area_sqm && (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Layers className="h-4 w-4" />
                Alan
              </div>
              <p className="mt-1 text-xl font-bold">
                {(field.area_sqm / 10000).toFixed(2)} <span className="text-sm font-normal text-muted-foreground">ha</span>
              </p>
              <p className="text-xs text-muted-foreground">
                {(field.area_sqm / 1000).toFixed(1)} dönüm
              </p>
            </CardContent>
          </Card>
        )}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-green-600" />
              Toplam Gelir
            </div>
            <p className="mt-1 text-xl font-bold text-green-600">
              {formatCurrency(totalIncome)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingDown className="h-4 w-4 text-red-500" />
              Toplam Gider
            </div>
            <p className="mt-1 text-xl font-bold text-red-500">
              {formatCurrency(totalExpense)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Wallet className="h-4 w-4" />
              Net Kâr
            </div>
            <p className={`mt-1 text-xl font-bold ${totalIncome - totalExpense >= 0 ? "text-green-600" : "text-red-500"}`}>
              {formatCurrency(totalIncome - totalExpense)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Harita */}
      {field.coordinates && mapboxToken && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0 overflow-hidden rounded-lg">
            <FieldDetailMap
              token={mapboxToken}
              coordinates={field.coordinates}
              fieldId={field.id}
            />
          </CardContent>
        </Card>
      )}

      {/* Bilgiler & Son İşlemler */}
      <div className="grid gap-4 lg:grid-cols-2">
        <EditFieldForm field={field} />

        <div className="space-y-4">
          {/* Son İşlemler */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Wallet className="h-5 w-5 text-primary" />
                  Son İşlemler
                </CardTitle>
                <Link href="/dashboard/finance">
                  <Button variant="ghost" size="sm" className="text-xs">
                    Tümünü Gör
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {recentTransactions.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  Bu araziye ait işlem yok
                </p>
              ) : (
                <div className="space-y-2">
                  {recentTransactions.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{t.category}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(t.transaction_date).toLocaleDateString("tr-TR")}
                        </p>
                      </div>
                      <span
                        className={`text-sm font-semibold ${
                          t.type === "income" ? "text-green-600" : "text-red-500"
                        }`}
                      >
                        {t.type === "income" ? "+" : "-"}
                        {formatCurrency(t.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Yaklaşan Etkinlikler */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-5 w-5 text-primary" />
                  Yaklaşan Etkinlikler
                </CardTitle>
                <Link href="/dashboard/calendar">
                  <Button variant="ghost" size="sm" className="text-xs">
                    Takvim
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {upcomingEvents.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  Yaklaşan etkinlik yok
                </p>
              ) : (
                <div className="space-y-2">
                  {upcomingEvents.map((e) => (
                    <div
                      key={e.id}
                      className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Calendar className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{e.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(e.event_date).toLocaleDateString("tr-TR", {
                            day: "numeric",
                            month: "long",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* İstatistikler */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">İstatistikler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Oluşturulma</span>
                <span className="font-medium text-foreground">
                  {new Date(field.created_at).toLocaleDateString("tr-TR")}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Son güncelleme</span>
                <span className="font-medium text-foreground">
                  {new Date(field.updated_at).toLocaleDateString("tr-TR")}
                </span>
              </div>
              {field.soil_type && (
                <div className="flex justify-between">
                  <span>Toprak tipi</span>
                  <span className="font-medium text-foreground">{field.soil_type}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Toplam işlem</span>
                <span className="font-medium text-foreground">{transactions.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Ürün Geçmişi & Rotasyon */}
      <CropHistory fieldId={field.id} />
    </div>
  );
}
