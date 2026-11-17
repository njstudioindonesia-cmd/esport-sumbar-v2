import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/constants/colors.dart';
import '../../../core/theme/tokens.dart';
import '../../../core/services/auth_service.dart';
import '../../../data/repositories/profile_repository.dart';
import '../shell/main_navigation_shell.dart';
import 'onboarding_intro_screen.dart';
import '../onboarding/entity_selection_screen.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> with SingleTickerProviderStateMixin {
  late AnimationController _animController;
  late Animation<double> _scaleAnimation;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: MotionTokens.expressive,
    );

    _scaleAnimation = CurvedAnimation(
      parent: _animController,
      curve: Curves.easeOutBack,
    );

    _fadeAnimation = CurvedAnimation(
      parent: _animController,
      curve: Curves.easeIn,
    );

    _animController.forward();
    _checkInitialRoute();
  }

  @override
  void dispose() {
    _animController.dispose();
    super.dispose();
  }

  Future<void> _checkInitialRoute() async {
    // Beri waktu animasi splash minimal 1.5 detik
    await Future.delayed(const Duration(milliseconds: 1500));

    if (!mounted) return;

    final auth = AuthService.instance;
    final profileRepo = ProfileRepository();

    if (auth.isAuthenticated) {
      // Periksa apakah pengguna sudah memiliki profil bidang
      final profile = await profileRepo.getMyProfile();
      if (!mounted) return;

      if (profile != null) {
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (context) => const MainNavigationShell()),
        );
      } else {
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (context) => const EntitySelectionScreen()),
        );
      }
    } else {
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (context) => const OnboardingIntroScreen()),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: EsportColors.background,
      body: Center(
        child: FadeTransition(
          opacity: _fadeAnimation,
          child: ScaleTransition(
            scale: _scaleAnimation,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Logo Perisai Mark V-S
                Container(
                  width: 96,
                  height: 96,
                  decoration: BoxDecoration(
                    color: EsportColors.gold.withValues(alpha: 0.15),
                    shape: BoxShape.circle,
                    border: Border.all(color: EsportColors.gold, width: 2),
                    boxShadow: [
                      BoxShadow(
                        color: EsportColors.gold.withValues(alpha: 0.3),
                        blurRadius: 30,
                        spreadRadius: 2,
                      ),
                    ],
                  ),
                  child: const Center(
                    child: Icon(
                      Icons.shield_rounded,
                      color: EsportColors.gold,
                      size: 50,
                    ),
                  ),
                ),
                const SizedBox(height: 24),

                // Nama Brand
                Text(
                  'ESPORT SUMBAR',
                  style: GoogleFonts.rajdhani(
                    fontSize: 28,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 2.0,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 8),

                // Tagline Ekosistem Digital
                Text(
                  'EKOSISTEM DIGITAL SUMATERA BARAT',
                  style: GoogleFonts.inter(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 1.5,
                    color: EsportColors.gold,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
