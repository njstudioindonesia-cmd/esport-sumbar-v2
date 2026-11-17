import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/constants/colors.dart';
import '../../../core/theme/tokens.dart';
import '../../components/glass_button.dart';
import '../../components/glass_card.dart';
import '../../components/glass_header.dart';
import 'sign_in_screen.dart';

class CheckEmailScreen extends StatelessWidget {
  final String email;

  const CheckEmailScreen({super.key, required this.email});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: EsportColors.background,
      appBar: const GlassHeader(
        title: 'VERIFIKASI EMAIL',
        subtitle: 'Konfirmasi pendaftaran akun Anda',
        showBackButton: true,
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Center(
            child: GlassCard(
              borderRadius: RadiusTokens.xl,
              padding: const EdgeInsets.all(28),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 80,
                    height: 80,
                    decoration: BoxDecoration(
                      color: EsportColors.gold.withValues(alpha: 0.15),
                      shape: BoxShape.circle,
                      border: Border.all(color: EsportColors.gold, width: 2),
                    ),
                    child: const Icon(Icons.outgoing_mail, color: EsportColors.gold, size: 40),
                  ),
                  const SizedBox(height: 24),
                  Text(
                    'Periksa Kotak Masuk Anda',
                    textAlign: TextAlign.center,
                    style: GoogleFonts.rajdhani(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    'Kami telah mengirimkan tautan konfirmasi pendaftaran ke alamat email:',
                    textAlign: TextAlign.center,
                    style: GoogleFonts.inter(
                      fontSize: 13,
                      color: EsportColors.textSecondary,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                    decoration: BoxDecoration(
                      color: EsportColors.surfaceLight,
                      borderRadius: BorderRadius.circular(RadiusTokens.sm),
                    ),
                    child: Text(
                      email,
                      style: GoogleFonts.inter(
                        fontSize: 13,
                        fontWeight: FontWeight.bold,
                        color: EsportColors.gold,
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Klik tautan pada email untuk mengaktifkan akun, kemudian masuk kembali ke aplikasi untuk melanjutkan pemilihan bidang.',
                    textAlign: TextAlign.center,
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      height: 1.5,
                      color: EsportColors.textMuted,
                    ),
                  ),
                  const SizedBox(height: 28),
                  GlassButton(
                    label: 'Menuju Halaman Masuk',
                    variant: GlassButtonVariant.primary,
                    icon: Icons.login_rounded,
                    onPressed: () {
                      HapticTokens.lightImpact();
                      Navigator.of(context).pushAndRemoveUntil(
                        MaterialPageRoute(builder: (context) => const SignInScreen()),
                        (route) => false,
                      );
                    },
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
