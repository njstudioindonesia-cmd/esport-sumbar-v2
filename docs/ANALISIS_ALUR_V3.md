# ANALISIS ALUR PENGGUNA DAN DIAGRAM SISTEM V3

> Dokumen Bagian 1.2: Pemetaan Alur Ujung ke Ujung (End-to-End User Journeys), Titik Putus, Tautan Rusak, dan Layar Peralihan.

---

## 1. Alur 1: Registrasi, Aktivasi Akun & Onboarding 1 Bidang

```
[Pengunjung / Tamu]
       │
       ▼
[Kunjungi /register] ──(Input: email, kata sandi, konfirmasi)
       │
       ├──(Gagal: Format invalid / Rate limit) ──> [Tampilkan Glass Toast Error]
       │
       ▼ (Sukses)
[Layar Peralihan: "Periksa Email Anda"] ◄── [TITIK PUTUS 1: Saat ini belum ada layar khusus, langsung redirect]
       │
       ▼ (Pengguna membuka tautan di Email)
[GET /auth/callback?code=...] ──> [Verifikasi Token di BFF]
       │
       ├──(Token kedaluwarsa / rusak) ──> [Redirect /login?error=token_expired]
       │
       ▼ (Token Valid: Sesi Terbentuk)
[Redirect Otomatis: /onboarding]
       │
       ▼
┌────────────────────────────────────────────────────────────────────────┐
│ WIZARD ONBOARDING 7 BIDANG (Konsolidasi 1 Komponen Responsif)          │
├────────────────────────────────────────────────────────────────────────┤
│ 1. [Langkah 1: Pilih 1 Bidang Final]                                   │
│    Pilihan: Player, Coach, Team, Community, Venue, Campus, School.     │
│    Konfirmasi modal: "Satu akun hanya untuk satu bidang (Final)."      │
│                                                                        │
│ 2. [Langkah 2: Isi Data Bidang Sesuai Skema DB]                        │
│    - Player: Nama, IGN, Game Utama, Role Pertandingan, Wilayah, TTL.   │
│      * Jika Usia < 18 Tahun: Form Wali Sah Wajib (Nama & Kontak Wali). │
│    - Coach: Nama, Lisensi, Game Utama, Wilayah, Portofolio.            │
│    - Team: Nama Tim, Singkatan, Wilayah, Divisi Game, Kontak Manajer.  │
│    - Community/Venue/Campus/School: Data entitas spesifik.             │
│                                                                        │
│ 3. [Langkah 3: Unggah & Crop Foto]                                     │
│    - Foto Profil (Avatar) & Foto Sampul.                               │
│    - ImageCropperModal (aspek rasio 1:1 dan 16:9).                     │
│    - Kompresi Sharp di BFF (WebP, < 500 KB).                           │
│                                                                        │
│ 4. [Langkah 4: Pengaturan Privasi & Persetujuan]                       │
│    - Toggle visibilitas per field (Nomor WhatsApp, Alamat Lengkap).    │
│    - Persetujuan pemrosesan data identitas digital.                    │
│                                                                        │
│ 5. [Langkah 5: Pratinjau Hidup Kartu TCG & Terbitkan]                  │
│    - Render live kartu TCG 3D (Rookie tier awal).                      │
│    - Terbitkan ESPORT ID unik dari Database (Format: ESB-{WIL}-{BID}). │
└────────────────────────────────────────────────────────────────────────┘
       │
       ▼
[Layar Sukses: Kartu Digital Terbit!] ◄── [TITIK PUTUS 2: Animasi sukses belum terhubung mulus]
       │
       ▼
[Redirect ke /me/card atau /dashboard]
```

### Temuan & Masalah pada Alur 1:
- **Titik Putus 1**: Setelah mendaftar di `/register`, sistem saat ini langsung me-refresh form tanpa menyajikan layar kaca informatif *"Periksa Email Anda"*, membingungkan pengguna baru.
- **Titik Putus 2**: Di mobile, alur memakai `MobileAuthFlow.tsx` dan `MobileCardWizard.tsx` yang terpisah dari desktop (`DesktopAuthView.tsx` dan `DesktopCardWizard.tsx`). State draf tidak sinkron antar-viewport!
- **Koreksi**: Di Bagian 3, buat layar peralihan `/auth/check-email` dan satukan wizard ke `ResponsiveCardWizard`.

---

## 2. Alur 2: Pengajuan Verifikasi Profil Tunggal & Penelaahan Admin

```
[Pengguna Terdaftar di /me/card]
       │
       ▼
[Klik "Ajukan Verifikasi Profil" -> Buka /me/verification]
       │
       ▼
┌────────────────────────────────────────────────────────────────────────┐
│ TRACKER VERIFIKASI SATU TAHAP (ESPORT SUMBAR)                          │
├────────────────────────────────────────────────────────────────────────┤
│ Status Saat Ini: "Belum Terverifikasi"                                 │
│                                                                        │
│ 1. Lengkapi Syarat Dokumen:                                            │
│    - Atlet/Pelatih: Kartu Identitas (KTP/KIA/Kartu Pelajar).           │
│    - Klub/Komunitas: Anggaran Dasar / Surat Keterangan Domisili.       │
│    - Venue/Kampus/Sekolah: Bukti Legalitas Fasilitas / Surat Tugas.    │
│                                                                        │
│ 2. Unggah Dokumen Bukti Pendukung:                                     │
│    - Diunggah ke Supabase Storage privat (Bucket: verification-docs).  │
│    - Metadata tercatat di tabel `verification_requests`.               │
│                                                                        │
│ 3. Submit Pengajuan:                                                   │
│    - Panggilan BFF Server Action `submitVerification()`.               │
│    - Status berubah menjadi "Menunggu Pemeriksaan" (under_review).     │
│    - Muncul estimasi SLA dinamis (ditarik dari pengaturan platform).   │
└────────────────────────────────────────────────────────────────────────┘
       │
       ▼
[Antrean Admin di /admin/verification]
       │
       ▼ (Admin Login dengan MFA)
┌────────────────────────────────────────────────────────────────────────┐
│ PANEL TELAAH VERIFIKASI ADMIN PLATFORM                                 │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Admin melihat antrean terurut berdasarkan waktu & SLA.              │
│    * Proteksi Integritas: Admin TIDAK BISA memverifikasi akun sendiri! │
│                                                                        │
│ 2. Buka Detail Berkas Pengajuan:                                       │
│    - BFF meminta URL bertanda tangan (Signed URL) pendek (60 detik).   │
│    - Dokumen terbuka di pratinjau kaca aman.                           │
│                                                                        │
│ 3. Keputusan Admin (Wajib Sertakan Alasan Audit):                      │
│    - Opsi A: [PERLU REVISI]                                            │
│      -> Masukkan catatan perbaikan (contoh: "Foto KTP buram").         │
│      -> Status profil: "Perlu Revisi". Pengguna dapat submit ulang.    │
│    - Opsi B: [TOLAK]                                                   │
│      -> Masukkan alasan penolakan definitif.                           │
│      -> Status profil: "Ditolak".                                      │
│    - Opsi C: [SETUJUI & VERIFIKASI]                                    │
│      -> Eksekusi RPC `rpc_transition_verification`.                    │
│      -> Terbitkan Nomor Lencana Otomatis: `ESP-SB-VER-YYYY-XXXX`.      │
│      -> Status profil: "Terverifikasi" (Aktif 12 Bulan).               │
│      -> Event Domain `VerificationDecided` ditembakkan ke Outbox.      │
└────────────────────────────────────────────────────────────────────────┘
       │
       ▼
[Efek Visual Otomatis ke Profil Pengguna]
- Lencana Emas (Shield + Checkmark) muncul di sudut kanan atas kartu TCG.
- Tampil di Direktori Publik (`/players`, dll.) dengan filter "Terverifikasi".
- Halaman Publik Cek Status `/verify/[esport-id]` aktif dan menampilkan centang hijau.
```

### Temuan & Masalah pada Alur 2:
- **Titik Putus 1**: Pada kode lama, masih ada residu status "regional" vs "provincial" di komponen `VerificationBadge.tsx` dan `DesktopVerificationView.tsx`.
- **Titik Putus 2**: SLA antrean masih ditulis hardcode *"1-3 hari kerja pengurus cabang"*. Harus diubah membaca ambang konfigurasi admin secara dinamis (D16).
- **Titik Putus 3**: Signed URL bukti pendukung sebelumnya diset 15 menit. Harus diperpendek menjadi 60 detik (R6) agar tidak disimpan browser/cache.

---

## 3. Alur 3: Ekosistem Kemitraan & Relasi Antar-Entitas

```
[Pengguna Entitas A (Contoh: Player) di /explore atau Profil Klub B]
       │
       ▼
[Klik "Kirim Permintaan Hubungan: Anggota Tim"]
       │
       ▼
[Validasi Aturan Deklaratif (relation_rules V3) di BFF]
       │
       ├──(Melanggar batas: Player sudah punya 3 tim aktif) ──> [Tolak: Batas Maksimal 3 Tim]
       ├──(Game tidak cocok: Game tim MLBB, Player main HOK) ──> [Tolak: Game Utama Tidak Sesuai]
       │
       ▼ (Validasi Lolos)
[Simpan ke tabel `entity_relations` (status: "pending")]
       │
       ▼
[Kirim Notifikasi ke Akun Pemilik Entitas B (Klub)]
       │
       ▼ (Pemilik Entitas B membuka /me/ecosystem)
┌────────────────────────────────────────────────────────────────────────┐
│ TABEL KELOLA RELASI EKOSISTEM SAYA                                     │
├────────────────────────────────────────────────────────────────────────┤
│ Ada Permintaan Masuk dari: [Aldo Saputra (Player - HOK)]               │
│ Opsi:                                                                  │
│  - [TOLAK]   ──> Status relasi diubah ke "rejected", dipindah riwayat. │
│  - [SETUJUI] ──> Eksekusi persetujuan di BFF.                          │
│                  * Status relasi: "active".                            │
│                  * Roster tim di `/team/[slug]` ter-update otomatis.   │
│                  * Sisi profil pemain `/player/[slug]` mencantumkan tim│
└────────────────────────────────────────────────────────────────────────┘
       │
       ▼
[Kedua belah pihak dapat mengakhiri relasi kapan saja lewat tombol "Akhiri Hubungan"]
       │
       ▼
[Status relasi berubah menjadi "ended" dan diarsipkan ke riwayat historis]
```

### Temuan & Masalah pada Alur 3:
- **Titik Putus 1**: Penamaan rute saat ini adalah `/me/memberships`. Sesuai V3, harus diselaraskan menjadi `/me/ecosystem` dengan dukungan 7 entitas (bukan hanya tim-player).
- **Titik Putus 2**: Notifikasi penerimaan relasi masih menggunakan teks *"Relasi disetujui secara resmi"* (klaim resmi terlarang). Wajib diganti teks modul copy.

---

## 4. Alur 4: Modifikasi Data Kunci & Proteksi Integritas Verifikasi

```
[Pengguna Terverifikasi Emas di /me/edit]
       │
       ▼
[Ubah Data Non-Kunci (Bio, Foto Profil, Akun Medsos)]
       │
       ▼
[Data Tersimpan: Status Verifikasi TETAP "Terverifikasi"]
       │
       ─────────────────────────────────────────────────
       │
[Ubah Data KUNCI Integritas (Nama Lengkap, IGN, Cabang Game, Wilayah, TTL)]
       │
       ▼
[Modal Peringatan Kaca: "Mengubah data kunci akan mencabut status verifikasi Anda!"]
       │
       ├──(Pengguna Batal) ──> Form tidak disimpan.
       │
       ▼ (Pengguna Konfirmasi Simpan)
[Pembaruan Disimpan di BFF]
       │
       ▼
[Trigger Database / RPC Otomatis: Reset Verifikasi]
       │
       * Status berubah kembali ke: "Belum Terverifikasi" (unverified).
       * Nomor lencana dicabut sementara.
       * Notifikasi otomatis dikirimkan ke pengguna untuk mengajukan verifikasi ulang.
```

### Temuan & Masalah pada Alur 4:
- Modal peringatan pencabutan verifikasi saat edit data kunci di `EditProfileClientForm.tsx` saat ini belum menampilkan rincian field mana saja yang memicu pencabutan.
- Pada Bagian 3, modal peringatan diperjelas dengan visual highlight field berisiko.

---

## 5. Ringkasan Titik Putus & Layanan Hilang yang Wajib Dibangun (Checklist Bagian 3)

1. [ ] **Layar /auth/check-email**: Halaman transisi yang menginstruksikan pengguna mengecek inbox setelah mendaftar.
2. [ ] **Rute /forgot-password & /reset-password**: Halaman lupa kata sandi dan atur ulang kata sandi dengan layout kaca.
3. [ ] **Halaman Publik /games & /games/[slug]**: Katalog game dinamis dan detail ketentuan cabang game.
4. [ ] **Halaman /verification-standard**: Standar tata kelola verifikasi satu tahap transparan.
5. [ ] **Halaman /verify/[esport-id]**: Scanner dan pemeriksa status lencana publik via ESPORT ID.
6. [ ] **Halaman /content-policy, /contact, /faq**: Kelengkapan informasi hukum, pedoman UGC, dan kontak narahubung.
7. [ ] **Halaman Sistem /403 & /offline**: Penanganan akses ditolak dan mode offline PWA yang anggun.
8. [ ] **Halaman Admin /admin/system**: Monitoring kesehatan layanan, kuota, dan info build (commit hash).
9. [ ] **Pengalihan 301 Tautan Rusak**:
   - `/partners` ──(301)──> `/ecosystem`
   - `/admin/region/*` ──(301)──> `/admin`
   - `/admin/province/*` ──(301)──> `/admin`
   - `/me/memberships` ──(301)──> `/me/ecosystem`
   - `/me/cards` ──(301)──> `/me/card`
