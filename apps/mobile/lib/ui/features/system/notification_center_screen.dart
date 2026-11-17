import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/tokens.dart';
import '../../components/glass_header.dart';
import '../../components/glass_card.dart';
import '../../components/empty_state.dart';

class NotificationCenterScreen extends StatefulWidget {
  const NotificationCenterScreen({super.key});

  @override
  State<NotificationCenterScreen> createState() => _NotificationCenterScreenState();
}

class _NotificationCenterScreenState extends State<NotificationCenterScreen> {
  final List<_NotificationItem> _notifications = [
    _NotificationItem(
      id: '1',
      title: 'Verifikasi Profil Disetujui',
      body: 'Selamat! Lencana verifikasi Anda kini telah aktif pada Kartu Digital.',
      time: '10 menit lalu',
      isRead: false,
      type: Icons.verified_rounded,
      color: EsportColors.gold,
    ),
    _NotificationItem(
      id: '2',
      title: 'Permintaan Relasi Tim',
      body: 'Padang Thunder Esports mengajukan hubungan divisi Mobile Legends dengan Anda.',
      time: '2 jam lalu',
      isRead: false,
      type: Icons.hub_rounded,
      color: EsportColors.brandPink,
    ),
    _NotificationItem(
      id: '3',
      title: 'Pembaruan Ekosistem V3',
      body: 'Sistem direktori dan kartu atlet telah diperbarui ke standar V3.',
      time: '1 hari lalu',
      isRead: true,
      type: Icons.system_update_rounded,
      color: EsportColors.textSecondary,
    ),
  ];

  void _markAllAsRead() {
    setState(() {
      for (var n in _notifications) {
        n.isRead = true;
      }
    });
    HapticTokens.lightImpact();
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Semua notifikasi telah ditandai dibaca.')),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: EsportColors.background,
      appBar: GlassHeader(
        title: 'PUSAT NOTIFIKASI',
        subtitle: 'Pemberitahuan ekosistem & status akun',
        showBackButton: true,
        actions: [
          TextButton(
            onPressed: _notifications.any((n) => !n.isRead) ? _markAllAsRead : null,
            child: Text(
              'Tandai Dibaca',
              style: GoogleFonts.rajdhani(
                fontWeight: FontWeight.bold,
                color: _notifications.any((n) => !n.isRead) ? EsportColors.gold : EsportColors.textMuted,
              ),
            ),
          ),
        ],
      ),
      body: _notifications.isEmpty
          ? const EmptyState(
              icon: Icons.notifications_none_rounded,
              title: 'Tidak Ada Notifikasi',
              description: 'Anda sudah membaca semua kabar terbaru dari ekosistem.',
            )
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _notifications.length,
              itemBuilder: (context, index) {
                final item = _notifications[index];
                return Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: GlassCard(
                    onTap: () {
                      setState(() => item.isRead = true);
                    },
                    padding: const EdgeInsets.all(14),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: item.color.withValues(alpha: 0.15),
                            shape: BoxShape.circle,
                            border: Border.all(color: item.color.withValues(alpha: 0.3)),
                          ),
                          child: Icon(item.type, size: 20, color: item.color),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Expanded(
                                    child: Text(
                                      item.title,
                                      style: GoogleFonts.rajdhani(
                                        fontSize: 15,
                                        fontWeight: FontWeight.bold,
                                        color: Colors.white,
                                      ),
                                    ),
                                  ),
                                  if (!item.isRead)
                                    Container(
                                      width: 8,
                                      height: 8,
                                      decoration: const BoxDecoration(
                                        color: EsportColors.brandPink,
                                        shape: BoxShape.circle,
                                      ),
                                    ),
                                ],
                              ),
                              const SizedBox(height: 4),
                              Text(
                                item.body,
                                style: GoogleFonts.inter(
                                  fontSize: 12,
                                  height: 1.4,
                                  color: EsportColors.textSecondary,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                item.time,
                                style: GoogleFonts.inter(
                                  fontSize: 10,
                                  color: EsportColors.textMuted,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
    );
  }
}

class _NotificationItem {
  final String id;
  final String title;
  final String body;
  final String time;
  bool isRead;
  final IconData type;
  final Color color;

  _NotificationItem({
    required this.id,
    required this.title,
    required this.body,
    required this.time,
    required this.isRead,
    required this.type,
    required this.color,
  });
}
