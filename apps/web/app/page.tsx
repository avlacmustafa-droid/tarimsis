import Link from "next/link";
import {
  MapPin,
  Wallet,
  CalendarDays,
  CloudSun,
  Bot,
  Sprout,
  Shield,
  MessagesSquare,
  BookOpen,
  Check,
  ChevronRight,
  ArrowRight,
  Users,
  Map,
  LineChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: MapPin,
    title: "Arazi Yönetimi",
    description:
      "Harita üzerinde arazilerinizi çizin, alan hesaplayın, uydu görüntüsüyle takip edin.",
    color: "bg-emerald-500",
  },
  {
    icon: Wallet,
    title: "Gelir & Gider",
    description:
      "Tüm tarımsal gelir ve giderlerinizi kategorize edin, kârlılığını analiz edin.",
    color: "bg-blue-500",
  },
  {
    icon: CalendarDays,
    title: "Tarım Takvimi",
    description:
      "Ekim, ilaçlama, hasat tarihlerinizi planlayın ve hatırlatıcılar alın.",
    color: "bg-orange-500",
  },
  {
    icon: CloudSun,
    title: "Hava Durumu",
    description:
      "7 günlük tahmin ve tarıma özel uyarılar: don riski, ilaçlama uygunluğu.",
    color: "bg-sky-500",
  },
  {
    icon: Bot,
    title: "AI Asistan",
    description:
      "Yapay zekâ destekli tarım danışmanı. Fotoğrafla hastalık teşhisi yapın.",
    color: "bg-purple-500",
  },
  {
    icon: MessagesSquare,
    title: "Çiftçi Forumu",
    description:
      "Toplulukla bilgi paylaşın, soru sorun, deneyimlerinizden faydalanın.",
    color: "bg-indigo-500",
  },
  {
    icon: BookOpen,
    title: "Bilgi Bankası",
    description:
      "Tarımsal rehberler, hastalık kataloğu, gübreleme ve sulama kılavuzları.",
    color: "bg-amber-500",
  },
  {
    icon: Shield,
    title: "Güvenli Altyapı",
    description:
      "Verileriniz şifrelenmiş ve güvenli. Sadece siz erişebilirsiniz.",
    color: "bg-slate-500",
  },
];

const steps = [
  {
    step: "1",
    title: "Kayıt Olun",
    description: "Ücretsiz hesabınızı oluşturun, kredi kartı gerekmez.",
  },
  {
    step: "2",
    title: "Arazi Ekleyin",
    description: "Harita üzerinde arazinizi çizerek sisteme ekleyin.",
  },
  {
    step: "3",
    title: "Yönetmeye Başlayın",
    description: "Gelir-gider, takvim, AI asistan ve daha fazlasını kullanın.",
  },
];

const plans = [
  {
    name: "Ücretsiz",
    price: "0",
    period: "sonsuza kadar",
    description: "Küçük ölçekli çiftçiler için ideal başlangıç",
    features: [
      "1 arazi kaydı",
      "Günlük 5 AI sorusu",
      "Gelir-gider takibi",
      "Tarım takvimi",
      "Hava durumu",
      "Forum erişimi",
      "Bilgi bankası",
    ],
    cta: "Ücretsiz Başla",
    highlighted: false,
  },
  {
    name: "Premium",
    price: "149",
    period: "/ay",
    description: "Profesyonel çiftçiler ve küçük işletmeler",
    features: [
      "Sınırsız arazi",
      "Sınırsız AI sorusu",
      "Fotoğrafla hastalık teşhisi",
      "Detaylı raporlar ve grafikler",
      "CSV & PDF dışa aktarma",
      "Öncelikli destek",
      "Tüm ücretsiz özellikler",
    ],
    cta: "Premium Başla",
    highlighted: true,
  },
  {
    name: "Yıllık Premium",
    price: "1.199",
    period: "/yıl",
    description: "En ekonomik seçim — 2 ay ücretsiz",
    features: [
      "Premium'un tüm özellikleri",
      "Yıllık %33 tasarruf",
      "Öncelikli destek",
      "Erken erişim: yeni özellikler",
    ],
    cta: "Yıllık Başla",
    highlighted: false,
  },
];

const faqs = [
  {
    q: "TarımSis ücretsiz mi?",
    a: "Evet! Ücretsiz plan ile 1 arazi, günlük 5 AI sorusu ve tüm temel özelliklere erişebilirsiniz. Kredi kartı gerekmez.",
  },
  {
    q: "Verilerim güvenli mi?",
    a: "Tüm verileriniz şifreli bağlantı üzerinden iletilir ve güvenli sunucularda saklanır. Sadece siz erişebilirsiniz.",
  },
  {
    q: "Mobil cihazdan kullanabilir miyim?",
    a: "Evet, TarımSis tamamen mobil uyumludur. Tarayıcınızdan giriş yapabilir veya ana ekranınıza ekleyerek uygulama gibi kullanabilirsiniz.",
  },
  {
    q: "AI asistan ne tür sorulara cevap verebilir?",
    a: "Tarımsal danışmanlık, hastalık teşhisi (fotoğraf ile), gübreleme, sulama, ekim zamanı ve daha birçok konuda yardımcı olur.",
  },
  {
    q: "Planımı istediğim zaman değiştirebilir miyim?",
    a: "Evet, istediğiniz zaman planınızı yükseltebilir veya düşürebilirsiniz. Değişiklikler hemen yürürlüğe girer.",
  },
  {
    q: "Harita üzerinde arazi çizmek zor mu?",
    a: "Hayır! Uydu görüntüsü üzerinde tıklayarak kolayca arazinizin sınırlarını belirleyebilirsiniz. Alan otomatik hesaplanır.",
  },
];

const stats = [
  { value: "1.000+", label: "Aktif Çiftçi" },
  { value: "5.000+", label: "Kayıtlı Arazi" },
  { value: "50.000+", label: "AI Sorusu" },
  { value: "81", label: "İl" },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Sprout className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold">TarımSis</span>
          </div>
          <div className="hidden items-center gap-6 text-sm sm:flex">
            <a
              href="#features"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Özellikler
            </a>
            <a
              href="#pricing"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Fiyatlandırma
            </a>
            <a
              href="#faq"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              SSS
            </a>
          </div>
          <div className="flex gap-3">
            <Link href="/auth/login">
              <Button variant="ghost">Giriş Yap</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Ücretsiz Başla</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 text-center lg:py-28">
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground">
              <Sprout className="h-4 w-4 text-primary" />
              Türk çiftçileri için tasarlandı
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Tarımınızı{" "}
              <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">
                akıllıca
              </span>{" "}
              yönetin
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Arazilerinizi harita üzerinde yönetin, gelir-giderlerinizi takip
              edin, AI destekli hastalık teşhisi yapın. Tek platformda, her şey
              elinizin altında.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/auth/register">
                <Button size="lg" className="h-12 gap-2 px-8 text-base">
                  Ücretsiz Başla
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link href="#features">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-8 text-base"
                >
                  Özellikleri Gör
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              Kredi kartı gerektirmez · Ücretsiz plan ile hemen başlayın
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-12 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-primary">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">Her şey tek platformda</h2>
            <p className="mt-3 text-muted-foreground">
              Modern tarım yönetimi için ihtiyacınız olan tüm araçlar
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="group border-0 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
              >
                <CardContent className="pt-6">
                  <div
                    className={`mb-4 inline-flex rounded-xl p-3 ${feature.color} shadow-sm`}
                  >
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="mb-2 text-base font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t bg-muted/20 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">Nasıl Çalışır?</h2>
            <p className="mt-3 text-muted-foreground">
              Üç basit adımda tarımınızı dijitalleştirin
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.step} className="relative text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-white shadow-lg">
                  {step.step}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
                {i < steps.length - 1 && (
                  <ChevronRight className="absolute -right-4 top-6 hidden h-6 w-6 text-muted-foreground/30 sm:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">Fiyatlandırma</h2>
            <p className="mt-3 text-muted-foreground">
              İhtiyacınıza uygun planı seçin
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative border-0 shadow-sm transition-all duration-200 hover:shadow-md ${
                  plan.highlighted
                    ? "ring-2 ring-primary shadow-lg scale-[1.02]"
                    : ""
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-white">
                    En Popüler
                  </div>
                )}
                <CardContent className="p-6 pt-8">
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-lg text-muted-foreground">
                      TL
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {plan.period}
                    </span>
                  </div>
                  <Link href="/auth/register" className="mt-6 block">
                    <Button
                      className="w-full"
                      variant={plan.highlighted ? "default" : "outline"}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                  <ul className="mt-6 space-y-2.5">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t bg-muted/20 py-20">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">Sık Sorulan Sorular</h2>
            <p className="mt-3 text-muted-foreground">
              Merak ettiğiniz her şeyin cevabı burada
            </p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <Card key={faq.q} className="border-0 shadow-sm">
                <CardContent className="p-5">
                  <h3 className="font-semibold">{faq.q}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {faq.a}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="rounded-2xl bg-gradient-to-br from-primary to-emerald-600 p-10 text-center text-white sm:p-16">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Tarımınızı dijitalleştirmeye başlayın
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
              Binlerce çiftçi TarımSis ile daha verimli ve kârlı bir şekilde
              tarım yapıyor. Siz de katılın!
            </p>
            <Link href="/auth/register">
              <Button
                size="lg"
                className="mt-8 h-12 bg-white px-8 text-base text-primary hover:bg-white/90"
              >
                Ücretsiz Kayıt Ol
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-2">
              <Sprout className="h-5 w-5 text-primary" />
              <span className="font-semibold">TarımSis</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#features" className="hover:text-foreground">
                Özellikler
              </a>
              <a href="#pricing" className="hover:text-foreground">
                Fiyatlandırma
              </a>
              <a href="#faq" className="hover:text-foreground">
                SSS
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} TarımSis. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
