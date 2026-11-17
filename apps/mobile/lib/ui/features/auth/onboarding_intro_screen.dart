import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/constants/colors.dart';
import '../../../core/theme/tokens.dart';
import '../../components/glass_button.dart';
import '../../components/glass_card.dart';
import '../shell/main_navigation_shell.dart';
import 'sign_in_screen.dart';
import 'sign_up_screen.dart';

class OnboardingIntroScreen extends StatefulWidget {
  const OnboardingIntroScreen({super.key});

  @override
  State<OnboardingIntroScreen> createState() => _OnboardingIntroScreenState();
}

class _OnboardingIntroScreenState extends State<OnboardingIntroScreen> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  final List<Map<String, dynamic>> _slides = [
    {
      'icon': Icons.style_rounded,
      'color': EsportColors.gold,
      'title': 'Paspor Identitas Digital',
      'desc': 'Miliki kartu 3D interaktif digital dengan verifikasi mandiri, status rarity tier, dan QR code unik.',
    },
    {
      'icon': Icons.hub_rounded,
      'color': EsportColors.brandPink,
      'title': 'Jejaring 7 Bidang Ekosistem',
      'desc': 'Terhubung langsung antar Player, Pelatih, Tim, Komunitas, Venue, Kampus, dan Sekolah di Sumatera Barat.',
    },
    {
      'icon': Icons.bolt_rounded,
      'color': EsportColors.brandBlue,
      'title': 'Realtime Cloud Database',
      'desc': 'Data tersinkronisasi instan secara aman, bebas perantara birokrasi, dan terproteksi privasi penuh.',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: EsportColors.background,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          child: Column(
            children: [
              // Header Ringkas & Tombol Lewati (Tamu)
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.shield_rounded, color: EsportColors.gold, size: 22),
                      const SizedBox(width: 8),
                      Text(
                        'ESPORT SUMBAR',
                        style: GoogleFonts.rajdhani(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 1.2,
                          color: Colors.white,
                        ),
                      ),
                    ],
                  ),
                  TextButton(
                    onPressed: () {
                      HapticTokens.lightImpact();
                      Navigator.of(context).pushReplacement(
                        MaterialPageRoute(builder: (context) => const MainNavigationShell()),
                      );
                    },
                    child: Text(
                      'Mode Tamu',
                      style: GoogleFonts.inter(
                        fontSize: 13,
                        color: EsportColors.textSecondary,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ],
              ),

              const Spacer(),

              // Slides Area
              SizedBox(
                height: 320,
                child: PageView.builder(
                  controller: _pageController,
                  onPageChanged: (idx) => setState(() => _currentPage = idx),
                  itemCount: _slides.length,
                  itemBuilder: (context, index) {
                    final slide = _slides[index];
                    return Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 8),
                      child: GlassCard(
                        borderRadius: RadiusTokens.xl,
                        padding: const EdgeInsets.all(28),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Container(
                              width: 80,
                              height: 80,
                              decoration: BoxDecoration(
                                color: (slide['color'] as Color).withValues(alpha: 0.15),
                                shape: BoxShape.circle,
                                border: Border.all(color: slide['color'] as Color, width: 2),
                              ),
                              child: Icon(
                                slide['icon'] as IconData,
                                color: slide['color'] as Color,
                                size: 40,
                              ),
                            ),
                            const SizedBox(height: 24),
                            Text(
                              slide['title'] as String,
                              textAlign: TextAlign.center,
                              style: GoogleFonts.rajdhani(
                                fontSize: 22,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                            const SizedBox(height: 12),
                            Text(
                              slide['desc'] as String,
                              textAlign: TextAlign.center,
                              style: GoogleFonts.inter(
                                fontSize: 13,
                                height: 1.5,
                                color: EsportColors.textSecondary,
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),

              const SizedBox(height: 20),

              // Page Indicators
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(
                  _slides.length,
                  (index) => AnimatedContainer(
                    duration: MotionTokens.swift,
                    margin: const EdgeInsets.symmetric(horizontal: 4),
                    width: _currentPage == index ? 24 : 8,
                    height: 8,
                    decoration: BoxDecoration(
                      color: _currentPage == index ? EsportColors.gold : EsportColors.surfaceLight,
                      borderRadius: BorderRadius.circular(4),
                    ),
                  ),
                ),
              ),

              const Spacer(),

              // Tombol Aksi: Daftar & Masuk
              GlassButton(
                label: 'Daftar Akun Baru',
                variant: GlassButtonVariant.primary,
                icon: Icons.person_add_rounded,
                onPressed: () {
                  HapticTokens.lightImpact();
                  Navigator.of(context).push(
                    MaterialPageRoute(builder: (context) => const SignUpScreen()),
                  );
                },
              ),
              const SizedBox(height: 12),
              GlassButton(
                label: 'Sudah Punya Akun? Masuk',
                variant: GlassButtonVariant.ghost,
                onPressed: () {
                  HapticTokens.lightImpact();
                  Navigator.of(context).push(
                    MaterialPageRoute(builder: (context) => const SignInScreen()),
                  );
                },
              ),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }
}
