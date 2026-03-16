import { WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <WifiOff className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="mt-6 text-2xl font-bold">Bağlantı Yok</h1>
        <p className="mt-2 text-muted-foreground">
          İnternet bağlantınız kesilmiş görünüyor.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Lütfen bağlantınızı kontrol edip tekrar deneyin.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Tekrar Dene
        </button>
      </div>
    </div>
  );
}
