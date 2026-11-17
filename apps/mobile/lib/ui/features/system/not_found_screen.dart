import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/tokens.dart';
import '../../components/glass_button.dart';

class NotFoundScreen extends StatelessWidget {
  const NotFoundScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: EsportColors.background,
      body: SafeArea(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(32),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  '404',
                  style: GoogleFonts.rajdhani(
                    fontSize: 72,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 2.0,
                    color: EsportColors.gold,
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  'HALAMAN TIDAK DITEMUKAN',
                  style: GoogleFonts.rajdhani(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Tautan atau kartu yang Anda tuju tidak tersedia atau telah dipindahkan dalam direktori.',
                  textAlign: TextAlign.center,
                  style: GoogleFonts.inter(
                    fontSize: 14,
                    color: EsportColors.textSecondary,
                  ),
                ),
                const SizedBox(height: 28),
                GlassButton(
                  label: 'Kembali ke Beranda',
                  variant: GlassButtonVariant.gold,
                  icon: Icons.home_rounded,
                  onPressed: () => Navigator.of(context).popUntil((r) => r.isFirst),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class AccessDeniedScreen extends StatelessWidget {
  final String? message;

  const AccessDeniedScreen({super.key, this.message});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: EsportColors.background,
      body: SafeArea(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(32),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: EsportColors.error.withValues(alpha: 0.15),
                    shape: BoxShape.circle,
                    border: Border.all(color: EsportColors.error.withValues(alpha: 0.4)),
                  ),
                  child: const Icon(Icons.lock_person_rounded, size: 56, color: EsportColors.error),
                ),
                const SizedBox(height: 24),
                Text(
                  'AKSES DITOLAK',
                  style: GoogleFonts.rajdhani(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 1.2,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  message ?? 'Anda tidak memiliki hak akses untuk melihat konten atau halaman ini.',
                  textAlign: TextAlign.center,
                  style: GoogleFonts.inter(
                    fontSize: 14,
                    height: 1.5,
                    color: EsportColors.textSecondary,
                  ),
                ),
                const SizedBox(height: 28),
                GlassButton(
                  label: 'Kembali',
                  variant: GlassButtonVariant.secondary,
                  onPressed: () => Navigator.of(context).maybePop(),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
