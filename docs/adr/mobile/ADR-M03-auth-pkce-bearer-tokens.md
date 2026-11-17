# ADR-M03: Autentikasi Mobile, PKCE, Penyimpanan Aman, dan Dukungan Bearer Token di BFF

**Status**: APPROVED  
**Tanggal**: November 2026  

---

## 1. Konteks
Klien web ESPORT SUMBAR menggunakan cookie sesi HTTP-Only (`@supabase/ssr`). Klien native mobile tidak memiliki cookie jar browser terisolasi dan rentan terhadap kehilangan sesi. Selain itu, temuan audit **G1** membuktikan bahwa BFF (`/api/*`) saat ini hanya membaca `cookies()`.

## 2. Keputusan Arsitektur
1. **Otentikasi Klien Native**:
   - Menggunakan Supabase Auth dengan alur **PKCE (Proof Key for Code Exchange)**.
   - Token sesi (`access_token` dan `refresh_token`) disimpan di **`expo-secure-store`** (iOS Keychain dan Android Keystore terenkripsi hardware).
2. **Dukungan Bearer Token di BFF (Bagian 2.3)**:
   - Modifikasi `apps/web/src/lib/supabase/server.ts` agar memeriksa header `Authorization: Bearer <token>` bila cookie tidak ditemukan:
     ```typescript
     const authHeader = req.headers.get("authorization");
     if (authHeader?.startsWith("Bearer ")) {
       // Verifikasi JWT via Supabase client dengan token bearer
     }
     ```
   - Aturan keamanan: Tidak ada pelonggaran RLS. Identitas user diekstraksi dari klaim JWT yang divalidasi kriptografis.
3. **Keluaran Bersih (Clean Logout)**:
   - Saat pengguna keluar (*logout*), token dicabut di server Supabase, token lokal di Keystore dihapus, cache lokal dibersihkan, dan token perangkat push notification dihapus dari database.
