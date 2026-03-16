"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Trash2,
  TrendingUp,
  TrendingDown,
  Filter,
  X,
  Download,
  FileSpreadsheet,
  Printer,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Transaction {
  id: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  description: string | null;
  field_id: string | null;
  transaction_date: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  fields: { id: string; name: string }[];
}

type FilterType = "all" | "income" | "expense";

export function TransactionList({ transactions, fields }: TransactionListProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedField, setSelectedField] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 15;

  const filtered = useMemo(() => {
    let result = transactions;
    if (filter !== "all") result = result.filter((t) => t.type === filter);
    if (startDate) result = result.filter((t) => t.transaction_date >= startDate);
    if (endDate) result = result.filter((t) => t.transaction_date <= endDate);
    if (selectedField) result = result.filter((t) => t.field_id === selectedField);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.category.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q),
      );
    }
    return result;
  }, [transactions, filter, startDate, endDate, selectedField, searchQuery]);

  // Filtre değiştiğinde sayfayı sıfırla
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, startDate, endDate, selectedField, searchQuery]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  const filteredTotals = useMemo(() => {
    const income = filtered
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);
    const expense = filtered
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);
    return { income, expense, net: income - expense };
  }, [filtered]);

  const hasActiveFilters = startDate || endDate || selectedField || searchQuery;

  const fieldMap = Object.fromEntries(fields.map((f) => [f.id, f.name]));
  const [showExport, setShowExport] = useState(false);

  function exportCSV() {
    const BOM = "\uFEFF";
    const headers = ["Tarih", "Tür", "Kategori", "Tutar (₺)", "Arazi", "Açıklama"];
    const rows = filtered.map((t) => [
      new Date(t.transaction_date).toLocaleDateString("tr-TR"),
      t.type === "income" ? "Gelir" : "Gider",
      t.category,
      (t.type === "income" ? "" : "-") + t.amount.toFixed(2),
      t.field_id && fieldMap[t.field_id] ? fieldMap[t.field_id] : "",
      t.description || "",
    ]);

    const totals = [
      "",
      "",
      "TOPLAM",
      `Gelir: ${filteredTotals.income.toFixed(2)} / Gider: ${filteredTotals.expense.toFixed(2)} / Net: ${filteredTotals.net.toFixed(2)}`,
      "",
      "",
    ];

    const csvContent =
      BOM +
      [headers, ...rows, [], totals]
        .map((row) =>
          row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(";"),
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `tarimsis-finans-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("CSV dosyası indirildi");
    setShowExport(false);
  }

  function exportPDF() {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Pop-up engelleyici aktif. Lütfen izin verin.");
      return;
    }

    const rows = filtered
      .map(
        (t) => `
      <tr>
        <td>${new Date(t.transaction_date).toLocaleDateString("tr-TR")}</td>
        <td>${t.type === "income" ? "Gelir" : "Gider"}</td>
        <td>${t.category}</td>
        <td style="text-align:right;color:${t.type === "income" ? "#16a34a" : "#ef4444"}">
          ${t.type === "income" ? "+" : "-"}${new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2 }).format(t.amount)} ₺
        </td>
        <td>${t.field_id && fieldMap[t.field_id] ? fieldMap[t.field_id] : "-"}</td>
        <td>${t.description || "-"}</td>
      </tr>`,
      )
      .join("");

    const formatTRY = (n: number) =>
      new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2 }).format(n);

    printWindow.document.write(`<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <title>TarımSis — Finans Raporu</title>
  <style>
    body { font-family: system-ui, sans-serif; padding: 24px; color: #1a1a1a; }
    h1 { font-size: 20px; margin-bottom: 4px; }
    .subtitle { color: #666; font-size: 13px; margin-bottom: 20px; }
    .summary { display: flex; gap: 24px; margin-bottom: 20px; padding: 12px; background: #f5f5f5; border-radius: 8px; }
    .summary div { font-size: 14px; }
    .summary .label { color: #666; font-size: 12px; }
    .green { color: #16a34a; font-weight: 600; }
    .red { color: #ef4444; font-weight: 600; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th { text-align: left; padding: 8px 6px; border-bottom: 2px solid #ddd; font-size: 12px; color: #666; }
    td { padding: 6px; border-bottom: 1px solid #eee; }
    @media print { body { padding: 0; } .no-print { display: none; } }
  </style>
</head>
<body>
  <h1>TarımSis — Finans Raporu</h1>
  <div class="subtitle">Oluşturulma: ${new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })} · ${filtered.length} işlem</div>

  <div class="summary">
    <div><div class="label">Toplam Gelir</div><div class="green">+${formatTRY(filteredTotals.income)} ₺</div></div>
    <div><div class="label">Toplam Gider</div><div class="red">-${formatTRY(filteredTotals.expense)} ₺</div></div>
    <div><div class="label">Net</div><div class="${filteredTotals.net >= 0 ? "green" : "red"}">${formatTRY(filteredTotals.net)} ₺</div></div>
  </div>

  <table>
    <thead>
      <tr><th>Tarih</th><th>Tür</th><th>Kategori</th><th style="text-align:right">Tutar</th><th>Arazi</th><th>Açıklama</th></tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>

  <script>window.onload=function(){window.print();}</script>
</body>
</html>`);
    printWindow.document.close();
    setShowExport(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu işlemi silmek istediğinize emin misiniz?")) return;
    setDeletingId(id);
    const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("İşlem silindi");
    } else {
      toast.error("İşlem silinemedi");
    }
    router.refresh();
    setDeletingId(null);
  }

  function clearFilters() {
    setStartDate("");
    setEndDate("");
    setSelectedField("");
    setSearchQuery("");
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-lg">İşlemler</CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowExport(!showExport)}
              >
                <Download className="mr-1 h-3.5 w-3.5" />
                <span className="hidden sm:inline">Dışa Aktar</span>
                <span className="sm:hidden">Aktar</span>
              </Button>
              {showExport && (
                <div className="absolute right-0 top-full z-10 mt-1 w-44 rounded-md border bg-popover p-1 shadow-md">
                  <button
                    onClick={exportCSV}
                    className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm hover:bg-muted"
                  >
                    <FileSpreadsheet className="h-4 w-4 text-green-600" />
                    CSV (Excel) İndir
                  </button>
                  <button
                    onClick={exportPDF}
                    className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm hover:bg-muted"
                  >
                    <Printer className="h-4 w-4 text-blue-600" />
                    PDF Yazdır
                  </button>
                </div>
              )}
            </div>
            <Button
              variant={showFilters ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="mr-1 h-3.5 w-3.5" />
              Filtre
              {hasActiveFilters && (
                <span className="ml-1 rounded-full bg-white/20 px-1.5 text-xs">!</span>
              )}
            </Button>
            <div className="flex gap-1">
              {(["all", "income", "expense"] as FilterType[]).map((f) => (
                <Button
                  key={f}
                  variant={filter === f ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(f)}
                >
                  {f === "all" ? "Tümü" : f === "income" ? "Gelir" : "Gider"}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="mt-3 flex flex-wrap items-end gap-3 rounded-lg border bg-muted/50 p-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Arama
              </label>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Kategori veya açıklama..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 w-full pl-7 sm:w-[200px] text-sm"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Başlangıç
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-8 w-full sm:w-[150px] text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Bitiş
              </label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-8 w-full sm:w-[150px] text-sm"
              />
            </div>
            {fields.length > 0 && (
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">
                  Arazi
                </label>
                <select
                  value={selectedField}
                  onChange={(e) => setSelectedField(e.target.value)}
                  className="h-8 rounded-md border bg-background px-2 text-sm"
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
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8"
                onClick={clearFilters}
              >
                <X className="mr-1 h-3.5 w-3.5" />
                Temizle
              </Button>
            )}
          </div>
        )}

        {hasActiveFilters && (
          <div className="mt-2 flex gap-4 text-sm">
            <span className="text-green-600 font-medium">
              Gelir:{" "}
              {new Intl.NumberFormat("tr-TR", {
                style: "currency",
                currency: "TRY",
                minimumFractionDigits: 0,
              }).format(filteredTotals.income)}
            </span>
            <span className="text-red-500 font-medium">
              Gider:{" "}
              {new Intl.NumberFormat("tr-TR", {
                style: "currency",
                currency: "TRY",
                minimumFractionDigits: 0,
              }).format(filteredTotals.expense)}
            </span>
            <span
              className={`font-medium ${filteredTotals.net >= 0 ? "text-green-600" : "text-red-500"}`}
            >
              Net:{" "}
              {new Intl.NumberFormat("tr-TR", {
                style: "currency",
                currency: "TRY",
                minimumFractionDigits: 0,
              }).format(filteredTotals.net)}
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="divide-y">
          {paginatedItems.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between py-3"
            >
              <div className="flex items-center gap-3">
                {t.type === "income" ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <div>
                  <p className="font-medium text-sm">{t.category}</p>
                  <div className="flex gap-2 text-xs text-muted-foreground">
                    <span>
                      {new Date(t.transaction_date).toLocaleDateString("tr-TR")}
                    </span>
                    {t.field_id && fieldMap[t.field_id] && (
                      <span>• {fieldMap[t.field_id]}</span>
                    )}
                    {t.description && <span>• {t.description}</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`font-semibold ${t.type === "income" ? "text-green-600" : "text-red-500"}`}
                >
                  {t.type === "income" ? "+" : "-"}
                  {new Intl.NumberFormat("tr-TR", {
                    style: "currency",
                    currency: "TRY",
                    minimumFractionDigits: 0,
                  }).format(t.amount)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleDelete(t.id)}
                  disabled={deletingId === t.id}
                >
                  <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Bu filtreye uygun işlem yok
            </p>
          )}
        </div>

        {/* Sayfalama */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t pt-4 mt-2">
            <p className="text-xs text-muted-foreground">
              {filtered.length} işlemden {(currentPage - 1) * PAGE_SIZE + 1}-
              {Math.min(currentPage * PAGE_SIZE, filtered.length)} arası
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .reduce<(number | string)[]>((acc, p, i, arr) => {
                  if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  typeof p === "string" ? (
                    <span key={`dot-${i}`} className="px-1 text-xs text-muted-foreground">
                      ...
                    </span>
                  ) : (
                    <Button
                      key={p}
                      variant={currentPage === p ? "default" : "outline"}
                      size="icon"
                      className="h-8 w-8 text-xs"
                      onClick={() => setCurrentPage(p)}
                    >
                      {p}
                    </Button>
                  ),
                )}
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
