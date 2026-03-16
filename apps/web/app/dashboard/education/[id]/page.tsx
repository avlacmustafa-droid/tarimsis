"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Tag, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Makale içerikleri
const ARTICLE_CONTENT: Record<
  string,
  {
    title: string;
    icon: string;
    category: string;
    readTime: number;
    tags: string[];
    sections: { heading: string; content: string }[];
  }
> = {
  "kursuni-kuf": {
    title: "Kürsüni Küf (Mildiyö) Hastalığı",
    icon: "🍇",
    category: "Hastalıklar & Zararlılar",
    readTime: 5,
    tags: ["bağcılık", "domates", "mantar", "ilaçlama"],
    sections: [
      {
        heading: "Hastalık Nedir?",
        content:
          "Kürsüni küf (Mildiyö), Plasmopara viticola mantarının neden olduğu, özellikle bağlarda ve sebzelerde yaygın görülen bir hastalıktır. Nemli ve ılık hava koşullarında hızla yayılır.",
      },
      {
        heading: "Belirtileri",
        content:
          "• Yaprak üst yüzeyinde sarımsı-yeşil lekeler\n• Yaprak alt yüzeyinde beyaz pamuksu küf oluşumu\n• Meyvelerde kahverengileşme ve çürüme\n• Sürgünlerde kıvrılma ve solma\n• İleri aşamada yaprak dökümü",
      },
      {
        heading: "Önleme Yöntemleri",
        content:
          "• Hava sirkülasyonunu artırmak için uygun budama\n• Dayanıklı çeşit seçimi\n• Aşırı sulamadan kaçınma\n• Toprak yüzeyindeki kalıntıları temizleme\n• Koruyucu bakır preparatlarının zamanında uygulanması",
      },
      {
        heading: "Tedavi",
        content:
          "• Bakırlı ilaçlar (Bordo bulamacı) — koruyucu olarak kullanılır\n• Sistemik fungisitler (Metalaxyl, Fosetyl-Al)\n• İlaçlama sabah erken veya akşam saatlerinde yapılmalı\n• 7-10 gün arayla tekrarlanmalı\n• Hasat öncesi bekleme sürelerine dikkat edilmeli",
      },
    ],
  },
  "yaprak-biti": {
    title: "Yaprak Biti Mücadelesi",
    icon: "🐛",
    category: "Hastalıklar & Zararlılar",
    readTime: 4,
    tags: ["zararlı", "organik", "ilaçlama", "sebze"],
    sections: [
      {
        heading: "Yaprak Bitleri Hakkında",
        content:
          "Yaprak bitleri (Aphidoidea), bitki özsuyunu emerek beslenen küçük böceklerdir. Hızlı üreme kapasiteleri sayesinde kısa sürede büyük popülasyonlar oluşturabilirler.",
      },
      {
        heading: "Zararları",
        content:
          "• Bitki özsuyunun emilmesi — büyüme geriliği\n• Yapraklarda kıvrılma ve sararma\n• Ballımsı salgı — küllemeye zemin hazırlar\n• Virüs hastalıklarının taşınması\n• Meyve kalitesinde düşüş",
      },
      {
        heading: "Organik Mücadele",
        content:
          "• Doğal düşmanlar: Uğur böceği, yeşil lacewing, yaban arıları\n• Sabunlu su çözeltisi (1L suya 1 yemek kaşığı sıvı sabun)\n• Sarımsak-biber spreyi\n• Neem yağı uygulaması\n• Sarı yapışkan tuzaklar",
      },
      {
        heading: "Kimyasal Mücadele",
        content:
          "• Piretroid grubu insektisitler\n• Neonikotinoid grubu (arılara zararlı, dikkatli kullanın)\n• Sistemik insektisitler — kök yoluyla alınır\n• İlaçlama öncesi faydalı böcek popülasyonunu değerlendirin",
      },
    ],
  },
  "toprak-hastaliklari": {
    title: "Toprak Kaynaklı Hastalıklar",
    icon: "🦠",
    category: "Hastalıklar & Zararlılar",
    readTime: 6,
    tags: ["toprak", "kök çürüklüğü", "mantar", "dezenfeksiyon"],
    sections: [
      {
        heading: "Genel Bilgi",
        content:
          "Toprak kaynaklı hastalıklar, toprakta yaşayan patojen mantar ve bakterilerin neden olduğu, kök ve gövde tabanını etkileyen hastalıklardır.",
      },
      {
        heading: "Yaygın Hastalıklar",
        content:
          "• Fusarium solgunluğu — iletim demetlerini tıkar\n• Verticillium solgunluğu — yapraklarda tek taraflı solma\n• Rhizoctonia kök çürüklüğü — fide döneminde etkili\n• Phytophthora kök çürüklüğü — aşırı nemli topraklarda\n• Sclerotinia beyaz çürüklük",
      },
      {
        heading: "Mücadele",
        content:
          "• Ekim nöbeti (3-4 yıllık rotasyon)\n• Dayanıklı çeşit ve anaç kullanımı\n• Toprak solarizasyonu (yaz aylarında)\n• Biyolojik mücadele (Trichoderma)\n• Drenaj iyileştirme\n• Toprak pH ayarlaması",
      },
    ],
  },
  "damla-sulama": {
    title: "Damla Sulama Sistemi Kurulumu",
    icon: "💧",
    category: "Sulama",
    readTime: 7,
    tags: ["damla sulama", "verimlilik", "su tasarrufu", "sistem"],
    sections: [
      {
        heading: "Damla Sulama Nedir?",
        content:
          "Damla sulama, suyun bitki kök bölgesine kontrollü şekilde, düşük basınçla ve damla damla verildiği modern bir sulama yöntemidir. Geleneksel yöntemlere göre %30-50 su tasarrufu sağlar.",
      },
      {
        heading: "Sistem Bileşenleri",
        content:
          "• Ana boru hattı (PE boru)\n• Yan borular (lateraller)\n• Damlalıklar (2-4 lt/saat)\n• Filtre sistemi (disk veya kum filtre)\n• Basınç regülatörü\n• Gübre enjektörü (fertigation için)\n• Bağlantı elemanları (vanalar, contalar)",
      },
      {
        heading: "Kurulum Adımları",
        content:
          "1. Su kaynağı ve debi tespiti\n2. Arazi ölçümü ve proje çizimi\n3. Ana hat döşeme\n4. Filtre ve basınç regülatörü montajı\n5. Yan boruların döşenmesi\n6. Damlalıkların montajı\n7. Sistem testi ve ayar",
      },
      {
        heading: "Bakım",
        content:
          "• Filtreleri düzenli temizleyin (haftada 1)\n• Damlalık tıkanmalarını kontrol edin\n• Sezon sonunda sistemi asitli su ile yıkayın\n• Kış öncesi borulardaki suyu boşaltın\n• Hasar görmüş parçaları zamanında değiştirin",
      },
    ],
  },
  "sulama-zamanlama": {
    title: "Doğru Sulama Zamanlaması",
    icon: "⏰",
    category: "Sulama",
    readTime: 5,
    tags: ["zamanlama", "toprak nemi", "su ihtiyacı", "verimlilik"],
    sections: [
      {
        heading: "Neden Önemli?",
        content:
          "Yanlış zamanlama hem su israfına hem de ürün kaybına yol açar. Aşırı sulama kök çürüklüğü, yetersiz sulama ise verim düşüşü demektir.",
      },
      {
        heading: "Genel Kurallar",
        content:
          "• Sabah erken saatler en ideal sulama zamanıdır\n• Öğle sıcağında sulama yapmayın — buharlaşma yüksek\n• Akşam sulaması mantar hastalıklarını tetikleyebilir\n• Toprak nemini parmak testi veya tansiyometre ile ölçün\n• Hafif ve sık sulama yerine derin ve aralıklı sulama tercih edin",
      },
      {
        heading: "Ürün Bazlı İhtiyaçlar",
        content:
          "• Domates: Çiçeklenme ve meyve tutumunda düzenli sulama kritik\n• Buğday: Sapa kalkma ve başaklanma dönemlerinde su ihtiyacı en yüksek\n• Mısır: Tepe püskülü döneminde su stresi verimi %50 düşürebilir\n• Bağ: Meyve büyüme döneminde kontrollü su stresi kaliteyi artırır",
      },
    ],
  },
  "ekim-takvimi": {
    title: "Türkiye Ekim Takvimi",
    icon: "📅",
    category: "Ekim & Dikim",
    readTime: 8,
    tags: ["takvim", "mevsim", "bölge", "planlama"],
    sections: [
      {
        heading: "İlkbahar (Mart-Mayıs)",
        content:
          "• Mart: Patates, bezelye, ıspanak, havuç (açıkta)\n• Nisan: Domates, biber, patlıcan (fide dikim), mısır, ayçiçeği\n• Mayıs: Fasulye, bamya, kavun, karpuz, pamuk",
      },
      {
        heading: "Yaz (Haziran-Ağustos)",
        content:
          "• Haziran: İkinci ürün mısır, soya fasulyesi\n• Temmuz: Sonbahar sebzeleri için fide hazırlığı\n• Ağustos: Çilek fidesi dikimi, brokoli-karnabahar fide dikimi",
      },
      {
        heading: "Sonbahar (Eylül-Kasım)",
        content:
          "• Eylül: Buğday, arpa (erken ekim bölgeleri), ıspanak, turp\n• Ekim: Kışlık sebzeler, sarımsak, soğan (tohum)\n• Kasım: Buğday (geç ekim), bakla, bezelye",
      },
      {
        heading: "Kış (Aralık-Şubat)",
        content:
          "• Sera üretimi: Domates, salatalık, biber\n• Budama: Bağ, meyve ağaçları\n• Toprak hazırlığı ve gübreleme\n• Fide yetiştirme hazırlıkları",
      },
    ],
  },
  "tohum-secimi": {
    title: "Doğru Tohum Seçimi",
    icon: "🌱",
    category: "Ekim & Dikim",
    readTime: 5,
    tags: ["tohum", "sertifika", "kalite", "verim"],
    sections: [
      {
        heading: "Neden Önemli?",
        content:
          "Tohum, tarımın temelidir. Kaliteli ve sertifikalı tohum kullanımı verimi %20-30 artırabilir.",
      },
      {
        heading: "Seçim Kriterleri",
        content:
          "• Bölge iklim koşullarına uygunluk\n• Hastalıklara dayanıklılık\n• Verim potansiyeli\n• Olgunlaşma süresi\n• Pazar talebi ve fiyat\n• Tohum sertifikası",
      },
      {
        heading: "Sertifikalı Tohum",
        content:
          "• Tohum Sertifikasyon ve Test Müdürlükleri tarafından kontrol edilir\n• Genetik saflık garantisi\n• Çimlenme oranı yüksek\n• Hastalık taşımaz\n• Etiket bilgilerini mutlaka kontrol edin",
      },
    ],
  },
  "munavebe": {
    title: "Ekim Nöbeti (Münavebe) Rehberi",
    icon: "🔄",
    category: "Ekim & Dikim",
    readTime: 6,
    tags: ["rotasyon", "toprak", "verim", "planlama"],
    sections: [
      {
        heading: "Ekim Nöbeti Nedir?",
        content:
          "Ekim nöbeti, aynı tarlada art arda farklı ürün gruplarının yetiştirilmesidir. Toprak sağlığını korur ve hastalık baskısını azaltır.",
      },
      {
        heading: "Temel Prensipler",
        content:
          "• Aynı familyadan bitkiler art arda ekilmemeli\n• Derin köklü bitkilerden sonra sığ köklü bitkiler\n• Azot bağlayan baklagillerden sonra azot seven bitkiler\n• 3-4 yıllık rotasyon planı ideal",
      },
      {
        heading: "Örnek Rotasyon",
        content:
          "1. Yıl: Buğday (tahıl)\n2. Yıl: Ayçiçeği (yağ bitkisi)\n3. Yıl: Nohut/Mercimek (baklagil — azot bağlar)\n4. Yıl: Mısır veya şeker pancarı (çapa bitkisi)",
      },
    ],
  },
  "toprak-analizi": {
    title: "Toprak Analizi Nasıl Yaptırılır?",
    icon: "🔬",
    category: "Gübreleme",
    readTime: 6,
    tags: ["toprak", "analiz", "pH", "besin elementleri"],
    sections: [
      {
        heading: "Neden Gerekli?",
        content:
          "Toprak analizi, toprağınızın besin durumunu ve fiziksel özelliklerini belirleyerek doğru ve ekonomik gübreleme yapmanızı sağlar.",
      },
      {
        heading: "Numune Alma",
        content:
          "• Hasat sonrası veya ekim öncesi alın\n• 0-30 cm derinlikten V şeklinde kazarak\n• Tarlada 15-20 farklı noktadan alın\n• Numuneleri karıştırıp 1 kg kadar ayırın\n• Gübre atılmış, hayvan gübresi yığılmış alanlardan almayın",
      },
      {
        heading: "Analiz Sonuçlarını Okuma",
        content:
          "• pH: 6.5-7.5 ideal (çoğu ürün için)\n• Organik madde: %2'nin üstü iyi\n• Fosfor (P): 8-25 ppm yeterli\n• Potasyum (K): 150-300 ppm yeterli\n• Azot (N): Toprak analizi + bitki ihtiyacına göre hesaplanır",
      },
    ],
  },
  "organik-gubre": {
    title: "Organik Gübre Rehberi",
    icon: "♻️",
    category: "Gübreleme",
    readTime: 5,
    tags: ["organik", "kompost", "çiftlik gübresi", "sürdürülebilir"],
    sections: [
      {
        heading: "Organik Gübre Türleri",
        content:
          "• Çiftlik gübresi (sığır, koyun, tavuk)\n• Kompost\n• Yeşil gübre (baklagil bitkileri)\n• Solucan gübresi (vermikompost)\n• Deniz yosunu özütleri",
      },
      {
        heading: "Doğru Kullanım",
        content:
          "• Çiftlik gübresi mutlaka yanmış/olgunlaşmış olmalı\n• Tavuk gübresi çok konsantre — az miktarda kullanın\n• Kompost yapmak için 3-6 ay bekleyin\n• Sonbaharda toprağa karıştırarak uygulayın\n• Dekara 2-4 ton çiftlik gübresi yeterli",
      },
    ],
  },
  "traktor-bakim": {
    title: "Traktör Bakım Rehberi",
    icon: "🚜",
    category: "Ekipman & Teknik",
    readTime: 6,
    tags: ["traktör", "bakım", "yağ", "filtre"],
    sections: [
      {
        heading: "Günlük Kontrol",
        content:
          "• Motor yağı seviyesi\n• Soğutma suyu seviyesi\n• Lastik basınçları\n• Fren ve debriyaj kontrolü\n• Aydınlatma sistemi",
      },
      {
        heading: "Periyodik Bakım",
        content:
          "• Her 250 saat: Motor yağı ve filtre değişimi\n• Her 500 saat: Yakıt filtresi, hava filtresi değişimi\n• Her 1000 saat: Hidrolik yağ kontrolü, kayış değişimi\n• Her 2000 saat: Genel bakım, enjektör kontrolü",
      },
      {
        heading: "Kışa Hazırlık",
        content:
          "• Antifriz seviyesini kontrol edin\n• Akü şarjını kontrol edin\n• Kullanılmayacaksa yakıt deposunu doldurun (yoğuşma önlenir)\n• Kapalı ve kuru bir yerde saklayın",
      },
    ],
  },
  "tarimsal-drone": {
    title: "Tarımda Drone Kullanımı",
    icon: "🤖",
    category: "Ekipman & Teknik",
    readTime: 7,
    tags: ["drone", "teknoloji", "ilaçlama", "haritalama"],
    sections: [
      {
        heading: "Kullanım Alanları",
        content:
          "• İlaçlama: Geniş alanlarda hızlı ve homojen uygulama\n• Bitki sağlığı izleme: NDVI kameraları ile stres tespiti\n• Haritalama: Arazi sınırları ve alan hesaplama\n• Ekim: Tohum serpme uygulamaları\n• Sulama: Su stresi tespiti",
      },
      {
        heading: "Avantajları",
        content:
          "• İnsan gücü tasarrufu\n• Hassas ilaçlama — %30 daha az ilaç kullanımı\n• Erişilmesi zor alanlar için ideal\n• Hızlı veri toplama\n• Çevre dostu uygulama",
      },
      {
        heading: "Yasal Gereklilikler",
        content:
          "• Sivil Havacılık Genel Müdürlüğü kaydı gerekli\n• İlaçlama droneları için özel ruhsat\n• Belirli yükseklik ve alan sınırlamaları\n• Tarımsal ilaçlama sertifikası",
      },
    ],
  },
  "ilkbahar-hazirligi": {
    title: "İlkbahar Tarla Hazırlığı",
    icon: "🌸",
    category: "Mevsimsel Rehber",
    readTime: 6,
    tags: ["ilkbahar", "hazırlık", "toprak işleme", "budama"],
    sections: [
      {
        heading: "Toprak Hazırlığı",
        content:
          "• Toprak tavında iken sürüm yapın (çok ıslak veya kuru değil)\n• Derin sürüm sonbahar, yüzeysel sürüm ilkbaharda\n• Tırmık ve merdane ile tohum yatağı hazırlayın\n• Gerekirse kireçleme yapın (pH düzeltme)",
      },
      {
        heading: "Gübreleme",
        content:
          "• Toprak analiz sonuçlarına göre gübre planlayın\n• Taban gübresi ekim/dikim öncesi uygulanır\n• Üst gübre bitki büyüdükçe verilir\n• DAP, 20-20-0 gibi kompoze gübreler yaygın kullanılır",
      },
      {
        heading: "Meyve Bahçesi",
        content:
          "• Kış budamasını mart sonuna kadar tamamlayın\n• Budama yaralarına macun sürün\n• Kış bakırı uygulaması yapın\n• Gerekli aşılamaları yapın",
      },
    ],
  },
  "kis-koruma": {
    title: "Kışa Hazırlık ve Don Koruması",
    icon: "❄️",
    category: "Mevsimsel Rehber",
    readTime: 5,
    tags: ["kış", "don", "koruma", "sera"],
    sections: [
      {
        heading: "Don Koruması",
        content:
          "• Kritik geceler: Hava durumunu takip edin\n• Örtü malzemeleri: Agril, naylon, hasır\n• Don sulaması: Bitkiler üzerine sürekli su sıkarak\n• Tütsüleme: Bahçe kenarında duman\n• Rüzgâr makineleri (büyük bahçeler için)",
      },
      {
        heading: "Sera Hazırlığı",
        content:
          "• Plastik örtüyü kontrol edin, yırtıkları onarın\n• Isıtma sistemini test edin\n• Havalandırma mekanizmalarını kontrol edin\n• Sera toprağını dezenfekte edin\n• Kış ürünlerinin fide dikimini planlayın",
      },
    ],
  },
  "hasat-sonrasi": {
    title: "Hasat Sonrası Ürün Saklama",
    icon: "📦",
    category: "Mevsimsel Rehber",
    readTime: 5,
    tags: ["hasat", "depolama", "saklama", "kayıp önleme"],
    sections: [
      {
        heading: "Genel Kurallar",
        content:
          "• Hasadı doğru olgunlukta yapın\n• Hasar görmüş ürünleri ayırın\n• Hızlı ön soğutma uygulayın (sebze-meyve)\n• Uygun sıcaklık ve nem koşullarında depolayın\n• Düzenli kontrol yapın",
      },
      {
        heading: "Tahıl Depolama",
        content:
          "• Nem oranı %13'ün altında olmalı\n• Havalandırma sistemli depo kullanın\n• Zararlılara karşı fumigasyon\n• Depo tabanında nem bariyeri\n• Sıcaklık takibi yapın",
      },
      {
        heading: "Sebze-Meyve Saklama",
        content:
          "• Elma: 0-4°C, %90-95 nem (6 aya kadar)\n• Patates: 4-8°C, karanlık ortam\n• Soğan: Serin, kuru, havadar ortam\n• Domates: Oda sıcaklığında olgunlaşır, buzdolabında lezzet kaybeder",
      },
    ],
  },
};

export default function ArticleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const article = ARTICLE_CONTENT[id];

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <BookOpen className="h-12 w-12 text-muted-foreground" />
        <p className="mt-4 text-lg font-medium">Makale bulunamadı</p>
        <Link href="/dashboard/education">
          <Button variant="outline" className="mt-4">
            Bilgi Bankasına Dön
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Geri */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/education">
          <Button variant="ghost" size="icon" className="rounded-xl">
            <ArrowLeft size={18} />
          </Button>
        </Link>
        <span className="text-sm text-muted-foreground">Bilgi Bankası</span>
      </div>

      {/* Başlık Kartı */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <span className="text-3xl">{article.icon}</span>
          <h1 className="mt-3 text-2xl font-bold">{article.title}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {article.readTime} dk okuma
            </span>
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
              {article.category}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 rounded bg-primary/10 px-2 py-0.5 text-xs text-primary"
              >
                <Tag size={10} />
                {tag}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* İçerik Bölümleri */}
      <div className="space-y-4">
        {article.sections.map((section, i) => (
          <Card key={i} className="border-0 shadow-sm">
            <CardContent className="p-5 sm:p-6">
              <h2 className="text-lg font-semibold">{section.heading}</h2>
              <div className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                {section.content}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alt navigasyon */}
      <div className="flex justify-center pb-8">
        <Link href="/dashboard/education">
          <Button variant="outline" className="gap-1.5">
            <ArrowLeft size={14} />
            Tüm Makalelere Dön
          </Button>
        </Link>
      </div>
    </div>
  );
}
