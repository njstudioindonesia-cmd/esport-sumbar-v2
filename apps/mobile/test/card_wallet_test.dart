import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:esport_sumbar_mobile/data/models/profile_model.dart';
import 'package:esport_sumbar_mobile/ui/features/card/card_wallet_screen.dart';
import 'package:esport_sumbar_mobile/ui/features/card/widgets/esport_card_3d.dart';
import 'package:esport_sumbar_mobile/ui/features/card/widgets/card_legend_sheet.dart';
import 'package:esport_sumbar_mobile/ui/features/card/widgets/card_export_dialog.dart';

void main() {
  ProfileModel createDummyProfile({
    String entityType = 'player',
    String rarityTier = 'MASTER',
    bool isVerified = true,
  }) {
    return ProfileModel(
      id: '00000000-0000-0000-0000-000000000001',
      accountId: '00000000-0000-0000-0000-000000000001',
      entityType: entityType,
      esportId: 'ESP-SB-PDG-2026',
      slug: 'rizky-phoenix-kurnia',
      displayName: 'Rizky Kurnia',
      ign: 'PHOENIX',
      regionId: 'reg-pdg',
      regionName: 'Kota Padang',
      regionCode: 'PDG',
      mainGameName: 'Mobile Legends: Bang Bang',
      roleName: 'Gold Lane',
      rarityTier: rarityTier,
      completenessScore: 100,
      verificationStatus: isVerified ? 'verified' : 'unverified',
      verifiedBadgeNo: isVerified ? 'ESP-SB-VER-001' : null,
      createdAt: DateTime.now(),
    );
  }

  group('Bagian 6: Pengalaman Kartu & Dompet Digital Tests', () {
    testWidgets('EsportCard3D merender sisi depan dengan identitas dan lencana terpisah', (tester) async {
      final profile = createDummyProfile();

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: Center(
              child: EsportCard3D(profile: profile),
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();

      // Brand & Entity
      expect(find.text('ESPORT SUMBAR'), findsOneWidget);
      expect(find.text('PLAYER & ATLET'), findsOneWidget);

      // Identity
      expect(find.text('PHOENIX'), findsOneWidget);
      expect(find.text('Rizky Kurnia'), findsOneWidget);
      expect(find.text('Mobile Legends: Bang Bang'), findsOneWidget);
      expect(find.text('Kota Padang'), findsOneWidget);

      // Lencana terpisah
      expect(find.text('ESP-SB-VER-001'), findsOneWidget);
      expect(find.byIcon(Icons.verified_rounded), findsOneWidget);
    });

    testWidgets('EsportCard3D berotasi flip saat diketuk dan menampilkan QR Code', (tester) async {
      final profile = createDummyProfile();

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: Center(
              child: EsportCard3D(profile: profile),
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();

      // Ketuk kartu untuk membalik
      await tester.tap(find.byType(EsportCard3D));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 700));

      // Sisi belakang: QR Code dan ESPORT ID
      expect(find.text('PASPOR DIGITAL SUMBAR'), findsOneWidget);
      expect(find.text('ESP-SB-PDG-2026'), findsOneWidget);
      expect(find.byType(QrImageView), findsOneWidget);
    });

    testWidgets('EsportCard3D merender 7 templat bidang ekosistem secara konsisten', (tester) async {
      final entityTypes = ['player', 'coach', 'team', 'community', 'venue', 'academy', 'school'];
      final expectedLabels = [
        'PLAYER & ATLET',
        'PELATIH & ANALIS',
        'TIM & KLUB ESPORT',
        'KOMUNITAS & FANS',
        'ARENA & VENUE',
        'AKADEMI & KAMPUS',
        'SEKOLAH & PELAJAR',
      ];

      for (int i = 0; i < entityTypes.length; i++) {
        final profile = createDummyProfile(entityType: entityTypes[i]);
        await tester.pumpWidget(
          MaterialApp(
            home: Scaffold(
              body: Center(
                child: EsportCard3D(profile: profile),
              ),
            ),
          ),
        );
        await tester.pumpAndSettle();

        expect(find.text(expectedLabels[i]), findsOneWidget);
      }
    });

    testWidgets('CardLegendSheet menampilkan edukasi perbedaan Frame Rarity vs Lencana Verifikasi', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: CardLegendSheet(),
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('LEGENDA & STANDAR KARTU DIGITAL'), findsOneWidget);
      expect(find.text('Lencana Verifikasi (Perisai Emas)'), findsOneWidget);
      expect(find.text('FRAME TIER (TINGKAT KELENGKAPAN & AKTIVITAS)'), findsOneWidget);
      expect(find.text('MASTER'), findsOneWidget);
      expect(find.text('CHALLENGER'), findsOneWidget);
      expect(find.text('CONTENDER'), findsOneWidget);
      expect(find.text('ROOKIE'), findsOneWidget);
    });

    testWidgets('CardExportDialog mendukung format Story 9:16 dan Feed 1:1 dengan watermark murni', (tester) async {
      final profile = createDummyProfile();

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: CardExportDialog(profile: profile),
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('BAGIKAN & EKSPOR KARTU'), findsOneWidget);
      expect(find.text('Story / Status'), findsOneWidget);
      expect(find.text('Feed / Postingan'), findsOneWidget);
      expect(find.text('Simpan ke Galeri'), findsOneWidget);
      expect(find.text('Bagikan Langsung'), findsOneWidget);

      // Pastikan watermark murni brand ESPORT SUMBAR
      expect(find.text('ESPORT SUMBAR'), findsAtLeastNWidgets(1));
    });

    testWidgets('CardWalletScreen merender dompet kartu, aksi bagikan, dan status verifikasi', (tester) async {
      tester.view.physicalSize = const Size(1080, 2400);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      await tester.pumpWidget(
        const MaterialApp(
          home: CardWalletScreen(),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('DOMPET KARTU ATLET'), findsOneWidget);
      expect(find.text('IDENTITAS TERVERIFIKASI'), findsOneWidget);
      expect(find.text('Bagikan Kartu'), findsOneWidget);
      expect(find.text('Simpan ke Galeri'), findsOneWidget);
      expect(find.text('Legenda'), findsOneWidget);
    });
  });
}
