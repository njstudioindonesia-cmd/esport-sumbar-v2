import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/constants/colors.dart';
import '../../../core/theme/tokens.dart';
import '../../components/glass_button.dart';
import '../../components/glass_card.dart';
import '../../components/glass_dialog.dart';
import '../../components/glass_header.dart';
import '../wizard/wizard_screen.dart';

class EntitySelectionScreen extends StatefulWidget {
  const EntitySelectionScreen({super.key});

  @override
  State<EntitySelectionScreen> createState() => _EntitySelectionScreenState();
}

class _EntitySelectionScreenState extends State<EntitySelectionScreen> {
  String? _selectedType;

  final List<Map<String, dynamic>> _entities = [
    {
      'type': 'player',
      'title': 'Player & Atlet',
      'desc': 'Pemain kompetitif, atlet tim, dan penggiat game esport mandiri.',
      'icon': Icons.sports_esports_rounded,
      'color': EsportColors.brandPink,
    },
    {
      'type': 'coach',
      'title': 'Pelatih & Analis',
      'desc': 'Pelatih taktis, analis strategi, dan manajer performa tim.',
      'icon': Icons.psychology_rounded,
      'color': EsportColors.gold,
    },
    {
      'type': 'team',
      'title': 'Tim & Klub Esport',
      'desc': 'Organisasi, tim kompetitif, dan manajemen skuad multi-divisi.',
      'icon': Icons.shield_rounded,
      'color': EsportColors.brandBlue,
    },
    {
      'type': 'community',
      'title': 'Komunitas & Fans',
      'desc': 'Klub penggemar, komunitas daerah, dan penggerak turnamen lokal.',
      'icon': Icons.groups_rounded,
      'color': EsportColors.neonCyan,
    },
    {
      'type': 'venue',
      'title': 'Arena & Venue Esport',
      'desc': 'Gaming cafe, iCafe, arena turnamen, dan markas latihan.',
      'icon': Icons.storefront_rounded,
      'color': EsportColors.verified,
    },
    {
      'type': 'academy',
      'title': 'Akademi & Kampus',
      'desc': 'UKM esport perguruan tinggi, akademi pelatihan, dan kampus.',
      'icon': Icons.school_rounded,
      'color': const Color(0xFFC084FC),
    },
    {
      'type': 'school',
      'title': 'Sekolah & Pelajar',
      'desc': 'Ekstrakurikuler sekolah SMP/SMA/SMK dan pembinaan pelajar.',
      'icon': Icons.local_library_rounded,
      'color': const Color(0xFF38BDF8),
    },
  ];

  Future<void> _showFinalConfirmationDialog(Map<String, dynamic> entity) async {
    HapticTokens.mediumImpact();
    final confirmed = await GlassDialog.show(
      context,
      title: 'KONFIRMASI BIDANG',
      message:
          'Anda memilih bidang ${entity['title']}.\n\nSatu akun hanya untuk satu bidang. Pilihan ini tidak dapat diubah setelah dikonfirmasi.',
      confirmLabel: 'Ya, Lanjutkan',
      cancelLabel: 'Batal',
    );

    if (confirmed == true && mounted) {
      Navigator.of(context).push(
        MaterialPageRoute(
          builder: (context) => WizardScreen(
            entityType: entity['type'] as String,
            entityTitle: entity['title'] as String,
          ),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: EsportColors.background,
      appBar: const GlassHeader(
        title: 'PILIH BIDANG EKOSISTEM',
        subtitle: 'Satu akun didedikasikan untuk satu bidang',
        showBackButton: false,
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Banner Edukasi
            Container(
              margin: const EdgeInsets.fromLTRB(16, 12, 16, 8),
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color: EsportColors.gold.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(RadiusTokens.md),
                border: Border.all(color: EsportColors.gold.withValues(alpha: 0.3)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.info_outline_rounded, color: EsportColors.gold, size: 20),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      'Tentukan peran utama Anda. Pilihan ini akan memformat kartu digital dan formulir profil Anda.',
                      style: GoogleFonts.inter(fontSize: 12, height: 1.4, color: Colors.white),
                    ),
                  ),
                ],
              ),
            ),

            // Daftar 7 Bidang
            Expanded(
              child: ListView.separated(
                padding: const EdgeInsets.all(16),
                itemCount: _entities.length,
                separatorBuilder: (context, index) => const SizedBox(height: 12),
                itemBuilder: (context, index) {
                  final entity = _entities[index];
                  final isSelected = _selectedType == entity['type'];
                  final Color color = entity['color'] as Color;

                  return GestureDetector(
                    onTap: () {
                      HapticTokens.selectionClick();
                      setState(() => _selectedType = entity['type'] as String);
                      _showFinalConfirmationDialog(entity);
                    },
                    child: GlassCard(
                      borderRadius: RadiusTokens.card,
                      padding: const EdgeInsets.all(16),
                      child: Row(
                        children: [
                          Container(
                            width: 50,
                            height: 50,
                            decoration: BoxDecoration(
                              color: color.withValues(alpha: 0.15),
                              shape: BoxShape.circle,
                              border: Border.all(color: color, width: 1.5),
                            ),
                            child: Icon(entity['icon'] as IconData, color: color, size: 26),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  entity['title'] as String,
                                  style: GoogleFonts.rajdhani(
                                    fontSize: 17,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.white,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  entity['desc'] as String,
                                  style: GoogleFonts.inter(
                                    fontSize: 12,
                                    height: 1.3,
                                    color: EsportColors.textSecondary,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const Icon(Icons.arrow_forward_ios_rounded, color: Colors.white38, size: 16),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
