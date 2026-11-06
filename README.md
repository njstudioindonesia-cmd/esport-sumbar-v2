# ESPORT SUMBAR V3

> Platform Ekosistem & Identitas Digital Esport Sumatera Barat.  
> 100% Mandiri, Profesional, Berbasis Arsitektur Hibrida & Turborepo Monorepo.

---

## Ringkasan Proyek

ESPORT SUMBAR V3 adalah platform identitas digital terpadu untuk 7 entitas esport di Sumatera Barat: Atlet (*Player*), Pelatih (*Coach*), Tim (*Team*), Komunitas (*Community*), Arena (*Venue*), Sekolah (*School*), dan Perguruan Tinggi (*Campus*).

### Fitur Utama V3
- **Kartu Identitas Digital 3D:** Kartu visual interaktif dengan rarity frame, QR-code, dan nomor registrasi unik `ESP-SB-VER-YYYY-XXXX`.
- **Verifikasi Satu Pintu:** Verifikasi langsung oleh tim verifikator ESPORT SUMBAR tanpa birokrasi berjenjang.
- **Ekosistem Terhubung:** Relasi bilateral antar-entitas (keanggotaan roster tim, naungan komunitas, homebase venue, pembinaan sekolah) yang ditegakkan dengan aturan basis data.
- **Katalog Game Dinamis:** Mendukung cabang game terkini termasuk **Honor of Kings (HOK)**, MLBB, Free Fire, PUBG Mobile, Valorant, Dota 2, dan CS2.
- **Privasi & Keamanan:** Tanpa penyimpanan NIK/KTP. Akses admin terisolasi dengan otentikasi MFA.

---

## Struktur Monorepo

```bash
├── apps/
│   └── web/                   # Next.js 16 Web Application (App Router)
├── packages/
│   ├── contracts/             # Zod DTOs, Event Types v1, Verification Schemas
│   ├── lib/                   # Structured Logger, Domain Errors, Constants
│   └── config/                # Shared ESLint, TSConfig, Tailwind
├── services/                  # Microservices Hono (Tahap Strangler)
└── supabase/
    └── migrations/            # SQL Migrations (Expand -> Migrate -> Contract)
```

---

## Panduan Memulai Cepat

### Prasyarat
- Node.js >= 20.x (disarankan 22.x LTS)
- npm >= 10.x atau pnpm >= 9.x

### Instalasi & Menjalankan Lokal
```bash
# 1. Pasang dependensi monorepo
npm install

# 2. Salin template variabel lingkungan
cp .env.example .env.local

# 3. Jalankan server pengembangan
npm run dev

# 4. Jalankan pengujian otomatis & type-check
npm run test
npm run type-check

# 5. Build aplikasi untuk produksi
npm run build
```

---

## Standar Kualitas & Skrip Audit
- `npm run type-check`: Menjalankan pemeriksaan tipe TypeScript di seluruh workspace.
- `npm run test`: Menjalankan test runner otomatis (Vitest).
- `node scripts/sweep-terms.js`: Audit sapu istilah terlarang (menolak istilah ESI, Pengcab, dll.).
- `node scripts/scan-secrets.js`: Pemindai kebocoran rahasia / service role key.
- `node scripts/check-migrations.js`: Validasi format dan integritas berkas SQL migrasi.
