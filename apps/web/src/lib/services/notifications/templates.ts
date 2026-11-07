import { NotificationType } from "@esport-sumbar/contracts";

export interface EmailTemplateResult {
  subject: string;
  html: string;
  text: string;
}

export interface InAppTemplateResult {
  title: string;
  body: string;
  actionUrl?: string;
}

const BRAND_HEADER = `
<div style="background-color: #0b0f17; padding: 24px; text-align: center; border-bottom: 2px solid #D4AF37;">
  <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 1px;">
    ESPORT SUMBAR
  </h1>
  <p style="color: #94a3b8; margin: 6px 0 0 0; font-size: 13px;">
    Platform Registrasi & Ekosistem Terpadu Sumatera Barat
  </p>
</div>
`;

const BRAND_FOOTER = `
<div style="background-color: #0b0f17; padding: 20px; text-align: center; border-top: 1px solid #1e293b; margin-top: 32px;">
  <p style="color: #64748b; font-size: 12px; margin: 0; line-height: 1.6;">
    Pemberitahuan dikirim secara otomatis oleh sistem <strong>ESPORT SUMBAR</strong>.<br />
    ESPORT SUMBAR merupakan pemilik dan pengelola tunggal platform ini.<br />
    Hak Cipta &copy; 2026 ESPORT SUMBAR. Seluruh hak cipta dilindungi undang-undang.
  </p>
</div>
`;

function wrapEmailBody(contentHtml: string): string {
  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #020617; color: #f1f5f9; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #0f172a; border-radius: 8px; overflow: hidden; border: 1px solid #1e293b;">
    ${BRAND_HEADER}
    <div style="padding: 32px 24px; line-height: 1.6;">
      ${contentHtml}
    </div>
    ${BRAND_FOOTER}
  </div>
</body>
</html>
  `.trim();
}

/**
 * 1. Templat Verifikasi Disetujui
 */
export function renderVerificationApprovedEmail(params: {
  recipientName: string;
  esportId: string;
  badgeNo: string;
  profileUrl: string;
}): EmailTemplateResult {
  const subject = `Selamat! Verifikasi Profil Anda Disetujui - ESPORT SUMBAR`;
  const text = `Halo ${params.recipientName},\n\nSelamat! Pengajuan verifikasi profil Anda telah DISETUJUI oleh Tim Verifikator ESPORT SUMBAR.\n\nNomor Registrasi Verifikasi: ${params.badgeNo}\nID ESPORT SUMBAR: ${params.esportId}\n\nProfil Anda kini bertanda Terverifikasi (Verified) di direktori publik ESPORT SUMBAR.\nLihat profil: ${params.profileUrl}\n\nSalam hormat,\nTim ESPORT SUMBAR`;

  const html = wrapEmailBody(`
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="display: inline-block; background-color: rgba(34, 197, 94, 0.1); color: #22c55e; border: 1px solid #22c55e; padding: 6px 16px; border-radius: 20px; font-weight: 600; font-size: 13px;">
        STATUS: VERIFIKASI DISETUJUI
      </span>
    </div>
    <h2 style="color: #ffffff; font-size: 18px; margin-top: 0;">Halo ${params.recipientName},</h2>
    <p style="color: #cbd5e1;">Selamat! Pengajuan verifikasi Anda telah selesai ditinjau dan dinyatakan <strong>VALID</strong> oleh Tim Verifikator ESPORT SUMBAR.</p>
    
    <div style="background-color: #1e293b; padding: 20px; border-radius: 6px; margin: 24px 0; border-left: 4px solid #D4AF37;">
      <p style="margin: 0 0 8px 0; font-size: 13px; color: #94a3b8;">Nomor Registrasi Verifikasi:</p>
      <p style="margin: 0 0 16px 0; font-size: 18px; font-weight: 700; color: #D4AF37; font-family: monospace;">${params.badgeNo}</p>
      <p style="margin: 0 0 8px 0; font-size: 13px; color: #94a3b8;">ID ESPORT SUMBAR:</p>
      <p style="margin: 0; font-size: 16px; font-weight: 600; color: #ffffff; font-family: monospace;">${params.esportId}</p>
    </div>

    <p style="color: #cbd5e1;">Lencana verifikasi kini aktif pada kartu dan profil publik Anda di seluruh jaringan ekosistem Sumatera Barat.</p>
    
    <div style="text-align: center; margin-top: 32px;">
      <a href="${params.profileUrl}" style="background-color: #D4AF37; color: #000000; padding: 12px 28px; text-decoration: none; font-weight: 700; border-radius: 6px; display: inline-block;">
        Lihat Kartu & Profil
      </a>
    </div>
  `);

  return { subject, html, text };
}

/**
 * 2. Templat Permintaan Revisi Verifikasi
 */
export function renderVerificationRevisionEmail(params: {
  recipientName: string;
  revisionNotes: string;
  editUrl: string;
}): EmailTemplateResult {
  const subject = `Pemberitahuan: Perbaikan Berkas Verifikasi Diperlukan - ESPORT SUMBAR`;
  const text = `Halo ${params.recipientName},\n\nTim Verifikator ESPORT SUMBAR telah meninjau berkas pengajuan Anda dan memerlukan perbaikan data.\n\nCatatan Tim Verifikator:\n"${params.revisionNotes}"\n\nSilakan perbaiki data melalui tautan berikut:\n${params.editUrl}\n\nSalam hormat,\nTim Verifikator ESPORT SUMBAR`;

  const html = wrapEmailBody(`
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="display: inline-block; background-color: rgba(234, 179, 8, 0.1); color: #eab308; border: 1px solid #eab308; padding: 6px 16px; border-radius: 20px; font-weight: 600; font-size: 13px;">
        STATUS: PERBAIKAN DIPERLUKAN
      </span>
    </div>
    <h2 style="color: #ffffff; font-size: 18px; margin-top: 0;">Halo ${params.recipientName},</h2>
    <p style="color: #cbd5e1;">Pengajuan verifikasi Anda memerlukan pembaruan atau kelengkapan data tambahan sebelum dapat disetujui.</p>
    
    <div style="background-color: #1e293b; padding: 20px; border-radius: 6px; margin: 24px 0; border-left: 4px solid #eab308;">
      <p style="margin: 0 0 8px 0; font-size: 13px; color: #94a3b8; font-weight: 600;">Catatan Verifikator:</p>
      <p style="margin: 0; color: #f8fafc; font-size: 14px; line-height: 1.5; font-style: italic;">"${params.revisionNotes}"</p>
    </div>

    <p style="color: #cbd5e1;">Harap segera melengkapi revisi agar berkas Anda dapat diproses ke tahap akhir.</p>
    
    <div style="text-align: center; margin-top: 32px;">
      <a href="${params.editUrl}" style="background-color: #eab308; color: #000000; padding: 12px 28px; text-decoration: none; font-weight: 700; border-radius: 6px; display: inline-block;">
        Perbaiki Berkas Sekarang
      </a>
    </div>
  `);

  return { subject, html, text };
}

/**
 * 3. Templat Permintaan Hubungan Ekosistem Baru
 */
export function renderRelationRequestedEmail(params: {
  recipientName: string;
  requesterName: string;
  relationType: string;
  confirmUrl: string;
}): EmailTemplateResult {
  const subject = `Permintaan Kemitraan Ekosistem Baru dari ${params.requesterName} - ESPORT SUMBAR`;
  const text = `Halo ${params.recipientName},\n\n${params.requesterName} telah mengajukan kemitraan ekosistem baru (${params.relationType}) dengan Anda di platform ESPORT SUMBAR.\n\nTinjau dan konfirmasi permintaan ini di: ${params.confirmUrl}\n\nSalam hormat,\nTim ESPORT SUMBAR`;

  const html = wrapEmailBody(`
    <h2 style="color: #ffffff; font-size: 18px; margin-top: 0;">Halo ${params.recipientName},</h2>
    <p style="color: #cbd5e1;">Anda menerima ajakan kemitraan baru dalam ekosistem ESPORT SUMBAR:</p>
    
    <div style="background-color: #1e293b; padding: 20px; border-radius: 6px; margin: 24px 0; border-left: 4px solid #3b82f6;">
      <p style="margin: 0 0 6px 0; font-size: 13px; color: #94a3b8;">Pengaju Kemitraan:</p>
      <p style="margin: 0 0 12px 0; font-size: 16px; font-weight: 700; color: #ffffff;">${params.requesterName}</p>
      <p style="margin: 0 0 6px 0; font-size: 13px; color: #94a3b8;">Jenis Hubungan:</p>
      <p style="margin: 0; font-size: 14px; font-weight: 600; color: #D4AF37;">${params.relationType}</p>
    </div>

    <p style="color: #cbd5e1;">Kemitraan ini akan tampil pada profil kedua entitas di direktori publik setelah Anda memberikan persetujuan.</p>
    
    <div style="text-align: center; margin-top: 32px;">
      <a href="${params.confirmUrl}" style="background-color: #D4AF37; color: #000000; padding: 12px 28px; text-decoration: none; font-weight: 700; border-radius: 6px; display: inline-block;">
        Tinjau & Konfirmasi Permintaan
      </a>
    </div>
  `);

  return { subject, html, text };
}

/**
 * 4. Templat Persetujuan Hubungan Ekosistem
 */
export function renderRelationApprovedEmail(params: {
  recipientName: string;
  partnerName: string;
  relationType: string;
  profileUrl: string;
}): EmailTemplateResult {
  const subject = `Kemitraan Ekosistem dengan ${params.partnerName} Telah Aktif - ESPORT SUMBAR`;
  const text = `Halo ${params.recipientName},\n\nKemitraan ekosistem Anda dengan ${params.partnerName} (${params.relationType}) telah DISETUJUI dan aktif.\n\nLihat profil ekosistem: ${params.profileUrl}\n\nSalam hormat,\nTim ESPORT SUMBAR`;

  const html = wrapEmailBody(`
    <h2 style="color: #ffffff; font-size: 18px; margin-top: 0;">Halo ${params.recipientName},</h2>
    <p style="color: #cbd5e1;">Kemitraan ekosistem Anda telah terhubung:</p>
    
    <div style="background-color: #1e293b; padding: 20px; border-radius: 6px; margin: 24px 0; border-left: 4px solid #22c55e;">
      <p style="margin: 0 0 6px 0; font-size: 13px; color: #94a3b8;">Mitra Ekosistem:</p>
      <p style="margin: 0 0 12px 0; font-size: 16px; font-weight: 700; color: #ffffff;">${params.partnerName}</p>
      <p style="margin: 0 0 6px 0; font-size: 13px; color: #94a3b8;">Status:</p>
      <p style="margin: 0; font-size: 14px; font-weight: 600; color: #22c55e;">AKTIF & TERHUBUNG</p>
    </div>

    <p style="color: #cbd5e1;">Kemitraan ini kini memperkuat reputasi dan keterhubungan Anda dalam ekosistem Sumatera Barat.</p>
    
    <div style="text-align: center; margin-top: 32px;">
      <a href="${params.profileUrl}" style="background-color: #D4AF37; color: #000000; padding: 12px 28px; text-decoration: none; font-weight: 700; border-radius: 6px; display: inline-block;">
        Lihat Hubungan di Profil
      </a>
    </div>
  `);

  return { subject, html, text };
}

/**
 * 5. Templat Peringatan Keamanan Profil (Penggantian Media / Pengamanan Akun)
 */
export function renderSecurityAlertEmail(params: {
  recipientName: string;
  alertDetails: string;
}): EmailTemplateResult {
  const subject = `Pemberitahuan Keamanan: Pembaruan Aset Profil - ESPORT SUMBAR`;
  const text = `Halo ${params.recipientName},\n\nSistem ESPORT SUMBAR mendeteksi aktivitas pembaruan aset profil Anda: ${params.alertDetails}.\n\nJika ini bukan aktivitas Anda, segera hubungi admin ESPORT SUMBAR.\n\nSalam hormat,\nTim Keamanan ESPORT SUMBAR`;

  const html = wrapEmailBody(`
    <h2 style="color: #ffffff; font-size: 18px; margin-top: 0;">Halo ${params.recipientName},</h2>
    <p style="color: #cbd5e1;">Pemberitahuan pengamanan akun dan profil ESPORT SUMBAR Anda:</p>
    
    <div style="background-color: #1e293b; padding: 20px; border-radius: 6px; margin: 24px 0; border-left: 4px solid #ef4444;">
      <p style="margin: 0 0 6px 0; font-size: 13px; color: #94a3b8;">Aktivitas Terdeteksi:</p>
      <p style="margin: 0; font-size: 14px; color: #f8fafc; font-weight: 600;">${params.alertDetails}</p>
    </div>

    <p style="color: #94a3b8; font-size: 13px;">Jika Anda merasa tidak melakukan perubahan ini, segera amankan akun Anda atau hubungi layanan bantuan kami.</p>
  `);

  return { subject, html, text };
}

/**
 * Pemetaan Pesan Dalam-Aplikasi (In-App Notifications)
 */
export function buildInAppNotification(
  type: NotificationType,
  data: Record<string, any>
): InAppTemplateResult {
  switch (type) {
    case "verification_approved":
      return {
        title: "Verifikasi Profil Disetujui!",
        body: `Selamat! Profil Anda telah diverifikasi oleh Tim ESPORT SUMBAR dengan nomor ${data.badgeNo || ""}.`,
        actionUrl: data.profileUrl || "/me/cards",
      };
    case "verification_revision":
      return {
        title: "Perbaikan Berkas Verifikasi Diperlukan",
        body: `Catatan verifikator: "${data.notes || "Harap lengkapi berkas Anda"}".`,
        actionUrl: data.editUrl || "/me/verification",
      };
    case "verification_rejected":
      return {
        title: "Pengajuan Verifikasi Ditolak",
        body: `Pengajuan verifikasi tidak dapat disetujui: ${data.reason || "Data tidak memenuhi ketentuan"}.`,
        actionUrl: "/me/verification",
      };
    case "relation_requested":
      return {
        title: "Permintaan Kemitraan Ekosistem Baru",
        body: `${data.requesterName || "Suatu entitas"} mengajak Anda bermitra (${data.relationType || ""}).`,
        actionUrl: data.confirmUrl || "/me/memberships",
      };
    case "relation_approved":
      return {
        title: "Kemitraan Ekosistem Aktif",
        body: `Kemitraan Anda dengan ${data.partnerName || "mitra"} kini telah aktif dan terhubung.`,
        actionUrl: data.profileUrl || "/ecosystem",
      };
    case "relation_ended":
      return {
        title: "Kemitraan Ekosistem Diakhiri",
        body: `Kemitraan dengan ${data.partnerName || "mitra"} telah diakhiri. Alasan: ${data.reason || "-"}.`,
        actionUrl: "/me/memberships",
      };
    case "security_alert":
      return {
        title: "Peringatan Keamanan Profil",
        body: data.details || "Aset profil Anda telah diperbarui.",
        actionUrl: "/me/settings",
      };
    default:
      return {
        title: "Pemberitahuan Sistem",
        body: data.message || "Terdapat aktivitas baru pada akun Anda.",
        actionUrl: "/dashboard",
      };
  }
}
