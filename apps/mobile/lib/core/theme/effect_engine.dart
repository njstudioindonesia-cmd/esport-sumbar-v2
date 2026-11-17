import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

enum EffectTier {
  full,       // Penuh: Blur tinggi, pantulan specular gyro, scene ambient gerak lambat
  standard,   // Standar: Blur sedang + rim statis, scene ambient statis
  powerSaver, // Hemat: 0 blur, permukaan solid translusen, sensor & animasi ambient dimatikan
}

class EffectEngine extends ChangeNotifier {
  EffectEngine._();
  static final EffectEngine instance = EffectEngine._();

  static const String _prefKey = 'user_effect_tier_preference';

  EffectTier _currentTier = EffectTier.full;
  EffectTier get currentTier => _currentTier;

  bool _isAutoDetected = true;
  bool get isAutoDetected => _isAutoDetected;

  int _consecutiveJankFrames = 0;

  // Inisialisasi engine & muat preferensi lokal
  Future<void> initialize() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final savedTier = prefs.getString(_prefKey);

      if (savedTier != null) {
        _isAutoDetected = false;
        _currentTier = EffectTier.values.firstWhere(
          (e) => e.name == savedTier,
          orElse: () => EffectTier.standard,
        );
      } else {
        _autoDetectTier();
      }
    } catch (_) {
      _autoDetectTier();
    }
    notifyListeners();
  }

  void _autoDetectTier() {
    _isAutoDetected = true;
    if (kIsWeb) {
      _currentTier = EffectTier.standard;
      return;
    }

    // Default aman untuk mobile: Standar (hemat baterai & stabil 60 FPS)
    _currentTier = EffectTier.full;
  }

  // Pengaturan manual oleh pengguna di layar Pengaturan / Galeri
  Future<void> setTier(EffectTier tier, {bool persist = true}) async {
    _currentTier = tier;
    _isAutoDetected = false;
    notifyListeners();

    if (persist) {
      try {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString(_prefKey, tier.name);
      } catch (_) {}
    }
  }

  // Reset ke deteksi otomatis
  Future<void> resetToAuto() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(_prefKey);
    } catch (_) {}
    _autoDetectTier();
    notifyListeners();
  }

  // Pemantau Frame Rate: Turunkan tier otomatis jika jank terdeteksi berulang
  void reportFrameMetrics(double frameDurationMs) {
    if (_currentTier == EffectTier.powerSaver || !_isAutoDetected) return;

    // Jika frame melebihi 33.3ms (di bawah 30 FPS)
    if (frameDurationMs > 33.3) {
      _consecutiveJankFrames++;
      if (_consecutiveJankFrames >= 10) {
        // Turunkan tier untuk menyelamatkan performa
        if (_currentTier == EffectTier.full) {
          _currentTier = EffectTier.standard;
          debugPrint('[EffectEngine] Jank terdeteksi, menurunkan tier ke Standar');
        } else if (_currentTier == EffectTier.standard) {
          _currentTier = EffectTier.powerSaver;
          debugPrint('[EffectEngine] Jank berulang, menurunkan tier ke Hemat');
        }
        _consecutiveJankFrames = 0;
        notifyListeners();
      }
    } else {
      if (_consecutiveJankFrames > 0) _consecutiveJankFrames--;
    }
  }
}
