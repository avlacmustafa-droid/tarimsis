"use client";

import { useState, useEffect } from "react";
import {
  Sprout,
  Plus,
  Trash2,
  Calendar,
  TrendingUp,
  Loader2,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CropRecord {
  id: string;
  field_id: string;
  crop_name: string;
  start_date: string;
  end_date: string | null;
  yield_amount: number | null;
  yield_unit: string | null;
  notes: string | null;
  created_at: string;
}

const COMMON_CROPS = [
  "Buğday",
  "Arpa",
  "Mısır",
  "Ayçiçeği",
  "Pamuk",
  "Şeker Pancarı",
  "Domates",
  "Biber",
  "Patlıcan",
  "Salatalık",
  "Patates",
  "Soğan",
  "Nohut",
  "Mercimek",
  "Soya Fasulyesi",
  "Çeltik",
  "Zeytin",
  "Üzüm",
  "Elma",
  "Kiraz",
];

export function CropHistory({ fieldId }: { fieldId: string }) {
  const [records, setRecords] = useState<CropRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  // Form state
  const [cropName, setCropName] = useState("");
  const [customCrop, setCustomCrop] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [yieldAmount, setYieldAmount] = useState("");
  const [yieldUnit, setYieldUnit] = useState("kg");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetchRecords();
  }, [fieldId]);

  async function fetchRecords() {
    setLoading(true);
    const res = await fetch(`/api/fields/${fieldId}/crop-history`);
    if (res.ok) {
      const data = await res.json();
      setRecords(data);
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const finalCrop = cropName === "other" ? customCrop : cropName;
    if (!finalCrop || !startDate) {
      toast.error("Ürün adı ve başlangıç tarihi zorunludur");
      return;
    }

    setSaving(true);
    const res = await fetch(`/api/fields/${fieldId}/crop-history`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        crop_name: finalCrop,
        start_date: startDate,
        end_date: endDate || null,
        yield_amount: yieldAmount ? parseFloat(yieldAmount) : null,
        yield_unit: yieldUnit,
        notes: notes || null,
      }),
    });

    if (res.ok) {
      toast.success("Ürün kaydı eklendi");
      resetForm();
      fetchRecords();
    } else {
      toast.error("Kayıt eklenemedi");
    }
    setSaving(false);
  }

  async function handleDelete(historyId: string) {
    if (!confirm("Bu kaydı silmek istediğinize emin misiniz?")) return;
    const res = await fetch(
      `/api/fields/${fieldId}/crop-history?historyId=${historyId}`,
      { method: "DELETE" },
    );
    if (res.ok) {
      setRecords((prev) => prev.filter((r) => r.id !== historyId));
      toast.success("Kayıt silindi");
    } else {
      toast.error("Kayıt silinemedi");
    }
  }

  function resetForm() {
    setCropName("");
    setCustomCrop("");
    setStartDate("");
    setEndDate("");
    setYieldAmount("");
    setYieldUnit("kg");
    setNotes("");
    setShowForm(false);
  }

  // Rotasyon analizi
  const activeCrop = records.find((r) => !r.end_date);
  const completedCrops = records.filter((r) => r.end_date);
  const uniqueCrops = [...new Set(records.map((r) => r.crop_name))];

  // Sayfalama
  const totalPages = Math.ceil(records.length / PAGE_SIZE);
  const paginatedRecords = records.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sprout className="h-5 w-5 text-green-600" />
          Ürün Geçmişi & Rotasyon
        </CardTitle>
        <Button
          size="sm"
          variant={showForm ? "outline" : "default"}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? (
            "İptal"
          ) : (
            <>
              <Plus className="mr-1 h-3.5 w-3.5" /> Ürün Ekle
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Rotasyon Özeti */}
        {records.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-green-50 p-3 text-center dark:bg-green-950/30">
              <p className="text-lg font-bold text-green-700 dark:text-green-400">
                {activeCrop ? activeCrop.crop_name : "—"}
              </p>
              <p className="text-xs text-muted-foreground">Aktif Ürün</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-3 text-center dark:bg-blue-950/30">
              <p className="text-lg font-bold text-blue-700 dark:text-blue-400">
                {records.length}
              </p>
              <p className="text-xs text-muted-foreground">Toplam Dönem</p>
            </div>
            <div className="rounded-lg bg-amber-50 p-3 text-center dark:bg-amber-950/30">
              <p className="text-lg font-bold text-amber-700 dark:text-amber-400">
                {uniqueCrops.length}
              </p>
              <p className="text-xs text-muted-foreground">Farklı Ürün</p>
            </div>
          </div>
        )}

        {/* Ekleme Formu */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="space-y-3 rounded-lg border bg-muted/30 p-4"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium">
                  Ürün Adı *
                </label>
                <Select value={cropName} onValueChange={setCropName}>
                  <SelectTrigger>
                    <SelectValue placeholder="Ürün seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMMON_CROPS.map((crop) => (
                      <SelectItem key={crop} value={crop}>
                        {crop}
                      </SelectItem>
                    ))}
                    <SelectItem value="other">Diğer...</SelectItem>
                  </SelectContent>
                </Select>
                {cropName === "other" && (
                  <Input
                    value={customCrop}
                    onChange={(e) => setCustomCrop(e.target.value)}
                    placeholder="Ürün adını yazın"
                    className="mt-2"
                  />
                )}
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium">
                  Başlangıç Tarihi *
                </label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium">
                  Bitiş Tarihi
                </label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
                <p className="mt-0.5 text-[10px] text-muted-foreground">
                  Boş bırakılırsa aktif ürün olarak işaretlenir
                </p>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium">Verim</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={yieldAmount}
                    onChange={(e) => setYieldAmount(e.target.value)}
                    placeholder="Miktar"
                    className="flex-1"
                  />
                  <Select value={yieldUnit} onValueChange={setYieldUnit}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="ton">ton</SelectItem>
                      <SelectItem value="kg/da">kg/da</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">Notlar</label>
              <Input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Gübre, ilaçlama, sulama bilgileri vb."
              />
            </div>
            <Button type="submit" disabled={saving} className="w-full">
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Kaydediliyor...
                </>
              ) : (
                "Kaydet"
              )}
            </Button>
          </form>
        )}

        {/* Ürün Geçmişi Listesi */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : records.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            <Sprout className="mx-auto mb-2 h-8 w-8" />
            <p>Henüz ürün kaydı yok</p>
            <p className="mt-1 text-xs">
              İlk ürün kaydınızı ekleyerek rotasyon takibine başlayın
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Rotasyon Zaman Çizelgesi */}
            <div className="flex items-center gap-1 overflow-x-auto pb-2">
              {[...records].reverse().map((r, i) => (
                <div key={r.id} className="flex items-center">
                  <div
                    className={`rounded-full px-2.5 py-1 text-[10px] font-medium whitespace-nowrap ${
                      !r.end_date
                        ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {r.crop_name}
                  </div>
                  {i < records.length - 1 && (
                    <div className="mx-0.5 h-px w-3 bg-border" />
                  )}
                </div>
              ))}
            </div>

            {/* Detaylı Liste */}
            {paginatedRecords.map((r) => (
              <div
                key={r.id}
                className={`rounded-lg border p-3 transition-colors ${
                  !r.end_date
                    ? "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20"
                    : ""
                }`}
              >
                <div
                  className="flex cursor-pointer items-center justify-between"
                  onClick={() =>
                    setExpandedId(expandedId === r.id ? null : r.id)
                  }
                >
                  <div className="flex items-center gap-2">
                    <Sprout
                      className={`h-4 w-4 ${
                        !r.end_date
                          ? "text-green-600"
                          : "text-muted-foreground"
                      }`}
                    />
                    <span className="font-medium text-sm">{r.crop_name}</span>
                    {!r.end_date && (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700 dark:bg-green-900/50 dark:text-green-300">
                        Aktif
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(r.start_date).toLocaleDateString("tr-TR", {
                        month: "short",
                        year: "numeric",
                      })}
                      {r.end_date &&
                        ` — ${new Date(r.end_date).toLocaleDateString("tr-TR", {
                          month: "short",
                          year: "numeric",
                        })}`}
                    </span>
                    {expandedId === r.id ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {expandedId === r.id && (
                  <div className="mt-3 space-y-2 border-t pt-3 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Ekim Tarihi
                        </p>
                        <p>
                          {new Date(r.start_date).toLocaleDateString("tr-TR")}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Hasat Tarihi
                        </p>
                        <p>
                          {r.end_date
                            ? new Date(r.end_date).toLocaleDateString("tr-TR")
                            : "Devam ediyor"}
                        </p>
                      </div>
                      {r.yield_amount && (
                        <div>
                          <p className="text-xs text-muted-foreground">Verim</p>
                          <p className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3 text-green-600" />
                            {r.yield_amount} {r.yield_unit}
                          </p>
                        </div>
                      )}
                    </div>
                    {r.notes && (
                      <div>
                        <p className="text-xs text-muted-foreground">Notlar</p>
                        <p className="text-sm">{r.notes}</p>
                      </div>
                    )}
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-destructive hover:text-destructive"
                        onClick={() => handleDelete(r.id)}
                      >
                        <Trash2 className="mr-1 h-3 w-3" /> Sil
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Sayfalama */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-3">
                <p className="text-xs text-muted-foreground">
                  {records.length} kayıttan {(currentPage - 1) * PAGE_SIZE + 1}-
                  {Math.min(currentPage * PAGE_SIZE, records.length)} arası
                </p>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </Button>
                  <span className="px-2 text-xs text-muted-foreground">
                    {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
