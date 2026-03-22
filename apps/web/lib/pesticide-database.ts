/**
 * Türkiye'de T.C. Tarım ve Orman Bakanlığı tarafından ruhsatlı
 * bitki koruma ürünleri veritabanı.
 *
 * Kaynak: bku.tarimorman.gov.tr
 * Son güncelleme: 2026-03
 */

export interface PesticideInfo {
  aktif_madde: string;
  ticari_isimler: string[];
  dozaj: string;
  uygulama_sekli: string;
  hasat_arasi_sure: string; // gün
}

export interface DiseaseInfo {
  hastalik_adi: string;
  etmen: string; // patojen/zararlı türü
  belirtiler: string[];
  biyolojik_mucadele: string[];
  kimyasal_mucadele: PesticideInfo[];
  kulturel_onlemler: string[];
}

export interface CropDiseases {
  bitki_adi: string;
  hastaliklar: DiseaseInfo[];
}

export const PESTICIDE_DATABASE: CropDiseases[] = [
  // ===================== DOMATES =====================
  {
    bitki_adi: "Domates",
    hastaliklar: [
      {
        hastalik_adi: "Mildiyö (Geç Yanıklık)",
        etmen: "Phytophthora infestans",
        belirtiler: [
          "Yapraklarda su emmiş gibi koyu yeşil-kahverengi lekeler",
          "Yaprak altında beyaz küf tabakası",
          "Meyvelerde kahverengi sert lekeler",
          "Hızlı kuruma ve ölüm",
        ],
        biyolojik_mucadele: [
          "Bakır hidroksit bazlı biyolojik preparatlar",
          "Trichoderma harzianum uygulaması",
          "Hastalıklı bitki artıklarının toplanıp yakılması",
        ],
        kimyasal_mucadele: [
          {
            aktif_madde: "Metalaksil-M + Mankozeb",
            ticari_isimler: ["Ridomil Gold MZ 68 WG"],
            dozaj: "250 g / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "14 gün",
          },
          {
            aktif_madde: "Mankozeb",
            ticari_isimler: ["Dithane M-45", "Penncozeb 80 WP"],
            dozaj: "200 g / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "7 gün",
          },
          {
            aktif_madde: "Famoksadon + Simoksanil",
            ticari_isimler: ["Equation Pro"],
            dozaj: "40 g / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "3 gün",
          },
          {
            aktif_madde: "Bakır oksiklorür",
            ticari_isimler: ["Cupravit", "Bakır Oksiklorür 50 WP"],
            dozaj: "300-500 g / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "7 gün",
          },
          {
            aktif_madde: "Metiram",
            ticari_isimler: ["Polyram DF"],
            dozaj: "200 g / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "7 gün",
          },
        ],
        kulturel_onlemler: [
          "Sertifikalı tohum kullanın",
          "Bitki sıklığını azaltın, havalandırma sağlayın",
          "Damlama sulama tercih edin",
          "Hastalıklı bitki artıklarını imha edin",
          "Münavebe (ekim nöbeti) uygulayın",
        ],
      },
      {
        hastalik_adi: "Erken Yanıklık",
        etmen: "Alternaria solani",
        belirtiler: [
          "Yapraklarda eşmerkezli halkalı kahverengi lekeler",
          "Alt yapraklardan başlayıp yukarı doğru ilerleme",
          "Meyve sapında kahverengi çökük lekeler",
          "Yaprak sararması ve dökülmesi",
        ],
        biyolojik_mucadele: [
          "Trichoderma harzianum uygulaması",
          "Bacillus subtilis bazlı preparatlar",
        ],
        kimyasal_mucadele: [
          {
            aktif_madde: "Azoksistrobin",
            ticari_isimler: ["Quadris", "Amistar"],
            dozaj: "75-100 ml / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "3 gün",
          },
          {
            aktif_madde: "Difenokonazol",
            ticari_isimler: ["Score 250 EC"],
            dozaj: "50 ml / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "7 gün",
          },
          {
            aktif_madde: "Klorotalonil",
            ticari_isimler: ["Daconil 720 SC", "Bravo 720 SC"],
            dozaj: "200 ml / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "7 gün",
          },
          {
            aktif_madde: "Mankozeb",
            ticari_isimler: ["Dithane M-45"],
            dozaj: "200 g / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "7 gün",
          },
        ],
        kulturel_onlemler: [
          "Hastalıksız fide kullanın",
          "Alt yaprakları budayın",
          "Ekim nöbeti uygulayın (en az 3 yıl)",
          "Bitki artıklarını temizleyin",
        ],
      },
      {
        hastalik_adi: "Külleme",
        etmen: "Leveillula taurica / Oidium neolycopersici",
        belirtiler: [
          "Yaprak üstünde beyaz pudra gibi küf",
          "Yaprakların sararıp kuruması",
          "Ağır enfeksiyonda meyve kalitesi düşer",
        ],
        biyolojik_mucadele: [
          "Kükürt bazlı preparatlar (organik tarımda kullanılabilir)",
          "Ampelomyces quisqualis (biyolojik fungusit)",
        ],
        kimyasal_mucadele: [
          {
            aktif_madde: "Kükürt (toz veya sıvı)",
            ticari_isimler: ["Tiovit Jet", "Kumulus DF"],
            dozaj: "300-500 g / 100 L su",
            uygulama_sekli: "Yaprak uygulaması (sıcaklık 35°C altında)",
            hasat_arasi_sure: "1 gün",
          },
          {
            aktif_madde: "Penkonazol",
            ticari_isimler: ["Topas 100 EC"],
            dozaj: "25 ml / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "7 gün",
          },
          {
            aktif_madde: "Miklobutanil",
            ticari_isimler: ["Systhane 24 E"],
            dozaj: "30 ml / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "3 gün",
          },
        ],
        kulturel_onlemler: [
          "Havalandırmayı iyi sağlayın",
          "Aşırı azotlu gübreleme yapmayın",
          "Dayanıklı çeşitler tercih edin",
        ],
      },
      {
        hastalik_adi: "Yaprak Galeri Sineği",
        etmen: "Liriomyza trifolii / Liriomyza bryoniae",
        belirtiler: [
          "Yapraklarda kıvrımlı beyaz-sarı tüneller (galeriler)",
          "Yaprak üzerinde nokta şeklinde beslenme izleri",
          "Ağır enfeksiyonda yapraklar kurur",
        ],
        biyolojik_mucadele: [
          "Diglyphus isaea (parazitoid arı) salımı",
          "Sarı yapışkan tuzaklar ile ergin avlama",
        ],
        kimyasal_mucadele: [
          {
            aktif_madde: "Abamektin",
            ticari_isimler: ["Vertimec 1.8 EC", "Abamectin 18 EC"],
            dozaj: "50 ml / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "3 gün",
          },
          {
            aktif_madde: "Spiromesifen",
            ticari_isimler: ["Oberon 240 SC"],
            dozaj: "50 ml / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "3 gün",
          },
          {
            aktif_madde: "Siyantraniliprol",
            ticari_isimler: ["Cyazypyr", "Exirel"],
            dozaj: "50-75 ml / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "3 gün",
          },
        ],
        kulturel_onlemler: [
          "Sarı yapışkan tuzak kullanın",
          "Sera girişlerinde böcek tülü kullanın",
          "Bulaşık yaprakları toplayıp imha edin",
        ],
      },
      {
        hastalik_adi: "Beyaz Sinek",
        etmen: "Bemisia tabaci / Trialeurodes vaporariorum",
        belirtiler: [
          "Yaprak altında küçük beyaz sinekler",
          "Yapışkan bal özü salgısı (fumajin oluşumu)",
          "Yaprakların sararması",
          "Virüs taşıyıcılığı (TYLCV)",
        ],
        biyolojik_mucadele: [
          "Encarsia formosa (parazitoid arı) salımı",
          "Eretmocerus eremicus salımı",
          "Sarı yapışkan tuzaklar",
        ],
        kimyasal_mucadele: [
          {
            aktif_madde: "Spiromesifen",
            ticari_isimler: ["Oberon 240 SC"],
            dozaj: "50 ml / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "3 gün",
          },
          {
            aktif_madde: "Pyriproksfen",
            ticari_isimler: ["Admiral 10 EC"],
            dozaj: "50 ml / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "7 gün",
          },
          {
            aktif_madde: "Asetamiprid",
            ticari_isimler: ["Mospilan 20 SP"],
            dozaj: "30 g / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "3 gün",
          },
        ],
        kulturel_onlemler: [
          "Sera girişlerinde böcek tülü kullanın",
          "Sarı yapışkan tuzak asın",
          "Yabancı otları temizleyin",
          "TYLCV dayanıklı çeşitler tercih edin",
        ],
      },
      {
        hastalik_adi: "Kırmızı Örümcek (Akar)",
        etmen: "Tetranychus urticae",
        belirtiler: [
          "Yaprak üstünde küçük sarı-beyaz noktacıklar",
          "Yaprak altında ince ağ örgüsü",
          "Yaprakların bronzlaşması ve kuruması",
          "Sıcak ve kuru havalarda artış",
        ],
        biyolojik_mucadele: [
          "Phytoseiulus persimilis (yırtıcı akar) salımı",
          "Amblyseius californicus salımı",
        ],
        kimyasal_mucadele: [
          {
            aktif_madde: "Abamektin",
            ticari_isimler: ["Vertimec 1.8 EC"],
            dozaj: "50 ml / 100 L su",
            uygulama_sekli: "Yaprak uygulaması (yaprak altına iyi temas)",
            hasat_arasi_sure: "3 gün",
          },
          {
            aktif_madde: "Spirodiklofen",
            ticari_isimler: ["Envidor 240 SC"],
            dozaj: "40 ml / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "3 gün",
          },
          {
            aktif_madde: "Heksitiazoks",
            ticari_isimler: ["Nissorun 10 WP"],
            dozaj: "50 g / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "7 gün",
          },
        ],
        kulturel_onlemler: [
          "Sera nemini %60 üstünde tutun",
          "Tozlanmayı önleyin (sera yollarını sulayın)",
          "Yabancı otları temizleyin",
        ],
      },
      {
        hastalik_adi: "Bakteriyel Solgunluk",
        etmen: "Ralstonia solanacearum",
        belirtiler: [
          "Bitkide aniden solgunluk",
          "Gövde kesitinde kahverengi damar halkası",
          "Sıcak havalarda belirtiler artar",
          "Kesilen gövdeden süt renginde bakteri akıntısı",
        ],
        biyolojik_mucadele: [
          "Toprak solarizasyonu (yaz aylarında)",
          "Bacillus subtilis uygulaması",
          "Trichoderma spp. ile toprak dezenfeksiyonu",
        ],
        kimyasal_mucadele: [
          {
            aktif_madde: "Bakır hidroksit",
            ticari_isimler: ["Kocide 2000", "Champion WP"],
            dozaj: "200-300 g / 100 L su",
            uygulama_sekli: "Toprak drench + yaprak uygulaması (koruyucu)",
            hasat_arasi_sure: "7 gün",
          },
        ],
        kulturel_onlemler: [
          "Dayanıklı çeşit veya anaç kullanın",
          "Ekim nöbeti (en az 5 yıl buğdaygiller ile)",
          "Toprak solarizasyonu yapın",
          "Bulaşık bitkileri kökten söküp imha edin",
          "Aletleri dezenfekte edin",
          "Toprak pH'ını 6.5-7 arasında tutun",
        ],
      },
      {
        hastalik_adi: "Domates Güvesi (Tuta absoluta)",
        etmen: "Tuta absoluta",
        belirtiler: [
          "Yaprak içinde galeriler ve tüneller",
          "Meyvede giriş delikleri ve tünel izleri",
          "Yaprakların kuruması",
          "Meyvelerin çürümesi",
        ],
        biyolojik_mucadele: [
          "Feromon tuzakları ile ergin takibi",
          "Nesidiocoris tenuis (yırtıcı böcek) salımı",
          "Trichogramma achaeae (yumurta parazitoidi) salımı",
          "Bacillus thuringiensis (Bt) uygulaması",
        ],
        kimyasal_mucadele: [
          {
            aktif_madde: "Klorantraniliprol",
            ticari_isimler: ["Coragen 20 SC", "Altacor 35 WG"],
            dozaj: "20 ml / 100 L su (Coragen), 8 g / 100 L su (Altacor)",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "1 gün",
          },
          {
            aktif_madde: "Spinosad",
            ticari_isimler: ["Laser 240 SC", "Tracer 480 SC"],
            dozaj: "30-50 ml / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "3 gün",
          },
          {
            aktif_madde: "Indoksakarb",
            ticari_isimler: ["Avaunt 150 EC"],
            dozaj: "25 ml / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "3 gün",
          },
          {
            aktif_madde: "Emamektin benzoat",
            ticari_isimler: ["Affirm 095 SG", "Proclaim 05 SG"],
            dozaj: "50 g / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "3 gün",
          },
        ],
        kulturel_onlemler: [
          "Feromon tuzakları ile izleme yapın",
          "Sera girişlerinde böcek tülü kullanın",
          "Bulaşık meyve ve yaprakları imha edin",
          "Ekim nöbeti uygulayın",
        ],
      },
    ],
  },

  // ===================== BİBER =====================
  {
    bitki_adi: "Biber",
    hastaliklar: [
      {
        hastalik_adi: "Külleme",
        etmen: "Leveillula taurica",
        belirtiler: [
          "Yaprak üstünde beyaz pudra tabakası",
          "Yaprakların sararıp dökülmesi",
          "Meyve gelişiminde gerileme",
        ],
        biyolojik_mucadele: [
          "Kükürt bazlı organik preparatlar",
          "Ampelomyces quisqualis",
        ],
        kimyasal_mucadele: [
          {
            aktif_madde: "Kükürt",
            ticari_isimler: ["Tiovit Jet", "Kumulus DF"],
            dozaj: "300-500 g / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "1 gün",
          },
          {
            aktif_madde: "Penkonazol",
            ticari_isimler: ["Topas 100 EC"],
            dozaj: "25 ml / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "7 gün",
          },
          {
            aktif_madde: "Azoksistrobin",
            ticari_isimler: ["Quadris", "Amistar"],
            dozaj: "75 ml / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "3 gün",
          },
        ],
        kulturel_onlemler: [
          "Havalandırmayı artırın",
          "Aşırı azotlu gübreleme yapmayın",
          "Dayanıklı çeşitler tercih edin",
        ],
      },
      {
        hastalik_adi: "Yaprak Leke Hastalığı",
        etmen: "Cercospora capsici",
        belirtiler: [
          "Yapraklarda yuvarlak kahverengi lekeler",
          "Lekelerin ortası açık renkli, kenarı koyu",
          "Ağır enfeksiyonda yaprak dökümü",
        ],
        biyolojik_mucadele: [
          "Bakır bazlı preparatlar (koruyucu)",
          "Trichoderma harzianum",
        ],
        kimyasal_mucadele: [
          {
            aktif_madde: "Mankozeb",
            ticari_isimler: ["Dithane M-45"],
            dozaj: "200 g / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "7 gün",
          },
          {
            aktif_madde: "Azoksistrobin + Difenokonazol",
            ticari_isimler: ["Amistar Top"],
            dozaj: "75 ml / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "7 gün",
          },
        ],
        kulturel_onlemler: [
          "Ekim nöbeti uygulayın",
          "Hastalıklı artıkları temizleyin",
          "Tohumları dezenfekte edin",
        ],
      },
      {
        hastalik_adi: "Biber Antraknozu",
        etmen: "Colletotrichum spp.",
        belirtiler: [
          "Meyvede çökük, daire şeklinde lekeler",
          "Lekelerin ortasında turuncu-pembe spor kütleleri",
          "Olgun meyvelerde daha yaygın",
        ],
        biyolojik_mucadele: [
          "Bacillus subtilis bazlı preparatlar",
          "Hastalıklı meyvelerin toplanması",
        ],
        kimyasal_mucadele: [
          {
            aktif_madde: "Azoksistrobin",
            ticari_isimler: ["Quadris"],
            dozaj: "75 ml / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "3 gün",
          },
          {
            aktif_madde: "Mankozeb",
            ticari_isimler: ["Dithane M-45", "Penncozeb"],
            dozaj: "200 g / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "7 gün",
          },
          {
            aktif_madde: "Prochloraz",
            ticari_isimler: ["Sportak 45 EW"],
            dozaj: "100 ml / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "7 gün",
          },
        ],
        kulturel_onlemler: [
          "Sağlıklı tohum kullanın",
          "Ekim nöbeti (3 yıl)",
          "Hasat sırasında meyvelere zarar vermeyin",
        ],
      },
      {
        hastalik_adi: "Yaprak Biti",
        etmen: "Myzus persicae / Aphis gossypii",
        belirtiler: [
          "Yaprak altında küme halinde yeşil/siyah bitler",
          "Yaprakların kıvrılması ve deformasyonu",
          "Yapışkan bal özü salgısı",
          "Virüs taşıyıcılığı",
        ],
        biyolojik_mucadele: [
          "Coccinella septempunctata (uğur böceği) salımı",
          "Chrysoperla carnea (yeşilgöz) salımı",
          "Aphidius colemani (parazitoid) salımı",
        ],
        kimyasal_mucadele: [
          {
            aktif_madde: "Asetamiprid",
            ticari_isimler: ["Mospilan 20 SP"],
            dozaj: "30 g / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "3 gün",
          },
          {
            aktif_madde: "Flonikamid",
            ticari_isimler: ["Teppeki 50 WG"],
            dozaj: "14 g / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "3 gün",
          },
          {
            aktif_madde: "Pirimikarb",
            ticari_isimler: ["Pirimor 50 WG"],
            dozaj: "50 g / 100 L su",
            uygulama_sekli: "Yaprak uygulaması (arılara daha az zararlı)",
            hasat_arasi_sure: "3 gün",
          },
        ],
        kulturel_onlemler: [
          "Yabancı otları temizleyin",
          "Sarı yapışkan tuzaklar kullanın",
          "Aşırı azotlu gübreleme yapmayın",
        ],
      },
    ],
  },

  // ===================== SALATALIK =====================
  {
    bitki_adi: "Salatalık",
    hastaliklar: [
      {
        hastalik_adi: "Mildiyö (Yalancı Külleme)",
        etmen: "Pseudoperonospora cubensis",
        belirtiler: [
          "Yaprak üstünde köşeli sarı lekeler (damar aralarında)",
          "Yaprak altında gri-mor küf tabakası",
          "Yaprakların kuruması",
        ],
        biyolojik_mucadele: [
          "Bakır bazlı preparatlar (koruyucu)",
          "Trichoderma uygulaması",
        ],
        kimyasal_mucadele: [
          {
            aktif_madde: "Metalaksil-M + Mankozeb",
            ticari_isimler: ["Ridomil Gold MZ 68 WG"],
            dozaj: "250 g / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "5 gün",
          },
          {
            aktif_madde: "Fosetil-Al",
            ticari_isimler: ["Aliette 80 WG"],
            dozaj: "200 g / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "3 gün",
          },
          {
            aktif_madde: "Dimetomorf + Mankozeb",
            ticari_isimler: ["Acrobat MZ"],
            dozaj: "200 g / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "7 gün",
          },
        ],
        kulturel_onlemler: [
          "Sera havalandırmasını sağlayın",
          "Damlama sulama kullanın",
          "Dayanıklı çeşit tercih edin",
          "Bitki sıklığını azaltın",
        ],
      },
      {
        hastalik_adi: "Külleme",
        etmen: "Podosphaera xanthii / Erysiphe cichoracearum",
        belirtiler: [
          "Yaprak üstünde beyaz pudra lekeler",
          "Gövde ve meyve saplarında da beyaz küf",
          "Yaprakların kuruması",
        ],
        biyolojik_mucadele: [
          "Kükürt bazlı preparatlar",
          "Potasyum bikarbonat spreyler",
        ],
        kimyasal_mucadele: [
          {
            aktif_madde: "Kükürt",
            ticari_isimler: ["Tiovit Jet"],
            dozaj: "300 g / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "1 gün",
          },
          {
            aktif_madde: "Penkonazol",
            ticari_isimler: ["Topas 100 EC"],
            dozaj: "25 ml / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "3 gün",
          },
          {
            aktif_madde: "Trifloksistrobin + Tebukonazol",
            ticari_isimler: ["Nativo 75 WG"],
            dozaj: "20 g / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "3 gün",
          },
        ],
        kulturel_onlemler: [
          "Dayanıklı çeşitler tercih edin",
          "Havalandırmayı artırın",
          "Alt yaprakları budayın",
        ],
      },
    ],
  },

  // ===================== PATLICAN =====================
  {
    bitki_adi: "Patlıcan",
    hastaliklar: [
      {
        hastalik_adi: "Solgunluk (Verticillium / Fusarium)",
        etmen: "Verticillium dahliae / Fusarium oxysporum",
        belirtiler: [
          "Yapraklarda tek taraflı sararma",
          "Bitki boyunca solgunluk",
          "İletim demetlerinde kahverengi renk değişimi",
          "Bitkinin bodurlaşması",
        ],
        biyolojik_mucadele: [
          "Trichoderma harzianum ile toprak uygulaması",
          "Toprak solarizasyonu",
          "Bacillus subtilis",
        ],
        kimyasal_mucadele: [
          {
            aktif_madde: "Tiofanat-metil",
            ticari_isimler: ["Topsin M 70 WP"],
            dozaj: "100 g / 100 L su",
            uygulama_sekli: "Toprak drench",
            hasat_arasi_sure: "14 gün",
          },
        ],
        kulturel_onlemler: [
          "Dayanıklı anaç üzerine aşılı fide kullanın",
          "Ekim nöbeti (en az 4-5 yıl)",
          "Toprak solarizasyonu yapın",
          "Toprak pH'ını 6.5-7 arasında tutun",
        ],
      },
      {
        hastalik_adi: "Patlıcan Kırmızı Örümceği",
        etmen: "Tetranychus urticae",
        belirtiler: [
          "Yaprak altında sarı-beyaz noktalar",
          "İnce ağ örgüsü",
          "Yaprak bronzlaşması",
        ],
        biyolojik_mucadele: [
          "Phytoseiulus persimilis salımı",
          "Amblyseius californicus salımı",
        ],
        kimyasal_mucadele: [
          {
            aktif_madde: "Abamektin",
            ticari_isimler: ["Vertimec 1.8 EC"],
            dozaj: "50 ml / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "3 gün",
          },
          {
            aktif_madde: "Spirodiklofen",
            ticari_isimler: ["Envidor 240 SC"],
            dozaj: "40 ml / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "3 gün",
          },
        ],
        kulturel_onlemler: [
          "Sera nemini artırın",
          "Tozlu ortamdan kaçının",
          "Bulaşık yaprakları temizleyin",
        ],
      },
    ],
  },

  // ===================== KABAK / KAVUN / KARPUZ =====================
  {
    bitki_adi: "Kabak / Kavun / Karpuz (Cucurbitler)",
    hastaliklar: [
      {
        hastalik_adi: "Külleme",
        etmen: "Podosphaera xanthii",
        belirtiler: [
          "Yaprak üst ve altında beyaz pudra tabakası",
          "Yaprakların kuruması",
          "Meyve gelişiminde gerileme",
        ],
        biyolojik_mucadele: [
          "Kükürt bazlı preparatlar",
          "Potasyum bikarbonat spreyler",
        ],
        kimyasal_mucadele: [
          {
            aktif_madde: "Kükürt",
            ticari_isimler: ["Tiovit Jet"],
            dozaj: "300-500 g / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "1 gün",
          },
          {
            aktif_madde: "Miklobutanil",
            ticari_isimler: ["Systhane 24 E"],
            dozaj: "30 ml / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "3 gün",
          },
          {
            aktif_madde: "Trifloksistrobin",
            ticari_isimler: ["Flint 50 WG"],
            dozaj: "15 g / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "3 gün",
          },
        ],
        kulturel_onlemler: [
          "Dayanıklı çeşit tercih edin",
          "Bitki aralığını geniş tutun",
          "Alt yaprakları budayın",
        ],
      },
      {
        hastalik_adi: "Fusarium Solgunluğu",
        etmen: "Fusarium oxysporum",
        belirtiler: [
          "Tek taraflı sararma ve solma",
          "Gövde tabanında kahverengi çizgi",
          "İletim demetlerinde kahverengi renk",
          "Bitkinin ölümü",
        ],
        biyolojik_mucadele: [
          "Trichoderma harzianum ile toprak uygulaması",
          "Toprak solarizasyonu",
          "Aşılı fide kullanımı (karpuz/kavun)",
        ],
        kimyasal_mucadele: [
          {
            aktif_madde: "Tiofanat-metil",
            ticari_isimler: ["Topsin M 70 WP"],
            dozaj: "100 g / 100 L su",
            uygulama_sekli: "Toprak drench (kök bölgesine)",
            hasat_arasi_sure: "14 gün",
          },
        ],
        kulturel_onlemler: [
          "Aşılı fide kullanın (kabak anacı)",
          "Ekim nöbeti (5+ yıl)",
          "Toprak solarizasyonu",
          "Toprak pH'ını 6.5-7 arasında tutun",
        ],
      },
    ],
  },

  // ===================== BUĞDAY =====================
  {
    bitki_adi: "Buğday",
    hastaliklar: [
      {
        hastalik_adi: "Pas Hastalığı (Sarı Pas / Kahverengi Pas)",
        etmen: "Puccinia striiformis (sarı pas) / Puccinia triticina (kahverengi pas)",
        belirtiler: [
          "Sarı pas: yapraklarda sarı şerit halinde pustüller",
          "Kahverengi pas: yapraklarda dağınık kahverengi pustüller",
          "Yaprak kuruması ve verim düşüşü",
        ],
        biyolojik_mucadele: [
          "Dayanıklı çeşit kullanımı (en etkili yöntem)",
        ],
        kimyasal_mucadele: [
          {
            aktif_madde: "Tebukonazol",
            ticari_isimler: ["Folicur 25 WG", "Orius 25 EW"],
            dozaj: "100 ml / da (dekar)",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "35 gün",
          },
          {
            aktif_madde: "Propikonazol",
            ticari_isimler: ["Tilt 250 EC", "Bumper 25 EC"],
            dozaj: "50 ml / da",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "35 gün",
          },
          {
            aktif_madde: "Epoksionazol + Tiofanat-metil",
            ticari_isimler: ["Yamato"],
            dozaj: "100 ml / da",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "35 gün",
          },
          {
            aktif_madde: "Triadimefon",
            ticari_isimler: ["Bayleton 25 WP"],
            dozaj: "50 g / da",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "35 gün",
          },
        ],
        kulturel_onlemler: [
          "Dayanıklı çeşit tercih edin",
          "Aşırı azotlu gübreleme yapmayın",
          "Erken ekim yapmayın",
          "Tarla kenarlarındaki yabancı otları temizleyin",
        ],
      },
      {
        hastalik_adi: "Süne",
        etmen: "Eurygaster integriceps",
        belirtiler: [
          "Başaklarda emgi izleri",
          "Tane üzerinde emgi noktaları",
          "Unun ekmeklik kalitesinin düşmesi",
          "Fide döneminde solma ve kuruma",
        ],
        biyolojik_mucadele: [
          "Yumurta parazitoitleri (Trissolcus spp.) salımı",
          "Doğal düşmanları koruma",
        ],
        kimyasal_mucadele: [
          {
            aktif_madde: "Lambda-sihalotrin",
            ticari_isimler: ["Karate 5 EC", "Lambda 5 EC"],
            dozaj: "20 ml / da",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "21 gün",
          },
          {
            aktif_madde: "Deltametrin",
            ticari_isimler: ["Decis 2.5 EC"],
            dozaj: "25 ml / da",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "14 gün",
          },
          {
            aktif_madde: "Alfa-sipermetrin",
            ticari_isimler: ["Fastac 100 EC"],
            dozaj: "10-15 ml / da",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "14 gün",
          },
        ],
        kulturel_onlemler: [
          "Kışlak alanlarını takip edin",
          "Erken hasat yapın",
          "Anız işleme yapın",
        ],
      },
      {
        hastalik_adi: "Septorya Yaprak Lekesi",
        etmen: "Septoria tritici (Zymoseptoria tritici)",
        belirtiler: [
          "Yapraklarda uzun kahverengi lekeler",
          "Lekelerin içinde siyah noktalar (piknidyumlar)",
          "Alt yapraklardan başlayıp üst yapraklara geçiş",
        ],
        biyolojik_mucadele: [
          "Dayanıklı çeşit kullanımı",
        ],
        kimyasal_mucadele: [
          {
            aktif_madde: "Protiokonazol + Tebukonazol",
            ticari_isimler: ["Prosaro 250 EC"],
            dozaj: "75-100 ml / da",
            uygulama_sekli: "Yaprak uygulaması (bayrak yaprağı döneminde)",
            hasat_arasi_sure: "35 gün",
          },
          {
            aktif_madde: "Azoksistrobin + Propikonazol",
            ticari_isimler: ["Quilt Xcel"],
            dozaj: "100 ml / da",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "35 gün",
          },
        ],
        kulturel_onlemler: [
          "Ekim nöbeti uygulayın",
          "Anız artıklarını temizleyin",
          "Aşırı sık ekim yapmayın",
        ],
      },
    ],
  },

  // ===================== MISIR =====================
  {
    bitki_adi: "Mısır",
    hastaliklar: [
      {
        hastalik_adi: "Mısır Kurdu (Koçan Kurdu)",
        etmen: "Ostrinia nubilalis / Sesamia nonagrioides",
        belirtiler: [
          "Gövdede delikler ve talaş benzeri artıklar",
          "Koçanda tünel izleri",
          "Gövdenin kırılması",
          "Verim kaybı",
        ],
        biyolojik_mucadele: [
          "Trichogramma spp. (yumurta parazitoidi) salımı",
          "Bacillus thuringiensis (Bt) uygulaması",
        ],
        kimyasal_mucadele: [
          {
            aktif_madde: "Klorantraniliprol",
            ticari_isimler: ["Coragen 20 SC"],
            dozaj: "15-20 ml / da",
            uygulama_sekli: "Yaprak uygulaması (yumurtadan çıkış döneminde)",
            hasat_arasi_sure: "7 gün",
          },
          {
            aktif_madde: "Lambda-sihalotrin",
            ticari_isimler: ["Karate 5 EC"],
            dozaj: "30 ml / da",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "14 gün",
          },
          {
            aktif_madde: "Emamektin benzoat",
            ticari_isimler: ["Affirm 095 SG"],
            dozaj: "40 g / da",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "7 gün",
          },
        ],
        kulturel_onlemler: [
          "Anız işleme yaparak kışlayan larvaları imha edin",
          "Erken çeşit tercih edin",
          "Feromon tuzakları ile ergin uçuş takibi",
        ],
      },
    ],
  },

  // ===================== ÜZÜM (BAĞ) =====================
  {
    bitki_adi: "Üzüm (Bağ)",
    hastaliklar: [
      {
        hastalik_adi: "Külleme",
        etmen: "Uncinula necator (Erysiphe necator)",
        belirtiler: [
          "Yaprak ve sürgünlerde gri-beyaz küf",
          "Tanelerin çatlaması",
          "Kokulu, küflü tat",
        ],
        biyolojik_mucadele: [
          "Kükürt bazlı preparatlar",
          "Ampelomyces quisqualis",
        ],
        kimyasal_mucadele: [
          {
            aktif_madde: "Kükürt",
            ticari_isimler: ["Tiovit Jet", "Kumulus DF"],
            dozaj: "400-600 g / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "1 gün",
          },
          {
            aktif_madde: "Penkonazol",
            ticari_isimler: ["Topas 100 EC"],
            dozaj: "25 ml / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "14 gün",
          },
          {
            aktif_madde: "Trifloksistrobin",
            ticari_isimler: ["Flint 50 WG"],
            dozaj: "15-20 g / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "14 gün",
          },
          {
            aktif_madde: "Spiroksamin",
            ticari_isimler: ["Prosper 300 EC"],
            dozaj: "80 ml / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "21 gün",
          },
        ],
        kulturel_onlemler: [
          "İyi havalandırma için budama yapın",
          "Yaprak sıklığını azaltın",
          "Dayanıklı çeşitler/anaçlar tercih edin",
        ],
      },
      {
        hastalik_adi: "Mildiyö",
        etmen: "Plasmopara viticola",
        belirtiler: [
          "Yaprak üstünde yağ lekesi gibi sarı lekeler",
          "Yaprak altında beyaz küf tabakası",
          "Salkımlarda kahverengi kuruma",
          "Erken yaprak dökümü",
        ],
        biyolojik_mucadele: [
          "Bakır bazlı preparatlar (Bordo bulamacı)",
        ],
        kimyasal_mucadele: [
          {
            aktif_madde: "Bakır sülfat + kireç (Bordo Bulamacı)",
            ticari_isimler: ["Bordo Bulamacı %1-2"],
            dozaj: "%1-2'lik karışım",
            uygulama_sekli: "Yaprak uygulaması (göz kabarması öncesi)",
            hasat_arasi_sure: "14 gün",
          },
          {
            aktif_madde: "Metalaksil-M + Mankozeb",
            ticari_isimler: ["Ridomil Gold MZ"],
            dozaj: "250 g / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "21 gün",
          },
          {
            aktif_madde: "Fosetil-Al",
            ticari_isimler: ["Aliette 80 WG"],
            dozaj: "200 g / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "21 gün",
          },
          {
            aktif_madde: "Famoksadon + Simoksanil",
            ticari_isimler: ["Equation Pro"],
            dozaj: "40 g / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "21 gün",
          },
        ],
        kulturel_onlemler: [
          "İyi havalandırma için budama",
          "Yağmur sonrası koruyucu ilaçlama",
          "Alt yaprakları temizleyin",
          "Drenaj sağlayın",
        ],
      },
      {
        hastalik_adi: "Salkım Güvesi",
        etmen: "Lobesia botrana",
        belirtiler: [
          "Çiçek ve tanelerde ağ örgüsü",
          "Tanelerin delinmesi ve çürümesi",
          "İkincil mantar enfeksiyonları (botrytis)",
        ],
        biyolojik_mucadele: [
          "Feromon tuzakları ile izleme",
          "Bacillus thuringiensis (Bt) uygulaması",
          "Feromon karıştırma (mating disruption) tekniği",
        ],
        kimyasal_mucadele: [
          {
            aktif_madde: "Spinosad",
            ticari_isimler: ["Laser 240 SC"],
            dozaj: "30-40 ml / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "7 gün",
          },
          {
            aktif_madde: "Indoksakarb",
            ticari_isimler: ["Avaunt 150 EC"],
            dozaj: "30 ml / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "14 gün",
          },
          {
            aktif_madde: "Klorantraniliprol",
            ticari_isimler: ["Coragen 20 SC"],
            dozaj: "20 ml / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "14 gün",
          },
        ],
        kulturel_onlemler: [
          "Feromon tuzakları ile popülasyon takibi",
          "Salkımlarda havalandırma sağlayın",
          "Bulaşık salkımları toplayın",
        ],
      },
    ],
  },

  // ===================== ZEYTİN =====================
  {
    bitki_adi: "Zeytin",
    hastaliklar: [
      {
        hastalik_adi: "Zeytin Sineği",
        etmen: "Bactrocera oleae",
        belirtiler: [
          "Meyvede yumurta bırakma izi (yarım ay şeklinde)",
          "Meyve içinde larva tünelleri",
          "Meyvenin erken dökülmesi",
          "Yağ kalitesinin düşmesi (asitlik artışı)",
        ],
        biyolojik_mucadele: [
          "Sarı yapışkan tuzaklar + feromon",
          "McPhail tuzakları",
          "Spinosad bazlı yem spreyler",
        ],
        kimyasal_mucadele: [
          {
            aktif_madde: "Dimethoate",
            ticari_isimler: ["Rogor 40 EC", "Danadim 40 EC"],
            dozaj: "100 ml / 100 L su",
            uygulama_sekli: "Yaprak uygulaması (tam alan veya çekici zehirli yem)",
            hasat_arasi_sure: "28 gün",
          },
          {
            aktif_madde: "Spinosad (yem sprey)",
            ticari_isimler: ["GF-120 Fruit Fly Bait"],
            dozaj: "1 L / ha (şerit uygulama)",
            uygulama_sekli: "Çekici zehirli yem olarak şerit uygulama",
            hasat_arasi_sure: "7 gün",
          },
          {
            aktif_madde: "Lambda-sihalotrin",
            ticari_isimler: ["Karate Zeon"],
            dozaj: "30 ml / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "14 gün",
          },
        ],
        kulturel_onlemler: [
          "Erken hasat yapın (%3 bulaşıklık eşiğinde)",
          "Dökülen meyveleri toplayın",
          "Tuzak ile popülasyon takibi yapın",
        ],
      },
      {
        hastalik_adi: "Halkalı Leke (Zeytin Gözlük Lekesi)",
        etmen: "Spilocaea oleaginea (Fusicladium oleagineum)",
        belirtiler: [
          "Yaprak üstünde koyu yeşil-kahverengi yuvarlak lekeler",
          "Lekelerin ortasında hale",
          "Yaprak dökümü",
          "Sürgün ve meyvelerde de leke",
        ],
        biyolojik_mucadele: [
          "Bakır bazlı preparatlar (koruyucu)",
        ],
        kimyasal_mucadele: [
          {
            aktif_madde: "Bakır oksiklorür",
            ticari_isimler: ["Cupravit 50 WP"],
            dozaj: "300-500 g / 100 L su",
            uygulama_sekli: "Yaprak uygulaması (sonbahar + ilkbahar)",
            hasat_arasi_sure: "14 gün",
          },
          {
            aktif_madde: "Bakır hidroksit",
            ticari_isimler: ["Kocide 2000", "Champion WP"],
            dozaj: "200-300 g / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "14 gün",
          },
        ],
        kulturel_onlemler: [
          "Budama ile havalandırma sağlayın",
          "Dökülen yaprakları temizleyin",
          "Dayanıklı çeşitler tercih edin",
        ],
      },
    ],
  },

  // ===================== ELMA =====================
  {
    bitki_adi: "Elma",
    hastaliklar: [
      {
        hastalik_adi: "Karaleke (Elma Kara Lekesi)",
        etmen: "Venturia inaequalis",
        belirtiler: [
          "Yapraklarda koyu yeşil-siyah kadifemsi lekeler",
          "Meyvelerde siyah kabuklu çatlak lekeler",
          "Yaprak dökümü",
          "Meyvelerin şekil bozukluğu",
        ],
        biyolojik_mucadele: [
          "Dökülen yaprakları toplayıp imha etme",
          "Üre ile yaprak çürümesini hızlandırma",
        ],
        kimyasal_mucadele: [
          {
            aktif_madde: "Kaptan",
            ticari_isimler: ["Captan 50 WP", "Merpan 80 WG"],
            dozaj: "200 g / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "14 gün",
          },
          {
            aktif_madde: "Ditianon",
            ticari_isimler: ["Delan 700 WG"],
            dozaj: "50 g / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "14 gün",
          },
          {
            aktif_madde: "Difenokonazol",
            ticari_isimler: ["Score 250 EC"],
            dozaj: "20 ml / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "14 gün",
          },
          {
            aktif_madde: "Trifloksistrobin + Kaptan",
            ticari_isimler: ["Flint Plus"],
            dozaj: "150 g / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "14 gün",
          },
          {
            aktif_madde: "Mankozeb",
            ticari_isimler: ["Dithane M-45"],
            dozaj: "200 g / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "14 gün",
          },
        ],
        kulturel_onlemler: [
          "Dökülen yaprakları sonbaharda temizleyin",
          "Dayanıklı çeşitler tercih edin",
          "Budama ile havalandırma sağlayın",
          "Mills tablosuna göre ilaçlama zamanlaması yapın",
        ],
      },
      {
        hastalik_adi: "Külleme",
        etmen: "Podosphaera leucotricha",
        belirtiler: [
          "Sürgün uçlarında beyaz-gri toz tabakası",
          "Yaprakların kıvrılması ve bodurlaşması",
          "Meyvelerde pas lekesi oluşumu",
        ],
        biyolojik_mucadele: [
          "Kükürt bazlı preparatlar",
          "Bulaşık sürgün uçlarını budama",
        ],
        kimyasal_mucadele: [
          {
            aktif_madde: "Kükürt",
            ticari_isimler: ["Tiovit Jet"],
            dozaj: "400 g / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "1 gün",
          },
          {
            aktif_madde: "Penkonazol",
            ticari_isimler: ["Topas 100 EC"],
            dozaj: "25 ml / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "14 gün",
          },
          {
            aktif_madde: "Bupirimat",
            ticari_isimler: ["Nimrod 25 EC"],
            dozaj: "40-60 ml / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "14 gün",
          },
        ],
        kulturel_onlemler: [
          "Kış budamasında bulaşık sürgünleri kesin",
          "Havalandırma için budama yapın",
          "Aşırı azotlu gübreleme yapmayın",
        ],
      },
      {
        hastalik_adi: "İç Kurdu (Elma İç Kurdu)",
        etmen: "Cydia pomonella",
        belirtiler: [
          "Meyve girişinde talaş benzeri artık",
          "Meyve içinde tünel ve larva",
          "Çekirdek evine kadar tünel",
          "Erken meyve dökümü",
        ],
        biyolojik_mucadele: [
          "Feromon tuzakları ile uçuş takibi",
          "Feromon karıştırma (mating disruption)",
          "Granulovirüs (CpGV) uygulaması",
          "Trichogramma salımı",
        ],
        kimyasal_mucadele: [
          {
            aktif_madde: "Klorantraniliprol",
            ticari_isimler: ["Coragen 20 SC"],
            dozaj: "17.5-20 ml / 100 L su",
            uygulama_sekli: "Yaprak uygulaması (yumurtadan çıkış döneminde)",
            hasat_arasi_sure: "14 gün",
          },
          {
            aktif_madde: "Emamektin benzoat",
            ticari_isimler: ["Affirm 095 SG"],
            dozaj: "200-250 g / ha",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "7 gün",
          },
          {
            aktif_madde: "Indoksakarb",
            ticari_isimler: ["Avaunt 150 EC"],
            dozaj: "30 ml / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "7 gün",
          },
        ],
        kulturel_onlemler: [
          "Feromon tuzakları ile izleme yapın",
          "Bulaşık meyveleri toplayın",
          "Gövde bandı ile larva yakalama",
        ],
      },
    ],
  },

  // ===================== ÇİLEK =====================
  {
    bitki_adi: "Çilek",
    hastaliklar: [
      {
        hastalik_adi: "Kurşuni Küf (Botrytis)",
        etmen: "Botrytis cinerea",
        belirtiler: [
          "Meyvelerde gri-kahverengi küf tabakası",
          "Yumuşama ve çürüme",
          "Çiçeklerin kahverengileşmesi",
          "Nemli havalarda hızlı yayılma",
        ],
        biyolojik_mucadele: [
          "Trichoderma harzianum uygulaması",
          "Bacillus subtilis bazlı preparatlar",
          "Hastalıklı meyvelerin toplanması",
        ],
        kimyasal_mucadele: [
          {
            aktif_madde: "Fenheksamid",
            ticari_isimler: ["Teldor 500 SC"],
            dozaj: "100 ml / 100 L su",
            uygulama_sekli: "Yaprak/çiçek uygulaması",
            hasat_arasi_sure: "1 gün",
          },
          {
            aktif_madde: "Boskalid + Piraklostrobin",
            ticari_isimler: ["Signum WG"],
            dozaj: "150 g / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "3 gün",
          },
          {
            aktif_madde: "Siprodinil + Fludiyoksanil",
            ticari_isimler: ["Switch 62.5 WG"],
            dozaj: "80-100 g / 100 L su",
            uygulama_sekli: "Yaprak/çiçek uygulaması",
            hasat_arasi_sure: "3 gün",
          },
        ],
        kulturel_onlemler: [
          "İyi havalandırma sağlayın",
          "Malç kullanın (meyve toprak temasını önleyin)",
          "Çürük meyveleri hemen toplayın",
          "Damlama sulama tercih edin",
        ],
      },
      {
        hastalik_adi: "Külleme",
        etmen: "Podosphaera aphanis",
        belirtiler: [
          "Yaprak altında beyaz küf",
          "Yaprak kenarlarının yukarı kıvrılması",
          "Meyvelerde beyaz pudra tabakası",
          "Meyvelerin sertleşmesi",
        ],
        biyolojik_mucadele: [
          "Kükürt bazlı preparatlar",
          "Potasyum bikarbonat",
        ],
        kimyasal_mucadele: [
          {
            aktif_madde: "Miklobutanil",
            ticari_isimler: ["Systhane 24 E"],
            dozaj: "30 ml / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "3 gün",
          },
          {
            aktif_madde: "Penkonazol",
            ticari_isimler: ["Topas 100 EC"],
            dozaj: "25 ml / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "3 gün",
          },
        ],
        kulturel_onlemler: [
          "Havalandırma sağlayın",
          "Bitki sıklığını azaltın",
          "Dayanıklı çeşit tercih edin",
        ],
      },
    ],
  },

  // ===================== PATATES =====================
  {
    bitki_adi: "Patates",
    hastaliklar: [
      {
        hastalik_adi: "Mildiyö (Geç Yanıklık)",
        etmen: "Phytophthora infestans",
        belirtiler: [
          "Yapraklarda su emmiş kahverengi lekeler",
          "Yaprak altında beyaz küf",
          "Yumrularda kahverengi çürüme",
          "Hızlı yayılma (nemli havada)",
        ],
        biyolojik_mucadele: [
          "Bakır bazlı preparatlar (koruyucu)",
        ],
        kimyasal_mucadele: [
          {
            aktif_madde: "Metalaksil-M + Mankozeb",
            ticari_isimler: ["Ridomil Gold MZ 68 WG"],
            dozaj: "250 g / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "14 gün",
          },
          {
            aktif_madde: "Mankozeb",
            ticari_isimler: ["Dithane M-45"],
            dozaj: "200 g / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "7 gün",
          },
          {
            aktif_madde: "Siyazofamid",
            ticari_isimler: ["Ranman 400 SC"],
            dozaj: "20 ml / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "7 gün",
          },
          {
            aktif_madde: "Propamokarb + Fenamidone",
            ticari_isimler: ["Consento 450 SC"],
            dozaj: "200 ml / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "7 gün",
          },
        ],
        kulturel_onlemler: [
          "Sertifikalı tohum yumru kullanın",
          "İyi drenaj sağlayın",
          "Yığma yaparak yumruları koruyun",
          "Bulaşık alanlarla ekim nöbeti yapın",
        ],
      },
      {
        hastalik_adi: "Patates Böceği (Kolorado Böceği)",
        etmen: "Leptinotarsa decemlineata",
        belirtiler: [
          "Yapraklarda çizgili böcekler (sarı-siyah)",
          "Turuncu yumurta kümeleri (yaprak altında)",
          "Yaprakların tamamen yenmesi",
          "Ciddi verim kaybı",
        ],
        biyolojik_mucadele: [
          "Bacillus thuringiensis tenebrionis (Btt) uygulaması",
          "El ile toplama (düşük popülasyonda)",
          "Doğal düşmanlar (Perillus bioculatus)",
        ],
        kimyasal_mucadele: [
          {
            aktif_madde: "Klorantraniliprol",
            ticari_isimler: ["Coragen 20 SC"],
            dozaj: "20 ml / da",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "7 gün",
          },
          {
            aktif_madde: "Spinosad",
            ticari_isimler: ["Laser 240 SC"],
            dozaj: "30-50 ml / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "7 gün",
          },
          {
            aktif_madde: "Asetamiprid",
            ticari_isimler: ["Mospilan 20 SP"],
            dozaj: "25 g / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "7 gün",
          },
        ],
        kulturel_onlemler: [
          "Ekim nöbeti uygulayın",
          "Düşük popülasyonda el ile toplama",
          "Ergin kışlaması için toprak işleme",
        ],
      },
    ],
  },

  // ===================== SERA SEBZELERİ GENEL =====================
  {
    bitki_adi: "Sera Sebzeleri (Genel)",
    hastaliklar: [
      {
        hastalik_adi: "Kök Çürüklüğü",
        etmen: "Pythium spp. / Rhizoctonia solani / Fusarium spp.",
        belirtiler: [
          "Fide boğazında su emmiş kahverengi çürüme",
          "Fide devrilmesi (çökerten)",
          "Kök bölgesinde kahverengi çürüme",
          "Bitki solgunluğu ve ölümü",
        ],
        biyolojik_mucadele: [
          "Trichoderma harzianum ile toprak uygulaması",
          "Bacillus subtilis",
          "Toprak solarizasyonu",
        ],
        kimyasal_mucadele: [
          {
            aktif_madde: "Metalaksil-M",
            ticari_isimler: ["Ridomil Gold SL"],
            dozaj: "25 ml / 10 L su (drench)",
            uygulama_sekli: "Toprak drench (fide kök bölgesine)",
            hasat_arasi_sure: "14 gün",
          },
          {
            aktif_madde: "Propamokarb",
            ticari_isimler: ["Previcur Energy"],
            dozaj: "150-250 ml / 100 L su",
            uygulama_sekli: "Toprak drench",
            hasat_arasi_sure: "7 gün",
          },
          {
            aktif_madde: "Tiofanat-metil",
            ticari_isimler: ["Topsin M 70 WP"],
            dozaj: "100 g / 100 L su",
            uygulama_sekli: "Toprak drench",
            hasat_arasi_sure: "14 gün",
          },
        ],
        kulturel_onlemler: [
          "Toprak solarizasyonu yapın",
          "İyi drenaj sağlayın",
          "Aşırı sulama yapmayın",
          "Fide yetiştirme toprağını dezenfekte edin",
          "Sağlıklı fide kullanın",
        ],
      },
      {
        hastalik_adi: "Trips",
        etmen: "Frankliniella occidentalis (Batı çiçek tripsi)",
        belirtiler: [
          "Yapraklarda gümüşi-beyaz lekeler",
          "Yaprak kenarlarında deformasyon",
          "Çiçeklerde renk bozulması",
          "Virüs taşıyıcılığı (TSWV)",
        ],
        biyolojik_mucadele: [
          "Amblyseius swirskii (yırtıcı akar) salımı",
          "Orius laevigatus (yırtıcı böcek) salımı",
          "Mavi yapışkan tuzaklar",
        ],
        kimyasal_mucadele: [
          {
            aktif_madde: "Spinosad",
            ticari_isimler: ["Laser 240 SC"],
            dozaj: "50 ml / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "3 gün",
          },
          {
            aktif_madde: "Abamektin",
            ticari_isimler: ["Vertimec 1.8 EC"],
            dozaj: "50 ml / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "3 gün",
          },
          {
            aktif_madde: "Formetanat",
            ticari_isimler: ["Dicarzol 50 SP"],
            dozaj: "100 g / 100 L su",
            uygulama_sekli: "Yaprak uygulaması",
            hasat_arasi_sure: "3 gün",
          },
        ],
        kulturel_onlemler: [
          "Mavi yapışkan tuzak kullanın",
          "Sera girişlerinde ince böcek tülü",
          "Yabancı otları temizleyin",
          "TSWV dayanıklı çeşitler tercih edin",
        ],
      },
    ],
  },
];

/**
 * Bitki adına göre hastalık ve ilaç bilgilerini getirir
 */
export function findDiseasesByPlant(plantName: string): CropDiseases | null {
  const normalizedInput = plantName.toLowerCase().trim();
  return (
    PESTICIDE_DATABASE.find((crop) => {
      const cropName = crop.bitki_adi.toLowerCase();
      return (
        cropName.includes(normalizedInput) ||
        normalizedInput.includes(cropName) ||
        // Özel eşleşmeler
        (normalizedInput.includes("kavun") && cropName.includes("cucurbit")) ||
        (normalizedInput.includes("karpuz") && cropName.includes("cucurbit")) ||
        (normalizedInput.includes("kabak") && cropName.includes("cucurbit")) ||
        (normalizedInput.includes("üzüm") && cropName.includes("üzüm")) ||
        (normalizedInput.includes("bağ") && cropName.includes("bağ")) ||
        (normalizedInput.includes("sera") && cropName.includes("sera"))
      );
    }) || null
  );
}

/**
 * Hastalık adına göre tüm bitkilerdeki eşleşmeleri getirir
 */
export function findDiseaseByName(diseaseName: string): Array<{
  bitki: string;
  hastalik: DiseaseInfo;
}> {
  const normalizedInput = diseaseName.toLowerCase().trim();
  const results: Array<{ bitki: string; hastalik: DiseaseInfo }> = [];

  for (const crop of PESTICIDE_DATABASE) {
    for (const disease of crop.hastaliklar) {
      if (
        disease.hastalik_adi.toLowerCase().includes(normalizedInput) ||
        disease.etmen.toLowerCase().includes(normalizedInput) ||
        normalizedInput.includes(disease.hastalik_adi.toLowerCase().split(" ")[0])
      ) {
        results.push({ bitki: crop.bitki_adi, hastalik: disease });
      }
    }
  }

  return results;
}

/**
 * Kullanıcı mesajındaki anahtar kelimelere göre ilgili veritabanı bilgilerini döner
 */
export function findRelevantPesticideData(userMessage: string): string {
  const normalizedMsg = userMessage.toLowerCase();

  // Bitki isimlerini tespit et
  const plantKeywords: Record<string, string[]> = {
    domates: ["domates", "tomato"],
    biber: ["biber", "pepper"],
    salatalık: ["salatalık", "hıyar"],
    patlıcan: ["patlıcan"],
    "kabak / kavun / karpuz": ["kabak", "kavun", "karpuz", "cucurbit"],
    buğday: ["buğday", "wheat"],
    mısır: ["mısır"],
    "üzüm": ["üzüm", "bağ", "asma"],
    zeytin: ["zeytin", "olive"],
    elma: ["elma", "apple"],
    çilek: ["çilek"],
    patates: ["patates", "potato"],
    sera: ["sera", "serada"],
  };

  // Hastalık anahtar kelimelerini tespit et
  const diseaseKeywords: Record<string, string[]> = {
    mildiyö: ["mildiyö", "mildew", "mildio"],
    külleme: ["külleme", "powdery"],
    pas: ["pas hastalığı", "pas ", " pas"],
    yaprak_lekesi: ["yaprak leke", "leke hastalığı", "septorya"],
    kurşuni_küf: ["botrytis", "kurşuni küf", "gri küf"],
    solgunluk: ["solgunluk", "fusarium", "verticillium"],
    kök_çürüklüğü: ["kök çürük", "pythium", "çökerten"],
    beyaz_sinek: ["beyaz sinek", "beyazsinek", "whitefly"],
    yaprak_biti: ["yaprak bit", "afit", "aphid"],
    kırmızı_örümcek: ["kırmızı örümcek", "akar", "spider mite"],
    trips: ["trips", "thrips"],
    tuta: ["tuta", "güve"],
    süne: ["süne"],
    zeytin_sineği: ["zeytin sineği", "zeytin sine"],
    iç_kurdu: ["iç kurd", "elma kurd", "cydia"],
    patates_böceği: ["kolorado", "patates böce"],
    galeri_sineği: ["galeri", "miner", "liriomyza"],
    antraknoz: ["antraknoz", "antracnose"],
    karaleke: ["karaleke", "kara leke", "venturia"],
  };

  const matchedPlants: string[] = [];
  const matchedDiseases: string[] = [];

  // Bitkileri bul
  for (const [, keywords] of Object.entries(plantKeywords)) {
    for (const keyword of keywords) {
      if (normalizedMsg.includes(keyword)) {
        matchedPlants.push(keyword);
        break;
      }
    }
  }

  // Hastalıkları bul
  for (const [, keywords] of Object.entries(diseaseKeywords)) {
    for (const keyword of keywords) {
      if (normalizedMsg.includes(keyword)) {
        matchedDiseases.push(keyword);
        break;
      }
    }
  }

  // İlgili verileri topla
  const relevantData: string[] = [];

  // Bitki bazlı eşleşme
  for (const plant of matchedPlants) {
    const cropData = findDiseasesByPlant(plant);
    if (cropData) {
      // Eğer hastalık da belirtilmişse sadece o hastalığı getir
      if (matchedDiseases.length > 0) {
        for (const disease of cropData.hastaliklar) {
          const diseaseLower = disease.hastalik_adi.toLowerCase();
          const etmenLower = disease.etmen.toLowerCase();
          for (const dKeyword of matchedDiseases) {
            if (diseaseLower.includes(dKeyword) || etmenLower.includes(dKeyword)) {
              relevantData.push(formatDiseaseData(cropData.bitki_adi, disease));
            }
          }
        }
      } else {
        // Tüm hastalıkları getir
        for (const disease of cropData.hastaliklar) {
          relevantData.push(formatDiseaseData(cropData.bitki_adi, disease));
        }
      }
    }
  }

  // Sadece hastalık belirtilmişse tüm bitkilerden getir
  if (matchedPlants.length === 0 && matchedDiseases.length > 0) {
    for (const dKeyword of matchedDiseases) {
      const results = findDiseaseByName(dKeyword);
      for (const result of results) {
        relevantData.push(formatDiseaseData(result.bitki, result.hastalik));
      }
    }
  }

  if (relevantData.length === 0) {
    return "";
  }

  return `\n\n📋 VERİTABANI BİLGİSİ (Aşağıdaki bilgiler T.C. Tarım ve Orman Bakanlığı ruhsatlı ilaç veritabanından alınmıştır. İlaç önerilerinde SADECE bu verileri kullan):\n\n${relevantData.join("\n\n---\n\n")}`;
}

function formatDiseaseData(plantName: string, disease: DiseaseInfo): string {
  let text = `🌱 Bitki: ${plantName}\n`;
  text += `🦠 Hastalık/Zararlı: ${disease.hastalik_adi}\n`;
  text += `📌 Etmen: ${disease.etmen}\n`;
  text += `\nBelirtiler:\n${disease.belirtiler.map((b) => `- ${b}`).join("\n")}\n`;
  text += `\nBiyolojik Mücadele:\n${disease.biyolojik_mucadele.map((b) => `- ${b}`).join("\n")}\n`;
  text += `\nRuhsatlı Kimyasal İlaçlar:\n`;
  for (const ilac of disease.kimyasal_mucadele) {
    text += `- Aktif Madde: ${ilac.aktif_madde}\n`;
    text += `  Ticari İsimler: ${ilac.ticari_isimler.join(", ")}\n`;
    text += `  Dozaj: ${ilac.dozaj}\n`;
    text += `  Uygulama: ${ilac.uygulama_sekli}\n`;
    text += `  Hasat Arası Süre: ${ilac.hasat_arasi_sure}\n`;
  }
  text += `\nKültürel Önlemler:\n${disease.kulturel_onlemler.map((k) => `- ${k}`).join("\n")}`;
  return text;
}
