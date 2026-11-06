# LAPORAN GERBANG KUALITAS 7.0 (G7.0)
## Transformasi ESPORT SUMBAR V3 — Sub-langkah 7.0: Kontrak Paket & Transactional Outbox Engine di Monolit

**Tanggal Penyelesaian**: 6 November 2026  
**Status**: LULUS (Semua Gerbang Kualitas G7.0 Terpenuhi)  
**Git Tag**: `v3-part-7-0`  

---

### 1. Ringkasan Eksekutif Sub-langkah 7.0

Sub-langkah 7.0 meletakkan fondasi arsitektur microservices pragmatis (Opsi B: Pragmatic Hybrid sesuai ADR-006) tanpa mengubah perilaku monolit yang sedang berjalan (*zero behavior change*):

1. **Paket Kontrak Domain Terpadu (`@esport-sumbar/contracts`)**:
   - **Skema Zod v1**: Mendefinisikan seluruh kontrak tipe data untuk Profil (`profile.ts`), Media (`media.ts`), Notifikasi (`notification.ts`), Audit (`audit.ts`), Verifikasi (`verification.ts`), Relasi (`relations.ts`), dan Katalog Game (`catalog.ts`).
   - **Katalog Peristiwa Domain (`DOMAIN_EVENT_CATALOG`)**: Mendaftarkan 13 peristiwa domain inti (`AccountCreated`, `ProfileCreated`, `ProfileUpdated`, `ProfileDeleted`, `ProfileSuspended`, `MediaReplaced`, `MediaDeleted`, `RelationRequested`, `RelationApproved`, `RelationEnded`, `VerificationSubmitted`, `VerificationDecided`, `GameChanged`) lengkap dengan metadata produsen dan konsumen asinkronnya.
   - **Spesifikasi OpenAPI v1 (`openapi.ts`)**: Spesifikasi OpenAPI 3.0.3 resmi untuk antarmuka gateway BFF dan kontrak endpoint antar-layanan.

2. **Transactional Outbox Engine (`@esport-sumbar/lib/outbox`)**:
   - Fungsi `createOutboxEvent`: Menghasilkan envelope peristiwa standar W3C/RFC dengan status `pending`, retry count 0, timestamp ISO, correlation ID, dan idempotency key.
   - Fungsi `publishOutboxEvent`: Menulis rekaman peristiwa secara atomik ke tabel `public.outbox_events` di Supabase.
   - Fungsi `processOutboxBatch`: Worker engine tangguh yang mengambil batch event berstatus `pending`, mendispatch ke handler konsumen terdaftar, menandai `processed` dengan timestamp eksekusi, serta menangani kegagalan dengan kenaikan `retry_count` dan status `failed` jika melewati batas maksimum retries (default 3x).

3. **Jaminan Kunci Idempotensi (`@esport-sumbar/lib/idempotency`)**:
   - `generateDeterministicIdempotencyKey`: Menghasilkan hash SHA-256 deterministik dari parameter mutasi untuk mencegah eksekusi berulang.
   - `withIdempotency`: Wrapper operasi bisnis yang memastikan mutasi hanya dieksekusi sekali; permintaan duplikat berikutnya dengan kunci yang sama mengembalikan hasil cache (*cached response*) tanpa memicu efek samping ganda.

4. **Korelasi Permintaan Terpadu `x-request-id` (`@esport-sumbar/lib/correlation` & `middleware.ts`)**:
   - Middleware aplikasi web Next.js mengekstrak header `x-request-id` dari klien atau menghasilkan ID korelasi unik baru `req-${randomUUID()}`.
   - ID korelasi disematkan ke header request downstream dan response header untuk pelacakan *end-to-end distributed tracing*.

5. **Pencatatan Struktural Aman (`@esport-sumbar/lib/logger`)**:
   - Seluruh log diterbitkan dalam format JSON terstruktur dengan level, timestamp, dan context korelasi.
   - Mekanisme penyensoran otomatis (*sanitization engine*) secara ketat menyamarkan kunci sensitif (`password`, `token`, `secret`, `authorization`, `service_role`, `apikey`, `ktp`, `nik`).

6. **Nol Perubahan Perilaku (Zero Behavior Change)**:
   - Seluruh alur pendaftaran, wizard profil, penjelajahan direktori, dan panel admin berjalan 100% identik tanpa regresi fungsional.

---

### 2. Berkas yang Dibuat & Dimodifikasi

#### A. Berkas Baru
- `packages/contracts/src/schemas/profile.ts` (Skema Zod pembuatan, pembaruan, dan tampilan profil publik)
- `packages/contracts/src/schemas/media.ts` (Skema tanda tangan unggah media, batas 5MB, dan tipe WebP/JPEG/PNG)
- `packages/contracts/src/schemas/notification.ts` (Skema muatan notifikasi email/in-app dan preferensi)
- `packages/contracts/src/schemas/audit.ts` (Skema pencatatan audit log append-only)
- `packages/contracts/src/openapi.ts` (Spesifikasi OpenAPI 3.0.3 API v1)
- `packages/lib/src/correlation.ts` (Utilitas ekstraksi dan pembuatan correlation ID x-request-id)
- `packages/lib/src/idempotency.ts` (Mesin jaminan idempotensi deterministik)
- `packages/lib/src/outbox.ts` (Factory dan worker processor Transactional Outbox)
- `apps/web/src/__tests__/contracts-and-outbox.test.ts` (Rangkaian 11 pengujian unit untuk kontrak, outbox, idempotensi, dan korelasi)

#### B. Berkas yang Dimodifikasi
- `packages/contracts/src/events.ts` (Penyempurnaan EventMetadata dengan idempotencyKey dan katalog DOMAIN_EVENT_CATALOG)
- `packages/contracts/src/index.ts` (Ekspor seluruh skema kontrak baru)
- `packages/lib/src/index.ts` (Ekspor modul correlation, idempotency, dan outbox)
- `apps/web/src/middleware.ts` (Injeksi dan propagasi header x-request-id)

---

### 3. Hasil Pengujian & Verifikasi Kualitas (Gerbang G7.0)

| Pengujian / Validasi | Perintah | Target | Hasil |
| :--- | :--- | :--- | :--- |
| **Sapu Istilah Terlarang** | `node scripts/sweep-terms.js` | 0 temuan | **LULUS (0 temuan)** |
| **Pemindaian Rahasia** | `node scripts/scan-secrets.js` | 0 temuan | **LULUS (0 rahasia)** |
| **Pemeriksaan Tipe TypeScript** | `npm run type-check` | 0 error | **LULUS (3 paket, 0 error)** |
| **Unit & Contract Testing** | `npm test` | 100% pass | **LULUS (6 suite, 41 test pass)** |
| **Kompilasi & Build Produksi** | `npm run build` | 0 error | **LULUS (105/105 rute berhasil dibangun)** |

---

### 4. Checklist Kepatuhan Mandat V3 pada Sub-langkah 7.0

- [x] **Mandat 7.0.1**: Paket `contracts` memuat skema Zod v1 lengkap, spesifikasi OpenAPI v1, dan katalog peristiwa domain.
- [x] **Mandat 7.0.2**: Pola Transactional Outbox terimplementasi dengan envelope peristiwa standar, status tracking, dan worker retry.
- [x] **Mandat 7.0.3**: Jaminan kunci idempotensi (`idempotencyKey`) aktif mencegah eksekusi ganda pada operasi kritis.
- [x] **Mandat 7.0.4**: Header korelasi `x-request-id` disuntikkan dan dipropagasi oleh middleware.
- [x] **Mandat 7.0.5**: Logger struktural JSON menyamarkan seluruh data sensitif (password, token, ktp, nik, secret).
- [x] **Mandat 7.0.6**: Nol regresi dan nol perubahan perilaku pada antarmuka monolit.
