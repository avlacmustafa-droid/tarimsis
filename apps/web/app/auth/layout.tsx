import { Leaf } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sol panel - dekoratif */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[hsl(152,30%,12%)] via-[hsl(155,25%,18%)] to-[hsl(160,20%,10%)] relative overflow-hidden">
        {/* Dekoratif daireler */}
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-emerald-400/8 blur-3xl" />
        <div className="absolute top-1/2 left-1/4 h-64 w-64 rounded-full bg-emerald-300/5 blur-2xl" />

        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
              <Leaf className="h-6 w-6 text-emerald-300" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">TarımSis</span>
          </div>
          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
            Tarımınızı<br />
            <span className="text-emerald-300">akıllıca</span> yonetin
          </h1>
          <p className="text-lg text-white/60 max-w-md leading-relaxed">
            Arazilerinizi takip edin, gelir-giderlerinizi yonetin,
            AI destekli tavsiyeler alın — hepsi tek platformda.
          </p>
          <div className="mt-12 flex gap-8 text-white/40">
            <div>
              <p className="text-2xl font-bold text-white/80">AI</p>
              <p className="text-xs">Destekli</p>
            </div>
            <div className="h-12 w-px bg-white/10" />
            <div>
              <p className="text-2xl font-bold text-white/80">7/24</p>
              <p className="text-xs">Erişim</p>
            </div>
            <div className="h-12 w-px bg-white/10" />
            <div>
              <p className="text-2xl font-bold text-white/80">Kolay</p>
              <p className="text-xs">Kullanım</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sag panel - form */}
      <div className="flex w-full items-center justify-center bg-background px-4 lg:w-1/2">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
