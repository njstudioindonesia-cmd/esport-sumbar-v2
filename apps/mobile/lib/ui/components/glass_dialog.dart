import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/tokens.dart';
import 'primitives/glass_surface.dart';
import 'glass_button.dart';

class GlassDialog extends StatelessWidget {
  final String title;
  final String message;
  final String? confirmLabel;
  final String? cancelLabel;
  final VoidCallback? onConfirm;
  final VoidCallback? onCancel;
  final bool isDestructive;

  const GlassDialog({
    super.key,
    required this.title,
    required this.message,
    this.confirmLabel,
    this.cancelLabel = 'Batal',
    this.onConfirm,
    this.onCancel,
    this.isDestructive = false,
  });

  static Future<bool?> show(
    BuildContext context, {
    required String title,
    required String message,
    String? confirmLabel,
    String cancelLabel = 'Batal',
    bool isDestructive = false,
  }) {
    HapticTokens.mediumImpact();
    return showDialog<bool>(
      context: context,
      barrierColor: Colors.black.withValues(alpha: 0.65),
      builder: (context) => GlassDialog(
        title: title,
        message: message,
        confirmLabel: confirmLabel,
        cancelLabel: cancelLabel,
        isDestructive: isDestructive,
        onConfirm: () => Navigator.of(context).pop(true),
        onCancel: () => Navigator.of(context).pop(false),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Material(
        type: MaterialType.transparency,
        child: Container(
          margin: const EdgeInsets.symmetric(horizontal: 24),
          child: GlassSurface(
            borderRadius: RadiusTokens.panel,
            blur: GlassBlur.thick,
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                    color: isDestructive ? AppColors.danger : AppColors.textPrimary,
                  ),
                ),
                const SizedBox(height: 10),
                Text(
                  message,
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 13,
                    fontWeight: FontWeight.w400,
                    height: 1.5,
                    color: AppColors.textSecondary,
                  ),
                ),
                const SizedBox(height: 24),
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    if (cancelLabel != null) ...[
                      GlassButton(
                        label: cancelLabel!,
                        variant: GlassButtonVariant.outline,
                        height: 40,
                        onPressed: onCancel ?? () => Navigator.of(context).pop(),
                      ),
                      const SizedBox(width: 10),
                    ],
                    if (confirmLabel != null)
                      GlassButton(
                        label: confirmLabel!,
                        variant: isDestructive ? GlassButtonVariant.danger : GlassButtonVariant.primary,
                        height: 40,
                        onPressed: onConfirm,
                      ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
