# Laporan Gerbang Mutu 7.6: Modularisasi `core` (Identity, Profile, Ecosystem, Catalog)

**Tanggal**: 6 November 2026  
**Proyek**: ESPORT SUMBAR V3  
**Status**: SELESAI & TERVERIFIKASI PENUH (Lolos G1–G10)  
**Tautan Git**: Tag `v3-part-7-6`

---

## 1. Ringkasan Modularisasi Core

Sesuai dengan **Mandat Transformasi V3 Bagian 7.6 (Strangler Fig Pattern: Modularisasi Subdomain Core)**, monolit inti telah dipecah menjadi 4 subdomain mandiri berkohesi tinggi dengan batas impor (*import boundaries*) yang ditegakkan secara ketat dan eliminasi penuh kueri SQL `JOIN` lintas domain.

Layanan inti kini terbagi menjadi:
1. **`core/identity`**: Mengelola akun pengguna, otentikasi sesi, dan penegakan peran tunggal (`platform_admin` vs `user`) tanpa dependensi ke profil.
2. **`core/profile`**: Mengelola 7 entitas profil, menegakkan aturan **1 Akun = 1 Profil** (`UNIQUE(account_id)`), memastikan jenis entitas permanen (*immutable* pasca-pendaftaran), dan menjamin kepatuhan UU PDP (sanitasi atribut NIK/KTP/KK).
3. **`core/ecosystem`**: Mengelola kemitraan antar entitas sesuai `relation_rules`, menegakkan batas relasi aktif, validasi keselarasan game, dan kaskade pemutusan relasi saat profil dinonaktifkan.
4. **`core/catalog`**: Mengelola katalog game dinamis berbasis database dengan dukungan penuh Honor of Kings (HOK) serta role dan rank terkelola.
5. **Eliminasi JOIN Lintas Schema**: Rujukan antar domain murni menggunakan ID (*opaque identifiers*). Hidrasi data lintas domain dilakukan pada lapisan aplikasi atau *Read Model* (`directory`).
6. **ADR-005 Diterbitkan**: Panduan arsitektur transisi dari skema logis saat ini menuju pemisahan fisik basis data (*Database-per-Service*) di masa depan.
7. **Perlindungan Feature Flag**: Dilindungi oleh `FLAGS.USE_MODULAR_CORE` untuk *instant rollback* tanpa risiko downtime.

---

## 2. Komponen & Berkas yang Dibangun

| Komponen / Berkas | Deskripsi & Implementasi Teknis |
|---|---|
| `apps/web/src/lib/services/core/identity/` | **Subdomain Identity**: `types.ts`, `service.ts`, `index.ts`. Mengelola `getAccountById`, `verifyUserRole`, dan `isPlatformAdmin` secara independen. |
| `apps/web/src/lib/services/core/profile/` | **Subdomain Profile**: `types.ts`, `service.ts`, `index.ts`. Mengelola profil 7 entitas, penegakan keunikan akun, immutabilitas jenis profil, sanitasi privasi UU PDP, dan emisi peristiwa `ProfileCreated` / `ProfileUpdated`. |
| `apps/web/src/lib/services/core/ecosystem/` | **Subdomain Ecosystem**: `types.ts`, `service.ts`, `index.ts`. Mengelola `requestRelation`, `respondRelation`, dan `cascadeEndRelationsOnProfileTermination` dengan emisi peristiwa Outbox. |
| `apps/web/src/lib/services/core/catalog/` | **Subdomain Catalog**: `types.ts`, `service.ts`, `index.ts`. Mengelola `getActiveGames` dan `getGameByIdOrSlug` dengan integrasi Honor of Kings (HOK). |
| `apps/web/src/lib/services/core/index.ts` | **Facade Core**: Mengekspos keempat subdomain terisolasi sebagai modul independen. |
| `docs/adr/ADR-005-modular-core-and-database-separation.md` | **Arsitektur ADR-005**: Keputusan modularisasi core, eliminasi cross-schema JOINs, dan peta jalan pemisahan fisik basis data (*Database-per-Service*). |
| `apps/web/src/lib/config/flags.ts` | **Feature Flag `USE_MODULAR_CORE`**: Terbuka secara default (`true`). Rollback instan dapat dipicu via `FEATURE_FLAG_MODULAR_CORE=false`. |
| `apps/web/src/__tests__/modular-core.test.ts` | **Suite Uji Unit & Integrasi (12 Uji)**: Menguji isolasi modul, penegakan 1-akun-1-profil, immutabilitas entitas, kepatuhan UU PDP, aturan relasi ekosistem, katalog HOK, dan hidrasi tanpa JOIN. |

---

## 3. Fitur Utama & Kepatuhan Mandat V3

### A. Penegakan Batas Modul (Import Boundaries)
- Monolit lama yang saling mengimpor logika antar domain digantikan oleh 4 subdomain modular dengan fungsi terisolasi.
- Tidak ada dependensi sirkular antara Identity, Profile, Ecosystem, dan Catalog. Komunikasi lintas domain dilakukan melalui kontrak interface dan peristiwa asinkron Outbox.

### B. Eliminasi JOIN Lintas Domain & Referensi Berbasis ID
- Profil hanya menyimpan `account_id`, `region_id`, dan `main_game_id` tanpa perintah SQL `JOIN` langsung ke tabel `accounts` atau `games`.
- Relasi ekosistem hanya menyimpan `source_profile_id`, `target_profile_id`, dan `game_id` tanpa *foreign key constraint* lintas domain.
- Manfaat: Kode aplikasi telah 100% siap untuk dipindahkan ke basis data fisik terpisah (*Option C*) tanpa memerlukan refactoring logika bisnis.

### C. Penegakan 1 Akun = 1 Profil & Immutabilitas Jenis Entitas
- Pengguna yang telah memiliki profil ditolak secara tegas jika mencoba mendaftar profil kedua (`UNIQUE(account_id)`).
- Jenis entitas profil (`entityType`) bersifat permanen seumur hidup akun; tidak dapat diubah atau disalahgunakan setelah pendaftaran.

### D. Kepatuhan Pelindungan Data Pribadi (UU PDP No. 27/2022)
- Modul profil secara otomatis menyaring dan membuang atribut sensitif (NIK, nomor KK, foto KTP) dari payload pendaftaran maupun pembaruan data.

---

## 4. Hasil Verifikasi Gerbang Mutu (G1–G10)

| No | Kriteria Gerbang Mutu | Hasil Uji / Bukti | Status |
|:--:|---|---|:--:|
| **G1** | Suite Pengujian Menyeluruh | **12 berkas uji, 139 pengujian**: 100% LULUS (1.53 detik) | **PASS** |
| **G2** | Pemeriksaan Tipe TypeScript (`tsc --noEmit`) | 0 kesalahan pada seluruh paket monorepo (`contracts`, `lib`, `web`) | **PASS** |
| **G3** | Kompilasi Produksi Next.js (`npm run build`) | 119 rute terkompilasi sukses dalam 11.6 detik | **PASS** |
| **G4** | Sapu Istilah Terlarang (`scripts/sweep-terms.js`) | 0 kemunculan kata terlarang (ESI, PBESI, Pengcab, Pengprov, KONI, Dispora) | **PASS** |
| **G5** | Pemindaian Rahasia Bocor (`scripts/scan-secrets.js`) | 0 token/kunci ter-hardcode ditemukan | **PASS** |
| **G6** | Aturan 1 Akun = 1 Profil | Percobaan multi-profil pada satu akun ditolak tegas | **PASS** |
| **G7** | Immutabilitas Jenis Entitas | Upaya pengubahan `entityType` dicegah dan melempar galat integritas | **PASS** |
| **G8** | Kepatuhan Privasi UU PDP | Atribut NIK/KK/KTP disanitasi otomatis sebelum persistensi | **PASS** |
| **G9** | Zero-JOIN Data Hydration | Rujukan entitas lintas modul berhasil dihidrasi berbasis ID murni | **PASS** |
| **G10** | Kesiapan Rollback (Feature Flag) | `FLAGS.USE_MODULAR_CORE` dapat dinonaktifkan instan via env | **PASS** |

---

## 5. Rencana Sub-Langkah Selanjutnya

Sub-langkah berikutnya adalah **Sub-langkah 7.7 (BFF & Eliminasi Akses Langsung Database dari Web)**:
1. Menegakkan aturan bahwa antarmuka web (browser) **hanya menggunakan Supabase JS untuk otentikasi sesi (Auth)**.
2. Seluruh pembacaan dan penulisan data wajib melewati Backend-for-Frontend (BFF / Route Handlers terlindungi).
3. Verifikasi JWT pengguna dan token layanan berumur pendek (*short-lived service tokens*).
4. Pengetatan CORS, rate limiting, dan eliminasi akses `service_role` dari komponen klien browser.
5. Pembuatan kontrak pengujian keamanan dan *quality gate*.
