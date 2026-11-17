import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/tokens.dart';
import '../../../core/services/auth_service.dart';
import '../../components/glass_header.dart';
import '../../components/glass_card.dart';
import '../../components/glass_button.dart';
import '../../components/status_badge.dart';
import '../system/settings_screen.dart';
import '../skeleton/connection_test_screen.dart';
import '../gallery/component_gallery_screen.dart';
import '../onboarding/entity_selection_screen.dart';
import '../auth/onboarding_intro_screen.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: EsportColors.background,
      appBar: GlassHeader(
        title: 'PROFIL PENGGUNA',
        subtitle: 'Identitas atlet & pengelolaan akun',
        actions: [
          IconButton(
            icon: const Icon(Icons.settings_outlined, color: Colors.white),
            tooltip: 'Pengaturan',
            onPressed: () {
              Navigator.of(context).push(
                MaterialPageRoute(builder: (context) => const SettingsScreen()),
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 100),
        child: Column(
          children: [
            // Kartu Profil Utama
            GlassCard(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  Container(
                    width: 80,
                    height: 80,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(color: EsportColors.gold, width: 2),
                      color: EsportColors.surface2,
                    ),
                    child: const Icon(Icons.person, size: 48, color: EsportColors.gold),
                  ),
                  const SizedBox(height: 14),
                  Text(
                    'RIZKY "PHOENIX" KURNIA',
                    style: GoogleFonts.rajdhani(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1.0,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Rusher • Mobile Legends: Bang Bang',
                    style: GoogleFonts.inter(
                      fontSize: 13,
                      color: EsportColors.gold,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    'Kota Padang, Sumatera Barat',
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      color: EsportColors.textSecondary,
                    ),
                  ),
                  const SizedBox(height: 14),
                  const StatusBadge(status: VerificationStatus.verified),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Tracker Status Verifikasi Satu Tahap
            GlassCard(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'TRACKER VERIFIKASI',
                        style: GoogleFonts.rajdhani(
                          fontSize: 15,
                          fontWeight: FontWeight.bold,
                          color: EsportColors.gold,
                        ),
                      ),
                      const StatusBadge(status: VerificationStatus.verified, compact: true),
                    ],
                  ),
                  const SizedBox(height: 12),
                  _buildTrackerStep('1. Pengajuan Formulir & Dokumen', true),
                  _buildTrackerStep('2. Peninjauan Kurasi Mandiri', true),
                  _buildTrackerStep('3. Lencana Verifikasi Emas Aktif', true, isLast: true),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Pintasan Alat Developer & Pengujian
            GlassCard(
              padding: const EdgeInsets.all(8),
              child: Column(
                children: [
                  ListTile(
                    leading: const Icon(Icons.palette_outlined, color: EsportColors.brandPink),
                    title: const Text('Galeri Sistem Desain Native', style: TextStyle(color: Colors.white)),
                    subtitle: const Text('Pratinjau komponen & tingkat efek', style: TextStyle(color: EsportColors.textSecondary, fontSize: 11)),
                    trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 14, color: EsportColors.textMuted),
                    onTap: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(builder: (context) => const ComponentGalleryScreen()),
                      );
                    },
                  ),
                  const Divider(height: 1, color: EsportColors.borderSubtle),
                  ListTile(
                    leading: const Icon(Icons.network_check_rounded, color: EsportColors.gold),
                    title: const Text('Diagnostik API & Koneksi V3', style: TextStyle(color: Colors.white)),
                    subtitle: const Text('Uji kesehatan BFF & database', style: TextStyle(color: EsportColors.textSecondary, fontSize: 11)),
                    trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 14, color: EsportColors.textMuted),
                    onTap: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(builder: (context) => const ConnectionTestScreen()),
                      );
                    },
                  ),
                  const Divider(height: 1, color: EsportColors.borderSubtle),
                  ListTile(
                    leading: const Icon(Icons.add_circle_outline_rounded, color: EsportColors.verified),
                    title: const Text('Onboarding & Formulir 7 Bidang', style: TextStyle(color: Colors.white)),
                    subtitle: const Text('Pilih bidang dan isi formulir wizard', style: TextStyle(color: EsportColors.textSecondary, fontSize: 11)),
                    trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 14, color: EsportColors.textMuted),
                    onTap: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(builder: (context) => const EntitySelectionScreen()),
                      );
                    },
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Tombol Keluar Sesi
            GlassButton(
              label: 'Keluar Akun',
              variant: GlassButtonVariant.outline,
              icon: Icons.logout_rounded,
              onPressed: () async {
                await AuthService.instance.signOut();
                if (context.mounted) {
                  Navigator.of(context).pushAndRemoveUntil(
                    MaterialPageRoute(builder: (context) => const OnboardingIntroScreen()),
                    (route) => false,
                  );
                }
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTrackerStep(String label, bool isDone, {bool isLast = false}) {
    return Row(
      children: [
        Icon(
          isDone ? Icons.check_circle_rounded : Icons.radio_button_unchecked_rounded,
          size: 16,
          color: isDone ? EsportColors.gold : EsportColors.textMuted,
        ),
        const SizedBox(width: 10),
        Text(
          label,
          style: GoogleFonts.inter(
            fontSize: 12,
            fontWeight: isDone ? FontWeight.bold : FontWeight.normal,
            color: isDone ? Colors.white : EsportColors.textMuted,
          ),
        ),
      ],
    );
  }
}
