import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/tokens.dart';
import 'primitives/glass_surface.dart';

class GlassHeader extends StatelessWidget implements PreferredSizeWidget {
  final String? title;
  final String? subtitle;
  final Widget? leading;
  final List<Widget>? actions;
  final bool showBackButton;
  final bool showBrandMark;

  const GlassHeader({
    super.key,
    this.title,
    this.subtitle,
    this.leading,
    this.actions,
    this.showBackButton = false,
    this.showBrandMark = false,
  });

  @override
  Size get preferredSize => Size.fromHeight(subtitle != null ? 72 : 56);

  @override
  Widget build(BuildContext context) {
    return GlassSurface(
      borderRadius: 0,
      blur: GlassBlur.thin,
      hasRim: false,
      enableScrim: true,
      backgroundColor: AppColors.inkBase.withValues(alpha: 0.85),
      child: SafeArea(
        bottom: false,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: SizedBox(
            height: preferredSize.height,
            child: Row(
              children: [
                if (showBackButton) ...[
                  IconButton(
                    icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Colors.white, size: 20),
                    onPressed: () {
                      HapticTokens.lightImpact();
                      Navigator.of(context).maybePop();
                    },
                  ),
                  const SizedBox(width: 8),
                ] else if (showBrandMark) ...[
                  Image.asset(
                    'assets/images/logo-mark-pink.png',
                    width: 28,
                    height: 28,
                    fit: BoxFit.contain,
                    errorBuilder: (_, __, ___) => const Icon(
                      Icons.shield_rounded,
                      color: AppColors.brandPink,
                      size: 28,
                    ),
                  ),
                  const SizedBox(width: 12),
                ] else if (leading != null) ...[
                  leading!,
                  const SizedBox(width: 12),
                ],
                Expanded(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      if (title != null)
                        Text(
                          title!,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 18,
                            fontWeight: FontWeight.w700,
                            color: AppColors.textPrimary,
                          ),
                        ),
                      if (subtitle != null) ...[
                        const SizedBox(height: 2),
                        Text(
                          subtitle!,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 12,
                            fontWeight: FontWeight.w400,
                            color: AppColors.textSecondary,
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
                if (actions != null) ...actions!,
              ],
            ),
          ),
        ),
      ),
    );
  }
}
