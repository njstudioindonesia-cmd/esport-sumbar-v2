import 'package:flutter/material.dart';
import '../../../../core/constants/colors.dart';
import '../../../../data/models/profile_model.dart';
import '../../../../data/repositories/profile_repository.dart';
import '../card/widgets/esport_card_3d.dart';
import '../skeleton/connection_test_screen.dart';
import '../gallery/component_gallery_screen.dart';
import '../system/notification_center_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final ProfileRepository _repository = ProfileRepository();
  String _selectedEntityType = '';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: EsportColors.background,
      appBar: AppBar(
        backgroundColor: EsportColors.surface,
        elevation: 0,
        titleSpacing: 16,
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: EsportColors.gold.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: EsportColors.gold, width: 1),
              ),
              child: const Icon(Icons.shield, color: EsportColors.gold, size: 20),
            ),
            const SizedBox(width: 10),
            const Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    'ESPORT SUMBAR',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 15,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 1.1,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  Text(
                    'EKOSISTEM DIGITAL SUMATERA BARAT',
                    style: TextStyle(color: EsportColors.gold, fontSize: 9, fontWeight: FontWeight.bold),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_none_rounded, color: Colors.white),
            tooltip: 'Pusat Notifikasi',
            onPressed: () {
              Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (context) => const NotificationCenterScreen(),
                ),
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.palette_outlined, color: EsportColors.brandPink),
            tooltip: 'Galeri Sistem Desain Native',
            onPressed: () {
              Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (context) => const ComponentGalleryScreen(),
                ),
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.network_check_rounded, color: EsportColors.gold),
            tooltip: 'Diagnostik API & Koneksi V3',
            onPressed: () {
              Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (context) => const ConnectionTestScreen(),
                ),
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.qr_code_scanner, color: EsportColors.gold),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Scanner Verifikasi QR Code siap diaktifkan.')),
              );
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Filter Tabs (Semua, Player, Coach, Team, Community)
          _buildFilterTabs(),

          // Live Status Stream Indicator
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
            child: Row(
              children: [
                Container(
                  width: 8,
                  height: 8,
                  decoration: const BoxDecoration(
                    color: EsportColors.verified,
                    shape: BoxShape.circle,
                  ),
                ),
                const SizedBox(width: 8),
                const Text(
                  'TERHUBUNG LANGSUNG KE CLOUD DATABASE (REALTIME)',
                  style: TextStyle(
                    color: EsportColors.textMuted,
                    fontSize: 10,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 0.8,
                  ),
                ),
              ],
            ),
          ),

          // Realtime Stream StreamBuilder
          Expanded(
            child: StreamBuilder<List<ProfileModel>>(
              stream: _repository.streamProfiles(
                entityType: _selectedEntityType.isEmpty ? null : _selectedEntityType,
              ),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(
                    child: CircularProgressIndicator(color: EsportColors.gold),
                  );
                }

                if (snapshot.hasError) {
                  return Center(
                    child: Text(
                      'Koneksi error: ${snapshot.error}',
                      style: const TextStyle(color: Colors.redAccent),
                    ),
                  );
                }

                final profiles = snapshot.data ?? [];

                var displayList = profiles;
                final bool isShowingDemo = profiles.isEmpty;

                if (isShowingDemo) {
                  // Jika database cloud belum memiliki profil terverifikasi, tampilkan kartu demo profil
                  displayList = [
                    ProfileModel(
                      id: 'demo-profile-01',
                      accountId: 'demo-acc-01',
                      entityType: 'player',
                      esportId: 'ESP-SB-2026-0001',
                      slug: 'fauzan-pratama',
                      displayName: 'Fauzan Pratama',
                      ign: 'MINANG VIPER',
                      regionId: 'reg-pdg',
                      regionName: 'KOTA PADANG',
                      regionCode: 'PDG',
                      mainGameId: 'game-mlbb',
                      mainGameName: 'MOBILE LEGENDS',
                      roleName: 'Jungler / Assassin',
                      avatarUrl: null,
                      coverUrl: null,
                      bio: 'Atlet Kompetitif Sumatera Barat 2026',
                      rarityTier: 'legend',
                      completenessScore: 100,
                      verificationStatus: 'verified',
                      verifiedBadgeNo: 'ESP-SB-VER-001',
                      createdAt: DateTime.now(),
                    ),
                    ProfileModel(
                      id: 'demo-profile-02',
                      accountId: 'demo-acc-02',
                      entityType: 'player',
                      esportId: 'ESP-SB-2026-0002',
                      slug: 'rahmat-hidayat',
                      displayName: 'Rahmat Hidayat',
                      ign: 'SINGA MARAPI',
                      regionId: 'reg-bkt',
                      regionName: 'BUKITTINGGI',
                      regionCode: 'BKT',
                      mainGameId: 'game-pubg',
                      mainGameName: 'PUBG MOBILE',
                      roleName: 'Sniper / Scout',
                      avatarUrl: null,
                      coverUrl: null,
                      bio: 'Kapten Tim Porprov Bukittinggi',
                      rarityTier: 'elite',
                      completenessScore: 95,
                      verificationStatus: 'verified',
                      verifiedBadgeNo: 'ESP-SB-VER-002',
                      createdAt: DateTime.now(),
                    ),
                  ];
                }

                return Column(
                  children: [
                    if (isShowingDemo)
                      Padding(
                        padding: const EdgeInsets.only(bottom: 8),
                        child: Text(
                          'Geser kartu ke samping atau ketuk untuk flip QR Code',
                          style: TextStyle(
                            color: EsportColors.gold.withValues(alpha: 0.8),
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    Expanded(
                      child: PageView.builder(
                        controller: PageController(viewportFraction: 0.85),
                        itemCount: displayList.length,
                        itemBuilder: (context, index) {
                          final profile = displayList[index];
                          return Center(
                            child: Padding(
                              padding: const EdgeInsets.symmetric(horizontal: 10),
                              child: EsportCard3D(profile: profile),
                            ),
                          );
                        },
                      ),
                    ),
                  ],
                );
              },
            ),
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }

  Widget _buildFilterTabs() {
    final categories = ['', 'player', 'coach', 'team', 'community'];
    final labels = ['Semua', 'Player', 'Coach', 'Team', 'Community'];

    return Container(
      height: 48,
      margin: const EdgeInsets.only(top: 8),
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: categories.length,
        separatorBuilder: (_, __) => const SizedBox(width: 8),
        itemBuilder: (context, index) {
          final isSelected = _selectedEntityType == categories[index];
          return ChoiceChip(
            label: Text(labels[index]),
            selected: isSelected,
            selectedColor: EsportColors.gold.withValues(alpha: 0.2),
            backgroundColor: EsportColors.surfaceLight,
            labelStyle: TextStyle(
              color: isSelected ? EsportColors.gold : EsportColors.textSecondary,
              fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
              fontSize: 12,
            ),
            side: BorderSide(
              color: isSelected ? EsportColors.gold : EsportColors.border,
            ),
            onSelected: (val) {
              setState(() {
                _selectedEntityType = categories[index];
              });
            },
          );
        },
      ),
    );
  }
}
