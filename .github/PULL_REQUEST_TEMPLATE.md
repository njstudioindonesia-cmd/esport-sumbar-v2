## Deskripsi Perubahan
Ringkasan singkat mengenai perubahan yang diajukan dalam PR ini.

## Tipe Perubahan
- [ ] `feat`: Fitur baru
- [ ] `fix`: Perbaikan bug
- [ ] `refactor`: Refaktor tanpa perubahan perilaku
- [ ] `docs`: Pembaruan dokumentasi
- [ ] `test`: Penambahan pengujian otomatis
- [ ] `chore`: Perubahan tooling / dependensi

## Protokol Gerbang Mutu
- [ ] `npm run type-check` lulus 0 error
- [ ] `npm run lint` lulus tanpa warning baru
- [ ] `npm run test` lulus semua skenario
- [ ] `node scripts/sweep-terms.js` lulus (0 istilah terlarang)
- [ ] `node scripts/scan-secrets.js` lulus (0 rahasia bocor)
- [ ] Tidak ada data sensitif (KTP/NIK) yang terekspos ke publik
