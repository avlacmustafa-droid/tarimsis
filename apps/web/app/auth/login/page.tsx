"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Leaf } from "lucide-react";
import { login, loginWithGoogle } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function LoginForm() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const urlError = searchParams.get("error");
    if (urlError) setError(urlError);
  }, [searchParams]);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await login(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setLoading(true);
    const result = await loginWithGoogle();
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Mobil logo (lg altında görünür) */}
      <div className="mb-8 flex items-center justify-center gap-2.5 lg:hidden">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Leaf className="h-5 w-5 text-primary" />
        </div>
        <span className="text-xl font-bold text-foreground tracking-tight">TarımSis</span>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Hoş geldiniz</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Hesabınıza giriş yaparak devam edin
        </p>
      </div>

      <form action={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">E-posta</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="ornek@email.com"
            className="h-11"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Sifre</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            className="h-11"
            required
          />
        </div>
        {error && (
          <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}
        <Button type="submit" className="h-11 w-full" disabled={loading}>
          {loading ? "Giris yapiliyor..." : "Giris Yap"}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">veya</span>
        </div>
      </div>

      <Button
        variant="outline"
        className="h-11 w-full"
        onClick={handleGoogleLogin}
        disabled={loading}
      >
        Google ile Giris Yap
      </Button>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Hesabınız yok mu?{" "}
        <Link href="/auth/register" className="font-medium text-primary hover:underline">
          Kayıt Ol
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-8">Yükleniyor...</div>}>
      <LoginForm />
    </Suspense>
  );
}
