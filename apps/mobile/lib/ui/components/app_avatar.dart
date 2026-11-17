import 'package:flutter/material.dart';
import '../../core/theme/tokens.dart';

class AppAvatar extends StatelessWidget {
  final String? imageUrl;
  final double size;
  final bool isVerified;
  final double borderRadius;
  final Widget? placeholderFallback;

  const AppAvatar({
    super.key,
    this.imageUrl,
    this.size = 48.0,
    this.isVerified = false,
    this.borderRadius = 14.0,
    this.placeholderFallback,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size,
      height: size,
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          // Kontainer Avatar Utama
          Container(
            width: size,
            height: size,
            decoration: BoxDecoration(
              color: AppColors.surface2,
              borderRadius: BorderRadius.circular(borderRadius),
              border: Border.all(
                color: Colors.white.withValues(alpha: 0.12),
                width: 1.0,
              ),
              boxShadow: const [
                BoxShadow(
                  color: Color(0x20000000),
                  blurRadius: 4,
                  offset: Offset(0, 2),
                ),
              ],
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(borderRadius - 1),
              child: imageUrl != null && imageUrl!.isNotEmpty
                  ? Image.network(
                      imageUrl!,
                      width: size,
                      height: size,
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => _buildDesignedPlaceholder(),
                    )
                  : (placeholderFallback ?? _buildDesignedPlaceholder()),
            ),
          ),

          // Lencana Verifikasi Emas Mini di Sudut (Jika Terverifikasi)
          if (isVerified)
            Positioned(
              right: -3,
              bottom: -3,
              child: Container(
                padding: const EdgeInsets.all(2),
                decoration: const BoxDecoration(
                  color: AppColors.inkBase,
                  shape: BoxShape.circle,
                ),
                child: Container(
                  padding: const EdgeInsets.all(3),
                  decoration: const BoxDecoration(
                    color: AppColors.verified,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.check,
                    size: 10,
                    color: Colors.black,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }

  /// Placeholder yang dirancang khusus: Siluet atlet/organisasi geometris
  /// dengan sentuhan mark V-S tenang (Bukan huruf dalam lingkaran bercahaya).
  Widget _buildDesignedPlaceholder() {
    return Container(
      color: AppColors.surface2,
      child: Stack(
        alignment: Alignment.center,
        children: [
          // Geometri mark V-S halus di latar belakang
          Opacity(
            opacity: 0.15,
            child: Image.asset(
              'assets/images/logo-mark-white.png',
              width: size * 0.7,
              height: size * 0.7,
              fit: BoxFit.contain,
              errorBuilder: (_, __, ___) => const Icon(
                Icons.shield_outlined,
                size: 24,
                color: Colors.white,
              ),
            ),
          ),
          // Siluet ikon netral berwibawa
          Icon(
            Icons.person_rounded,
            size: size * 0.5,
            color: AppColors.textTertiary,
          ),
        ],
      ),
    );
  }
}
