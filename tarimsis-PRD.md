# TarımSis — Ürün Gereksinim Dokümanı (PRD)

> **Uygulama Adı:** TarımSis  
> **Platform:** iOS, Android, Web  
> **Model:** Freemium + Aylık/Yıllık Abonelik  
> **Hedef Kitle:** Türk çiftçiler, tarım işletmeleri, zirai bayiler

---

## 1. Genel Bakış

TarımSis; çiftçilerin arazilerini yönetmesini, gelir-giderlerini takip etmesini, yapay zeka destekli hastalık teşhisi yapmasını, forumda diğer çiftçilerle yardımlaşmasını ve zirai ürünler satın almasını sağlayan kapsamlı bir tarım yönetim platformudur.

---

## 2. Özellik Listesi

### 2.1 Arazi Yönetimi (Uydu Görüntülü)

- Kullanıcı harita üzerinde tarlasını çizerek işaretleyebilir (polygon seçimi)
- Uydu görüntüsü üzerinden arazi sınırları ve alan hesabı (dönüm/hektar)
- NDVI (Bitki Sağlığı İndeksi) katmanı — tarlada hangi bölge zayıf, hangi bölge sağlıklı
- Arazi rotasyon önerisi: AI, geçmiş ekim verilerine göre bu sezon ne ekilmesi gerektiğini önerir
- **Free plan:** Maksimum 1 arazi  
- **Premium plan:** Sınırsız arazi

---

### 2.2 Gelir & Gider Analizi

- Manuel gelir/gider girişi (kategori: tohum, ilaç, işçilik, yakıt, hasat geliri vb.)
- Arazi bazlı karlılık raporu
- Aylık ve yıllık özet grafikler
- Gider kategorisi dağılımı (pasta grafik)
- PDF/Excel olarak dışa aktarım
- **Free plan:** Yalnızca toplam bakiye görünümü  
- **Premium plan:** Detaylı raporlar ve dışa aktarım

---

### 2.3 Yapay Zeka Asistan & Hastalık Teşhisi

- Sohbet tabanlı AI tarım danışmanı (Claude API)
- Fotoğraf yükleyerek bitki hastalığı, zararlı veya besin eksikliği teşhisi
- Teşhis sonucunda tedavi önerisi ve ilaç tavsiyesi
- Toprak analizi fotoğrafı yükle → AI gübre önerisi ver
- **Free plan:**
  - Günlük 5 metin sorusu
  - Hesap boyunca 1 fotoğraflı teşhis hakkı
- **Premium plan:** Sınırsız metin ve fotoğraflı teşhis

---

### 2.4 Akıllı Hava Durumu

- Anlık ve 7 günlük hava tahmini (konum bazlı)
- Tarıma özel bildirimler:
  - "Bugün ilaç atmaya uygun" / "Rüzgar hızı yüksek, ilaç atma"
  - "Bu hafta don riski var, önlem al"
  - "Sulama gerekiyor — 5 gündür yağış yok"
  - "Hasat için ideal hava — önümüzdeki 3 gün kuru"
- Yağış miktarı ve nem takibi

---

### 2.5 Tarım Takvimi

- Takvim üzerinde işlem kayıt etme:
  - Ekim, ilaçlama, gübreleme, sulama, hasat, sürüm
- Arazi bazlı filtreleme
- Hatırlatıcı bildirimi: "Buğdaya 2. ilaçlama zamanı geldi"
- Geçmiş işlem geçmişi görüntüleme
- AI'dan takvim önerisi: "Bu arazi için Kasım'da kışlık buğday ekimini planla"

---

### 2.6 Stok & Depo Yönetimi

- Ambardaki ürün miktarı takibi (ton, kg, çuval)
- Zirai girdi stoğu: gübre, ilaç, tohum miktarları
- Stok azaldığında bildirim ("Herbisit stoğun kritik seviyede")
- Giren/çıkan stok hareketleri
- Depo bazlı takip (birden fazla depo tanımlanabilir)
- **Free plan:** 1 depo, sınırlı kayıt  
- **Premium plan:** Sınırsız depo ve kayıt

---

### 2.7 İşçi & İş Gücü Takibi

- İşçi kaydı (ad, günlük ücret, iletişim)
- Hangi gün, hangi tarlada, hangi işi yaptığını kayıt
- Günlük/haftalık/aylık işçilik maliyeti raporu
- Sezonluk işçi performans özeti
- Ödeme takibi (ödendi / ödenmedi)
- **Premium plan:** Tüm özellikler aktif

---

### 2.8 Zirai Market

- Ürün kategorileri: tohum, fide, gübre, zirai ilaç, ekipman aksesuarı
- Satıcı paneli: bayiler ve toptancılar kendi ürünlerini listeleyebilir
- TarımSis her satıştan komisyon alır (%5–%15 arası, kategoriye göre)
- Ürün sayfası: açıklama, fiyat, stok durumu, kullanıcı yorumları
- Sipariş takibi ve kargo entegrasyonu
- **Free plan:** Satın alma yapılabilir  
- **Premium plan:** Özel indirimler ve erken erişim kampanyaları

---

### 2.9 Çiftçi Forumu

- Kategori bazlı tartışma alanları: hastalıklar, hava durumu, fiyatlar, ekipman, genel
- Fotoğraf ve video paylaşımı
- Bölge bazlı filtreleme ("Konya'daki çiftçiler ne diyor?")
- Komşu çiftçi ağı: aynı bölgede bu hafta ne görüldü (anonim uyarılar)
- **Free plan:** Forumu okuyabilir, yazı yazamaz  
- **Premium plan:** Yazı yazar, yorum yapar, oy kullanır

---

### 2.10 Rozet & Gamification Sistemi

Foruma katkı sağlayan kullanıcılar rozet kazanır:

| Rozet | Kazanım Kriteri | Ayrıcalık |
|---|---|---|
| 🌱 Filiz | İlk 5 yorum | — |
| 🌾 Çiftçi | 25 beğenilen yorum | %5 abonelik indirimi |
| 🚜 Usta Çiftçi | 100 beğenilen yorum | %10 abonelik indirimi |
| 🏆 Tarım Ustası | En çok yardımcı olan (aylık) | %20 abonelik indirimi + özel profil çerçevesi |
| 🔬 Uzman | Teşhis onaylanan 10 fotoğraf paylaşımı | Özel AI teşhis paketi |

- Rozetler profilde görünür
- Aylık "En Yardımsever Çiftçi" sıralaması

---

## 3. Fiyatlandırma & Abonelik

| Özellik | Free | Aylık (49,99₺) | Yıllık (399,99₺) |
|---|---|---|---|
| Arazi sayısı | 1 | Sınırsız | Sınırsız |
| AI metin sorusu | 5/gün | Sınırsız | Sınırsız |
| Fotoğraflı teşhis | 1 (ömür boyu) | Sınırsız | Sınırsız |
| Gelir/gider raporu | Basit | Detaylı + export | Detaylı + export |
| Forum yazma | ❌ | ✅ | ✅ |
| Stok & depo | 1 depo | Sınırsız | Sınırsız |
| İşçi takibi | ❌ | ✅ | ✅ |
| Market indirimi | ❌ | Standart | Ekstra %5 |

> **Yıllık plan:** Aylık 49,99₺ × 12 = 599,88₺ yerine 399,99₺ — **%33 tasarruf**

---

## 4. Teknik Mimari & Teknoloji Stack

### Frontend
- **Mobile:** Flutter (iOS + Android tek kod tabanı)
- **Web:** React.js

### Backend
- **API:** Node.js + Express veya Django REST Framework
- **Veritabanı:** PostgreSQL (ilişkisel veri) + Redis (cache)
- **Dosya depolama:** AWS S3 veya Cloudflare R2 (fotoğraflar, belgeler)

### Yapay Zeka
- **Chatbot & teşhis:** Claude API (Anthropic)
- **Görüntü analizi:** Claude Vision API (fotoğraflı hastalık teşhisi)

### Harita & Uydu
- **Harita:** Mapbox veya Google Maps SDK
- **Uydu görüntüsü:** Sentinel Hub API (ücretsiz Copernicus verileri)
- **NDVI analizi:** Sentinel-2 bant hesabı

### Hava Durumu
- **API:** OpenWeatherMap veya Meteoblue (tarıma özel)

### Ödeme
- **Abonelik:** iyzico veya Stripe (Türkiye için iyzico önerilir)
- **Market ödemeleri:** iyzico Marketplace

### Bildirimler
- **Push notification:** Firebase Cloud Messaging (FCM)

---

## 5. Ekran & Sayfa Yapısı

```
TarımSis
├── Giriş / Kayıt
│   ├── Telefon veya e-posta ile kayıt
│   └── Google / Apple ile giriş
│
├── Ana Sayfa (Dashboard)
│   ├── Bugünün hava özeti
│   ├── Takvim hatırlatıcıları
│   ├── Stok uyarıları
│   └── AI günlük tarım tüyosu
│
├── Arazilerim
│   ├── Harita görünümü (uydu)
│   ├── Arazi detayı (NDVI, geçmiş, takvim)
│   └── Yeni arazi ekle
│
├── Finans
│   ├── Gelir/Gider girişi
│   ├── Raporlar
│   └── Arazi karlılığı
│
├── Stok & Depo
│   ├── Ürün & girdi stoğu
│   └── Stok hareketleri
│
├── İşçi Takibi
│   ├── İşçi listesi
│   ├── Günlük iş kaydı
│   └── Ücret raporu
│
├── AI Asistan
│   ├── Sohbet
│   └── Fotoğraflı teşhis
│
├── Hava Durumu
│   └── 7 günlük + tarım tavsiyeleri
│
├── Takvim
│   └── İşlem kayıtları & hatırlatıcılar
│
├── Market
│   ├── Ürün listeleme
│   ├── Satıcı paneli
│   └── Siparişlerim
│
├── Forum
│   ├── Kategoriler
│   ├── Bölgesel akış
│   └── Rozetlerim
│
└── Profil & Abonelik
    ├── Plan yükseltme
    ├── Rozet koleksiyonu
    └── Ayarlar
```

---

## 6. Gelir Modeli Özeti

| Kaynak | Açıklama |
|---|---|
| Aylık abonelik | 49,99₺/ay |
| Yıllık abonelik | 399,99₺/yıl |
| Market komisyonu | Her satıştan %5–%15 |
| Satıcı listeleme paketi | Bayilere öne çıkarma ücreti |
| Kurumsal lisans | Tarım kooperatifleri ve şirketlere toplu lisans |

---

## 7. Faz Planı (Öneri)

### Faz 1 — MVP (3–4 ay)
- Kullanıcı kaydı & giriş
- Arazi yönetimi (harita + uydu)
- Takvim
- Gelir/gider takibi
- Hava durumu
- AI asistan (temel sohbet)

### Faz 2 — Büyüme (2–3 ay)
- Fotoğraflı hastalık teşhisi
- Stok & depo yönetimi
- İşçi takibi
- Forum & rozet sistemi

### Faz 3 — Gelir (2–3 ay)
- Market & satıcı paneli
- Abonelik & ödeme sistemi
- NDVI & arazi rotasyon AI önerisi
- Bildirim sistemi (hava, stok, takvim)

---

*TarımSis PRD v1.0 — Tüm hakları saklıdır.*
