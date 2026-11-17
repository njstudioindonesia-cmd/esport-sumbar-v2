# ADR-M06: Arsitektur Deep Linking, Universal Links, dan Android App Links

**Status**: APPROVED  
**Tanggal**: November 2026  

---

## 1. Konteks
Tautan profil atlet (`https://esportsumbar.com/p/[slug]`) dan tautan verifikasi QR (`https://esportsumbar.com/verify/[id]`) harus otomatis membuka aplikasi native jika terpasang di smartphone pengguna.

## 2. Keputusan Arsitektur
1. **Pola Skema Tautan**:
   - Skema kustom: `esportsumbar://`
   - Universal Links (iOS) & Android App Links: `https://esport-sumbar-v2.vercel.app` (staging) dan domain resmi produksi.
2. **Berkas Asosiasi Web**:
   - `apps/web/public/.well-known/assetlinks.json` (Android SHA-256 fingerprint).
   - `apps/web/public/.well-known/apple-app-site-association` (Apple Team ID & Bundle ID).
3. **Peta Rute Deep Link**:
   - `/p/:slug` $\rightarrow$ Layar Profil Publik.
   - `/verify/:id` $\rightarrow$ Layar Lembar Status Verifikasi Resmi.
   - `/ecosystem/invite/:code` $\rightarrow$ Layar Konfirmasi Undangan Relasi.
   - `/auth/callback` $\rightarrow$ Konfirmasi Sesi Login Email/OTP.
4. **Keamanan Deep Link**:
   - Parameter `next` divalidasi ketat (hanya jalur internal).
   - Mencegah *open redirect* ke domain luar.
