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
- `node scripts/sweep-terms.js`: Audit sapu istilah terlarang (0 toleransi untuk istilah birokrasi lawas).
- `node scripts/scan-secrets.js`: Pemindai kebocoran rahasia / service role key.
- `node scripts/verify-client-db-isolation.js`: Audit isolasi basis data klien (0 direct DB calls di browser).
- `npx tsx scripts/contract-cleanup.ts`: Audit & purifikasi data sensitif sesuai UU PDP No. 27/2022.
- `npx tsx scripts/backup-drill.ts`: Simulasi drill pemulihan bencana (Disaster Recovery RTO/RPO).

---

## Indeks Dokumentasi Arsitektur & Operasional
- [**ARCHITECTURE.md**](file:///d:/AI%20AGENT/ESPORT%20SUMBAR%20V2/ARCHITECTURE.md): Cetak biru arsitektur hibrida, peta domain, katalog peristiwa, dan pola outbox.
- [**SECURITY.md**](file:///d:/AI%20AGENT/ESPORT%20SUMBAR%20V2/SECURITY.md): Kebijakan keamanan, otentikasi JWT/service token, RLS, dan kepatuhan UU PDP.
- [**Runbooks**](file:///d:/AI%20AGENT/ESPORT%20SUMBAR%20V2/docs/runbooks/):
  - [Incident Response Runbook](file:///d:/AI%20AGENT/ESPORT%20SUMBAR%20V2/docs/runbooks/INCIDENT_RESPONSE.md)
  - [Disaster Recovery Runbook](file:///d:/AI%20AGENT/ESPORT%20SUMBAR%20V2/docs/runbooks/DISASTER_RECOVERY.md)
  - [Rollback Procedures Runbook](file:///d:/AI%20AGENT/ESPORT%20SUMBAR%20V2/docs/runbooks/ROLLBACK_PROCEDURES.md)
  - [Key Rotation Runbook](file:///d:/AI%20AGENT/ESPORT%20SUMBAR%20V2/docs/runbooks/KEY_ROTATION.md)
- [**SOP Operasional**](file:///d:/AI%20AGENT/ESPORT%20SUMBAR%20V2/docs/sop/):
  - [SOP Verifikasi Admin](file:///d:/AI%20AGENT/ESPORT%20SUMBAR%20V2/docs/sop/SOP_VERIFIKASI_ADMIN.md)
  - [Panduan Moderasi Komunitas](file:///d:/AI%20AGENT/ESPORT%20SUMBAR%20V2/docs/sop/PANDUAN_MODERASI_KOMUNITAS.md)
- [**Audit Kualitas & Hukum**](file:///d:/AI%20AGENT/ESPORT%20SUMBAR%20V2/docs/):
  - [Audit Keamanan Sistem](file:///d:/AI%20AGENT/ESPORT%20SUMBAR%20V2/docs/SECURITY_AUDIT_REPORT.md)
  - [Audit Kualitas & Aksesibilitas](file:///d:/AI%20AGENT/ESPORT%20SUMBAR%20V2/docs/QUALITY_AND_ACCESSIBILITY_AUDIT.md)
  - [Kebijakan Hukum, Merek & Konten](file:///d:/AI%20AGENT/ESPORT%20SUMBAR%20V2/docs/LEGAL_AND_BRAND_POLICY.md)
  - [Kebijakan Kuota & Retensi Data](file:///d:/AI%20AGENT/ESPORT%20SUMBAR%20V2/docs/OPERATIONAL_RETENTION_POLICY.md)
  - [Peta Jalan Final](file:///d:/AI%20AGENT/ESPORT%20SUMBAR%20V2/docs/ROADMAP_FINAL.md)
