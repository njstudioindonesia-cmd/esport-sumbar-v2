# ADR-M07: Struktur Paket Bersama Monorepo dan Isolasi Kode Server

**Status**: APPROVED  
**Tanggal**: November 2026  

---

## 1. Konteks
Monorepo ESPORT SUMBAR V3 memiliki paket `@esport-sumbar/contracts` dan `@esport-sumbar/lib`. Temuan audit **G5** menunjukkan bahwa `@esport-sumbar/lib` mengekspor kode server seperti `outbox.ts` dan `logger.ts` yang mengimpor pustaka Node bawaan. Mengimpor root `@esport-sumbar/lib` ke dalam aplikasi mobile akan menyebabkan error kompilasi bundler.

## 2. Keputusan Arsitektur
1. **Daftar Paket yang Aman Diimpor ke Mobile**:
   - `@esport-sumbar/contracts`: Skema validasi Zod murni untuk semua entitas (Profile, Relations, Verification, Catalog, Media).
   - `@esport-sumbar/lib/copy`: Modul kamus teks terpusat bebas istilah terlarang.
2. **Isolasi & Pemisahan Ekspor**:
   - Memodifikasi `packages/lib/package.json` untuk mengekspor subpath `./copy` secara eksplisit:
     ```json
     "exports": {
       ".": "./src/index.ts",
       "./copy": "./src/copy/index.ts"
     }
     ```
   - Menambahkan aturan ESLint di `apps/mobile`:
     ```json
     "no-restricted-imports": ["error", {
       "paths": [{
         "name": "@esport-sumbar/lib",
         "message": "Gunakan @esport-sumbar/lib/copy. Dilarang mengimpor modul server ke mobile."
       }]
     }]
     ```
