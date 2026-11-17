import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:esport_sumbar_mobile/core/navigation/navigation_service.dart';
import 'package:esport_sumbar_mobile/ui/features/shell/main_navigation_shell.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('Navigation & Deep Linking Unit Tests', () {
    test('switchTab memperbarui currentTabNotifier', () {
      final nav = NavigationService.instance;

      nav.switchTab(1);
      expect(nav.currentTabNotifier.value, 1);

      nav.switchTab(3);
      expect(nav.currentTabNotifier.value, 3);

      nav.switchTab(0);
      expect(nav.currentTabNotifier.value, 0);
    });

    test('handleUri merespons skema kustom esportsumbar://', () {
      final nav = NavigationService.instance;

      nav.handleUri(Uri.parse('esportsumbar://explore'));
      expect(nav.currentTabNotifier.value, 1);

      nav.handleUri(Uri.parse('esportsumbar://card'));
      expect(nav.currentTabNotifier.value, 2);

      nav.handleUri(Uri.parse('esportsumbar://ecosystem'));
      expect(nav.currentTabNotifier.value, 3);

      nav.handleUri(Uri.parse('esportsumbar://profile'));
      expect(nav.currentTabNotifier.value, 4);

      nav.handleUri(Uri.parse('esportsumbar://home'));
      expect(nav.currentTabNotifier.value, 0);
    });

    test('handleUri merespons Universal Link https://esportsumbar.com/app/*', () {
      final nav = NavigationService.instance;

      nav.handleUri(Uri.parse('https://esportsumbar.com/app/explore'));
      expect(nav.currentTabNotifier.value, 1);

      nav.handleUri(Uri.parse('https://esportsumbar.com/app/ecosystem'));
      expect(nav.currentTabNotifier.value, 3);
    });

    test('handleUri menolak domain dan skema tak dikenal secara aman', () {
      final nav = NavigationService.instance;
      nav.switchTab(0);

      // Skema asing atau domain berbahaya
      nav.handleUri(Uri.parse('https://phishing-site.com/app/explore'));
      expect(nav.currentTabNotifier.value, 0); // Tetap di tab 0

      nav.handleUri(Uri.parse('customevil://profile'));
      expect(nav.currentTabNotifier.value, 0);
    });
  });

  group('MainNavigationShell Widget Tests', () {
    testWidgets('MainNavigationShell merender tab bar kaca dan tab default', (WidgetTester tester) async {
      NavigationService.instance.switchTab(0);

      await tester.pumpWidget(
        const MaterialApp(
          home: MainNavigationShell(),
        ),
      );

      // Tab bar kaca melayang harus ditemukan
      expect(find.text('Beranda'), findsWidgets);
      expect(find.text('Jelajah'), findsOneWidget);
      expect(find.text('KARTU'), findsOneWidget);
      expect(find.text('Ekosistem'), findsOneWidget);
      expect(find.text('Profil'), findsOneWidget);
    });
  });
}
