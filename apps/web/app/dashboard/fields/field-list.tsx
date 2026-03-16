"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { MapPin, Search, SlidersHorizontal, X, ArrowUpDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Field {
  id: string;
  name: string;
  location_name: string | null;
  area_sqm: number | null;
  current_crop: string | null;
  created_at: string;
}

interface FieldListProps {
  fields: Field[];
}

type SortKey = "name" | "area" | "date";

export function FieldList({ fields }: FieldListProps) {
  const [search, setSearch] = useState("");
  const [cropFilter, setCropFilter] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("date");
  const [showFilters, setShowFilters] = useState(false);

  // Benzersiz ürün listesi
  const crops = useMemo(() => {
    const set = new Set<string>();
    fields.forEach((f) => {
      if (f.current_crop) set.add(f.current_crop);
    });
    return Array.from(set).sort();
  }, [fields]);

  const filtered = useMemo(() => {
    let result = fields;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.location_name?.toLowerCase().includes(q) ||
          f.current_crop?.toLowerCase().includes(q),
      );
    }

    if (cropFilter) {
      result = result.filter((f) => f.current_crop === cropFilter);
    }

    // Sıralama
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name, "tr");
        case "area":
          return (b.area_sqm ?? 0) - (a.area_sqm ?? 0);
        case "date":
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    return result;
  }, [fields, search, cropFilter, sortBy]);

  const hasActiveFilters = search || cropFilter;

  const totalArea = useMemo(
    () => fields.reduce((sum, f) => sum + (f.area_sqm ?? 0), 0),
    [fields],
  );

  return (
    <div className="space-y-4">
      {/* Özet */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <span>{fields.length} arazi</span>
        {totalArea > 0 && (
          <span>Toplam: {(totalArea / 10000).toFixed(2)} hektar</span>
        )}
        {crops.length > 0 && <span>{crops.length} farklı ürün</span>}
      </div>

      {/* Arama & Filtre Bar */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Arazi, konum veya ürün ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant={showFilters ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-1.5"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filtre
            {hasActiveFilters && (
              <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-white/20 text-[10px]">
                !
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Genişletilmiş Filtreler */}
      {showFilters && (
        <div className="flex flex-wrap items-end gap-3 rounded-lg border bg-muted/50 p-3">
          {crops.length > 0 && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Ürün</label>
              <select
                value={cropFilter}
                onChange={(e) => setCropFilter(e.target.value)}
                className="h-8 rounded-md border bg-background px-2 text-sm"
              >
                <option value="">Tümü</option>
                {crops.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          )}
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Sıralama</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="h-8 rounded-md border bg-background px-2 text-sm"
            >
              <option value="date">Tarih (Yeni)</option>
              <option value="name">İsim (A-Z)</option>
              <option value="area">Alan (Büyük)</option>
            </select>
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8"
              onClick={() => {
                setSearch("");
                setCropFilter("");
              }}
            >
              <X className="mr-1 h-3.5 w-3.5" />
              Temizle
            </Button>
          )}
        </div>
      )}

      {/* Sonuç bilgisi */}
      {hasActiveFilters && (
        <p className="text-xs text-muted-foreground">
          {filtered.length} / {fields.length} arazi gösteriliyor
        </p>
      )}

      {/* Kart Listesi */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-muted-foreground">
          <MapPin className="mb-2 h-8 w-8" />
          <p className="text-sm">
            {hasActiveFilters ? "Filtreye uygun arazi bulunamadı" : "Henüz arazi eklenmedi"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((field) => (
            <Link key={field.id} href={`/dashboard/fields/${field.id}`}>
              <Card className="cursor-pointer border-0 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 dark:bg-green-950">
                      <MapPin className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    {field.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    {field.location_name && <p>{field.location_name}</p>}
                    {field.area_sqm && (
                      <p>{(field.area_sqm / 10000).toFixed(2)} hektar</p>
                    )}
                    {field.current_crop && (
                      <span className="inline-block rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        {field.current_crop}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
