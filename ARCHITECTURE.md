# Arsitektur ESPORT SUMBAR V3

Dokumen ini mendokumentasikan gambaran besar arsitektur, prinsip desain, dan batas batas modularitas platform ESPORT SUMBAR V3.

---

## 1. Prinsip Utama Desain

1. **Kepemilikan Tunggal (100% Sole Ownership):**  
   ESPORT SUMBAR adalah entitas tunggal pemilik, operator, dan pemverifikasi data atlet serta komunitas di Sumatera Barat. Tidak ada ketergantungan organisasi pihak ketiga.
2. **Minimisasi Data & Pelindungan Privasi (PDP-Ready):**  
   Platform tidak menyimpan data identitas kependudukan sensitif (NIK, nomor KTP, scan Kartu Keluarga). Verifikasi menggunakan bukti in-game dan tanda pengenal non-sensitif.
3. **Keterhubungan Ekosistem Berbasis Aturan Data (`relation_rules`):**  
   Tiap entitas (Player, Coach, Team, Community, Venue, School, Campus) terhubung melalui persetujuan dua arah dengan aturan deklaratif di tingkat database.
4. **Satu Akun Satu Bidang (`UNIQUE(account_id)`):**  
   Satu akun terdaftar hanya mewakili satu profil entitas untuk menjamin integritas reputasi dan kemudahan navigasi.
5. **Arsitektur Hibrida Pragmatis (Pragmatic Hybrid Microservices):**  
   Domain berat I/O dan asinkron (`media`, `notification`, `directory` CQRS, dan `verification`) dipisahkan menjadi microservices mandiri, sedangkan modul inti bisnis (`identity`, `profile`, `ecosystem`, `catalog`) dikelola dalam batas skema PostgreSQL terisolasi.

---

## 2. Diagram Topologi Monorepo (Turborepo)

```
esport-sumbar-monorepo/
├── apps/
│   └── web/                   # Next.js 16 (App Router, Turbopack, Tailwind v4)
├── packages/
│   ├── contracts/             # Zod DTOs, Event Types v1, Verification Schemas
│   ├── lib/                   # Structured JSON Logger, Domain Errors, Constants
│   └── config/                # Shared ESLint, TSConfig, Tailwind
├── services/                  # Microservices Hono (akan diekstrak di Bagian 7)
│   ├── media/                 # Sharp Image Compression, Signed Uploads
│   ├── notification/          # Async Email & In-App Alerts (DLQ + Retry)
│   ├── directory/             # CQRS Denormalized Read-Model & Edge Cache
│   └── verification/          # Append-Only Audit & State Machine RPC
└── supabase/
    └── migrations/            # Expand -> Migrate -> Contract SQL Migrations
```

---

## 3. Aliran Data & Peristiwa Asinkron (Transactional Outbox)

```
[User Browser]
      │
      ▼ (HTTPS Session Auth)
[apps/web (BFF)]
      │
      ▼ (JWT Validation)
[PostgreSQL Core Schema] ──── (Atomic Write) ────► [outbox_events Table]
                                                           │
                                                           ▼ (Event Poller / QStash)
                                              ┌────────────┴────────────┐
                                              ▼                         ▼
                                    [services/directory]      [services/notification]
                                    (Update Read-Model)       (Send Templated Email)
```

---

## 4. Daftar ADR Terkait
- [ADR-001: Satu Pemilik & Verifikasi 1 Tahap](docs/adr/ADR-001-single-owner-and-verification.md)
- [ADR-002: Konsolidasi Peran Pengguna (user & platform_admin)](docs/adr/ADR-002-rbac-user-and-platform-admin.md)
- [ADR-003: Satu Akun Satu Profil Entitas](docs/adr/ADR-003-single-account-single-profile.md)
- [ADR-004: Ekosistem Berbasis Aturan Data (relation_rules)](docs/adr/ADR-004-data-driven-ecosystem-relations.md)
- [ADR-005: Katalog Game Dinamis & Honor of Kings](docs/adr/ADR-005-dynamic-game-catalog.md)
- [ADR-006: Arsitektur Microservices Pragmatis Opsi B](docs/adr/ADR-006-microservices-hybrid-architecture.md)
