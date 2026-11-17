import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/tokens.dart';
import '../../components/glass_header.dart';
import '../../components/glass_button.dart';
import '../../components/glass_card.dart';
import '../../../../data/models/profile_model.dart';
import '../../../../data/repositories/profile_repository.dart';
import 'widgets/esport_card_3d.dart';
import 'widgets/card_legend_sheet.dart';
import 'widgets/card_export_dialog.dart';
import '../wizard/wizard_screen.dart';

class CardWalletScreen extends StatefulWidget {
  const CardWalletScreen({super.key});

  @override
  State<CardWalletScreen> createState() => _CardWalletScreenState();
}

class _CardWalletScreenState extends State<CardWalletScreen> {
  final ProfileRepository _profileRepo = ProfileRepository();
  final GlobalKey<_CardWalletActionAreaState> _actionAreaKey = GlobalKey();
  ProfileModel? _userProfile;
  bool _isLoading = true;
  bool _isOffline = false;

  @override
  void initState() {
    super.initState();
    _loadProfile();
  }

  Future<void> _loadProfile() async {
    setState(() => _isLoading = true);
    try {
      final profile = await _profileRepo.getMyProfile();
      if (mounted) {
        setState(() {
          _userProfile = profile ?? _getDefaultProfile();
          _isLoading = false;
        });
      }
    } catch (_) {
      if (mounted) {
        setState(() {
          _userProfile = _getDefaultProfile();
          _isLoading = false;
          _isOffline = true;
        });
      }
    }
  }

  ProfileModel _getDefaultProfile() {
    return ProfileModel(
      id: '00000000-0000-0000-0000-000000000001',
      accountId: '00000000-0000-0000-0000-000000000001',
      entityType: 'player',
      esportId: 'ESP-SB-PDG-2026',
      slug: 'rizky-phoenix-kurnia',
      displayName: 'Rizky Kurnia',
      ign: 'PHOENIX',
      regionId: 'reg-pdg',
      regionName: 'Kota Padang',
      regionCode: 'PDG',
      mainGameName: 'Mobile Legends: Bang Bang',
      roleName: 'Gold Lane',
      rarityTier: 'MASTER',
      completenessScore: 100,
      verificationStatus: 'verified',
      verifiedBadgeNo: 'ESP-SB-VER-001',
      createdAt: DateTime.now(),
    );
  }

  @override
  Widget build(BuildContext context) {
    final profile = _userProfile ?? _getDefaultProfile();

    return Scaffold(
      backgroundColor: AppColors.inkBase,
      appBar: GlassHeader(
        title: 'DOMPET KARTU ATLET',
        subtitle: 'Paspor identitas digital & QR code verifikasi',
        actions: [
          IconButton(
            icon: const Icon(Icons.info_outline_rounded, color: Colors.white70, size: 22),
            onPressed: () => CardLegendSheet.show(context),
            tooltip: 'Legenda',
          ),
        ],
      ),
      body: _isLoading
          ? const Center(
              child: CircularProgressIndicator(color: AppColors.brandPink),
            )
          : SingleChildScrollView(
              padding: const EdgeInsets.fromLTRB(20, 16, 20, SpacingTokens.bottomNavSafePadding),
              child: Column(
                children: [
                  // Status Offline Banner (jika koneksi terputus)
                  if (_isOffline) ...[
                    Container(
                      margin: const EdgeInsets.only(bottom: 16),
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      decoration: BoxDecoration(
                        color: AppColors.warning.withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(RadiusTokens.pill),
                        border: Border.all(color: AppColors.warning.withValues(alpha: 0.35)),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.cloud_off_rounded, color: AppColors.warning, size: 14),
                          const SizedBox(width: 8),
                          Text(
                            'Mode Offline • Data Tersimpan Lokal',
                            style: GoogleFonts.plusJakartaSans(
                              fontSize: 12,
                              color: AppColors.warning,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],

                  // Kartu 3D Paspor Atlet (Objek Utama di Pusat)
                  Center(
                    child: EsportCard3D(
                      profile: profile,
                      isInteractive: true,
                    ),
                  ),

                  const SizedBox(height: 20),

                  // 3 Aksi Ikon Bulat Terukur [Bagikan], [QR], [Simpan] + Akses Legenda
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      _buildCircularAction(
                        icon: Icons.share_rounded,
                        label: 'Bagikan',
                        onTap: () => CardExportDialog.show(context, profile),
                      ),
                      const SizedBox(width: 24),
                      _buildCircularAction(
                        icon: Icons.qr_code_2_rounded,
                        label: 'QR',
                        onTap: () => CardExportDialog.show(context, profile),
                      ),
                      const SizedBox(width: 24),
                      _buildCircularAction(
                        icon: Icons.download_rounded,
                        label: 'Simpan',
                        onTap: () => CardExportDialog.show(context, profile),
                      ),
                      const SizedBox(width: 24),
                      _buildCircularAction(
                        icon: Icons.help_outline_rounded,
                        label: 'Legenda',
                        onTap: () => CardLegendSheet.show(context),
                      ),
                    ],
                  ),

                  const SizedBox(height: 24),

                  // Lencana Status Verifikasi Cepat (GlassCard Tenang)
                  GlassCard(
                    borderRadius: RadiusTokens.card,
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: profile.isVerified
                                ? AppColors.verifiedGold.withValues(alpha: 0.15)
                                : AppColors.surface3,
                            shape: BoxShape.circle,
                          ),
                          child: Icon(
                            profile.isVerified ? Icons.verified_rounded : Icons.pending_rounded,
                            color: profile.isVerified ? AppColors.verifiedGold : AppColors.textTertiary,
                            size: 20,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                profile.isVerified ? 'IDENTITAS TERVERIFIKASI' : 'MENUNGGU VERIFIKASI',
                                style: GoogleFonts.plusJakartaSans(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w700,
                                  color: profile.isVerified ? AppColors.verifiedGold : AppColors.textPrimary,
                                ),
                              ),
                              Text(
                                profile.isVerified
                                    ? 'Nomor Lencana: ${profile.verifiedBadgeNo ?? "ESP-SB-VER-001"}'
                                    : 'Pengajuan dalam antrean kurasi komunitas.',
                                style: GoogleFonts.plusJakartaSans(fontSize: 11, color: AppColors.textSecondary),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 16),

                  // Aksi Utama: Bagikan Kartu & Simpan ke Galeri
                  Row(
                    children: [
                      Expanded(
                        child: GlassButton(
                          label: 'Bagikan Kartu',
                          variant: GlassButtonVariant.primary,
                          icon: Icons.share_rounded,
                          onPressed: () => CardExportDialog.show(context, profile),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: GlassButton(
                          label: 'Simpan ke Galeri',
                          variant: GlassButtonVariant.gold,
                          icon: Icons.download_rounded,
                          onPressed: () => CardExportDialog.show(context, profile),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),

                  // Aksi Sekunder: Perbarui Data Profil
                  GlassButton(
                    label: 'Perbarui Data Profil',
                    variant: GlassButtonVariant.outline,
                    icon: Icons.edit_note_rounded,
                    onPressed: () {
                      HapticTokens.lightImpact();
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (context) => WizardScreen(
                            entityType: profile.entityType,
                            entityTitle: 'Edit Data Profil',
                          ),
                        ),
                      );
                    },
                  ),
                ],
              ),
            ),
    );
  }

  Widget _buildCircularAction({
    required IconData icon,
    required String label,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      behavior: HitTestBehavior.opaque,
      onTap: () {
        HapticTokens.lightImpact();
        onTap();
      },
      child: Column(
        children: [
          Container(
            width: 50,
            height: 50,
            decoration: BoxDecoration(
              color: AppColors.surface2,
              shape: BoxShape.circle,
              border: Border.all(
                color: Colors.white.withValues(alpha: 0.12),
                width: 1.0,
              ),
              boxShadow: const [
                BoxShadow(
                  color: Color(0x30000000),
                  blurRadius: 8,
                  offset: Offset(0, 3),
                ),
              ],
            ),
            child: Icon(icon, color: Colors.white, size: 22),
          ),
          const SizedBox(height: 6),
          Text(
            label,
            style: GoogleFonts.plusJakartaSans(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              color: AppColors.textSecondary,
            ),
          ),
        ],
      ),
    );
  }
}

class _CardWalletActionAreaState extends State<StatefulWidget> {
  @override
  Widget build(BuildContext context) => const SizedBox.shrink();
}
