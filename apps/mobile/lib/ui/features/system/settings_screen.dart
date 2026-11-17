import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/tokens.dart';
import '../../../core/theme/effect_engine.dart';
import '../../../core/services/auth_service.dart';
import '../../components/glass_header.dart';
import '../../components/glass_card.dart';
import '../../components/glass_button.dart';
import '../../components/glass_dialog.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool _isDeleting = false;

  Future<void> _handleDeleteAccount() async {
    final confirmed = await GlassDialog.show(
      context,
      title: 'Hapus Akun Mandiri',
      message:
          'Apakah Anda yakin ingin menghapus akun Anda secara permanen? Seluruh profil, kartu digital, dan relasi ekosistem akan dihapus seketika dan tidak dapat dipulihkan.',
      confirmLabel: 'Ya, Hapus Akun',
      cancelLabel: 'Batal',
      isDestructive: true,
    );

    if (confirmed == true && mounted) {
      setState(() => _isDeleting = true);
      final success = await AuthService.instance.deleteAccount(
        reason: 'Penghapusan akun mandiri atas inisiatif pengguna via aplikasi mobile',
      );

      if (mounted) {
        setState(() => _isDeleting = false);
        if (success) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Akun Anda telah berhasil dihapus secara permanen.')),
          );
          Navigator.of(context).popUntil((route) => route.isFirst);
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Gagal menghapus akun. Silakan coba kembali.')),
          );
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: EffectEngine.instance,
      builder: (context, _) {
        final currentTier = EffectEngine.instance.currentTier;

        return Scaffold(
          backgroundColor: EsportColors.background,
          appBar: const GlassHeader(
            title: 'PENGATURAN',
            subtitle: 'Preferensi tampilan, performa & akun',
            showBackButton: true,
          ),
          body: SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // 1. Bagian Efek Visual & Performa
                _buildSectionTitle('EFEK VISUAL & PERFORMA'),
                GlassCard(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Tingkat Efek Visual',
                            style: GoogleFonts.rajdhani(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                              color: EsportColors.gold.withValues(alpha: 0.15),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(
                              currentTier.name.toUpperCase(),
                              style: const TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                                color: EsportColors.gold,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Pilih Mode Hemat jika perangkat Anda terasa hangat atau mengalami penurunan frame rate.',
                        style: GoogleFonts.inter(
                          fontSize: 12,
                          color: EsportColors.textSecondary,
                        ),
                      ),
                      const SizedBox(height: 14),
                      Row(
                        children: [
                          _buildTierOption('Penuh', EffectTier.full, currentTier),
                          const SizedBox(width: 8),
                          _buildTierOption('Standar', EffectTier.standard, currentTier),
                          const SizedBox(width: 8),
                          _buildTierOption('Hemat', EffectTier.powerSaver, currentTier),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),

                // 2. Legal & Informasi Toko
                _buildSectionTitle('LEGAL & KEBIJAKAN PRIVASI'),
                GlassCard(
                  padding: EdgeInsets.zero,
                  child: Column(
                    children: [
                      _buildListTile(
                        icon: Icons.privacy_tip_outlined,
                        title: 'Kebijakan Privasi',
                        subtitle: 'Pelindungan data atlet & transparansi izin',
                        onTap: () {},
                      ),
                      const Divider(height: 1, color: EsportColors.borderSubtle),
                      _buildListTile(
                        icon: Icons.gavel_outlined,
                        title: 'Ketentuan Layanan',
                        subtitle: 'Standar etika & tata tertib ekosistem',
                        onTap: () {},
                      ),
                      const Divider(height: 1, color: EsportColors.borderSubtle),
                      _buildListTile(
                        icon: Icons.info_outline_rounded,
                        title: 'Versi Aplikasi',
                        subtitle: 'ESPORT SUMBAR V3 Mobile (Build 1.0.0+1)',
                        onTap: () {},
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),

                // 3. Keamanan Akun & Kepatuhan Apple/Google
                _buildSectionTitle('KEAMANAN & KEPATUHAN AKUN'),
                GlassCard(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Hapus Akun Pengguna',
                        style: GoogleFonts.rajdhani(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: EsportColors.error,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        'Sesuai pedoman App Store dan Google Play, Anda memiliki hak penuh untuk menghapus data akun beserta identitas kartu digital kapan saja.',
                        style: GoogleFonts.inter(
                          fontSize: 12,
                          color: EsportColors.textSecondary,
                        ),
                      ),
                      const SizedBox(height: 16),
                      GlassButton(
                        label: _isDeleting ? 'Menghapus Akun...' : 'Hapus Akun Secara Mandiri',
                        variant: GlassButtonVariant.danger,
                        isLoading: _isDeleting,
                        onPressed: _isDeleting ? null : _handleDeleteAccount,
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 30),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.only(left: 4, bottom: 8),
      child: Text(
        title,
        style: GoogleFonts.rajdhani(
          fontSize: 13,
          fontWeight: FontWeight.bold,
          letterSpacing: 1.0,
          color: EsportColors.gold,
        ),
      ),
    );
  }

  Widget _buildTierOption(String label, EffectTier tier, EffectTier currentTier) {
    final isSelected = tier == currentTier;
    return Expanded(
      child: GestureDetector(
        onTap: () => EffectEngine.instance.setTier(tier),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 10),
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: isSelected ? EsportColors.gold : Colors.white.withValues(alpha: 0.05),
            borderRadius: BorderRadius.circular(8),
            border: Border.all(
              color: isSelected ? EsportColors.gold : EsportColors.borderSubtle,
            ),
          ),
          child: Text(
            label,
            style: GoogleFonts.rajdhani(
              fontSize: 13,
              fontWeight: FontWeight.bold,
              color: isSelected ? Colors.black : Colors.white,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildListTile({
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return ListTile(
      leading: Icon(icon, color: EsportColors.gold, size: 22),
      title: Text(
        title,
        style: GoogleFonts.rajdhani(
          fontSize: 15,
          fontWeight: FontWeight.bold,
          color: Colors.white,
        ),
      ),
      subtitle: Text(
        subtitle,
        style: GoogleFonts.inter(
          fontSize: 11,
          color: EsportColors.textSecondary,
        ),
      ),
      trailing: const Icon(Icons.arrow_forward_ios_rounded, color: EsportColors.textMuted, size: 14),
      onTap: onTap,
    );
  }
}
