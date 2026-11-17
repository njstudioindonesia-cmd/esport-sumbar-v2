import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/tokens.dart';
import 'app_avatar.dart';

class ListRow extends StatelessWidget {
  final String title;
  final String? subtitle;
  final String? imageUrl;
  final Widget? leading;
  final Widget? trailing;
  final VoidCallback? onTap;
  final bool isVerified;
  final bool showSeparator;

  const ListRow({
    super.key,
    required this.title,
    this.subtitle,
    this.imageUrl,
    this.leading,
    this.trailing,
    this.onTap,
    this.isVerified = false,
    this.showSeparator = true,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap != null
          ? () {
              HapticTokens.lightImpact();
              onTap!();
            }
          : null,
      splashColor: Colors.white.withValues(alpha: 0.05),
      highlightColor: Colors.white.withValues(alpha: 0.03),
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
            child: Row(
              children: [
                // Avatar Besar atau Leading Kustom
                if (leading != null)
                  leading!
                else
                  AppAvatar(
                    imageUrl: imageUrl,
                    size: 48,
                    isVerified: isVerified,
                  ),
                const SizedBox(width: 14),

                // Informasi Dua Baris (Nama IGN + Subtitle Peran/Wilayah)
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        title,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 15,
                          fontWeight: FontWeight.w700,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      if (subtitle != null) ...[
                        const SizedBox(height: 3),
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

                // Trailing Widget (Status, Chevron, atau Aksi)
                if (trailing != null) ...[
                  const SizedBox(width: 12),
                  trailing!,
                ] else if (onTap != null) ...[
                  const SizedBox(width: 8),
                  const Icon(
                    Icons.chevron_right_rounded,
                    size: 20,
                    color: AppColors.textTertiary,
                  ),
                ],
              ],
            ),
          ),

          // Pemisah Garis Tipis (Bukan Kotak Bersarang)
          if (showSeparator)
            Divider(
              height: 1,
              thickness: 0.5,
              indent: 82, // Sejajar dengan teks setelah avatar
              endIndent: 20,
              color: Colors.white.withValues(alpha: 0.06),
            ),
        ],
      ),
    );
  }
}
