# INVENTARIS HALAMAN DAN RUTE ESPORT SUMBAR V3

> Dokumen Bagian 1.1: Pemetaan Lengkap Rute, Peran Akses, Templat, State, Komponen, dan Status Redesain.  
> Terintegrasi dengan `docs/MANIFEST_RUTE_V3.json` dan hasil crawl Bagian 0.

---

## 1. Halaman Publik & Direktori

| Rute | Peran Akses | Templat Visual | State Wajib | Komponen Utama Digunakan | Status Redesain | Catatan Khusus (ESI / Klaim / Duplikasi / Bug) |
|---|:---:|---|---|---|:---:|---|
| `/` | Tamu / Publik | Hero 3D Card Stage + Stats Counter + 5-Step Flow + Ecosystem Preview + Warta + Featured Cards + CTA | Memuat, Kosong, Sukses | `HomePageClient`, `BrandLogo`, `BrandPattern`, `BrandSlash`, `Navbar`, `Footer` | ⏳ BELUM | Terdapat 12 kemunculan ESI/klaim resmi di kode; tautan mati `/partners` ke halaman mitra non-eksisten; perlu hero liquid glass 2026. |
| `/explore` | Tamu / Publik | Glass Filter Bar + Dynamic Search + Responsive Card Grid (7 Entitas) | Memuat, Kosong, Error, Sukses | `DesktopExplore` / `MobileExplore`, `EsportCard` | ⏳ BELUM | Masih terpisah antara `DesktopExplore` dan `MobileExplore`; filter game harus dinamis dari API BFF; teks "Verified ESI" harus diubah ke "Terverifikasi". |
| `/players` | Tamu / Publik | Direktori Spesifik Entitas Atlet + Filter Role/Tier/Game | Memuat, Kosong, Error, Sukses | `DesktopExplore`, `EsportCard`, `GlassBadge` | ⏳ BELUM | Metadata masih memuat kata kunci ESI; shared-element transition ke profil pemain. |
| `/coaches` | Tamu / Publik | Direktori Spesifik Pelatih + Filter Lisensi & Cabang Game | Memuat, Kosong, Error, Sukses | `DesktopExplore`, `EsportCard` | ⏳ BELUM | Deskripsi di `apps/web/src/app/coaches/page.tsx:10` memuat: *"juru taktik binaan ESI"* (Pelanggaran S1). Wajib dihapus! |
| `/teams` | Tamu / Publik | Direktori Klub & Tim Esport + Filter Divisi Game | Memuat, Kosong, Error, Sukses | `DesktopExplore`, `EsportCard` | ⏳ BELUM | Selaraskan filter divisi game dengan dynamic catalog; bersihkan teks ESI. |
| `/communities` | Tamu / Publik | Direktori Komunitas Esport + Filter Wilayah Geografi | Memuat, Kosong, Error, Sukses | `DesktopExplore`, `EsportCard` | ⏳ BELUM | Filter wilayah hanya menggunakan 19 wilayah geografi murni tanpa sebutan Pengcab. |
| `/venues` | Tamu / Publik | Direktori Arena, iCafe & Bootcamp Station | Memuat, Kosong, Error, Sukses | `DesktopExplore`, `EsportCard` | ⏳ BELUM | Registry data memuat klaim *"terakreditasi ESI"* (Pelanggaran S1). Ganti dengan *"Fasilitas arena esport terdaftar"*. |
| `/campuses` | Tamu / Publik | Direktori Perguruan Tinggi & UKM Esport | Memuat, Kosong, Error, Sukses | `DesktopExplore`, `EsportCard` | ⏳ BELUM | Proteksi data mahasiswa; tampilkan daftar UKM aktif. |
| `/schools` | Tamu / Publik | Direktori Sekolah & Klub Ekstrakurikuler Pelajar | Memuat, Kosong, Error, Sukses | `DesktopExplore`, `EsportCard` | ⏳ BELUM | Proteksi data privasi atlet pelajar (UU PDP): hanya tampilkan agregasi jumlah siswa tanpa data sensitif anak. |
| `/player/[slug]` | Tamu / Publik | Stage Kaca + Kartu TCG Player 3D + Tab Ekosistem + Riwayat Turnamen | Memuat, Kosong, Error, Sukses, Layanan Turun | `PublicProfileView`, `EsportCard`, `ProfileEcosystemSection` | ⏳ BELUM | Ditemukan teks *"Belum diverifikasi resmi ESI"* dan *"Lencana Emas resmi ESI-SB-2026-0124"* (Pelanggaran Kritis S1/N3). Wajib diganti modul copy. |
| `/coach/[slug]` | Tamu / Publik | Stage Kaca + Kartu TCG Coach + Sertifikasi Mandiri + Riwayat Tim | Memuat, Kosong, Error, Sukses | `PublicProfileView`, `EsportCard` | ⏳ BELUM | Kartu pelatih di `EsportCard.tsx:637` merender *"Belum tersertifikasi resmi ESI"* (Pelanggaran S1). Ganti ke status netral. |
| `/team/[slug]` | Tamu / Publik | Stage Kaca + Kartu TCG Tim + Roster Pemain + Divisi Game | Memuat, Kosong, Error, Sukses | `PublicProfileView`, `EsportCard`, `RosterList` | ⏳ BELUM | Tampilkan anggota roster aktif yang telah disetujui via outbox relation rules. |
| `/community/[slug]` | Tamu / Publik | Stage Kaca + Kartu TCG Komunitas + Hubungan Ekosistem | Memuat, Kosong, Error, Sukses | `PublicProfileView`, `EsportCard` | ⏳ BELUM | Komunitas mandiri, tanpa klaim subordinasi kelembagaan. |
| `/venue/[slug]` | Tamu / Publik | Stage Kaca + Kartu TCG Venue + Fasilitas + Peta Lokasi | Memuat, Kosong, Error, Sukses | `PublicProfileView`, `EsportCard` | ⏳ BELUM | Tampilkan spesifikasi rig, koneksi, dan koordinat geografi. |
| `/campus/[slug]` | Tamu / Publik | Stage Kaca + Kartu TCG Kampus + Daftar UKM & Divisi Game | Memuat, Kosong, Error, Sukses | `PublicProfileView`, `EsportCard` | ⏳ BELUM | Informasi institusi dan pembina UKM. |
| `/school/[slug]` | Tamu / Publik | Stage Kaca + Kartu TCG Sekolah + Agregasi Anggota Ekskul | Memuat, Kosong, Error, Sukses | `PublicProfileView`, `EsportCard` | ⏳ BELUM | Proteksi data privat atlet pelajar: nama dan kontak wali strictly hidden dari publik. |
| `/regions` | Tamu / Publik | Bento Grid 19 Wilayah Geografi Sumatera Barat | Memuat, Kosong, Sukses | `RegionBentoGrid`, `BrandPattern` | ⏳ BELUM | Geografi murni (Kota Padang, Bukittinggi, dll.) tanpa atribut kepengurusan organisasi lain. |
| `/regions/[slug]` | Tamu / Publik | Profil Geografi Wilayah + Distribusi Entitas Terdaftar | Memuat, Kosong, Error, Sukses | `RegionDetailView`, `EsportCard` | ⏳ BELUM | `regions/[slug]/page.tsx:130` memuat komentar/label *"KARTU PENGURUS ESI"* (Pelanggaran S1). Wajib dibersihkan. |
| `/ecosystem` | Tamu / Publik | Peta Interaktif Ekosistem 7 Entitas & Hubungan Antar-Bidang | Memuat, Kosong, Sukses | `EcosystemGraphPreview`, `GlassCard` | ⏳ BELUM | Menjelaskan keterhubungan antar-entitas berbasis 17 aturan relasi (relation_rules V3). |
| `/games` | Tamu / Publik | Katalog Cabang Game Dinamis (Kategori, Publisher, Tier Rank, Role) | Memuat, Kosong, Error, Sukses | `GameCatalogList`, `GlassCard` | ❌ BELUM ADA | Halaman publik baru yang diamanatkan Keputusan D5. Sumber data dinamis dari `/api/games`. |
| `/games/[slug]` | Tamu / Publik | Detail Game (Aturan Role, Standar Tier, Profil Populer) | Memuat, Kosong, Error, Sukses | `GameDetailView`, `EsportCard` | ❌ BELUM ADA | Menampilkan ketentuan pertandingan dan profil dengan game utama ini. |
| `/news` | Tamu / Publik | Feed Warta & Agenda Ekosistem Esport Sumbar | Memuat, Kosong, Error, Sukses | `NewsFeed`, `GlassCard` | ⏳ BELUM | Ditemukan artikel mock dengan istilah "resmi PBESI" di `mockNews.ts`. |
| `/news/[slug]` | Tamu / Publik | QuietSurface Halaman Baca Warta (Tipografi Nyaman) | Memuat, Kosong, Error, Sukses | `QuietSurface`, `ArticleView` | ⏳ BELUM | `news/[slug]/page.tsx:47` menetapkan fallback author: *"Humas ESI Sumbar"* (Pelanggaran S1). Ganti ke *"Redaksi ESPORT SUMBAR"*. |
| `/tournaments` | Tamu / Publik | Direktori Turnamen Komunitas & Agenda Terdaftar | Memuat, Kosong, Error, Sukses | `TournamentGrid`, `GlassCard` | ⏳ BELUM | Seluruh turnamen adalah UGC komunitas, bukan klaim turnamen instansi luar. |
| `/tournaments/[id]` | Tamu / Publik | Detail Turnamen, Bracket, dan Regulasi Pertandingan | Memuat, Kosong, Error, Sukses | `TournamentDetailClient` | ⏳ BELUM | Terdapat teks *"Terverifikasi Wasit ESI"* di baris 135 (Pelanggaran S1). Ganti dengan *"Status Pertandingan Terdata"*. |
| `/map` | Tamu / Publik | Peta Interaktif Persebaran Fasilitas Arena di Ranah Minang | Memuat, Kosong, Error, Sukses | `MapContainer`, `VenuePin` | ⏳ BELUM | `map/page.tsx:94,105,260` memuat pin marker *"Sekretariat ESI"* (Pelanggaran Kritis S1). Wajib dihapus total! |
| `/leaderboard` | Tamu / Publik | Papan Peringkat Kompetitif Berbasis Tier Kelengkapan & Prestasi | Memuat, Kosong, Error, Sukses | `LeaderboardTable`, `GlassBadge` | ⏳ BELUM | Header tabel di baris 148 memuat: *"Wilayah ESI"* (Pelanggaran S1). Ganti ke *"Wilayah Asal"*. |
| `/gallery` | Tamu / Publik | Galeri Showcase Kartu TCG Digital & Tingkat Rarity | Memuat, Kosong, Sukses | `GalleryGrid`, `EsportCard` | ⏳ BELUM | Teks deskripsi memuat *"integritas kelembagaan ESI"* dan *"Verified (ESI Sumbar)"* (Pelanggaran S1). Bersihkan! |
| `/about` | Tamu / Publik | QuietSurface Tentang ESPORT SUMBAR (Tata Kelola Mandiri) | Memuat, Sukses | `QuietSurface`, `GovernanceTree` | ⏳ BELUM | Memuat klaim terlarang "nomor registrasi resmi" dan "Kepatuhan UU PDP" (Pelanggaran S1). Terapkan bank teks Bagian 3.2. |
| `/how-it-works` | Tamu / Publik | Panduan 5 Langkah Bergambar (Daftar -> Form -> Verifikasi -> Kartu) | Memuat, Sukses | `StepFlow`, `GlassCard` | ⏳ BELUM | 5 langkah transparan tanpa membingungkan pengguna dengan pengurus daerah. |
| `/verification-standard` | Tamu / Publik | QuietSurface Standar Tunggal Verifikasi Profil | Memuat, Sukses | `QuietSurface`, `StandardSpec` | ❌ BELUM ADA | Halaman baru (Keputusan D5) menjelaskan kriteria verifikasi satu tahap, nomor lencana, dan SLA telaah. |
| `/verify/[esport-id]` | Tamu / Publik | Pemeriksaan Status Lencana Publik via QR Code | Memuat, Ditemukan, Tidak Ditemukan, Ditangguhkan | `VerificationResultCard`, `GlassBadge` | ❌ BELUM ADA | Halaman publik baru (Keputusan D5) tujuan pemindaian QR code kartu atlet/tim. |
| `/privacy` | Tamu / Publik | QuietSurface Kebijakan Pelindungan Data Pribadi | Memuat, Sukses | `QuietSurface`, `LegalDocument` | ⏳ BELUM | Bersihkan klaim kepatuhan hukum sepihak; cantumkan kontak pelindungan data (`privasi@esportsumbar.id`). |
| `/terms` | Tamu / Publik | QuietSurface Syarat & Ketentuan Layanan Platform | Memuat, Sukses | `QuietSurface`, `LegalDocument` | ⏳ BELUM | Tata kelola platform mandiri oleh ESPORT SUMBAR. |
| `/content-policy` | Tamu / Publik | QuietSurface Pedoman Konten Pengguna (UGC) & Larangan Representasi | Memuat, Sukses | `QuietSurface`, `LegalDocument` | ❌ BELUM ADA | Halaman baru (Keputusan D5/D6): aturan UGC dilarang mengaku mewakili organisasi lain. |
| `/contact` | Tamu / Publik | QuietSurface Formulir Narahubung Resmi & Kontak Bantuan | Memuat, Sukses, Terkirim, Error | `QuietSurface`, `GlassButton` | ❌ BELUM ADA | Halaman kontak baru (Keputusan D5). |
| `/faq` | Tamu / Publik | Akordion Kaca Tanya Jawab Umum Seputar ESPORT ID & Ekosistem | Memuat, Sukses | `GlassAccordion`, `SearchInput` | ❌ BELUM ADA | Halaman FAQ baru (Keputusan D5). |

---

## 2. Halaman Autentikasi & Onboarding

| Rute | Peran Akses | Templat Visual | State Wajib | Komponen Utama Digunakan | Status Redesain | Catatan Khusus |
|---|:---:|---|---|---|:---:|---|
| `/login` | Tamu (Guest) | Glass Auth Card di atas Scene Prosedural | Idle, Memuat, Error Kredensial, Rate Limit Terlampaui | `DesktopAuthView` / `MobileAuthFlow`, `GlassInput`, `GlassButton` | ⏳ BELUM | Masih terpisah desktop/mobile; perlu penanganan rate limit yang elegan di UI tanpa bocor status user. |
| `/register` | Tamu (Guest) | Glass Auth Card di atas Scene Prosedural | Idle, Memuat, Validasi Form, Sukses Daftar | `DesktopAuthView` / `MobileAuthFlow` | ⏳ BELUM | Konsolidasi menjadi satu form responsif dengan validasi Zod ketat. |
| `/forgot-password` | Tamu (Guest) | Glass Auth Card Permintaan Reset Kata Sandi | Idle, Memuat, Sukses Terkirim (Pesan Generik) | `GlassInput`, `GlassButton` | ❌ BELUM ADA | Rute baru; tidak boleh membocorkan apakah email terdaftar atau tidak (UU PDP). |
| `/reset-password` | Tamu (Token Valid) | Glass Auth Card Input Kata Sandi Baru | Idle, Memuat, Token Kedaluwarsa, Sukses Diubah | `GlassInput`, `GlassButton` | ❌ BELUM ADA | Rute baru untuk landing dari tautan email Supabase Auth. |
| `/auth/callback` | Tamu / Pengguna | Layar Transisi Status Kaca (Spinner Halus) | Memproses, Error Token, Redirect Sukses | `BrandLoader`, `PageTransition` | ⏳ BELUM | Tangani callback OAuth / Magic Link / Email Confirmation dan redirect ke `/onboarding` atau `/dashboard`. |
| `/onboarding` | Authenticated (Belum punya bidang) | Wizard Responsif 7 Bidang (Langkah 1: Pilih Bidang Final; Langkah 2: Data Bidang; Langkah 3: Crop Foto; Langkah 4: Privasi; Langkah 5: Tinjau & Terbit) | Memuat Draf, Validasi Langkah, Unggah Gambar, Sukses Terbit | `DesktopCardWizard` / `MobileCardWizard`, `DynamicEntityFields`, `ImageCropperModal` | ❌ DUPLIKASI TINGGI | `DesktopCardWizard` (60 KB) dan `MobileCardWizard` (35 KB) terpisah. Di Bagian 3 wajib dikonsolidasi menjadi `CardWizardResponsive`. |

---

## 3. Area Pengguna Terotentikasi (Satu Akun Satu Bidang)

| Rute | Peran Akses | Templat Visual | State Wajib | Komponen Utama Digunakan | Status Redesain | Catatan Khusus |
|---|:---:|---|---|---|:---:|---|
| `/dashboard` | User Terdaftar | GlassNav + GlassSidebar + Ringkasan Status Kartu & Ekosistem | Memuat, Profil Belum Lengkap, Verifikasi Pending, Aktif | `DesktopDashboardView` / `MobileDashboardView`, `GlassCard` | ⏳ BELUM | Duplikasi mobile/desktop; teks dashboard menyebut *"antrean verifikasi pengurus cabang"* (Pelanggaran S1/S2). |
| `/me` | User Terdaftar | Profil Saya (Panggung Kaca + Preview Kartu TCG Hidup) | Memuat, Kosong, Sukses | `UserProfileStage`, `EsportCard` | ⚠️ RUTE BELUM STANDAR | Saat ini menggunakan `/me/profile`; harus diselaraskan menjadi `/me` (dengan redirect 301). |
| `/me/edit` | User Terdaftar | QuietSurface Formulir Pembaruan Data Profil | Memuat, Draf, Menyimpan, Sukses, Validasi Error | `QuietSurface`, `DynamicEntityFields` | ⚠️ RUTE BELUM STANDAR | Saat ini `/me/profile/[id]/edit`; ubah ke `/me/edit`. Jika field kunci diubah, status verifikasi otomatis kembali ke pending. |
| `/me/card` | User Terdaftar | Interaktif 3D Card Stage + Tool Unduh PNG + Share + QR Besar | Memuat, Sukses Render, Unduh Berjalan | `CardStage3D`, `EsportCard`, `ShareCardModal` | ⚠️ RUTE BELUM STANDAR | Saat ini `/me/cards`. Single profile V3 hanya memiliki 1 kartu per akun. Ekspor PNG/Canvas wajib bebas kata "resmi". |
| `/me/verification` | User Terdaftar | Tracker Verifikasi Satu Tahap Mengalir + Upload Berkas | Belum Diajukan, Sedang Diperiksa, Perlu Revisi, Terverifikasi, Ditolak | `DesktopVerificationView` / `MobileVerificationTracker` | ⏳ BELUM | Duplikasi mobile/desktop; hapus konsep multi-tahap (Regional vs Provincial); gunakan signed URL pendek (60 detik). |
| `/me/ecosystem` | User Terdaftar | Ekosistem Saya: Permintaan Masuk, Permintaan Keluar, Relasi Aktif, Riwayat | Memuat, Kosong, Aksi Berjalan | `EcosystemManager`, `GlassBadge` | ⚠️ RUTE BELUM STANDAR | Saat ini `/me/memberships`; selaraskan menjadi `/me/ecosystem`. Penegakan 17 aturan relasi deklaratif V3. |
| `/me/notifications` | User Terdaftar | Notifikasi Masuk dengan Spring Animation & Preferensi Opt-out | Memuat, Kosong, Sukses, Tandai Dibaca | `NotificationList`, `GlassCard` | ⚠️ BELUM ADA UI PENUH | Saat ini hanya ada endpoint API `/api/me/notifications`. Perlu halaman UI pengguna di Bagian 3. |
| `/me/privacy` | User Terdaftar | QuietSurface Pengaturan Visibilitas Data per Field | Memuat, Menyimpan, Sukses | `QuietSurface`, `GlassSwitch` | ⏳ BELUM | Teks di `DesktopPrivacyView.tsx:125` memuat *"Hanya Pengurus ESI yang dapat menghubungi"* (Pelanggaran S1). Ganti dengan *"Hanya Tim ESPORT SUMBAR"*. |
| `/me/settings` | User Terdaftar | QuietSurface Akun + Pemilih Efek Visual (Penuh / Standar / Hemat) + Hapus Akun | Memuat, Tersimpan | `QuietSurface`, `GlassSegmented` | ⏳ BELUM | Tempat penyimpanan preferensi visual efek pengguna (D2) dan penegakan UU PDP penghapusan akun mandiri. |

---

## 4. Panel Admin Tunggal (Kaca Terkendali + QuietSurface)

| Rute | Peran Akses | Templat Visual | State Wajib | Komponen Utama Digunakan | Status Redesain | Catatan Khusus |
|---|:---:|---|---|---|:---:|---|
| `/admin` | `platform_admin` | GlassNav/Sidebar + QuietSurface Ringkasan Metrik Platform | Memuat, Sukses | `AdminShell`, `MetricCard`, `QuietSurface` | ⏳ BELUM | Satu peran admin tunggal; tidak ada lagi label Admin Daerah atau Admin Provinsi. |
| `/admin/verification` | `platform_admin` | QuietSurface Tabel Antrean + Panel Review Bukti Singkat 60s + Catatan Revisi | Memuat, Antrean Kosong, Memproses Aksi | `VerificationQueueTable`, `EvidenceViewer` | ⏳ BELUM | Admin tidak boleh memverifikasi akunnya sendiri; integrasi SLA dinamis (D16); nomor lencana terbit otomatis dari DB (`ESP-SB-VER-YYYY-XXXX`). |
| `/admin/verification/[id]` | `platform_admin` | QuietSurface Detail Berkas Verifikasi & Riwayat Keputusan | Memuat, Not Found, Sukses | `VerificationDetailPanel`, `QuietSurface` | ❌ BELUM ADA RUTE TERPISAH | Buat rute detail/modal fokus untuk telaah komprehensif. |
| `/admin/users` | `platform_admin` | QuietSurface Tabel Akun & Profil Terdaftar + Filter Bidang | Memuat, Paginasi, Filter | `UserManagementTable`, `QuietSurface` | ⏳ BELUM | Pencarian cepat, suspensi profil dengan alasan audit wajib. |
| `/admin/users/[id]` | `platform_admin` | QuietSurface Detail Akun, Log Audit, dan Riwayat Relasi | Memuat, Sukses | `UserDetailView`, `QuietSurface` | ❌ BELUM ADA | Inspeksi mendalam akun untuk kepatuhan UU PDP dan investigasi kecurangan. |
| `/admin/games` | `platform_admin` | QuietSurface Manajemen Katalog Cabang Game, Aturan Role & Tier | Memuat, Form Tambah/Ubah, Simpan | `GameAdminTable`, `GameFormModal` | ⏳ BELUM | Hapus teks "Tambah Game Resmi" di `admin/games/page.tsx:323`. Ganti dengan "Tambah Cabang Game". |
| `/admin/reports` | `platform_admin` | QuietSurface Antrean Laporan Pelanggaran Konten Komunitas | Memuat, Antrean Kosong, Selesai | `ReportModerationTable`, `QuietSurface` | ❌ BELUM ADA UI | Saat ini baru berupa API `/api/admin/reports`. Perlu antarmuka admin di Bagian 3 & 9. |
| `/admin/content` | `platform_admin` | QuietSurface Publikasi Warta, Pengumuman, dan Banner Platform | Memuat, Editor Teks, Simpan | `ContentEditor`, `QuietSurface` | ⚠️ GABUNGKAN RUTE | Gabungkan `/admin/news` dan `/admin/moderation` ke dalam `/admin/content` terpadu. |
| `/admin/relation-rules` | `platform_admin` | QuietSurface Editor Batasan 17 Aturan Relasi Ekosistem | Memuat, Konfigurasi, Simpan | `RuleMatrixTable`, `QuietSurface` | ❌ BELUM ADA UI | Visualisasi dan konfigurasi batas relasi (contoh: max team per player = 3). |
| `/admin/settings` | `platform_admin` | QuietSurface Pengaturan Sistem, Konfigurasi Ambang SLA, & Teks Platform | Memuat, Simpan | `AdminSettingsForm`, `QuietSurface` | ⏳ BELUM | Konfigurasi SLA telaah (24 jam, 48 jam, atau 5 hari kerja) disimpan di sini dan dibaca UI secara dinamis. |
| `/admin/audit` | `platform_admin` | QuietSurface Tabel Log Audit Kriptografis Append-Only | Memuat, Paginasi, Filter Tanggal/Aktor | `AuditLogTable`, `QuietSurface` | ⏳ BELUM | Pencatatan append-only yang tidak dapat diedit atau dihapus. |
| `/admin/system` | `platform_admin` | QuietSurface Info Build (Commit Hash + Waktu), Kuota, & Kesehatan Layanan | Memuat, Live Ping Status | `BuildInfoCard`, `HealthDashboard` | ❌ BELUM ADA UI | Menampilkan data dari `/api/admin/build-info` dan `/api/admin/observability` untuk paritas deployment nyata. |

---

## 5. Halaman Sistem & Penanganan Kesalahan

| Rute | Peran Akses | Templat Visual | State Wajib | Komponen Utama Digunakan | Status Redesain | Catatan Khusus |
|---|:---:|---|---|---|:---:|---|
| `/_not-found` (404) | Publik / Tamu | Kartu Kaca Melayang di atas Scene (404: "Halaman Tidak Ditemukan") | Statis | `GlassCard`, `GlassButton` | ⏳ BELUM | Tautan kembali ke Beranda atau Jelajah yang aman. |
| `/403` | Publik / Tamu | Kartu Kaca Peringatan Akses Ditolak (403: "Akses Ditolak") | Statis | `GlassCard`, `GlassButton` | ❌ BELUM ADA | Halaman khusus saat tamu mencoba membuka area login/admin atau sesi habis. |
| `/_global-error` (500) | Publik / Tamu | Kartu Kaca Pemulihan Kendala Sistem (500: "Terjadi Kendala") | Statis, Tombol Muat Ulang | `GlassCard`, `GlassButton` | ⏳ BELUM | Tombol coba lagi dengan degradasi anggun tanpa membocorkan stack trace. |
| `/offline` | Semua Peran | Layar Kaca Status Koneksi Terputus (PWA Offline) | Statis, Deteksi Online Otomatis | `GlassCard`, `WifiOffIcon` | ❌ BELUM ADA | Menampilkan cache lokal kartu identitas saat offline. |
