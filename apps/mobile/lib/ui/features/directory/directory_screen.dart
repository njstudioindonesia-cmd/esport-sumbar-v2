import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/tokens.dart';
import '../../components/glass_header.dart';
import '../../components/glass_card.dart';

class DirectoryScreen extends StatelessWidget {
  const DirectoryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: EsportColors.background,
      appBar: const GlassHeader(
        title: 'JELAJAH DIREKTORI',
        subtitle: 'Katalog 7 bidang ekosistem Sumatera Barat',
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 96),
        children: [
          _buildCategoryCard('Player & Atlet', '1,420 Profil Terdaftar', Icons.sports_esports_rounded),
          _buildCategoryCard('Pelatih & Analis', '86 Coach Terdaftar', Icons.psychology_rounded),
          _buildCategoryCard('Tim & Klub Esport', '124 Organisasi Aktif', Icons.shield_rounded),
          _buildCategoryCard('Komunitas & Fans', '42 Komunitas Daerah', Icons.groups_rounded),
          _buildCategoryCard('Arena & Venue Esport', '18 Gaming Arena Terverifikasi', Icons.storefront_rounded),
          _buildCategoryCard('Akademi & Kampus', '12 UKM Esport Perguruan Tinggi', Icons.school_rounded),
          _buildCategoryCard('Sekolah & Pelajar', '34 Ekstrakurikuler Sekolah', Icons.local_library_rounded),
        ],
      ),
    );
  }

  Widget _buildCategoryCard(String title, String count, IconData icon) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: GlassCard(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: EsportColors.gold.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: EsportColors.gold.withValues(alpha: 0.3)),
              ),
              child: Icon(icon, size: 24, color: EsportColors.gold),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: GoogleFonts.rajdhani(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    count,
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      color: EsportColors.textSecondary,
                    ),
                  ),
                ],
              ),
            ),
            const Icon(Icons.arrow_forward_ios_rounded, size: 14, color: EsportColors.textMuted),
          ],
        ),
      ),
    );
  }
}
