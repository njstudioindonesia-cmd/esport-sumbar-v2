import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/tokens.dart';
import '../../components/glass_button.dart';

class MaintenanceScreen extends StatelessWidget {
  final String? message;
  final VoidCallback? onCheckAgain;

  const MaintenanceScreen({
    super.key,
    this.message,
    this.onCheckAgain,
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
                    color: EsportColors.gold.withValues(alpha: 0.12),
                    shape: BoxShape.circle,
                    border: Border.all(color: EsportColors.gold.withValues(alpha: 0.3)),
                  ),
                  child: const Icon(Icons.engineering_rounded, size: 56, color: EsportColors.gold),
                ),
                const SizedBox(height: 24),
                Text(
                  'PEMELIHARAAN SISTEM',
                  style: GoogleFonts.rajdhani(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 1.2,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  message ??
                      'Layanan ESPORT SUMBAR sedang dalam peningkatan rutin untuk memastikan reliabilitas data ekosistem. Kami akan segera kembali.',
                  textAlign: TextAlign.center,
                  style: GoogleFonts.inter(
                    fontSize: 14,
                    height: 1.5,
                    color: EsportColors.textSecondary,
                  ),
                ),
                const SizedBox(height: 32),
                GlassButton(
                  label: 'Periksa Status Layanan',
                  variant: GlassButtonVariant.gold,
                  icon: Icons.refresh_rounded,
                  onPressed: onCheckAgain ?? () => Navigator.of(context).maybePop(),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
