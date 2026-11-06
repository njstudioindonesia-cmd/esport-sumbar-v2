# Rencana Pengujian Komprehensif & Anggaran Performa V3

Dokumen ini mendefinisikan strategi verifikasi mutu, pengujian otomatis, dan batasan performa sistem untuk transformasi ESPORT SUMBAR V3.

---

## 1. Rencana Pengujian Otomatis

### 1.1 Pengujian Kebijakan Keamanan Basis Data (RLS Test Suite)
Pengujian RLS dijalankan langsung pada database PostgreSQL staging menggunakan skrip SQL verifikasi otomatis:
- **T1: Isolasi Data Privat:** Kueri anonim atau user lain ke tabel `profile_private` wajib mengembalikan 0 baris (*access denied*).
- **T2: Proteksi Audit Log:** Upaya perintah `UPDATE` atau `DELETE` pada tabel `audit_logs` oleh siapapun (termasuk admin) wajib digagalkan oleh trigger *append-only*.
- **T3: Larangan Multi-Profil:** Percobaan `INSERT` profil kedua dengan `account_id` yang sama wajib gagal dengan pelanggaran konstrain unik `profiles_account_id_unique`.
- **T4: Larangan Ubah Bidang:** Percobaan `UPDATE entity_type` pada profil eksisting wajib digagalkan oleh trigger database.
- **T5: Isolasi Otorisasi Admin:** User biasa yang mencoba memanggil RPC `transition_verification` wajib gagal dengan pesan `Unauthorized: Platform Admin Only`.
- **T6: Pemisahan Kepentingan Admin:** Admin platform yang mencoba menyetujui pengajuan verifikasi atas profil miliknya sendiri wajib ditolak oleh validasi internal RPC.

### 1.2 Pengujian Aturan Ekosistem (`relation_rules` Testing)
- **E1: Pasangan Sah:** Player → Team, Player → Community, Team → Venue berhasil dibuat dengan status `pending`.
- **E2: Pasangan Terlarang:** Player → Player atau Team → Team ditolak seketika dengan error `InvalidRelationPair`.
- **E3: Batas Kuota Aktif:** Player yang sudah memiliki 1 tim aktif pada game MLBB ditolak saat mencoba menerima undangan tim MLBB kedua.
- **E4: Validasi Kesesuaian Game:** Percobaan menghubungkan Player dengan game utama `Valorant` ke Tim bergenre `Free Fire` ditolak dengan `GameMismatchError`.
- **E5: Kedaluwarsa Otomatis:** Undangan relasi berumur >14 hari otomatis ditandai `expired` oleh fungsi berkala.

### 1.3 Pengujian Kontrak Antar-Layanan (Contract Testing)
- Pengujian skema Zod pada paket `packages/contracts` untuk memastikan seluruh pertukaran data antara Next.js BFF dan microservices (`media`, `notification`, `verification`, `directory`) mematuhi skema versi 1 (`v1`).
- Setiap perubahan skema wajib backward-compatible (kolom baru opsional).

### 1.4 Pengujian End-to-End (E2E) Alur Kritis Pengguna
Menggunakan Playwright di CI/CD:
1. **Flow 1 (Registrasi & Wizard):** Daftar akun → Pilih bidang `Player` → Input data dasar → Konfirmasi final bidang → Kartu 3D terbentuk → Buka profil publik (verifikasi data privat tidak muncul).
2. **Flow 2 (Ekosistem):** Akun Player mengirim undangan gabung ke Akun Team → Akun Team login → Menyetujui undangan di `/ecosystem` → Roster tim bertambah 1 dan profil Player menampilkan lencana keanggotaan tim.
3. **Flow 3 (Verifikasi Tunggal):** Player mengunggah screenshot IGN in-game → Status menjadi `submitted` → Admin login ke `/admin/verification` → Membuka viewer bukti → Mengklik "Setujui" → Lencana emas "Terverifikasi ESPORT SUMBAR" seketika muncul di kartu dan profil direktori.

---

## 2. Anggaran Performa Sistem (Performance Budget)

| Parameter / Metrik | Batas Anggaran V3 | Metode Pengukuran |
|---|---|---|
| **First Load JS (Halaman Publik)** | **≤ 140 kB** | Next.js Build Analyzer |
| **Largest Contentful Paint (LCP)** | **< 2.5 detik** (koneksi 4G mobile) | Google Lighthouse / Core Web Vitals |
| **First Contentful Paint (FCP)** | **< 1.2 detik** | Lighthouse |
| **Cumulative Layout Shift (CLS)** | **< 0.05** | Lighthouse |
| **Latensi API Baca Publik (p95)** | **< 300 ms** | Vercel Analytics / Hono Bench |
| **Latensi RPC Verifikasi (p95)** | **< 500 ms** (termasuk audit log) | Supabase Query Performance Monitor |
| **Ukuran Kompresi Gambar (Sharp)** | **Avatar ≤ 150 KB, Bukti ≤ 500 KB** (Format WebP) | Service Media Validator |
| **Beban Query Direktori** | **0 masalah N+1 Query** | Profiling Read-Model Index |
