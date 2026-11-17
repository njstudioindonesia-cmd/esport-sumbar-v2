import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/constants/colors.dart';
import '../../../core/theme/tokens.dart';
import '../../../core/services/auth_service.dart';
import '../../components/glass_button.dart';
import '../../components/glass_card.dart';
import '../../components/glass_input.dart';
import '../../components/glass_header.dart';

class ForgotPasswordScreen extends StatefulWidget {
  const ForgotPasswordScreen({super.key});

  @override
  State<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends State<ForgotPasswordScreen> {
  final _emailController = TextEditingController();
  bool _isLoading = false;
  bool _isSubmitted = false;

  @override
  void dispose() {
    _emailController.dispose();
    super.dispose();
  }

  Future<void> _handleResetPassword() async {
    final email = _emailController.text.trim();
    if (email.isEmpty || !email.contains('@')) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Masukkan alamat email yang valid.')),
      );
      return;
    }

    setState(() => _isLoading = true);

    try {
      await AuthService.instance.resetPassword(email: email);
    } catch (_) {}

    if (mounted) {
      setState(() {
        _isLoading = false;
        _isSubmitted = true;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: EsportColors.background,
      appBar: const GlassHeader(
        title: 'LUPA KATA SANDI',
        subtitle: 'Pemulihan akses akun',
        showBackButton: true,
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: _isSubmitted ? _buildSuccessView() : _buildFormView(),
        ),
      ),
    );
  }

  Widget _buildFormView() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        const SizedBox(height: 12),
        GlassCard(
          borderRadius: RadiusTokens.xl,
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Atur Ulang Kata Sandi',
                style: GoogleFonts.rajdhani(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Masukkan alamat email terdaftar Anda. Kami akan mengirimkan tautan untuk mengatur ulang kata sandi.',
                style: GoogleFonts.inter(
                  fontSize: 12,
                  height: 1.5,
                  color: EsportColors.textSecondary,
                ),
              ),
              const SizedBox(height: 24),
              GlassInput(
                label: 'Alamat Email',
                hint: 'nama@domain.com',
                prefixIcon: const Icon(Icons.email_outlined, color: EsportColors.gold, size: 18),
                controller: _emailController,
                keyboardType: TextInputType.emailAddress,
              ),
              const SizedBox(height: 24),
              GlassButton(
                label: 'Kirim Tautan Pemulihan',
                variant: GlassButtonVariant.gold,
                icon: Icons.send_rounded,
                isLoading: _isLoading,
                onPressed: _handleResetPassword,
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildSuccessView() {
    return Center(
      child: GlassCard(
        borderRadius: RadiusTokens.xl,
        padding: const EdgeInsets.all(28),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 72,
              height: 72,
              decoration: BoxDecoration(
                color: EsportColors.verified.withValues(alpha: 0.15),
                shape: BoxShape.circle,
                border: Border.all(color: EsportColors.verified, width: 2),
              ),
              child: const Icon(Icons.mark_email_read_rounded, color: EsportColors.verified, size: 36),
            ),
            const SizedBox(height: 20),
            Text(
              'Tautan Pemulihan Dikirim',
              textAlign: TextAlign.center,
              style: GoogleFonts.rajdhani(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.white),
            ),
            const SizedBox(height: 12),
            Text(
              'Jika alamat email tersebut terdaftar dalam sistem, kami telah mengirimkan instruksi pemulihan kata sandi. Silakan periksa kotak masuk atau folder spam Anda.',
              textAlign: TextAlign.center,
              style: GoogleFonts.inter(fontSize: 12, height: 1.5, color: EsportColors.textSecondary),
            ),
            const SizedBox(height: 24),
            GlassButton(
              label: 'Kembali ke Masuk',
              variant: GlassButtonVariant.primary,
              onPressed: () => Navigator.of(context).pop(),
            ),
          ],
        ),
      ),
    );
  }
}
