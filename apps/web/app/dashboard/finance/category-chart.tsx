"use client";

import { useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Transaction {
  type: "income" | "expense";
  category: string;
  amount: number;
}

interface CategoryChartProps {
  transactions: Transaction[];
}

const EXPENSE_COLORS = [
  "#ef4444", "#f97316", "#eab308", "#8b5cf6", "#ec4899",
  "#06b6d4", "#64748b", "#d946ef", "#f43f5e", "#a855f7",
];

const INCOME_COLORS = [
  "#16a34a", "#22c55e", "#10b981", "#059669", "#14b8a6",
  "#0ea5e9", "#84cc16", "#34d399", "#6ee7b7", "#a3e635",
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function CategoryChart({ transactions }: CategoryChartProps) {
  const [viewType, setViewType] = useState<"expense" | "income">("expense");

  const categoryData = useMemo(() => {
    const filtered = transactions.filter((t) => t.type === viewType);
    const map = new Map<string, number>();
    for (const t of filtered) {
      map.set(t.category, (map.get(t.category) || 0) + t.amount);
    }
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions, viewType]);

  const total = categoryData.reduce((s, d) => s + d.value, 0);
  const colors = viewType === "expense" ? EXPENSE_COLORS : INCOME_COLORS;

  if (categoryData.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Kategori Dağılımı</CardTitle>
          <div className="flex gap-1">
            <Button
              variant={viewType === "expense" ? "default" : "outline"}
              size="sm"
              className="h-7 text-xs"
              onClick={() => setViewType("expense")}
            >
              Gider
            </Button>
            <Button
              variant={viewType === "income" ? "default" : "outline"}
              size="sm"
              className="h-7 text-xs"
              onClick={() => setViewType("income")}
            >
              Gelir
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          {/* Pasta Grafik */}
          <div className="h-52 w-52 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={colors[i % colors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value))}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Kategori Listesi */}
          <div className="flex-1 space-y-2">
            {categoryData.map((d, i) => {
              const pct = total > 0 ? ((d.value / total) * 100).toFixed(1) : "0";
              return (
                <div key={d.name} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: colors[i % colors.length] }}
                  />
                  <span className="flex-1 truncate text-sm">{d.name}</span>
                  <span className="text-xs text-muted-foreground">%{pct}</span>
                  <span className="text-sm font-medium tabular-nums">
                    {formatCurrency(d.value)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
