import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';

/// 1. SISTEM WARNA RESMI V3 (Sesuai docs/design/brief.md & globals.css)
class AppColors {
  AppColors._();

  // Netral & Tonal Permukaan (Dark Mode Murni)
  static const Color inkBase = Color(0xFF05051A);      // --ink-base / --bg-base
  static const Color surface1 = Color(0xFF0C0C26);     // --surface-1 (Kartu, Panel)
  static const Color surface2 = Color(0xFF14143A);     // --surface-2 (Input, Dialog)
  static const Color surface3 = Color(0xFF1D1D4A);     // --surface-3 (Elevasi interaktif)
  static const Color surfaceCard = surface1;

  // Garis Pemisah Halus (1px border)
  static const Color borderSubtle = Color(0x14FFFFFF); // rgba(255, 255, 255, 0.08)
  static const Color borderFocus = Color(0x33FFFFFF);  // rgba(255, 255, 255, 0.20)
  static const Color border = borderSubtle;

  // Hirarki Teks Monokrom Bersih
  static const Color textPrimary = Color(0xFFFFFFFF);  // 100% Putih
  static const Color textSecondary = Color(0xA6FFFFFF);// rgba(255, 255, 255, 0.65)
  static const Color textMuted = Color(0x66FFFFFF);    // rgba(255, 255, 255, 0.40)
  static const Color textTertiary = textMuted;         // Alias Netral Slate/Muted

  // Aksen Brand Tunggal (Pink dari Mark V-S Resmi)
  static const Color brandPink = Color(0xFFFF1752);    // #FF1752
  static const Color brandPinkSubtle = Color(0x1FFF1752); // rgba(255, 23, 82, 0.12)
  static const Color brandPinkPressed = Color(0xFFD90F43);
  static const Color brandPink400 = Color(0xFFFF4D77);
  static const Color brandPink600 = Color(0xFFD90F43);

  // Status Verifikasi & Frame Elite (Emas Sakral - Bukan Dekorasi Umum)
  static const Color verifiedGold = Color(0xFFD4AF37); // #D4AF37
  static const Color verifiedGoldSubtle = Color(0x1FD4AF37); // rgba(212, 175, 55, 0.12)
  static const Color gold = verifiedGold;
  static const Color goldLight = Color(0xFFFFE57F);
  static const Color goldDark = Color(0xFF996515);

  // Semantik Fungsional (Terpisah dari Brand Pink)
  static const Color success = Color(0xFF2BB673);      // Emerald Green
  static const Color warning = Color(0xFFF2A33A);      // Amber
  static const Color danger = Color(0xFFF04438);       // Crimson Red
  static const Color regional = success;
  static const Color pending = warning;
  static const Color error = danger;
  static const Color rejected = danger;
  static const Color suspended = Color(0xFF6B7280);

  // 4 Bahan Fisik Rarity (Sesuai packages/contracts: rookie, contender, elite, legend)
  static const Color tierRookie = Color(0xFFA3704C);       // Bronze Matte
  static const Color tierRookieBorder = Color(0xFF8C5E3C);
  static const Color tierContender = Color(0xFFCBD5E1);    // Satin Silver
  static const Color tierContenderBorder = Color(0xFF94A3B8);
  static const Color tierElite = verifiedGold;             // Brushed Gold
  static const Color tierEliteBorder = Color(0xFFB89628);
  static const Color tierLegend = Color(0xFFE0E7FF);       // Prismatic Crystal
  static const Color tierLegendBorder = Color(0xFFA5B4FC);
  static const Color tierMaster = tierElite;               // Alias kompatibilitas

  // Brand Auxiliaries
  static const Color brandNavy = Color(0xFF00004F);
  static const Color brandNavyDark = Color(0xFF000251);
  static const Color brandBlue = Color(0xFF0052FF);
  static const Color neonCyan = Color(0xFF06B6D4);

  // Alias Kompatibilitas Langsung (Direct Static Const Aliases)
  static const Color background = inkBase;
  static const Color surface = surface1;
  static const Color surfaceLight = surface2;
  static const Color verified = verifiedGold;
  static const Color brandPinkGlow = brandPinkSubtle;
  static const Color goldGlow = verifiedGoldSubtle;
}

/// Alias Kompatibilitas Mundur
typedef EsportColors = AppColors;

/// 2. SISTEM TIPOGRAFI MODULAR V3
class AppTypography {
  AppTypography._();

  // Display / IGN / Hero (Barlow Condensed - Athletic & Wibawa)
  static TextStyle displayHero({Color color = AppColors.textPrimary}) =>
      GoogleFonts.barlowCondensed(
        fontSize: 40,
        fontWeight: FontWeight.w900,
        color: color,
        height: 1.1,
        letterSpacing: 0.5,
      );

  static TextStyle displayName({Color color = AppColors.textPrimary}) =>
      GoogleFonts.barlowCondensed(
        fontSize: 28,
        fontWeight: FontWeight.w800,
        color: color,
        height: 1.15,
        letterSpacing: 0.5,
      );

  static TextStyle displayStat({Color color = AppColors.textPrimary}) =>
      GoogleFonts.barlowCondensed(
        fontSize: 32,
        fontWeight: FontWeight.w900,
        color: color,
        height: 1.0,
      );

  static TextStyle badgeText({Color color = AppColors.verifiedGold}) =>
      GoogleFonts.barlowCondensed(
        fontSize: 12,
        fontWeight: FontWeight.w800,
        color: color,
        letterSpacing: 0.8,
      );

  // UI Sans (Plus Jakarta Sans - Humanis, Jernih, Standar Indonesia Modern)
  static TextStyle titleLarge({Color color = AppColors.textPrimary}) =>
      GoogleFonts.plusJakartaSans(
        fontSize: 20,
        fontWeight: FontWeight.w700,
        color: color,
        height: 1.25,
      );

  static TextStyle titleMedium({Color color = AppColors.textPrimary}) =>
      GoogleFonts.plusJakartaSans(
        fontSize: 16,
        fontWeight: FontWeight.w600,
        color: color,
        height: 1.3,
      );

  static TextStyle bodyRegular({Color color = AppColors.textSecondary}) =>
      GoogleFonts.plusJakartaSans(
        fontSize: 14,
        fontWeight: FontWeight.w400,
        color: color,
        height: 1.45,
      );

  static TextStyle bodyMedium({Color color = AppColors.textPrimary}) =>
      GoogleFonts.plusJakartaSans(
        fontSize: 14,
        fontWeight: FontWeight.w600,
        color: color,
        height: 1.45,
      );

  static TextStyle caption({Color color = AppColors.textMuted}) =>
      GoogleFonts.plusJakartaSans(
        fontSize: 12, // Batas minimum absolut
        fontWeight: FontWeight.w500,
        color: color,
        height: 1.35,
      );

  static TextStyle buttonLabel({Color color = AppColors.textPrimary}) =>
      GoogleFonts.plusJakartaSans(
        fontSize: 14,
        fontWeight: FontWeight.w700,
        color: color,
      );
}

/// 3. SISTEM SPASI GRID 4PT
class SpacingTokens {
  SpacingTokens._();

  static const double xxs = 4.0;
  static const double xs = 8.0;
  static const double sm = 12.0;
  static const double md = 16.0;
  static const double lg = 20.0;
  static const double xl = 24.0;
  static const double xxl = 32.0;
  static const double xxxl = 40.0;

  static const double screenMargin = 20.0;
  static const double sectionGap = 32.0;
  static const double bottomNavSafePadding = 110.0;
}

/// 4. TOKEN RADIUS KONSENTRIS
class RadiusTokens {
  RadiusTokens._();

  static const double xs = 6.0;
  static const double sm = 8.0;   // Kompatibilitas mundur
  static const double md = 12.0;  // Kontrol, Input, Chip
  static const double lg = 18.0;
  static const double xl = 24.0;
  static const double card = 20.0;// Kartu UI Standar, Kartu 3D
  static const double sheet = 28.0;// Bottom Sheet, Modal
  static const double pill = 9999.0;// Avatar, Pil Status
  static const double tcg = 20.0;
  static const double button = 14.0;
  static const double input = 12.0;
  static const double panel = 28.0;

  static double inner(double outer, double padding) {
    final calculated = outer - padding;
    return calculated > 4.0 ? calculated : 4.0;
  }
}

/// 5. TOKEN ELEVASI & BAYANGAN HALUS (Bukan Glow Neon)
class ElevationTokens {
  ElevationTokens._();

  static const List<BoxShadow> none = [];

  static final List<BoxShadow> subtle = [
    BoxShadow(
      color: Colors.black.withValues(alpha: 0.25),
      blurRadius: 8,
      offset: const Offset(0, 4),
    ),
  ];

  static final List<BoxShadow> card = [
    BoxShadow(
      color: Colors.black.withValues(alpha: 0.40),
      blurRadius: 20,
      offset: const Offset(0, 10),
    ),
  ];

  static final List<BoxShadow> modal = [
    BoxShadow(
      color: Colors.black.withValues(alpha: 0.55),
      blurRadius: 30,
      offset: const Offset(0, 15),
    ),
  ];
}

/// 6. TOKEN LIQUID GLASS TERBATAS (Hanya TabBar & Bottom Sheet)
class GlassTokens {
  GlassTokens._();

  static const double blurThin = 8.0;
  static const double blurRegular = 16.0;
  static const double blurThick = 24.0;
  static const double blurDefault = blurRegular;

  static const Color bgThin = Color(0x0DFFFFFF);    // rgba(255, 255, 255, 0.05)
  static const Color bgRegular = Color(0x14FFFFFF); // rgba(255, 255, 255, 0.08)
  static const Color bgThick = Color(0x1FFFFFFF);   // rgba(255, 255, 255, 0.12)
  static const Color tintPink = AppColors.brandPinkSubtle;

  // Scrim Penjamin Kontras Teks (WCAG AA rasio >= 4.5:1)
  static const Color scrim = Color(0xB305051A);     // rgba(5, 5, 26, 0.70)
  static const Color scrimHeavy = Color(0xE605051A);

  // Fallback Solid untuk Mode Hemat (Zero Blur)
  static const Color solidBackground = AppColors.surface1;
  static const Color solidSurface = AppColors.surface2;

  static const List<Color> rimColors = [
    Color(0x8CFFFFFF),
    Color(0x14FFFFFF),
    Color(0x05FFFFFF),
    Color(0x47FFFFFF),
  ];
  static const List<double> rimStops = [0.0, 0.3, 0.7, 1.0];
}

/// 7. TOKEN GERAK (MOTION)
class MotionTokens {
  MotionTokens._();

  static const Duration fast = Duration(milliseconds: 180);
  static const Duration base = Duration(milliseconds: 250);
  static const Duration regular = Duration(milliseconds: 250);
  static const Duration expressive = Duration(milliseconds: 350);
  static const Duration slow = Duration(milliseconds: 450);
  static const Duration instant = Duration(milliseconds: 50);
  static const Duration swift = fast;
  static const Duration cinematic = slow;

  static const Curve curveSnappy = Curves.easeOutCubic;
  static const Curve curveFluid = Curves.easeInOutCubic;
  static const Curve curveGentle = Curves.easeOutQuad;
}

/// 8. TOKEN HAPTIK SISTEM
class HapticTokens {
  HapticTokens._();

  static Future<void> selection() => HapticFeedback.selectionClick();
  static Future<void> selectionClick() => HapticFeedback.selectionClick();
  static Future<void> lightImpact() => HapticFeedback.lightImpact();
  static Future<void> mediumImpact() => HapticFeedback.mediumImpact();
  static Future<void> heavyImpact() => HapticFeedback.heavyImpact();
  static Future<void> vibrate() => HapticFeedback.vibrate();
  static Future<void> successNotification() => HapticFeedback.heavyImpact();
}
