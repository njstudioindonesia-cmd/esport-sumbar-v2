import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/constants/colors.dart';
import '../../../core/network/api_client.dart';
import '../../../core/services/supabase_service.dart';

class ConnectionTestScreen extends StatefulWidget {
  const ConnectionTestScreen({super.key});

  @override
  State<ConnectionTestScreen> createState() => _ConnectionTestScreenState();
}

class _ConnectionTestScreenState extends State<ConnectionTestScreen> {
  bool _isLoading = false;
  String _supabaseStatus = 'Menunggu uji...';
  String _versionStatus = 'Menunggu uji...';
  String _healthStatus = 'Menunggu uji...';
  String _realtimeStatus = 'Menunggu uji...';

  @override
  void initState() {
    super.initState();
    _runDiagnostics();
  }

  Future<void> _runDiagnostics() async {
    setState(() {
      _isLoading = true;
      _supabaseStatus = 'Memeriksa koneksi...';
      _versionStatus = 'Memeriksa versi...';
      _healthStatus = 'Memeriksa kesehatan...';
      _realtimeStatus = 'Menguji WebSocket...';
    });

    final stopwatch = Stopwatch()..start();

    // 1. Cek Supabase Auth & DB
    try {
      final client = SupabaseService.client;
      await client.from('games').select('id').limit(1);
      final latency = stopwatch.elapsedMilliseconds;
      setState(() {
        _supabaseStatus = 'TERHUBUNG (Latency: ${latency}ms)';
      });
    } catch (e) {
      setState(() {
        _supabaseStatus = 'GAGAL: ${e.toString()}';
      });
    }

    // 2. Cek Realtime
    try {
      final channel = SupabaseService.client.channel('public:diag_probe');
      channel.subscribe((status, [error]) {
        if (mounted) {
          setState(() {
            _realtimeStatus = 'TERHUBUNG ($status)';
          });
        }
      });
    } catch (e) {
      setState(() {
        _realtimeStatus = 'REALTIME ERROR: $e';
      });
    }

    // 3. Cek BFF Version Probe
    try {
      final versionRes = await ApiClient.instance.getSystemVersion();
      setState(() {
        if (versionRes['success'] == true) {
          final data = versionRes['data'];
          _versionStatus = 'VALID (Min: ${data['minVersion']}, ForceUpdate: ${data['forceUpdate']})';
        } else {
          _versionStatus = 'OFFLINE / STANDALONE';
        }
      });
    } catch (e) {
      setState(() {
        _versionStatus = 'ERROR: $e';
      });
    }

    // 4. Cek BFF Health Probe
    try {
      final healthRes = await ApiClient.instance.getSystemHealth();
      setState(() {
        if (healthRes['success'] == true) {
          _healthStatus = 'LAYANAN NORMAL (Status: ${healthRes['data']['status']})';
        } else {
          _healthStatus = 'OFFLINE / STANDALONE';
        }
      });
    } catch (e) {
      setState(() {
        _healthStatus = 'ERROR: $e';
      });
    }

    setState(() {
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: EsportColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Text(
          'DIAGNOSTIK KONEKSI & API V3',
          style: GoogleFonts.rajdhani(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            letterSpacing: 1.2,
            color: Colors.white,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: EsportColors.gold),
            onPressed: _isLoading ? null : _runDiagnostics,
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Banner Status Header
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: EsportColors.surface.withAlpha(200),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: EsportColors.gold.withAlpha(60),
                ),
              ),
              child: Row(
                children: [
                  Icon(
                    _isLoading ? Icons.hourglass_top : Icons.verified,
                    color: EsportColors.gold,
                    size: 32,
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Pemeriksaan Fondasi API Mobile V3',
                          style: GoogleFonts.rajdhani(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'BFF Endpoint: ${ApiClient.baseUrl}',
                          style: GoogleFonts.inter(
                            fontSize: 12,
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

            // Item 1: Supabase Database & Auth
            _buildStatusCard(
              title: '1. Supabase PostgreSQL & Auth',
              status: _supabaseStatus,
              isSuccess: _supabaseStatus.contains('TERHUBUNG'),
              icon: Icons.storage_rounded,
            ),
            const SizedBox(height: 12),

            // Item 2: Supabase Realtime WebSocket
            _buildStatusCard(
              title: '2. Realtime WebSocket Stream',
              status: _realtimeStatus,
              isSuccess: _realtimeStatus.contains('TERHUBUNG') || _realtimeStatus.contains('SUBSCRIBED'),
              icon: Icons.wifi_tethering_rounded,
            ),
            const SizedBox(height: 12),

            // Item 3: BFF Minimum Version Probe
            _buildStatusCard(
              title: '3. BFF /api/v1/system/version',
              status: _versionStatus,
              isSuccess: _versionStatus.contains('VALID') || _versionStatus.contains('STANDALONE'),
              icon: Icons.system_update_alt_rounded,
            ),
            const SizedBox(height: 12),

            // Item 4: BFF Service Health Probe
            _buildStatusCard(
              title: '4. BFF /api/v1/system/health',
              status: _healthStatus,
              isSuccess: _healthStatus.contains('NORMAL') || _healthStatus.contains('STANDALONE'),
              icon: Icons.health_and_safety_rounded,
            ),
            const SizedBox(height: 24),

            // Tombol Aksi
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: EsportColors.gold,
                  foregroundColor: Colors.black,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                onPressed: _isLoading ? null : _runDiagnostics,
                icon: _isLoading
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(strokeWidth: 2, color: Colors.black),
                      )
                    : const Icon(Icons.bolt),
                label: Text(
                  _isLoading ? 'Sedang Memeriksa...' : 'Uji Ulang Konektivitas',
                  style: GoogleFonts.rajdhani(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatusCard({
    required String title,
    required String status,
    required bool isSuccess,
    required IconData icon,
  }) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: EsportColors.surface.withAlpha(120),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isSuccess
              ? Colors.greenAccent.withAlpha(100)
              : EsportColors.gold.withAlpha(50),
        ),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(
            icon,
            color: isSuccess ? Colors.greenAccent : EsportColors.gold,
            size: 24,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: GoogleFonts.rajdhani(
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  status,
                  style: GoogleFonts.inter(
                    fontSize: 12,
                    color: isSuccess ? Colors.greenAccent : EsportColors.textSecondary,
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
