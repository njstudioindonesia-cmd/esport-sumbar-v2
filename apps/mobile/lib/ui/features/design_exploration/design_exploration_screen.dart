import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../../../core/constants/colors.dart';
import '../../../core/theme/tokens.dart';

/// Model Data Realistis Contoh Atlet Esport Sumatera Barat
class ExplorationMockData {
  static const String athleteName = 'Fauzan Pratama';
  static const String ign = 'MINANG VIPER';
  static const String game = 'Mobile Legends: Bang Bang';
  static const String role = 'Jungler / Assassin';
  static const String region = 'Kota Padang';
  static const String esportId = 'ESP-SB-PDG-2026';
  static const String badgeNo = 'ESP-SB-VER-001';
  static const String tier = 'elite'; // rookie, contender, elite, legend
}

/// Enum 3 Arah Visual (Bagian 3.7B)
enum DesignDirection {
  obsidianEditorial, // Arah A: Editorial, Berani, Tipografis
  matteGlass,        // Arah B: Tenang, Taktil, Premium (Rekomendasi Utama)
  arenaPoster,       // Arah C: Energik, Bentuk Miring Mark V-S, Disiplin
}

/// Enum 3 Layar Kunci
enum KeyScreen {
  home,
  card,
  profile,
}

class DesignExplorationScreen extends StatefulWidget {
  const DesignExplorationScreen({super.key});

  @override
  State<DesignExplorationScreen> createState() => _DesignExplorationScreenState();
}

class _DesignExplorationScreenState extends State<DesignExplorationScreen> {
  DesignDirection _currentDirection = DesignDirection.matteGlass;
  KeyScreen _currentScreen = KeyScreen.home;
  bool _isTextScale130 = false;
  bool _isCardFlipped = false;

  @override
  Widget build(BuildContext context) {
    final mediaQuery = MediaQuery.of(context);
    final effectiveTextScaler = _isTextScale130
        ? const TextScaler.linear(1.3)
        : mediaQuery.textScaler;

    return MediaQuery(
      data: mediaQuery.copyWith(textScaler: effectiveTextScaler),
      child: Scaffold(
        backgroundColor: const Color(0xFF05051A), // Ink Base Resmi
        body: SafeArea(
          bottom: false,
          child: Column(
            children: [
              // 1. Bilah Kontrol Studio Desain (Khusus Eksplorasi Gerbang 1)
              _buildStudioControls(),

              // 2. Konten Layar Prototipe Arah Visual Terpilih
              Expanded(
                child: AnimatedSwitcher(
                  duration: const Duration(milliseconds: 250),
                  child: _buildCurrentScreenContent(),
                ),
              ),

              // 3. Bilah Navigasi Bawah Tenang (Calm Tab Bar)
              _buildCalmTabBar(),
            ],
          ),
        ),
      ),
    );
  }

  // ==========================================
  // PANEL KONTROL STUDIO DESAIN (GERBANG 1)
  // ==========================================
  Widget _buildStudioControls() {
    return Container(
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 8),
      decoration: BoxDecoration(
        color: const Color(0xFF0C0C26),
        border: Border(
          bottom: BorderSide(
            color: Colors.white.withValues(alpha: 0.08),
            width: 1,
          ),
        ),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Baris Pemilihan 3 Arah Visual
          Row(
            children: [
              Text(
                'ARAH:',
                style: GoogleFonts.plusJakartaSans(
                  color: Colors.white.withValues(alpha: 0.5),
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 0.8,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Row(
                  children: [
                    _buildDirectionChip(
                      label: 'A. Editorial',
                      direction: DesignDirection.obsidianEditorial,
                    ),
                    const SizedBox(width: 6),
                    _buildDirectionChip(
                      label: 'B. Matte Glass',
                      direction: DesignDirection.matteGlass,
                      isRecommended: true,
                    ),
                    const SizedBox(width: 6),
                    _buildDirectionChip(
                      label: 'C. Arena',
                      direction: DesignDirection.arenaPoster,
                    ),
                  ],
                ),
              ),
              // Tombol Uji Skala Teks 130%
              GestureDetector(
                onTap: () => setState(() => _isTextScale130 = !_isTextScale130),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: _isTextScale130
                        ? const Color(0xFFFF1752).withValues(alpha: 0.2)
                        : Colors.white.withValues(alpha: 0.05),
                    borderRadius: BorderRadius.circular(6),
                    border: Border.all(
                      color: _isTextScale130
                          ? const Color(0xFFFF1752)
                          : Colors.white.withValues(alpha: 0.1),
                    ),
                  ),
                  child: Text(
                    _isTextScale130 ? '130%' : '100%',
                    style: GoogleFonts.plusJakartaSans(
                      color: _isTextScale130 ? const Color(0xFFFF1752) : Colors.white70,
                      fontSize: 10,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),

          // Baris Pemilihan 3 Layar Kunci
          Row(
            children: [
              Text(
                'LAYAR:',
                style: GoogleFonts.plusJakartaSans(
                  color: Colors.white.withValues(alpha: 0.5),
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 0.8,
                ),
              ),
              const SizedBox(width: 8),
              _buildScreenTab('Home', KeyScreen.home),
              const SizedBox(width: 6),
              _buildScreenTab('Kartu', KeyScreen.card),
              const SizedBox(width: 6),
              _buildScreenTab('Profil', KeyScreen.profile),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildDirectionChip({
    required String label,
    required DesignDirection direction,
    bool isRecommended = false,
  }) {
    final isSelected = _currentDirection == direction;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _currentDirection = direction),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 6),
          decoration: BoxDecoration(
            color: isSelected
                ? const Color(0xFFFF1752).withValues(alpha: 0.2)
                : Colors.white.withValues(alpha: 0.04),
            borderRadius: BorderRadius.circular(8),
            border: Border.all(
              color: isSelected
                  ? const Color(0xFFFF1752)
                  : Colors.white.withValues(alpha: 0.08),
              width: isSelected ? 1.5 : 1,
            ),
          ),
          child: Center(
            child: Text(
              isRecommended ? '$label ★' : label,
              style: GoogleFonts.plusJakartaSans(
                color: isSelected ? Colors.white : Colors.white60,
                fontSize: 11,
                fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildScreenTab(String title, KeyScreen screen) {
    final isSelected = _currentScreen == screen;
    return GestureDetector(
      onTap: () => setState(() => _currentScreen = screen),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
        decoration: BoxDecoration(
          color: isSelected ? Colors.white : Colors.transparent,
          borderRadius: BorderRadius.circular(6),
        ),
        child: Text(
          title,
          style: GoogleFonts.plusJakartaSans(
            color: isSelected ? const Color(0xFF05051A) : Colors.white70,
            fontSize: 11,
            fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
          ),
        ),
      ),
    );
  }

  // ==========================================
  // PEMILIHAN KONTEN LAYAR BERDASARKAN ARAH
  // ==========================================
  Widget _buildCurrentScreenContent() {
    switch (_currentScreen) {
      case KeyScreen.home:
        return _buildHomeScreen();
      case KeyScreen.card:
        return _buildCardScreen();
      case KeyScreen.profile:
        return _buildProfileScreen();
    }
  }

  // ==========================================
  // LAYAR 1: HOME (BERANDA) - ANGGARAN TEKS <= 20 KATA
  // ==========================================
  Widget _buildHomeScreen() {
    return SingleChildScrollView(
      key: ValueKey('home_${_currentDirection.name}'),
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 100),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 1. Header Minimalis (Mark V-S Resmi + Lonceng & Avatar)
          _buildMinimalHeader(),
          const SizedBox(height: 24),

          // 2. Hero: Kartu Milik Pengguna (Objek Utama Layar)
          _buildHeroCardPreview(),
          const SizedBox(height: 16),

          // 3. Satu Aksi Kontekstual Tunggal (Progress Ring + Label Singkat)
          _buildContextualActionPill(),
          const SizedBox(height: 32),

          // 4. Ekosistem Terhubung (Maksimal 5 Avatar + 1 Angka Counter)
          _buildEcosystemMiniRow(),
          const SizedBox(height: 32),

          // 5. Sorotan Komunitas / Wilayah (Mini Cards)
          _buildSpotlightMiniRow(),
          const SizedBox(height: 32),

          // 6. Kartu Editorial Citra Besar (1 Judul Bersih)
          _buildEditorialNewsCard(),
        ],
      ),
    );
  }

  /// Header Minimalis: Mark V-S di Kiri, Lonceng & Avatar di Kanan (Nol Tagline)
  Widget _buildMinimalHeader() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        // Mark V-S Resmi (Bukan Ikon Perisai Generik)
        Image.asset(
          'assets/images/logo-mark-pink.png',
          width: 28,
          height: 28,
          errorBuilder: (_, __, ___) => Container(
            width: 28,
            height: 28,
            decoration: BoxDecoration(
              color: const Color(0xFFFF1752),
              borderRadius: BorderRadius.circular(6),
            ),
            child: const Center(
              child: Text(
                'V',
                style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
              ),
            ),
          ),
        ),

        // Aksi Kanan: Lonceng Notifikasi + Avatar Tab Saya
        Row(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.05),
                shape: BoxShape.circle,
              ),
              child: Stack(
                alignment: Alignment.center,
                children: [
                  const Icon(Icons.notifications_none_rounded, color: Colors.white, size: 20),
                  Positioned(
                    top: 10,
                    right: 10,
                    child: Container(
                      width: 6,
                      height: 6,
                      decoration: const BoxDecoration(
                        color: Color(0xFFFF1752),
                        shape: BoxShape.circle,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 12),
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(color: Colors.white.withValues(alpha: 0.15), width: 1.5),
                color: const Color(0xFF14143A),
              ),
              child: ClipOval(
                child: Center(
                  child: Text(
                    'FP',
                    style: GoogleFonts.barlowCondensed(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }

  /// Hero Card Preview di Home (Tiga Karakter Visual)
  Widget _buildHeroCardPreview() {
    switch (_currentDirection) {
      case DesignDirection.obsidianEditorial:
        // Arah A: Editorial, Foto Penuh, Tipografi Sangat Besar
        return Container(
          height: 380,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(20),
            color: const Color(0xFF0C0C26),
            border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
          ),
          child: Stack(
            children: [
              // Background Foto Atlet / Desain Penuh
              Positioned.fill(
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(20),
                  child: _buildAthletePhotoContainer(isFullBleed: true),
                ),
              ),
              // Gradient Shade Bawah
              Positioned.fill(
                child: Container(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(20),
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [
                        Colors.transparent,
                        const Color(0xFF05051A).withValues(alpha: 0.95),
                      ],
                      stops: const [0.45, 1.0],
                    ),
                  ),
                ),
              ),
              // Header Kartu: Mark & Badge
              Positioned(
                top: 16,
                left: 16,
                right: 16,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Image.asset('assets/images/logo-mark-white.png', width: 22, height: 22,
                        errorBuilder: (_, __, ___) => const Icon(Icons.bolt, color: Colors.white, size: 20)),
                    _buildVerifiedGoldBadge(),
                  ],
                ),
              ),
              // Footer Kartu: Nama Raksasa & Metrik
              Positioned(
                bottom: 18,
                left: 18,
                right: 18,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      ExplorationMockData.ign,
                      style: GoogleFonts.barlowCondensed(
                        fontSize: 36,
                        fontWeight: FontWeight.w900,
                        color: Colors.white,
                        letterSpacing: 0.5,
                        height: 1.0,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '${ExplorationMockData.game} • ${ExplorationMockData.region}',
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 13,
                        color: Colors.white.withValues(alpha: 0.7),
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        );

      case DesignDirection.matteGlass:
        // Arah B (Rekomendasi): Tenang, Taktil, Kartu Fisik Digital dengan Tekstur Bahan
        return Container(
          height: 380,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(20),
            color: const Color(0xFF0C0C26),
            border: Border.all(
              color: const Color(0xFFD4AF37).withValues(alpha: 0.35), // Frame Elite Brushed Gold
              width: 1.2,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.4),
                blurRadius: 20,
                offset: const Offset(0, 10),
              ),
            ],
          ),
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Baris Header: Mark V-S + Status Rarity & Lencana Terpisah
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Image.asset('assets/images/logo-mark-pink.png', width: 20, height: 20,
                          errorBuilder: (_, __, ___) => const Icon(Icons.bolt, color: Color(0xFFFF1752), size: 18)),
                      const SizedBox(width: 8),
                      Text(
                        'ELITE',
                        style: GoogleFonts.barlowCondensed(
                          color: const Color(0xFFD4AF37),
                          fontSize: 13,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 1.0,
                        ),
                      ),
                    ],
                  ),
                  _buildVerifiedGoldBadge(),
                ],
              ),
              const Spacer(),

              // Foto Atlet Terpusat (Bukan Huruf dalam Lingkaran Glow)
              Center(
                child: Container(
                  width: 150,
                  height: 150,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(16),
                    color: const Color(0xFF14143A),
                    border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(15),
                    child: _buildAthletePhotoContainer(),
                  ),
                ),
              ),
              const Spacer(),

              // Identitas Atlet (Display + Subtitle Bersih)
              Text(
                ExplorationMockData.ign,
                style: GoogleFonts.barlowCondensed(
                  fontSize: 28,
                  fontWeight: FontWeight.w900,
                  color: Colors.white,
                  letterSpacing: 0.8,
                  height: 1.1,
                ),
              ),
              const SizedBox(height: 2),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Text(
                      '${ExplorationMockData.role} • ${ExplorationMockData.region}',
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 12,
                        color: Colors.white.withValues(alpha: 0.6),
                        fontWeight: FontWeight.w500,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    ExplorationMockData.esportId,
                    style: GoogleFonts.barlowCondensed(
                      fontSize: 12,
                      color: Colors.white.withValues(alpha: 0.4),
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ],
              ),
            ],
          ),
        );

      case DesignDirection.arenaPoster:
        // Arah C: Blok Warna Tegas & Bentuk Miring Geometris
        return Container(
          height: 380,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(20),
            color: const Color(0xFF0C0C26),
            border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
          ),
          child: Stack(
            children: [
              // Aksen Geometris Miring Mark V-S (Slanted Accent)
              Positioned(
                top: 0,
                right: 0,
                child: Transform.rotate(
                  angle: -0.12,
                  child: Container(
                    width: 180,
                    height: 220,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          const Color(0xFFFF1752).withValues(alpha: 0.18),
                          Colors.transparent,
                        ],
                        begin: Alignment.topRight,
                        end: Alignment.bottomLeft,
                      ),
                    ),
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'ESPORT SUMBAR',
                          style: GoogleFonts.barlowCondensed(
                            fontSize: 16,
                            fontWeight: FontWeight.w900,
                            letterSpacing: 1.5,
                            color: Colors.white,
                          ),
                        ),
                        _buildVerifiedGoldBadge(),
                      ],
                    ),
                    const Spacer(),
                    Center(
                      child: Container(
                        width: 140,
                        height: 140,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: const Color(0xFF14143A),
                          border: Border.all(color: const Color(0xFFFF1752), width: 2),
                        ),
                        child: ClipOval(
                          child: _buildAthletePhotoContainer(),
                        ),
                      ),
                    ),
                    const Spacer(),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: const BoxDecoration(
                        color: Color(0xFFFF1752),
                      ),
                      child: Text(
                        'ATLET UTAMA',
                        style: GoogleFonts.barlowCondensed(
                          color: Colors.white,
                          fontSize: 11,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      ExplorationMockData.ign,
                      style: GoogleFonts.barlowCondensed(
                        fontSize: 30,
                        fontWeight: FontWeight.w900,
                        color: Colors.white,
                        letterSpacing: 0.5,
                      ),
                    ),
                    Text(
                      ExplorationMockData.game,
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 12,
                        color: Colors.white70,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
    }
  }

  /// Aksi Kontekstual Tunggal di Bawah Kartu
  Widget _buildContextualActionPill() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: const Color(0xFF0C0C26),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
      ),
      child: Row(
        children: [
          // Cincin Progres Kecil
          SizedBox(
            width: 22,
            height: 22,
            child: CircularProgressIndicator(
              value: 0.85,
              strokeWidth: 2.5,
              color: const Color(0xFFFF1752),
              backgroundColor: Colors.white.withValues(alpha: 0.1),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              'Profil 85% lengkap',
              style: GoogleFonts.plusJakartaSans(
                color: Colors.white,
                fontSize: 13,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          Text(
            'Lengkapi →',
            style: GoogleFonts.plusJakartaSans(
              color: const Color(0xFFFF1752),
              fontSize: 12,
              fontWeight: FontWeight.w700,
            ),
          ),
        ],
      ),
    );
  }

  /// Ekosistem Terhubung: Deretan Avatar Terhubung (Maks 5)
  Widget _buildEcosystemMiniRow() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Ekosistem',
              style: GoogleFonts.plusJakartaSans(
                color: Colors.white,
                fontSize: 15,
                fontWeight: FontWeight.w700,
              ),
            ),
            Text(
              '4 Terhubung',
              style: GoogleFonts.plusJakartaSans(
                color: Colors.white.withValues(alpha: 0.4),
                fontSize: 12,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            _buildAvatarCircle('PT', 'Padang Thunder', Colors.blueAccent),
            const SizedBox(width: 8),
            _buildAvatarCircle('SM', 'Singa Marapi', Colors.amber),
            const SizedBox(width: 8),
            _buildAvatarCircle('UA', 'Univ Andalas', Colors.purpleAccent),
            const SizedBox(width: 8),
            _buildAvatarCircle('BA', 'Bukittinggi Arena', Colors.tealAccent),
            const SizedBox(width: 8),
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.white.withValues(alpha: 0.05),
                border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
              ),
              child: const Icon(Icons.add, color: Colors.white70, size: 20),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildAvatarCircle(String initials, String label, Color color) {
    return Container(
      width: 44,
      height: 44,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: color.withValues(alpha: 0.15),
        border: Border.all(color: color.withValues(alpha: 0.4), width: 1.2),
      ),
      child: Center(
        child: Text(
          initials,
          style: GoogleFonts.barlowCondensed(
            color: Colors.white,
            fontSize: 15,
            fontWeight: FontWeight.w800,
          ),
        ),
      ),
    );
  }

  /// Sorotan: Karusel Mini Card Komunitas / Profil Baru
  Widget _buildSpotlightMiniRow() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Sorotan',
          style: GoogleFonts.plusJakartaSans(
            color: Colors.white,
            fontSize: 15,
            fontWeight: FontWeight.w700,
          ),
        ),
        const SizedBox(height: 12),
        SizedBox(
          height: 110,
          child: ListView(
            scrollDirection: Axis.horizontal,
            children: [
              _buildMiniSpotlightCard('PADANG ARENA', 'Venue Terverifikasi', 'Kota Padang'),
              const SizedBox(width: 12),
              _buildMiniSpotlightCard('SINGA MARAPI', 'Tim Divisi Utama', 'Bukittinggi'),
              const SizedBox(width: 12),
              _buildMiniSpotlightCard('UNAND ESPORT', 'Akademi Kampus', 'Limau Manis'),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildMiniSpotlightCard(String name, String type, String location) {
    return Container(
      width: 180,
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFF0C0C26),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            name,
            style: GoogleFonts.barlowCondensed(
              color: Colors.white,
              fontSize: 16,
              fontWeight: FontWeight.w800,
            ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 2),
          Text(
            type,
            style: GoogleFonts.plusJakartaSans(
              color: const Color(0xFFFF1752),
              fontSize: 11,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            location,
            style: GoogleFonts.plusJakartaSans(
              color: Colors.white.withValues(alpha: 0.4),
              fontSize: 11,
            ),
          ),
        ],
      ),
    );
  }

  /// Berita Editorial: 1 Card Citra Besar Bersih
  Widget _buildEditorialNewsCard() {
    return Container(
      height: 140,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        color: const Color(0xFF0C0C26),
        border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
      ),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(4),
            ),
            child: Text(
              'AGENDA',
              style: GoogleFonts.barlowCondensed(
                color: Colors.white70,
                fontSize: 10,
                fontWeight: FontWeight.w800,
                letterSpacing: 0.8,
              ),
            ),
          ),
          const SizedBox(height: 6),
          Text(
            'Kurasi Profil Mandiri Musim 2026 Dibuka',
            style: GoogleFonts.plusJakartaSans(
              color: Colors.white,
              fontSize: 15,
              fontWeight: FontWeight.w700,
            ),
            maxLines: 2,
          ),
        ],
      ),
    );
  }

  // ==========================================
  // LAYAR 2: KARTU (DOMPET PASPOR ATLET)
  // ANGGARAN TEKS <= 12 KATA
  // ==========================================
  Widget _buildCardScreen() {
    return SingleChildScrollView(
      key: ValueKey('card_${_currentDirection.name}'),
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 110),
      child: Column(
        children: [
          // Kartu 3D Utama di Pusat Layar (Dukungan Flip 180 Ke QR)
          GestureDetector(
            onTap: () => setState(() => _isCardFlipped = !_isCardFlipped),
            child: AnimatedSwitcher(
              duration: const Duration(milliseconds: 350),
              transitionBuilder: (child, animation) {
                return RotationTransition(
                  turns: Tween(begin: 0.5, end: 1.0).animate(animation),
                  child: child,
                );
              },
              child: _isCardFlipped ? _buildCardBack() : _buildCardFrontDetailed(),
            ),
          ),
          const SizedBox(height: 24),

          // Tiga Aksi Ikon Bersih Terukur (Bagikan, QR/Flip, Simpan)
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              _buildRoundActionButton(
                icon: Icons.share_rounded,
                label: 'Bagikan',
                onTap: () {},
              ),
              const SizedBox(width: 24),
              _buildRoundActionButton(
                icon: _isCardFlipped ? Icons.credit_card_rounded : Icons.qr_code_rounded,
                label: _isCardFlipped ? 'Paspor' : 'Kode QR',
                onTap: () => setState(() => _isCardFlipped = !_isCardFlipped),
                isPrimary: true,
              ),
              const SizedBox(width: 24),
              _buildRoundActionButton(
                icon: Icons.download_rounded,
                label: 'Simpan',
                onTap: () {},
              ),
            ],
          ),
          const SizedBox(height: 28),

          // Status Verifikasi Singkat (Tanpa Paragraf Tutorial)
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            decoration: BoxDecoration(
              color: const Color(0xFF0C0C26),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.verified_rounded, color: Color(0xFFD4AF37), size: 16),
                const SizedBox(width: 8),
                Text(
                  'Lencana Terverifikasi Aktif',
                  style: GoogleFonts.plusJakartaSans(
                    color: Colors.white,
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  /// Sisi Depan Kartu Detail
  Widget _buildCardFrontDetailed() {
    return Container(
      key: const ValueKey('front_card'),
      height: 480,
      decoration: BoxDecoration(
        color: const Color(0xFF0C0C26),
        borderRadius: BorderRadius.circular(22),
        border: Border.all(
          color: const Color(0xFFD4AF37).withValues(alpha: 0.45), // Frame Elite Brushed Gold
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.6),
            blurRadius: 28,
            offset: const Offset(0, 14),
          ),
        ],
      ),
      padding: const EdgeInsets.all(22),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header Kartu: Mark V-S & Lencana Terverifikasi Kecil
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Image.asset('assets/images/logo-mark-pink.png', width: 24, height: 24,
                  errorBuilder: (_, __, ___) => const Icon(Icons.bolt, color: Color(0xFFFF1752), size: 22)),
              _buildVerifiedGoldBadge(),
            ],
          ),
          const Spacer(),

          // Foto Atlet Penuh di Pusat
          Center(
            child: Container(
              width: 180,
              height: 180,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(20),
                color: const Color(0xFF14143A),
                border: Border.all(color: Colors.white.withValues(alpha: 0.12)),
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(19),
                child: _buildAthletePhotoContainer(),
              ),
            ),
          ),
          const Spacer(),

          // Identitas Utama: IGN Display Tebal
          Text(
            ExplorationMockData.ign,
            style: GoogleFonts.barlowCondensed(
              fontSize: 34,
              fontWeight: FontWeight.w900,
              color: Colors.white,
              letterSpacing: 0.5,
              height: 1.0,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            ExplorationMockData.athleteName,
            style: GoogleFonts.plusJakartaSans(
              fontSize: 14,
              color: Colors.white.withValues(alpha: 0.7),
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 12),

          // Baris Detail Bawah: Game + Wilayah + ID Monospace
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.04),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(
                    '${ExplorationMockData.game} • ${ExplorationMockData.region}',
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 11,
                      color: Colors.white70,
                      fontWeight: FontWeight.w500,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                const SizedBox(width: 8),
                Text(
                  ExplorationMockData.esportId,
                  style: GoogleFonts.barlowCondensed(
                    fontSize: 11,
                    color: Colors.white.withValues(alpha: 0.5),
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  /// Sisi Belakang Kartu (QR Code Verifikasi)
  Widget _buildCardBack() {
    return Container(
      key: const ValueKey('back_card'),
      height: 480,
      decoration: BoxDecoration(
        color: const Color(0xFF0C0C26),
        borderRadius: BorderRadius.circular(22),
        border: Border.all(
          color: const Color(0xFFD4AF37).withValues(alpha: 0.45),
          width: 1.5,
        ),
      ),
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            'KODE VERIFIKASI',
            style: GoogleFonts.barlowCondensed(
              color: Colors.white,
              fontSize: 18,
              fontWeight: FontWeight.w800,
              letterSpacing: 1.2,
            ),
          ),
          const SizedBox(height: 20),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
            ),
            child: QrImageView(
              data: 'https://esportsumbar.com/p/fauzan-pratama',
              version: QrVersions.auto,
              size: 180.0,
            ),
          ),
          const SizedBox(height: 20),
          Text(
            ExplorationMockData.esportId,
            style: GoogleFonts.barlowCondensed(
              color: const Color(0xFFD4AF37),
              fontSize: 16,
              fontWeight: FontWeight.w800,
              letterSpacing: 1.5,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'Ketuk untuk kembali',
            style: GoogleFonts.plusJakartaSans(
              color: Colors.white38,
              fontSize: 11,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRoundActionButton({
    required IconData icon,
    required String label,
    required VoidCallback onTap,
    bool isPrimary = false,
  }) {
    return Column(
      children: [
        GestureDetector(
          onTap: onTap,
          child: Container(
            width: 52,
            height: 52,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: isPrimary
                  ? const Color(0xFFFF1752)
                  : Colors.white.withValues(alpha: 0.06),
              border: Border.all(
                color: isPrimary
                    ? const Color(0xFFFF1752)
                    : Colors.white.withValues(alpha: 0.12),
              ),
            ),
            child: Icon(
              icon,
              color: Colors.white,
              size: 22,
            ),
          ),
        ),
        const SizedBox(height: 6),
        Text(
          label,
          style: GoogleFonts.plusJakartaSans(
            color: Colors.white70,
            fontSize: 11,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }

  // ==========================================
  // LAYAR 3: PROFIL PUBLIK (7 TEMPLAT)
  // ANGGARAN TEKS <= 20 KATA
  // ==========================================
  Widget _buildProfileScreen() {
    return SingleChildScrollView(
      key: ValueKey('profile_${_currentDirection.name}'),
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 100),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 1. Hero Profil: Foto Atlet Besar + Lencana
          Center(
            child: Stack(
              children: [
                Container(
                  width: 110,
                  height: 110,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(24),
                    color: const Color(0xFF14143A),
                    border: Border.all(color: Colors.white.withValues(alpha: 0.12), width: 1.5),
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(22),
                    child: _buildAthletePhotoContainer(),
                  ),
                ),
                Positioned(
                  bottom: -2,
                  right: -2,
                  child: _buildVerifiedGoldBadge(),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // 2. Identitas: Nama & IGN
          Center(
            child: Column(
              children: [
                Text(
                  ExplorationMockData.ign,
                  style: GoogleFonts.barlowCondensed(
                    fontSize: 28,
                    fontWeight: FontWeight.w900,
                    color: Colors.white,
                    letterSpacing: 0.5,
                  ),
                ),
                Text(
                  '${ExplorationMockData.athleteName} • ${ExplorationMockData.region}',
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 13,
                    color: Colors.white.withValues(alpha: 0.6),
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // 3. Tiga Angka Kunci (Key Metrics Tabular)
          Container(
            padding: const EdgeInsets.symmetric(vertical: 14),
            decoration: BoxDecoration(
              color: const Color(0xFF0C0C26),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _buildMetricCol('12', 'Turnamen'),
                Container(width: 1, height: 28, color: Colors.white.withValues(alpha: 0.08)),
                _buildMetricCol('85%', 'Win Rate'),
                Container(width: 1, height: 28, color: Colors.white.withValues(alpha: 0.08)),
                _buildMetricCol('4', 'Relasi'),
              ],
            ),
          ),
          const SizedBox(height: 28),

          // 4. Divisi & Peran Utama
          Text(
            'Divisi Kompetisi',
            style: GoogleFonts.plusJakartaSans(
              color: Colors.white,
              fontSize: 15,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 10),
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: const Color(0xFF0C0C26),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
            ),
            child: Row(
              children: [
                const Icon(Icons.sports_esports_rounded, color: Color(0xFFFF1752), size: 24),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        ExplorationMockData.game,
                        style: GoogleFonts.plusJakartaSans(
                          color: Colors.white,
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      Text(
                        ExplorationMockData.role,
                        style: GoogleFonts.plusJakartaSans(
                          color: Colors.white54,
                          fontSize: 11,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // 5. Jejaring Tim Aktif
          Text(
            'Tim Terdaftar',
            style: GoogleFonts.plusJakartaSans(
              color: Colors.white,
              fontSize: 15,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 10),
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: const Color(0xFF0C0C26),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
            ),
            child: Row(
              children: [
                Container(
                  width: 38,
                  height: 38,
                  decoration: const BoxDecoration(
                    color: Color(0xFF0052FF),
                    shape: BoxShape.circle,
                  ),
                  child: Center(
                    child: Text(
                      'PT',
                      style: GoogleFonts.barlowCondensed(
                        color: Colors.white,
                        fontWeight: FontWeight.w800,
                        fontSize: 14,
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
                        'Padang Thunder Esports',
                        style: GoogleFonts.plusJakartaSans(
                          color: Colors.white,
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      Text(
                        'Divisi Mobile Legends • Sejak 2025',
                        style: GoogleFonts.plusJakartaSans(
                          color: Colors.white54,
                          fontSize: 11,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMetricCol(String value, String label) {
    return Column(
      children: [
        Text(
          value,
          style: GoogleFonts.barlowCondensed(
            fontSize: 22,
            fontWeight: FontWeight.w900,
            color: Colors.white,
          ),
        ),
        Text(
          label,
          style: GoogleFonts.plusJakartaSans(
            fontSize: 11,
            color: Colors.white.withValues(alpha: 0.5),
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }

  // ==========================================
  // KOMPONEN PEMBANTU (HELPERS)
  // ==========================================

  /// Lencana Terverifikasi Emas Mandiri (Perisai Emas Resmi)
  Widget _buildVerifiedGoldBadge() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: const Color(0xFFD4AF37).withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(6),
        border: Border.all(color: const Color(0xFFD4AF37), width: 0.8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.verified_rounded, color: Color(0xFFD4AF37), size: 12),
          const SizedBox(width: 4),
          Text(
            ExplorationMockData.badgeNo,
            style: GoogleFonts.barlowCondensed(
              color: const Color(0xFFD4AF37),
              fontSize: 11,
              fontWeight: FontWeight.w800,
              letterSpacing: 0.5,
            ),
          ),
        ],
      ),
    );
  }

  /// Placeholder Foto Atlet yang Dirancang (Bukan Inisial Huruf dalam Glow)
  Widget _buildAthletePhotoContainer({bool isFullBleed = false}) {
    return Stack(
      alignment: Alignment.center,
      children: [
        // Latar Gelap Halus dengan Tonal Navy
        Container(
          color: const Color(0xFF101222),
        ),
        // Pola Siluet Geometri Mark V-S
        Opacity(
          opacity: 0.15,
          child: Image.asset(
            'assets/images/logo-mark-white.png',
            width: isFullBleed ? 160 : 70,
            height: isFullBleed ? 160 : 70,
            errorBuilder: (_, __, ___) => const Icon(Icons.person, color: Colors.white24, size: 48),
          ),
        ),
        // Siluet Atlet Profesional / Placeholder
        Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.person_rounded,
              color: Colors.white.withValues(alpha: 0.55),
              size: isFullBleed ? 72 : 44,
            ),
            const SizedBox(height: 4),
            Text(
              'FOTO ATLET',
              style: GoogleFonts.barlowCondensed(
                color: Colors.white.withValues(alpha: 0.4),
                fontSize: 10,
                fontWeight: FontWeight.w700,
                letterSpacing: 1.0,
              ),
            ),
          ],
        ),
      ],
    );
  }

  /// Bilah Navigasi Bawah Tenang (Calm Tab Bar)
  Widget _buildCalmTabBar() {
    return Container(
      height: 60,
      padding: const EdgeInsets.symmetric(horizontal: 20),
      decoration: BoxDecoration(
        color: const Color(0xFF05051A),
        border: Border(
          top: BorderSide(
            color: Colors.white.withValues(alpha: 0.08),
            width: 1,
          ),
        ),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildTabItem(Icons.home_filled, 'Beranda', _currentScreen == KeyScreen.home),
          _buildTabItem(Icons.explore_outlined, 'Jelajah', false),
          _buildTabItem(Icons.credit_card_rounded, 'Kartu', _currentScreen == KeyScreen.card),
          _buildTabItem(Icons.hub_outlined, 'Ekosistem', false),
          _buildTabItem(Icons.person_outline_rounded, 'Saya', _currentScreen == KeyScreen.profile),
        ],
      ),
    );
  }

  Widget _buildTabItem(IconData icon, String label, bool isActive) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Icon(
          icon,
          color: isActive ? const Color(0xFFFF1752) : Colors.white38,
          size: 20,
        ),
        const SizedBox(height: 3),
        Text(
          label,
          style: GoogleFonts.plusJakartaSans(
            color: isActive ? Colors.white : Colors.white38,
            fontSize: 10,
            fontWeight: isActive ? FontWeight.w700 : FontWeight.w500,
          ),
        ),
      ],
    );
  }
}
