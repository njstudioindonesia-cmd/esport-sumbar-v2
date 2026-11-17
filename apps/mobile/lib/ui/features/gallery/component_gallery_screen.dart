import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/tokens.dart';
import '../../../core/theme/effect_engine.dart';
import '../../components/primitives/glass_surface.dart';
import '../../components/glass_button.dart';
import '../../components/glass_input.dart';
import '../../components/glass_switch.dart';
import '../../components/glass_segmented.dart';
import '../../components/glass_card.dart';
import '../../components/glass_sheet.dart';
import '../../components/glass_dialog.dart';
import '../../components/status_badge.dart';
import '../../components/rarity_tag.dart';
import '../../components/glass_skeleton.dart';
import '../../components/empty_state.dart';
import '../../components/offline_banner.dart';
import '../../components/number_counter.dart';
import '../../components/glass_tab_bar.dart';
import '../../components/app_avatar.dart';
import '../../components/list_row.dart';
import '../../components/glass_select.dart';
import '../../components/app_toast.dart';

class ComponentGalleryScreen extends StatefulWidget {
  const ComponentGalleryScreen({super.key});

  @override
  State<ComponentGalleryScreen> createState() => _ComponentGalleryScreenState();
}

class _ComponentGalleryScreenState extends State<ComponentGalleryScreen> {
  double _textScale = 1.0;
  bool _switchVal = true;
  String _segmentedVal = 'Harian';
  int _counterVal = 1420;
  int _tabBarIndex = 0;
  String? _selectedCategory = 'Pemain';

  final List<String> _categories = [
    'Pemain',
    'Pelatih',
    'Tim',
    'Komunitas',
    'Venue',
    'Kampus',
    'Sekolah',
  ];

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: EffectEngine.instance,
      builder: (context, _) {
        final currentTier = EffectEngine.instance.currentTier;

        return MediaQuery(
          data: MediaQuery.of(context).copyWith(
            textScaler: TextScaler.linear(_textScale),
          ),
          child: Scaffold(
            backgroundColor: AppColors.inkBase,
            appBar: AppBar(
              backgroundColor: AppColors.surface1,
              elevation: 0,
              titleSpacing: 16,
              title: Row(
                children: [
                  Image.asset(
                    'assets/images/logo-mark-pink.png',
                    width: 22,
                    height: 22,
                    errorBuilder: (_, __, ___) => const Icon(Icons.bolt, color: AppColors.brandPink, size: 20),
                  ),
                  const SizedBox(width: 10),
                  Text(
                    'GALERI SISTEM DESAIN NATIVE',
                    style: GoogleFonts.barlowCondensed(
                      fontSize: 18,
                      fontWeight: FontWeight.w800,
                      letterSpacing: 0.8,
                      color: Colors.white,
                    ),
                  ),
                ],
              ),
            ),
            body: SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Pengontrol Tingkat Efek & Skala Teks
                  _buildControlsCard(currentTier),
                  const SizedBox(height: 24),

                  // A. Brand & Mark V-S Resmi
                  _buildSectionHeader('A. Brand Assets Resmi'),
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppColors.surface1,
                      borderRadius: BorderRadius.circular(RadiusTokens.md),
                      border: Border.all(color: AppColors.borderSubtle),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        _buildAssetItem('assets/images/logo-mark-pink.png', 'Mark V-S Pink'),
                        _buildAssetItem('assets/images/logo-mark-white.png', 'Mark V-S White'),
                        _buildAssetItem('assets/images/logo-lockup-navy.png', 'Lockup Navy', isLockup: true),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),

                  // B. Palet Warna Resmi V3
                  _buildSectionHeader('B. Palet Warna Resmi V3'),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      _buildColorSwatch('Ink Base', AppColors.inkBase, '#05051A', hasBorder: true),
                      _buildColorSwatch('Surface 1', AppColors.surface1, '#0C0C26'),
                      _buildColorSwatch('Surface 2', AppColors.surface2, '#14143A'),
                      _buildColorSwatch('Surface 3', AppColors.surface3, '#1D1D4A'),
                      _buildColorSwatch('Brand Pink', AppColors.brandPink, '#FF1752'),
                      _buildColorSwatch('Verified Gold', AppColors.verifiedGold, '#D4AF37'),
                      _buildColorSwatch('Success', AppColors.success, '#2BB673'),
                      _buildColorSwatch('Warning', AppColors.warning, '#F2A33A'),
                      _buildColorSwatch('Danger', AppColors.danger, '#F04438'),
                    ],
                  ),
                  const SizedBox(height: 24),

                  // C. Skala Tipografi Modular V3
                  _buildSectionHeader('C. Skala Tipografi Modular V3'),
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppColors.surface1,
                      borderRadius: BorderRadius.circular(RadiusTokens.md),
                      border: Border.all(color: AppColors.borderSubtle),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('MINANG VIPER', style: AppTypography.displayHero()),
                        Text('Display Hero (Barlow Condensed 40pt W900)', style: AppTypography.caption()),
                        const Divider(color: AppColors.borderSubtle, height: 20),
                        Text('Fauzan Pratama', style: AppTypography.displayName()),
                        Text('Display Name (Barlow Condensed 28pt W800)', style: AppTypography.caption()),
                        const Divider(color: AppColors.borderSubtle, height: 20),
                        Text('Judul Halaman Utama', style: AppTypography.titleLarge()),
                        Text('Title Large (Plus Jakarta Sans 20pt W700)', style: AppTypography.caption()),
                        const Divider(color: AppColors.borderSubtle, height: 20),
                        Text('Sub-bagian atau Header Modul', style: AppTypography.titleMedium()),
                        Text('Title Medium (Plus Jakarta Sans 16pt W600)', style: AppTypography.caption()),
                        const Divider(color: AppColors.borderSubtle, height: 20),
                        Text('Teks paragraf isi antarmuka yang jernih dan adaptif terhadap bahasa Indonesia.', style: AppTypography.bodyRegular()),
                        Text('Body Regular (Plus Jakarta Sans 14pt W400)', style: AppTypography.caption()),
                        const Divider(color: AppColors.borderSubtle, height: 20),
                        Text('Label minimalis dan caption data tabular (batas min 12px)', style: AppTypography.caption(color: AppColors.textSecondary)),
                        Text('Caption (Plus Jakarta Sans 12pt W500)', style: AppTypography.caption()),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),

                  // D. 4 Bahan Fisik Rarity
                  _buildSectionHeader('D. 4 Bahan Fisik Rarity (Bukan Glow)'),
                  Row(
                    children: [
                      _buildMaterialCard('ROOKIE', 'Bronze Matte', AppColors.tierRookie, AppColors.tierRookieBorder),
                      const SizedBox(width: 8),
                      _buildMaterialCard('CONTENDER', 'Satin Silver', AppColors.tierContender, AppColors.tierContenderBorder),
                      const SizedBox(width: 8),
                      _buildMaterialCard('ELITE', 'Brushed Gold', AppColors.tierElite, AppColors.tierEliteBorder),
                      const SizedBox(width: 8),
                      _buildMaterialCard('LEGEND', 'Prismatic', AppColors.tierLegend, AppColors.tierLegendBorder),
                    ],
                  ),
                  const SizedBox(height: 24),

                  // 1. Tombol Aksi (GlassButton)
                  _buildSectionHeader('1. Tombol Aksi (GlassButton)'),
                  Wrap(
                    spacing: 10,
                    runSpacing: 10,
                    children: [
                      GlassButton(
                        label: 'Primary Pink (CTA)',
                        variant: GlassButtonVariant.primary,
                        onPressed: () {},
                      ),
                      GlassButton(
                        label: 'Gold Status',
                        variant: GlassButtonVariant.gold,
                        onPressed: () {},
                      ),
                      GlassButton(
                        label: 'Secondary Matte',
                        variant: GlassButtonVariant.secondary,
                        onPressed: () {},
                      ),
                      GlassButton(
                        label: 'Outline Rim',
                        variant: GlassButtonVariant.outline,
                        onPressed: () {},
                      ),
                      GlassButton(
                        label: 'Destructive Red',
                        variant: GlassButtonVariant.danger,
                        onPressed: () {},
                      ),
                      GlassButton(
                        label: 'Memuat...',
                        isLoading: true,
                        onPressed: () {},
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),

                  // 2. TabBar Kaca Melayang (GlassTabBar)
                  _buildSectionHeader('2. TabBar Kaca Melayang (GlassTabBar)'),
                  Container(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    decoration: BoxDecoration(
                      color: AppColors.surface1,
                      borderRadius: BorderRadius.circular(RadiusTokens.md),
                      border: Border.all(color: AppColors.borderSubtle),
                    ),
                    child: GlassTabBar(
                      currentIndex: _tabBarIndex,
                      onTabSelected: (idx) => setState(() => _tabBarIndex = idx),
                    ),
                  ),
                  const SizedBox(height: 24),

                  // 3. Avatar yang Dirancang (AppAvatar)
                  _buildSectionHeader('3. Avatar yang Dirancang (AppAvatar)'),
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppColors.surface1,
                      borderRadius: BorderRadius.circular(RadiusTokens.md),
                      border: Border.all(color: AppColors.borderSubtle),
                    ),
                    child: const Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        Column(
                          children: [
                            AppAvatar(size: 56, isVerified: true),
                            SizedBox(height: 8),
                            Text('Siluet + Emas', style: TextStyle(fontSize: 11, color: Colors.white70)),
                          ],
                        ),
                        Column(
                          children: [
                            AppAvatar(size: 48, isVerified: false),
                            SizedBox(height: 8),
                            Text('Siluet Netral', style: TextStyle(fontSize: 11, color: Colors.white70)),
                          ],
                        ),
                        Column(
                          children: [
                            AppAvatar(
                              size: 48,
                              imageUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150',
                              isVerified: true,
                            ),
                            SizedBox(height: 8),
                            Text('Foto Asli', style: TextStyle(fontSize: 11, color: Colors.white70)),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),

                  // 4. Baris Daftar Bebas Kotak Bersarang (ListRow)
                  _buildSectionHeader('4. Baris Daftar (ListRow - Bebas Kotak Bersarang)'),
                  Container(
                    decoration: BoxDecoration(
                      color: AppColors.surface1,
                      borderRadius: BorderRadius.circular(RadiusTokens.md),
                      border: Border.all(color: AppColors.borderSubtle),
                    ),
                    child: Column(
                      children: [
                        ListRow(
                          title: 'Fauzan Pratama',
                          subtitle: 'Pemain • Kota Padang',
                          isVerified: true,
                          trailing: const StatusBadge(status: VerificationStatus.verified, compact: true),
                          onTap: () {},
                        ),
                        ListRow(
                          title: 'Rahmat Hidayatullah',
                          subtitle: 'Pelatih • Bukittinggi',
                          isVerified: false,
                          trailing: const RarityTag(tier: RarityTier.elite),
                          onTap: () {},
                        ),
                        ListRow(
                          title: 'Minang Esports Arena',
                          subtitle: 'Venue Resmi • Kab. Tanah Datar',
                          showSeparator: false,
                          onTap: () {},
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),

                  // 5. Input Teks & Kontras WCAG AA
                  _buildSectionHeader('5. Input Teks & Pemilih Sheet'),
                  const GlassInput(
                    label: 'NAMA LENGKAP ATLET',
                    hint: 'Masukkan nama sesuai dokumen...',
                    prefixIcon: Icon(Icons.person, color: AppColors.textTertiary),
                  ),
                  const SizedBox(height: 12),
                  const GlassInput(
                    label: 'NICKNAME GAME (VALIDASI ERROR)',
                    hint: 'Contoh: Phoenix',
                    errorText: 'Nickname ini sudah digunakan oleh atlet lain.',
                  ),
                  const SizedBox(height: 12),
                  GlassSelect<String>(
                    label: 'KATEGORI ENTITAS',
                    value: _selectedCategory,
                    items: _categories,
                    itemLabel: (cat) => cat,
                    onSelected: (cat) => setState(() => _selectedCategory = cat),
                  ),
                  const SizedBox(height: 24),

                  // 6. Kontrol: Switch & Segmented
                  _buildSectionHeader('6. Kontrol: Switch & Segmented'),
                  Row(
                    children: [
                      GlassSwitch(
                        value: _switchVal,
                        onChanged: (v) => setState(() => _switchVal = v),
                      ),
                      const SizedBox(width: 12),
                      Text(
                        _switchVal ? 'Notifikasi Aktif' : 'Notifikasi Senyap',
                        style: AppTypography.bodyRegular(color: Colors.white),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  GlassSegmented<String>(
                    values: const ['Harian', 'Mingguan', 'Musim'],
                    labels: const ['Harian', 'Mingguan', 'Musim'],
                    selectedValue: _segmentedVal,
                    onSelected: (v) => setState(() => _segmentedVal = v),
                  ),
                  const SizedBox(height: 24),

                  // 7. Status Lencana Verifikasi & Rarity Tag
                  _buildSectionHeader('7. Status Lencana Verifikasi & Frame Rarity'),
                  const Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      StatusBadge(status: VerificationStatus.verified),
                      StatusBadge(status: VerificationStatus.pending),
                      StatusBadge(status: VerificationStatus.rejected),
                      StatusBadge(status: VerificationStatus.unverified),
                    ],
                  ),
                  const SizedBox(height: 10),
                  const Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      RarityTag(tier: RarityTier.rookie),
                      RarityTag(tier: RarityTier.contender),
                      RarityTag(tier: RarityTier.elite),
                      RarityTag(tier: RarityTier.legend),
                    ],
                  ),
                  const SizedBox(height: 24),

                  // 8. Permukaan Kaca Adaptif (GlassCard)
                  _buildSectionHeader('8. Permukaan Kaca Adaptif (GlassCard)'),
                  GlassCard(
                    blur: GlassBlur.regular,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'KARTU INFORMASI RESMI',
                          style: AppTypography.titleMedium(),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          'Permukaan kaca tenang dengan blur 16pt dan scrim kontras tinggi, memastikan teks selalu terbaca di atas konten dinamis.',
                          style: AppTypography.bodyRegular(),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),

                  // 9. Sheet, Dialog, & Toast
                  _buildSectionHeader('9. Sheet, Dialog, & Toast'),
                  Wrap(
                    spacing: 10,
                    runSpacing: 10,
                    children: [
                      GlassButton(
                        label: 'Buka Sheet',
                        variant: GlassButtonVariant.secondary,
                        onPressed: () {
                          GlassSheet.show(
                            context,
                            child: Padding(
                              padding: const EdgeInsets.all(20),
                              child: Column(
                                mainAxisSize: MainAxisSize.min,
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text('INFORMASI TIER ATLET', style: AppTypography.titleMedium()),
                                  const SizedBox(height: 8),
                                  Text(
                                    'Sistem rarity tier dievaluasi berdasarkan portofolio, keikutsertaan turnamen, dan relasi bilateral.',
                                    style: AppTypography.bodyRegular(),
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
                      GlassButton(
                        label: 'Buka Dialog',
                        variant: GlassButtonVariant.outline,
                        onPressed: () {
                          GlassDialog.show(
                            context,
                            title: 'Konfirmasi Aksi',
                            message: 'Apakah Anda yakin ingin memproses aksi ini?',
                            confirmLabel: 'Ya, Lanjut',
                            cancelLabel: 'Batal',
                          );
                        },
                      ),
                      GlassButton(
                        label: 'Uji Toast',
                        variant: GlassButtonVariant.primary,
                        onPressed: () {
                          AppToast.show(
                            context,
                            message: 'Profil berhasil diperbarui dengan aman.',
                            type: ToastType.success,
                          );
                        },
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),

                  // 10. Indikator Sistem & Counter
                  _buildSectionHeader('10. Indikator Sistem & Counter'),
                  Row(
                    children: [
                      Text('ATLET TERDAFTAR: ', style: AppTypography.titleMedium()),
                      NumberCounter(
                        value: _counterVal,
                        style: AppTypography.displayStat(color: AppColors.brandPink),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  const OfflineBanner(
                    message: 'Mode Offline: Menyajikan data profil dari cache lokal.',
                  ),
                  const SizedBox(height: 24),

                  // 11. Skeleton Placeholder
                  _buildSectionHeader('11. Skeleton Shimmer Netral'),
                  const GlassSkeleton(width: double.infinity, height: 48),
                  const SizedBox(height: 8),
                  const GlassSkeleton(width: 200, height: 20),
                  const SizedBox(height: 24),

                  // 12. Empty State & Error State
                  _buildSectionHeader('12. State Kosong & Error'),
                  const EmptyState(
                    title: 'Belum Ada Relasi',
                    description: 'Hubungkan profil Anda dengan tim atau akademi di Sumatera Barat.',
                    actionLabel: 'Cari Tim',
                  ),
                  const SizedBox(height: 16),
                  ErrorState(
                    title: 'Koneksi Terputus',
                    message: 'Tidak dapat menyinkronkan data dengan layanan direktori.',
                    onRetry: () {},
                  ),
                  const SizedBox(height: 24),

                  // 13. Uji Data Ekstrem (IGN Panjang, Teks Lebar)
                  _buildSectionHeader('13. Uji Integritas Data Ekstrem'),
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppColors.surface1,
                      borderRadius: BorderRadius.circular(RadiusTokens.md),
                      border: Border.all(color: AppColors.borderSubtle),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('IGN Ekstrem:', style: AppTypography.caption(color: AppColors.textTertiary)),
                        Text(
                          'X_Sultan_Minangkabau_Viper_Legendary_Champion_2026_X',
                          style: AppTypography.displayName(),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 12),
                        Text('Wilayah Ekstrem:', style: AppTypography.caption(color: AppColors.textTertiary)),
                        Text(
                          'Kecamatan Pariaman Timur, Kota Pariaman, Sumatera Barat, Indonesia',
                          style: AppTypography.bodyRegular(),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: SpacingTokens.bottomNavSafePadding),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildAssetItem(String path, String label, {bool isLockup = false}) {
    return Column(
      children: [
        Container(
          width: isLockup ? 120 : 48,
          height: 48,
          padding: const EdgeInsets.all(6),
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.05),
            borderRadius: BorderRadius.circular(RadiusTokens.sm),
            border: Border.all(color: AppColors.borderSubtle),
          ),
          child: Image.asset(
            path,
            fit: BoxFit.contain,
            errorBuilder: (_, __, ___) => const Icon(Icons.broken_image, color: Colors.white38),
          ),
        ),
        const SizedBox(height: 6),
        Text(label, style: AppTypography.caption(color: Colors.white70)),
      ],
    );
  }

  Widget _buildColorSwatch(String name, Color color, String hex, {bool hasBorder = false}) {
    return Container(
      width: 100,
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: AppColors.surface1,
        borderRadius: BorderRadius.circular(RadiusTokens.sm),
        border: Border.all(color: hasBorder ? Colors.white24 : AppColors.borderSubtle),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            height: 24,
            decoration: BoxDecoration(
              color: color,
              borderRadius: BorderRadius.circular(4),
              border: Border.all(color: Colors.white12),
            ),
          ),
          const SizedBox(height: 6),
          Text(name, style: AppTypography.caption(color: Colors.white), maxLines: 1, overflow: TextOverflow.ellipsis),
          Text(hex, style: GoogleFonts.barlowCondensed(color: Colors.white38, fontSize: 11)),
        ],
      ),
    );
  }

  Widget _buildMaterialCard(String title, String subtitle, Color color, Color border) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 6),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(RadiusTokens.sm),
          border: Border.all(color: border, width: 1.2),
        ),
        child: Column(
          children: [
            Text(title, style: GoogleFonts.barlowCondensed(color: color, fontWeight: FontWeight.w900, fontSize: 12)),
            const SizedBox(height: 2),
            Text(subtitle, style: AppTypography.caption(color: Colors.white60), textAlign: TextAlign.center, maxLines: 1),
          ],
        ),
      ),
    );
  }

  Widget _buildControlsCard(EffectTier currentTier) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface1,
        borderRadius: BorderRadius.circular(RadiusTokens.md),
        border: Border.all(color: AppColors.borderSubtle),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Mesin Efek Adaptif:', style: AppTypography.titleMedium()),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: AppColors.verifiedGold.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  currentTier.name.toUpperCase(),
                  style: GoogleFonts.barlowCondensed(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: AppColors.verifiedGold,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              _buildTierButton('Penuh', EffectTier.full, currentTier),
              const SizedBox(width: 8),
              _buildTierButton('Standar', EffectTier.standard, currentTier),
              const SizedBox(width: 8),
              _buildTierButton('Hemat', EffectTier.powerSaver, currentTier),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Skala Teks (Dynamic Type):', style: AppTypography.caption(color: AppColors.textSecondary)),
              Row(
                children: [
                  _buildScaleChip('1.0x', 1.0),
                  const SizedBox(width: 6),
                  _buildScaleChip('1.3x', 1.3),
                  const SizedBox(width: 6),
                  _buildScaleChip('2.0x', 2.0),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildTierButton(String label, EffectTier tier, EffectTier currentTier) {
    final isSelected = tier == currentTier;
    return Expanded(
      child: GestureDetector(
        onTap: () => EffectEngine.instance.setTier(tier),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 8),
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: isSelected ? AppColors.brandPink : Colors.white.withValues(alpha: 0.05),
            borderRadius: BorderRadius.circular(RadiusTokens.sm),
          ),
          child: Text(
            label,
            style: GoogleFonts.plusJakartaSans(
              fontSize: 12,
              fontWeight: FontWeight.w700,
              color: Colors.white,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildScaleChip(String label, double scale) {
    final isSelected = _textScale == scale;
    return GestureDetector(
      onTap: () => setState(() => _textScale = scale),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.brandPink : Colors.transparent,
          borderRadius: BorderRadius.circular(RadiusTokens.pill),
          border: Border.all(
            color: isSelected ? AppColors.brandPink : AppColors.borderSubtle,
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 11,
            fontWeight: FontWeight.bold,
            color: isSelected ? Colors.white : AppColors.textSecondary,
          ),
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Text(
        title,
        style: AppTypography.titleMedium(color: Colors.white),
      ),
    );
  }
}
