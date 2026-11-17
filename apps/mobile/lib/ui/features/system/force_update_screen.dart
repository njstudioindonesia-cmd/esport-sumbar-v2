import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/tokens.dart';
import '../../components/glass_button.dart';

class ForceUpdateScreen extends StatelessWidget {
  final String? updateUrl;

  const ForceUpdateScreen({
    super.key,
    this.updateUrl,
  });

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
                    color: EsportColors.brandPink.withValues(alpha: 0.15),
                    shape: BoxShape.circle,
                    border: Border.all(color: EsportColors.brandPink.withValues(alpha: 0.4)),
                  ),
                  child: const Icon(Icons.system_update_alt_rounded, size: 56, color: EsportColors.brandPink),
                ),
                const SizedBox(height: 24),
                Text(
                  'PEMBARUAN APLIKASI WAJIB',
                  style: GoogleFonts.rajdhani(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 1.2,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  'Versi aplikasi yang Anda gunakan memerlukan pembaruan kritis agar tetap selaras dengan sistem verifikasi dan katalog game V3.',
                  textAlign: TextAlign.center,
                  style: GoogleFonts.inter(
                    fontSize: 14,
                    height: 1.5,
                    color: EsportColors.textSecondary,
                  ),
                ),
                const SizedBox(height: 32),
                GlassButton(
                  label: 'Perbarui di Toko Aplikasi',
                  variant: GlassButtonVariant.primary,
                  icon: Icons.download_rounded,
                  onPressed: () {
                    // Tautan store
                  },
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
