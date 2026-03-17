"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Shield,
  ShieldOff,
  Crown,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  User,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserProfile {
  id: string;
  full_name: string;
  phone: string | null;
  city: string | null;
  district: string | null;
  plan_type: "free" | "monthly" | "yearly";
  avatar_url: string | null;
  is_admin: boolean;
  created_at: string;
}

const planLabels: Record<string, string> = {
  free: "Ücretsiz",
  monthly: "Aylık",
  yearly: "Yıllık",
};

const planColors: Record<string, string> = {
  free: "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300",
  monthly: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
  yearly:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    fetchUsers();
  }, [search, page]);

  async function fetchUsers() {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    params.set("page", String(page));

    try {
      const res = await fetch(`/api/admin/users?${params}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
        setTotal(data.total);
        setLimit(data.limit);
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }

  async function updateUser(
    userId: string,
    field: string,
    value: unknown,
  ) {
    setUpdating(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId ? { ...u, [field]: value } : u,
          ),
        );
      }
    } catch {
      // ignore
    }
    setUpdating(null);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearch(searchInput);
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Başlık */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/admin">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft size={16} />
          </Button>
        </Link>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/30">
          <Users className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Kullanıcı Yönetimi
          </h1>
          <p className="text-sm text-muted-foreground">
            {total} kullanıcı
          </p>
        </div>
      </div>

      {/* Arama */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="İsim ile ara..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button type="submit" variant="outline">
          Ara
        </Button>
      </form>

      {/* Liste */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          Kullanıcı bulunamadı.
        </div>
      ) : (
        <div className="space-y-2">
          {users.map((u) => (
            <Card key={u.id} className="border-0 shadow-sm">
              <CardContent className="p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  {/* Kullanıcı Bilgileri */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-emerald-600 shadow-sm">
                      {u.avatar_url ? (
                        <img
                          src={u.avatar_url}
                          alt=""
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <User size={16} className="text-white" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">
                          {u.full_name || "İsimsiz"}
                        </p>
                        {u.is_admin && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-medium text-red-700 dark:bg-red-950/40 dark:text-red-400">
                            <Shield size={10} />
                            Admin
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        {u.city && (
                          <span>
                            {u.city}
                            {u.district && `, ${u.district}`}
                          </span>
                        )}
                        <span>
                          {new Date(u.created_at).toLocaleDateString("tr-TR")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Kontroller */}
                  <div className="flex items-center gap-2 sm:shrink-0">
                    {/* Plan Değiştir */}
                    <Select
                      value={u.plan_type}
                      onValueChange={(val) =>
                        updateUser(u.id, "plan_type", val)
                      }
                      disabled={updating === u.id}
                    >
                      <SelectTrigger className="w-32 h-8 text-xs">
                        <Crown size={12} className="mr-1" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">Ücretsiz</SelectItem>
                        <SelectItem value="monthly">Aylık</SelectItem>
                        <SelectItem value="yearly">Yıllık</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Admin Toggle */}
                    <Button
                      variant={u.is_admin ? "destructive" : "outline"}
                      size="sm"
                      className="h-8 gap-1 text-xs"
                      onClick={() =>
                        updateUser(u.id, "is_admin", !u.is_admin)
                      }
                      disabled={updating === u.id}
                    >
                      {u.is_admin ? (
                        <>
                          <ShieldOff size={12} />
                          Admin Kaldır
                        </>
                      ) : (
                        <>
                          <Shield size={12} />
                          Admin Yap
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Sayfalama */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t pt-4">
          <p className="text-xs text-muted-foreground">
            {total} kullanıcıdan {(page - 1) * limit + 1}-
            {Math.min(page * limit, total)} arası
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-3 text-sm">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
