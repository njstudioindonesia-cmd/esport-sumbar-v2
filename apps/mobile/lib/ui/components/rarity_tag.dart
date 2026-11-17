import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/tokens.dart';

/// 4 Rarity Physical Tiers sesuai packages/contracts V3: rookie, contender, elite, legend
enum RarityTier { rookie, contender, elite, legend, master }

class RarityTag extends StatelessWidget {
  final RarityTier tier;

  const RarityTag({
    super.key,
    required this.tier,
  });

  @override
  Widget build(BuildContext context) {
    Color color;
    Color borderColor;
    String label;

    switch (tier) {
      case RarityTier.rookie:
        color = AppColors.tierRookie;
        borderColor = AppColors.tierRookieBorder;
        label = 'ROOKIE';
        break;
      case RarityTier.contender:
        color = AppColors.tierContender;
        borderColor = AppColors.tierContenderBorder;
        label = 'CONTENDER';
        break;
      case RarityTier.elite:
        color = AppColors.tierElite;
        borderColor = AppColors.tierEliteBorder;
        label = 'ELITE';
        break;
      case RarityTier.legend:
        color = AppColors.tierLegend;
        borderColor = AppColors.tierLegendBorder;
        label = 'LEGEND';
        break;
      case RarityTier.master:
        color = AppColors.tierElite;
        borderColor = AppColors.tierEliteBorder;
        label = 'MASTER';
        break;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(6),
        border: Border.all(color: borderColor.withValues(alpha: 0.6), width: 1.0),
      ),
      child: Text(
        label,
        style: GoogleFonts.barlowCondensed(
          fontSize: 11,
          fontWeight: FontWeight.w800,
          letterSpacing: 0.8,
          color: color,
        ),
      ),
    );
  }
}
