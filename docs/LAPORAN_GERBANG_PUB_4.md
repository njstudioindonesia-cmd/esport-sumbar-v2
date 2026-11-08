# LAPORAN GERBANG MUTU PUBLIKASI 4: DEPLOY PRODUKSI (SOFT LAUNCH, NOINDEX)
**Platform**: ESPORT SUMBAR™ (V3 Modular Monorepo)  
**Tanggal**: 8 November 2026  
**Target Rilis**: Produksi Soft Launch (`esport-sumbar-v2.vercel.app`)  
**Commit Hash**: `2acbf4cb9eef8ba3ffb907db185ee66b4ea39572`  
**Git Tags**: `v3.0.0-rc`, `pub-part-4`  
**Deployment Target**: Vercel Production (`sin1` - Singapore)  
**Status Soft Launch**: **AKTIF (noindex, nofollow, pendaftaran terkendali)**  

---

## 1. Ringkasan Eksekutif Bagian 4

Bagian 4 menandai fase **Peluncuran Terkendali (Soft Launch)** ke lingkungan produksi Vercel live dengan penegakan proteksi indeks mesin pencari (*zero indexing*), pembatasan registrasi publik untuk kelompok uji tertutup, kesiapan mode darurat pemeliharaan (*maintenance mode*), serta verifikasi langsung (live crawl) seluruh halaman publik dan endpoint latar belakang.

### Rangkuman Pekerjaan Kunci Bagian 4:
1. **Pembekuan Rilis (Release Freeze)**:
   - Repositori dibekukan pada commit `2acbf4c` dan diberi penanda resmi tag `v3.0.0-rc` serta `pub-part-4`.
2. **Penegakan `noindex, nofollow` di Produksi**:
   - Menambahkan aturan `isSoftLaunchNoIndex` di `apps/web/next.config.ts` dan `apps/web/src/app/robots.ts`.
   - Menguji langsung via `curl`:
     - Header respons `X-Robots-Tag: noindex, nofollow` terverifikasi aktif pada domain produksi.
     - `robots.txt` merespons dengan `Disallow: /` untuk seluruh *user-agent*.
3. **Pembatasan Pendaftaran Publik (Registration Toggle)**:
   - Ditambahkan getter `ENABLE_REGISTRATION` pada `apps/web/src/lib/config/flags.ts`.
   - Ditambahkan pengamanan pada `signUpAction` (`apps/web/src/app/actions/auth.ts`) untuk membatasi pendaftaran terbuka selama soft launch saat variabel `NEXT_PUBLIC_ENABLE_REGISTRATION=false`.
4. **Kesiapan Mode Pemeliharaan (Maintenance Mode - P14)**:
   - Halaman `/maintenance` bernuansa Liquid Glass terhubung dengan `apps/web/src/middleware.ts`.
   - Jika `MAINTENANCE_MODE=true` diaktifkan di dashboard Vercel, seluruh lalu lintas publik seketika dialihkan ke `/maintenance` secara aman tanpa memutus akses panel `/admin` dan health check `/api/healthz`.
5. **Crawl Live Produksi Otomatis (`scripts/crawl-live-production.js`)**:
   - Menjalankan crawl langsung pada 14 rute utama: `/`, `/about`, `/explore`, `/ecosystem`, `/terms`, `/privacy`, `/faq`, `/contact`, `/how-it-works`, `/verification-standard`, `/maintenance`, `/login`, `/register`, `/onboarding`.
   - **Hasil**: 0 kemunculan kata/klaim terlarang (`pbesi`, `pengprov`, `pengcab`, `koni`, `dispora`, `resmi`, `sah`), 0 placeholder (`[TENTUKAN]`, `TODO`, `Lorem`).
6. **Verifikasi Penjadwal Latar Belakang (Cron Dispatcher)**:
   - Menguji eksekusi live `/api/cron/dispatch` dengan header otentikasi Vercel Cron.
   - Hasil eksekusi: Status `success`, durasi `1,799ms`, 0 kegagalan outbox, 3 bucket storage (`avatars`, `gallery`, `evidence`) diaudit.

---

## 2. Evaluasi Matriks Gerbang Mutu (PG1 – PG13)

| Kode Gerbang | Deskripsi Evaluasi | Status | Bukti / Catatan Verifikasi Live |
|---|---|:---:|---|
| **PG1: Integritas Build Lokal & Produksi** | `build`, `type-check`, `test`, `lint` | **LULUS** | 150/150 rute terkompilasi bersih; 253/253 unit test Vitest lulus; 0 error TypeScript; 0 error ESLint. |
| **PG2: Kebersihan Rahasia** | Pemindaian rahasia ter-hardcode | **LULUS** | `node scripts/scan-secrets.js` mendeteksi 0 rahasia bocor di repositori. Kunci service role hanya diatur di runtime Vercel. |
| **PG3: Standarisasi Istilah & Klaim** | Larangan klaim sepihak & istilah pemerintah | **LULUS** | `node scripts/sweep-terms.js --strict` (0 temuan); `node scripts/crawl-live-production.js` (0 temuan di HTML live). |
| **PG4: Kesiapan Env Produksi** | Sinkronisasi variabel lingkungan & noindex | **LULUS** | `X-Robots-Tag: noindex, nofollow` terpasang live; `robots.txt` disallow `/`; project `prj_2mxHGeoyQgrgRW3uHtnUuUAxGqK6` region `sin1`. |
| **PG5: Integritas Rute & Navigasi** | Pengalihan 308, feature flags, sitemap | **LULUS** | Rute `/tournaments`, `/leaderboard`, `/gallery`, `/map` mengembalikan 404. Redirect 308 aktif untuk `/me/cards`, `/me/memberships`, `/me/profile/new`, `/me/profile/:id/edit`. |
| **PG6: Kinerja & Pemuatan Aset** | Core Web Vitals, prefetch, bundle size | **LULUS** | Partial Prefetching (PPR) aktif; Cache Components Turbopack aktif; woff2 fonts preloaded; Edge CDN caching Singapura. |
| **PG7: Aksesibilitas (a11y)** | Kepatuhan WCAG 2.1 AA | **LULUS** | Kontras warna Liquid Glass memenuhi rasio kontras AA/AAA; form and navigation elements ber-aria tags. |
| **PG8: Responsivitas Mobile** | Pengujian viewport 360px - 430px | **LULUS** | Mobile dashboard, mobile profile editor di `/me/edit`, dan kartu TCG ramah perangkat genggam tanpa clipping. |
| **PG9: Ketahanan Error & Fallback** | Halaman 404, maintenance, offline, boundaries | **LULUS** | Halaman 404 kustom dan `/maintenance` aktif; middleware mode pemeliharaan siap dialihkan dalam hitungan detik. |
| **PG10: Observabilitas & Healthz** | Endpoint healthz, cron outbox dispatch | **LULUS** | `/api/healthz` (200 OK); `/api/cron/dispatch` (200 OK via x-vercel-cron, 1,799ms); endpoint admin terkunci 401 Unauthorized. |
| **PG11: Kepemilikan Data & Kepatuhan** | Aturan 1 Akun 1 Entitas, isolasi peran admin | **LULUS** | Audit database live: 0 duplikasi profil per akun; 2 akun platform_admin 100% bebas dari profil entitas; teks privasi v3 aktif. |
| **PG12: Verifikasi Deployment Live** | Status Vercel deployment & aliasing | **LULUS** | Deployment aktif di domain kanonikal `https://esport-sumbar-v2.vercel.app` (sin1). |
| **PG13: Prosedur Rollback & Pemulihan** | Kesiapan runbook operasional rilis | **LULUS** | `docs/RUNBOOK-RILIS.md` dan `docs/RENCANA-MIGRASI-PRODUKSI.md` tersedia lengkap dengan skenario pemulihan seketika. |

---

## 3. Bukti Verifikasi Langsung (Live Production Verification)

### A. Uji Header Keamanan & Noindex Soft Launch
```http
GET https://esport-sumbar-v2.vercel.app/
HTTP/1.1 200 OK
Server: Vercel
X-Robots-Tag: noindex, nofollow
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https://*.supabase.co https://images.unsplash.com; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://vitals.vercel-insights.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'
X-Vercel-Id: sin1::...
```

### B. Uji `robots.txt` Live
```http
GET https://esport-sumbar-v2.vercel.app/robots.txt
HTTP/1.1 200 OK

User-Agent: *
Disallow: /

Sitemap: https://esport-sumbar-v2.vercel.app/sitemap.xml
```

### C. Uji Proteksi Endpoint Diagnostik & Admin (Publik Ditolak)
```http
GET https://esport-sumbar-v2.vercel.app/api/admin/build-info
HTTP/1.1 401 Unauthorized

GET https://esport-sumbar-v2.vercel.app/api/admin/accounts
HTTP/1.1 401 Unauthorized

GET https://esport-sumbar-v2.vercel.app/api/cron/dispatch
HTTP/1.1 401 Unauthorized
```

### D. Uji Eksekusi Terjadwal Latar Belakang (Vercel Cron)
```http
POST /api/cron/dispatch (Header: x-vercel-cron: 1)
HTTP/1.1 200 OK
{
  "executedAt": "2026-11-08T10:02:37.208Z",
  "status": "success",
  "outbox": { "processed": 0, "failed": 0 },
  "notifications": { "processed": 0, "sent": 0, "failed": 0, "deadLettered": 0 },
  "directory": {
    "scannedCount": 0,
    "fixedCount": 0,
    "missingProjectionsCount": 0,
    "staleProjectionsCount": 0,
    "orphanedProjectionsCount": 0
  },
  "mediaAuditReport": {
    "scannedBuckets": ["avatars", "gallery", "evidence"],
    "totalFilesScanned": 3,
    "orphanFilesCount": 2,
    "orphanBytesTotal": 0
  },
  "evidenceRetention": { "retentionDays": 90, "expiredEvidenceCount": 0, "status": "OK" },
  "durationMs": 1799
}
```

---

## 4. Status Menuju Bagian 5 (Peluncuran Publik & Hypercare)

Gerbang Mutu Publikasi 4 telah dinyatakan **LULUS 100%**.

Fase berikutnya adalah **BAGIAN 5: PELUNCURAN PUBLIK DAN 72-HOUR HYPERCARE** yang meliputi:
1. **Pelepasan Proteksi Noindex**:
   - Mengubah flag `NEXT_PUBLIC_PUBLIC_LAUNCH` menjadi `true`.
   - Mengizinkan perayapan mesin pencari di `robots.txt` (`Allow: /` kecuali admin/auth).
   - Menerbitkan `sitemap.xml` untuk pengindeksan publik.
2. **Pembukaan Pendaftaran Bertahap**:
   - Membuka `ENABLE_REGISTRATION = true`.
3. **Hypercare 72 Jam**:
   - Pemantauan real-time terhadap kuota Supabase, error rate, performa edge Singapura, dan antrean outbox/notifikasi.
4. **Penerbitan Laporan Akhir Publikasi (Gerbang 5)**.

> [!IMPORTANT]
> Sesuai protokol keselamatan rilis, sistem berhenti di titik ini. Silakan review hasil soft launch pada domain produksi (`https://esport-sumbar-v2.vercel.app`), lalu berikan instruksi **"lanjut"** untuk membuka peluncuran publik (Bagian 5).
