# ADR-005: Katalog Game, Peran, dan Peringkat Dinamis Berbasis Data

## Status
Diterima (*Accepted*)

## Konteks & Masalah
Di V2, daftar cabang game esport terdaftar di database tetapi sebagian role pemain masih di-hardcode di formulir klien TypeScript ([`src/lib/constants/games.ts`](file:///d:/AI%20AGENT/ESPORT%20SUMBAR%20V2/src/lib/constants/games.ts)). Selain itu:
1. Game kompetitif populer terbaru seperti **Honor of Kings (HOK)** belum tersedia dalam katalog.
2. Penambahan game baru atau penyesuaian role musiman (*patch update*) memerlukan deployment kode frontend berulang.
3. Hak cipta logo game: Menggunakan logo asli publisher tanpa izin lisensi resmi berisiko pelanggaran hak kekayaan intelektual (HAKI/Merek Dagang).

## Keputusan Arsitektur
1. **Katalog Terpusat di Basis Data:**
   Menghapus seluruh daftar statis hardcoded di frontend. Seluruh formulir registrasi, filter direktori, kartu 3D, dan roster tim membaca langsung dari tabel relasional:
   - `games`: Informasi judul game, slug, genre, platform (Mobile/PC/Console), status aktif.
   - `game_roles`: Peran spesifik in-game (misal: Clash Lane, Jungle, Roam untuk HOK; Gold Lane, EXP Lane untuk MLBB; Duelist, Controller untuk Valorant).
   - `game_ranks`: Urutan tier peringkat in-game resmi (misal: Bronze hingga Grandmaster/Challenger/Mythic Immortal).
2. **Katalog Awal V3:**
   - **Honor of Kings (HOK)**: MOBA, Mobile. Roles: *Clash Lane*, *Jungle*, *Mid Lane*, *Farm Lane*, *Roam*.
   - **Mobile Legends: Bang Bang**: MOBA, Mobile. Roles: *Gold Lane*, *EXP Lane*, *Mid Lane*, *Jungler*, *Roamer*.
   - **Free Fire**: Battle Royale, Mobile. Roles: *Rusher*, *Supporter*, *Sniper*, *Flanker*, *IGL*.
   - **PUBG Mobile**: Battle Royale, Mobile. Roles: *IGL*, *Assaulter*, *Support*, *Scout/Sniper*.
   - **Call of Duty: Mobile**: FPS, Mobile. Roles: *Slayer*, *Anchor*, *Support*, *OBJ*, *Flex*.
   - **League of Legends: Wild Rift**: MOBA, Mobile. Roles: *Baron Lane*, *Jungle*, *Mid Lane*, *Dragon Lane*, *Support*.
   - **Pokémon UNITE**: MOBA, Mobile/Switch. Roles: *Attacker*, *Defender*, *Supporter*, *All-Rounder*, *Speedster*.
   - **Valorant**: FPS, PC. Roles: *Duelist*, *Initiator*, *Controller*, *Sentinel*, *IGL*.
   - **Counter-Strike 2**: FPS, PC. Roles: *Entry*, *AWPer*, *Support*, *Lurker*, *IGL*.
   - **Dota 2**: MOBA, PC. Roles: *Carry*, *Mid*, *Offlane*, *Soft Support*, *Hard Support*.
   - **eFootball / FC Mobile**: Sports, Mobile. Roles: *Player*.
3. **Pengelolaan oleh Admin Platform:**
   Disediakan sub-panel admin `/admin/reference` untuk menambah game baru, mengaktifkan/menonaktifkan game, dan mengelola role/rank. Game yang telah digunakan oleh profil publik dilarang dihapus secara permanen (*hard delete* dicegah oleh konstrain relasi); hanya dapat dinonaktifkan (*soft disable*).
4. **Strategi Aset & Hak Cipta Merek:**
   - Secara bawaan, V3 menggunakan **ikon netral berbasis genre** (MOBA, FPS, BR, Sports) yang dirancang bersih dengan palet visual brand ESPORT SUMBAR.
   - Slot logo kustom disediakan di basis data dan CDN yang dapat diunggah admin apabila lisensi/izin pemakaian merek dagang dari masing-masing publisher telah diperoleh.

## Konsekuensi
### Positif
- Fleksibilitas tinggi: Penambahan game baru (misal ada turnamen cabang baru) dapat dilakukan dalam hitungan detik tanpa deploy kode.
- Perlindungan hak cipta aman dan terhindar dari komplain DMCA/merek dagang publisher game.
- Konsistensi data tinggi antara formulir kartu, direktori publik, dan sertifikat verifikasi.

### Negatif / Mitigasi
- Ketergantungan kueri baca ke tabel katalog game.  
  *Mitigasi:* Read-model katalog game di-cache secara agresif di lapisan edge BFF Next.js (`stale-while-revalidate` 24 jam) dan diinvalidasi hanya saat admin mengubah katalog.
