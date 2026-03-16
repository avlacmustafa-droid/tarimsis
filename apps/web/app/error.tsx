"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <AlertTriangle className="mb-4 h-12 w-12 text-destructive" />
      <h2 className="mb-2 text-xl font-bold">Bir hata oluştu</h2>
      <p className="mb-6 max-w-md text-sm text-muted-foreground">
        {error.message || "Beklenmeyen bir hata oluştu."}
      </p>
      <div className="flex gap-3">
        <Button onClick={reset}>Tekrar Dene</Button>
        <Link href="/">
          <Button variant="outline">Ana Sayfa</Button>
        </Link>
      </div>
    </div>
  );
}
