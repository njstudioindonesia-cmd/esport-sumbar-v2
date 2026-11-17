import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../../core/theme/tokens.dart';
import '../../../../data/models/profile_model.dart';
import '../../../components/glass_button.dart';
import '../../../components/glass_card.dart';
import 'esport_card_3d.dart';

enum ExportFormat { story, feed }

class CardExportDialog extends StatefulWidget {
  final ProfileModel profile;

  const CardExportDialog({
    super.key,
    required this.profile,
  });

  static Future<void> show(BuildContext context, ProfileModel profile) {
    HapticTokens.mediumImpact();
    return showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) => CardExportDialog(profile: profile),
    );
  }

  @override
  State<CardExportDialog> createState() => _CardExportDialogState();
}

class _CardExportDialogState extends State<CardExportDialog> {
  ExportFormat _selectedFormat = ExportFormat.story;
  bool _isExporting = false;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: AppColors.surface1,
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
        border: Border(
          top: BorderSide(color: AppColors.brandPink, width: 1.5),
        ),
      ),
      padding: const EdgeInsets.fromLTRB(20, 12, 20, 32),
      child: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
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
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Row(
                    children: [
                      const Icon(Icons.share_rounded, color: AppColors.brandPink, size: 22),
                      const SizedBox(width: 10),
                      Flexible(
                        child: Text(
                          'BAGIKAN & EKSPOR KARTU',
                          style: GoogleFonts.barlowCondensed(
                            fontSize: 18,
                            fontWeight: FontWeight.w800,
                            letterSpacing: 0.8,
                            color: Colors.white,
                          ),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.close_rounded, color: AppColors.textTertiary),
                  onPressed: () => Navigator.of(context).pop(),
                ),
              ],
            ),
            const SizedBox(height: 4),
            Align(
              alignment: Alignment.centerLeft,
              child: Text(
                'Pilih format rasio media sosial untuk kartu digital Anda.',
                style: GoogleFonts.plusJakartaSans(fontSize: 12, color: AppColors.textSecondary),
              ),
            ),
            const SizedBox(height: 20),

            // Pilihan Format: Story (9:16) vs Feed (1:1)
            Row(
              children: [
                Expanded(
                  child: _buildFormatSelector(
                    format: ExportFormat.story,
                    title: 'Story / Status',
                    ratio: '9:16',
                    icon: Icons.stay_current_portrait_rounded,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildFormatSelector(
                    format: ExportFormat.feed,
                    title: 'Feed / Postingan',
                    ratio: '1:1',
                    icon: Icons.crop_square_rounded,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Pratinjau Kanvas Ekspor dengan Watermark ESPORT SUMBAR
            GlassCard(
              borderRadius: RadiusTokens.card,
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  Container(
                    width: double.infinity,
                    height: 180,
                    decoration: BoxDecoration(
                      color: AppColors.inkBase,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: AppColors.borderSubtle),
                    ),
                    child: Stack(
                      alignment: Alignment.center,
                      children: [
                        // Mini card representation
                        SizedBox(
                          height: 160,
                          child: FittedBox(
                            fit: BoxFit.contain,
                            child: EsportCard3D(
                              profile: widget.profile,
                              isInteractive: false,
                            ),
                          ),
                        ),

                        // Watermark Brand ESPORT SUMBAR
                        Positioned(
                          bottom: 8,
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                            decoration: BoxDecoration(
                              color: Colors.black.withValues(alpha: 0.7),
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: Colors.white12),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Image.asset(
                                  'assets/images/logo-mark-pink.png',
                                  width: 12,
                                  height: 12,
                                  fit: BoxFit.contain,
                                  errorBuilder: (_, __, ___) => const Icon(Icons.shield_rounded, color: AppColors.brandPink, size: 12),
                                ),
                                const SizedBox(width: 4),
                                Text(
                                  'ESPORT SUMBAR',
                                  style: GoogleFonts.barlowCondensed(
                                    fontSize: 10,
                                    fontWeight: FontWeight.w800,
                                    color: Colors.white,
                                    letterSpacing: 0.8,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    _selectedFormat == ExportFormat.story
                        ? 'Format Story (1080x1920) ideal untuk Instagram Story & WhatsApp Status'
                        : 'Format Feed (1080x1080) ideal untuk postingan Instagram & profil media sosial',
                    style: GoogleFonts.plusJakartaSans(fontSize: 11, color: AppColors.textSecondary),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Tombol Aksi
            GlassButton(
              label: 'Bagikan Langsung',
              variant: GlassButtonVariant.primary,
              icon: Icons.send_rounded,
              isLoading: _isExporting,
              width: double.infinity,
              onPressed: () => _handleExport(toGallery: false),
            ),
            const SizedBox(height: 10),
            GlassButton(
              label: 'Simpan ke Galeri',
              variant: GlassButtonVariant.outline,
              icon: Icons.download_rounded,
              isLoading: _isExporting,
              width: double.infinity,
              onPressed: () => _handleExport(toGallery: true),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFormatSelector({
    required ExportFormat format,
    required String title,
    required String ratio,
    required IconData icon,
  }) {
    final isSelected = _selectedFormat == format;
    return GestureDetector(
      onTap: () {
        HapticTokens.selection();
        setState(() => _selectedFormat = format);
      },
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.brandPink.withValues(alpha: 0.15) : AppColors.surface2,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected ? AppColors.brandPink : AppColors.borderSubtle,
            width: isSelected ? 1.5 : 1.0,
          ),
        ),
        child: Row(
          children: [
            Icon(
              icon,
              color: isSelected ? AppColors.brandPink : AppColors.textSecondary,
              size: 24,
            ),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: isSelected ? Colors.white : AppColors.textSecondary,
                  ),
                ),
                Text(
                  ratio,
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 11,
                    color: isSelected ? AppColors.brandPink : AppColors.textTertiary,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _handleExport({required bool toGallery}) async {
    setState(() => _isExporting = true);
    HapticTokens.lightImpact();

    await Future.delayed(const Duration(milliseconds: 600));

    if (!mounted) return;
    setState(() => _isExporting = false);
    Navigator.of(context).pop();

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          toGallery
              ? 'Kartu digital format ${_selectedFormat == ExportFormat.story ? "Story 9:16" : "Feed 1:1"} berhasil disimpan ke galeri.'
              : 'Membuka lembar bagikan sistem...',
          style: GoogleFonts.plusJakartaSans(fontSize: 12),
        ),
        backgroundColor: AppColors.surface1,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }
}
