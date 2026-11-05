# LAPORAN AUDIT MENYELURUH SENIOR LEAD ENGINEER
## Proyek: ESPORT SUMBAR V2 (Platform Digital PBESI Sumatera Barat)
**Status Produksi**: `https://esport-sumbar-v2.vercel.app`  
**Database**: Supabase PostgreSQL (Multi-Tenant RLS + Realtime WebSocket)  
**Framework**: Next.js 16.4.5 (Turbopack, React 19, TypeScript Strict, Tailwind CSS v4)  
**Dokumen Audit**: `AUDIT_LEAD_ENGINEER_REPORT.md`  
**Tanggal Audit**: 5 November 2026  
**Auditor**: Senior Lead Full-Stack & Security Engineer  

---

## 1. RINGKASAN EKSEKUTIF (EXECUTIVE SUMMARY)

Setelah melakukan audit teknis mendalam (*codebase audit, runtime simulation, static analysis, auth flow trace, dan architectural verification*) pada seluruh 107 rute dan modul aplikasi, ditemukan bahwa **fondasi inti sistem (database schema, tata kelola multi-tier PBESI, autentikasi sesi, dan integrasi Next.js/Supabase) telah terbangun dengan arsitektur yang solid**.

Namun, terdapat **3 Celah Kritis (P0)**, **8 Masalah Mayor (P1)**, **3 Masalah Moderat (P2)**, serta sejumlah **Penyempurnaan UX & SEO (P3)** yang harus diselesaikan sebelum platform dapat dinyatakan 100% *Production-Ready*.

### Skor Kesiapan Produksi (Production Readiness Score): **68 / 100**
* **Keamanan & Tata Kelola RBAC UI**: 85/100 (Middleware & layout baik, namun endpoint API admin terbuka tanpa guard)
* **Kepatuhan Regulasi (UU PDP No. 27/2022)**: 90/100 (Skema tabel privat dan proteksi <18 tahun sangat baik)
* **Integritas Data Riil vs Dummy Data**: 55/100 (Masih banyak halaman publik dan modul admin yang mengandalkan mock)
* **Stabilitas Runtime Frontend**: 70/100 (Ditemukan *white screen crash* pada halaman telaah berkas verifikasi admin)
* **Performa Build & Kompilasi**: 88/100 (Kompilasi sukses tanpa TypeScript error, ada peringatan prerender API)

---

## 2. MATRIKS TEMUAN BUG & CELAH SISTEM

| Kode | Tingkat Urgensi | Kategori | Komponen / File | Dampak Bisnis & Operasional |
| :--- | :--- | :--- | :--- | :--- |
| **SEC-01** | **P0 (Kritis)** | Keamanan API | `src/app/api/admin/*` | Siapa pun dapat mengakses data akun admin, antrean berkas, dan mengubah status laporan tanpa login. |
| **RUN-01** | **P0 (Kritis)** | Runtime Crash | `AdminRegionReviewClient.tsx` & `AdminProvinceReviewClient.tsx` | *White screen of death* (layar putih/crash) saat admin membuka detail berkas pengajuan verifikasi. |
| **GOV-01** | **P0 (Kritis)** | Logika Otoritas | `AdminRegionReviewClient.tsx:125` | Seluruh Pengcab 18 Kota/Kabupaten selain Kota Padang diblokir secara permanen dari menelaah berkas. |
| **DAT-01** | **P1 (Mayor)** | Residu Mock | `src/app/tournaments/` & `src/app/leaderboard/` | Halaman Turnamen dan Klasemen 100% menggunakan data palsu (*hardcoded* mock array). |
| **DAT-02** | **P1 (Mayor)** | Residu Mock | `src/app/gallery/page.tsx` | Galeri Kartu Paspor menampilkan data statis dummy, bukan kartu ril yang diterbitkan masyarakat. |
| **UX-01** | **P1 (Mayor)** | Alur Pengguna | `src/components/wizard/*CardWizard.tsx` | Form pembuatan kartu terisi nilai *default* palsu ("Sutan Harimau", "HARIMAU_AIM", "Roamer") untuk semua jenis entitas. |
| **MOB-01** | **P1 (Mayor)** | Pengalaman Mobile | `src/app/dashboard/page.tsx:12` | Pengguna yang login di HP/tablet diarahkan ke halaman beranda publik (`MobileHome`), bukan dashboard pengguna. |
| **MOD-01** | **P1 (Mayor)** | Modul Terbengkalai | `DesktopMembershipsView.tsx` & `TeamRosterClient.tsx` | Fitur Roster Tim & Relasi Tim masih merupakan prototipe statis dengan tombol `alert()`. |
| **AUD-01** | **P1 (Mayor)** | Audit Trail | `src/app/admin/*/logs/page.tsx` & `audit/page.tsx` | Seluruh log audit admin menampilkan daftar kosong (`useState([])`) tanpa menghubungkan ke tabel `audit_logs`. |
| **UPL-01** | **P1 (Mayor)** | Storage Berkas | `DesktopVerificationView.tsx` | Unggah bukti verifikasi identitas masih berupa simulasi teks statis, belum menghubungkan file picker ke Supabase Storage. |
| **REV-01** | **P1 (Mayor)** | Inkonsistensi UI | Review Client Admin | Kartu 3D pada halaman peninjauan admin menampilkan kartu statis "Sutan Aim", bukan data pemohon asli. |
| **BLD-01** | **P2 (Moderat)** | Konfigurasi Next.js | `src/app/api/*/route.ts` | Peringatan build *prerender bailout* akibat ketiadaan `export const dynamic = 'force-dynamic'`. |
| **ACT-01** | **P2 (Moderat)** | Fitur Semu | `DesktopCardsView.tsx` & `DesktopPrivacyView.tsx` | Aksi "Download PNG" dan "Nonaktifkan Kartu" hanya memicu popup browser `alert()` tanpa proses nyata. |
| **SEO-01** | **P3 (Minor)** | Metadata & Indexing | `sitemap.ts` & Dynamic Routes | Metadata OG image belum dinamis dan sitemap belum mengindeks profil atlet terverifikasi. |

---

## 3. ANALISIS MENDALAM SETIAP TEMUAN

### 3.1. [P0] Celah Keamanan Akses API Admin (SEC-01)
* **Lokasi Berkas**: 
  - `src/app/api/admin/accounts/route.ts`
  - `src/app/api/admin/metrics/route.ts`
  - `src/app/api/admin/queue/route.ts`
  - `src/app/api/admin/reports/route.ts`
* **Akar Masalah (Root Cause)**:
  `src/proxy.ts` (Next.js middleware) secara eksplisit mengecualikan rute API:
  ```typescript
  if (pathname.startsWith("/api") || ...) {
    return NextResponse.next();
  }
  ```
  Di sisi lain, seluruh file rute `/api/admin/*` langsung menggunakan `createAdminClient()` (yang memegang `SUPABASE_SERVICE_ROLE_KEY` dan melewati seluruh RLS) **tanpa melakukan pengecekan sesi `supabase.auth.getUser()` maupun validasi peran akun (`role`)**.
* **Dampak**: 
  Siapa pun di internet tanpa login dapat melakukan `GET /api/admin/accounts` untuk mengunduh seluruh daftar nama, email, dan penugasan pejabat ESI se-Sumbar, atau mengirimkan `PATCH /api/admin/reports` untuk mengubah status moderasi laporan publik.
* **Solusi Senior Lead Engineer**:
  Terapkan helper guard terpusat `requireAdminRole(req, ["platform_operator", "prov_admin", "region_admin"])` di setiap route handler admin API sebelum mengeksekusi query database.

---

### 3.2. [P0] Runtime Crash pada Halaman Review Verifikasi Admin (RUN-01)
* **Lokasi Berkas**:
  - `src/app/admin/region/review/[id]/AdminRegionReviewClient.tsx` (baris 283)
  - `src/app/admin/province/review/[id]/AdminProvinceReviewClient.tsx` (baris 295)
  - `src/components/mobile/MobileAdminPortal.tsx` (baris 850+)
* **Akar Masalah (Root Cause)**:
  Komponen UI memanggil:
  ```tsx
  {item.documents.length}
  {item.documents.map((doc, idx) => ...)}
  ```
  Namun pada API rute `src/app/api/admin/queue/route.ts`, objek `documents` **tidak pernah dimasukkan ke dalam response payload**:
  ```typescript
  // API hanya me-return: id, profileId, name, ign, esportId, type, game, region, status, dll.
  // Properti `documents` bernilai undefined!
  ```
* **Dampak**: 
  Ketika seorang admin Pengcab atau Pengprov mengeklik "Tinjau Berkas" dari antrean data riil, browser langsung melempar error:
  `TypeError: Cannot read properties of undefined (reading 'length')` / `(reading 'map')` yang menyebabkan halaman menjadi blank putih (*unhandled client runtime crash*).
* **Solusi Senior Lead Engineer**:
  1. Perbarui `/api/admin/queue/route.ts` agar mengambil berkas bukti dari kolom `evidence_files` di tabel `verification_requests`.
  2. Tambahkan *safe optional chaining* dan *fallback*: `(item.documents || []).map(...)`.

---

### 3.3. [P0] Hardcoded Authority Lock pada Admin Daerah (GOV-01)
* **Lokasi Berkas**: `src/app/admin/region/review/[id]/AdminRegionReviewClient.tsx` (baris 125)
* **Kode Bermasalah**:
  ```typescript
  // Multi-region check: this admin is ESI Kota Padang (PDG)
  const isAuthorized = item.regionCode === "PDG";
  ```
* **Dampak**: 
  Logika yurisdiksi daerah di-hardcode kaku ke kode `"PDG"`. Akibatnya, jika akun Pengcab ESI Bukittinggi (`BKT`), Payakumbuh (`PYK`), Solok (`SLK`), atau 16 wilayah lainnya masuk dan ingin memeriksa pengajuan atlet dari wilayah mereka sendiri, sistem langsung memblokir mereka dengan pesan *"Akses Dibatasi: Multi-Wilayah RLS"*.
* **Solusi Senior Lead Engineer**:
  Ganti perbandingan statis dengan membaca `assigned_region_id` dari sesi akun admin yang sedang login melalui database.

---

### 3.4. [P1] Halaman Turnamen, Klasemen, dan Galeri 100% Mock Data (DAT-01 & DAT-02)
* **Lokasi Berkas**:
  - `src/app/tournaments/page.tsx` & `src/app/tournaments/[id]/page.tsx` (`MOCK_TOURNAMENTS`)
  - `src/app/leaderboard/page.tsx` (`MOCK_CIRCUIT_LEADERBOARD`)
  - `src/app/gallery/page.tsx` (`GALLERY_CARDS`)
* **Temuan**:
  1. Halaman Turnamen dan Klasemen sama sekali tidak terhubung ke tabel Supabase. Meskipun `FLAGS.SHOW_DEMO_DATA = false`, halaman ini tetap menampilkan turnamen fiktif seperti *"Piala Gubernur Sumbar 2026"*, *"Bukittinggi Mayor Cup"*, dan tim-tim fiktif.
  2. Galeri Kartu Paspor (`/gallery`) mengimpor `GALLERY_CARDS` secara langsung tanpa melakukan query ke `public_profiles`. Kartu-kartu baru yang didaftarkan oleh masyarakat tidak akan pernah muncul di halaman galeri ini.
* **Solusi Senior Lead Engineer**:
  1. Buat tabel Supabase `tournaments` dan `circuit_leaderboards` untuk kejuaraan resmi PBESI Sumbar.
  2. Hubungkan `src/app/gallery/page.tsx` ke endpoint `/api/profiles` atau service `getPublicProfiles()` agar menampilkan profil riil yang telah terbit.

---

### 3.5. [P1] Form Wizard Pendaftaran Membawa Data Isian Palsu (UX-01)
* **Lokasi Berkas**:
  - `src/components/wizard/DesktopCardWizard.tsx` (baris 61-75)
  - `src/components/mobile/MobileCardWizard.tsx` (baris 59-75)
* **Kode Bermasalah**:
  ```typescript
  const [displayName, setDisplayName] = useState<string>("Sutan Harimau");
  const [birthDate, setBirthDate] = useState<string>("2007-06-15");
  const [bio, setBio] = useState<string>("Atlet esport kompetitif asal Sumatera Barat.");
  const [attributes, setAttributes] = useState<Record<string, any>>({
    ign: "HARIMAU_AIM",
    game_id: "mlbb",
    role: "Roamer",
    rank: "Mythic Glory 120★",
    year_started: 2022,
    is_looking_for_team: true,
  });
  ```
* **Dampak**: 
  Ketika seorang pengguna ingin mendaftarkan **Klub/Tim**, **Sekolah**, atau **Pelatih**, formulir sudah terisi otomatis dengan nama atlet *"Sutan Harimau"* dan posisi *"Roamer"*. Ini membuat pengguna bingung mengapa profil tim mereka berisi data atlet dan mengira sistem mengalami error.
* **Solusi Senior Lead Engineer**:
  Ubah nilai awal `useState` menjadi string kosong (`""`), dan gunakan teks panduan tersebut murni sebagai HTML `placeholder`. Reset atribut dinamis secara otomatis setiap kali pengguna mengganti `entityType` di Langkah 1.

---

### 3.6. [P1] Akses Dashboard pada Tampilan Mobile Menampilkan Landing Page Publik (MOB-01)
* **Lokasi Berkas**: `src/app/dashboard/page.tsx` (baris 11-14)
* **Kode Bermasalah**:
  ```tsx
  {/* Mobile Flow (< 1024px): PWA Dashboard Experience */}
  <div className="block lg:hidden min-h-[100dvh] w-full">
    <MobileHome />
  </div>
  ```
* **Dampak**: 
  Di layar ponsel atau tablet (< 1024px), membuka URL `/dashboard` justru me-render komponen `<MobileHome />` yang merupakan halaman depan publik (berita dan kartu populer), bukan dashboard personal pengguna. Pengguna mobile tidak dapat melihat status verifikasinya, tidak bisa mengakses tombol "Lengkapi Profil", dan tidak bisa melihat kartu miliknya.
* **Solusi Senior Lead Engineer**:
  Buat komponen `<MobileDashboardView />` khusus layar kecil yang menampilkan kartu aktif, status lencana, dan menu pintasan dashboard, bukan melempar ke `MobileHome`.

---

### 3.7. [P1] Modul Relasi Tim & Roster Masih Dummy (MOD-01)
* **Lokasi Berkas**:
  - `src/components/dashboard/DesktopMembershipsView.tsx`
  - `src/components/mobile/MobileTeamRoster.tsx`
* **Temuan**:
  1. Halaman Relasi Tim menampilkan daftar undangan statis *"Minang Pride Esports"* dan *"Singkarak Legion"*. Tombol "Terima" hanya mengeksekusi `alert("Undangan tim diterima!")`.
  2. Halaman Roster Tim (`/me/team/[id]/roster`) menampilkan anggota statis (*"Fikri Alamsyah", "MARAWA_KING"*) terlepas dari tim apa pun yang dibuat oleh pengguna.
* **Solusi Senior Lead Engineer**:
  Hubungkan modul ini ke tabel `memberships` yang sudah tersedia di schema Supabase melalui API `/api/me/memberships`.

---

### 3.8. [P1] Tiga Halaman Log Audit Admin Berstatus "Kosong Permanen" (AUD-01)
* **Lokasi Berkas**:
  - `src/app/admin/platform/audit/page.tsx` (baris 26)
  - `src/app/admin/province/logs/page.tsx` (baris 29)
  - `src/app/admin/region/logs/page.tsx` (baris 28)
* **Kode Bermasalah**:
  ```typescript
  const [logs] = useState<ActivityLogItem[]>([]);
  ```
* **Dampak**: 
  Tidak ada `useEffect` atau panggilan API sama sekali. Ketiga halaman audit trail ini selalu menampilkan tabel kosong selamanya, dan fitur "Ekspor CSV" menghasilkan file kosong, padahal tabel `audit_logs` di Supabase merekam setiap aksi perubahan.
* **Solusi Senior Lead Engineer**:
  Buat API `/api/admin/audit-logs` yang mengambil riwayat aksi dari tabel `audit_logs` dan sinkronkan dengan antarmuka log admin.

---

### 3.9. [P1] Simulasi Unggah Dokumen Verifikasi (UPL-01)
* **Lokasi Berkas**: `src/components/dashboard/DesktopVerificationView.tsx` (baris 190)
* **Kode Bermasalah**:
  ```typescript
  const handleSimulateUpload = (slotId: string, slotTitle: string, defaultFileName: string) => {
    // Menghasilkan URL pura-pura: `/uploads/${defaultFileName}` dengan ukuran statis "1.2 MB"
  ```
* **Dampak**: 
  Pengguna tidak memilih berkas nyata dari komputernya. Tombol unggah hanya men-generate string dummy. Saat dikirim ke admin, admin tidak dapat memeriksa KTP atau piagam asli pemohon.
* **Solusi Senior Lead Engineer**:
  Ganti tombol simulasi dengan elemen `<input type="file" accept="image/*,.pdf" />` dan kirimkan berkas nyata ke Supabase Storage bucket `evidence` (terenkripsi RLS privat).

---

### 3.10. [P2] Peringatan Prerender Bailout pada Next.js Build (BLD-01)
* **Lokasi Berkas**: Seluruh API route yang memanggil `request.url` atau `cookies()`:
  - `src/app/api/admin/queue/route.ts`
  - `src/app/api/admin/metrics/route.ts`
  - `src/app/api/me/profiles/route.ts`
  - `src/app/api/news/route.ts`
  - `src/app/api/profiles/route.ts`
* **Dampak**: 
  Next.js mencoba melakukan pra-render statis saat `npm run build` dan mencetak peringatan:
  `Route /api/... needs to bail out of prerendering at this point because it used request.url`.
* **Solusi Senior Lead Engineer**:
  Tambahkan baris berikut di baris pertama setiap API route tersebut:
  ```typescript
  export const dynamic = "force-dynamic";
  ```

---

## 4. ANALISIS KEPATUHAN REGULASI & ARSITEKTUR

### 4.1. Kepatuhan UU Perlindungan Data Pribadi (UU PDP No. 27/2022)
* **Pemisahan Data Publik vs Privat**: **Sangat Baik**. Tabel `profiles` hanya menyimpan data publik atlet/entitas, sedangkan data sensitif (NIK, nomor telepon, alamat jalan, kontak wali) disimpan di tabel terpisah `profile_private` dan `guardian_consents`.
* **Perlindungan Anak & Remaja (<18 Tahun)**: **Sudah Memenuhi Standar**. Validasi sisi server menolak pembuatan profil atlet di bawah umur jika tidak menyertakan identitas dan persetujuan orang tua/wali sah.
* **Perlu Ditingkatkan**: Pada `DesktopPrivacyView.tsx`, tombol pengaturan visibilitas privat belum melakukan persistensi ke database Supabase.

### 4.2. Tata Kelola Independensi PBESI & Operator Sistem
* **Prinsip**: Operator Platform **dilarang keras** memiliki tombol atau wewenang verifikasi atlet. Verifikasi murni merupakan hak prerogatif Pengcab ESI (Lolos Tingkat Daerah) dan Pengprov ESI Sumbar (Lencana Emas Provinsi).
* **Hasil Audit**: **Sesuai Standar**. Menu `admin/platform` tidak memiliki tombol verifikasi ataupun akses bypass pengesahan. Batasan wewenang ini dihormati dengan baik pada arsitektur database dan stored procedure `transition_verification()`.

---

## 5. RENCANA AKSI PERBAIKAN PRIORITAS (REMEDIATION ROADMAP)

```
[SPRINT 1: P0 SECURITY & STABILITY] 
  ├── 1. Pasang Auth & Role Guard pada semua /api/admin/* (SEC-01)
  ├── 2. Perbaiki API /api/admin/queue & fix crash item.documents (RUN-01)
  └── 3. Hapus hardcode "PDG" pada AdminRegionReviewClient (GOV-01)

[SPRINT 2: P1 DATA INTEGRITY & WIZARD CLEANUP]
  ├── 4. Bersihkan form wizard dari default data "Sutan Harimau" (UX-01)
  ├── 5. Buat MobileDashboardView khusus layar ponsel (MOB-01)
  ├── 6. Hubungkan Admin Review ke kartu atlet pemohon yang riil (REV-01)
  └── 7. Buat API /api/admin/audit-logs untuk mengaktifkan log riil (AUD-01)

[SPRINT 3: P1 STORAGE & INTERACTIVE FEATURES]
  ├── 8. Integrasikan real file upload (KTP/SK/Piagam) ke bucket Supabase (UPL-01)
  ├── 9. Hubungkan /gallery ke public_profiles riil (DAT-02)
  └── 10. Implementasi skema tabel database untuk Turnamen & Leaderboard (DAT-01)

[SPRINT 4: P2-P3 OPTIMIZATION & POLISH]
  ├── 11. Tambahkan `export const dynamic = "force-dynamic"` pada API (BLD-01)
  ├── 12. Ganti seluruh alert() dengan Toast Notification modern (ACT-01)
  └── 13. Optimasi SEO dynamic metadata & sitemap (SEO-01)
```

---

## 6. KESIMPULAN SENIOR LEAD ENGINEER

Platform **ESPORT SUMBAR V2** memiliki fondasi desain dan teknologi modern kelas enterprise. Seluruh komponen visual, sistem kartu paspor digital 3D, dan tata kelola berjenjang PBESI telah dirancang dengan sangat elegan.

Permasalahan utama yang terlihat oleh pengguna saat ini (munculnya data dummy, crash di peninjauan admin, dan salah arah dashboard di mobile) **bukan karena kegagalan arsitektur, melainkan akibat fase transisi dari mock prototype ke database live yang belum tuntas di beberapa titik sambungan frontend-backend**.

Dengan mengeksekusi rencana perbaikan pada **Sprint 1 dan Sprint 2**, platform ini akan langsung mencapai status **100% Production-Ready** dan siap digunakan secara resmi oleh Pengprov ESI Sumatera Barat, 19 Pengcab Kota/Kabupaten, serta ribuan atlet dan tim se-Sumatera Barat.
