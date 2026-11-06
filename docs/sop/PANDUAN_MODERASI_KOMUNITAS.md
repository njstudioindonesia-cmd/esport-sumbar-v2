# Panduan Moderasi & Penanganan Aduan Komunitas (PANDUAN_MODERASI_KOMUNITAS.md)

**Proyek**: ESPORT SUMBAR V3  
**Nomor Dokumen**: SOP-ESB-MOD-001  
**Otoritas Penerbit**: Tim Moderasi & Integritas Kompetisi ESPORT SUMBAR  

---

## 1. Tujuan & Ruang Lingkup

Panduan ini mengatur tata cara investigasi, verifikasi fakta, dan pengambilan tindakan terhadap aduan masyarakat atau laporan dugaan pelanggaran yang diajukan melalui portal publik platform ESPORT SUMBAR.

Modul ini dikelola secara terpusat melalui panel admin:
- Antarmuka: `/admin/moderation`
- BFF Endpoint: `/api/admin/reports`

---

## 2. Kategori Pelanggaran

| Kategori | Deskripsi | Contoh Kasus |
|---|---|---|
| **Kecurangan Kompetisi (*Cheating*)** | Penggunaan program pihak ketiga, maphack, script, bot, atau exploit yang dilarang oleh pengembang game resmi. | Penggunaan plugin maphack MLBB atau script recoil PUBG. |
| **Pemalsuan Identitas (*Impersonation*)** | Menggunakan nama, foto, atau identitas orang lain untuk mendaftar akun atau mengklaim kepemilikan tim. | Menggunakan IGN pro-player tanpa hak untuk menipu komunitas. |
| **Joki Akun (*Account Sharing*)** | Mengalihkan akun atau kartu kompetisi kepada pemain lain saat turnamen resmi. | Joki pertandingan kualifikasi daerah. |
| **Pelanggaran Etika & Ujaran Kebencian** | Penyebaran kata-kata kasar, pelecehan, sara, atau ancaman kekerasan pada profil publik atau materi turnamen. | Penulisan bio profil yang memuat konten diskriminatif. |
| **Konten Tidak Pantas (*Inappropriate Content*)** | Unggahan gambar avatar, logo, atau banner yang melanggar kesusilaan atau norma masyarakat Minangkabau. | Gambar berbau pornografi atau simbol kebencian. |

---

## 3. Tingkatan Sanksi Disiplin

Sanksi dijatuhkan secara bertingkat berdasarkan tingkat keparahan pelanggaran:

```
[Tingkat 1: Peringatan Resmi (Warning)]
       ↓
[Tingkat 2: Reset / Pembersihan Konten (Content Wipe)]
       ↓
[Tingkat 3: Penangguhan Sementara (Temporary Suspension 30-90 Hari)]
       ↓
[Tingkat 4: Larangan Permanen (Permanent Blacklist / Ban)]
```

### Penjelasan Sanksi:
1. **Peringatan Resmi (Warning)**:
   - Diberikan untuk pelanggaran etika ringan pertama kali. Notifikasi dikirimkan langsung ke akun terlapor.
2. **Pembersihan Konten (Content Wipe)**:
   - Avatar, logo, atau bio yang melanggar aturan dihapus paksa oleh admin dan digantikan dengan placeholder netral.
3. **Penangguhan Sementara (*Temporary Suspension*)**:
   - Status profil diubah menjadi `suspended`. Lencana verifikasi dicabut sementara, dan profil disembunyikan dari direktori publik selama masa hukuman.
4. **Larangan Permanen (*Permanent Blacklist*)**:
   - Diberlakukan untuk kasus kecurangan berat in-game atau pemalsuan identitas berulang. Akun diblokir permanen dan dimasukkan ke daftar sanksi disiplin resmi ESPORT SUMBAR.

---

## 4. Prosedur Triase & Penyelesaian Aduan (Admin Workflow)

1. **Penerimaan Laporan**:
   - Aduan masuk ke `/admin/moderation` dengan status `pending`.
2. **Pemeriksaan Bukti**:
   - Admin memeriksa deskripsi, tangkapan layar bukti, serta profil terlapor.
3. **Pemberian Keputusan**:
   - **Tolak Aduan (*Dismissed*)**: Jika bukti tidak mencukupi, tidak relevan, atau berunsur fitnah. Laporan ditutup dengan catatan: *"Bukti tidak mencukupi / Laporan tidak berdasar"*.
   - **Tindak Tegas (*Resolved*)**: Jika terbukti melanggar. Admin menjatuhkan sanksi dan mencatat tindakan yang diambil pada kolom catatan penyelesaian (*Resolution Notes*).
4. **Pencatatan Audit**:
   - Seluruh resolusi aduan dicatat secara otomatis ke dalam jejak audit SHA-256 (`audit_logs`) untuk transparansi operasional.
