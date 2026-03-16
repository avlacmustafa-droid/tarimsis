"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function DeleteFieldButton({ fieldId }: { fieldId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Bu araziyi silmek istediğinize emin misiniz?")) return;
    setLoading(true);

    const res = await fetch(`/api/fields/${fieldId}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Arazi silindi");
    } else {
      toast.error("Arazi silinemedi");
    }
    router.push("/dashboard/fields");
    router.refresh();
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={loading}
    >
      <Trash2 className="mr-2 h-4 w-4" />
      {loading ? "Siliniyor..." : "Sil"}
    </Button>
  );
}
