import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/tokens.dart';

enum ToastType { info, success, warning, error }

class AppToast {
  static void show(
    BuildContext context, {
    required String message,
    ToastType type = ToastType.info,
    Duration duration = const Duration(seconds: 3),
  }) {
    HapticTokens.lightImpact();

    IconData icon;
    Color iconColor;

    switch (type) {
      case ToastType.info:
        icon = Icons.info_outline_rounded;
        iconColor = AppColors.brandPink;
        break;
      case ToastType.success:
        icon = Icons.check_circle_outline_rounded;
        iconColor = AppColors.success;
        break;
      case ToastType.warning:
        icon = Icons.warning_amber_rounded;
        iconColor = AppColors.warning;
        break;
      case ToastType.error:
        icon = Icons.error_outline_rounded;
        iconColor = AppColors.danger;
        break;
    }

    final messenger = ScaffoldMessenger.of(context);
    messenger.hideCurrentSnackBar();
    messenger.showSnackBar(
      SnackBar(
        duration: duration,
        behavior: SnackBarBehavior.floating,
        backgroundColor: Colors.transparent,
        elevation: 0,
        margin: const EdgeInsets.fromLTRB(20, 0, 20, 20),
        content: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            color: AppColors.surface1.withValues(alpha: 0.95),
            borderRadius: BorderRadius.circular(RadiusTokens.card),
            border: Border.all(
              color: Colors.white.withValues(alpha: 0.12),
              width: 1.0,
            ),
            boxShadow: const [
              BoxShadow(
                color: Color(0x40000000),
                blurRadius: 16,
                offset: Offset(0, 4),
              ),
            ],
          ),
          child: Row(
            children: [
              Icon(icon, size: 20, color: iconColor),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  message,
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                    color: AppColors.textPrimary,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
