# PRD: ESPORT SUMBAR Platform (MVP + Roadmap)

**Versi:** 1.0
**Dasar:** `esport-sumbar-master-concept.md`
**Pendekatan build:** Modular vibe coding, satu modul per sprint
**Catatan:** Item bertanda **[TENTUKAN]** adalah keputusan yang belum dikunci dan harus diisi pemilik produk sebelum coding modul terkait.

---

## 1. Ringkasan Produk

### 1.1 Masalah
Data esport Sumatera Barat tersebar dan tidak resmi: tidak ada direktori terpusat, tidak ada identitas pemain/tim yang bisa diverifikasi, ESI daerah dan provinsi tidak punya alat pendataan bersama, dan pelaku tidak punya rekam jejak yang bisa ditunjukkan.

### 1.2 Solusi
Platform web/PWA yang menggabungkan portal berita, direktori publik, identitas digital (ESPORT ID + kartu TCG), dan sistem verifikasi berjenjang ESI Kota/Kab → ESI Provinsi, dengan audit log terpusat.

### 1.3 Tujuan MVP
| ID | Tujuan | Ukuran keberhasilan |
|---|---|---|
| G1 | Pengguna bisa mendaftar dan mendapat ESPORT ID + kartu | ≥ 90% pendaftar menyelesaikan pembuatan kartu dalam < 5 menit |
| G2 | ESI daerah dan provinsi bisa memeriksa dan memverifikasi | Waktu rata-rata verifikasi ≤ 7 hari di wilayah pilot |
| G3 | Publik bisa mencari dan melihat data yang dipublikasikan | Direktori dan pencarian berfungsi untuk Player, Pelatih, Tim |
| G4 | Semua tindakan admin tercatat dan tidak bisa diubah | 100% transisi status punya entri audit log |

### 1.4 Di luar cakupan MVP (non-goals)
Komunitas, Venue, Kampus, Sekolah, Organizer, Turnamen, peta interaktif, ranking, rekrutmen, sertifikat digital, aplikasi native, pembayaran, API publik. Semuanya dijadwalkan di fase berikutnya (lihat bagian 12).

---

## 2. Persona

| Persona | Kebutuhan | Pain point |
|---|---|---|
| **Raka, pemain (17 th, Padang)** | Kartu keren untuk dibagikan, rekam jejak, ditemukan tim | Tidak ada tempat resmi untuk menunjukkan identitas esport |
| **Coach Dedi (28 th)** | Profil pelatih, terhubung dengan tim | Sertifikasi dan pengalaman tidak tercatat |
| **Manajer tim "Marawa Squad"** | Profil tim, roster yang diakui | Nama pemain sering dicatut atau tidak jelas |
| **Admin ESI Kota (relawan)** | Antrean pemeriksaan yang sederhana | Waktu terbatas, belum terbiasa sistem digital |
| **Admin ESI Provinsi** | Gambaran seluruh daerah, verifikasi resmi | Data tidak seragam antar daerah |
| **Operator ESPORT SUMBAR** | Konten, akun admin, keamanan, audit | Perlu kontrol tanpa mengambil kewenangan ESI |
| **Orang tua/wali** | Memastikan anak aman dan data terlindungi | Khawatir data anak terpapar publik |
| **Pengunjung** | Berita dan informasi tanpa login | Tidak mau ribet daftar dulu |

---

## 3. Peran dan Hak Akses

### 3.1 Peran sistem
`guest`, `user`, `region_admin`, `prov_admin`, `platform_operator`

Satu akun (`user`) dapat memiliki beberapa **profil** (player, coach, team, dst.).

### 3.2 Matriks akses

| Aksi | Guest | User | Admin Daerah | Admin Provinsi | Operator Platform |
|---|:--:|:--:|:--:|:--:|:--:|
| Baca berita dan direktori publik | ✔ | ✔ | ✔ | ✔ | ✔ |
| Buat dan kelola profil sendiri | ✘ | ✔ | ✘ | ✘ | ✘ |
| Ajukan verifikasi profil sendiri | ✘ | ✔ | ✘ | ✘ | ✘ |
| Lihat data lengkap profil di wilayahnya | ✘ | hanya milik sendiri | ✔ (wilayahnya) | ✔ (semua) | ✔ (teknis, sesuai kebutuhan) |
| Periksa, minta revisi, tolak (tahap daerah) | ✘ | ✘ | ✔ (wilayahnya) | ✔ (wilayah fallback) | ✘ |
| Beri status Regional Checked | ✘ | ✘ | ✔ | ✔ | ✘ |
| Beri Verified (resmi) | ✘ | ✘ | ✘ | ✔ | **✘** |
| Tangguhkan/cabut verifikasi | ✘ | ✘ | ✘ | ✔ | hanya eksekusi teknis atas permintaan ESI tercatat |
| Kelola berita/CMS | ✘ | ✘ | ✘ | ✘ | ✔ |
| Kelola akun admin | ✘ | ✘ | ✘ | usul | ✔ |
| Lihat audit log | ✘ | ✘ | wilayahnya | provinsi | global |
| Hapus/ubah audit log | ✘ | ✘ | ✘ | ✘ | ✘ |

---

## 4. User Stories dan Acceptance Criteria (MVP)

### Epic A: Akses publik

| ID | Sebagai | Saya ingin | Acceptance criteria |
|---|---|---|---|
| A1 | Pengunjung | membaca berita tanpa login | Daftar berita, halaman detail, kategori, filter wilayah. Tampil di mobile tanpa scroll horizontal |
| A2 | Pengunjung | mencari pemain/pelatih/tim | Pencarian teks + filter (entitas, game, kota/kab, status verifikasi). Hanya data publik yang disetujui pengguna yang muncul |
| A3 | Pengunjung | melihat halaman profil publik | Menampilkan kartu, info publik, lencana verifikasi, tim terkait. Tidak menampilkan data terbatas/sensitif |
| A4 | Pengunjung | melihat halaman daerah | Statistik jumlah profil per entitas (hanya yang dipublikasikan), pengurus ESI daerah, berita lokal |
| A5 | Pengunjung | memindai QR kartu | QR membuka profil publik yang sesuai, menampilkan status verifikasi terkini |

### Epic B: Akun dan registrasi

| ID | Sebagai | Saya ingin | Acceptance criteria |
|---|---|---|---|
| B1 | Calon pengguna | mendaftar dengan email/Google | Akun terbuat, email terverifikasi, bisa login. [TENTUKAN: tambah WhatsApp OTP di MVP atau fase 2] |
| B2 | Pengguna | membuat profil Player/Pelatih/Tim | Formulir dinamis per tipe; wajib: nama tampil, kota/kab, game utama. Draft bisa disimpan |
| B3 | Pengguna < 18 th | mendaftar dengan persetujuan wali | Jika tanggal lahir < 18: wajib persetujuan wali (nama + kontak wali + centang persetujuan). Profil publik default minimal. Tanpa persetujuan tidak bisa mengajukan verifikasi |
| B4 | Pengguna | punya lebih dari satu profil | Satu akun bisa membuat profil Player dan Pelatih; setiap profil punya ESPORT ID dan kartu sendiri |
| B5 | Pengguna | mengatur privasi tiap field | Toggle publik/terbatas per field; perubahan langsung memengaruhi halaman publik |
| B6 | Pengguna | menghapus profil/akun | Permintaan penghapusan diproses sesuai kebijakan retensi; profil hilang dari publik segera; audit log tetap menyimpan jejak teknis tanpa data pribadi berlebih |

### Epic C: Kartu digital

| ID | Sebagai | Saya ingin | Acceptance criteria |
|---|---|---|---|
| C1 | Pengguna | mendapat kartu otomatis setelah profil lengkap minimal | ESPORT ID terbit, kartu Rookie tampil dengan atribut sesuai tipe |
| C2 | Pengguna | melihat kartu 3D dan membaliknya | Efek tilt di desktop (kursor) dan mobile (sentuhan); flip menampilkan sisi belakang |
| C3 | Pengguna | mengunduh kartu | Unduh PNG; opsi rasio 9:16 untuk Story; watermark platform; QR terbaca |
| C4 | Sistem | menentukan tier rarity otomatis | Tier dihitung dari kriteria tertulis (lihat 7.2); berubah otomatis saat kriteria terpenuhi; terpisah dari status verifikasi |
| C5 | Pengunjung | membedakan frame dan lencana | Frame = rarity, lencana = verifikasi, tampil sebagai dua elemen terpisah dengan legenda penjelasan |

### Epic D: Relasi

| ID | Sebagai | Saya ingin | Acceptance criteria |
|---|---|---|---|
| D1 | Player | meminta bergabung ke tim | Permintaan terkirim ke manajer tim; status Pending/Accepted/Declined; baru muncul di roster setelah Accepted |
| D2 | Manajer tim | mengundang pemain/pelatih | Undangan ke profil terdaftar; baru aktif setelah diterima penerima |
| D3 | Player | keluar dari tim | Relasi berakhir dengan tanggal; riwayat tim tetap tersimpan |
| D4 | Pengguna | menolak pencantuman | Tidak ada nama yang tampil di roster tanpa persetujuan penerima |

### Epic E: Pengajuan verifikasi

| ID | Sebagai | Saya ingin | Acceptance criteria |
|---|---|---|---|
| E1 | Pengguna | mengajukan verifikasi | Syarat: profil lengkap minimal, bukti pendukung diunggah (privat), persetujuan wali jika < 18. Status berubah ke Submitted |
| E2 | Pengguna | melihat status dan catatan | Timeline status dengan alasan revisi/penolakan; notifikasi email |
| E3 | Pengguna | memperbaiki dan mengajukan ulang | Dari status Revision, bisa edit dan submit lagi; riwayat tersimpan |

### Epic F: Dashboard admin daerah

| ID | Sebagai | Saya ingin | Acceptance criteria |
|---|---|---|---|
| F1 | Admin daerah | melihat antrean pengajuan wilayah saya | Daftar dengan filter status/entitas/game, urut tertua; hanya wilayah saya yang terlihat (dijaga di level database) |
| F2 | Admin daerah | memeriksa detail dan bukti | Halaman detail menampilkan data lengkap dan dokumen privat (URL bertanda tangan, kedaluwarsa singkat) |
| F3 | Admin daerah | meminta revisi/menolak | Alasan wajib dengan template; pengguna ternotifikasi |
| F4 | Admin daerah | menyetujui (Regional Checked) dan meneruskan | Status menjadi District Approved → Provincial Review; lencana hijau muncul |
| F5 | Admin daerah | diingatkan pengajuan yang menggantung | Pengingat otomatis jika > 5 hari tanpa tindakan; eskalasi ke provinsi jika > 14 hari **[TENTUKAN SLA]** |

### Epic G: Dashboard admin provinsi

| ID | Sebagai | Saya ingin | Acceptance criteria |
|---|---|---|---|
| G1 | Admin provinsi | melihat antrean dari semua daerah | Filter per wilayah/entitas/status; wilayah fallback (tanpa admin daerah) tampil dengan penanda |
| G2 | Admin provinsi | memberi verifikasi resmi | Status Verified, lencana emas, nomor lencana, tanggal kedaluwarsa (12 bulan) |
| G3 | Admin provinsi | menangguhkan/mencabut verifikasi | Alasan wajib; kartu menampilkan status Suspended; tercatat di audit log |
| G4 | Admin provinsi | melihat statistik provinsi | Jumlah profil per wilayah dan status, waktu verifikasi rata-rata |
| G5 | Admin provinsi | menangani wilayah tanpa admin daerah | Dapat melakukan pemeriksaan tahap daerah untuk wilayah berstatus fallback |

### Epic H: Operator platform

| ID | Sebagai | Saya ingin | Acceptance criteria |
|---|---|---|---|
| H1 | Operator | mengelola berita | CRUD artikel, kategori, wilayah, jadwal terbit |
| H2 | Operator | mengelola akun admin ESI | Buat/nonaktifkan admin daerah/provinsi, tetapkan wilayah; setiap perubahan tercatat |
| H3 | Operator | melihat audit log global | Filter pelaku/aksi/wilayah/tanggal; ekspor CSV; **tidak ada** tombol hapus/ubah |
| H4 | Operator | mengelola referensi | Daftar game, wilayah, kategori role |

---

## 5. Alur Verifikasi (Spesifikasi)

### 5.1 Status

| Status | Penjelasan | Siapa yang dapat memindahkan |
|---|---|---|
| `draft` | Belum diajukan | Pemilik |
| `submitted` | Diajukan, menunggu daerah | Pemilik → sistem |
| `under_review` | Sedang diperiksa daerah | Admin daerah |
| `revision_requested` | Diminta perbaikan | Admin daerah/provinsi |
| `district_approved` | Lulus daerah (Regional Checked) | Admin daerah |
| `provincial_review` | Menunggu provinsi | Sistem otomatis dari district_approved |
| `verified` | Terverifikasi resmi | Admin provinsi |
| `rejected` | Ditolak (alasan wajib) | Admin daerah/provinsi |
| `suspended` | Ditangguhkan | Admin provinsi |
| `expired` | Masa berlaku habis | Sistem |

### 5.2 Aturan
1. Transisi hanya sesuai tabel; transisi tidak sah ditolak di backend.
2. Setiap transisi **wajib** menulis ke `audit_logs` dalam transaksi yang sama.
3. Alasan wajib untuk revision, reject, suspend.
4. Perubahan field kunci (nama tampil, game utama, tim, kota/kab) pada profil `verified` memicu `provincial_review` ulang dan lencana ditandai "Menunggu verifikasi ulang".
5. Pindah kota/kab: pengajuan dipindahkan ke antrean wilayah baru dan status kembali ke `submitted`.
6. Wilayah tanpa admin aktif: tahap daerah dilewati oleh admin provinsi (mode fallback).
7. `verified` berlaku 12 bulan; 30 hari sebelum kedaluwarsa pengguna menerima pengingat pembaruan.
8. Operator platform tidak dapat mengubah status ke `verified`.

---

## 6. Kebutuhan Fungsional per Modul

### 6.1 Portal publik
- Beranda: berita unggulan, statistik ringkas, profil unggulan, CTA daftar.
- Direktori: Player, Pelatih, Tim (MVP). Kartu daftar, paginasi, pencarian, filter.
- Profil publik per entitas dengan URL ramah (`/player/{slug}`), meta tag untuk berbagi ke media sosial (Open Graph memakai gambar kartu).
- Halaman daerah (19), halaman berita, halaman "Cara Kerja Kartu dan Verifikasi", halaman kebijakan privasi, syarat, kontak.

### 6.2 Akun dan profil
- Auth: email + password dan Google; reset kata sandi; sesi aman.
- Formulir dinamis per tipe entitas dengan validasi.
- Unggah gambar (batas ukuran/tipe, kompres otomatis), moderasi dasar (laporkan).
- Pengaturan privasi per field dan pusat persetujuan.

### 6.3 Kartu
- Komponen kartu per tipe (Player, Pelatih, Tim) dengan 4 tier frame.
- Render di klien untuk tampilan, ekspor gambar di klien (opsi server untuk Open Graph).
- QR berisi URL profil publik + ESPORT ID.

### 6.4 Relasi dan roster
- Permintaan/undangan dengan persetujuan dua arah.
- Peran dalam tim (kapten, manajer, anggota, pelatih, cadangan).
- Riwayat keanggotaan (tanggal mulai dan akhir).

### 6.5 Admin
- Dashboard per peran, antrean, detail pemeriksaan, tindakan dengan alasan.
- Notifikasi email untuk perubahan status.
- Audit log viewer sesuai cakupan peran.

### 6.6 Notifikasi (MVP)
Email untuk: verifikasi email, status pengajuan, undangan/permintaan relasi, pengingat kedaluwarsa. Notifikasi dalam aplikasi: fase 2.

---

## 7. Spesifikasi Kartu dan Rarity

### 7.1 Atribut kartu MVP

| Tipe | Sisi depan | Sisi belakang |
|---|---|---|
| Player | Avatar, IGN, nama tampil, game utama, role, kota/kab, tim, ESPORT ID, lencana, QR | Prestasi pilihan, riwayat tim, tanggal bergabung |
| Pelatih | Foto, nama, spesialisasi game, kota/kab, tim saat ini, ESPORT ID, lencana, QR | Sertifikasi, riwayat tim, prestasi |
| Tim | Logo, nama, game, kota/kab, kapten/manajer, jumlah roster, ESPORT ID, lencana, QR | Daftar roster aktif, prestasi |

### 7.2 Kriteria tier rarity (dihitung otomatis)

| Tier | Nama | Kriteria |
|---|---|---|
| 1 | Rookie | Profil dibuat dengan field wajib |
| 2 | Contender | Kelengkapan ≥ 80% dan ≥ 1 relasi terkonfirmasi |
| 3 | Elite | ≥ 1 prestasi dengan bukti yang telah divalidasi oleh admin |
| 4 | Legend | Prestasi tingkat provinsi/nasional tervalidasi, atau penetapan khusus menurut kriteria tertulis **[TENTUKAN daftar kriteria Legend]** |

Definisi kelengkapan: bobot per field ditentukan di konfigurasi (nama tampil, avatar, game utama, role, kota/kab, bio singkat, minimal satu akun game, dst.).

### 7.3 Status lencana (independen dari tier)

| Status | Tampilan |
|---|---|
| Unverified | Tidak ada lencana |
| Regional Checked | Lencana hijau + emblem wilayah |
| Verified | Lencana emas + logo ESI Sumbar + nomor lencana |
| Suspended | Lencana abu-abu |
| Menunggu verifikasi ulang | Lencana verified dengan penanda kuning |

---

## 8. Model Data

### 8.1 Entitas utama (skema logis)

```
regions
  id, name, type (kota|kabupaten), slug, logo_url,
  esi_contact_name, admin_mode (active|fallback), is_pilot

accounts                      -- 1 akun login
  id (auth uid), email, role (user|region_admin|prov_admin|platform_operator),
  assigned_region_id (admin daerah), created_at, birth_date (privat),
  guardian_consent_id (nullable)

guardian_consents
  id, account_id, guardian_name, guardian_contact (privat),
  consented_at, consent_version

profiles                      -- 1 akun bisa banyak profil
  id, account_id, entity_type (player|coach|team|[community|venue|campus|school|organizer]),
  esport_id (unik), slug, display_name, region_id, main_game_id,
  avatar_url, bio, metadata_jsonb (atribut khusus tipe),
  visibility_jsonb (publik/terbatas per field),
  verification_status, verified_at, verification_expires_at, verified_badge_no,
  rarity_tier, completeness_score, created_at, updated_at

games
  id, name, slug, roles_jsonb, is_active

memberships                   -- relasi dengan persetujuan
  id, member_profile_id, org_profile_id, role_in_org,
  status (pending|accepted|declined|ended), initiated_by (member|org),
  started_at, ended_at

achievements
  id, profile_id, title, level (kota|provinsi|nasional|lainnya), placement,
  event_name, event_date, evidence_url (privat), validation_status, validated_by

verification_requests
  id, profile_id, status, region_id, submitted_at, current_reviewer_id,
  notes, evidence_files (rujukan storage privat)

audit_logs                    -- append-only
  id, occurred_at, actor_account_id, actor_role, region_id, action,
  target_type, target_id, previous_status, new_status, reason, metadata_jsonb

articles
  id, title, slug, content, category, region_id, author_id, status, published_at

notifications_queue
  id, account_id, type, payload_jsonb, status, created_at

reports                       -- laporan penyalahgunaan
  id, reporter_account_id, target_profile_id, reason, status, created_at
```

### 8.2 Aturan keamanan data (Row Level Security)
1. `profiles`: publik hanya melihat baris dengan `visibility` publik dan hanya kolom yang diizinkan (lewat view publik); pemilik melihat miliknya; admin daerah melihat profil di `region_id` miliknya; admin provinsi semua.
2. `verification_requests` dan dokumen: hanya pemilik, admin wilayah terkait, admin provinsi.
3. `audit_logs`: hanya INSERT dari fungsi server; **tanpa UPDATE/DELETE** untuk semua peran; SELECT sesuai cakupan peran.
4. Perubahan `verification_status` hanya melalui fungsi/RPC server yang memeriksa peran dan tabel transisi (bukan update langsung dari klien).
5. Dokumen bukti di bucket privat, akses lewat signed URL berumur pendek.
6. Operator platform tidak memiliki izin memanggil fungsi `set_verified`.

### 8.3 Indeks dan kinerja
Indeks pada `profiles(region_id, entity_type, verification_status)`, `profiles(slug)`, `profiles(esport_id)`, full-text pada `display_name`, `audit_logs(occurred_at, region_id)`.

---

## 9. Informasi Arsitektur dan Layar

### 9.1 Situs publik
`/` Beranda · `/explore` Jelajah · `/players` · `/coaches` · `/teams` · `/regions` · `/regions/{slug}` · `/news` · `/news/{slug}` · `/player/{slug}` · `/coach/{slug}` · `/team/{slug}` · `/how-it-works` · `/privacy` · `/terms` · `/about`

### 9.2 Aplikasi pengguna
`/login` · `/register` · `/dashboard` · `/me/cards` (ESPORT ID) · `/me/profile/new` · `/me/profile/{id}/edit` · `/me/verification` · `/me/memberships` · `/me/privacy` · `/me/settings`

### 9.3 Admin
- Daerah: `/admin/region` (ringkasan) · `/admin/region/queue` · `/admin/region/review/{id}` · `/admin/region/entities` · `/admin/region/logs`
- Provinsi: `/admin/province` · `/admin/province/queue` · `/admin/province/review/{id}` · `/admin/province/stats` · `/admin/province/logs`
- Operator: `/admin/platform` · `/admin/platform/news` · `/admin/platform/admins` · `/admin/platform/reference` · `/admin/platform/audit`

---

## 10. Kebutuhan Non-Fungsional

| Area | Persyaratan |
|---|---|
| Kinerja | Halaman publik LCP < 2,5 dtk pada jaringan 4G; gambar dioptimalkan; paginasi server-side |
| Responsif | Mobile-first, nyaman di layar 360 px |
| Aksesibilitas | Kontras teks memadai, alt text gambar, navigasi keyboard di dashboard |
| Keamanan | RLS aktif di semua tabel, otorisasi di backend, validasi input, proteksi upload (tipe/ukuran/pemindaian dasar), rate limiting login dan pendaftaran, secret di environment, HTTPS |
| Privasi | Sesuai UU PDP: persetujuan eksplisit, hak akses/koreksi/hapus, retensi dokumen, kebijakan privasi yang jelas |
| Ketersediaan | Backup harian database, uji pemulihan berkala |
| Observabilitas | Pencatatan error dan pemantauan uptime |
| Lokalisasi | Bahasa Indonesia utama; format tanggal/waktu WIB |
| SEO | Meta tag dan Open Graph tiap profil/berita, sitemap |
| Moderasi | Fitur lapor profil, penangguhan akun, kebijakan konten |

---

## 11. Analitik dan KPI

| KPI | Definisi | Target awal pilot **[TENTUKAN]** |
|---|---|---|
| Registered profiles | Total profil | ... |
| Verification rate | % submitted yang selesai diputuskan | ≥ 80% |
| Median verification time | Hari Submitted → keputusan | ≤ 7 |
| Regional Data Coverage | Wilayah dengan ≥ N profil verified | pilot 2 dari 19 |
| Card shares | Unduhan kartu / pengguna aktif | ... |
| Return visitors | Pengunjung kembali 30 hari | ... |

Peristiwa yang dilacak: register_complete, profile_created, card_downloaded, verification_submitted, verification_decided, membership_requested/accepted, search_performed.

---

## 12. Roadmap dan Rencana Sprint

### 12.1 Fase

| Fase | Isi | Estimasi (pengerjaan solo + vibe coding) |
|---|---|---|
| **1: MVP / Pilot** | Portal publik, auth, Player/Pelatih/Tim, kartu, relasi dasar, verifikasi berjenjang, 3 dashboard admin, audit log, privasi, persetujuan wali | 8–10 minggu |
| **2: Ekosistem** | Komunitas, Venue, Kampus, Sekolah, Esports Map, achievement, statistik daerah, notifikasi dalam aplikasi, PWA penuh | 6–8 minggu |
| **3: Kompetisi** | Organizer, Turnamen dan hasil, riwayat karier, roster lanjutan, event calendar, sertifikat digital, ranking tervalidasi, rekrutmen | 8–10 minggu |
| **4: Ekspansi** | Aplikasi native, API, analitik lanjutan, integrasi kegiatan ESI, kerja sama nasional | Menyesuaikan |

### 12.2 Sprint MVP

| Sprint | Fokus | Hasil yang bisa didemokan |
|---|---|---|
| **0** (paralel, non-teknis) | MoU/posisi dengan ESI, wilayah pilot, daftar game, kebijakan privasi, kriteria tier, contoh dokumen bukti | Keputusan D1–D8 terkunci |
| **1** (minggu 1–2) | Fondasi: setup proyek, design system dark mode, skema database + seed 19 wilayah + game, auth, RLS dasar, layout publik | Login berjalan; halaman kosong publik dan data wilayah |
| **2** (minggu 3–4) | Profil + kartu: formulir dinamis Player/Pelatih/Tim, persetujuan wali, privasi field, komponen kartu 3D, ESPORT ID, unduh PNG, QR, halaman profil publik | Pengguna daftar dan punya kartu yang bisa dibagikan |
| **3** (minggu 5–6) | Direktori + berita + relasi: pencarian dan filter, halaman daerah, CMS berita, permintaan bergabung/undangan, roster | Publik bisa menjelajah; tim punya roster dengan persetujuan |
| **4** (minggu 7–8) | Verifikasi: tabel transisi, RPC server, upload bukti privat, dashboard daerah, dashboard provinsi, audit log append-only, notifikasi email, fallback wilayah | Alur lengkap Submitted → Verified dengan lencana di kartu |
| **5** (minggu 9–10) | Pengerasan: rarity otomatis, kedaluwarsa, laporan penyalahgunaan, uji keamanan dan role, optimasi, panduan admin, uji pilot internal | Siap pilot terbatas di wilayah terpilih |

---

## 13. Rencana Vibe Coding (urutan prompt)

**Aturan emas untuk semua prompt:** sertakan skema data terkini, aturan role, dan batasan modul; minta satu modul per prompt; jalankan dan uji sebelum lanjut; commit ke Git setiap modul selesai.

**Prompt pembuka proyek (simpan sebagai konteks tetap):**
> Kita membangun ESPORT SUMBAR, platform direktori + identitas digital esport Sumatera Barat. Stack: Next.js (App Router, TypeScript), Tailwind + shadcn/ui, Supabase (Postgres, Auth, Storage, RLS), deploy Vercel. Prinsip: (1) otorisasi di backend/RLS, bukan hanya UI; (2) status verifikasi hanya berubah lewat fungsi server yang menulis audit_logs dalam satu transaksi; (3) rarity kartu dan status verifikasi adalah dua hal terpisah; (4) Operator platform tidak bisa memberi status verified; (5) relasi tim butuh persetujuan; (6) data sensitif tidak pernah publik. Bahasa UI: Indonesia. Tema: dark mode, aksen emas dan merah marawa.

| Langkah | Prompt inti (ringkas) | Cek penerimaan |
|---|---|---|
| 1. Setup | "Buat struktur proyek, layout publik dan app, design tokens dark mode, komponen dasar (Button, Card, Input, Badge, Dialog), konfigurasi Supabase." | Build berhasil, halaman placeholder tampil |
| 2. Skema | "Buat migrasi SQL untuk tabel pada bagian 8.1 beserta indeks, seed 19 wilayah dan daftar game. Tulis kebijakan RLS sesuai 8.2." | Skema ter-deploy, RLS aktif di semua tabel |
| 3. Auth | "Implementasikan register/login (email + Google), tabel accounts terhubung auth, middleware peran, halaman terproteksi." | Akun user biasa tidak bisa membuka `/admin/*` |
| 4. Profil | "Buat formulir dinamis profil per entity_type dengan validasi, alur persetujuan wali untuk < 18 tahun, pengaturan visibilitas per field, view publik yang hanya mengekspos field yang diizinkan." | Field privat tidak muncul di API publik |
| 5. Kartu | "Buat komponen kartu untuk Player/Pelatih/Tim dengan 4 frame rarity dan slot lencana verifikasi terpisah, efek tilt dan flip, QR dinamis, ekspor PNG dan 9:16." | Kartu terbaca di mobile, QR membuka profil |
| 6. Publik | "Buat direktori dengan pencarian dan filter, halaman profil publik, halaman daerah dengan statistik, Open Graph per profil." | Pencarian < 1 dtk pada data uji |
| 7. Relasi | "Implementasikan permintaan bergabung/undangan dengan status, halaman roster, riwayat keanggotaan." | Nama tidak muncul di roster sebelum Accepted |
| 8. Verifikasi | "Buat tabel transisi status, fungsi RPC `transition_verification` yang memeriksa peran + wilayah + transisi sah + alasan wajib dan menulis audit_logs transaksional. Buat upload bukti ke bucket privat dengan signed URL." | Transisi tidak sah ditolak; audit log selalu terisi |
| 9. Dashboard | "Buat dashboard admin daerah, provinsi, operator sesuai matriks 3.2, antrean, detail pemeriksaan, aksi dengan alasan, audit viewer sesuai cakupan." | Admin daerah A tidak melihat data daerah B |
| 10. CMS dan notifikasi | "CRUD berita untuk operator, email notifikasi status, pengingat kedaluwarsa dan SLA." | Email terkirim di setiap perubahan status |
| 11. Pengerasan | "Hitung rarity otomatis, kedaluwarsa verifikasi (cron), rate limiting, laporan penyalahgunaan, uji peran lengkap." | Daftar periksa QA lolos |

**Setelah setiap langkah:** minta AI menulis ringkasan perubahan schema/keputusan ke file `docs/DECISIONS.md` dan menjalankan pengujian peran dengan lima akun uji (guest, user, admin daerah A, admin daerah B, admin provinsi, operator).

---

## 14. Daftar Periksa QA dan Keamanan

**Uji peran dan wilayah**
- [ ] Guest tidak bisa mengakses data terbatas/sensitif atau halaman admin
- [ ] User tidak bisa melihat profil privat orang lain
- [ ] Admin daerah A tidak bisa membaca/mengubah data wilayah B
- [ ] Admin daerah tidak bisa memberi status Verified
- [ ] Operator platform tidak bisa memanggil fungsi verifikasi resmi
- [ ] Update langsung status dari klien ditolak

**Verifikasi dan audit**
- [ ] Setiap transisi menulis audit log dalam satu transaksi
- [ ] Audit log tidak bisa diubah/dihapus oleh peran apa pun
- [ ] Perubahan field kunci pada profil verified memicu verifikasi ulang
- [ ] Kedaluwarsa dan pengingat berjalan

**Privasi**
- [ ] Persetujuan wali wajib untuk < 18 tahun
- [ ] Profil anak default minimal
- [ ] Dokumen bukti hanya lewat signed URL berumur pendek
- [ ] Penghapusan akun menghapus data publik segera
- [ ] Tidak ada data nyata di lingkungan uji tanpa perlindungan

**Fungsional dan kualitas**
- [ ] Kartu terbaca dan QR valid di Android/iOS
- [ ] Relasi tidak muncul tanpa persetujuan
- [ ] Pencarian dan filter akurat
- [ ] Halaman nyaman di layar 360 px
- [ ] Upload gambar dibatasi tipe/ukuran
- [ ] Backup dan uji pemulihan dilakukan

---

## 15. Asumsi, Risiko, dan Pertanyaan Terbuka

**Asumsi**
- ESI Sumbar bersedia menjadi otoritas verifikasi lewat kesepakatan tertulis.
- Minimal satu admin ESI aktif di tiap wilayah pilot.
- Pemilik produk mengerjakan sendiri dengan bantuan AI; waktu estimasi menyesuaikan.

**Pertanyaan terbuka (perlu dijawab pemilik produk)**
1. Wilayah pilot: Kota Padang + kabupaten mana? **[TENTUKAN]**
2. Siapa kontak resmi ESI Sumbar dan siapa yang menandatangani MoU? **[TENTUKAN]**
3. Game apa saja yang didukung di MVP? **[TENTUKAN]**
4. SLA verifikasi daerah dan provinsi (hari)? **[TENTUKAN]**
5. Kriteria resmi tier Legend dan daftar prestasi yang diakui? **[TENTUKAN]**
6. Login WhatsApp OTP di MVP atau fase 2? **[TENTUKAN]**
7. Siapa yang menjadi penanggung jawab perlindungan data dan moderasi laporan? **[TENTUKAN]**
8. Nama/merek final fitur: "ESPORT ID" untuk identitas, "Kartu" untuk tampilan. Setuju? **[TENTUKAN]**

**Risiko utama yang perlu dipantau**
Admin daerah tidak aktif, kapasitas solo-development, kebijakan privasi anak, perbedaan standar bukti antar daerah, ekspektasi ESI terhadap kewenangan Operator Platform.
