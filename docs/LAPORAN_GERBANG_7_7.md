# Laporan Gerbang Mutu 7.7: BFF & Eliminasi Akses Langsung Database dari Web

**Tanggal**: 6 November 2026  
**Proyek**: ESPORT SUMBAR V3  
**Status**: SELESAI & TERVERIFIKASI PENUH (Lolos G1–G10)  
**Tautan Git**: Tag `v3-part-7-7`

---

## 1. Ringkasan Sub-Langkah 7.7

Sesuai dengan **Mandat Transformasi V3 Bagian 7.7 (BFF dan Penghapusan Akses Langsung Database dari Web)**:
1. **Browser Hanya Memakai Supabase untuk Auth**: Seluruh antarmuka web klien (komponen browser `"use client"`) tidak lagi memiliki kueri langsung ke tabel pangkalan data Supabase (`.from(...)`). Supabase JS di browser murni hanya digunakan untuk manajemen sesi otentikasi (`supabase.auth.*`).
2. **Semua Data Melalui BFF -> Layanan**: Seluruh mutasi dan pembacaan data transaksional dialihkan secara ketat melalui Backend-for-Frontend (BFF / Next.js Route Handlers di `/api/*`).
3. **Token Layanan Antar-Layanan Berumur Pendek (Short-Lived Service Tokens)**: Menerapkan penandatanganan dan verifikasi token internal HMAC-SHA256 berumur pendek (TTL 5 menit) untuk panggilan terisolasi antar-layanan (`issueServiceToken`, `verifyServiceToken`).
4. **Verifikasi JWT & Sesi Berlapis**: `api-guard` memvalidasi token secara bertingkat: Service Token -> Bearer JWT Supabase -> Cookie Sesi SSR, dengan penegakan peran tunggal `platform_admin`.
5. **Eliminasi Total Service Role Key dari Web**: Tidak ada token dengan hak istimewa tinggi (`SUPABASE_SERVICE_ROLE_KEY`) yang bocor atau dapat diakses oleh bundle JavaScript peramban. Diverifikasi dengan skrip otomatis `scripts/verify-client-db-isolation.js`.
6. **Kebijakan CORS Ketat**: Menerapkan validasi origin yang ketat, menolak wildcard (`*`) pada rute terotentikasi, dan melayani preflight `OPTIONS` secara aman (204 No Content untuk origin sah, 403 Forbidden untuk origin asing).
7. **Batas Laju (Rate Limiting) Berlapis**: Menerapkan algoritma sliding-window berbasis IP dan User ID dengan 4 tingkatan limit: Publik (120 req/m), Otentikasi (60 req/m), Admin (120 req/m), dan Sensitif (15 req/m) dengan header `Retry-After`, `X-RateLimit-Limit`, `X-RateLimit-Remaining`, dan `X-RateLimit-Reset`.

---

## 2. Komponen & Berkas yang Dibangun / Dimodifikasi

| Komponen / Berkas | Deskripsi & Implementasi Teknis |
|---|---|
| `apps/web/src/lib/auth/service-token.ts` | **Penerbit & Verifikator Token Layanan**: Menghasilkan JWT internal berbasis HMAC-SHA256 dengan masa aktif 5 menit, validasi penerbit (`iss`), audiens (`aud`), dan klaim scope. |
| `apps/web/src/lib/security/cors.ts` | **Manajemen CORS Ketat**: Penegakan daftar origin terpercaya, pencegahan wildcard credentials, dan penanganan preflight `OPTIONS`. |
| `apps/web/src/lib/security/rate-limiter.ts` | **Mesin Batas Laju (Rate Limiting)**: Sliding window rate limiter in-memory dengan 4 tingkatan kuota dan emisi header HTTP standar. |
| `apps/web/src/lib/auth/api-guard.ts` | **Penjaga API Berlapis**: Verifikasi Service Token, Supabase Bearer JWT, dan Cookie Sesi dengan penolakan akses non-admin secara tegas. |
| `apps/web/src/middleware.ts` | **Middleware Keamanan & Tracing**: Propagasi `x-request-id`, header keamanan OWASP (`nosniff`, `DENY`, `preload`), dan penanganan CORS preflight otomatis pada `/api/*`. |
| `apps/web/src/app/api/admin/games/route.ts` | **BFF Endpoint Admin Games**: Route handler terproteksi untuk memuat katalog game, role, dan tier rank tanpa kueri langsung browser. |
| `apps/web/src/app/admin/games/page.tsx` | **Refactoring UI Admin Games**: Menghapus `supabase.from("games")`, dialihkan ke `fetch('/api/admin/games')`. |
| `apps/web/src/components/dashboard/DesktopUserShell.tsx` | **Refactoring Dashboard Shell**: Menghapus kueri langsung `accounts` dan `profiles`, dialihkan ke BFF `/api/me/profiles`. |
| `apps/web/src/app/me/profile/page.tsx` | **Refactoring Smart Redirector**: Menggunakan `getProfileByAccountId` dari modular core profile service. |
| `scripts/verify-client-db-isolation.js` | **Skrip Audit Keamanan Klien**: Memverifikasi secara deterministik bahwa 0 komponen `"use client"` memanggil basis data secara langsung atau memegang kunci `service_role`. |
| `apps/web/src/__tests__/bff-security.test.ts` | **Suite Uji Keamanan BFF (16 Pengujian)**: Menjamin token berumur pendek, penolakan token rusak/kedaluwarsa, kuota rate limiting 429, kepatuhan CORS, dan isolasi klien. |

---

## 3. Hasil Verifikasi Gerbang Mutu (G1–G10)

| No | Kriteria Gerbang Mutu | Hasil Uji / Bukti | Status |
|:--:|---|---|:--:|
| **G1** | Suite Pengujian Menyeluruh | **13 berkas uji, 155 pengujian**: 100% LULUS (1.65 detik) | **PASS** |
| **G2** | Pemeriksaan Tipe TypeScript (`tsc --noEmit`) | 0 kesalahan pada seluruh 4 paket monorepo | **PASS** |
| **G3** | Kompilasi Produksi Next.js (`npm run build`) | 120 rute (statis, dinamis, PPR) terkompilasi sukses dalam 17.2 detik | **PASS** |
| **G4** | Sapu Istilah Terlarang (`scripts/sweep-terms.js`) | 0 kemunculan kata terlarang (ESI, PBESI, Pengcab, Pengprov, KONI, Dispora) | **PASS** |
| **G5** | Pemindaian Rahasia Bocor (`scripts/scan-secrets.js`) | 0 kunci/token ter-hardcode ditemukan | **PASS** |
| **G6** | Isolasi Klien Browser (Zero Direct DB Calls) | 0 panggilan `.from(...)` di seluruh komponen klien (`"use client"`) | **PASS** |
| **G7** | Zero Service Role Key di Browser | 0 referensi `SUPABASE_SERVICE_ROLE_KEY` di seluruh bundle frontend klien | **PASS** |
| **G8** | Token Layanan Antar-Layanan Berumur Pendek | Token 5 menit terverifikasi, token manipulasi/kedaluwarsa ditolak | **PASS** |
| **G9** | Penegakan Batas Laju (Rate Limit 429) | Kuota terlampaui memicu status HTTP 429 dengan header `Retry-After` | **PASS** |
| **G10** | Kebijakan CORS Ketat | Origin liar ditolak (403), origin sah dilayani dengan header terisolasi tanpa `*` | **PASS** |

---

## 4. Rencana Sub-Langkah Selanjutnya

Sub-langkah berikutnya adalah **Sub-langkah 7.8 (Ketahanan & Observabilitas)**:
1. Endpoint pemeriksaan kesehatan terpadu: `/api/healthz` (liveness) dan `/api/readyz` (readiness) untuk seluruh layanan terekstraksi.
2. Mekanisme ketahanan: timeout, retry-jitter idempoten, circuit breaker, bulkhead, dan degradasi anggun (*graceful degradation*).
3. Dead-letter queue inspection dan monitoring error rate.
4. Uji kegagalan terisolasi (*fault injection tests*): simulasi satu layanan downstream non-aktif atau mengalami timeout dan verifikasi sistem lain tetap berfungsi dengan fallback transparan.
