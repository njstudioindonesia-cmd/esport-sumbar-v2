# RUNBOOK: TWO-DEPLOY ARCHITECTURE & ADMIN CUTOVER (BAGIAN 6)
**Dokumen Resmi Rilis & Panduan Operasional Pengurus V3**  
*Sistem Rilis Pratinjau-Dulu ESPORT SUMBAR*

---

## 1. Ringkasan Eksekutif & Tujuan Arsitektural (ADR 002)

Pemisahan `apps/admin` dari `apps/web` menjadi dua deploy independen menyelesaikan 3 risiko keamanan dan operasional mendasar:
1. **Eliminasi Permukaan Serangan (Attack Surface)**: Bundel JavaScript situs publik (`apps/web`) 100% bebas dari kode administratif, logika persetujuan verifikasi, dan kunci internal.
2. **Isolasi Sesi & Kredensial (Host-Only Cookies)**: Cookie sesi pengurus tidak dibagi ke domain publik. Kebocoran cookie pada peramban pengguna publik tidak berdampak pada kredensial portal admin.
3. **Pemberhentian Indeks Mesin Pencari (Search Engine Isolation)**: Semua respons `apps/admin` menyertakan tajuk HTTP ketat:
   ```http
   X-Robots-Tag: noindex, nofollow, noarchive
   ```

---

## 2. Struktur Proyek & Matriks Variabel Lingkungan

### A. Proyek 1: `esport-sumbar-web` (Situs Publik & PWA)
- **Root Directory di Vercel**: `apps/web` (atau root monorepo dengan root directory override `apps/web`)
- **Domain Produksi**: `esportsumbar.com`, `www.esportsumbar.com` (saat ini: `esport-sumbar-v2.vercel.app`)
- **Domain Staging**: `staging.esportsumbar.com`
- **Variabel Lingkungan Wajib**:
  | Kunci | Nilai Staging | Nilai Produksi | Keterangan |
  |---|---|---|---|
  | `NEXT_PUBLIC_SUPABASE_URL` | `https://xgkeqmsmhveuzajwajyg.supabase.co` | `https://gxtzbyeqdmhtddgesbxb.supabase.co` | Endpoint Supabase |
  | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_...` | `sb_publishable_...` | Kunci Anonim Publik |
  | `SUPABASE_SERVICE_ROLE_KEY` | `sb_secret_...` | `sb_secret_...` | Kunci Layanan Terbatas Server |
  | `NEXT_PUBLIC_ADMIN_URL` | `https://admin-staging.esportsumbar.com` | `https://admin.esportsumbar.com` | Target Pengalihan 301 `/admin` |
  | `REVALIDATION_SECRET` | `secret-hmac-sha256-rev-staging` | `secret-hmac-sha256-rev-prod` | Rahasia Webhook ISR |

### B. Proyek 2: `esport-sumbar-admin` (Portal Pengurus & Verifikasi)
- **Root Directory di Vercel**: `apps/admin`
- **Domain Produksi**: `admin.esportsumbar.com`
- **Domain Staging**: `admin-staging.esportsumbar.com` (atau deployment preview Vercel)
- **Variabel Lingkungan Wajib**:
  | Kunci | Nilai Staging | Nilai Produksi | Keterangan |
  |---|---|---|---|
  | `NEXT_PUBLIC_SUPABASE_URL` | `https://xgkeqmsmhveuzajwajyg.supabase.co` | `https://gxtzbyeqdmhtddgesbxb.supabase.co` | Endpoint Supabase |
  | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_...` | `sb_publishable_...` | Kunci Anonim |
  | `SUPABASE_SERVICE_ROLE_KEY` | `sb_secret_...` | `sb_secret_...` | Kunci Eksekusi Admin |
  | `NEXT_PUBLIC_WEB_URL` | `https://staging.esportsumbar.com` | `https://esportsumbar.com` | URL Web Publik untuk ISR |
  | `REVALIDATION_SECRET` | `secret-hmac-sha256-rev-staging` | `secret-hmac-sha256-rev-prod` | Pengirim Sinyal ISR Berstempel |

---

## 3. Langkah Demi Langkah Pembentukan Deploy Admin di Vercel

### Tahap 1: Inisialisasi Proyek Vercel Baru
1. Buka dashboard Vercel: `https://vercel.com/dashboard`.
2. Klik tombol **Add New...** > **Project**.
3. Pilih repositori GitHub: `njstudioindonesia/esport-sumbar-v2`.
4. Pada menu konfigurasi proyek:
   - **Project Name**: `esport-sumbar-admin`
   - **Framework Preset**: Next.js
   - **Root Directory**: Klik *Edit*, pilih `apps/admin`.
   - **Build Command**: `next build`
   - **Output Directory**: `.next`
   - **Install Command**: Biarkan monorepo default (`npm install` di root).

### Tahap 2: Pengisian Variabel Lingkungan
1. Buka menu **Settings** > **Environment Variables** pada proyek `esport-sumbar-admin`.
2. Masukkan seluruh variabel tabel B di atas.
3. Pastikan `SUPABASE_SERVICE_ROLE_KEY` diset sebagai sensitif (Encrypt).

### Tahap 3: Pengaturan Domain & DNS
1. Buka menu **Settings** > **Domains**.
2. Tambahkan subdomain: `admin.esportsumbar.com` (atau `admin-staging.esportsumbar.com` untuk pengujian pratinjau).
3. Buat CNAME record pada DNS provider (Cloudflare / Namecheap):
   - **Type**: CNAME
   - **Name**: `admin`
   - **Target**: `cname.vercel-dns.com`
   - **TTL**: Auto / 300 detik

---

## 4. Mekanisme Pengalihan Web ke Admin (301 Permanent Redirect)

Di dalam `apps/web/src/middleware.ts`, seluruh lalu lintas yang mencoba mengakses `/admin` atau `/admin/*` dialihkan langsung ke domain portal admin:

```typescript
const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:3001";
if (pathname === "/admin" || pathname.startsWith("/admin/")) {
  const targetSubpath = pathname.replace(/^\/admin/, "") || "/";
  const redirectTarget = new URL(targetSubpath, adminUrl);
  return NextResponse.redirect(redirectTarget, { status: 301 });
}
```

Uji verifikasi:
```bash
curl -I https://esportsumbar.com/admin
# Respon: HTTP/1.1 301 Moved Permanently
# Location: https://admin.esportsumbar.com/
```

---

## 5. Filter Jalur CI/CD (Path-Filtered Deployments)

Agar perubahan kode di `apps/web` tidak memicu deploy ulang `apps/admin` (dan sebaliknya), konfigurasi *Ignored Build Step* pada pengaturan Git Vercel disetel sebagai berikut:

- **Pada Proyek Web (`apps/web`)**:
  ```bash
  # In Settings > Git > Ignored Build Step
  git diff --quiet HEAD^ HEAD -- . ../../packages/
  ```
- **Pada Proyek Admin (`apps/admin`)**:
  ```bash
  # In Settings > Git > Ignored Build Step
  git diff --quiet HEAD^ HEAD -- . ../../packages/
  ```

---

## 6. Prosedur Uji Verifikasi Pasca Cutover (Verification Checklist)

1. [x] Akses `http://localhost:3000/admin` -> Terpental 301 ke `http://localhost:3001/`.
2. [x] Akses `http://localhost:3001/` -> Membuka Ringkasan Operasional Platform.
3. [x] Inspeksi Header Respons `http://localhost:3001/`:
   ```http
   X-Robots-Tag: noindex, nofollow, noarchive
   ```
4. [x] Periksa Bundel Web: Tidak ada rute `/admin` yang terkompilasi dalam output `next build` milik `apps/web`.
5. [x] Periksa Batas Impor: `npm run type-check` dan `node scripts/ci/check-import-boundaries.mjs` lulus 100%.

---

## 7. Prosedur Rollback Cepat (< 60 Detik)

Bila terjadi kendala konektivitas DNS pada subdomain admin:
1. Ubah variabel `NEXT_PUBLIC_ADMIN_URL` di Vercel proyek web kembali ke target lama sementara.
2. Sesi database tidak terganggu karena kedua aplikasi membaca skema Supabase yang sama secara kompatibel.
