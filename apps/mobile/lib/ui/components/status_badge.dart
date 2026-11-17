import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/tokens.dart';

enum VerificationStatus { verified, pending, rejected, unverified }

class StatusBadge extends StatelessWidget {
  final VerificationStatus status;
  final bool compact;

  const StatusBadge({
    super.key,
    required this.status,
    this.compact = false,
  });

  @override
  Widget build(BuildContext context) {
    Color color;
    IconData icon;
    String label;

    switch (status) {
      case VerificationStatus.verified:
        color = AppColors.verified; // Emas murni (#D4AF37)
        icon = Icons.verified_rounded;
        label = 'TERVERIFIKASI';
        break;
      case VerificationStatus.pending:
        color = AppColors.pending; // Amber (#F2A33A)
        icon = Icons.hourglass_top_rounded;
        label = 'MENUNGGU TINJAUAN';
        break;
      case VerificationStatus.rejected:
        color = AppColors.danger; // Red (#F04438)
        icon = Icons.error_outline_rounded;
        label = 'PERLU REVISI';
        break;
      case VerificationStatus.unverified:
        color = AppColors.textTertiary; // Slate Neutral (#64748B)
        icon = Icons.shield_outlined;
        label = 'BELUM VERIFIKASI';
        break;
    }

    if (compact) {
      return Container(
        padding: const EdgeInsets.all(4),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.16),
          shape: BoxShape.circle,
          border: Border.all(color: color.withValues(alpha: 0.5), width: 1.0),
        ),
        child: Icon(icon, size: 14, color: color),
      );
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(RadiusTokens.pill),
        border: Border.all(color: color.withValues(alpha: 0.4), width: 1.0),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: color),
          const SizedBox(width: 6),
          Text(
            label,
            style: GoogleFonts.plusJakartaSans(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: color,
            ),
          ),
        ],
      ),
    );
  }
}
