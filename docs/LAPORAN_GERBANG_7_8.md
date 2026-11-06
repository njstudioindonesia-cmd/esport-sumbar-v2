# Laporan Gerbang Mutu 7.8: Ketahanan & Observabilitas (Resilience, Probes & Fault Injection)

**Tanggal**: 6 November 2026  
**Proyek**: ESPORT SUMBAR V3  
**Status**: SELESAI & TERVERIFIKASI PENUH (Lolos G1–G10)  
**Tautan Git**: Tag `v3-part-7-8`

---

## 1. Ringkasan Sub-Langkah 7.8

Sesuai dengan **Mandat Transformasi V3 Bagian 7.8 (Ketahanan dan Observabilitas)**:
1. **Mesin Ketahanan Terdistribusi (@esport-sumbar/lib)**:
   - **`withTimeout`**: Membatasi batas waktu panggilan downstream (default 3–5 detik) dan melempar `TimeoutError` terukur untuk mencegah *hanging promises*.
   - **`withRetry`**: Algoritma coba ulang eksponensial dengan *Full Jitter* dan *Decorrelated Jitter* untuk mencegah lonjakan beban serentak (*thundering herd*). Hanya melakukan retry pada galat transien (*network error*, *timeout*, status HTTP 5xx / 429), dan mengabaikan galat klien (4xx).
   - **`CircuitBreaker`**: Mesin pemutus sirkuit 3 status (`CLOSED`, `OPEN`, `HALF_OPEN`) dengan registri global, batas kegagalan beruntun (*failure threshold*), jeda pemulihan (*cooldown*), dan ambang batas pulih (*half-open threshold*).
   - **`ResiliencePolicy`**: Orkestrator terpadu yang menggabungkan Circuit Breaker, Timeout, Retry, dan Fallback anggun (*graceful degradation*).
2. **Health Probes Mandiri (Liveness & Readiness)**:
   - **Liveness Probe (`/api/healthz`)**: Memverifikasi ketersediaan proses runtime server Next.js, uptime, penggunaan memori (heap & RSS), dan versi build V3.
   - **Readiness Probe (`/api/readyz`)**: Memverifikasi kesiapan seluruh subsistem secara komprehensif:
     - Konektivitas pangkalan data primer (Supabase).
     - Status sirkuit layanan notifikasi (`notification-service`).
     - Status sirkuit layanan media (`media-service`).
     - Kesiapan Read Model direktori (`directory-service`).
     - Mengembalikan HTTP 200 (`ready` atau `degraded` dengan degradasi anggun) dan HTTP 503 (`not_ready` hanya jika basis data primer putus total).
3. **Pusat Telemetri & Observabilitas Panel Admin (`/api/admin/observability`)**:
   - Menyediakan snapshot metrik latensi HTTP, error count, error rate, dan kondisi circuit breaker real-time.
   - Menyediakan kontrol interaktif bagi `platform_admin` untuk me-reset sirkuit (`reset_circuit_breaker`) atau mengaktifkan kill-switch pemeliharaan darurat (`trip_circuit_breaker`).
4. **Uji Kegagalan Terisolasi (Fault Injection Testing)**:
   - Membuktikan bahwa saat penyedia hilir (misal *email transporter*) tumbang atau melempar galat koneksi berulang:
     - Sirkuit secara otomatis berpindah ke `OPEN`.
     - Permintaan berikutnya langsung diputus (*short-circuited*) tanpa membebani layanan hilir.
     - Permintaan dialihkan secara transparan ke Dead-Letter Queue (DLQ).
     - Transaksi utama (pendaftaran profil, pengajuan verifikasi) tetap berhasil tanpa kendala.

---

## 2. Komponen & Berkas yang Dibangun / Dimodifikasi

| Komponen / Berkas | Deskripsi & Implementasi Teknis |
|---|---|
| `packages/lib/src/resilience/timeout.ts` | **Batas Waktu Terukur**: `withTimeout` dan `TimeoutError` berbasis `Promise.race` dengan pembersihan timer otomatis. |
| `packages/lib/src/resilience/retry.ts` | **Coba Ulang dengan Jitter**: `withRetry`, `calculateRetryDelay`, dan `defaultShouldRetry` dengan strategi Full/Decorrelated Jitter. |
| `packages/lib/src/resilience/circuit-breaker.ts` | **Pemutus Sirkuit Terkelola**: `CircuitBreaker`, `CircuitBreakerOpenError`, registri global, dan pelacakan statistik sirkuit. |
| `packages/lib/src/resilience/resilience-policy.ts` | **Kebijakan Ketahanan Terpadu**: `createResiliencePolicy` menggabungkan circuit breaker, timeout, retry, dan fallback. |
| `packages/lib/src/resilience/index.ts` | **Re-export Modul Ketahanan**: Mengekspos seluruh utilitas ketahanan ke paket `@esport-sumbar/lib`. |
| `apps/web/src/lib/observability/metrics.ts` | **Registri Metrik Sistem**: Pelacakan metrik HTTP, latensi per-rute, error rate, penggunaan RAM, dan statistik pemutus sirkuit. |
| `apps/web/src/app/api/healthz/route.ts` | **Liveness Probe**: Endpoint pemeriksaan keaktifan proses server Next.js. |
| `apps/web/src/app/api/readyz/route.ts` | **Readiness Probe**: Endpoint pemeriksaan kesiapan operasional seluruh subsistem & dependensi terdistribusi. |
| `apps/web/src/app/api/admin/observability/route.ts` | **Endpoint Observabilitas Admin**: Eksposur snapshot telemetri dan kontrol circuit breaker via BFF terproteksi. |
| `apps/web/src/lib/services/notifications/service.ts` | **Integrasi Kebijakan Ketahanan Notifikasi**: Membungkus pengiriman email dalam `notificationResiliencePolicy` dengan perlindungan DLQ. |
| `apps/web/src/lib/services/media.ts` | **Integrasi Kebijakan Ketahanan Media**: Menetapkan `mediaResiliencePolicy` untuk operasi penyimpanan berkas. |
| `apps/web/src/lib/services/directory/service.ts` | **Integrasi Kebijakan Ketahanan Direktori**: Menetapkan `directoryResiliencePolicy` dengan degradasi ke cache memori. |
| `packages/lib/src/__tests__/resilience.test.ts` | **Suite Uji Unit Ketahanan (11 Uji)**: Menguji timeout, exponential backoff, jitter, transisi sirkuit CLOSED->OPEN->HALF_OPEN->CLOSED, dan fallback. |
| `apps/web/src/__tests__/resilience-fault-injection.test.ts` | **Suite Uji Fault Injection (7 Uji)**: Simulasi kegagalan layanan hilir, pemutusan sirkuit, respon probe `/api/readyz`, dan aksi admin observabilitas. |

---

## 3. Hasil Verifikasi Gerbang Mutu (G1–G10)

| No | Kriteria Gerbang Mutu | Hasil Uji / Bukti | Status |
|:--:|---|---|:--:|
| **G1** | Suite Pengujian Menyeluruh | **15 berkas uji, 173 pengujian**: 100% LULUS (2.05 detik) | **PASS** |
| **G2** | Pemeriksaan Tipe TypeScript (`tsc --noEmit`) | 0 kesalahan pada seluruh 4 paket monorepo | **PASS** |
| **G3** | Kompilasi Produksi Next.js (`npm run build`) | 122 rute terkompilasi sukses (termasuk `/api/readyz` & `/api/admin/observability`) | **PASS** |
| **G4** | Sapu Istilah Terlarang (`scripts/sweep-terms.js`) | 0 kemunculan kata terlarang (ESI, PBESI, Pengcab, Pengprov, KONI, Dispora) | **PASS** |
| **G5** | Pemindaian Rahasia Bocor (`scripts/scan-secrets.js`) | 0 token/kunci ter-hardcode ditemukan | **PASS** |
| **G6** | Ketahanan Terhadap Kegagalan Hilir | Downstream crash tidak menggagalkan proses pemanggil; dialihkan ke fallback/DLQ | **PASS** |
| **G7** | Pemutus Sirkuit Otomatis (Circuit Breaker) | Sirkuit beralih ke `OPEN` setelah 4 kegagalan; panggilan berikutnya di-*short-circuit* | **PASS** |
| **G8** | Liveness Probe (`/api/healthz`) | Mengembalikan status 200 `healthy`, uptime, versi 3.0.0, dan memory usage | **PASS** |
| **G9** | Readiness Probe (`/api/readyz`) | Mengembalikan `ready` jika normal, dan `degraded` jika satu dependensi bermasalah | **PASS** |
| **G10** | Kontrol Observabilitas Admin | Aksi `reset_circuit_breaker` dan `trip_circuit_breaker` berfungsi secara deterministik | **PASS** |

---

## 4. Rencana Langkah Selanjutnya (Bagian 8: Pengelolaan Profesional dan Penutupan)

Dengan selesainya seluruh sub-langkah Bagian 7 (7.0 hingga 7.8), arsitektur monolit modular dan layanan mikro telah terbangun secara kokoh dan mandiri.

Langkah berikutnya adalah **Bagian 8: Pengelolaan Profesional dan Penutupan (Contract)**:
1. **8.1 Contract Cleanup (Destructive, dengan Konfirmasi)**: Menghapus sisa kolom/enum/kebijakan/rute lama dan purifikasi data sesuai regulasi privasi UU PDP No. 27/2022.
2. **8.2 Dokumentasi Komprehensif**: Pembaruan menyeluruh `README.md`, `ARCHITECTURE.md`, peta katalog peristiwa, ADR final, `SECURITY.md`, dan SOP verifikasi admin.
3. **8.3 Operasional & Kebijakan Retensi**: Panduan pencadangan (backup), drill pemulihan bencana (DR), dan pemantauan kuota penyimpanan.
4. **8.4 Keamanan**: Audit pengetatan CSP/HSTS, review RLS Supabase, dan rotasi rahasia.
5. **8.5 Kualitas & Aksesibilitas**: Verifikasi WCAG AA, Core Web Vitals, dan pembersihan duplikasi komponen.
6. **8.6 Legal & Kebijakan**: Finalisasi Syarat & Ketentuan, Kebijakan Privasi, dan Pernyataan Kepemilikan Tunggal ESPORT SUMBAR.
