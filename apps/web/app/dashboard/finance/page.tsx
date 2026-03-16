import Link from "next/link";
import { Plus, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Database } from "@tarimsis/supabase";
import { TransactionList } from "./transaction-list";
import { MonthlyChart } from "./monthly-chart";
import { CategoryChart } from "./category-chart";
import { YearlySummary } from "./yearly-summary";

type Transaction = Database["public"]["Tables"]["transactions"]["Row"];
type Field = Database["public"]["Tables"]["fields"]["Row"];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default async function FinancePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: transactionsData } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user!.id)
    .order("transaction_date", { ascending: false });

  const { data: fieldsData } = await supabase
    .from("fields")
    .select("id, name")
    .eq("user_id", user!.id);

  const transactions = (transactionsData as Transaction[] | null) ?? [];
  const fields = (fieldsData as Pick<Field, "id" | "name">[] | null) ?? [];

  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const monthlyTransactions = transactions.filter((t) =>
    t.transaction_date.startsWith(currentMonth),
  );

  const monthlyIncome = monthlyTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpense = monthlyTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  // Son 6 ay için aylık veriler
  const monthlyData: { month: string; income: number; expense: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("tr-TR", { month: "short" });
    const monthTx = transactions.filter((t) =>
      t.transaction_date.startsWith(key),
    );
    monthlyData.push({
      month: label,
      income: monthTx
        .filter((t) => t.type === "income")
        .reduce((s, t) => s + t.amount, 0),
      expense: monthTx
        .filter((t) => t.type === "expense")
        .reduce((s, t) => s + t.amount, 0),
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gelir & Gider</h1>
        <Link href="/dashboard/finance/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            İşlem Ekle
          </Button>
        </Link>
      </div>

      {/* Özet Kartlar */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Aylık Gelir
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(monthlyIncome)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Aylık Gider
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {formatCurrency(monthlyExpense)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Aylık Net
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${monthlyIncome - monthlyExpense >= 0 ? "text-green-600" : "text-red-500"}`}
            >
              {formatCurrency(monthlyIncome - monthlyExpense)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Toplam Bakiye
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${totalIncome - totalExpense >= 0 ? "text-green-600" : "text-red-500"}`}
            >
              {formatCurrency(totalIncome - totalExpense)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grafikler */}
      {transactions.length > 0 && (
        <div className="grid gap-4 lg:grid-cols-2">
          <MonthlyChart data={monthlyData} />
          <CategoryChart transactions={transactions} />
        </div>
      )}

      {/* Yıllık Rapor */}
      {transactions.length > 0 && (
        <YearlySummary transactions={transactions} />
      )}

      {/* İşlem Listesi */}
      {transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-muted-foreground">
          <Wallet className="mb-2 h-10 w-10" />
          <p>Henüz işlem kaydı yok</p>
          <p className="text-sm">Gelir veya gider ekleyerek başlayın</p>
        </div>
      ) : (
        <TransactionList transactions={transactions} fields={fields} />
      )}
    </div>
  );
}
