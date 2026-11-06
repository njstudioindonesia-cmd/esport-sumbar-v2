# Panduan Kontribusi ESPORT SUMBAR V3

Terima kasih telah berkontribusi dalam pembangunan ekosistem digital esport Sumatera Barat.

## 1. Standar Pesan Commit (Conventional Commits)
Gunakan format standar: `<tipe>(<lingkup>): <deskripsi singkat>`

Tipe yang diizinkan:
- `feat`: Fitur baru untuk pengguna
- `fix`: Perbaikan bug
- `refactor`: Refaktor kode tanpa mengubah perilaku
- `perf`: Optimasi performa
- `test`: Menambah atau memperbaiki pengujian
- `docs`: Dokumentasi (ADR, panduan, diagram)
- `chore`: Konfigurasi build, dependensi, CI/CD

Contoh:
- `feat(catalog): add Honor of Kings dynamic roles`
- `fix(auth): prevent admin from verifying own profile`
- `refactor(contracts): introduce v1 transactional outbox schema`

## 2. Struktur Monorepo
- `apps/web`: Aplikasi web utama Next.js 16 (App Router)
- `packages/contracts`: Skema Zod, DTO, dan event contracts v1
- `packages/lib`: Logger JSON terstruktur, custom error classes, konstanta sistem
- `packages/config`: Konfigurasi bersama ESLint, Tailwind, TypeScript
- `services/`: Layanan microservices mandiri (media, notification, directory, verification)

## 3. Aturan Keras
1. **Nol Istilah Terlarang:** Dilarang menggunakan istilah ESI, Pengcab, Pengprov, PBESI, dll. pada kode baru.
2. **Minimisasi Data PDP:** Dilarang mengumpulkan NIK, KTP, atau KK.
3. **Pemisahan Kepentingan:** Platform admin dilarang memverifikasi profil miliknya sendiri.
