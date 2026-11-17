import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:esport_sumbar_mobile/core/theme/tokens.dart';
import 'package:esport_sumbar_mobile/core/theme/effect_engine.dart';
import 'package:esport_sumbar_mobile/ui/components/primitives/glass_surface.dart';
import 'package:esport_sumbar_mobile/ui/components/glass_button.dart';
import 'package:esport_sumbar_mobile/ui/components/status_badge.dart';
import 'package:esport_sumbar_mobile/ui/components/rarity_tag.dart';
import 'package:esport_sumbar_mobile/ui/components/glass_switch.dart';
import 'package:esport_sumbar_mobile/ui/components/app_avatar.dart';
import 'package:esport_sumbar_mobile/ui/components/list_row.dart';
import 'package:esport_sumbar_mobile/ui/components/glass_segmented.dart';
import 'package:esport_sumbar_mobile/ui/components/glass_tab_bar.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('Design System Native Tokens & Math', () {
    test('RadiusTokens.inner menghitung radius konsentris dengan benar', () {
      final innerRadius = RadiusTokens.inner(28.0, 8.0);
      expect(innerRadius, 20.0);

      // Batas minimum tidak boleh kurang dari 4.0
      final clampedRadius = RadiusTokens.inner(6.0, 8.0);
      expect(clampedRadius, 4.0);
    });

    test('EffectEngine beralih antar tingkat efek dan memancarkan notifikasi', () async {
      final engine = EffectEngine.instance;

      await engine.setTier(EffectTier.powerSaver, persist: false);
      expect(engine.currentTier, EffectTier.powerSaver);

      await engine.setTier(EffectTier.full, persist: false);
      expect(engine.currentTier, EffectTier.full);
    });
  });

  group('Design System Native Widget Components', () {
    testWidgets('GlassButton merender teks dan merespons tap', (WidgetTester tester) async {
      bool tapped = false;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: GlassButton(
              label: 'Klik Uji',
              onPressed: () => tapped = true,
            ),
          ),
        ),
      );

      expect(find.text('Klik Uji'), findsOneWidget);
      await tester.tap(find.text('Klik Uji'));
      await tester.pumpAndSettle();

      expect(tapped, isTrue);
    });

    testWidgets('StatusBadge merender status Terverifikasi dengan warna emas', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: StatusBadge(status: VerificationStatus.verified),
          ),
        ),
      );

      expect(find.text('TERVERIFIKASI'), findsOneWidget);
      expect(find.byIcon(Icons.verified_rounded), findsOneWidget);
    });

    testWidgets('RarityTag merender tier Master', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: RarityTag(tier: RarityTier.master),
          ),
        ),
      );

      expect(find.text('MASTER'), findsOneWidget);
    });

    testWidgets('GlassSurface merender dengan aman pada mode Hemat (tanpa blur)', (WidgetTester tester) async {
      await EffectEngine.instance.setTier(EffectTier.powerSaver, persist: false);

      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: GlassSurface(
              child: Text('Konten Kaca'),
            ),
          ),
        ),
      );

      expect(find.text('Konten Kaca'), findsOneWidget);
      // Di mode powerSaver, BackdropFilter tidak boleh ada untuk menghemat GPU
      expect(find.byType(BackdropFilter), findsNothing);
    });

    testWidgets('GlassSurface merender BackdropFilter pada mode Penuh', (WidgetTester tester) async {
      await EffectEngine.instance.setTier(EffectTier.full, persist: false);

      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: GlassSurface(
              child: Text('Konten Kaca Penuh'),
            ),
          ),
        ),
      );

      expect(find.text('Konten Kaca Penuh'), findsOneWidget);
      expect(find.byType(BackdropFilter), findsOneWidget);
    });

    testWidgets('GlassSwitch merespons perubahan nilai saat disentuh', (WidgetTester tester) async {
      bool currentVal = false;

      await tester.pumpWidget(
        StatefulBuilder(
          builder: (context, setState) {
            return MaterialApp(
              home: Scaffold(
                body: GlassSwitch(
                  value: currentVal,
                  onChanged: (newVal) {
                    setState(() => currentVal = newVal);
                  },
                ),
              ),
            );
          },
        ),
      );

      expect(currentVal, isFalse);
      await tester.tap(find.byType(GlassSwitch));
      await tester.pumpAndSettle();

      expect(currentVal, isTrue);
    });

    testWidgets('AppAvatar merender placeholder siluet berwibawa tanpa crash', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: AppAvatar(size: 48, isVerified: true),
          ),
        ),
      );

      expect(find.byType(AppAvatar), findsOneWidget);
      expect(find.byIcon(Icons.person_rounded), findsOneWidget);
      expect(find.byIcon(Icons.check), findsOneWidget);
    });

    testWidgets('ListRow merender informasi dua baris dan merespons tap', (WidgetTester tester) async {
      bool tapped = false;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: ListRow(
              title: 'Minang Viper',
              subtitle: 'Divisi MLBB • Kota Padang',
              onTap: () => tapped = true,
            ),
          ),
        ),
      );

      expect(find.text('Minang Viper'), findsOneWidget);
      expect(find.text('Divisi MLBB • Kota Padang'), findsOneWidget);

      await tester.tap(find.text('Minang Viper'));
      await tester.pumpAndSettle();

      expect(tapped, isTrue);
    });

    testWidgets('GlassSegmented beralih pilihan saat item diketuk', (WidgetTester tester) async {
      String selected = 'Harian';

      await tester.pumpWidget(
        StatefulBuilder(
          builder: (context, setState) {
            return MaterialApp(
              home: Scaffold(
                body: GlassSegmented<String>(
                  values: const ['Harian', 'Mingguan', 'Musim'],
                  labels: const ['Harian', 'Mingguan', 'Musim'],
                  selectedValue: selected,
                  onSelected: (val) => setState(() => selected = val),
                ),
              ),
            );
          },
        ),
      );

      expect(find.text('Mingguan'), findsOneWidget);
      await tester.tap(find.text('Mingguan'));
      await tester.pumpAndSettle();

      expect(selected, 'Mingguan');
    });

    testWidgets('GlassTabBar merender lima menu utama dengan tenang', (WidgetTester tester) async {
      int activeTab = 0;

      await tester.pumpWidget(
        StatefulBuilder(
          builder: (context, setState) {
            return MaterialApp(
              home: Scaffold(
                body: GlassTabBar(
                  currentIndex: activeTab,
                  onTabSelected: (idx) => setState(() => activeTab = idx),
                ),
              ),
            );
          },
        ),
      );

      expect(find.text('Beranda'), findsOneWidget);
      expect(find.text('Jelajah'), findsOneWidget);
      expect(find.text('KARTU'), findsOneWidget);
      expect(find.text('Ekosistem'), findsOneWidget);
      expect(find.text('Profil'), findsOneWidget);

      await tester.tap(find.text('Ekosistem'));
      await tester.pumpAndSettle();

      expect(activeTab, 3);
    });
  });
}
