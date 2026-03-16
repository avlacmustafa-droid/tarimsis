"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  BookOpen,
  Search,
  Bug,
  Droplets,
  Sprout,
  Beaker,
  Tractor,
  Sun,
  X,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EducationArticle {
  id: string;
  title: string;
  summary: string;
  category: string;
  icon: string;
  readTime: number;
  tags: string[];
}

const CATEGORIES: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  disease: {
    label: "Hastalıklar & Zararlılar",
    icon: <Bug className="h-5 w-5" />,
    color: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
  },
  irrigation: {
    label: "Sulama",
    icon: <Droplets className="h-5 w-5" />,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
  },
  planting: {
    label: "Ekim & Dikim",
    icon: <Sprout className="h-5 w-5" />,
    color: "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400",
  },
  fertilizing: {
    label: "Gübreleme",
    icon: <Beaker className="h-5 w-5" />,
    color: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
  },
  equipment: {
    label: "Ekipman & Teknik",
    icon: <Tractor className="h-5 w-5" />,
    color: "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400",
  },
  seasonal: {
    label: "Mevsimsel Rehber",
    icon: <Sun className="h-5 w-5" />,
    color: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400",
  },
};

const ARTICLES: EducationArticle[] = [
  // Hastalıklar
  {
    id: "kursuni-kuf",
    title: "Kürsüni Küf (Mildiyö) Hastalığı",
    summary: "Bağlarda ve sebzelerde sık görülen kürsüni küf hastalığının belirtileri, önleme yöntemleri ve tedavi yolları.",
    category: "disease",
    icon: "🍇",
    readTime: 5,
    tags: ["bağcılık", "domates", "mantar", "ilaçlama"],
  },
  {
    id: "yaprak-biti",
    title: "Yaprak Biti Mücadelesi",
    summary: "Yaprak bitlerinin türleri, zararları ve organik/kimyasal mücadele yöntemleri hakkında kapsamlı rehber.",
    category: "disease",
    icon: "🐛",
    readTime: 4,
    tags: ["zararlı", "organik", "ilaçlama", "sebze"],
  },
  {
    id: "toprak-hastaliklari",
    title: "Toprak Kaynaklı Hastalıklar",
    summary: "Fusarium, Verticillium ve kök çürüklükleri gibi toprak kaynaklı hastalıklarla mücadele rehberi.",
    category: "disease",
    icon: "🦠",
    readTime: 6,
    tags: ["toprak", "kök çürüklüğü", "mantar", "dezenfeksiyon"],
  },
  // Sulama
  {
    id: "damla-sulama",
    title: "Damla Sulama Sistemi Kurulumu",
    summary: "Damla sulama sisteminin avantajları, kurulum adımları, bakımı ve maliyet analizi.",
    category: "irrigation",
    icon: "💧",
    readTime: 7,
    tags: ["damla sulama", "verimlilik", "su tasarrufu", "sistem"],
  },
  {
    id: "sulama-zamanlama",
    title: "Doğru Sulama Zamanlaması",
    summary: "Farklı ürünler için ideal sulama zamanları, toprak nemi ölçümü ve sulama programı oluşturma.",
    category: "irrigation",
    icon: "⏰",
    readTime: 5,
    tags: ["zamanlama", "toprak nemi", "su ihtiyacı", "verimlilik"],
  },
  // Ekim & Dikim
  {
    id: "ekim-takvimi",
    title: "Türkiye Ekim Takvimi",
    summary: "Bölgelere ve mevsimlere göre hangi ürünlerin ne zaman ekilmesi gerektiğine dair kapsamlı takvim.",
    category: "planting",
    icon: "📅",
    readTime: 8,
    tags: ["takvim", "mevsim", "bölge", "planlama"],
  },
  {
    id: "tohum-secimi",
    title: "Doğru Tohum Seçimi",
    summary: "Sertifikalı tohum kullanımının önemi, tohum seçim kriterleri ve tedarikçi değerlendirme.",
    category: "planting",
    icon: "🌱",
    readTime: 5,
    tags: ["tohum", "sertifika", "kalite", "verim"],
  },
  {
    id: "munavebe",
    title: "Ekim Nöbeti (Münavebe) Rehberi",
    summary: "Toprağı dinlendirmek ve verimi artırmak için ekim nöbeti planlaması ve en iyi ürün rotasyonları.",
    category: "planting",
    icon: "🔄",
    readTime: 6,
    tags: ["rotasyon", "toprak", "verim", "planlama"],
  },
  // Gübreleme
  {
    id: "toprak-analizi",
    title: "Toprak Analizi Nasıl Yaptırılır?",
    summary: "Toprak analizi neden önemlidir, nasıl numune alınır, sonuçlar nasıl yorumlanır ve gübreleme planı nasıl yapılır.",
    category: "fertilizing",
    icon: "🔬",
    readTime: 6,
    tags: ["toprak", "analiz", "pH", "besin elementleri"],
  },
  {
    id: "organik-gubre",
    title: "Organik Gübre Rehberi",
    summary: "Çiftlik gübresi, kompost, yeşil gübre ve diğer organik gübre türlerinin kullanımı ve faydaları.",
    category: "fertilizing",
    icon: "♻️",
    readTime: 5,
    tags: ["organik", "kompost", "çiftlik gübresi", "sürdürülebilir"],
  },
  // Ekipman
  {
    id: "traktör-bakim",
    title: "Traktör Bakım Rehberi",
    summary: "Mevsimlik traktör bakım kontrol listesi, yağ değişimi, filtre bakımı ve kışa hazırlık.",
    category: "equipment",
    icon: "🚜",
    readTime: 6,
    tags: ["traktör", "bakım", "yağ", "filtre"],
  },
  {
    id: "tarimsal-drone",
    title: "Tarımda Drone Kullanımı",
    summary: "İlaçlama, haritalama ve bitki sağlığı izleme için drone teknolojisinin tarıma entegrasyonu.",
    category: "equipment",
    icon: "🤖",
    readTime: 7,
    tags: ["drone", "teknoloji", "ilaçlama", "haritalama"],
  },
  // Mevsimsel
  {
    id: "ilkbahar-hazirligi",
    title: "İlkbahar Tarla Hazırlığı",
    summary: "İlkbaharda yapılması gereken toprak işleme, gübreleme, budama ve ekim öncesi hazırlıklar.",
    category: "seasonal",
    icon: "🌸",
    readTime: 6,
    tags: ["ilkbahar", "hazırlık", "toprak işleme", "budama"],
  },
  {
    id: "kis-koruma",
    title: "Kışa Hazırlık ve Don Koruması",
    summary: "Bitkileri dondan koruma yöntemleri, sera hazırlığı, kış budaması ve toprak örtüsü kullanımı.",
    category: "seasonal",
    icon: "❄️",
    readTime: 5,
    tags: ["kış", "don", "koruma", "sera"],
  },
  {
    id: "hasat-sonrasi",
    title: "Hasat Sonrası Ürün Saklama",
    summary: "Hasat edilen ürünlerin doğru saklanması, depolama koşulları ve kayıpların önlenmesi.",
    category: "seasonal",
    icon: "📦",
    readTime: 5,
    tags: ["hasat", "depolama", "saklama", "kayıp önleme"],
  },
];

export default function EducationPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = ARTICLES;

    if (selectedCategory) {
      result = result.filter((a) => a.category === selectedCategory);
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }

    return result;
  }, [search, selectedCategory]);

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Başlık */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Eğitim & Bilgi Bankası
        </h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Tarımsal konularda rehberler ve pratik bilgiler
        </p>
      </div>

      {/* Arama */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Konu, etiket veya anahtar kelime ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Kategori Filtreleri */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
            !selectedCategory
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          Tümü
        </button>
        {Object.entries(CATEGORIES).map(([key, cat]) => (
          <button
            key={key}
            onClick={() =>
              setSelectedCategory(selectedCategory === key ? null : key)
            }
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              selectedCategory === key
                ? cat.color
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {cat.icon}
            {cat.label}
          </button>
        ))}
      </div>

      {/* Sonuç sayısı */}
      <p className="text-sm text-muted-foreground">
        {filtered.length} makale
        {(search || selectedCategory) && (
          <button
            onClick={() => {
              setSearch("");
              setSelectedCategory(null);
            }}
            className="ml-2 text-primary hover:underline"
          >
            Filtreleri temizle
          </button>
        )}
      </p>

      {/* Makale Kartları */}
      {filtered.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="flex flex-col items-center py-16">
            <BookOpen className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-base font-medium">Sonuç bulunamadı</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Farklı anahtar kelimeler veya kategoriler deneyin
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((article) => {
            const cat = CATEGORIES[article.category];
            return (
              <Link
                key={article.id}
                href={`/dashboard/education/${article.id}`}
              >
                <Card className="h-full cursor-pointer border-0 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <span className="text-2xl">{article.icon}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${cat?.color}`}
                      >
                        {cat?.label}
                      </span>
                    </div>
                    <CardTitle className="mt-2 text-base leading-snug">
                      {article.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {article.summary}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {article.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {article.readTime} dk
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
