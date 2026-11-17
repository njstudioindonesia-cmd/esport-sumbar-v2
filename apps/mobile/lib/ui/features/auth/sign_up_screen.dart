import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/constants/colors.dart';
import '../../../core/theme/tokens.dart';
import '../../../core/services/auth_service.dart';
import '../../components/glass_button.dart';
import '../../components/glass_card.dart';
import '../../components/glass_input.dart';
import '../../components/glass_header.dart';
import '../onboarding/entity_selection_screen.dart';
import 'check_email_screen.dart';
import 'sign_in_screen.dart';

class SignUpScreen extends StatefulWidget {
  const SignUpScreen({super.key});

  @override
  State<SignUpScreen> createState() => _SignUpScreenState();
}

class _SignUpScreenState extends State<SignUpScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  bool _isLoading = false;
  String? _errorMessage;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  Future<void> _handleSignUp() async {
    final email = _emailController.text.trim();
    final password = _passwordController.text;
    final confirmPassword = _confirmPasswordController.text;

    if (email.isEmpty || !email.contains('@')) {
      setState(() => _errorMessage = 'Masukkan alamat email yang valid.');
      return;
    }
    if (password.isEmpty || password.length < 6) {
      setState(() => _errorMessage = 'Kata sandi minimal 6 karakter.');
      return;
    }
    if (password != confirmPassword) {
      setState(() => _errorMessage = 'Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final res = await AuthService.instance.signUp(email: email, password: password);

      if (!mounted) return;

      // Jika Supabase mengembalikan sesi langsung (email confirmation off):
      if (res.session != null) {
        Navigator.of(context).pushAndRemoveUntil(
          MaterialPageRoute(builder: (context) => const EntitySelectionScreen()),
          (route) => false,
        );
      } else {
        // Jika butuh konfirmasi email:
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (context) => CheckEmailScreen(email: email)),
        );
      }
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _errorMessage = 'Gagal mendaftar akun. Periksa koneksi atau coba alamat email lain.';
      });
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: EsportColors.background,
      appBar: const GlassHeader(
        title: 'DAFTAR AKUN BARU',
        subtitle: 'Langkah awal bergabung dengan ekosistem',
        showBackButton: true,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
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
                      'Buat Akun Ekosistem',
                      style: GoogleFonts.rajdhani(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'Setiap akun berhak memilih satu bidang ekosistem.',
                      style: GoogleFonts.inter(
                        fontSize: 12,
                        color: EsportColors.textSecondary,
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Input Email
                    GlassInput(
                      label: 'Alamat Email',
                      hint: 'nama@domain.com',
                      prefixIcon: const Icon(Icons.email_outlined, color: EsportColors.gold, size: 18),
                      controller: _emailController,
                      keyboardType: TextInputType.emailAddress,
                    ),
                    const SizedBox(height: 16),

                    // Input Password
                    GlassInput(
                      label: 'Kata Sandi',
                      hint: 'Minimal 6 karakter',
                      prefixIcon: const Icon(Icons.lock_outline_rounded, color: EsportColors.gold, size: 18),
                      controller: _passwordController,
                      obscureText: true,
                    ),
                    const SizedBox(height: 16),

                    // Input Confirm Password
                    GlassInput(
                      label: 'Konfirmasi Kata Sandi',
                      hint: 'Ulangi kata sandi',
                      prefixIcon: const Icon(Icons.lock_reset_rounded, color: EsportColors.gold, size: 18),
                      controller: _confirmPasswordController,
                      obscureText: true,
                    ),

                    if (_errorMessage != null) ...[
                      const SizedBox(height: 16),
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: EsportColors.error.withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(RadiusTokens.md),
                          border: Border.all(color: EsportColors.error.withValues(alpha: 0.5)),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.error_outline_rounded, color: EsportColors.error, size: 18),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                _errorMessage!,
                                style: GoogleFonts.inter(fontSize: 12, color: Colors.white),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],

                    const SizedBox(height: 24),

                    // Tombol Daftar
                    GlassButton(
                      label: 'Lanjutkan Pendaftaran',
                      variant: GlassButtonVariant.primary,
                      isLoading: _isLoading,
                      icon: Icons.arrow_forward_rounded,
                      onPressed: _handleSignUp,
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // Navigasi ke Masuk
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    'Sudah memiliki akun?',
                    style: GoogleFonts.inter(fontSize: 13, color: EsportColors.textSecondary),
                  ),
                  TextButton(
                    onPressed: () {
                      HapticTokens.lightImpact();
                      Navigator.of(context).pushReplacement(
                        MaterialPageRoute(builder: (context) => const SignInScreen()),
                      );
                    },
                    child: Text(
                      'Masuk Akun',
                      style: GoogleFonts.inter(
                        fontSize: 13,
                        fontWeight: FontWeight.bold,
                        color: EsportColors.gold,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
