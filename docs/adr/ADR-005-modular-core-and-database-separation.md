# ADR-005: Modularisasi Subdomain Core dan Pemisahan Logis Basis Data

## Status
**Diterima (Accepted)** — Mengimplementasikan Mandat Transformasi V3 Bagian 7.6.

---

## Konteks & Masalah
Pada ESPORT SUMBAR V2 lama, domain inti (`accounts`, `profiles`, `entity_relations`, `games`) berada pada satu skema monolitik dengan kueri SQL `JOIN` yang saling terkait erat (*tightly coupled*). Hal ini menimbulkan masalah:
1. Perubahan skema pada profil (misalnya menambah atribut entitas) berisiko merusak kueri relasi ekosistem atau katalog.
2. Tidak adanya batasan modul yang jelas di tingkat kode menyebabkan dependensi sirkular dan kesulitan dalam mengisolasi pengujian.
3. Arsitektur terikat pada satu basis data relasional tunggal, menghalangi jalur migrasi menuju arsitektur *microservices* penuh (*Database-per-Service*).

---

## Keputusan Arsitektur
1. **Empat Subdomain Mandiri dalam Core**:
   Monolit inti dipecah menjadi 4 subdomain modular dengan aturan batas impor (*import boundaries*) yang ketat:
   - `core/identity`: Mengelola akun pengguna, otentikasi, dan verifikasi peran tunggal (`platform_admin` vs `user`).
   - `core/profile`: Mengelola 7 entitas profil, penegakan 1 akun = 1 profil (`UNIQUE(account_id)`), jenis entitas permanen (*immutable*), dan kepatuhan UU PDP (pengecualian NIK/KTP/KK).
   - `core/ecosystem`: Mengelola kemitraan antar entitas, penegakan `relation_rules`, batas aktif, dan kaskade pemutusan relasi saat profil dinonaktifkan.
   - `core/catalog`: Mengelola katalog game dinamis, role, dan tier rank (termasuk dukungan penuh Honor of Kings).

2. **Eliminasi JOIN Lintas Subdomain (Zero Cross-Schema JOINs)**:
   - Dilarang keras melakukan perintah SQL `JOIN` antar-tabel yang berbeda subdomain di tingkat kode layanan.
   - Semua rujukan lintas domain hanya menyimpan ID murni (*opaque identifier*):
     - `profiles.account_id` merujuk ke `identity.accounts(id)` tanpa JOIN.
     - `profiles.main_game_id` merujuk ke `catalog.games(id)` tanpa JOIN.
     - `entity_relations.source_profile_id` dan `target_profile_id` merujuk ke `profiles(id)` tanpa JOIN.
   - Hidrasi data antar-modul dilakukan di lapisan aplikasi (*service layer*) atau melalui *Read Model* berkecepatan tinggi (`directory`).

3. **Komunikasi Berbasis Peristiwa (Transactional Outbox)**:
   - Setiap mutasi penting pada subdomain inti memicu peristiwa domain (`ProfileCreated`, `ProfileUpdated`, `ProfileSuspended`, `ProfileDeleted`, `RelationRequested`, `RelationApproved`, `RelationEnded`, `GameChanged`).
   - Peristiwa dicatat ke `outbox_events` dalam transaksi yang sama dan dikonsumsi secara asinkron oleh layanan hilir (`directory`, `notification`, `audit`, `media`).

4. **Jalur Pemisahan Fisik Basis Data (Database-per-Service Roadmap)**:
   - **Fase 1 (Saat ini - Opsi B Hybrid)**: Satu instans Postgres Supabase dengan pemisahan tabel/skema logis dan penegakan batas di lapisan TypeScript.
   - **Fase 2 (Skala Menengah)**: Pembagian peran database per layanan (*dedicated DB role*) dengan hak akses terbatas hanya ke skema miliknya.
   - **Fase 3 (Skala Penuh - Opsi C)**: Pemindahan fisik basis data ke instans terpisah untuk masing-masing mikrolayanan (`identity-db`, `profile-db`, `ecosystem-db`, `catalog-db`). Karena kode aplikasi sudah 100% bebas dari SQL JOIN lintas domain, transisi ke multi-database dapat dilakukan tanpa refactoring logika bisnis.

---

## Konsekuensi
### Positif
- **Isolasi Mutasi**: Kegagalan atau perubahan skema pada katalog tidak mempengaruhi layanan profil atau otentikasi.
- **Kemudahan Pengujian**: Setiap subdomain memiliki suite pengujian unit independen dengan in-memory mock.
- **Kesiapan Skalabilitas**: Siap untuk diekstrak menjadi repo/layanan kontainer mandiri kapan saja.

### Kompromi & Mitigasi
- *Kompromi*: Menghilangkan JOIN relasional memerlukan kueri terpisah (atau agregasi read model) saat membutuhkan data gabungan profil + nama game.
- *Mitigasi*: Layanan `directory` (Read Model terdenormalisasi dari Sub-langkah 7.3) menyajikan seluruh data publik siap saji dengan performa sub-10ms dan invalidasi berbasis peristiwa.
