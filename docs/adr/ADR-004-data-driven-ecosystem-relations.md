# ADR-004: Ekosistem Keterhubungan Entitas Berbasis Aturan Data (`relation_rules`)

## Status
Diterima (*Accepted*)

## Konteks & Masalah
Esport Sumatera Barat terdiri dari 7 pilar entitas utama:
1. **Player** (Atlet / Pemain)
2. **Coach** (Pelatih / Analis)
3. **Team** (Klub / Roster)
4. **Community** (Komunitas Gamers / Fanbase)
5. **Venue** (Arena Esport / Gaming Cafe / Bootcamp Hub)
6. **School** (Sekolah Menengah / SMA / SMK)
7. **Campus** (Universitas / Institut / Politeknik)

Pada V2, relasi antar-entitas hanya berupa tabel sederhana di mana integritas, kecocokan game, dan batasan kapasitas belum ditegakkan secara ketat di tingkat basis data. Akibatnya, pemain dapat terdaftar di puluhan tim lintas cabang tanpa batas, dan sekolah dapat terhubung tanpa verifikasi status pelajar.

## Keputusan Arsitektur
1. **Aturan Berbasis Data (Tabel `relation_rules`):**
   Aturan relasi tidak di-hardcode dalam logika frontend, melainkan didefinisikan secara deklaratif di tabel basis data `relation_rules`:
   ```sql
   CREATE TABLE public.relation_rules (
       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
       source_entity_type entity_type NOT NULL,
       target_entity_type entity_type NOT NULL,
       relation_type VARCHAR(50) NOT NULL,
       requires_approval BOOLEAN DEFAULT TRUE,
       max_active_limit INT NOT NULL DEFAULT 1,
       game_match_required BOOLEAN DEFAULT FALSE,
       is_active BOOLEAN DEFAULT TRUE,
       created_at TIMESTAMPTZ DEFAULT NOW(),
       CONSTRAINT unique_rule_pair UNIQUE(source_entity_type, target_entity_type, relation_type)
   );
   ```
2. **Matriks Validasi Hubungan Antar-Entitas:**
   - **Player → Team:** Jenis `anggota` (kapten/inti/cadangan). Batas: 1 tim aktif per game (maks total 3). Wajib game yang sama.
   - **Player → Community:** Jenis `anggota`. Batas: ≤ 5 komunitas.
   - **Player → School / Campus:** Jenis `siswa` / `mahasiswa`. Batas: Maksimal 1 institusi pendidikan. *Eksklusif mutual:* jika terdaftar di Sekolah, tidak boleh terdaftar di Kampus (dan sebaliknya).
   - **Coach → Team:** Jenis `pelatih`. Batas: ≤ 5 tim.
   - **Coach → School / Campus:** Jenis `pembina`. Batas: ≤ 3 institusi.
   - **Team → Venue:** Jenis `basecamp`. Batas: 1 venue resmi.
   - **Team → School / Campus:** Jenis `mewakili`. Batas: 1 institusi.
   - **Terlarang Mutlak:** Hubungan sesama jenis (Player ↔ Player, Team ↔ Team).
3. **Persetujuan Dua Arah (*Two-Way Handshake*):**
   - Transisi status relasi: `pending` → `active` | `rejected` | `cancelled` | `expired` | `ended`.
   - Undangan kedaluwarsa otomatis dalam **14 hari** jika tidak direspon.
   - Pembatasan laju (*rate limiting*): Maksimal 5 permintaan hubungan baru per profil per hari untuk mencegah spam.
4. **Perlindungan Privasi Pelajar (Under-18):**
   - Hubungan Player ↔ Sekolah bersifat privat secara bawaan (*opt-in* untuk tampil publik).
   - Halaman publik profil Sekolah hanya menampilkan **agregat jumlah siswa**; daftar nama hanya memunculkan siswa yang memberikan persetujuan eksplisit (dan persetujuan wali untuk usia <18 tahun).
5. **Kaskade Integritas Profil:**
   - Jika suatu profil di-`suspend` atau dihapus, seluruh relasi aktifnya otomatis berstatus `ended` via trigger basis data.

## Konsekuensi
### Positif
- Ekosistem esport di Sumatera Barat menjadi terhubung secara organik, nyata, dan terverifikasi keabsahannya.
- Administrator platform dapat menyesuaikan batasan kuota (misal menaikkan kuota roster tim) secara dinamis melalui dashboard tanpa perlu deploy ulang kode.
- Rarity score entitas (khususnya tier *Contender*) memiliki dasar kalkulasi objektif (mensyaratkan minimal 1 relasi aktif terverifikasi).

### Negatif / Mitigasi
- Permintaan relasi membutuhkan penerimaan aktif dari target.  
  *Mitigasi:* Sistem notifikasi in-app real-time dan email otomatis memberi tahu manajer tim/komunitas begitu ada undangan masuk.
