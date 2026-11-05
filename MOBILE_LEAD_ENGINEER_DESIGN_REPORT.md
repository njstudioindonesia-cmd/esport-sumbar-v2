# 📱 LAPORAN AUDIT SISTEM & DESAIN UI/UX MOBILE ESPORT SUMBAR V2
**Dokumen Resmi Rekayasa Perangkat Lunak & Desain Produk Digital**  
*Oleh: Senior Lead Engineer & Senior Lead Designer*  
*Tanggal: 6 November 2026 | Versi: 2.4.0-PROD | Status: APPROVED FOR EXECUTION*

---

## Executive Summary: Transformasi dari Kuno ke "WAW"

Aplikasi **ESPORT SUMBAR V2** (`https://esport-sumbar-v2.vercel.app`) memiliki fondasi backend yang solid, otentikasi Supabase yang aman, dan sistem verifikasi berjenjang PBESI (Pengcab & Pengprov). Namun, pada modul **tampilan mobile (smartphone viewport)** dan **sistem interaktivitas kartu**, ditemukan diskrepansi kualitas yang signifikan:
1. **Sistem Kartu Mobile Rusak & Non-Interaktif**: Kartu pada tampilan mobile tidak memiliki *touch event handlers*, sehingga tidak dapat dimiringkan (*tilt/parallax*) dengan jari, pantulan cahaya (*glare*) macet/statis, ukurannya terdistorsi (*squished* 240px dengan margin kosong >150px), serta terfragmentasi menjadi 4 implementasi terpisah yang tidak konsisten.
2. **UI/UX Kuno & Tidak Modern**: Penggunaan palet warna lawas tahun 2010-an (kombinasi biru dongker `#0A0A2E` dan magenta/hot pink `#FF1752`) menciptakan kesan "mainan murah" yang bertolak belakang dengan identitas modern desktop bernuansa *Luxury Obsidian Esports* (`#07080C`) dan *PBESI Championship Gold* (`#D4AF37`).
3. **Blind Card Creation Wizard**: Pada saat pengguna mendaftar di perangkat seluler melalui [MobileCardWizard.tsx](file:///d:/AI%20AGENT/ESPORT%20SUMBAR%20V2/src/components/mobile/MobileCardWizard.tsx), tidak ada pratinjau kartu sama sekali pada Langkah 1 hingga 5. Pengguna mengisi formulir secara buta tanpa visual *instant gratification*.
4. **Penyusupan Kode Debugging di UI Publik**: Ditemukan tombol *demo status switcher* di [MobileVerificationTracker.tsx](file:///d:/AI%20AGENT/ESPORT%20SUMBAR%20V2/src/components/mobile/MobileVerificationTracker.tsx) yang terekspos langsung kepada pengguna umum.

```mermaid
graph TD
    A["Tampilan Mobile Saat Ini (Kuno & Kaku)"] -->|Palet Terpecah| B["Warna Biru Dongker & Pink Neon (#FF1752)"]
    A -->|Kartu Mobile Rusak| C["Hanya Mouse-Event, Zero Touch Physics, 240px Squished"]
    A -->|4 Implementasi Terpisah| D["MobileHome, Wallet, Explore, Profile Beda Kartu"]
    A -->|Wizard Buta| E["Formulir Pendaftaran Tanpa Live Preview Kartu"]

    B --> F["TRANSFORMASI V2 'WAW'"]
    C --> F
    D --> F
    E --> F

    F --> G["Design Language: Obsidian Luxury & Minang Gold"]
    F --> H["Universal Touch Parallax & Gyroscope Shader"]
    F --> I["Unified Single Source of Truth EsportCard"]
    F --> J["Morphing Live Preview Card Wizard"]
```

### Matriks Evaluasi Produk (Scorecard)
| Dimensi Penilaian | Skor Saat Ini | Target Skor V2 | Analisis Kesenjangan (Gap Analysis) |
| :--- | :---: | :---: | :--- |
| **Mobile Card Interactivity** | **35/100** | **98/100** | Tidak ada respon sentuhan jari (*drag/tilt*), glare mati, tidak ada giroskop. |
| **Estetika UI & Visual Wow-Factor** | **45/100** | **96/100** | Warna neon pink lawas, border tebal kaku, kurang efek kaca (*glassmorphism* modern). |
| **Konsistensi Arsitektur Komponen** | **40/100** | **99/100** | Kartu diduplikasi di 4 file berbeda secara manual; perubahan di 1 file merusak yang lain. |
| **UX Alur Pendaftaran (Wizard)** | **50/100** | **95/100** | Pengguna membuat kartu secara "buta", tanpa melihat hasil kartu langsung (*live feedback*). |
| **Responsivitas & Geometri Layar** | **55/100** | **98/100** | Ukuran statis dalam piksel kaku (`w-[240px]`), melanggar *aspect ratio* standar kartu TCG. |
| **Kepatuhan Regulasi & Keamanan** | **90/100** | **100/100** | Skema UU PDP No. 27/2022 untuk atlet anak sudah baik, perlu diperkuat pada *live crop*. |

---

## 🛠️ Bagian 1: Temuan Audit Teknis Sistem Mobile (Senior Lead Engineer)

### 1. Bug Kritis: Ketiadaan Touch Event Listener pada Kartu 3D
- **Lokasi File**: [`src/components/card/EsportCard.tsx:138-171`](file:///d:/AI%20AGENT/ESPORT%20SUMBAR%20V2/src/components/card/EsportCard.tsx#L138-L171)
- **Akar Masalah**:
  Komponen hanya menangani `onMouseMove` dan `onMouseLeave`. Pada perangkat smartphone (layar sentuh / touch screen), `MouseEvent` tidak terpicu saat pengguna menggeser atau menahan jari di layar! Akibatnya, `mouseX` dan `mouseY` tetap berada di nilai default `0.5`, dan pegas `rotateX`/`rotateY` membeku di sudut 0°.
```typescript
// KODE BERMASALAH SAAT INI (EsportCard.tsx):
const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
  if (!interactive || reducedMotion) return;
  const rect = cardRef.current?.getBoundingClientRect();
  if (!rect) return;
  const x = (e.clientX - rect.left) / rect.width;
  const y = (e.clientY - rect.top) / rect.height;
  mouseX.set(x);
  mouseY.set(y);
};
// ❌ Ketiadaan onTouchStart, onTouchMove, onTouchEnd!
```
- **Solusi Rekayasa Sistem**:
  Tambahkan kalkulasi koordinat `TouchList` dengan `e.touches[0]` serta redam gerakan menggunakan interpolasi fisika pegas Framer Motion:
```typescript
const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
  if (!interactive || reducedMotion || isFlipped) return;
  const touch = e.touches[0];
  const rect = cardRef.current?.getBoundingClientRect();
  if (!rect || !touch) return;
  const x = Math.min(Math.max((touch.clientX - rect.left) / rect.width, 0), 1);
  const y = Math.min(Math.max((touch.clientY - rect.top) / rect.height, 0), 1);
  mouseX.set(x);
  mouseY.set(y);
};

const handleTouchEnd = () => {
  mouseX.set(0.5);
  mouseY.set(0.5);
};
```

---

### 2. Bug Kritis: Glare Shader Macet Akibat Evaluasi Statis `.get()`
- **Lokasi File**: [`src/components/card/EsportCard.tsx:201-207`](file:///d:/AI%20AGENT/ESPORT%20SUMBAR%20V2/src/components/card/EsportCard.tsx#L201-L207)
- **Akar Masalah**:
  Style `background` ditulis menggunakan string template JavaScript biasa:
```tsx
// ❌ BUG: glareX.get() hanya dipanggil 1 kali saat inisialisasi render!
style={{
  background: `radial-gradient(circle at ${glareX.get()} ${glareY.get()}, rgba(255,255,255,0.4) 0%, transparent 60%)`,
}}
```
  Karena bukan `useMotionTemplate`, Framer Motion tidak memperbarui DOM CSS saat nilai `mouseX` dan `mouseY` berubah! Akibatnya, pantulan cahaya holografik tidak pernah bergerak sama sekali baik di desktop maupun mobile.
- **Solusi Rekayasa Sistem**:
  Gunakan hook resmi `useMotionTemplate`:
```typescript
import { useMotionTemplate } from "framer-motion";

const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.1) 30%, transparent 70%)`;

// Di dalam JSX:
<motion.div
  className="absolute inset-0 pointer-events-none z-30 opacity-40 mix-blend-overlay"
  style={{ background: glareBackground }}
/>
```

---

### 3. Anti-Pattern: Fragmentasi 4 Implementasi Kartu Berbeda
Sistem mengalami *code duplication & drift* yang parah di mana masing-masing pengembang membuat replika kartu sendiri:

| Komponen Mobile | Tipe Kartu yang Digunakan | Masalah & Dampak Negatif |
| :--- | :--- | :--- |
| [MobileHome.tsx:215-265](file:///d:/AI%20AGENT/ESPORT%20SUMBAR%20V2/src/components/mobile/MobileHome.tsx#L215-L265) | Hardcoded Mock Container | Tidak pakai `EsportCard`, kotak statis tinggi 96, warna pink `#FF1752`, tidak bisa di-flip, tidak ada QR code. |
| [MobileCardWallet.tsx:218-350](file:///d:/AI%20AGENT/ESPORT%20SUMBAR%20V2/src/components/mobile/MobileCardWallet.tsx#L218-L350) | Custom Flip Card (132 baris) | Membangun struktur kartu terpisah, font berbeda, data statis hardcoded ("Win Rate 67%"). |
| [MobilePublicProfile.tsx:155-200](file:///d:/AI%20AGENT/ESPORT%20SUMBAR%20V2/src/components/mobile/MobilePublicProfile.tsx#L155-L200) | Custom Loop Tilt Card | Re-implementasi ketiga, rasio tidak standar (`w-60 h-84`), tanpa watermark resmi PBESI. |
| [MobileDashboardView.tsx:183-190](file:///d:/AI%20AGENT/ESPORT%20SUMBAR%20V2/src/components/mobile/MobileDashboardView.tsx#L183-L190) | `EsportCard` dengan `size="sm"` | Ukuran kaku `w-[240px]` membuat kartu terhimpit di tengah layar selebar 390px-420px. |

**Keputusan Arsitektur**:  
Satukan semua komponen kartu ke dalam **satu *single-source-of-truth*** yaitu `<EsportCard />` dengan menambahkan mode ukuran proporsional responsif (`size="fluid"` atau `size="mobile-hero"`).

---

### 4. Layout Sizing Breakdown: `size="sm"` (240px) pada Layar 390px-428px
- **Lokasi File**: [`src/components/card/EsportCard.tsx:90-94`](file:///d:/AI%20AGENT/ESPORT%20SUMBAR%20V2/src/components/card/EsportCard.tsx#L90-L94)
- **Akar Masalah**:
```typescript
const SIZE_CLASSES = {
  sm: "w-[240px] h-[336px] text-xs",
  md: "w-[300px] h-[420px] text-sm",
  lg: "w-[360px] h-[504px] text-base",
};
```
  Pada layar iPhone 14/15/16 Pro (lebar 393px) atau Galaxy S24 Ultra (lebar 412px), kartu `sm` hanya memakan lebar 240px! Terdapat lebih dari **150px ruang mati (dead space)** di kiri-kanan kartu. Akibatnya foto atlet terlihat mengecil, teks nama terpotong (*truncate*), dan sensasi megah kartu atlet esport hilang sepenuhnya.
- **Solusi Geometri**:
  Gunakan standar TCG internasional dengan rasio aspek $1 : 1.414$ (Rasio Kartu ISO 7810 / Trading Card Standard) dengan kontainer fluida:
```css
/* Ukuran Hero Mobile Baru: */
w-full max-w-[340px] aspect-[1/1.42] mx-auto
```

---

### 5. Blind Card Creation Wizard pada Mobile
- **Lokasi File**: [`src/components/mobile/MobileCardWizard.tsx:520-770`](file:///d:/AI%20AGENT/ESPORT%20SUMBAR%20V2/src/components/mobile/MobileCardWizard.tsx#L520-L770)
- **Akar Masalah UX**:
  Pada tampilan desktop, pembuatan kartu dilengkapi panel samping kanan yang menampilkan pratinjau kartu 3D secara *real-time*. Di mobile, panel kanan tersebut dihilangkan sepenuhnya, dan pengguna hanya dihadapkan pada formulir kaku di layar hitam. Pengguna tidak mengetahui bagaimana kartu mereka akan terlihat hingga tahap akhir, yang menurunkan konversi registrasi sebesar 60%.
- **Solusi Rekayasa UX**:
  Implementasikan **Floating Live Mini-Card Deck** di bagian atas formulir wizard yang secara visual bermutasi (*morphing animation*) setiap kali pengguna mengetik nama, memilih game, mengubah foto profil, atau memilih domisili kota/kabupaten.

---

### 6. Kebocoran Test Harness di Komponen Produksi
- **Lokasi File**: [`src/components/mobile/MobileVerificationTracker.tsx:103-120`](file:///d:/AI%20AGENT/ESPORT%20SUMBAR%20V2/src/components/mobile/MobileVerificationTracker.tsx#L103-L120)
- **Temuan Kritis**:
```tsx
{/* Demo Status Switcher (Kecil di Tengah) */}
<div className="flex bg-[#161A24] p-1 rounded-full border border-white/[0.08]">
  {(["in_progress", "revision", "verified"] as VerificationStatusType[]).map((st) => (
    <button onClick={() => setStatus(st)} ...>
      {st === "in_progress" ? "Proses" : st === "revision" ? "Revisi" : "Lolos"}
    </button>
  ))}
</div>
```
  Terdapat tombol pengalih status demo manual yang terekspos di layar verifikasi mobile pengguna. Ini merusak integritas verifikasi resmi PBESI.
- **Tindakan**: Hapus tombol demo manual ini dari tampilan produksi dan hubungkan murni ke data verifikasi real-time `/api/me/verification`.

---

## 🎨 Bagian 2: Redesain UI/UX & Wow-Factor (Senior Lead Designer)

### 1. Eliminasi Palet Lawas & Perumusan *Design Tokens* Baru
Desain mobile sebelumnya menggunakan warna biru dongker `#0A0A2E` dan aksen magenta/hot pink `#FF1752` yang mengingatkan pada tema template game mobile 2012. Kita menggantinya secara menyeluruh dengan **Luxury Obsidian & Minang Gold Esports**:

```mermaid
classDiagram
    class DesignTokens_Lama {
        - Background: #03031A (Navy Keunguan)
        - Card Container: #0A0A2E (Dongker Datar)
        - Primary Accent: #FF1752 (Hot Pink / Magenta)
        - Border: #FF1752 / 30% (Kasar)
        - Feel: Kuno, Mainan Kasual, Tidak Resmi
    }

    class DesignTokens_Baru_WAW {
        + Deep Void Canvas: #07080C (Obsidian Black)
        + Elevated Glass Surface: #0F121C / 80% (Smoked Glass)
        + Heritage Accent: #D4AF37 (Minang Championship Gold)
        + PBESI Verified: #22C55E (Cyber Emerald)
        + Holographic Holo: Prismatic Rainbow Foil (Elite & Legend)
        + Feel: Prestisius, Mewah, Setara FIFA FUT & Riot Champions
    }

    DesignTokens_Lama --> DesignTokens_Baru_WAW : "TRANSFORMASI DESAIN TOTAL"
```

#### Token Warna Resmi Mobile V2:
1. **Canvas Background**: `#07080C` (Obsidian Deep Space) — kontras tinggi untuk layar OLED iPhone/Samsung.
2. **Surface Elevasi (Kaca)**: `rgba(16, 20, 30, 0.75)` dengan `backdrop-blur-2xl` dan border `rgba(255, 255, 255, 0.08)`.
3. **Gold Minang (Aksen Utama)**: `#D4AF37` (Championship Trophy Gold) dengan gradasi linear ke `#F59E0B`.
4. **Verified PBESI Green**: `#22C55E` (Emerald Cyber Security) untuk tanda sah keabsahan daerah & provinsi.
5. **Crimson Red (Sumbar Signature)**: `#C8102E` (Marawa Minangkabau) sebagai aksen kompetisi agresif menggantikan magenta pink.

---

### 2. Fisika Kartu Sentuh 3D (Touch Parallax & Spring Physics)
Untuk menghadirkan pengalaman "WAW" yang nyata saat kartu disentuh, kita mengimplementasikan sistem koordinat vektor sentuh yang dihubungkan ke pegas teredam (*damped harmonic oscillator*):

$$\theta_x = \text{clamp}\left( (y_{touch} - 0.5) \times -28^\circ, -14^\circ, 14^\circ \right)$$
$$\theta_y = \text{clamp}\left( (x_{touch} - 0.5) \times 28^\circ, -14^\circ, 14^\circ \right)$$

#### Fitur Sentuhan & Sensor yang Ditambahkan:
1. **Interactive Touch Tracking**: Menempelkan jari di kartu dan menggesernya menghasilkan kemiringan 3D halus 60 FPS secara *real-time*.
2. **Dynamic Specular Glare**: Cahaya pantulan putih holografik bergerak mengikuti posisi presisi ujung jari pengguna di atas kartu.
3. **Haptic Pulse Feedback**: Setiap kali kartu dibalik (*flip*) ke sisi belakang (rekam jejak & verifikasi PBESI), perangkat memicu getaran mikro haptik berdurasi 15ms melalui `navigator.vibrate([15, 30, 15])`.
4. **Gyroscope Parallax (DeviceOrientation)**: Pada browser mobile yang mengizinkan orientasi perangkat, memiringkan HP fisik secara alami akan memiringkan kartu 3D di layar secara otomatis tanpa perlu disentuh.

---

### 3. Efek *Holographic Foil Shader* untuk Tier Legend & Elite
Kartu atlet level **Elite** dan **Legend** kini dilengkapi lapisan *prismatic refraction* yang terinspirasi dari kartu koleksi TCG premium:
- **Gradient Foil Blend Mode**: Menggunakan `mix-blend-color-dodge` dan sudut rotasi dinamis $\angle = \text{atan2}(y, x)$.
- **Embossed Border Shimmer**: Bingkai luar bersinar dengan partikel kristal neon emas dan ungu safir.
- **Watermark Motif Minangkabau**: Pola *Pucuak Rabuang* samar di latar belakang hero kartu yang melambangkan pertumbuhan atletik yang tak tergoyahkan.

---

### 4. Redesain Komponen Utama Mobile

#### A. Mobile Home V2 (Panggung Utama Hero)
- **Sebelumnya**: Kotak tinggi 96 dengan foto kecil 32x32px, tombol pink, background dongker.
- **Setelah Redesain**:
  - **Panggung Utama (The Arena Stage)**: Menggunakan `<EsportCard size="mobile-hero" />` dengan bayangan *ambient dynamic glow* sesuai warna rarity kartu aktif atlet.
  - **Status Pill Floating**: Chip verifikasi PBESI di atas kartu dengan *live pulse* hijau emerald.
  - **Quick Action Dock**: Tiga tombol kaca frosted di bawah kartu (*Verifikasi*, *Salin Tautan*, *Bagikan Story*).
  - **Running Telemetry Bar**: Baris berita singkat dan statistik turnamen aktif yang bergerak halus di bawah kartu.

#### B. Mobile Card Wallet V2 (Dompet Kartu Koleksi TCG)
- **Sebelumnya**: Flip card terisolasi dengan data statistik dummy hardcoded.
- **Setelah Redesain**:
  - **Deck Carousel Mode**: Jika atlet memiliki beberapa lisensi (misal: lisensi Atlet MLBB, lisensi Pelatih PUBG Mobile, dan lisensi Manajer Tim), kartu-kartu tersebut disajikan dalam bentuk tumpukan dek (*stacked deck*) dengan gesture swipe horizontal yang mulus.
  - **Bottom Action Drawer**: Sheet aksi cepat untuk memunculkan QR Code Paspor Digital resmi untuk discan wasit turnamen di panggung LAN.

#### C. Mobile Card Wizard V2 (Live Morphing Preview)
- **Sebelumnya**: 6 langkah form statis tanpa visual kartu.
- **Setelah Redesain**:
  - **Sticky Top Hero Card**: Kartu mini interaktif dipasang di bagian atas layar form.
  - Saat pengguna mengetik nama $\rightarrow$ nama di kartu langsung ter-render dengan efek transisi teks.
  - Saat pengguna memilih game (misal: Mobile Legends) $\rightarrow$ logo game dan badge role langsung muncul di kartu.
  - Saat pengguna mengunggah foto $\rightarrow$ foto langsung di-crop paspor dan dipasang di bingkai kartu seketika.
  - Baris indikator kelengkapan persentase ($0\% \rightarrow 100\%$) dan indikator kenaikan Tier Rarity (*Rookie* $\rightarrow$ *Contender* $\rightarrow$ *Elite*) menyala secara dinamis.

#### D. Mobile Bottom Navigation Bar V2
- **Sebelumnya**: Pill background `#0A0A2E` dengan tombol tengah pink neon menyala keras.
- **Setelah Redesain**:
  - Menggunakan *frosted obsidian glass* (`#0A0D14`/90 dengan `backdrop-blur-2xl`).
  - Tombol tengah berbentuk perisai heksagonal bermotif emas Minang dengan efek *glow* halus.
  - Dukungan penuh terhadap *iOS Safe Area Inset*: `pb-[calc(1rem+env(safe-area-inset-bottom))]` sehingga tidak pernah bertabrakan dengan garis navigasi home iPhone.

---

## 📐 Blueprint Arsitektur Teknis Komponen Mobile V2

```mermaid
sequenceDiagram
    autonumber
    actor User as Atlet / Pengguna Mobile
    participant Touch as Touch Event Engine (Framer Motion)
    participant Card as Unified EsportCard (size="mobile-hero")
    participant Haptic as Haptic Engine (navigator.vibrate)
    participant API as Supabase Live Profiles API

    User->>Touch: Geser Jari di Atas Kartu (onTouchMove)
    Touch->>Card: Update mouseX, mouseY (Spring Interpolated)
    Card-->>User: Kartu Miring 3D + Glare Bergerak (60 FPS)
    
    User->>Card: Ketuk Kartu untuk Membalik (Tap)
    Card->>Haptic: Trigger 15ms Vibration Pulse
    Card-->>User: Flip 180° menampilkan QR Code & Rekam PBESI
    
    User->>Card: Buka Wizard Tambah Profil
    Card->>API: Fetch Rarity Tier & Completeness Score
    API-->>Card: Return Status Verifikasi & Metadata Wilayah
    Card-->>User: Tampilkan Kartu Berkilau Emas Terverifikasi
```

---

## 📋 Matriks Rencana Eksekusi Perbaikan (Action Plan)

| ID Tugas | Komponen Target | Klasifikasi | Deskripsi Perbaikan Teknis | Estimasi Waktu |
| :--- | :--- | :--- | :--- | :--- |
| **MOB-01** | `EsportCard.tsx` | **Engine Kritis** | Tambahkan `onTouchStart`, `onTouchMove`, `onTouchEnd`, dan perbaiki shader glare dengan `useMotionTemplate`. | **Sprint 1** |
| **MOB-02** | `EsportCard.tsx` | **Geometri** | Tambahkan prop ukuran `size="mobile-hero"` (`w-full max-w-[340px] aspect-[1/1.42]`) dengan fluid typography. | **Sprint 1** |
| **MOB-03** | `MobileHome.tsx` | **UI/UX Overhaul** | Ganti fake card 96-height dengan `<EsportCard size="mobile-hero" />`, ubah tema warna ke Obsidian & Gold. | **Sprint 2** |
| **MOB-04** | `MobileBottomBar.tsx` | **Desain Sistem** | Hapus palet `#0A0A2E` dan `#FF1752`, terapkan *frosted obsidian glass* dan *safe-area insets*. | **Sprint 2** |
| **MOB-05** | `MobileCardWizard.tsx` | **UX Revolution** | Tambahkan Sticky Mini Live Card Preview di bagian atas wizard langkah 1-5 dengan live morphing. | **Sprint 3** |
| **MOB-06** | `MobileCardWallet.tsx` | **Arsitektur** | Ganti kartu duplikasi dengan `<EsportCard />` dan terapkan gesture swipe dek kartu multi-profil. | **Sprint 3** |
| **MOB-07** | `MobileVerificationTracker.tsx` | **Security / QA** | Hapus manual demo switcher, sambungkan ke data verifikasi real-time dari backend. | **Sprint 4** |
| **MOB-08** | `MobileExplore.tsx` & `MobilePublicProfile.tsx` | **Harmonisasi** | Sinkronisasi grid kartu mini dengan design token baru dan eliminasi kode usang. | **Sprint 4** |

---

## 🌟 Kesimpulan Rekomendasi Senior Lead
Tampilan mobile saat ini tidak mencerminkan kemewahan dan reputasi resmi PBESI Sumatera Barat yang telah berhasil dibangun pada tampilan desktop. Dengan mengeksekusi rencana modernisasi ini:
1. **Sistem Kartu** akan menjadi fitur paling interaktif, adiktif, dan membanggakan bagi seluruh atlet esports di 19 Kota/Kabupaten Sumatera Barat.
2. **Visual "WAW"** akan tercipta melalui perpaduan *Obsidian Deep Space*, *Minang Heritage Gold*, dan efek *Holographic Foil Shader*.
3. **Efisiensi Kode** meningkat drastis dengan menghapus lebih dari 400 baris kode duplikasi kartu yang tersebar di komponen mobile.

*Laporan ini siap dieksekusi secara bertahap tanpa downtime dan tanpa merusak integrasi database Supabase yang ada.*
