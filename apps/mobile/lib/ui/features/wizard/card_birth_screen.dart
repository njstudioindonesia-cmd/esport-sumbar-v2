import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/constants/colors.dart';
import '../../../core/theme/tokens.dart';
import '../../../data/models/profile_model.dart';
import '../../components/glass_button.dart';
import '../card/widgets/esport_card_3d.dart';
import '../shell/main_navigation_shell.dart';

class CardBirthScreen extends StatefulWidget {
  final ProfileModel profile;

  const CardBirthScreen({super.key, required this.profile});

  @override
  State<CardBirthScreen> createState() => _CardBirthScreenState();
}

class _CardBirthScreenState extends State<CardBirthScreen> with SingleTickerProviderStateMixin {
  late AnimationController _animController;
  late Animation<double> _scaleAnimation;
  late Animation<double> _glowAnimation;
  bool _revealed = false;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1400),
    );

    _scaleAnimation = CurvedAnimation(
      parent: _animController,
      curve: Curves.easeOutBack,
    );

    _glowAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _animController,
        curve: const Interval(0.4, 1.0, curve: Curves.easeInOut),
      ),
    );

    _animController.forward().then((_) {
      if (mounted) {
        setState(() => _revealed = true);
        HapticTokens.successNotification();
      }
    });
  }

  @override
  void dispose() {
    _animController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: EsportColors.background,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          child: Column(
            children: [
              const SizedBox(height: 12),
              // Header Sukses
              Text(
                'KARTU DIGITAL TERBIT',
                style: GoogleFonts.rajdhani(
                  fontSize: 24,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 2.0,
                  color: EsportColors.gold,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                'Identitas Anda kini telah terdaftar di ekosistem Sumatera Barat.',
                textAlign: TextAlign.center,
                style: GoogleFonts.inter(
                  fontSize: 12,
                  color: EsportColors.textSecondary,
                ),
              ),

              const Spacer(),

              // Animasi Kelahiran Kartu 3D
              AnimatedBuilder(
                animation: _animController,
                builder: (context, child) {
                  return Transform.scale(
                    scale: _scaleAnimation.value,
                    child: Container(
                      decoration: BoxDecoration(
                        boxShadow: [
                          BoxShadow(
                            color: EsportColors.gold.withValues(alpha: 0.25 * _glowAnimation.value),
                            blurRadius: 36 * _glowAnimation.value,
                            spreadRadius: 4 * _glowAnimation.value,
                          ),
                        ],
                      ),
                      child: child,
                    ),
                  );
                },
                child: EsportCard3D(profile: widget.profile),
              ),

              const SizedBox(height: 16),

              // Chip ESPORT ID
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                decoration: BoxDecoration(
                  color: EsportColors.surfaceLight,
                  borderRadius: BorderRadius.circular(RadiusTokens.md),
                  border: Border.all(color: EsportColors.gold.withValues(alpha: 0.5)),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.badge_rounded, color: EsportColors.gold, size: 16),
                    const SizedBox(width: 8),
                    Text(
                      widget.profile.esportId,
                      style: GoogleFonts.rajdhani(
                        fontSize: 15,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 1.2,
                        color: Colors.white,
                      ),
                    ),
                  ],
                ),
              ),

              const Spacer(),

              // Tombol Menuju Beranda
              GlassButton(
                label: 'Masuk ke Beranda',
                variant: GlassButtonVariant.gold,
                icon: Icons.check_circle_rounded,
                onPressed: () {
                  HapticTokens.lightImpact();
                  Navigator.of(context).pushAndRemoveUntil(
                    MaterialPageRoute(builder: (context) => const MainNavigationShell()),
                    (route) => false,
                  );
                },
              ),
              const SizedBox(height: 12),
            ],
          ),
        ),
      ),
    );
  }
}
