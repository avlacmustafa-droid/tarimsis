import { Leaf, Sprout, Sun, Droplets } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sol panel - dekoratif */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[hsl(150,28%,15%)] via-[hsl(145,22%,18%)] to-[hsl(35,20%,12%)] relative overflow-hidden">
        {/* Dekoratif daireler */}
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-emerald-500/8 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-amber-500/6 blur-3xl" />
        <div className="absolute top-1/3 right-1/4 h-64 w-64 rounded-full bg-green-400/5 blur-2xl" />

        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <div className="flex items-center gap-3 mb-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 shadow-lg shadow-green-900/30">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold text-white tracking-tight">TarımSis</span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-4">
            Tarımınızı<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-green-400">akıllıca</span> yönetin
          </h1>
          <p className="text-base text-white/50 max-w-md leading-relaxed">
            Arazilerinizi takip edin, gelir-giderlerinizi yönetin,
            AI destekli tavsiyeler alın — hepsi tek platformda.
          </p>

          <div className="mt-14 grid grid-cols-3 gap-6">
            <div className="flex flex-col items-center gap-2 rounded-xl bg-white/5 px-4 py-5 backdrop-blur-sm">
              <Sprout className="h-6 w-6 text-emerald-400" />
              <p className="text-xs font-bold text-white/70">AI Destekli</p>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-xl bg-white/5 px-4 py-5 backdrop-blur-sm">
              <Sun className="h-6 w-6 text-amber-400" />
              <p className="text-xs font-bold text-white/70">Hava Takibi</p>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-xl bg-white/5 px-4 py-5 backdrop-blur-sm">
              <Droplets className="h-6 w-6 text-blue-400" />
              <p className="text-xs font-bold text-white/70">Kolay Yönetim</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sağ panel - form */}
      <div className="flex w-full items-center justify-center bg-background px-4 lg:w-1/2">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
