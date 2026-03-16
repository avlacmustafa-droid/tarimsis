import Link from "next/link";
import { Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <Sprout className="mx-auto h-16 w-16 text-muted-foreground/50" />
        <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
        <p className="text-lg text-muted-foreground">
          Aradığınız sayfa bulunamadı.
        </p>
        <Link href="/">
          <Button className="mt-4">Ana Sayfaya Dön</Button>
        </Link>
      </div>
    </div>
  );
}
