# ADR-006: Arsitektur Microservices Pragmatis Berbasis Pola Hibrida (Option B)

## Status
Diusulkan untuk Persetujuan (*Proposed for Decision*)

## Konteks & Masalah
ESPORT SUMBAR V2 dibangun sebagai aplikasi Next.js monolitik yang langsung berinteraksi dengan Supabase PostgreSQL melalui client SSR/browser. Seiring pertumbuhan platform dan penambahan beban media, antrean verifikasi, notifikasi, serta direktori publik:
1. **Risiko Efek Domino (Blast Radius):** Kegagalan atau perlambatan di satu fitur (misalnya pemrosesan/kompresi gambar bukti verifikasi yang berat atau timeout pengiriman email notifikasi) dapat memperlambat pendaftaran profil atlet atau merusak performa landing page.
2. **Keterikatan Database Langsung (Tight Coupling):** Frontend Next.js memanggil tabel Supabase secara langsung; pergeseran skema atau perubahan aturan otorisasi dapat langsung merusak antarmuka.
3. **Beban Baca Direktori Publik:** Direktori publik dan pencarian profil atlet memiliki volume trafik baca (*read-heavy*) yang jauh lebih tinggi daripada transaksi tulis (*write-heavy*) pada verifikasi dan formulir. Monolit memperlakukan keduanya sama.

Namun, transisi langsung menuju microservices penuh (*Distributed Architecture*) untuk tim kecil membawa risiko over-engineering, biaya infrastruktur tinggi, kompleksitas jaringan, dan *distributed data inconsistency*.

---

## Analisis Opsi Arsitektur

### Opsi A: Pemecahan Penuh (Full Microservices - 11 Layanan Terpisah)
Setiap domain dipecah menjadi layanan independen: `auth-svc`, `profile-svc`, `media-svc`, `verification-svc`, `audit-svc`, `ecosystem-svc`, `catalog-svc`, `notification-svc`, `search-directory-svc`, `content-svc`, `gateway-bff`. Masing-masing memiliki repo/database terpisah.
- **Kelebihan:** Isolasi total; skalabilitas independen ekstrem.
- **Kekurangan:** Kompleksitas operasional sangat tinggi; distributed transactions (Saga); biaya database terpisah sangat mahal; tim kecil akan kewalahan mengelola 11 CI/CD pipeline dan observabilitasnya.

### Opsi B: Pragmatic Hybrid (Rekomendasi)
Pendekatan hibrida: Memisahkan domain dengan **beban I/O berat, asinkron, dan kritis** ke dalam microservices tersendiri, sementara domain inti bisnis terorganisir sebagai **modul batas-jelas (Clean Boundaries)** di dalam `core`:
1. `apps/web`: Lapisan antarmuka Next.js + BFF tipis (tanpa direct DB access).
2. `services/media`: Penanganan upload, validasi berkas asli (magic bytes), kompresi WebP (Sharp), siklus hidup berkas di private/public storage, dan pembersihan berkas yatim.
3. `services/notification`: Konsumsi antrean email dan notifikasi push in-app secara asinkron dengan dead-letter queue (DLQ) dan retry otomatis.
4. `services/directory`: **Read-model (CQRS)** terdenormalisasi untuk pencarian profil, statistik wilayah, dan direktori ekosistem dengan caching edge.
5. `services/verification`: Domain kritis status machine verifikasi, antrean SLA admin, dan append-only audit log.
6. `services/content`: CMS berita dan pengumuman komunitas.
7. `core (services/core)`: Domain `identity`, `profile`, `ecosystem`, dan `catalog` yang memiliki batasan modul dan schema PostgreSQL terpisah.
- **Kelebihan:** Mengisolasi titik paling rentan (media, email, search) tanpa lonjakan kompleksitas; jalur pemecahan masa depan sudah terbuka rapi.
- **Kekurangan:** Memerlukan disiplin tinggi dalam menjaga batas schema database dan outbox event.

### Opsi C: Monolit Modular (Modular Monolith)
Tetap dalam satu runtime Next.js tunggal, hanya memisahkan struktur folder kode ke dalam modul internal.
- **Kelebihan:** Paling sederhana, biaya hosting minimal.
- **Kekurangan:** Tidak ada isolasi proses runtime; kegagalan kompresi gambar atau antrean email tetap dapat mematikan seluruh aplikasi web.

### Matriks Perbandingan Trade-off

| Parameter | Opsi A (Penuh) | Opsi B (Hibrida - Rekomendasi) | Opsi C (Monolit Modular) |
|---|---|---|---|
| **Kompleksitas Operasional** | Sangat Tinggi (11 repo/deploy) | **Sedang / Terkelola** (Monorepo Turborepo) | Rendah (1 project) |
| **Biaya Infrastruktur** | Sangat Mahal | **Ekonomis** (Shared DB, Serverless/Hono) | Sangat Murah |
| **Isolasi Kegagalan (Fault Tolerance)** | Sempurna | **Sangat Baik** (Media & Notif terisolasi) | Lemah (Shared Process) |
| **Kecepatan Time-to-Market** | Lambat (2-3 bulan) | **Cepat & Terukur** (Bertahap) | Cepat (1-2 minggu) |
| **Kesiapan Skalabilitas Direktori** | Tinggi | **Sangat Tinggi** (CQRS terpisah) | Terbatas (Beban ke DB utama) |
| **Kesesuaian Tim** | Butuh tim DevOps khusus | **Ideal untuk Tim Kecil / Solo Lead** | Terbatas |

---

## Keputusan & Spesifikasi Arsitektur Opsi B

### 1. Pilihan Hosting & Runtime
- **Frontend & BFF (`apps/web`):** Next.js 16 di Vercel (Edge Middleware + Node.js Server Actions BFF).
- **Layanan Ringan (`services/*`):** TypeScript dengan framework **Hono** yang ultra-cepat dan berukuran ringan (<1MB bundle). Dapat di-deploy sebagai Vercel Serverless Functions terpisah atau container mandiri.
- **Pola Komunikasi:**
  - Browser/Klien **HANYA** berbicara ke Next.js BFF (`/api/*` atau Server Actions).
  - Browser **DILARANG** melakukan direct query ke tabel Supabase (Supabase JS di browser hanya untuk otentikasi sesi JWT pengguna).
  - Panggilan antar-layanan menggunakan HTTPS REST internal yang dilindungi JWT service token.

### 2. Strategi Data & Skema PostgreSQL
- Tetap menggunakan 1 klaster PostgreSQL Supabase yang tangguh, namun dibagi menjadi **Schema Terisolasi per Layanan**:
  - `media`: Tabel metadata file, kuota, job kompresi.
  - `notification`: Tabel antrean notifikasi, riwayat email, preferensi pengguna.
  - `directory`: Tabel read-model denormalisasi (`directory_profiles_index`, `ecosystem_graph_index`).
  - `verification`: Tabel `verification_requests`, `verification_reviews`, `audit_logs`.
  - `core`: Skema `core_identity`, `core_profiles`, `core_ecosystem`, `core_catalog`.
- **Aturan Integritas Data Lintas Layanan:**
  - **DILARANG KERAS melakukan SQL JOIN lintas schema.**
  - **DILARANG membuat Foreign Key (FK) fisik lintas schema layanan.** Keterhubungan data hanya mereferensikan UUID (`account_id`, `profile_id`).
  - Rekonsiliasi integritas dijalankan secara berkala oleh cron job background.

### 3. Mekanisme Peristiwa Asinkron (Transactional Outbox)
Untuk menghindari *dual-write problem*, setiap perubahan domain di `core` atau `verification` ditulis dalam satu transaksi PostgreSQL bersama dengan rekaman ke tabel `outbox_events`:
```sql
CREATE TABLE public.outbox_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name VARCHAR(100) NOT NULL,
    aggregate_type VARCHAR(50) NOT NULL,
    aggregate_id UUID NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- pending, processed, failed
    created_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);
```
- **Katalog Peristiwa Inti (`v1`):**
  - `AccountCreated`, `ProfileCreated`, `ProfileUpdated`, `ProfileDeleted`, `ProfileSuspended`
  - `MediaReplaced`, `MediaDeleted`
  - `RelationRequested`, `RelationApproved`, `RelationEnded`
  - `VerificationSubmitted`, `VerificationDecided`
- **Penyaluran Peristiwa:**
  - Worker membaca outbox dan meneruskannya ke antrean berbasis HTTP (Upstash QStash / Vercel Queue).
  - Konsumen bersifat **Idempoten** (mencatat `processed_events(event_id)` untuk mencegah eksekusi ganda).

### 4. Keamanan & Rahasia
- `apps/web` **TIDAK LAGI MEMILIKI** `SUPABASE_SERVICE_ROLE_KEY`. Kunci admin service role hanya berada di server layanan backend (`verification` dan `media`).
- Validasi identitas pengguna di semua microservices dilakukan secara mandiri dengan memverifikasi tanda tangan JWT Supabase menggunakan publik JWKS (`/.well-known/jwks.json`).

---

## Rencana Migrasi Bertahap (Strangler Fig Pattern)

Migrasi dilakukan secara bertahap tanpa downtime melalui 8 sub-langkah di Bagian 7:
1. **Langkah 7.0 (Kontrak & Outbox):** Rilis paket `packages/contracts` (skema Zod v1 & event types) dan tabel `outbox_events` di monolit.
2. **Langkah 7.1 (Ekstrak `media`):** Bangun Hono service untuk penandatanganan upload dan kompresi Sharp. Jalankan *shadow execution* di belakang feature flag `FF_USE_MEDIA_SERVICE`.
3. **Langkah 7.2 (Ekstrak `notification`):** Pindahkan pengiriman email dan in-app notification ke worker mandiri.
4. **Langkah 7.3 (Ekstrak `directory`):** Bentuk read-model terdenormalisasi yang disuplai oleh event outbox. Pindahkan kueri publik direktori ke read-model.
5. **Langkah 7.4 (Ekstrak `verification` & `audit`):** Pindahkan status machine verifikasi dan antrean admin ke layanan verifikasi khusus.
6. **Langkah 7.5 (Ekstrak `content`):** Pindahkan modul berita/CMS.
7. **Langkah 7.6 (Modularisasi `core`):** Tegakkan batas schema di PostgreSQL (`identity`, `profile`, `ecosystem`, `catalog`).
8. **Langkah 7.7 (BFF & Eliminasi Direct Access):** Cabut akses direct query Supabase dari klien Next.js; hapus `SUPABASE_SERVICE_ROLE_KEY` dari frontend.

### Kriteria Cutover & Rollback per Langkah
- **Kriteria Cutover:** Shadow traffic berjalan minimal 24 jam dengan tingkat error < 0.01% dan latensi p95 < 250ms.
- **Rencana Rollback:** Setiap langkah dilindungi Feature Flag berbasis runtime. Jika terjadi kegagalan tak terduga, flag langsung dimatikan (*toggle off*) untuk mengembalikan alur ke kode lama dalam < 5 detik tanpa deploy ulang.
