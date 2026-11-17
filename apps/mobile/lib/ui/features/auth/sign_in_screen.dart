import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/constants/colors.dart';
import '../../../core/theme/tokens.dart';
import '../../../core/services/auth_service.dart';
import '../../../data/repositories/profile_repository.dart';
import '../../components/glass_button.dart';
import '../../components/glass_card.dart';
import '../../components/glass_input.dart';
import '../../components/glass_header.dart';
import '../shell/main_navigation_shell.dart';
import '../onboarding/entity_selection_screen.dart';
import 'forgot_password_screen.dart';
import 'sign_up_screen.dart';

class SignInScreen extends StatefulWidget {
  const SignInScreen({super.key});

  @override
  State<SignInScreen> createState() => _SignInScreenState();
}

class _SignInScreenState extends State<SignInScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLoading = false;
  String? _errorMessage;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _handleSignIn() async {
    final email = _emailController.text.trim();
    final password = _passwordController.text;

    if (email.isEmpty || !email.contains('@')) {
      setState(() => _errorMessage = 'Masukkan alamat email yang valid.');
      return;
    }
    if (password.isEmpty || password.length < 6) {
      setState(() => _errorMessage = 'Kata sandi minimal 6 karakter.');
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      await AuthService.instance.signIn(email: email, password: password);
      final profileRepo = ProfileRepository();
      final profile = await profileRepo.getMyProfile();

      if (!mounted) return;

      if (profile != null) {
        Navigator.of(context).pushAndRemoveUntil(
          MaterialPageRoute(builder: (context) => const MainNavigationShell()),
          (route) => false,
        );
      } else {
        Navigator.of(context).pushAndRemoveUntil(
          MaterialPageRoute(builder: (context) => const EntitySelectionScreen()),
          (route) => false,
        );
      }
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _errorMessage = 'Email atau kata sandi tidak cocok. Silakan coba kembali.';
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
        title: 'MASUK AKUN',
        subtitle: 'Akses paspor digital & jejaring ekosistem',
        showBackButton: true,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 12),
              // Card Formulir
              GlassCard(
                borderRadius: RadiusTokens.xl,
                padding: const EdgeInsets.all(24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Selamat Datang Kembali',
                      style: GoogleFonts.rajdhani(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'Masuk untuk mengelola kartu dan relasi ekosistem Anda.',
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
                      hint: '••••••••',
                      prefixIcon: const Icon(Icons.lock_outline_rounded, color: EsportColors.gold, size: 18),
                      controller: _passwordController,
                      obscureText: true,
                    ),
                    const SizedBox(height: 8),

                    // Lupa Password Link
                    Align(
                      alignment: Alignment.centerRight,
                      child: TextButton(
                        onPressed: () {
                          HapticTokens.lightImpact();
                          Navigator.of(context).push(
                            MaterialPageRoute(builder: (context) => const ForgotPasswordScreen()),
                          );
                        },
                        child: Text(
                          'Lupa Kata Sandi?',
                          style: GoogleFonts.inter(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: EsportColors.gold,
                          ),
                        ),
                      ),
                    ),

                    if (_errorMessage != null) ...[
                      const SizedBox(height: 8),
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

                    // Tombol Masuk
                    GlassButton(
                      label: 'Masuk Sekarang',
                      variant: GlassButtonVariant.primary,
                      isLoading: _isLoading,
                      icon: Icons.login_rounded,
                      onPressed: _handleSignIn,
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // Navigasi ke Daftar
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    'Belum memiliki akun?',
                    style: GoogleFonts.inter(fontSize: 13, color: EsportColors.textSecondary),
                  ),
                  TextButton(
                    onPressed: () {
                      HapticTokens.lightImpact();
                      Navigator.of(context).pushReplacement(
                        MaterialPageRoute(builder: (context) => const SignUpScreen()),
                      );
                    },
                    child: Text(
                      'Daftar di Sini',
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
