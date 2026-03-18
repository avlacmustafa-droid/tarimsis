"use client";

import { useState, useRef, useCallback } from "react";
import { Camera, Upload, Loader2, AlertTriangle, Leaf, RotateCcw, ImageIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// Basit markdown renderer - ## başlıkları ve - listeleri destekler
function SimpleMarkdown({ content }: { content: string }) {
  const lines = content.split("\n");
  return (
    <div className="space-y-2">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-1" />;
        if (trimmed.startsWith("## "))
          return (
            <h3 key={i} className="mt-3 text-base font-semibold text-foreground">
              {trimmed.slice(3)}
            </h3>
          );
        if (trimmed.startsWith("**") && trimmed.endsWith("**"))
          return (
            <p key={i} className="text-sm font-semibold text-foreground">
              {trimmed.slice(2, -2)}
            </p>
          );
        if (trimmed.startsWith("- "))
          return (
            <p key={i} className="ml-4 text-sm text-foreground">
              <span className="mr-1.5 text-green-500">•</span>
              {trimmed.slice(2)}
            </p>
          );
        return (
          <p key={i} className="text-sm text-foreground/80">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}

export default function DiagnosePage() {
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [diagnosis, setDiagnosis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Lütfen bir fotoğraf dosyası seçin.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Dosya boyutu 10MB'dan küçük olmalı.");
      return;
    }
    setError(null);
    setDiagnosis(null);
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const analyze = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    setDiagnosis(null);

    try {
      const res = await fetch("/api/ai/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, description: description || undefined }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Bir hata oluştu.");
        return;
      }

      setDiagnosis(data.diagnosis);
    } catch {
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImage(null);
    setDescription("");
    setDiagnosis(null);
    setError(null);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Başlık */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Bitki Hastalığı Teşhisi
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Bitkilerinizin fotoğrafını yükleyin, AI ile hastalık ve zararlı teşhisi yapın
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Sol: Fotoğraf Yükleme */}
        <div className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500 shadow-sm">
                  <Camera className="h-4 w-4 text-white" />
                </div>
                Fotoğraf
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!image ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/20 p-8 transition-colors hover:border-primary/40 hover:bg-muted/30"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/30">
                    <ImageIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="mt-4 text-sm font-medium">
                    Fotoğrafı sürükleyin veya seçin
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    JPG, PNG, WebP — Max 10MB
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload size={14} />
                      Dosya Seç
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5"
                      onClick={() => cameraInputRef.current?.click()}
                    >
                      <Camera size={14} />
                      Kamera
                    </Button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFile(file);
                    }}
                  />
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFile(file);
                    }}
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative overflow-hidden rounded-xl">
                    <img
                      src={image}
                      alt="Yüklenen bitki fotoğrafı"
                      className="w-full rounded-xl object-cover"
                      style={{ maxHeight: "300px" }}
                    />
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full gap-1.5"
                    onClick={reset}
                  >
                    <RotateCcw size={14} />
                    Farklı Fotoğraf Seç
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ek Açıklama */}
          <Card className="border-0 shadow-sm">
            <CardContent className="pt-5">
              <label className="text-sm font-medium">
                Ek Açıklama (Opsiyonel)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Örn: Yapraklarda sarı lekeler var, 2 haftadır böyle, domates bitkisi..."
                className="mt-2 w-full rounded-lg border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                rows={3}
              />
            </CardContent>
          </Card>

          {/* Analiz Butonu */}
          <Button
            className="w-full gap-2 shadow-sm"
            size="lg"
            disabled={!image || loading}
            onClick={analyze}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Analiz ediliyor...
              </>
            ) : (
              <>
                <Leaf size={18} />
                Teşhis Et
              </>
            )}
          </Button>
        </div>

        {/* Sağ: Sonuç */}
        <div>
          {error && (
            <Card className="border-red-200 bg-red-50 shadow-sm dark:border-red-900 dark:bg-red-950/20">
              <CardContent className="flex items-start gap-3 pt-5">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </CardContent>
            </Card>
          )}

          {loading && !diagnosis && (
            <Card className="border-0 shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-10 w-10 animate-spin text-green-500" />
                <p className="mt-4 text-sm font-medium">
                  Fotoğraf analiz ediliyor...
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Bu işlem birkaç saniye sürebilir
                </p>
              </CardContent>
            </Card>
          )}

          {diagnosis && (
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 shadow-sm">
                    <Leaf className="h-4 w-4 text-white" />
                  </div>
                  Analiz Sonucu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SimpleMarkdown content={diagnosis} />
              </CardContent>
            </Card>
          )}

          {!loading && !diagnosis && !error && (
            <Card className="border-0 shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Leaf className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="mt-4 text-sm font-medium text-muted-foreground">
                  Fotoğraf yükleyip analiz edin
                </p>
                <p className="mt-1 text-center text-xs text-muted-foreground">
                  Yaprak, meyve veya gövde fotoğrafı çekerek
                  <br />
                  hastalık ve zararlı teşhisi yapabilirsiniz
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Bilgi Notu */}
      <Card className="border-amber-200 bg-amber-50/50 shadow-sm dark:border-amber-900/50 dark:bg-amber-950/10">
        <CardContent className="flex items-start gap-3 pt-5">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
          <div className="text-sm text-amber-800 dark:text-amber-200">
            <p className="font-medium">Önemli Not</p>
            <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
              Bu teşhis yapay zeka tarafından yapılmaktadır ve kesin sonuç
              niteliği taşımaz. Ciddi durumlarda mutlaka bir ziraat mühendisine
              veya il/ilçe tarım müdürlüğüne başvurun.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
