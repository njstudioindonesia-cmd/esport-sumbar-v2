# 📱 ESPORT SUMBAR V2 - Official Android Mobile App (Flutter)

Aplikasi resmi Android untuk atlet, pelatih, wasit, dan komunitas **PBESI Sumatera Barat**. Terhubung langsung dengan database cloud Supabase secara realtime dan berbagi data 1:1 dengan platform web tanpa risiko konflik atau regresi.

---

## 🌟 Fitur Utama

1. **3D Touch & Parallax Card**:
   - Kartu identitas atlet TCG dengan efek perspektif 3D, physics kemiringan sentuhan jari, dan shader pantulan cahaya holografik emas (*Minang Championship Gold*).
   - Tap untuk membalik (*flip*) kartu dan menampilkan QR Code verifikasi PBESI resmi.
2. **Realtime WebSocket Sync**:
   - Terhubung langsung ke channel database Supabase. Setiap perubahan data verifikasi, status tim, atau skor atlet di website langsung ter-update di aplikasi Android secara instan (0 delay).
3. **QR Code Verification Scanner**:
   - Terintegrasi kamera untuk memindai keabsahan ID atlet di arena pertandingan.
4. **Isolasi Penuh dari Web**:
   - Terletak di `apps/mobile` dan beroperasi secara independen terhadap `apps/web`.

---

## 🚀 Panduan Menjalankan Aplikasi

### 1. Prasyarat
- [Flutter SDK](https://docs.flutter.dev/get-started/install/windows) (versi 3.19 ke atas).
- Android Studio / Android SDK (dengan emulator atau perangkat fisik Android dengan mode Developer Options aktif).

### 2. Mengambil Dependensi
Buka terminal di folder `apps/mobile`:
```bash
cd apps/mobile
flutter pub get
```

### 3. Menjalankan di Perangkat Android / Emulator
Gunakan kredensial Supabase yang sama dengan yang ada di file `apps/web/.env.local`:
```bash
flutter run \
  --dart-define=SUPABASE_URL=https://PROYEK_ANDA.supabase.co \
  --dart-define=SUPABASE_ANON_KEY=KUNCI_ANON_ANDA
```

### 4. Build APK Release (Siap Install di HP)
```bash
flutter build apk --release \
  --dart-define=SUPABASE_URL=https://PROYEK_ANDA.supabase.co \
  --dart-define=SUPABASE_ANON_KEY=KUNCI_ANON_ANDA
```
File APK akan berada di: `build/app/outputs/flutter-apk/app-release.apk`.
