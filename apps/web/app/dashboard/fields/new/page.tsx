"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FieldMap } from "@/components/map/field-map";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewFieldPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<number[][][]>([]);
  const [areaSqm, setAreaSqm] = useState(0);

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    const body = {
      name: formData.get("name"),
      location_name: formData.get("location_name") || null,
      current_crop: formData.get("current_crop") || null,
      soil_type: formData.get("soil_type") || null,
      coordinates: coordinates.length > 0 ? coordinates : null,
      area_sqm: areaSqm > 0 ? areaSqm : null,
    };

    const res = await fetch("/api/fields", {
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

    toast.success("Arazi başarıyla eklendi");
    router.push("/dashboard/fields");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold">Yeni Arazi Ekle</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Harita */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Arazi Sınırı</CardTitle>
          </CardHeader>
          <CardContent>
            {mapboxToken ? (
              <>
                <FieldMap
                  token={mapboxToken}
                  onPolygonChange={(coords, area) => {
                    setCoordinates(coords);
                    setAreaSqm(area);
                  }}
                />
                {areaSqm > 0 && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Alan: {(areaSqm / 10000).toFixed(2)} hektar (
                    {(areaSqm / 1000).toFixed(1)} dönüm)
                  </p>
                )}
              </>
            ) : (
              <div className="flex h-64 items-center justify-center rounded-lg border border-dashed text-muted-foreground">
                <p className="text-sm">
                  Harita için NEXT_PUBLIC_MAPBOX_TOKEN gerekli
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Arazi Bilgileri */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Arazi Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Arazi Adı *</Label>
              <Input
                id="name"
                name="name"
                placeholder="Örn: Kuzey Tarla"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location_name">Konum</Label>
              <Input
                id="location_name"
                name="location_name"
                placeholder="Örn: Polatlı, Ankara"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="current_crop">Mevcut Ürün</Label>
                <Input
                  id="current_crop"
                  name="current_crop"
                  placeholder="Örn: Buğday"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="soil_type">Toprak Tipi</Label>
                <Input
                  id="soil_type"
                  name="soil_type"
                  placeholder="Örn: Killi-tınlı"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? "Kaydediliyor..." : "Araziyi Kaydet"}
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
