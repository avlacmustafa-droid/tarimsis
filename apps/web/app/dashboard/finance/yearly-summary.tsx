"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Transaction {
  type: "income" | "expense";
  amount: number;
  transaction_date: string;
}

interface YearlySummaryProps {
  transactions: Transaction[];
}

const turkishMonths = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function YearlySummary({ transactions }: YearlySummaryProps) {
  const currentYear = new Date().getFullYear();

  const monthlyData = useMemo(() => {
    const data = Array.from({ length: 12 }, (_, i) => {
      const key = `${currentYear}-${String(i + 1).padStart(2, "0")}`;
      const monthTx = transactions.filter((t) =>
        t.transaction_date.startsWith(key),
      );
      const income = monthTx
        .filter((t) => t.type === "income")
        .reduce((s, t) => s + t.amount, 0);
      const expense = monthTx
        .filter((t) => t.type === "expense")
        .reduce((s, t) => s + t.amount, 0);
      return { month: turkishMonths[i], income, expense, net: income - expense };
    });
    return data;
  }, [transactions, currentYear]);

  const yearlyTotals = useMemo(() => {
    const income = monthlyData.reduce((s, m) => s + m.income, 0);
    const expense = monthlyData.reduce((s, m) => s + m.expense, 0);
    return { income, expense, net: income - expense };
  }, [monthlyData]);

  const maxAmount = Math.max(
    ...monthlyData.map((m) => Math.max(m.income, m.expense)),
    1,
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{currentYear} Yıllık Rapor</CardTitle>
          <div className="flex gap-4 text-sm">
            <span className="font-medium text-green-600">
              Gelir: {formatCurrency(yearlyTotals.income)}
            </span>
            <span className="font-medium text-red-500">
              Gider: {formatCurrency(yearlyTotals.expense)}
            </span>
            <span
              className={`font-semibold ${yearlyTotals.net >= 0 ? "text-green-600" : "text-red-500"}`}
            >
              Net: {formatCurrency(yearlyTotals.net)}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2 font-medium text-muted-foreground">Ay</th>
                <th className="pb-2 text-right font-medium text-muted-foreground">
                  Gelir
                </th>
                <th className="pb-2 text-right font-medium text-muted-foreground">
                  Gider
                </th>
                <th className="pb-2 text-right font-medium text-muted-foreground">
                  Net
                </th>
                <th className="pb-2 pl-4 font-medium text-muted-foreground">
                  Dağılım
                </th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((m) => {
                const incomeWidth =
                  maxAmount > 0 ? (m.income / maxAmount) * 100 : 0;
                const expenseWidth =
                  maxAmount > 0 ? (m.expense / maxAmount) * 100 : 0;

                return (
                  <tr key={m.month} className="border-b last:border-0">
                    <td className="py-2.5 font-medium">{m.month}</td>
                    <td className="py-2.5 text-right tabular-nums text-green-600">
                      {m.income > 0 ? formatCurrency(m.income) : "-"}
                    </td>
                    <td className="py-2.5 text-right tabular-nums text-red-500">
                      {m.expense > 0 ? formatCurrency(m.expense) : "-"}
                    </td>
                    <td
                      className={`py-2.5 text-right tabular-nums font-medium ${m.net >= 0 ? "text-green-600" : "text-red-500"}`}
                    >
                      {m.income > 0 || m.expense > 0
                        ? formatCurrency(m.net)
                        : "-"}
                    </td>
                    <td className="py-2.5 pl-4">
                      <div className="flex h-4 gap-0.5">
                        <div
                          className="rounded-sm bg-green-500"
                          style={{ width: `${incomeWidth}%` }}
                        />
                        <div
                          className="rounded-sm bg-red-400"
                          style={{ width: `${expenseWidth}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 font-semibold">
                <td className="pt-3">Toplam</td>
                <td className="pt-3 text-right tabular-nums text-green-600">
                  {formatCurrency(yearlyTotals.income)}
                </td>
                <td className="pt-3 text-right tabular-nums text-red-500">
                  {formatCurrency(yearlyTotals.expense)}
                </td>
                <td
                  className={`pt-3 text-right tabular-nums ${yearlyTotals.net >= 0 ? "text-green-600" : "text-red-500"}`}
                >
                  {formatCurrency(yearlyTotals.net)}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
