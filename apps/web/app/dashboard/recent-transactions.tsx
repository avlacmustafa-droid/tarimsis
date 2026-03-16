"use client";

import { TrendingUp, TrendingDown } from "lucide-react";

interface Transaction {
  id: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  description: string | null;
  transaction_date: string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex h-[220px] items-center justify-center text-sm text-muted-foreground">
        Henüz işlem kaydı yok
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {transactions.map((t) => (
        <div
          key={t.id}
          className="flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/50"
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                t.type === "income"
                  ? "bg-green-100 dark:bg-green-950/40"
                  : "bg-red-100 dark:bg-red-950/40"
              }`}
            >
              {t.type === "income" ? (
                <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 dark:text-red-400" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium">{t.category}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(t.transaction_date).toLocaleDateString("tr-TR", {
                  day: "numeric",
                  month: "short",
                })}
                {t.description && ` · ${t.description}`}
              </p>
            </div>
          </div>
          <span
            className={`text-sm font-semibold tabular-nums ${
              t.type === "income"
                ? "text-green-600 dark:text-green-400"
                : "text-red-500 dark:text-red-400"
            }`}
          >
            {t.type === "income" ? "+" : "-"}
            {new Intl.NumberFormat("tr-TR", {
              style: "currency",
              currency: "TRY",
              minimumFractionDigits: 0,
            }).format(t.amount)}
          </span>
        </div>
      ))}
    </div>
  );
}
