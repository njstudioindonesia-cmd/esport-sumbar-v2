# LAPORAN GERBANG 1: ANALISIS MENDALAM, ADR, DAN RENCANA MIGRASI
**Transformasi ESPORT SUMBAR V2 → V3**  
**Tanggal:** 6 November 2026  
**Peran:** Principal Engineer, Software Architect, Database Architect, QA Lead  
**Status Tahapan:** SELESAI (Tanpa Ubah Kode Produksi / Database)  
**Dokumen Terbit:**
- [`docs/adr/ADR-001-single-owner-and-verification.md`](file:///d:/AI%20AGENT/ESPORT%20SUMBAR%20V2/docs/adr/ADR-001-single-owner-and-verification.md)
- [`docs/adr/ADR-002-rbac-user-and-platform-admin.md`](file:///d:/AI%20AGENT/ESPORT%20SUMBAR%20V2/docs/adr/ADR-002-rbac-user-and-platform-admin.md)
- [`docs/adr/ADR-003-single-account-single-profile.md`](file:///d:/AI%20AGENT/ESPORT%20SUMBAR%20V2/docs/adr/ADR-003-single-account-single-profile.md)
- [`docs/adr/ADR-004-data-driven-ecosystem-relations.md`](file:///d:/AI%20AGENT/ESPORT%20SUMBAR%20V2/docs/adr/ADR-004-data-driven-ecosystem-relations.md)
- [`docs/adr/ADR-005-dynamic-game-catalog.md`](file:///d:/AI%20AGENT/ESPORT%20SUMBAR%20V2/docs/adr/ADR-005-dynamic-game-catalog.md)
- [`docs/adr/ADR-006-microservices-hybrid-architecture.md`](file:///d:/AI%20AGENT/ESPORT%20SUMBAR%20V2/docs/adr/ADR-006-microservices-hybrid-architecture.md)
- [`docs/DATA_MIGRATION_PLAN_V3.md`](file:///d:/AI%20AGENT/ESPORT%20SUMBAR%20V2/docs/DATA_MIGRATION_PLAN_V3.md)
- [`docs/ROUTE_PLAN_V3.md`](file:///d:/AI%20AGENT/ESPORT%20SUMBAR%20V2/docs/ROUTE_PLAN_V3.md)
- [`docs/TEST_PLAN_V3.md`](file:///d:/AI%20AGENT/ESPORT%20SUMBAR%20V2/docs/TEST_PLAN_V3.md)

---

## 1. Pemetaan Domain Model V2 (Eksisting) vs V3 (Target)

| Dimensi Arsitektur | Kondisi V2 Eksisting | Target Desain V3 (Sesuai ADR) |
|---|---|---|
| **Kepemilikan & Otoritas** | Terikat struktur Pengcab & Pengprov ESI, KONI, PBESI | **100% Kepemilikan Tunggal ESPORT SUMBAR** (ADR-001) |
| **Alur Verifikasi** | Dua tahap berjenjang: Pengcab (`region_admin`) → Pengprov (`prov_admin`) | **Satu tahap langsung** oleh tim `platform_admin` ESPORT SUMBAR (ADR-001) |
| **Peran Pengguna (RBAC)** | 4 peran: `user`, `region_admin`, `prov_admin`, `platform_operator` | **2 peran saja**: `user` dan `platform_admin`. Admin dilarang memiliki profil entitas (ADR-002) |
| **Kardinalitas Akun-Profil** | 1 akun : N profil (multi-profil aktif) | **1 akun : 1 profil** (`UNIQUE(account_id)`). Jenis entitas tidak dapat diubah (ADR-003) |
| **Ekosistem & Relasi** | Tabel relasi dasar tanpa aturan terstruktur | **Berbasis data deklaratif** (`relation_rules`): kuota aktif, batasan game, validasi 2 arah (ADR-004) |
| **Katalog Game** | Daftar game terbatas, role di-hardcode di kode frontend | **Dinamis berbasis database** (`games`, `game_roles`, `game_ranks`), ditambah Honor of Kings (HOK) (ADR-005) |
| **Arsitektur Sistem** | Next.js monolitik terikat langsung ke tabel Supabase | **Pragmatic Hybrid Microservices (Opsi B)**: BFF tipis + layanan `media`, `notification`, `directory`, `verification` terisolasi (ADR-006) |
| **Rute Admin** | 3 dasbor terpisah (`/admin/platform`, `/admin/province`, `/admin/region`) | **1 panel terpusat** di `/admin/*`. Rute lama dialihkan permanen (301) (Route Plan) |
| **Data Sensitif KTP/NIK** | Disebut di teks UI dan berkas `evidence` | **Pengumpulan dihentikan total**; diganti tangkapan layar IGN, kartu pelajar/mahasiswa, papan nama venue |

---

## 2. Ringkasan 6 Architecture Decision Records (ADRs)

1. **ADR-001 (Satu Pemilik & Verifikasi 1 Tahap):** Menetapkan ESPORT SUMBAR sebagai satu-satunya penerbit sertifikat digital. Menghapus alur Pengcab/Pengprov. Format ID menjadi `ESP-SB-VER-YYYY-XXXX`. Transisi verifikasi dikunci dalam 1 RPC PostgreSQL transaksional append-only.
2. **ADR-002 (Peran `user` & `platform_admin`):** Menghapus peran kedaerahan. Admin lama didowngrade ke `user`. Menegakkan aturan pemisahan kepentingan (*Separation of Duties*): admin dilarang memverifikasi akunnya sendiri.
3. **ADR-003 (Satu Akun Satu Bidang):** Menegakkan konstrain `UNIQUE(account_id)` pada tabel `profiles` dan trigger `prevent_entity_type_change`. Menghapus Profile Switcher. Profil ganda lama diarsipkan secara aman ke `profiles_archived`.
4. **ADR-004 (Ekosistem Keterhubungan Berbasis Data):** Mendefinisikan tabel `relation_rules` yang mengatur kuota maksimal, kecocokan game, masa kedaluwarsa 14 hari, dan perlindungan privasi pelajar (<18 tahun).
5. **ADR-005 (Katalog Game Dinamis):** Seluruh game, roles, dan ranks disimpan di database. Menambahkan Honor of Kings (HOK). Menghindari pelanggaran hak merek dengan menggunakan ikon netral berbasis genre visual.
6. **ADR-006 (Arsitektur Microservices Pragmatis - Opsi B):** Menyajikan perbandingan mendalam Opsi A (11 layanan penuh) vs Opsi B (Hibrida 6 layanan + core terisolasi) vs Opsi C (Monolit). Memilih Opsi B untuk mengamankan proses I/O berat (Media kompresi Sharp, Email asinkron, Direktori CQRS) dengan transactional outbox dan JWKS auth tanpa service role di browser.

---

## 3. Rencana Migrasi Data (Expand -> Migrate -> Contract)

- **Tahap 1 (EXPAND - Bagian 3):** Menambahkan enum peran baru, tabel `games`, `game_roles`, `game_ranks`, `relation_rules`, `profiles_archived`, dan `outbox_events`. Nol dampak pada sistem berjalan.
- **Tahap 2 (MIGRATE - Bagian 3):** Memetakan status verifikasi (`prov_verified` → `verified`), mengonversi peran admin lama ke `user`, memindahkan profil ganda sekunder ke `profiles_archived`, memasang konstrain `UNIQUE(account_id)` dan trigger pencegahan ganti entitas.
- **Tahap 3 (CONTRACT - Bagian 8):** Pembersihan destruktif atas persetujuan: menghapus kolom `regions.esi_contact_name`, purge berkas sensitif lama setelah masa retensi 30 hari.

---

## 4. Rencana Rute (301 Redirects & RBAC)

- Rute lama `/admin/region/*` dialihkan 301 ke `/admin`.
- Rute lama `/admin/province/*` dialihkan 301 ke `/admin`.
- Halaman `/partners` dialihkan 301 ke `/about`.
- Panel admin terpusat di `/admin` dengan 9 sub-halaman fungsional (Verifikasi SLA, Manajemen Pengguna, Ekosistem, Katalog Game, Wilayah Geografis, CMS Berita, Audit Log).

---

## 5. Rencana Pengujian & Anggaran Performa

- **Uji Keamanan & RLS:** 6 skrip verifikasi otomatis (isolasi privat, larangan multi-profil, larangan admin memverifikasi diri sendiri).
- **Uji Aturan Ekosistem:** Pengujian pasangan terlarang, kecocokan game, dan masa kedaluwarsa 14 hari.
- **Anggaran Performa:**
  - First Load JS Publik: ≤ 140 kB
  - Largest Contentful Paint (LCP): < 2.5 detik
  - Latensi API Baca Direktori: p95 < 300 ms
  - Latensi RPC Verifikasi: p95 < 500 ms (termasuk audit log)

---

## 6. Evaluasi Protokol Gerbang Mutu 1 (G1–G10)

| Gerbang | Evaluasi | Status | Bukti / Catatan |
|---|---|---|---|
| **G1: Tinjau Diff** | Hanya penambahan berkas ADR & rencana dokumentasi di `docs/`. Nol kode produksi diubah. | **LULUS** | `git status` mengonfirmasi hanya file di `docs/` yang baru. |
| **G2: Statis** | TypeScript type-check lulus bersih (0 error). | **LULUS** | `npx tsc --noEmit` lolos 100%. |
| **G3: Tes** | Strategi uji RLS, pengujian aturan relasi, dan skenario E2E selesai disusun. | **LULUS** | Tercantum di [`docs/TEST_PLAN_V3.md`](file:///d:/AI%20AGENT/ESPORT%20SUMBAR%20V2/docs/TEST_PLAN_V3.md). |
| **G4: Sapu Istilah** | Seluruh ADR dan dokumen target V3 bersih dari istilah terlarang di luar pengecualian. | **LULUS** | Istilah terlarang hanya disebut dalam konteks analisis perbedaan V2 vs V3. |
| **G5: Database** | Rencana 6 berkas migrasi SQL (Expand-Migrate-Contract) dipetakan dengan skema rollback. | **LULUS** | Tercantum di [`docs/DATA_MIGRATION_PLAN_V3.md`](file:///d:/AI%20AGENT/ESPORT%20SUMBAR%20V2/docs/DATA_MIGRATION_PLAN_V3.md). |
| **G6: Keamanan** | Penetapan zero-trust, RBAC terpusat, eliminasi service role di browser, dan MFA admin. | **LULUS** | Ditetapkan di ADR-002 dan ADR-006. |
| **G7: Regresi** | Tidak ada gangguan runtime aplikasi yang sedang berjalan di produksi. | **LULUS** | Vercel production tetap stabil. |
| **G8: Performa** | Anggaran performa (LCP < 2.5s, First load JS ≤ 140kB) terkunci. | **LULUS** | Ditetapkan di dokumen Test Plan. |
| **G9: Jejak Persyaratan** | Analisis dan spesifikasi arsitektur untuk seluruh 9 mandat telah selesai 100%. | **LULUS** | Matriks target V3 terpetakan. |
| **G10: Laporan & Berhenti** | Laporan resmi Gerbang 1 diterbitkan; sistem berhenti menunggu konfirmasi keputusan pengguna. | **LULUS** | Menunggu keputusan pengguna atas 5 pertanyaan kunci. |

---

## 7. Daftar Keputusan Terbuka (Maksimal 5 Pertanyaan Kunci)

Mohon konfirmasi Anda atas 5 keputusan paling berdampak berikut:

1. **Arsitektur Microservices (D5):** Apakah Anda menyetujui **Opsi B (Pragmatic Hybrid)**: memisahkan layanan berat (`media`, `notification`, `directory` CQRS, dan `verification`) ke Hono microservices, sementara modul inti bisnis (`core`) tetap di dalam monorepo dengan skema database terisolasi?
2. **Penanganan Akun Admin Lama (D1):** Apakah Anda menyetujui akun mantan `region_admin` dan `prov_admin` otomatis diturunkan (*downgraded*) menjadi `user`, dan hanya akun yang Anda tunjuk yang diangkat menjadi `platform_admin`?
3. **Akun Multi-Profil (D2):** Apakah Anda menyetujui sistem mempertahankan 1 profil tertua/terlengkap/terverifikasi, dan mengarsipkan profil sekunder ke `profiles_archived`?
4. **Profil Terverifikasi Eksisting (D3):** Apakah status profil yang sudah `prov_verified` di V2 otomatis dipertahankan dengan label baru *"Terverifikasi ESPORT SUMBAR"* dengan masa berlaku tetap 12 bulan?
5. **Domain Resmi (D7):** Apakah untuk sementara tetap menggunakan domain Vercel (`esport-sumbar-v2.vercel.app` atau preview staging), atau Anda sudah memiliki domain kustom resmi (seperti `esportsumbar.id`) untuk disiapkan konfigurasinya?

*(Jika Anda setuju dengan seluruh rekomendasi default di atas, cukup jawab **"ikuti default dan lanjut"**).*

---
**STATUS: BERHENTI MENUNGGU KEPUTUSAN PENGGUNA.**  
Ketik jawaban Anda atau **"ikuti default dan lanjut"** untuk memulai **BAGIAN 2: FONDASI REPOSITORI DAN KUALITAS (tanpa ubah perilaku produk)**.
