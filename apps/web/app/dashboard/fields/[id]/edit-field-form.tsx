"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Save, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface EditFieldFormProps {
  field: {
    id: string;
    name: string;
    location_name: string | null;
    current_crop: string | null;
    soil_type: string | null;
  };
}

export function EditFieldForm({ field }: EditFieldFormProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(field.name);
  const [locationName, setLocationName] = useState(field.location_name ?? "");
  const [currentCrop, setCurrentCrop] = useState(field.current_crop ?? "");
  const [soilType, setSoilType] = useState(field.soil_type ?? "");

  async function handleSave() {
    if (!name.trim()) {
      toast.error("Arazi adı boş olamaz");
      return;
    }

    setSaving(true);
    const res = await fetch(`/api/fields/${field.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        location_name: locationName.trim() || null,
        current_crop: currentCrop.trim() || null,
        soil_type: soilType.trim() || null,
      }),
    });

    if (res.ok) {
      toast.success("Arazi güncellendi");
      setEditing(false);
      router.refresh();
    } else {
      toast.error("Güncelleme başarısız");
    }
    setSaving(false);
  }

  function handleCancel() {
    setName(field.name);
    setLocationName(field.location_name ?? "");
    setCurrentCrop(field.current_crop ?? "");
    setSoilType(field.soil_type ?? "");
    setEditing(false);
  }

  if (!editing) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Arazi Bilgileri</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
              <Pencil className="mr-1 h-3.5 w-3.5" />
              Düzenle
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {field.location_name && (
            <div>
              <p className="text-sm text-muted-foreground">Konum</p>
              <p className="font-medium">{field.location_name}</p>
            </div>
          )}
          {field.current_crop && (
            <div>
              <p className="text-sm text-muted-foreground">Mevcut Ürün</p>
              <p className="font-medium">{field.current_crop}</p>
            </div>
          )}
          {field.soil_type && (
            <div>
              <p className="text-sm text-muted-foreground">Toprak Tipi</p>
              <p className="font-medium">{field.soil_type}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Arazi Bilgilerini Düzenle</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="edit-name">Arazi Adı *</Label>
          <Input
            id="edit-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-location">Konum</Label>
          <Input
            id="edit-location"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            placeholder="Örn: Polatlı, Ankara"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="edit-crop">Mevcut Ürün</Label>
            <Input
              id="edit-crop"
              value={currentCrop}
              onChange={(e) => setCurrentCrop(e.target.value)}
              placeholder="Örn: Buğday"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-soil">Toprak Tipi</Label>
            <Input
              id="edit-soil"
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              placeholder="Örn: Killi-tınlı"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={saving} size="sm">
            {saving ? (
              <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="mr-1 h-3.5 w-3.5" />
            )}
            Kaydet
          </Button>
          <Button variant="outline" size="sm" onClick={handleCancel}>
            <X className="mr-1 h-3.5 w-3.5" />
            İptal
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
