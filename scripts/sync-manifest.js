const fs = require('fs');
const path = require('path');

const manifestPath = path.join(__dirname, '..', 'docs', 'MANIFEST_RUTE_V3.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

const existingPaths = new Set(manifest.routes.map(r => r.path));

const newPages = [
  {
    path: "/verify/[id]",
    category: "public",
    name: "Validasi QR Paspor Digital (Public Verifier)",
    accessRole: "public",
    template: "Pemeriksaan Keabsahan Satu Tahap & Status Lencana",
    states: ["loading", "empty", "error", "success"],
    viewports: ["390px", "768px", "1440px", "1920px"],
    qualityModes: ["Penuh", "Standar", "Hemat"],
    inboundLinks: ["/me/card", "/me/verification", "QR Scan"],
    outboundLinks: ["/", "/explore"],
    redesignStatus: "BELUM",
    notes: "Halaman pendaratan pemindaian QR lencana verifikasi satu tahap"
  },
  {
    path: "/games/[slug]",
    category: "public",
    name: "Detail Cabang Game & Posisi Role",
    accessRole: "public",
    template: "Katalog Aturan Posisi, Tier Rank & Spesifikasi Game",
    states: ["loading", "empty", "error", "success"],
    viewports: ["390px", "768px", "1440px", "1920px"],
    qualityModes: ["Penuh", "Standar", "Hemat"],
    inboundLinks: ["/games"],
    outboundLinks: ["/games", "/explore"],
    redesignStatus: "BELUM"
  },
  {
    path: "/auth/check-email",
    category: "auth",
    name: "Peralihan Konfirmasi Email",
    accessRole: "guest",
    template: "Layar Panduan Verifikasi Tautan Email & Tips Spam",
    states: ["idle", "resending", "success"],
    viewports: ["390px", "768px", "1440px", "1920px"],
    qualityModes: ["Penuh", "Standar", "Hemat"],
    inboundLinks: ["/register", "/forgot-password"],
    outboundLinks: ["/login"],
    redesignStatus: "BELUM"
  },
  {
    path: "/403",
    category: "system",
    name: "Akses Ditolak (Forbidden)",
    accessRole: "public",
    template: "Layar Peringatan Batas Otorisasi & Peran",
    states: ["idle"],
    viewports: ["390px", "768px", "1440px", "1920px"],
    qualityModes: ["Penuh", "Standar", "Hemat"],
    inboundLinks: ["Semua Rute Terproteksi"],
    outboundLinks: ["/", "/dashboard", "/login"],
    redesignStatus: "BELUM"
  },
  {
    path: "/500",
    category: "system",
    name: "Kendala Server Internal (Internal Error)",
    accessRole: "public",
    template: "Layar Degradasi Anggun & Muat Ulang",
    states: ["idle"],
    viewports: ["390px", "768px", "1440px", "1920px"],
    qualityModes: ["Penuh", "Standar", "Hemat"],
    inboundLinks: ["Sistem Error Boundary"],
    outboundLinks: ["/", "/contact"],
    redesignStatus: "BELUM"
  },
  {
    path: "/offline",
    category: "system",
    name: "Mode Offline PWA",
    accessRole: "public",
    template: "Layar Akses Terbatas Tanpa Jaringan & Paspor Tersimpan",
    states: ["offline", "reconnecting"],
    viewports: ["390px", "768px", "1440px", "1920px"],
    qualityModes: ["Penuh", "Standar", "Hemat"],
    inboundLinks: ["Service Worker Fallback"],
    outboundLinks: ["/me/card"],
    redesignStatus: "BELUM"
  },
  {
    path: "/maintenance",
    category: "system",
    name: "Pemeliharaan Sistem Terjadwal",
    accessRole: "public",
    template: "Layar Status Pemeliharaan Infrastruktur",
    states: ["idle"],
    viewports: ["390px", "768px", "1440px", "1920px"],
    qualityModes: ["Penuh", "Standar", "Hemat"],
    inboundLinks: ["Edge Middleware"],
    outboundLinks: ["/"],
    redesignStatus: "BELUM"
  },
  {
    path: "/me/notifications",
    category: "user",
    name: "Notifikasi Pengguna",
    accessRole: "authenticated",
    template: "Daftar Pembaruan Verifikasi, Ekosistem & Sistem",
    states: ["loading", "empty", "error", "success"],
    viewports: ["390px", "768px", "1440px", "1920px"],
    qualityModes: ["Penuh", "Standar", "Hemat"],
    inboundLinks: ["/me", "/dashboard"],
    outboundLinks: ["/me"],
    redesignStatus: "BELUM"
  },
  {
    path: "/admin/verification/[id]",
    category: "admin",
    name: "Tinjauan Verifikasi Tunggal",
    accessRole: "platform_admin",
    template: "QuietSurface Review Dokumen Digital Signed URL & Keputusan",
    states: ["loading", "empty", "error", "success"],
    viewports: ["390px", "768px", "1440px", "1920px"],
    qualityModes: ["Penuh", "Standar", "Hemat"],
    inboundLinks: ["/admin/verification", "/admin/system"],
    outboundLinks: ["/admin/verification"],
    redesignStatus: "BELUM"
  },
  {
    path: "/admin/relation-rules",
    category: "admin",
    name: "Aturan Relasi Ekosistem Deklaratif (17 Rules)",
    accessRole: "platform_admin",
    template: "QuietSurface Matriks Pasangan 7 Entitas & Batas Aktif",
    states: ["loading", "empty", "error", "success"],
    viewports: ["390px", "768px", "1440px", "1920px"],
    qualityModes: ["Penuh", "Standar", "Hemat"],
    inboundLinks: ["/admin"],
    outboundLinks: ["/admin"],
    redesignStatus: "BELUM"
  },
  {
    path: "/admin/reports",
    category: "admin",
    name: "Antrean Laporan & Moderasi Konten",
    accessRole: "platform_admin",
    template: "QuietSurface Tinjauan Laporan Pelanggaran Kebijakan",
    states: ["loading", "empty", "error", "success"],
    viewports: ["390px", "768px", "1440px", "1920px"],
    qualityModes: ["Penuh", "Standar", "Hemat"],
    inboundLinks: ["/admin"],
    outboundLinks: ["/admin"],
    redesignStatus: "BELUM"
  },
  {
    path: "/admin/content",
    category: "admin",
    name: "Manajemen Konten & Publikasi Warta",
    accessRole: "platform_admin",
    template: "QuietSurface Manajemen Berita, Pengumuman & Panduan",
    states: ["loading", "empty", "error", "success"],
    viewports: ["390px", "768px", "1440px", "1920px"],
    qualityModes: ["Penuh", "Standar", "Hemat"],
    inboundLinks: ["/admin"],
    outboundLinks: ["/admin", "/admin/news"],
    redesignStatus: "BELUM"
  },
  {
    path: "/admin/users/[id]",
    category: "admin",
    name: "Inspektur Akun Pengguna",
    accessRole: "platform_admin",
    template: "QuietSurface Rincian Profil, Status Verifikasi & Audit Log",
    states: ["loading", "empty", "error", "success"],
    viewports: ["390px", "768px", "1440px", "1920px"],
    qualityModes: ["Penuh", "Standar", "Hemat"],
    inboundLinks: ["/admin/users"],
    outboundLinks: ["/admin/users"],
    redesignStatus: "BELUM"
  },
  {
    path: "/admin/achievements",
    category: "admin",
    name: "Validasi Prestasi & Turnamen",
    accessRole: "platform_admin",
    template: "QuietSurface Verifikasi Riwayat Prestasi & Penentuan Tier",
    states: ["loading", "empty", "error", "success"],
    viewports: ["390px", "768px", "1440px", "1920px"],
    qualityModes: ["Penuh", "Standar", "Hemat"],
    inboundLinks: ["/admin"],
    outboundLinks: ["/admin"],
    redesignStatus: "BELUM"
  }
];

let addedCount = 0;
for (const page of newPages) {
  if (!existingPaths.has(page.path)) {
    manifest.routes.push(page);
    addedCount++;
  }
}

manifest.summary.totalRoutes = manifest.routes.length;
manifest.summary.redesignPending = manifest.routes.length;
manifest.generatedAt = new Date().toISOString();

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
console.log(`Manifest updated: added ${addedCount} routes, total now ${manifest.routes.length}`);
