import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/tokens.dart';
import '../../components/glass_header.dart';
import '../../components/glass_card.dart';
import '../../components/list_item_swipe.dart';
import '../../components/status_badge.dart';
import '../../components/glass_button.dart';

class EcosystemScreen extends StatefulWidget {
  const EcosystemScreen({super.key});

  @override
  State<EcosystemScreen> createState() => _EcosystemScreenState();
}

class _EcosystemScreenState extends State<EcosystemScreen> {
  final List<_EcosystemRequest> _requests = [
    _EcosystemRequest(
      id: 'req-1',
      senderName: 'Padang Thunder Esports',
      category: 'Tim & Klub',
      role: 'Divisi Mobile Legends (Rusher)',
      game: 'Mobile Legends: Bang Bang',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: EsportColors.background,
      appBar: const GlassHeader(
        title: 'JEJARING EKOSISTEM',
        subtitle: 'Kemitraan bilateral & divisi terdaftar',
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 100),
        children: [
          // Banner Status Ekosistem
          GlassCard(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: EsportColors.brandPink.withValues(alpha: 0.15),
                    shape: BoxShape.circle,
                    border: Border.all(color: EsportColors.brandPink.withValues(alpha: 0.3)),
                  ),
                  child: const Icon(Icons.hub_rounded, color: EsportColors.brandPink, size: 28),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Relasi Bilateral Mandiri',
                        style: GoogleFonts.rajdhani(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        'Hanya hubungan yang disetujui kedua belah pihak yang tampil di profil publik.',
                        style: GoogleFonts.inter(
                          fontSize: 11,
                          color: EsportColors.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Permintaan Menunggu Persetujuan
          Text(
            'PERMINTAAN RELASI MASUK (${_requests.length})',
            style: GoogleFonts.rajdhani(
              fontSize: 14,
              fontWeight: FontWeight.bold,
              letterSpacing: 1.0,
              color: EsportColors.gold,
            ),
          ),
          const SizedBox(height: 10),

          if (_requests.isEmpty)
            GlassCard(
              padding: const EdgeInsets.all(20),
              child: Center(
                child: Text(
                  'Tidak ada permintaan relasi baru.',
                  style: GoogleFonts.inter(color: EsportColors.textMuted),
                ),
              ),
            )
          else
            ..._requests.map(
              (req) => Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: ListItemSwipe(
                  onAccept: () {
                    setState(() => _requests.removeWhere((r) => r.id == req.id));
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Relasi dengan ${req.senderName} diterima.')),
                    );
                  },
                  onReject: () {
                    setState(() => _requests.removeWhere((r) => r.id == req.id));
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Permintaan relasi dari ${req.senderName} ditolak.')),
                    );
                  },
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            req.senderName,
                            style: GoogleFonts.rajdhani(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                          const StatusBadge(status: VerificationStatus.pending, compact: true),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '${req.category} • ${req.game}',
                        style: GoogleFonts.inter(fontSize: 12, color: EsportColors.gold),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        'Mengajukan: ${req.role}',
                        style: GoogleFonts.inter(fontSize: 12, color: EsportColors.textSecondary),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Geser kanan untuk terima • Geser kiri untuk tolak',
                        style: GoogleFonts.inter(fontSize: 10, color: EsportColors.textMuted),
                      ),
                    ],
                  ),
                ),
              ),
            ),

          const SizedBox(height: 20),

          // Tombol Ajukan Hubungan Baru
          GlassButton(
            label: 'Cari & Ajukan Hubungan Baru',
            variant: GlassButtonVariant.outline,
            icon: Icons.person_add_alt_1_rounded,
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Membuka pencarian target relasi...')),
              );
            },
          ),
        ],
      ),
    );
  }
}

class _EcosystemRequest {
  final String id;
  final String senderName;
  final String category;
  final String role;
  final String game;

  _EcosystemRequest({
    required this.id,
    required this.senderName,
    required this.category,
    required this.role,
    required this.game,
  });
}
