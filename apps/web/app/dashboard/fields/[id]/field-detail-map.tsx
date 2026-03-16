"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Save, X, Loader2 } from "lucide-react";
import { FieldMap } from "@/components/map/field-map";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface FieldDetailMapProps {
  token: string;
  coordinates: number[][][];
  fieldId: string;
}

export function FieldDetailMap({ token, coordinates, fieldId }: FieldDetailMapProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newCoordinates, setNewCoordinates] = useState<number[][][]>(coordinates);
  const [newArea, setNewArea] = useState(0);

  async function handleSave() {
    if (newCoordinates.length === 0) {
      toast.error("Lütfen haritada arazi sınırı çizin");
      return;
    }

    setSaving(true);
    const res = await fetch(`/api/fields/${fieldId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        coordinates: newCoordinates,
        area_sqm: newArea > 0 ? newArea : null,
      }),
    });

    if (res.ok) {
      toast.success("Arazi sınırı güncellendi");
      setEditing(false);
      router.refresh();
    } else {
      toast.error("Güncelleme başarısız");
    }
    setSaving(false);
  }

  if (!editing) {
    return (
      <div className="relative">
        <FieldMap token={token} initialCoordinates={coordinates} readOnly />
        <div className="absolute top-2 right-2 sm:top-4 sm:right-16 z-10">
          <Button
            size="sm"
            variant="secondary"
            className="shadow-md"
            onClick={() => setEditing(true)}
          >
            <Pencil className="mr-1 h-3.5 w-3.5" />
            Sınırı Düzenle
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <FieldMap
        key="edit-mode"
        token={token}
        initialCoordinates={coordinates}
        onPolygonChange={(coords, area) => {
          setNewCoordinates(coords);
          setNewArea(area);
        }}
      />
      <div className="absolute top-2 right-2 sm:top-4 sm:right-16 z-10 flex gap-2">
        <Button
          size="sm"
          className="shadow-md"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="mr-1 h-3.5 w-3.5" />
          )}
          Kaydet
        </Button>
        <Button
          size="sm"
          variant="secondary"
          className="shadow-md"
          onClick={() => setEditing(false)}
        >
          <X className="mr-1 h-3.5 w-3.5" />
          İptal
        </Button>
      </div>
    </div>
  );
}
