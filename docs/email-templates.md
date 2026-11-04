# ESPORT SUMBAR™ - Template Email Resmi Supabase Auth

Dokumen ini menyediakan template HTML siap pakai untuk disalin ke **Supabase Dashboard > Authentication > Email Templates**.

---

## 1. Konfirmasi Pendaftaran (Confirm Signup)
**Subject:** `Konfirmasi Akun ESPORT SUMBAR™ Anda`

```html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <title>Konfirmasi Akun ESPORT SUMBAR</title>
</head>
<body style="margin: 0; padding: 0; background-color: #03031A; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #FFFFFF;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #03031A; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="540" border="0" cellspacing="0" cellpadding="0" style="max-width: 540px; background-color: #0A0A2E; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px; overflow: hidden; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);">
          <!-- Brand Line Top -->
          <tr>
            <td height="4" style="background-color: #FF1752; font-size: 0; line-height: 0;">&nbsp;</td>
          </tr>
          <!-- Header Logo -->
          <tr>
            <td align="center" style="padding: 36px 30px 20px 30px;">
              <img src="https://esport-sumbar-v2.vercel.app/brand/logo-lockup-navy-cropped.png" alt="ESPORT SUMBAR" width="180" style="display: block; border: 0;" />
            </td>
          </tr>
          <!-- Body Content -->
          <tr>
            <td style="padding: 20px 36px 36px 36px;">
              <h1 style="margin: 0 0 16px 0; font-size: 22px; font-weight: 800; color: #FFFFFF; text-align: center; letter-spacing: -0.5px;">Selamat Datang di Arena Sumbar</h1>
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #9AA3B2; text-align: center;">
                Satu langkah lagi untuk mengaktifkan akun dan menerbitkan kartu identitas digital atlet esport Anda di Sumatera Barat.
              </p>
              <!-- Action Button -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding: 12px 0 28px 0;">
                    <a href="{{ .ConfirmationURL }}" target="_blank" style="display: inline-block; background-color: #FF1752; color: #FFFFFF; font-size: 14px; font-weight: bold; text-decoration: none; padding: 14px 36px; border-radius: 12px; box-shadow: 0 6px 20px rgba(255, 23, 82, 0.35); text-transform: uppercase; letter-spacing: 0.5px;">
                      Konfirmasi Akun Saya
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin: 0; font-size: 12px; line-height: 1.5; color: rgba(255, 255, 255, 0.4); text-align: center;">
                Jika tombol di atas tidak berfungsi, salin dan tempel tautan berikut ke peramban Anda:<br>
                <a href="{{ .ConfirmationURL }}" style="color: #FF4D77; word-break: break-all; font-size: 11px;">{{ .ConfirmationURL }}</a>
              </p>
            </td>
          </tr>
          <!-- Footer Legal -->
          <tr>
            <td style="background-color: #03031A; padding: 24px 30px; border-top: 1px solid rgba(255, 255, 255, 0.05); text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 11px; color: rgba(255, 255, 255, 0.5);">
                &copy; 2026 ESPORT SUMBAR&trade;. Hak cipta dilindungi undang-undang.
              </p>
              <p style="margin: 0; font-size: 10px; line-height: 1.4; color: rgba(255, 255, 255, 0.3);">
                Platform ini dimiliki dan dikelola oleh ESPORT SUMBAR&trade;. Pengprov ESI Sumbar dan ESI Kota/Kabupaten adalah mitra kelembagaan verifikasi data.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## 2. Atur Ulang Kata Sandi (Reset Password)
**Subject:** `Permintaan Atur Ulang Kata Sandi ESPORT SUMBAR™`

```html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <title>Reset Password ESPORT SUMBAR</title>
</head>
<body style="margin: 0; padding: 0; background-color: #03031A; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #FFFFFF;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #03031A; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="540" border="0" cellspacing="0" cellpadding="0" style="max-width: 540px; background-color: #0A0A2E; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px; overflow: hidden; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);">
          <tr>
            <td height="4" style="background-color: #FF1752; font-size: 0; line-height: 0;">&nbsp;</td>
          </tr>
          <tr>
            <td align="center" style="padding: 36px 30px 20px 30px;">
              <img src="https://esport-sumbar-v2.vercel.app/brand/logo-lockup-navy-cropped.png" alt="ESPORT SUMBAR" width="180" style="display: block; border: 0;" />
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 36px 36px 36px;">
              <h1 style="margin: 0 0 16px 0; font-size: 22px; font-weight: 800; color: #FFFFFF; text-align: center;">Atur Ulang Kata Sandi</h1>
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #9AA3B2; text-align: center;">
                Kami menerima permintaan untuk mengatur ulang kata sandi akun ESPORT SUMBAR Anda. Klik tombol di bawah untuk membuat kata sandi baru yang aman.
              </p>
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding: 12px 0 28px 0;">
                    <a href="{{ .ConfirmationURL }}" target="_blank" style="display: inline-block; background-color: #FF1752; color: #FFFFFF; font-size: 14px; font-weight: bold; text-decoration: none; padding: 14px 36px; border-radius: 12px; box-shadow: 0 6px 20px rgba(255, 23, 82, 0.35); text-transform: uppercase;">
                      Buat Kata Sandi Baru
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin: 0; font-size: 11px; color: rgba(255, 255, 255, 0.35); text-align: center;">
                Abaikan email ini jika Anda tidak meminta penggantian kata sandi.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #03031A; padding: 24px 30px; border-top: 1px solid rgba(255, 255, 255, 0.05); text-align: center;">
              <p style="margin: 0; font-size: 11px; color: rgba(255, 255, 255, 0.5);">
                &copy; 2026 ESPORT SUMBAR&trade;. Hak cipta dilindungi undang-undang.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```
