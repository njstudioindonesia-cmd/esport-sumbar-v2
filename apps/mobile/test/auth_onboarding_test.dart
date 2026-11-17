import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:esport_sumbar_mobile/core/services/catalog_service.dart';
import 'package:esport_sumbar_mobile/data/repositories/profile_repository.dart';
import 'package:esport_sumbar_mobile/ui/features/onboarding/entity_selection_screen.dart';
import 'package:esport_sumbar_mobile/ui/features/wizard/wizard_screen.dart';
import 'package:esport_sumbar_mobile/ui/features/auth/onboarding_intro_screen.dart';

void main() {
  group('Catalog Service & Offline Fallback Tests', () {
    final catalogService = CatalogService();

    test('getGames harus mengembalikan daftar game kompetitif aktif', () async {
      final games = await catalogService.getGames();
      expect(games, isNotEmpty);

      final mlbb = games.firstWhere((g) => g.shortName == 'MLBB' || g.id == 'game-mlbb');
      expect(mlbb.name, contains('Mobile Legends'));
      expect(mlbb.genre, 'moba');
      expect(mlbb.roles, isNotEmpty);
    });

    test('getRegions harus mengembalikan 19 kota & kabupaten Sumatera Barat', () async {
      final regions = await catalogService.getRegions();
      expect(regions.length, 19);

      final padang = regions.firstWhere((r) => r.code == 'PDG');
      expect(padang.name, 'Kota Padang');
      expect(padang.type, 'kota');
    });
  });

  group('Profile Repository Draft Management Tests', () {
    final profileRepo = ProfileRepository();

    test('saveDraft, getDraft, dan clearDraft bekerja konsisten', () {
      const entityType = 'player';
      final draftData = {
        'displayName': 'Fauzan Minang',
        'ign': 'VIPER',
        'phone': '+6281234567890',
      };

      profileRepo.saveDraft(entityType, draftData);
      final retrieved = profileRepo.getDraft(entityType);

      expect(retrieved, isNotNull);
      expect(retrieved!['displayName'], 'Fauzan Minang');
      expect(retrieved['ign'], 'VIPER');

      profileRepo.clearDraft(entityType);
      final afterClear = profileRepo.getDraft(entityType);
      expect(afterClear, isNull);
    });
  });

  group('Auth & Onboarding Widget Tests', () {
    testWidgets('OnboardingIntroScreen merender pengantar dan tombol aksi', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: OnboardingIntroScreen(),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('ESPORT SUMBAR'), findsWidgets);
      expect(find.text('Daftar Akun Baru'), findsOneWidget);
      expect(find.text('Sudah Punya Akun? Masuk'), findsOneWidget);
      expect(find.text('Mode Tamu'), findsOneWidget);
    });

    testWidgets('EntitySelectionScreen merender 7 pilihan bidang ekosistem', (tester) async {
      tester.view.physicalSize = const Size(1080, 2400);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      await tester.pumpWidget(
        const MaterialApp(
          home: EntitySelectionScreen(),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('PILIH BIDANG EKOSISTEM'), findsOneWidget);
      expect(find.text('Player & Atlet'), findsOneWidget);
      expect(find.text('Pelatih & Analis'), findsOneWidget);
      expect(find.text('Tim & Klub Esport'), findsOneWidget);
      expect(find.text('Komunitas & Fans'), findsOneWidget);
      expect(find.text('Arena & Venue Esport'), findsOneWidget);
      expect(find.text('Akademi & Kampus'), findsOneWidget);
      expect(find.text('Sekolah & Pelajar'), findsOneWidget);
    });

    testWidgets('WizardScreen merender pratinjau kartu hidup dan tahapan formulir', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: WizardScreen(
            entityType: 'player',
            entityTitle: 'Player & Atlet',
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('FORMULIR PLAYER & ATLET'), findsOneWidget);
      expect(find.text('ROOKIE'), findsOneWidget);
      expect(find.text('Identitas Pribadi & Kompetitif'), findsOneWidget);
      expect(find.text('Lanjutkan'), findsOneWidget);
    });
  });
}
