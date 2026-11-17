import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/tokens.dart';
import 'primitives/glass_surface.dart';

class GlassTabBar extends StatelessWidget {
  final int currentIndex;
  final ValueChanged<int> onTabSelected;

  const GlassTabBar({
    super.key,
    required this.currentIndex,
    required this.onTabSelected,
  });

  static const List<_TabItem> _tabs = [
    _TabItem(icon: Icons.home_rounded, label: 'Beranda'),
    _TabItem(icon: Icons.explore_rounded, label: 'Jelajah'),
    _TabItem(icon: Icons.style_rounded, label: 'KARTU'),
    _TabItem(icon: Icons.hub_rounded, label: 'Ekosistem'),
    _TabItem(icon: Icons.person_rounded, label: 'Profil'),
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.fromLTRB(20, 0, 20, 24),
      child: GlassSurface(
        height: 64,
        borderRadius: RadiusTokens.panel,
        blur: GlassBlur.regular,
        hasRim: true,
        enableScrim: true,
        backgroundColor: AppColors.surface1.withValues(alpha: 0.85),
        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 6),
        child: LayoutBuilder(
          builder: (context, constraints) {
            final tabWidth = constraints.maxWidth / _tabs.length;

            return Stack(
              children: [
                // Indikator Penanda Aktif Tunggal (Tenang, Tanpa Neon/Glow)
                AnimatedPositioned(
                  duration: MotionTokens.fast,
                  curve: MotionTokens.curveFluid,
                  left: currentIndex * tabWidth,
                  top: 0,
                  width: tabWidth,
                  height: constraints.maxHeight,
                  child: Container(
                    margin: const EdgeInsets.all(2),
                    decoration: BoxDecoration(
                      color: AppColors.brandPink.withValues(alpha: 0.16),
                      borderRadius: BorderRadius.circular(RadiusTokens.inner(RadiusTokens.panel, 8)),
                      border: Border.all(
                        color: AppColors.brandPink.withValues(alpha: 0.35),
                        width: 1.0,
                      ),
                    ),
                  ),
                ),

                // Barisan Ikon & Label Tab Tunggal
                Row(
                  children: List.generate(_tabs.length, (index) {
                    final item = _tabs[index];
                    final isSelected = index == currentIndex;

                    return Expanded(
                      child: GestureDetector(
                        behavior: HitTestBehavior.opaque,
                        onTap: () {
                          HapticTokens.selection();
                          onTabSelected(index);
                        },
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              item.icon,
                              size: 22,
                              color: isSelected ? AppColors.brandPink : AppColors.textTertiary,
                            ),
                            const SizedBox(height: 3),
                            Text(
                              item.label,
                              style: GoogleFonts.plusJakartaSans(
                                fontSize: 11,
                                fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                                color: isSelected ? AppColors.textPrimary : AppColors.textTertiary,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ],
                        ),
                      ),
                    );
                  }),
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}

class _TabItem {
  final IconData icon;
  final String label;

  const _TabItem({
    required this.icon,
    required this.label,
  });
}
