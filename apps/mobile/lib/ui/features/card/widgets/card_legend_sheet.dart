import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../../core/theme/tokens.dart';
import '../../../components/glass_card.dart';

/// Bottom Sheet Legenda Kartu
/// Mengedukasi pengguna tentang perbedaan fundamental antara:
/// 1. Frame Rarity (Pencapaian, keaktifan & kelengkapan profil)
/// 2. Lencana Verifikasi (Kurasi validitas identitas mandiri)
class CardLegendSheet extends StatelessWidget {
  const CardLegendSheet({super.key});

  static Future<void> show(BuildContext context) {
    HapticTokens.mediumImpact();
    return showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) => const CardLegendSheet(),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: AppColors.surface1,
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
        border: Border(
          top: BorderSide(color: AppColors.verifiedGold, width: 1.5),
        ),
      ),
      padding: const EdgeInsets.fromLTRB(20, 12, 20, 32),
      child: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Grab handle
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.white24,
                  borderRadius: BorderRadius.circular(RadiusTokens.pill),
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Header
            Row(
              children: [
                const Icon(Icons.menu_book_rounded, color: AppColors.verifiedGold, size: 22),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    'LEGENDA & STANDAR KARTU DIGITAL',
                    style: GoogleFonts.barlowCondensed(
                      fontSize: 18,
                      fontWeight: FontWeight.w800,
                      letterSpacing: 0.8,
                      color: Colors.white,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 6),
            Text(
              'Panduan memahami struktur Frame Rarity dan Lencana Verifikasi pada kartu identitas digital Anda.',
              style: GoogleFonts.plusJakartaSans(
                fontSize: 12,
                color: AppColors.textSecondary,
                height: 1.4,
              ),
            ),
            const SizedBox(height: 20),

            // Bagian 1: Lencana Verifikasi (Identitas Mandiri)
            GlassCard(
              borderRadius: RadiusTokens.card,
              padding: const EdgeInsets.all(16),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: AppColors.verifiedGold.withValues(alpha: 0.15),
                      shape: BoxShape.circle,
                      border: Border.all(color: AppColors.verifiedGold, width: 1.5),
                    ),
                    child: const Icon(Icons.verified_rounded, color: AppColors.verifiedGold, size: 24),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Expanded(
                              child: Text(
                                'Lencana Verifikasi (Perisai Emas)',
                                style: GoogleFonts.plusJakartaSans(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w700,
                                  color: AppColors.verifiedGold,
                                ),
                              ),
                            ),
                            const SizedBox(width: 8),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                color: AppColors.verifiedGold.withValues(alpha: 0.2),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(
                                'VERIFIKASI',
                                style: GoogleFonts.plusJakartaSans(
                                  fontSize: 10,
                                  fontWeight: FontWeight.w700,
                                  color: AppColors.verifiedGold,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Menandakan bahwa data profil, kontak, dan keikutsertaan Anda telah melewati kurasi mandiri komunitas. Memiliki nomor lencana seri unik di posisi tetap kanan atas kartu.',
                          style: GoogleFonts.plusJakartaSans(fontSize: 11, color: Colors.white70, height: 1.4),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Bagian 2: Frame Rarity (Kelengkapan & Rekam Jejak)
            Text(
              'FRAME TIER (TINGKAT KELENGKAPAN & AKTIVITAS)',
              style: GoogleFonts.barlowCondensed(
                fontSize: 14,
                fontWeight: FontWeight.w800,
                letterSpacing: 0.8,
                color: AppColors.textSecondary,
              ),
            ),
            const SizedBox(height: 10),

            // 4 Frame Rarity List
            _buildRarityItem(
              tier: 'MASTER',
              color: AppColors.tierLegend,
              desc: 'Tingkat tertinggi / Legend: Profil lengkap dan portofolio tervalidasi.',
              borderPreview: 'Prismatic Crystal Border',
            ),
            const SizedBox(height: 8),
            _buildRarityItem(
              tier: 'CHALLENGER',
              color: AppColors.tierElite,
              desc: 'Tingkat Elite: Prestasi turnamen aktif dan koneksi komunitas terdaftar.',
              borderPreview: 'Brushed Gold Foil Border',
            ),
            const SizedBox(height: 8),
            _buildRarityItem(
              tier: 'CONTENDER',
              color: AppColors.tierContender,
              desc: 'Tingkat Menengah: Profil dasar terisi, memilih game utama dan wilayah.',
              borderPreview: 'Satin Silver Border',
            ),
            const SizedBox(height: 8),
            _buildRarityItem(
              tier: 'ROOKIE',
              color: AppColors.tierRookie,
              desc: 'Tingkat Awal: Pengguna baru bergabung dengan data registrasi dasar.',
              borderPreview: 'Bronze Matte Border',
            ),
            const SizedBox(height: 20),

            // Catatan Independensi
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.surface2,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.borderSubtle),
              ),
              child: Row(
                children: [
                  const Icon(Icons.info_outline_rounded, color: AppColors.verifiedGold, size: 18),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      'Penting: Frame Rarity dan Lencana Verifikasi bersifat independen. Pengguna tier Rookie tetap dapat diverifikasi setelah kurasi mandiri terpenuhi.',
                      style: GoogleFonts.plusJakartaSans(fontSize: 11, color: AppColors.textSecondary, height: 1.3),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRarityItem({
    required String tier,
    required Color color,
    required String desc,
    required String borderPreview,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: AppColors.surface2,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: color.withValues(alpha: 0.4)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 86,
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.15),
              borderRadius: BorderRadius.circular(6),
              border: Border.all(color: color, width: 1),
            ),
            child: Center(
              child: Text(
                tier,
                style: GoogleFonts.barlowCondensed(
                  fontSize: 12,
                  fontWeight: FontWeight.w800,
                  color: color,
                ),
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  desc,
                  style: GoogleFonts.plusJakartaSans(fontSize: 11, color: Colors.white),
                ),
                Text(
                  borderPreview,
                  style: GoogleFonts.plusJakartaSans(fontSize: 10, color: AppColors.textTertiary),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
