# ADR-003: Batasan Satu Akun Satu Profil Entitas (`UNIQUE(account_id)`)

## Status
Diterima (*Accepted*)

## Konteks & Masalah
Pada V2, arsitektur basis data memungkinkan relasi 1 akun : N profil (`profiles.account_id` tidak memiliki konstrain unik). Pengguna dapat membuat profil ganda, misalnya satu orang mendaftar sekaligus sebagai Player, Coach, dan Community Leader dalam satu sesi login.

Masalah:
1. Kerumitan UI: Membutuhkan Profile Switcher di topbar, dialog pemilih profil aktif, dan penanganan *context state* profil aktif di klien yang rentan bug sinkronisasi.
2. Integritas Reputasi & Konflik Kepentingan: Seseorang dapat bertanding sebagai pemain di tim A sekaligus menjadi wasit/pelatih di tim B dalam turnamen yang sama tanpa batas kejelasan identitas.
3. Kerumitan Penghitungan Ekosistem: Ketika sebuah sekolah atau tim mengundang pemain, undangan sering nyasar ke profil lain milik akun yang sama.

## Keputusan Arsitektur
1. **Penerapan Konstrain Unik:**
   Menambahkan `CONSTRAINT profiles_account_id_unique UNIQUE(account_id)` pada tabel `profiles`.
2. **Kekekalan Jenis Entitas (*Immutability of Entity Type*):**
   Kolom `entity_type` pada profil tidak dapat diubah setelah registrasi awal. Dipasang trigger proteksi tingkat database (`prevent_entity_type_change`).
3. **Penyederhanaan UI / UX:**
   - Menghapus Profile Switcher, tombol "Tambah Profil", dan daftar profil ganda pada topbar dan dashboard.
   - Pilihan bidang pada saat registrasi / wizard kartu diberi konfirmasi tegas: *"Pilihan bidang ini bersifat final dan tidak dapat diubah."*
4. **Kebijakan Multi-Peran di Dunia Nyata:**
   Jika seorang individu di dunia nyata memegang peran ganda (misalnya seorang atlet yang juga pemilik sebuah Arena/Venue esport), individu tersebut diwajibkan mendaftarkan **dua akun terpisah dengan alamat email berbeda**.
   Hubungan kerja sama antar kedua entitas tersebut selanjutnya dihubungkan secara formal melalui sistem **Ekosistem Terhubung** (ADR-004).
5. **Penanganan Akun Lama dengan Multi-Profil (Keputusan D2):**
   Untuk akun eksisting yang terlanjur memiliki >1 profil:
   - Profil tertua yang berstatus `verified` atau memiliki kelengkapan data tertinggi dipertahankan sebagai profil aktif.
   - Profil sekunder lainnya dipindahkan ke tabel arsip `profiles_archived` (bukan di-hard delete) dan relasinya dinonaktifkan.
   - Daftar akun terdampak disajikan kepada pemilik sistem sebelum eksekusi migrasi.

## Konsekuensi
### Positif
- Model mental pengguna menjadi sangat jelas: 1 Akun = 1 Identitas Digital Esport Sumbar.
- Kode frontend dashboard dan topbar menjadi bersih dan bebas bug *stale context*.
- Rarity score dan lencana kredibilitas melekat erat pada satu entitas tunggal.

### Negatif / Mitigasi
- Pengguna yang ingin mengelola tim dan sekaligus menjadi pemain harus melakukan logout/login atau menggunakan akun email kedua.  
  *Mitigasi:* Sistem Ekosistem memungkinkan Tim menunjuk Kapten atau Manajer dari profil Player yang terhubung secara resmi tanpa perlu memegang login akun tim secara langsung.
